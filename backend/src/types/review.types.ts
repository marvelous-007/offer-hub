
// DB Model for Review (matches DB schema)
export interface Review {
  id: string;
  from_user_id: string;
  to_user_id: string;
  contract_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

// DTO for creating a review
export interface CreateReviewDTO {
  from_user_id: string;
  to_user_id: string;
  contract_id: string;
  rating: number;
  comment?: string;
}

// DTO for updating a review
export interface UpdateReviewDTO {
  rating?: number;
  comment?: string;
}

// Response type for returning a review (with user info)
export interface ReviewResponse {
  id: string;
  from_user: {
    id: string;
    username?: string;
    name?: string;
  };
  to_user: {
    id: string;
    username?: string;
    name?: string;
  };
  contract_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

// List response for paginated reviews
export interface PaginatedReviews {
  reviews: ReviewResponse[];
  current_page: number;
  total_pages: number;
  total_items: number;
  per_page: number;
}
