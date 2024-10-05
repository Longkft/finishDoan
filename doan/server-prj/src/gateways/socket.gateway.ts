import { UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketEventName } from 'src/common/enums/event-name.enum';
import { ExtendedSocket } from 'src/common/interfaces/extended-socket.interface';
import { WsCatchAllFilter } from 'src/core/ws-catch-all-filter';
import { GetHistoryDto } from 'src/dto/history.dto';
import { MatchRoomDto, RoomIdDto, SendIconDto } from 'src/dto/room.dto';
import { GatewayGuard } from 'src/guards/gateway.guard';
import { SocketService } from 'src/services/socket.service';

@UsePipes(new ValidationPipe())
@UseFilters(new WsCatchAllFilter())
@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class SocketGateWay implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() io: Server;

    afterInit() {}

    handleDisconnect() {}

    handleConnection() {}

    constructor(private readonly sockerService: SocketService) {}

    @UseGuards(GatewayGuard)
    @SubscribeMessage(SocketEventName.CLIENT_MATCH_ROOM)
    clientJoinRoom(@ConnectedSocket() client: ExtendedSocket, @MessageBody() data: MatchRoomDto) {
        this.sockerService.joinRoom(client, this.io, data);
    }

    @SubscribeMessage(SocketEventName.CLIENT_READY_GAME)
    readyGame(@ConnectedSocket() client: ExtendedSocket, @MessageBody() data: RoomIdDto) {
        this.sockerService.readyGame(client._id, data.roomId, this.io);
    }

    @SubscribeMessage(SocketEventName.CLIENT_END_GAME)
    async endGame(@ConnectedSocket() client: ExtendedSocket, @MessageBody() data: RoomIdDto) {
        await this.sockerService.winGame(client._id, data.roomId, this.io);
    }

    @SubscribeMessage(SocketEventName.CLIENT_SEND_ICON)
    sendIcon(@ConnectedSocket() client: ExtendedSocket, @MessageBody() data: SendIconDto) {
        this.sockerService.sendIcon(client, data.roomId, data.icon);
    }

    @SubscribeMessage(SocketEventName.CLIENT_LEAVE_ROOM)
    leaveGame(@ConnectedSocket() client: ExtendedSocket, @MessageBody() data: RoomIdDto) {
        this.sockerService.leaveRoom(client, data.roomId);
    }

    @UseGuards(GatewayGuard)
    @SubscribeMessage(SocketEventName.CLIENT_GET_HISTORY)
    async getHistory(@ConnectedSocket() client: ExtendedSocket, @MessageBody() getHistoryDto: GetHistoryDto) {
        client.emit(SocketEventName.CLIENT_GET_HISTORY, await this.sockerService.getHistory(getHistoryDto));
    }

    getConnectedClientsCount() {
        return this.io.engine.clientsCount;
    }

    getCountRoom() {
        return this.sockerService.getCountRoom();
    }

    getRoomPlaying() {
        return this.sockerService.getRoomPlaying();
    }
}
