import { HttpException, Injectable } from '@nestjs/common';
import { FirebaseImplementation } from 'src/shared/providers/firebase/implementation';
import { CreateBillDto } from './dto/create-bill.dto';
import { IBill } from './bill.types';
import { CloseBillService } from './close-bill.service';
import { TextCompressionService } from 'src/shared/providers/textcompression/compression/compression.service';
import { toggleDateToJson } from 'src/shared/utils/date/datefunctions';
import { CreditCardService } from 'src/credit_card/credit_card.service';

@Injectable()
export class BillService {
  constructor(
    private readonly firebase: FirebaseImplementation,
    private readonly closeBillSvc: CloseBillService,
    private readonly textCompression: TextCompressionService,
    private readonly creditCardSvc: CreditCardService,
  ) {}

  async handleCloseBill(sheetId: string, owid: string, cardId: string) {
    const report = await this.closeBillSvc.execute(sheetId, owid, cardId);

    const resume = {
      paidInInstallments: report.paidInInstallments,
      paidUpFront: report.upfront,
    };

    const compressedResume = await this.textCompression.compressText(
      JSON.stringify(resume),
    );

    const ids = [
      ...report.paidInInstallments.items,
      ...report.upfront.items,
    ].map((item) => item.id);

    const closedAt = new Date();

    const billId = await this.create({
      owid,
      sheetId,
      resume: compressedResume,
      total: report.total,
      creditCardId: cardId,
      ids,
      closedAt,
    });

    await this.creditCardSvc.addBillIntoTheList(owid, cardId, billId);

    return {
      id: billId,
      totalValue: report.total,
      creditCardId: cardId,
      closedAt: toggleDateToJson(closedAt),
      resume: compressedResume,
    };
  }

  async create(createBillDto: CreateBillDto) {
    const billId = await this.firebase.Create({
      collection: `users/${createBillDto.owid}/bill`,
      payload: {
        ownerId: createBillDto.owid,
        creditCardId: createBillDto.creditCardId,
        sheetId: createBillDto.sheetId,
        total: createBillDto.total,
        ids: createBillDto.ids,
        resume: createBillDto.resume,
        closedAt: createBillDto.closedAt,
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
