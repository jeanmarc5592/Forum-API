export interface TransformedComment {
  id: string;
  content: string;
  user?: {
    id: string;
    name: string;
  };
  topic?: {
    id: string;
    title: string;
  };
  created_at: Date;
  updated_at: Date;
}
