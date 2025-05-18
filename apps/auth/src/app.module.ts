import { ModuleModule } from '@module/module';
import { Module } from '@nestjs/common';
import { AuthModule } from './router/auth/auth.module';
import { UserModule } from './router/user/user.module';

@Module({
    imports: [ModuleModule, AuthModule, UserModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
