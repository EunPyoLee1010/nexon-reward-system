import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard, JwtStrategy } from '../../common/guard/auth.guard';
import { AuthController } from './auth.controller';
import { AuthProvider } from './auth.provider';

@Module({
    imports: [PassportModule, AuthProvider],
    controllers: [AuthController],
    providers: [JwtStrategy, JwtAuthGuard],
    exports: [AuthProvider],
})
export class AuthModule {}
