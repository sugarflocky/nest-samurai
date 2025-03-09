import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as process from 'node:process';
import { UserAccountsModule } from './features/user-accounts/user-accounts.module';
import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';
import { TestingModule } from './features/testing/testing-module';
@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI ?? 'mongodb://localhost:27017',
    ),
    UserAccountsModule,
    BloggersPlatformModule,
    TestingModule,
    configModule,
  ],
  controllers: [],
})
export class AppModule {}
