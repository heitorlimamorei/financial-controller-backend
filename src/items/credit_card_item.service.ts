import { HttpException, Injectable } from '@nestjs/common';
import { CreditCardService } from 'src/credit_card/credit_card.service';
import { FirebaseImplementation } from 'src/shared/providers/firebase/implementation';
import { CreateCreditCardItemDto } from './dto/create-credit-card-item.dto';
import { toggleJsonToDate } from 'src/shared/utils/date/datefunctions';
import { ICreditCardItem } from './items.types';
import { IQuery } from 'src/shared/providers/firebase/types/firebase.api.types';

@Injectable()
export class CreditCardItemService {
  constructor(
    private readonly firebaseSvc: FirebaseImplementation,
    private readonly creditCardSvc: CreditCardService,
  ) {}

  async create(newCreditCardItemDto: CreateCreditCardItemDto) {
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
      collection: `sheets/${newCreditCardItemDto.ownerId}/credit_card_items`,
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
  }

  async findAll(
    sheetId: string,
    creditCardId: string,
  ): Promise<ICreditCardItem[]> {
    const resp = await this.firebaseSvc.findAll<ICreditCardItem>({
      collection: `sheets/${sheetId}/credit_card_items`,
      query: [
        {
          field: 'creditCardId',
          condition: '==',
          value: creditCardId,
        },
      ],
    });

    if (resp.length == 0) {
      throw new HttpException(
        'SERVICE: No items found for this sheetId: ' + sheetId,
        404,
      );
    }

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

  async remove(id: string, sheetId: string) {
    const item = await this.findOne(id, sheetId);

    if (!item) {
      throw new HttpException('SERVICE: No item found for this Item Id', 404);
    }

    await this.firebaseSvc.DeleteOne({
      collection: `sheets/${sheetId}/credit_card_items`,
      id,
    });

    await this.creditCardSvc.increaseAvailableLimit(
      item.ownerId,
      item.creditCardId,
      item.amount,
    );
  }
}
