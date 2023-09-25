export interface RecipeType {
  _id: any;
  id: string;
  name: string;
  image: string;
  categories: { id: string; name: string }[];
  time: number;
  difficulty: number;
  ingredients: { name: string; amount: string }[];
  personCount: number;
  description: { content: string }[];
  shortDescription: string;
  creator: any;
  rates: { rate: number; creator: any }[];
  addedAt: Date;
  comments: { creator: any; content: string; addedAt: string; id: string }[];
  likes: { creator: string }[];
  visitCount: number;
  commentImages: { id: string; image: string; creator: any; addedAt: Date }[];
}
