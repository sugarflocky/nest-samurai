export class MeViewDto {
  email: string;
  login: string;
  userId: string;

  static mapToView(user): MeViewDto {
    const dto = new MeViewDto();

    dto.email = user.email;
    dto.login = user.login;
    dto.userId = user.id;

    return dto;
  }
}
