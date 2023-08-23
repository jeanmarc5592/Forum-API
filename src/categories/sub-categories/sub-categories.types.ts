import { Topic } from '@topics/entities/topic.entity';

export interface TransformedSubCategory {
  id: string;
  name: string;
  description: string;
  mainCategoryId: string;
  topics?: Topic[];
}
