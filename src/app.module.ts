import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { NotificationService } from './notifications/services/notification.service';
import { NotificationResolver } from './notifications/resolvers/notification.resolver';
import { PrismaService } from './notifications/services/prisma.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [NotificationService, NotificationResolver, PrismaService],
})
export class NotificationModule {}
