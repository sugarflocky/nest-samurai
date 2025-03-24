export class UserContextDto {
  id: string;
  deviceId?: string;
}
export type Nullable<T> = { [P in keyof T]: T[P] | null };
