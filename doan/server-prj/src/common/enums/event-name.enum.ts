export enum SocketEventName {
    CLIENT_MATCH_ROOM = 'client_match_room',
    SERVER_MATCH_TIMEOUT = 'server_match_timeout',
    SERVER_MATCH_SUCCESS = 'server_match_success',

    CLIENT_READY_GAME = 'client_ready_game',
    SERVER_START_GAME = 'server_start_game',

    CLIENT_END_GAME = 'client_end_game',
    SERVER_END_GAME = 'server_end_game',

    CLIENT_SEND_ICON = 'client_send_icon',
    SERVER_SEND_ICON = 'server_send_icon',

    CLIENT_LEAVE_ROOM = 'client_leave_room',

    CLIENT_GET_HISTORY = 'client_get_history',
}
