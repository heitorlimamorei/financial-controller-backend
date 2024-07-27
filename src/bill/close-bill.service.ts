import { Injectable } from '@nestjs/common';
import { CreditCardService } from '../credit_card/credit_card.service';
import { CreditCardItemService } from 'src/items/credit_card_item.service';
import { PromiseScheduler } from 'src/shared/utils/resources/promises';

@Injectable()
export class ClonseBillService {
  constructor(
    private readonly creditCardService: CreditCardService,
    private readonly creditCardItemService: CreditCardItemService,
  ) {}

  private async handleUpFrontItems(
    sheetId: string,
    owid: string,
    creditCardId: string,
  ) {
    const upFrontItems =
      await this.creditCardItemService.findUpFrontItemsForTheCurrentBill(
        sheetId,
        owid,
        creditCardId,
      );

    const totalValue = upFrontItems.reduce(
      (total, item) => total + item.amount,
      0,
    );

    await PromiseScheduler(
      upFrontItems.map((item) => {
        return this.creditCardItemService.updateUpFrontItem(sheetId, item.id);
      }),
    );

    return {
      totalValue,
      ids: upFrontItems.map(({ id }) => id),
    };
  }

  private async handlePaidInInstallmentsItems(
    sheetId: string,
    creditCardId: string,
  ) {
    const paidInInstallmentsItems =
      await this.creditCardItemService.findPaidInInstallmentsItems(
        sheetId,
        creditCardId,
      );

    const totalValue = paidInInstallmentsItems.reduce((total, item) => {
      const installment = item.amount / item.parcellsNumber;
      return total + installment;
    }, 0);

    await PromiseScheduler(
      paidInInstallmentsItems.map((item) => {
        return this.creditCardItemService.updatePaidInInstallmentsItem({
          sheetId,
          id: item.id,
          currentParcell: item.currentParcell,
          parcellsNumber: item.parcellsNumber,
          hasBeenPaid: item.hasBeenPaid,
        });
      }),
    );

    return {
      totalValue,
      ids: paidInInstallmentsItems.map(({ id }) => id),
    };
  }

  async execute(shetId: string, owid: string, creditCardId: string) {
    const upfrontReport = await this.handleUpFrontItems(
      shetId,
      owid,
      creditCardId,
    );

    const paidInInstallmentsReport = await this.handlePaidInInstallmentsItems(
      shetId,
      creditCardId,
    );

    const total =
      upfrontReport.totalValue + paidInInstallmentsReport.totalValue;

    await this.creditCardService.increaseAvailableLimit(
      owid,
      creditCardId,
      total,
    );

    await this.creditCardService.setLastBill(owid, creditCardId, new Date());

    return {
      upfront: upfrontReport,
      paidInInstallments: paidInInstallmentsReport,
      total,
    };
  }
}
