import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { FirebaseModule } from 'src/shared/providers/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
