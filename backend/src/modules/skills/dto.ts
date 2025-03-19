import { IsUUID, IsString } from "class-validator";

export class CreateSkillDto {
  @IsString()
  name: string;

  @IsUUID()
  category_id: string;
}

export class UpdateSkillDto {
  @IsString()
  name?: string;
}
