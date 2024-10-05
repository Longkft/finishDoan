import { Injectable } from '@nestjs/common';
import { CacheService } from './cache.service';
import { ExtendedSocket } from 'src/common/interfaces/extended-socket.interface';
import { TasksService } from './task.service';
import { SocketEventName } from 'src/common/enums/event-name.enum';
import { Server } from 'socket.io';
import { BattleRoom } from 'src/common/enums/room-battle.enum';
import { RoomSchema } from 'src/common/schema/room.schema';
import { HistoryService } from './history.service';
import { GetHistoryDto } from 'src/dto/history.dto';
import { MatchRoomDto } from 'src/dto/room.dto';

@Injectable()
export class SocketService {
    constructor(
        private readonly cacheService: CacheService,
        private readonly taskService: TasksService,
        private histortyService: HistoryService,
    ) {}

    joinRoom(client: ExtendedSocket, io: Server, matchRoomDto: MatchRoomDto) {
        const roomCheck = this.cacheService.getBattleRoomEmpty(client._id, matchRoomDto.levelSelect);

        if (!roomCheck) {
            const newRoom = this.cacheService.addBattleRoom(client, matchRoomDto);
            client.join(newRoom.roomId);

            this.taskService.addTimeout(newRoom.roomId, 32000, () => {
                this.taskService.deleteTimeout(newRoom.roomId);

                this.cacheService.deleteBattleRoom(newRoom.roomId);
                client.leave(newRoom.roomId);

                client.emit(SocketEventName.SERVER_MATCH_TIMEOUT);
            });
        } else {
            this.taskService.deleteTimeout(roomCheck.roomId);

            roomCheck.users.push({ userId: client._id, socketId: client.id, email: client.email });
            client.join(roomCheck.roomId);

            io.to(roomCheck.roomId).emit(SocketEventName.SERVER_MATCH_SUCCESS);
        }
    }

    readyGame(userId: string, roomId: string, io: Server) {
        const room = this.cacheService.getBattleRoom(roomId);
        if (room) {
            room.usersReady.push(userId);
            if (room.usersReady.length === BattleRoom.MaX_USER) {
                room.isStartGame = true;

                io.to(room.roomId).emit(SocketEventName.SERVER_START_GAME);

                this.taskService.addTimeout(room.roomId, 180000, async () => {
                    await this.endGame(room, io);
                });
            }
        }
    }

    async winGame(roomId: string, userId: string, io: Server) {
        const room = this.cacheService.getBattleRoom(roomId);
        if (room && room.isStartGame && !room.isEndGame) await this.endGame(room, io, userId);
    }

    private async endGame(room: RoomSchema, io: Server, winner: string = null) {
        this.taskService.deleteTimeout(room.roomId);

        room.isEndGame = true;
        io.to(room.roomId).emit(SocketEventName.SERVER_END_GAME, {
            result: winner ? BattleRoom.BATTLE_RESULT_WIN_LOSE : BattleRoom.BATTLE_RESULT_DRAW,
            winner,
        });

        for (const user of room.users) {
            const socket = io.sockets.sockets.get(user.socketId);
            if (socket) socket.leave(room.roomId);
        }

        const winnerId = winner ? winner : room.users[0].userId;
        const loserId = winner ? room.users.find((usr) => usr.userId !== winner).userId : room.users[1].userId;
        await this.histortyService.updateHistory(winnerId, loserId, winner, room.levelSelect);

        this.cacheService.deleteBattleRoom(room.roomId);
        room = null;
    }

    sendIcon(client: ExtendedSocket, roomId: string, icon: number) {
        client.to(roomId).emit(SocketEventName.SERVER_SEND_ICON, icon);
    }

    leaveRoom(client: ExtendedSocket, roomId: string) {
        const room = this.cacheService.getBattleRoom(roomId);
        if (room) {
            const index = room.users.findIndex((u) => u.userId === client._id);
            if (index > -1) {
                room.users.splice(index, 1);
                client.leave(roomId);
            }
        }
    }

    async getHistory(getHistoryDto: GetHistoryDto) {
        return await this.histortyService.getHistory(getHistoryDto);
    }

    getCountRoom() {
        return this.cacheService.getCountRoom();
    }

    getRoomPlaying() {
        return this.cacheService.getRoomPlaying();
    }
}
