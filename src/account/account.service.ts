import { HttpException, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { FirebaseImplementation } from 'src/shared/providers/firebase/implementation';
import { IAccount } from './account.types';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly firebase: FirebaseImplementation,
    private readonly userService: UserService,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<string> {
    const user = await this.userService.findOne(createAccountDto.ownerId);

    if (!user) {
      throw new HttpException('SERVICE: No user found for this ownerId', 404);
    }

    const resp = await this.firebase.Create({
      collection: `users/${createAccountDto.ownerId}/account`,
      payload: createAccountDto,
    });

    return resp;
  }

  async findAll(ownerId: string): Promise<IAccount[]> {
    const resp = await this.firebase.findAll<IAccount>({
      collection: `users/${ownerId}/account`,
    });

    if (resp.length === 0) {
      throw new HttpException(
        'SERVICE: No account found for this ownerId: ' + ownerId,
        404,
      );
    }

    return resp;
  }

  async findOne(id: string, ownerId: string): Promise<IAccount> {
    const resp = await this.firebase.findOne<IAccount>({
      collection: `users/${ownerId}/account`,
      id,
    });

    if (!resp) {
      throw new HttpException('SERVICE: Failed to find account', 404);
    }

    return resp;
  }

  async update(id: string, owid: string, updateAccountDto: UpdateAccountDto) {
    await this.firebase.UpdateOne({
      collection: `users/${owid}/account`,
      id,
      payload: {
        nickname: updateAccountDto.nickname,
        balance: updateAccountDto.balance,
      },
    });
  }

  async increaseBalance(id: string, owid: string, ammount: number) {
    if (ammount <= 0) {
      throw new HttpException(
        'SERVICE: Amount to increase must be greater than zero.',
        400,
      );
    }

    const account = await this.findOne(id, owid);

    if (!account) {
      throw new HttpException('SERVICE: Failed to find account', 404);
    }

    await this.update(id, owid, {
      nickname: account.nickname,
      balance: account.balance + ammount,
    });
  }

  async decreaseBalance(id: string, owid: string, ammount: number) {
    if (ammount <= 0) {
      throw new HttpException(
        'SERVICE: Amount to decrease must be greater than zero.',
        400,
      );
    }

    const account = await this.findOne(id, owid);

    if (!account) {
      throw new HttpException('SERVICE: Failed to find account', 404);
    }

    await this.update(id, owid, {
      nickname: account.nickname,
      balance: account.balance - ammount,
    });
  }

  async remove(id: string, ownerId: string) {
    await this.firebase.DeleteOne({
      collection: `users/${ownerId}/account`,
      id: id,
    });
  }
}
