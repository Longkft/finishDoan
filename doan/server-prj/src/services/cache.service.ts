import { Injectable } from '@nestjs/common';
import { BattleRoom } from 'src/common/enums/room-battle.enum';
import { ExtendedSocket } from 'src/common/interfaces/extended-socket.interface';
import { RoomSchema } from 'src/common/schema/room.schema';
import { MatchRoomDto } from 'src/dto/room.dto';
import { ulid } from 'ulid';

@Injectable()
export class CacheService {
    listBattleRoom: Array<RoomSchema> = [];

    getBattleRoomEmpty(userId: string, levelSelect: number) {
        return this.listBattleRoom.find(
            (r) =>
                r.users.findIndex((usr) => usr.userId === userId) < 0 &&
                r.users.length < BattleRoom.MaX_USER &&
                !r.isStartGame &&
                r.levelSelect === levelSelect,
        );
    }

    getBattleRoom(roomId: string) {
        return this.listBattleRoom.find((r) => r.roomId === roomId);
    }

    addBattleRoom(client: ExtendedSocket, matchRoomDto: MatchRoomDto) {
        const roomId = ulid();
        const room = new RoomSchema({
            roomId,
            users: [{ userId: client._id, socketId: client.id, email: client.email }],
            ...matchRoomDto,
        });
        this.listBattleRoom.push(room);
        return room;
    }

    deleteBattleRoom(roomId: string) {
        const roomIndex = this.listBattleRoom.findIndex((r) => r.roomId === roomId);
        if (roomIndex > -1) {
            this.listBattleRoom.splice(roomIndex, 1);
            roomId = null;
        }
    }

    getCountRoom() {
        return this.listBattleRoom.length;
    }

    getRoomPlaying() {
        return this.listBattleRoom.filter((room) => room.users.length === BattleRoom.MaX_USER).slice(0, 5);
    }
}
