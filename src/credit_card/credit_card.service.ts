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
      availableLimit: createCreditCardDto.speendingLimit,
      cardNumber,
      flag: cardFlag,
      expirationDate,
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
          speendingLimit: c.speendingLimit,
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
        speendingLimit: updateCreditCardDto.speendingLimit,
        nickname: updateCreditCardDto.nickname,
        cardNumber: cardNumber,
        flag: cardFlag,
      },
    });
  }

  async remove(ownerId: string, id: string): Promise<void> {
    await this.firebase.DeleteOne({
      collection: `users/${ownerId}/credit_card`,
      id: id,
    });
  }
}
