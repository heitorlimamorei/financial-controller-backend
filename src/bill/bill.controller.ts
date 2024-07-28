import { Body, Controller, Post } from '@nestjs/common';
import { CloseBillDto } from './dto/close-bill.dto';
import { ClonseBillService } from './close-bill.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Bill')
@Controller('bill')
export class BillController {
  constructor(private readonly closeBillSvc: ClonseBillService) {}

  @Post('close-bill')
  async closeBill(@Body() body: CloseBillDto) {
    return await this.closeBillSvc.execute(
      body.sheetid,
      body.owid,
      body.creditCardId,
    );
  }
}
