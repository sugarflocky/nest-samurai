import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ChangePasswordDto } from '../../../dto/change-password.dto';
import { toTrimmedString } from '../../../../../core/pipes/to-trimmed-string.pipe';
import { Transform } from 'class-transformer';

export class ChangePasswordInputDto implements ChangePasswordDto {
  @Transform(({ value }) => toTrimmedString(value))
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  newPassword: string;
  @Transform(({ value }) => toTrimmedString(value))
  @IsString()
  @IsNotEmpty()
  recoveryCode: string;
}
