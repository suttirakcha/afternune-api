import { Injectable, OnModuleInit } from '@nestjs/common';
import Pusher from 'pusher';

@Injectable()
export class PusherService implements OnModuleInit {
  pusher: Pusher;
  onModuleInit() {
    const {
      PUSHER_APP_ID,
      PUSHER_APP_KEY,
      PUSHER_APP_SECRET,
      PUSHER_APP_CLUSTER,
    } = process.env;

    if (
      !PUSHER_APP_ID ||
      !PUSHER_APP_KEY ||
      !PUSHER_APP_SECRET ||
      !PUSHER_APP_CLUSTER
    ) {
      throw new Error('Missing Pusher environment variables');
    }

    this.pusher = new Pusher({
      appId: PUSHER_APP_ID,
      key: PUSHER_APP_KEY,
      secret: PUSHER_APP_SECRET,
      cluster: PUSHER_APP_CLUSTER,
      useTLS: true,
    });
  }

  async trigger(channel: string, event: string, data: any) {
    await this.pusher.trigger(channel, event, data);
  }
}
