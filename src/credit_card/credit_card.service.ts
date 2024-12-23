import { HttpException, Injectable } from '@nestjs/common';
import { CreateCreditCardDto } from './dto/create-credit_card.dto';
import { UpdateCreditCardDto } from './dto/update-credit_card.dto';
import { FirebaseImplementation } from 'src/shared/providers/firebase/implementation';
import ICreditCard, { ICreditCardLimitsData } from './types/credit_card';
import { CreditCardUtils } from 'src/shared/providers/credit_card_util/CreditCardUtils';
import { toggleJsonToDate } from 'src/shared/utils/date/datefunctions';

@Injectable()
export class CreditCardService {
  constructor(
    private readonly firebase: FirebaseImplementation,
    private readonly CreditCardUtil: CreditCardUtils,
  ) {}

  async create(createCreditCardDto: CreateCreditCardDto) {
    let cardNumber: string = null;

    if (!createCreditCardDto.cardNumber) {
      if (!createCreditCardDto.flag) {
        throw new HttpException(
          'SERVICE: To generate a Credit Card, Brand is required.',
          400,
        );
      }

      cardNumber = this.CreditCardUtil.generateRandomCardNumber(
        createCreditCardDto.flag,
      );
    } else {
      if (
        !this.CreditCardUtil.isValidCreditCardNumber(
          createCreditCardDto.cardNumber,
        )
      ) {
        throw new HttpException('SERVICE: Invalid Credit Card number.', 400);
      }

      cardNumber = createCreditCardDto.cardNumber;
    }

    const cardFlag =
      createCreditCardDto.flag ??
      this.CreditCardUtil.getCreditCardFlag(cardNumber);

    if (!cardFlag) {
      throw new HttpException(
        'SERVICE: Invalid Credit Card flag. Please provide a valid flag.',
        400,
      );
    }

    const expirationDate = toggleJsonToDate(createCreditCardDto.expirationDate);

    if (expirationDate < new Date()) {
      throw new HttpException(
        'SERVICE: Expiration Date cannot be in the past.',
        400,
      );
    }

    const payload = {
      ...createCreditCardDto,
      availableLimit: createCreditCardDto.spendingLimit,
      cardNumber,
      flag: cardFlag,
      expirationDate,
      billList: [],
    };

    const resp = await this.firebase.Create({
      collection: `users/${createCreditCardDto.ownerId}/credit_card`,
      payload: {
        ...payload,
      },
    });

    return resp;
  }

  async findAll(owid: string): Promise<ICreditCard[]> {
    const resp = await this.firebase.findAll<ICreditCard>({
      collection: `users/${owid}/credit_card`,
    });

    if (resp.length === 0) {
      throw new HttpException(
        'SERVICE: CreditCard not found for owid: ' + owid,
        404,
      );
    }

    return resp;
  }

  async findAllLimits(owid: string): Promise<ICreditCardLimitsData[]> {
    const resp = await this.firebase.findAll<ICreditCardLimitsData>({
      collection: `users/${owid}/credit_card`,
      map(c: ICreditCard) {
        return {
          id: c.id,
          ownerId: c.ownerId,
          spendingLimit: c.spendingLimit,
          availableLimit: c.availableLimit,
        };
      },
    });

    if (resp.length === 0) {
      throw new HttpException(
        'SERVICE: CreditCard not found for owid: ' + owid,
        404,
      );
    }

    return resp;
  }

  async findAllByFlag(owid: string, flag: string): Promise<ICreditCard[]> {
    const resp = await this.firebase.findAll<ICreditCard>({
      collection: `users/${owid}/credit_card`,
      query: [{ field: 'flag', condition: '==', value: flag }],
    });

    if (resp.length === 0) {
      throw new HttpException(
        'SERVICE: CreditCard not found for owid: ' + owid + 'and flag:' + flag,
        404,
      );
    }

    return resp;
  }

  async findOneByCardNumber(
    owid: string,
    cardNumber: string,
  ): Promise<ICreditCard> {
    if (!this.CreditCardUtil.isValidCreditCardNumber(cardNumber)) {
      throw new HttpException('SERVICE: Invalid Credit Card number.', 400);
    }

    const resp = await this.firebase.findOne<ICreditCard>({
      collection: `users/${owid}/credit_card`,
      query: [{ field: 'cardNumber', condition: '==', value: cardNumber }],
    });
    if (!resp) {
      throw new HttpException(
        'SERVICE: CreditCard not found for owid: ' +
          owid +
          'and: cardNumber' +
          cardNumber,
        404,
      );
    }

    return resp;
  }

