import { RecipeType } from "../recipe-types";

export type TAuth = {
  user: TUser | null;
  token: string;
  tokenExpiration: string;
};
export type TUser = {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: string;
  status: string;
  image: string;
  description: string;
  recipes: RecipeType[];
  favorites: RecipeType[];
  shoppingList: { name: string; amount: string; id: string }[];
};
