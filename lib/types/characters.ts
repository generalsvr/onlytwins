export interface Media {
  type: 'image' | 'video';
  src: string;
  poster?: string;
}

export interface Character {
  id: number;
  name: string;
  username?: string;
  age: number;
  bio?: string;
  about?: string;
  followers?: string;
  description: string;
  verified: boolean;
  media: Media[];
  isPremium: boolean;
  profilePath: string;
  interests?: string[];
  relationshipLevel?: string;
  progress?: number;
  galleryImages?: string[];
  posts?: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
