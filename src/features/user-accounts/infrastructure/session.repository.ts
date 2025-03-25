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

export class SessionRepository {
  constructor(
    @InjectModel(Session.name) private readonly SessionModel: SessionModelType,
  ) {}

  async findByDeviceId(id: string): Promise<SessionDocument | null> {
    return this.SessionModel.findOne({
      deviceId: new Types.ObjectId(id),
      deletedAt: null,
    });
  }

  async findOrUnauthorized(id: string): Promise<SessionDocument> {
    const session = await this.findByDeviceId(id);
    if (!session) {
      throw UnauthorizedDomainException.create();
    }

    return session;
  }

  async save(session: SessionDocument): Promise<void> {
    await session.save();
  }

  async deleteOther(userId: string, deviceId: string): Promise<void> {
    await this.SessionModel.deleteMany({
      userId: new Types.ObjectId(userId),
      deviceId: { $ne: new Types.ObjectId(deviceId) },
    });
  }

  async deleteDevice(userId: string, deviceId: string): Promise<void> {
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
  }
}
