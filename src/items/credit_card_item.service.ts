import { HttpException, Injectable } from '@nestjs/common';
import { CreditCardService } from 'src/credit_card/credit_card.service';
import { FirebaseImplementation } from 'src/shared/providers/firebase/implementation';
import { CreateCreditCardItemDto } from './dto/create-credit-card-item.dto';
import { toggleJsonToDate } from 'src/shared/utils/date/datefunctions';
import {
  ICreditCardItem,
  IUpdateCardItem,
  IUpdateInstallmentsItem,
} from './items.types';
import { IQuery } from 'src/shared/providers/firebase/types/firebase.api.types';
import { UpdateCreditCardItemDto } from './dto/update-credit-card-item.dto';

@Injectable()
export class CreditCardItemService {
  constructor(
    private readonly firebaseSvc: FirebaseImplementation,
    private readonly creditCardSvc: CreditCardService,
  ) {}

  async create(newCreditCardItemDto: CreateCreditCardItemDto): Promise<string> {
    if (newCreditCardItemDto.amount <= 0) {
      throw new HttpException('SERVICE: Amout must be greater than zero.', 400);
    }

    if (newCreditCardItemDto.parcellsNumber < 1) {
      throw new HttpException(
        'SERVICE: Parcells number must be greater than zero.',
        400,
      );
    }

    if (newCreditCardItemDto.interest < 0) {
      throw new HttpException(
        'SERVICE: Interest must be greater or equal to zero.',
        400,
      );
    }

    const creditCard = await this.creditCardSvc.findOne(
      newCreditCardItemDto.ownerId,
      newCreditCardItemDto.creditCardId,
    );

    if (!creditCard) {
      throw new HttpException(
        'SERVICE: Failed to find credit card for item creation',
        404,
      );
    }

    if (newCreditCardItemDto.amount > creditCard.availableLimit) {
      throw new HttpException('SERVICE: Amount exceeds available limit', 400);
    }

    const dateF = toggleJsonToDate(newCreditCardItemDto.date);

    const resp = await this.firebaseSvc.Create({
      collection: `sheets/${newCreditCardItemDto.sheetId}/credit_card_items`,
      payload: {
        ownerId: newCreditCardItemDto.ownerId,
        name: newCreditCardItemDto.name,
        description: newCreditCardItemDto.description,
        parcellsNumber: newCreditCardItemDto.parcellsNumber,
        currentParcell: 1,
        interest: newCreditCardItemDto.interest,
        creditCardId: newCreditCardItemDto.creditCardId,
        categoryId: newCreditCardItemDto.categoryId,
        amount: newCreditCardItemDto.amount,
        date: dateF,
        updateLocked: false,
        hasBeenPaid: false,
      },
    });

    if (!resp) {
      throw new HttpException('SERVICE: Failed to create a item', 400);
    }

    await this.creditCardSvc.decreaseAvailableLimit(
      newCreditCardItemDto.ownerId,
      newCreditCardItemDto.creditCardId,
      newCreditCardItemDto.amount,
    );

    return resp;
  }

  async findOne(id: string, sheetId: string): Promise<ICreditCardItem> {
    const resp = await this.firebaseSvc.findOne<ICreditCardItem>({
      collection: `sheets/${sheetId}/credit_card_items`,
      id,
    });

    if (!resp) {
      throw new HttpException('SERVICE: No item found for this Item Id', 404);
    }

    return resp;
  }

  async findAllByQueries(
    sheetId: string,
    queries: IQuery<ICreditCardItem>[],
  ): Promise<ICreditCardItem[]> {
    if (queries.length == 0) {
      throw new HttpException('SERVICE: No queries provided', 400);
    }

    const resp = await this.firebaseSvc.findAll<ICreditCardItem>({
      collection: `sheets/${sheetId}/credit_card_items`,
      query: queries,
    });

    if (resp.length == 0) {
      throw new HttpException('SERVICE: No items found for these queries', 404);
    }

    return resp;
  }

  async findAll(sheetId: string): Promise<ICreditCardItem[]> {
    const resp = await this.firebaseSvc.findAll<ICreditCardItem>({
      collection: `sheets/${sheetId}/credit_card_items`,
    });

    if (resp.length == 0) {
      throw new HttpException('SERVICE: No items found for these queries', 404);
    }

    return resp;
  }

