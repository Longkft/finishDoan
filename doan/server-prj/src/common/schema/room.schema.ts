export class RoomSchema {
    roomId: string;
    users: Array<{ userId: string; socketId: string; email: string }>;
    usersReady: string[];
    isStartGame: boolean = false;
    isEndGame: boolean = false;
    levelSelect: number;

    constructor(init: Partial<RoomSchema>) {
        Object.assign(this, init);
    }
}
