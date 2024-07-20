import { HttpException, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { SetItemDto } from './dto/set-item.dto';
import { FirebaseImplementation } from 'src/shared/providers/firebase/implementation';
import { toggleJsonToDate } from 'src/shared/utils/date/datefunctions';
import { AccountService } from 'src/account/account.service';
import { IItem } from './items.types';
import { UpdateItemDto } from './dto/update-item.dto';
import { IQuery } from 'src/shared/providers/firebase/types/firebase.api.types';

@Injectable()
export class ItemsService {
  constructor(
    private readonly firebaseSvc: FirebaseImplementation,
    private readonly accountSvc: AccountService,
  ) {}

  async create(createItemDto: CreateItemDto): Promise<string> {
    if (createItemDto.amount <= 0) {
      throw new HttpException('SERVICE: Amount must be greater than 0', 400);
    }

    const dateF = toggleJsonToDate(createItemDto.date);

    const resp = await this.firebaseSvc.Create({
      collection: `sheets/${createItemDto.sheetId}/items`,
      payload: {
        categoryId: createItemDto.categoryId,
        ownerId: createItemDto.ownerId,
        name: createItemDto.name,
        description: createItemDto.description,
        accountId: createItemDto.accountId,
        amount: createItemDto.amount,
        date: dateF,
        type: createItemDto.type,
      },
    });

    if (!resp) {
      throw new HttpException('SERVICE: Failed to create a item', 400);
    }

    if (createItemDto.type == 'EXPENSE') {
      await this.accountSvc.decreaseBalance(
        createItemDto.accountId,
        createItemDto.ownerId,
        createItemDto.amount,
      );
    } else {
      await this.accountSvc.increaseBalance(
        createItemDto.accountId,
        createItemDto.ownerId,
        createItemDto.amount,
      );
    }

    return resp;
  }

  async findAll(sheetId: string): Promise<IItem[]> {
    const resp = await this.firebaseSvc.findAll<IItem>({
      collection: `sheets/${sheetId}/items`,
    });

    if (resp.length == 0) {
      throw new HttpException(
        'SERVICE: No items found for this sheetId: ' + sheetId,
        404,
      );
    }

    return resp;
  }

  async findAllByOwnerId(sheetId: string, owid: string): Promise<IItem[]> {
    const resp = await this.firebaseSvc.findAll<IItem>({
      collection: `sheets/${sheetId}/items`,
      query: [
        {
          field: 'ownerId',
          condition: '==',
          value: owid,
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

  async findAllByQueries(
    sheetId: string,
    queries: IQuery<IItem>[],
  ): Promise<IItem[]> {
    if (queries.length == 0) {
      throw new HttpException('SERVICE: No queries provided', 400);
    }

    const resp = await this.firebaseSvc.findAll<IItem>({
      collection: `sheets/${sheetId}/items`,
      query: queries,
    });

    if (resp.length == 0) {
      throw new HttpException('SERVICE: No items found for these queries', 404);
    }

    return resp;
  }

  async findOne(id: string, sheetId: string): Promise<IItem> {
    const resp = await this.firebaseSvc.findOne<IItem>({
      collection: `sheets/${sheetId}/items`,
      id,
    });

    if (!resp) {
      throw new HttpException('SERVICE: No item found for this Item Id', 404);
    }

    return resp;
  }

  async setItem(id: string, sheetId: string, updateItemDto: SetItemDto) {
    if (!updateItemDto.amount || !updateItemDto.type) {
      throw new HttpException('SERVICE: Amount and type are required.', 400);
    }

    if (updateItemDto.amount <= 0) {
      throw new HttpException('SERVICE: Amount must be greater than 0', 400);
    }

    const prevSnapshot = await this.findOne(id, sheetId);
    const dateF = updateItemDto?.date
      ? toggleJsonToDate(updateItemDto.date)
      : prevSnapshot.date;

    await this.firebaseSvc.UpdateOne({
      collection: `sheets/${sheetId}/items`,
      id,
      payload: {
        categoryId: updateItemDto.categoryId ?? prevSnapshot.categoryId,
        ownerId: updateItemDto.ownerId ?? prevSnapshot.ownerId,
        name: updateItemDto.name ?? prevSnapshot.name,
        description: updateItemDto.description ?? prevSnapshot.description,
        accountId: updateItemDto.accountId ?? prevSnapshot.accountId,
        amount: updateItemDto.amount,
        date: dateF,
        type: updateItemDto.type,
      },
    });

    if (
      prevSnapshot.type == updateItemDto.type &&
      prevSnapshot.amount == updateItemDto.amount
    ) {
      return;
    }

    await this.accountSvc.resolveBalanceDelta({
      typePrev: prevSnapshot.type,
      type: updateItemDto.type,
      ammountPrev: prevSnapshot.amount,
      ammount: updateItemDto.amount,
      accountId: prevSnapshot.accountId,
      ownerId: prevSnapshot.ownerId,
    });
  }

  async update(id: string, sheetId: string, updateItemDto: UpdateItemDto) {
    const dateF = toggleJsonToDate(updateItemDto.date);

    await this.firebaseSvc.UpdateOne({
      collection: `sheets/${sheetId}/items`,
      id,
      payload: {
        categoryId: updateItemDto.categoryId,
        ownerId: updateItemDto.ownerId,
        name: updateItemDto.name,
        description: updateItemDto.description,
        accountId: updateItemDto.accountId,
        date: dateF,
      },
    });
  }

  async remove(id: string, sheetId: string) {
    const item = await this.findOne(id, sheetId);

    if (!item) {
      throw new HttpException('SERVICE: No item found for this Item Id', 404);
    }

    await this.firebaseSvc.DeleteOne({
      collection: `sheets/${sheetId}/items`,
      id,
    });

    if (item.type == 'EXPENSE') {
      await this.accountSvc.increaseBalance(
        item.accountId,
        item.ownerId,
        item.amount,
      );
    } else {
      await this.accountSvc.decreaseBalance(
        item.accountId,
        item.ownerId,
        item.amount,
      );
    }
  }
}
