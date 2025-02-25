export class CreateCategoryDto {
    name: string;
    description?: string;
    slug: string;
    icon_url?: string;
    parent_category_id?: string;
    is_active?: boolean;
  }
  
  export class UpdateCategoryDto {
    name?: string;
    description?: string;
    slug?: string;
    icon_url?: string;
    parent_category_id?: string;
    is_active?: boolean;
  }
  