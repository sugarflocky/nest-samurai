export class UpdateSessionDto {
  ip: string;
  title: string;
  issuedAt: string;
  userId: string;
  deviceId: string;
}

export class UpdateSessionInServiceDto {
  ip: string;
  title: string;
  deviceId: string;
  userId: string;
}
