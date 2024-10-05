import { ResponseMessage } from 'src/common/enums/response-msg.enum';
import { StatusCode } from 'src/common/enums/status-code.enum';

export class SuccessResponse {
    message: string;
    status: number;
    metadata: any;
    constructor({ message, status = StatusCode.OK, reasonStatusCode = ResponseMessage.OK, metadata = {} }) {
        this.message = !message ? reasonStatusCode : message;
        this.status = status;
        this.metadata = metadata;
    }

    send(res, headers = {}) {
        return res.status(this.status).json(this);
    }
}

export class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({
            message,
            status: StatusCode.OK,
            reasonStatusCode: ResponseMessage.OK,
            metadata,
        });
    }
}

export class CREATED extends SuccessResponse {
    constructor({ message, metadata }) {
        super({
            message,
            status: StatusCode.CREATED,
            reasonStatusCode: ResponseMessage.CREATED,
            metadata,
        });
    }
}
