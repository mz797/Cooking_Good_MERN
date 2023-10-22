import { RecipeType } from "../recipe-types";

export interface recipeProps {
  recipe: RecipeType;
  onDelete?: (id: string) => void;
}
