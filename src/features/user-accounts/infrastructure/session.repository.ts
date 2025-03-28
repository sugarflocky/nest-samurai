import { InjectModel } from '@nestjs/mongoose';
import {
  Session,
  SessionDocument,
  SessionModelType,
} from '../domain/session.entity';
import {
  ForbiddenDomainException,
  NotFoundDomainException,
  UnauthorizedDomainException,
} from '../../../core/exceptions/domain-exceptions';
import { Types } from 'mongoose';
import { CreateSessionDto } from '../dto/create-session.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UpdateSessionDto } from '../dto/update-session.dto';

export class SessionRepository {
  constructor(
    @InjectModel(Session.name) private readonly SessionModel: SessionModelType,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  /*  async findByDeviceId(id: string): Promise<SessionDocument | null> {
    return this.SessionModel.findOne({
      deviceId: new Types.ObjectId(id),
      deletedAt: null,
    });
  }*/

  /*  async findOrUnauthorized(id: string): Promise<SessionDocument> {
    const session = await this.findByDeviceId(id);
    if (!session) {
      throw UnauthorizedDomainException.create();
    }

    return session;
  }*/

  /*  async deleteOther(userId: string, deviceId: string): Promise<void> {
    await this.SessionModel.deleteMany({
      userId: new Types.ObjectId(userId),
      deviceId: { $ne: new Types.ObjectId(deviceId) },
    });
  }*/

  /*  async deleteDevice(userId: string, deviceId: string): Promise<void> {
    const device = await this.findByDeviceId(deviceId);
    if (!device) {
      throw NotFoundDomainException.create();
    }

    if (device.userId.toString() !== userId) {
      throw ForbiddenDomainException.create();
    }

    await this.SessionModel.deleteOne({
      deviceId: new Types.ObjectId(deviceId),
    });
  }*/

  async create(dto: CreateSessionDto) {
    await this.dataSource.query(
      `
INSERT INTO "UsersSessions"(
"userId", "deviceId", "issuedAt", "ip", "title", "createdAt", "deletedAt")
VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        dto.userId,
        dto.deviceId,
        dto.issuedAt,
        dto.ip,
        dto.title,
        dto.createdAt,
        dto.deletedAt,
      ],
    );
  }

  async update(dto: UpdateSessionDto) {
    await this.dataSource.query(
      `
    UPDATE "UsersSessions"
    SET "issuedAt"=$1, "ip"=$2, "title"=$3
    WHERE "userId"=$4 AND "deviceId"=$5 AND "deletedAt" IS NULL
    `,
      [dto.issuedAt, dto.ip, dto.title, dto.userId, dto.deviceId],
    );
  }

  async delete(deviceId: string, userId: string) {
    const device = await this.select(deviceId);
    if (!device) {
      throw NotFoundDomainException.create();
    }

    if (device.userId !== userId) {
      throw ForbiddenDomainException.create();
    }

    await this.dataSource.query(
      `UPDATE "UsersSessions"
SET "deletedAt"=$3
WHERE "userId"=$2
AND"deviceId"=$1 
AND "deletedAt" IS NULL `,
      [deviceId, userId, new Date()],
    );
  }

  async deleteOtherDevices(deviceId: string, userId: string) {
    await this.dataSource.query(
      `UPDATE "UsersSessions"
SET "deletedAt" = $3
WHERE "userId" = $2
AND "deviceId" != $1
AND "deletedAt" IS NULL`,
      [deviceId, userId, new Date()],
    );
  }

  async select(deviceId: string) {
    const sessionQuery = await this.dataSource.query(
      `
SELECT * FROM "UsersSessions" us
WHERE us."deviceId"=$1 AND us."deletedAt" IS NULL
`,
      [deviceId],
    );
    return sessionQuery[0];
  }

  async selectOrUnauthorized(deviceId: string) {
    const session = await this.select(deviceId);
    if (!session) {
      throw UnauthorizedDomainException.create();
    }
    return session;
  }
}
