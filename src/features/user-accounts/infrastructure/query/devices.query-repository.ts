import { Injectable } from '@nestjs/common';
import { SessionViewDto } from '../../api/dto/view-dto/session-view.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DevicesQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  /*  async getAll(userId: string): Promise<SessionViewDto[]> {
    const sessions = await this.SessionModel.find({
      userId: new Types.ObjectId(userId),
      deletedAt: null,
    });

    const items = sessions.map((session) => SessionViewDto.mapToView(session));
    return items;
  }*/

  async selectAll(userId: string): Promise<SessionViewDto[]> {
    const sessions = await this.dataSource.query(
      `
    SELECT * FROM "UsersSessions"
    WHERE "userId" = $1 AND "deletedAt" IS NULL
    `,
      [userId],
    );

    const items = sessions.map((session) => SessionViewDto.mapToView(session));
    return items;
  }
}
