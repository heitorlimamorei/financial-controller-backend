import { HttpException, Injectable } from '@nestjs/common';
import { FirebaseImplementation } from 'src/shared/providers/firebase/implementation';
import { CrateBillDto } from './dto/create-bill.dto';
import { IBill } from './bill.types';

@Injectable()
export class BillService {
  constructor(private readonly firebase: FirebaseImplementation) {}

  async create(createBillDto: CrateBillDto) {
    const billId = await this.firebase.Create({
      collection: `users/${createBillDto.owid}/bill`,
      payload: {
        ownerId: createBillDto.owid,
        creditCardId: createBillDto.creditCardId,
        sheetId: createBillDto.sheetId,
        total: createBillDto.total,
        ids: createBillDto.ids,
        resume: createBillDto.resume,
      },
    });

    if (!billId) {
      throw new HttpException('SERVICE: Failed to create Bill', 400);
    }

    return billId;
  }

  async findAll(owid: string, creditCardId: string): Promise<IBill[]> {
    const resp = await this.firebase.findAll<IBill>({
      collection: `users/${owid}/bill`,
      query: [
        {
          field: 'creditCardId',
          condition: '==',
          value: creditCardId,
        },
      ],
    });

    if (resp.length === 0) {
      throw new HttpException('SERVICE: No bill found', 404);
    }

    return resp;
  }

  async findOne(owid: string, billId: string): Promise<IBill> {
    const resp = await this.firebase.findOne<IBill>({
      collection: `users/${owid}/bill`,
      id: billId,
    });

    if (!resp) {
      throw new HttpException('SERVICE: No bill found', 404);
    }

    return resp;
  }

  async updateResume(owid: string, billId: string, resume: string) {
    await this.firebase.UpdateOne({
      collection: `users/${owid}/bill`,
      id: billId,
      payload: { resume },
    });
  }

  async deleteByCreditCard(owid: string, creditCardId: string) {
    await this.firebase.DeleteMany({
      collection: `users/${owid}/bill`,
      query: [
        {
          field: 'creditCardId',
          condition: '==',
          value: creditCardId,
        },
      ],
    });
  }

  async delete(owid: string, id: string) {
    await this.firebase.DeleteOne({
      collection: `users/${owid}/bill`,
      id,
    });
  }
}
