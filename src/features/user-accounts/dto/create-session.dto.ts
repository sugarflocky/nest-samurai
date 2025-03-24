export class CreateSessionDto {
  ip: string;
  title: string;
  issuedAt: string;
  userId: string;
  deviceId: string;
}

export class CreateSessionInServiceDto {
  ip: string;
  title: string;
  userId: string;
}
