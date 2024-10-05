import { OmitType } from '@nestjs/mapped-types';
import { IsEmail, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;

    @IsOptional()
    @IsString()
    role?: string;
}

export class VerifyUserDto extends OmitType(CreateUserDto, ['role' as const]) {}
