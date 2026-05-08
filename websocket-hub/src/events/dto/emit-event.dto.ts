import { IsString, IsOptional, IsObject, IsNotEmpty } from 'class-validator';

export class EmitEventDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsNotEmpty()
  @IsString()
  event: string;

  @IsNotEmpty()
  @IsObject()
  payload: any;
}
