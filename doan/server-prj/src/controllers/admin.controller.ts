import { Controller, Get, Res } from '@nestjs/common';
import { MethodsAccessControl } from 'src/common/enums/rbac.enum';
import { OK } from 'src/core/success.response';
import { Resource } from 'src/decorators/app.decorator';
import { AdminService } from 'src/services/admin.service';

@Controller('v1/api/admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('/overview')
    @Resource({ resourceName: 'game-management', permission: MethodsAccessControl.READ_ANY })
    async overview(@Res() res: Response) {
        new OK({
            message: 'get overview successfully',
            metadata: await this.adminService.overview(),
        }).send(res);
    }

    @Get('/statsmonthly')
    @Resource({ resourceName: 'game-management', permission: MethodsAccessControl.READ_ANY })
    async getMonthlyActiveUsers(@Res() res: Response) {
        new OK({
            message: 'get overview successfully',
            metadata: await this.adminService.getMonthlyActiveUsers(),
        }).send(res);
    }

    @Get('/statsdaily')
    @Resource({ resourceName: 'game-management', permission: MethodsAccessControl.READ_ANY })
    async getDailyActiveUsersCurrentMonth(@Res() res: Response) {
        new OK({
            message: 'get overview successfully',
            metadata: await this.adminService.getDailyActiveUsersCurrentMonth(),
        }).send(res);
    }
}
