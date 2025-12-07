import { IsNotEmpty, IsString } from 'class-validator';

export class LogOutDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
