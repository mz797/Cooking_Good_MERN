import { createBrowserRouter } from "react-router-dom";
import RecipesPage from "../Pages/Recipe/RecipesPage";
import RootPage from "../Pages/Root";
import Cart from "../Pages/Cart";
import Planner from "../Pages/Planner";
import RecipeDetailsPage from "../Pages/Recipe/RecipeDetailsPage";
import AddRecipePage from "../Pages/Recipe/AddRecipePage";
import Login from "../Pages/Auth/Login";
import Signup from "../Pages/Auth/Signup";
import NotFound from "../Pages/NotFound/NotFound";
import CategoriesPage from "../Pages/Admin/Categories/CategoriesPage";
import RecipesByCategoryPage from "../Pages/Recipe/RecipesByCategoryPage";
import RecipesTable from "../Pages/Admin/Recipes/RecipesTable";
import ReportsPage from "../Pages/Admin/Reports/ReportsPage";
import UsersPage from "../Pages/Admin/Users/UsersPage";
import UserProfilePage from "../Pages/User/UserProfilePage";
import ActivateAccount from "../Pages/Auth/ActivateAccount";
import PostListPage from "../Pages/Admin/Posts/PostListPage";
import RecipesListPage from "../Pages/Recipe/RecipesListPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    errorElement: <NotFound />,
    children: [
      { path: "auth/login", element: <Login /> },
      { path: "auth/signup", element: <Signup /> },
      { path: "user/activate/:token", element: <ActivateAccount /> },
      {
        path: "category/:categoryId",
        element: <RecipesByCategoryPage />,
      },
      {
        path: "recipes/category/:categoryId",
        element: <RecipesTable />,
      },
      { path: "reports", element: <ReportsPage /> },
      { path: "user-profile/:userId", element: <UserProfilePage /> },
      { path: "users", element: <UsersPage /> },
      { path: "posts", element: <PostListPage /> },

      {
        path: "recipes-list",
        element: <RecipesListPage />,
      },
      {
        path: "recipes",
        element: <RecipesPage />,
      },
      { path: "recipes/:id", element: <RecipeDetailsPage /> },
      { path: "add-recipe", element: <AddRecipePage /> },
      { path: "edit-recipe/:id", element: <AddRecipePage /> },
      { path: "cart", element: <Cart /> },
      { path: "planner", element: <Planner /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "", element: <RecipesPage /> },
    ],
  },
]);
export const notAuthRouter = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    children: [
      { path: "auth/login", element: <Login /> },
      { path: "auth/signup", element: <Signup /> },
      { path: "user/activate/:token", element: <ActivateAccount /> },
      {
        path: "recipes-list",
        element: <RecipesListPage />,
      },
      {
        path: "recipes",
        element: <RecipesPage />,
      },
      {
        path: "category/:categoryId",
        element: <RecipesByCategoryPage />,
      },
      { path: "reports", element: <ReportsPage /> },
      { path: "posts", element: <PostListPage /> },
      { path: "user-profile/:userId", element: <UserProfilePage /> },
      { path: "users", element: <UsersPage /> },
      { path: "cart", element: <Cart /> },
      { path: "planner", element: <Planner /> },
      { path: "recipes/:id", element: <RecipeDetailsPage /> },
      { path: "", element: <RecipesPage /> },
    ],
    errorElement: <NotFound />,
  },
]);
