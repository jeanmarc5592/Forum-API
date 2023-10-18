export interface TransformedTopic {
  id: string;
  title: string;
  content: string;
  user: {
    id: string;
    name: string;
  };
  subCategoryId: string;
  closed: boolean;
  created_at: Date;
  updated_at: Date;
}
