import { Injectable } from '@nestjs/common';
import { SessionViewDto } from '../../api/dto/view-dto/session-view.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionModelType } from '../../domain/session.entity';
import { Types } from 'mongoose';

@Injectable()
export class DevicesQueryRepository {
  constructor(
    @InjectModel(Session.name) private SessionModel: SessionModelType,
  ) {}

  async getAll(userId: string): Promise<SessionViewDto[]> {
    const sessions = await this.SessionModel.find({
      userId: new Types.ObjectId(userId),
      deletedAt: null,
    });

    const items = sessions.map((session) => SessionViewDto.mapToView(session));
    return items;
  }
}
