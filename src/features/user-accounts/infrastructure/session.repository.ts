import { InjectModel } from '@nestjs/mongoose';
import {
  Session,
  SessionDocument,
  SessionModelType,
} from '../domain/session.entity';
import { UnauthorizedDomainException } from '../../../core/exceptions/domain-exceptions';
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
}
