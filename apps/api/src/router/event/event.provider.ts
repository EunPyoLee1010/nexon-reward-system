import { NexonConfigModule } from '@module/module/core/config/config.module';
import { NexonConfigService } from '@module/module/core/config/config.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

export const EventProvider = ClientsModule.registerAsync([
    {
        name: 'EVENT_SERVICE',
        imports: [NexonConfigModule],
        inject: [NexonConfigService],
        useFactory: async (configService: NexonConfigService) => {
            const config = configService.getConfig();
            const { host, port } = config.getServerInfo().event ?? {};

            return { transport: Transport.TCP, options: { host, port } };
        },
    },
]);
