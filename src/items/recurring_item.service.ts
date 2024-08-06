import { HttpException, Injectable } from '@nestjs/common';
import { FirebaseImplementation } from 'src/shared/providers/firebase/implementation';
import { CreateRecurringItemDto } from './dto/create-recurring-item.dto';
import {
  addDays,
  firestoreTimestampToDate,
  toggleJsonToDate,
} from 'src/shared/utils/date/datefunctions';
import { CreditCardItemService } from './credit_card_item.service';
import { ItemsService } from './items.service';
import { IQuery } from 'src/shared/providers/firebase/types/firebase.api.types';
import { IRecurringExpense } from './items.types';
import { arrayToHashMap } from 'src/shared/utils/transformers';

@Injectable()
export class RecurringIemService {
  constructor(
    private readonly firebaseService: FirebaseImplementation,
    private readonly creditCardItemService: CreditCardItemService,
    private readonly itemService: ItemsService,
  ) {}

  async chargeItem(item: CreateRecurringItemDto) {
    const baseItem = {
      name: item.name,
      description: item.description,
      amount: item.amount,
      date: new Date().toJSON(),
      categoryId: item.categoryId,
      sheetId: item.sheetId,
      ownerId: item.owid,
    };

    if (item.paymentMethod === 'account') {
      const id = await this.itemService.create({
        ...baseItem,
        accountId: item.paymentMethodId,
        type: 'INCOME',
      });

      return id;
    }

    const id = await this.creditCardItemService.create({
      ...baseItem,
      creditCardId: item.paymentMethodId,
      parcellsNumber: 1,
      interest: 0,
    });

    return id;
  }

  async create(recurringExpenseDto: CreateRecurringItemDto): Promise<string> {
    const startDate = toggleJsonToDate(recurringExpenseDto.startDate);
    const nextChargeDate = addDays(recurringExpenseDto.frequency, startDate);

    const resp = await this.firebaseService.Create({
      collection: `sheets/${recurringExpenseDto.sheetId}/recurring_item`,
      payload: {
        name: recurringExpenseDto.name,
        description: recurringExpenseDto.description,
        amount: recurringExpenseDto.amount,
        frequency: recurringExpenseDto.frequency,
        lastCharge: this.firebaseService.transformeDateToTimeStamp(startDate),
        nextDate: nextChargeDate,
        categoryId: recurringExpenseDto.categoryId,
        ownerId: recurringExpenseDto.owid,
        paymentMethod: recurringExpenseDto.paymentMethod,
        paymentMethodId: recurringExpenseDto.paymentMethodId,
      },
    });

    await this.chargeItem(recurringExpenseDto);

    return resp;
  }

  async findAll(sheetId: string): Promise<IRecurringExpense[]> {
    const resp = await this.firebaseService.findAll<IRecurringExpense>({
      collection: `sheets/${sheetId}/recurring_item`,
    });

    return resp;
  }

  async findAllByQueries(
    sheetId: string,
    queries: IQuery<any>[],
  ): Promise<IRecurringExpense[]> {
    if (queries.length == 0) {
      throw new HttpException('SERVICE: No queries provided', 400);
    }

    const resp = await this.firebaseService.findAll<IRecurringExpense>({
      collection: `sheets/${sheetId}/recurring_item`,
      query: queries,
    });

    if (resp.length == 0) {
      throw new HttpException('SERVICE: No items found for these queries', 404);
    }

    return resp;
  }

  async delete(sheetId: string, id: string): Promise<void> {
    await this.firebaseService.DeleteOne({
      collection: `sheets/${sheetId}/recurring_item`,
      id,
    });
  }

  async setItemAsCharged(
    sheetId: string,
    item: IRecurringExpense,
  ): Promise<void> {
    const nextChargeDate = addDays(
      item.frequency,
      firestoreTimestampToDate(item.lastCharge),
    );

    await this.firebaseService.UpdateOne({
      collection: `sheets/${sheetId}/recurring_item`,
      id: item.id,
      payload: {
        nextCharge: nextChargeDate,
        lastCharge: new Date(),
      },
    });
  }

  async executeGlobalCharge(sheetId: string): Promise<string[]> {
    const today = this.firebaseService.transformeDateToTimeStamp(new Date());

    const recurringItems =
      await this.firebaseService.findAll<IRecurringExpense>({
        collection: `sheets/${sheetId}/recurring_item`,
        query: [
          {
            field: 'nextDate',
            condition: '<=',
            value: today,
          },
        ],
      });

    if (recurringItems.length == 0) {
      return [];
    }

    const charges = recurringItems.map(async (item) => {
      return this.chargeItem({
        name: item.name,
        description: item.description,
        amount: item.amount,
        owid: item.ownerId,
        sheetId,
        categoryId: item.categoryId,
        paymentMethod: item.paymentMethod,
        paymentMethodId: item.paymentMethodId,
        startDate: '',
        frequency: 0,
      });
    });

    const resp = await Promise.allSettled(charges);

    const ids = resp.filter((rp) => rp.status == 'fulfilled');

    if (ids.length == 0) {
      return [];
    }

    const idsF = ids.map((id) => id.value);

    const itemsTobeUpdated: IRecurringExpense[] = [];

    const idexedItems = arrayToHashMap(recurringItems, 'id');

    idsF.forEach((itemId) => itemsTobeUpdated.push(idexedItems[itemId]));

    await Promise.all(
      itemsTobeUpdated.map((item) => this.setItemAsCharged(sheetId, item)),
    );

    return idsF;
  }
}
