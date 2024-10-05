import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetHistoryDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsOptional()
    @IsNumber()
    page: number;

    @IsOptional()
    @IsNumber()
    limit: number;
}
