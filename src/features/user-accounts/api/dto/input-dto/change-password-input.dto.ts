import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';
import { ChangePasswordDto } from '../../../dto/change-password.dto';
import { Trim } from '../../../../../core/decorators/transform/trim';

export class ChangePasswordInputDto implements ChangePasswordDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  newPassword: string;
  @Trim()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  recoveryCode: string;
}