  async findUpFrontItemsForTheCurrentBill(
    sheetId: string,
    owid: string,
    creditCardId: string,
  ): Promise<ICreditCardItem[]> {
    const creditCard = await this.creditCardSvc.findOne(owid, creditCardId);

    const queries: IQuery<any>[] = [
      {
        field: 'creditCardId',
        condition: '==',
        value: creditCardId,
      },
      {
        field: 'parcellsNumber',
        condition: '==',
        value: 1,
      },
      {
        field: 'hasBeenPaid',
        condition: '==',
        value: false,
      },
    ];

    if (creditCard?.lastBill) {
      queries.push({
        field: 'date',
        condition: '>',
        value: creditCard.lastBill,
      });
    }

    const paidUpFrontItems = await this.firebaseSvc.findAll<ICreditCardItem>({
      collection: `sheets/${sheetId}/credit_card_items`,
      query: queries,
    });

    return paidUpFrontItems;
  }

  async findPaidInInstallmentsItems(sheetId: string, creditCardId: string) {
    const paidItems = await this.firebaseSvc.findAll<ICreditCardItem>({
      collection: `sheets/${sheetId}/credit_card_items`,
      query: [
        {
          field: 'creditCardId',
          condition: '==',
          value: creditCardId,
        },
        {
          field: 'parcellsNumber',
          condition: '>',
          value: 1,
        },
        {
          field: 'hasBeenPaid',
          condition: '==',
          value: false,
        },
      ],
    });

    return paidItems;
  }

  async update(
    id: string,
    sheetId: string,
    cardId: string,
    owid: string,
    updateCreditCardItemDto: UpdateCreditCardItemDto,
  ) {
    if (updateCreditCardItemDto.amount <= 0) {
      throw new HttpException('SERVICE: Amout must be greater than zero.', 400);
    }

    if (updateCreditCardItemDto.parcellsNumber < 1) {
      throw new HttpException(
        'SERVICE: Parcells number must be greater than zero.',
        400,
      );
    }

    if (updateCreditCardItemDto.interest < 0) {
      throw new HttpException(
        'SERVICE: Interest must be greater or equal to zero.',
        400,
      );
    }

    const creditCardItem: IUpdateCardItem = { ...updateCreditCardItemDto };

    if (updateCreditCardItemDto.date) {
      creditCardItem.date = toggleJsonToDate(updateCreditCardItemDto.date);
    }

    if (updateCreditCardItemDto?.amount) {
      const amountPrev = (await this.findOne(id, sheetId)).amount;
      await this.creditCardSvc.resolveAvailibeLimitDelta(
        owid,
        cardId,
        amountPrev,
        updateCreditCardItemDto.amount,
      );
    }

    await this.firebaseSvc.UpdateOne({
      collection: `sheets/${sheetId}/credit_card_items`,
      id,
      payload: creditCardItem,
    });
  }

  async updateUpFrontItem(sheetId: string, id: string) {
    await this.firebaseSvc.UpdateOne({
      collection: `sheets/${sheetId}/credit_card_items`,
      id,
      payload: {
        updateLocked: true,
        hasBeenPaid: true,
      },
    });
  }

  async updatePaidInInstallmentsItem(props: IUpdateInstallmentsItem) {
    const payload = {
      updatedLocked: true,
      hasBeenPaid: props.hasBeenPaid,
      currentParcell: props.currentParcell,
    };

    if (props.currentParcell < props.parcellsNumber) {
      payload.currentParcell += 1;
    } else {
      payload.hasBeenPaid = true;
    }

    await this.firebaseSvc.UpdateOne({
      collection: `sheets/${props.sheetId}/credit_card_items`,
      id: props.id,
      payload,
    });
  }

  async remove(id: string, sheetId: string) {
    const item = await this.findOne(id, sheetId);

    if (!item) {
      throw new HttpException('SERVICE: No item found for this Item Id', 404);
    }

    await this.creditCardSvc.increaseAvailableLimit(
      item.ownerId,
      item.creditCardId,
      item.amount,
    );

    await this.firebaseSvc.DeleteOne({
      collection: `sheets/${sheetId}/credit_card_items`,
      id,
    });
  }
}
