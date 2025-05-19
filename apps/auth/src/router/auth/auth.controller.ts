import { CHECK_AUTH_MSG_PATTERN, SIGNIN_MSG_PATTERN, SIGNUP_MSG_PATTERN } from '@module/module/define/command.constant';
import { UserLoginReqDto, UserRegisterReqDto } from '@module/module/type/auth.dto';
import { Body, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // 로그인
    @MessagePattern(SIGNIN_MSG_PATTERN)
    async signInUser(@Body() { userid, passwd }: UserLoginReqDto) {
        const userinfo = await this.authService.signInUser({ userid, passwd });
        if (!userinfo) {
            return { statusCode: 400, result: false, mesage: 'failed to login' };
        }

        const token = this.authService.createJwtToken(userinfo);
        return { statusCode: 200, result: true, token };
    }

    // 계정 생성
    @MessagePattern(SIGNUP_MSG_PATTERN)
    async signUpUser(@Body() { userid, name, passwd, role }: UserRegisterReqDto) {
        const now = new Date();
        const isUserExist = await this.authService.isUserExist(userid);
        if (isUserExist) {
            return { statusCode: 200, result: false, message: `userid ${userid} already exist` };
        }

        const registerUser = await this.authService.signUpUser({ userid, name, passwd, role }, now);
        if (!registerUser) {
            return { statusCode: 400, result: false, mesage: 'failed to register user' };
        }

        const token = this.authService.createJwtToken(registerUser);
        return { statusCode: 200, result: true, token };
    }

    @MessagePattern(CHECK_AUTH_MSG_PATTERN)
    async checkAuth(@Body() { userid, name }: { userid: number; name: string }) {
        const userRole = await this.authService.getUserRole(userid);
        return { result: !!userRole, role: userRole };
    }
}
