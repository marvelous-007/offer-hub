import { CreateActivityLogsDto, UpdateActivityLogsDto } from "@/dtos";
import { ActivityLogsRepository } from "@/repositories";


export class ActivityLogsService {
    private readonly repo: ActivityLogsRepository;

    constructor() {
        this.repo = new ActivityLogsRepository();
    }

    async create(activityLogData: CreateActivityLogsDto) {
        return this.repo.create(activityLogData);
    }

    async findById(id: string) {
        return this.repo.findById(id);
    }

    async findAll() {
        return this.repo.findAll();
    }

    async update(id: string, data: UpdateActivityLogsDto) {
        return this.repo.update(id, data);
    }

    async delete(id: string) {
        await this.findById(id);
        return this.repo.delete(id);
    }
}