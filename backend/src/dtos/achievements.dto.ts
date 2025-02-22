export class CreateAchievementDto {
    name: string;
    description: string;
    criteria: any;
    nft_contract_address?: string;
  }
  
  export class UpdateAchievementDto {
    name?: string;
    description?: string;
    criteria?: any;
    nft_contract_address?: string;
  }
  