import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { Injectable } from '@nestjs/common';
import {
  BadRequestDomainException,
  NotFoundDomainException,
  UnauthorizedDomainException,
} from '../../../core/exceptions/domain-exceptions';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersRepository {
  //инжектирование модели через DI
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async findById(id: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      _id: id,
      deletedAt: null,
    });
  }

  async save(user: UserDocument) {
    await user.save();
  }

  async findOrNotFoundFail(id: string): Promise<UserDocument> {
    const user = await this.findById(id);

    if (!user) {
      throw NotFoundDomainException.create();
    }

    return user;
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDocument> {
    const user = await this.UserModel.findOne({
      $or: [
        { login: loginOrEmail, deletedAt: null },
        { email: loginOrEmail, deletedAt: null },
      ],
    });
    if (!user) {
      throw UnauthorizedDomainException.create();
    }
    return user;
  }

  async findOrBadRequestByEmailCode(code: string): Promise<UserDocument> {
    const user = await this.UserModel.findOne({
      'emailConfirmation.code': code,
      deletedAt: null,
    });
    if (!user) {
      throw BadRequestDomainException.create('user not found', 'user');
    }
    return user;
  }

  async findOrBadRequestByRecoveryCode(code: string): Promise<UserDocument> {
    const user = await this.UserModel.findOne({
      'passwordRecovery.code': code,
      deletedAt: null,
    });
    if (!user)
      throw BadRequestDomainException.create(
        'recovery code is incorrect, expired or already been applied',
        'code',
      );
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    const user = await this.UserModel.findOne({
      email: email,
      deletedAt: null,
    });
    return user;
  }

  async findByLogin(login: string): Promise<UserDocument | null> {
    const user = await this.UserModel.findOne({
      login: login,
      deletedAt: null,
    });
    return user;
  }

  async selectByLoginOrEmail(loginOrEmail: string) {
    const user = await this.dataSource.query(
      `
      SELECT * FROM "Users" u
      WHERE u."login"=$1 OR u."email"=$1`,
      [loginOrEmail],
    );
    return user[0];
  }

  async select(userId: string) {
    const user = await this.dataSource.query(
      `
    SELECT * FROM "Users" u
    WHERE u."id"=$1 AND u."deletedAt" IS NULL 
`,
      [userId],
    );
    return user[0];
  }

  async selectByLogin(login: string) {
    const user = await this.dataSource.query(
      `
    SELECT * FROM "Users" u
    WHERE u."login"=$1 AND u."deletedAt" IS NULL 
`,
      [login],
    );
    return user[0];
  }

  async selectByEmail(email: string) {
    const user = await this.dataSource.query(
      `
    SELECT * FROM "Users" u
    WHERE u."email"=$1 AND u."deletedAt" IS NULL 
`,
      [email],
    );
    return user[0];
  }

  async selectOrNotFoundFail(userId: string) {
    const user = await this.select(userId);
    if (!user) {
      throw NotFoundDomainException.create();
    }
    return user;
  }

  async create(dto: CreateUserDto) {
    await this.dataSource.query(
      `
INSERT INTO "Users"(
id, login, password, email, "createdAt", "deletedAt")
VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        dto.id,
        dto.login,
        dto.password,
        dto.email,
        dto.createdAt,
        dto.deletedAt,
      ],
    );

    await this.dataSource.query(
      `
INSERT INTO "UsersEmailConfirmationCodes"(
"userId", "code", "expirationDate", "isConfirmed")
VALUES ($1, $2, $3, $4);
    `,
      [dto.id, dto.code, dto.expirationDate, dto.isConfirmed],
    );

    await this.dataSource.query(
      `
INSERT INTO "UsersPasswordRecoveryCodes"(
"userId", "code", "expirationDate")
VALUES ($1, $2, $3)`,
      [dto.id, null, null],
    );
  }

  async delete(userId: string): Promise<void> {
    await this.selectOrNotFoundFail(userId);
    await this.dataSource.query(
      `
UPDATE "Users" u
SET "deletedAt"=$2
WHERE u."id"=$1`,
      [userId, new Date()],
    );
  }

  async updateRecoveryCode(dto) {
    await this.dataSource.query(
      `
UPDATE "UsersPasswordRecoveryCodes"
SET "code"=$2, "expirationDate"=$3
WHERE "userId"=$1
`,
      [dto.userId, dto.code, dto.expirationDate],
    );
  }

  async selectByRecoveryCodeOrBadRequest(recoveryCode: string) {
    const userCodeQuery = await this.dataSource.query(
      `
SELECT * FROM "UsersPasswordRecoveryCodes"
WHERE "code"=$1
    `,
      [recoveryCode],
    );
    const codeData = userCodeQuery[0];

    if (!codeData) {
      throw BadRequestDomainException.create(
        'recovery code is incorrect, expired or already been applied',
        'code',
      );
    }
    if (codeData.expirationDate < new Date()) {
      throw BadRequestDomainException.create(
        'recovery code is incorrect, expired or already been applied',
        'code',
      );
    }

    return userCodeQuery[0].userId;
  }

  async useRecoveryCode(dto) {
    await this.dataSource.query(
      `
UPDATE "Users"
SET "password"=$2
WHERE "id"=$1 AND "deletedAt" IS NULL
    `,
      [dto.userId, dto.password],
    );

    await this.dataSource.query(
      `
UPDATE "UsersPasswordRecoveryCodes"
SET "code"=null, "expirationDate"=null
WHERE "userId"=$1
`,
      [dto.userId],
    );
  }

  async selectByEmailCode(emailCode: string) {
    const userCodeQuery = await this.dataSource.query(
      `
SELECT * FROM "UsersEmailConfirmationCodes"
WHERE "code"=$1
    `,
      [emailCode],
    );
    return userCodeQuery[0];
  }

  async confirmEmail(userId: string) {
    await this.dataSource.query(
      `
UPDATE "UsersEmailConfirmationCodes"
SET "code"=null, "expirationDate"=null, "isConfirmed"=true
WHERE "userId"=$1    
    `,
      [userId],
    );
  }

  async resendCode(dto) {
    await this.dataSource.query(
      `
    UPDATE "UsersEmailConfirmationCodes"
    SET "code"=$1, "expirationDate"=$2
    WHERE "userId"=$3
    `,
      [dto.code, dto.expirationDate, dto.userId],
    );
  }

  async selectByEmailJoinCode(email: string) {
    const result = await this.dataSource.query(
      `
SELECT * FROM "Users" u
LEFT JOIN "UsersEmailConfirmationCodes" ue ON u."id" = ue."userId"
WHERE u."email"=$1
    `,
      [email],
    );

    return result[0];
  }
}
