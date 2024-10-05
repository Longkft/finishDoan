import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RoomIdDto {
    @IsString()
    @IsNotEmpty()
    roomId: string;
}

export class SendIconDto extends RoomIdDto {
    @IsNumber()
    @IsNotEmpty()
    icon: number;
}

export class MatchRoomDto {
    @IsNumber()
    @IsNotEmpty()
    levelSelect: number;
}
