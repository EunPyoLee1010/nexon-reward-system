import { Module } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';

@Module({
    controllers: [AuthService],
    providers: [AuthService, AuthRepository],
})
export class AuthModule {}
