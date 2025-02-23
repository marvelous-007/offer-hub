export class PortfolioItemEntity {
  portfolio_item_id: string;
  user_id?: string;
  title: string;
  description?: string;
  project_url?: string;
  image_urls?: string[];
  created_at: Date;
  is_featured: boolean;

  constructor(data: Partial<PortfolioItemEntity>) {
    this.portfolio_item_id = data.portfolio_item_id ?? "";
    this.user_id = data.user_id;
    this.title = data.title ?? "";
    this.description = data.description;
    this.project_url = data.project_url;
    this.image_urls = data.image_urls ?? [];
    this.created_at = data.created_at ?? new Date();
    this.is_featured = data.is_featured ?? false;
  }
}
