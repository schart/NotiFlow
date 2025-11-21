export const rabbitmqConfig = {
  uri: String(process.env.RABBITMQ_URL) || 'amqp://guest:guest@rabbitmq:5672',

  exchange: {
    name: 'notifications.direct',
    type: 'direct',
  },

  queues: {
    name: 'notifications_queue',
    routingKeys: {
      EMAIL: 'email-notification',
      SMS: 'sms -notification',
    },
  },
};
