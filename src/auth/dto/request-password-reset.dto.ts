import { IsEmail } from 'class-validator';

export class RequestPasswordResetDto {
  @IsEmail()
  correo: string;
}
