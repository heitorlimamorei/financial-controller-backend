import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './shared/providers/firebase/firebase.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [FirebaseModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
