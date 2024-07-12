import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FirebaseImplementation } from 'src/shared/providers/firebase/implementation';
import { ICreateResp, IUser } from './user.types';

@Injectable()
export class UserService {
  constructor(private readonly firebase: FirebaseImplementation) {}

  async create(createUserDto: CreateUserDto): Promise<ICreateResp> {
    const resp = await this.firebase.Create({
      collection: 'users',
      payload: createUserDto,
    });

    if (!resp) {
      throw new HttpException('Failed to create a user', 500);
    }

    return { id: resp };
  }

  async findAll(): Promise<IUser[]> {
    const users = await this.firebase.findAll<IUser>({
      collection: 'users',
    });

    if (users.length == 0) {
      throw new HttpException('Failed to find users', 404);
    }

    return users;
  }

  async findOne(id: string): Promise<IUser> {
    const resp = await this.firebase.findOne<IUser>({
      collection: 'users',
      id,
    });

    if (!resp) {
      throw new HttpException('Failed to find user', 404);
    }

    return resp;
  }

  async findByEmail(email: string): Promise<IUser> {
    const resp = await this.firebase.findOne<IUser>({
      collection: 'users',
      query: [{ field: 'email', condition: '==', value: email }],
    });

    if (!resp) {
      throw new HttpException('Failed to find user by email', 404);
    }

    return resp;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.firebase.UpdateOne({
      collection: 'users',
      id,
      payload: updateUserDto,
    });
  }

  async remove(id: string) {
    await this.firebase.DeleteOne({
      collection: 'users',
      id,
    });
  }
}
