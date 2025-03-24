export class UpdateSessionDto {
  ip: string;
  title: string;
  issuedAt: string;
}

export class UpdateSessionInServiceDto {
  ip: string;
  title: string;
  deviceId: string;
  userId: string;
}
