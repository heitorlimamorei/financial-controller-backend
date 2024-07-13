import { HttpException, Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { FirebaseImplementation } from 'src/shared/providers/firebase/implementation';
import { ISubscription } from './susbcription.types';
import { toggleJsonToDate } from 'src/shared/utils/date/datefunctions';

@Injectable()
export class SubscriptionService {
  constructor(private readonly firebase: FirebaseImplementation) {}
  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const startDate = toggleJsonToDate(createSubscriptionDto.start_date);
    const endDate = toggleJsonToDate(createSubscriptionDto.end_date);

    const now = new Date();

    if (now > endDate) {
      throw new HttpException('SERVICE: End Date cannot be in the past.', 400);
    }

    const resp = await this.firebase.Create({
      collection: `users/${createSubscriptionDto.ownerId}/subscription`,
      payload: {
        ...createSubscriptionDto,
        end_date: endDate,
        start_date: startDate,
      },
    });

    return resp;
  }

  async findAll(ownerId: string): Promise<ISubscription[]> {
    const resp = await this.firebase.findAll<ISubscription>({
      collection: `users/${ownerId}/subscription`,
    });

    if (resp.length == 0) {
      throw new HttpException('SERVICE: Failed to find subscriptions', 404);
    }

    return resp;
  }

  async findOne(id: string, owid: string): Promise<ISubscription> {
    const resp = await this.firebase.findOne<ISubscription>({
      collection: `users/${owid}/subscription`,
      id,
    });

    if (!resp) {
      throw new HttpException('SERVICE: Failed to find subscription', 404);
    }

    return resp;
  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {
    await this.firebase.UpdateOne({
      collection: `users/${updateSubscriptionDto.ownerId}/subscription`,
      id,
      payload: updateSubscriptionDto,
    });
  }

  async remove(id: string, ownerId: string) {
    await this.firebase.DeleteOne({
      collection: `users/${ownerId}/subscription`,
      id,
    });
  }
}
