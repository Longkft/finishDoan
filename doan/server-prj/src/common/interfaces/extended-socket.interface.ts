import { Socket } from 'socket.io';

export interface ExtendedSocket extends Socket {
    _id: string;
    email: string;
    connectedSocket: boolean;
}
