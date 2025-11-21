import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NotificationService } from '../services/notification.service';
import { Notification } from '../../global/notification.object';
import { NotificationCreateInput } from '../../global/notification.input';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private notificationService: NotificationService) {}

  @Query(() => Notification)
  async fetchLog(): Promise<Notification[]> {
    return await this.notificationService.fetchAll();
  }

  @Mutation(() => String)
  async send(@Args('input') input: NotificationCreateInput): Promise<string> {
    this.notificationService.emitNotification(input);
    return 'Successed Sent Notification';
  }
}
