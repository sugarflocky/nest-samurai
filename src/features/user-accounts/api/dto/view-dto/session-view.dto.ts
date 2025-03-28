import { SessionDocument } from '../../../domain/session.entity';

export class SessionViewDto {
  ip: string;
  title: string;
  lastActiveDate: Date;
  deviceId: string;

  static mapToView(session): SessionViewDto {
    const dto = new SessionViewDto();

    dto.ip = session.ip;
    dto.title = session.title;
    dto.lastActiveDate = new Date(session.issuedAt * 1000);
    dto.deviceId = session.deviceId;

    return dto;
  }
}