  async findOne(owid: string, id: string): Promise<ICreditCard> {
    const resp = await this.firebase.findOne<ICreditCard>({
      collection: `users/${owid}/credit_card`,
      id,
    });

    if (!resp) {
      throw new HttpException('Failed to find creditCard', 404);
    }

    return resp;
  }

  async update(
    id: string,
    updateCreditCardDto: UpdateCreditCardDto,
  ): Promise<void> {
    let cardNumber: string = null;
    let cardFlag: string = null;

    if (
      !this.CreditCardUtil.isValidCreditCardNumber(
        updateCreditCardDto.cardNumber,
      )
    ) {
      throw new HttpException('SERVICE: Invalid Credit Card number.', 400);
    }

    cardNumber = updateCreditCardDto.cardNumber;
    cardFlag = this.CreditCardUtil.getCreditCardFlag(cardNumber);

    if (!cardFlag) {
      throw new HttpException(
        'SERVICE: Invalid Credit Card flag for the provided number.',
        400,
      );
    }

    await this.firebase.UpdateOne({
      collection: `users/${updateCreditCardDto.ownerId}/credit_card`,
      id,
      payload: {
        availableLimit: updateCreditCardDto.availableLimit,
        spendingLimit: updateCreditCardDto.spendingLimit,
        nickname: updateCreditCardDto.nickname,
        cardNumber: cardNumber,
        flag: cardFlag,
      },
    });
  }

  async setCard(
    owid: string,
    cardId: string,
    handler: (card: ICreditCard) => ICreditCard,
  ) {
    const creditCard = await this.findOne(owid, cardId);
    const updatedCard = handler(creditCard);

    if (!this.CreditCardUtil.isValidCreditCardNumber(updatedCard.cardNumber)) {
      throw new HttpException('SERVICE: Invalid Credit Card number.', 400);
    }

    const safeFlag: string | null = this.CreditCardUtil.getCreditCardFlag(
      updatedCard.cardNumber,
    );

    if (updatedCard.flag !== safeFlag) {
      throw new HttpException(
        'SERVICE: Invalid the provided Card flag does not match with the actual Card Flag for the provided CardNumber.',
        400,
      );
    }

    await this.firebase.SetDoc({
      collection: `users/${owid}/credit_card`,
      id: cardId,
      payload: {
        ...updatedCard,
        ownerId: owid,
      },
    });
  }

  async addBillIntoTheList(owid: string, cardId: string, billId: string) {
    await this.setCard(owid, cardId, (c) => ({
      ...c,
      billList: [...c.billList, billId],
    }));
  }

  async removeBillIntoTheList(owid: string, cardId: string, billId: string) {
    await this.setCard(owid, cardId, (c) => ({
      ...c,
      billList: c.billList.filter((b) => b !== billId),
    }));
  }

  async setLastBill(owid: string, id: string, date: Date): Promise<void> {
    await this.setCard(owid, id, (c) => ({
      ...c,
      lastBill: this.firebase.transformeDateToTimeStamp(date),
    }));
  }

  async increaseAvailableLimit(
    owid: string,
    cardId: string,
    amount: number,
  ): Promise<void> {
    await this.setCard(owid, cardId, (c) => {
      if (amount <= 0) {
        throw new HttpException(
          'SERVICE: To increase the available limit the amount must be greater than zero.',
          400,
        );
      }

      if (c.spendingLimit < amount + c.availableLimit) {
        throw new HttpException(
          'SERVICE: The available limit cannot exceed the card limit.',
          400,
        );
      }

      return {
        ...c,
        availableLimit: c.availableLimit + amount,
      };
    });
  }

  async decreaseAvailableLimit(
    owid: string,
    cardId: string,
    amount: number,
  ): Promise<void> {
    if (amount <= 0) {
      throw new HttpException(
        'SERVICE: To decrease the available limit the amount must be greater than zero.',
        400,
      );
    }

    await this.setCard(owid, cardId, (c) => {
      if (0 > c.availableLimit - amount) {
        throw new HttpException(
          'SERVICE: The available limit - amount must be greather or equal to zero.',
          400,
        );
      }

      return {
        ...c,
        availableLimit: c.availableLimit - amount,
      };
    });
  }

  async resolveAvailibeLimitDelta(
    owid: string,
    cardId: string,
    amountPrev: number,
    ammount: number,
  ) {
    const delta = amountPrev - ammount;

    if (delta == 0) return;

    await this.setCard(owid, cardId, (c) => {
      return {
        ...c,
        availableLimit: c.availableLimit + delta,
      };
    });
  }

  async remove(ownerId: string, id: string): Promise<void> {
    await this.firebase.DeleteOne({
      collection: `users/${ownerId}/credit_card`,
      id: id,
    });
  }
}
