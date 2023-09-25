export interface RecipeType {
  _id?: string;
  name: string;
  image: string;
  categories: { id: number; name: string }[];
  time: number;
  difficulty: number;
  ingredients: { name: string; amount: string }[];
  personCount: number;
  description: string[];
  shortDescription: string;
  addedAt: Date;
  creator: any;
  comments: {
    id: string;
    content: string;
    creator: any;
    addedAt: Date;
  }[];
  likes: { creator: any }[];
  rates: { creator: string; rate: number };
  commentImages: { image: string; creator: any; addedAt: Date }[];
}
