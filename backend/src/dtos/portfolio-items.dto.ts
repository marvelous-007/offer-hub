export interface CreatePortfolioItemDto {
  user_id: string;
  title: string;
  description?: string;
  project_url?: string;
  image_urls?: string[];
  is_featured?: boolean;
}

export interface UpdatePortfolioItemDto {
  title?: string;
  description?: string;
  project_url?: string;
  image_urls?: string[];
  is_featured?: boolean;
}
