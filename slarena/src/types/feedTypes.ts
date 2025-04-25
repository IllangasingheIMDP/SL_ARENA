export interface FeedUser {
  name: string;
}

export interface FeedItem {
  id: string;
  media_type: 'photo' | 'video';
  title: string;
  description: string;
  media_url: string;
  upload_date: string;
  user: FeedUser;
}

export interface FeedGroup {
  [date: string]: FeedItem[];
}

export interface FeedPagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  has_more: boolean;
}

export interface FeedResponse {
  success: boolean;
  data: {
    items: FeedGroup;
    pagination: FeedPagination;
  };
} 