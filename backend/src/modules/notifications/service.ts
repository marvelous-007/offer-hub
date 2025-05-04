import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateNotificationDto, UpdateNotificationDto } from "./dto";
import { Notification } from "./entity";
import { User } from "../users/entity";
import { NotificationsGateway } from "./notification.gateway";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly Gateway: NotificationsGateway,
    @InjectQueue("notifications") private notificationQueue: Queue
  ) {}

  async findAll(): Promise<Notification[]> {
    return this.repo.find({ relations: ["user"] });
  }

  async create(dto: CreateNotificationDto): Promise<Notification> {
    const user = await this.userRepo.findOne({
      where: { user_id: dto.user_id },
    });
    if (!user)
      throw new NotFoundException(`User with ID ${dto.user_id} not found.`);

    const notification = this.repo.create({ ...dto, user });
    const savedNotification = await this.repo.save(notification);

    await this.notificationQueue.add("send", {
      user_id: dto.user_id,
      message: {
        type: dto.type,
        title: dto.title,
        content: dto.content,
        action_url: dto.action_url,
      },
    });

    return savedNotification;
  }

  async findById(notification_id: string): Promise<Notification> {
    const notification = await this.repo.findOne({
      where: { notification_id },
      relations: ["user"],
    });
    if (!notification)
      throw new NotFoundException(
        `Notification with ID ${notification_id} not found.`
      );
    return notification;
  }

  async update(
    notification_id: string,
    dto: UpdateNotificationDto
  ): Promise<Notification> {
    const notification = await this.findById(notification_id);
    Object.assign(notification, dto);
    return this.repo.save(notification);
  }

  async delete(notification_id: string): Promise<void> {
    const result = await this.repo.delete(notification_id);
    if (result.affected === 0)
      throw new NotFoundException(
        `Notification with ID ${notification_id} not found.`
      );
  }
}
