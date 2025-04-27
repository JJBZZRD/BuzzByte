export interface ProjectImageWithId {
  id: number | string;
  url: string;
  alt?: string;
  description?: string;
  isMainImage?: boolean;
  order?: number;
  isNew?: boolean;
} 