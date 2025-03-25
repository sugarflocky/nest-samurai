import { SessionDocument } from '../../../domain/session.entity';

export class SessionViewDto {
  ip: string;
  title: string;
  lastActiveDate: Date;
  deviceId: string;

  static mapToView(session: SessionDocument): SessionViewDto {
    const dto = new SessionViewDto();

    dto.ip = session.ip;
    dto.title = session.title;
    dto.lastActiveDate = session.updatedAt;
    dto.deviceId = session.deviceId.toString();

    return dto;
  }
}
