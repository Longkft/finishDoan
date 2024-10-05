import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ExtendedRequest } from 'src/common/interfaces/extended-request.interface';
import { CREATED, OK } from 'src/core/success.response';
import { CreateUserDto, VerifyUserDto } from 'src/dto/user.dto';
import { UsersService } from 'src/services/user.service';

@Controller('v1/api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/signup')
    async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        new CREATED({
            message: 'User created successfully',
            metadata: await this.usersService.createUser({ ...createUserDto, role: 'user' }),
        }).send(res);
    }

    @Post('/login')
    async loginUser(@Body() verifyUserDto: VerifyUserDto, @Res() res: Response) {
        new OK({
            message: 'User created successfully',
            metadata: await this.usersService.verifyUser(verifyUserDto),
        }).send(res);
    }

    @Post('/handlerefreshtoken')
    async handleRefreshToken(@Req() req: ExtendedRequest, @Res() res: Response) {
        new OK({
            message: 'refresh token successfully',
            metadata: await this.usersService.handleRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore,
            }),
        }).send(res);
    }

    @Get('/logout')
    async logout(@Req() req: ExtendedRequest, @Res() res: Response) {
        new OK({
            message: 'logout successful',
            metadata: await this.usersService.logout(req.keyStore),
        }).send(res);
    }
}
