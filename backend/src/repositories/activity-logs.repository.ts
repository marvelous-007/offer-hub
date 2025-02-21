import { InjectRepository } from "@nestjs/typeorm";
import { getRepository, Repository } from "typeorm";
import { ActivityLogs } from "@/entities";


export class ActivityLogsRepository {
    repo: Repository<ActivityLogs>;

    constructor() {
        this.repo = getRepository(ActivityLogs);
    }

    async create(activityLogData: Partial<ActivityLogs>) {
        const log = this.repo.create(activityLogData);

        return this.repo.save(log);
    }

    async findById(id: string): Promise<ActivityLogs | null> {
        return this.repo.findOneBy({ log_id: id });
    }

    async findAll(): Promise<ActivityLogs[]> {
        return this.repo.find();
    }

    async update(id: string, activityLogData: Partial<ActivityLogs>) {
        const log = await this.findById(id);
        if (!log) {
            return null;
        }
        Object.assign(log, activityLogData)

        return this.repo.save(log);
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete({ log_id: id });
    }
}