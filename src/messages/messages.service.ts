import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatMessage } from './schemas/messages.schema';
import { ChatRoom } from './schemas/chat-rooms.schema';
import { ChatMessageDto } from './dto/chat-message.dto';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { PusherService } from './pusher.service';

@Injectable()
@UseGuards(AccessTokenGuard)
export class MessagesService {
  constructor(
    @InjectModel(ChatMessage.name) private chatMessageModel: Model<ChatMessage>,
    @InjectModel(ChatRoom.name) private chatRoomsModel: Model<ChatRoom>,
    private readonly pusherService: PusherService,
  ) {}
  async getAllChatRooms(receiver_id: string) {
    const data = await this.chatRoomsModel.aggregate<ChatRoom[]>([
      {
        $match: {
          participants: new Types.ObjectId(receiver_id),
        },
      },
      {
        $addFields: {
          participants: {
            $map: {
              input: '$participants',
              as: 'p',
              in: { $toObjectId: '$$p' },
            },
          },
          receiver_id: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$participants',
                  as: 'p',
                  cond: { $ne: ['$$p', new Types.ObjectId(receiver_id)] },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'receiver_id',
          foreignField: '_id',
          as: 'receiver',
          pipeline: [{ $project: { username: 1, image_url: 1 } }],
        },
      },
      { $unwind: '$receiver' },
      { $project: { receiver_id: 0 } },
    ]);

    return data;
  }

  async fetchChatRoom(sender_id: string, receiver_id: string) {
    const participants = [
      new Types.ObjectId(sender_id),
      new Types.ObjectId(receiver_id),
    ].sort();

    const [room] = await this.chatRoomsModel.aggregate<
      ChatRoom & { _id: Types.ObjectId }
    >([
      {
        $match: {
          participants: { $all: participants },
        },
      },
      {
        $addFields: {
          receiver_id: new Types.ObjectId(receiver_id),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'receiver_id',
          foreignField: '_id',
          as: 'receiver',
          pipeline: [{ $project: { username: 1, image_url: 1 } }],
        },
      },
      {
        $unwind: '$receiver',
      },
      {
        $limit: 1,
      },
    ]);

    const messages = await this.chatMessageModel.aggregate([
      {
        $match: {
          chat_room_id: room._id,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'sender',
          pipeline: [{ $project: { username: 1, image_url: 1 } }],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'receiver',
          foreignField: '_id',
          as: 'receiver',
          pipeline: [{ $project: { username: 1, image_url: 1 } }],
        },
      },
      {
        $project: {
          message: 1,
          sender: 1,
          receiver: 1,
          createdAt: 1,
        },
      },
      {
        $unwind: '$sender',
      },
      {
        $unwind: '$receiver',
      },
    ]);

    return { room, messages };
  }

  async pushMessage(
    sender_id: string,
    receiver_id: string,
    body: ChatMessageDto,
  ) {
    const { message } = body;
    const participants = [
      new Types.ObjectId(sender_id),
      new Types.ObjectId(receiver_id),
    ].sort();

    let room = await this.chatRoomsModel
      .findOne({
        participants: { $all: participants },
      })
      .lean();

    if (!room) {
      room = await this.chatRoomsModel.create({
        participants: participants,
        lastMessage: message,
      });
    } else {
      await this.chatRoomsModel.updateOne(
        { _id: room._id },
        { $set: { lastMessage: message } },
      );
    }

    const created = await this.chatMessageModel.create({
      chat_room_id: room._id,
      sender: new Types.ObjectId(sender_id),
      receiver: new Types.ObjectId(receiver_id),
      message,
    });

    const newMessage = await this.chatMessageModel
      .findById(created._id)
      .populate('sender', 'username image_url')
      .populate('receiver', 'username image_url')
      .lean();

    await this.pusherService.trigger(
      `chat-${room._id.toString()}`,
      'new-message',
      newMessage,
    );

    await this.pusherService.trigger('chatrooms', 'fetch-rooms', {
      _id: room._id,
      lastMessage: message,
      receiver: newMessage?.receiver,
    });

    return newMessage;
  }
}
