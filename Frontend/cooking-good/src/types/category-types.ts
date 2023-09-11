import { RecipeType } from "./recipe-types";

export interface ICategory {
	id: string;
	name: string;
	image: string;
	recipes: RecipeType[];
}
