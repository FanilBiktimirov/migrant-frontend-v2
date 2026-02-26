import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { MigrantsPage } from "../pages/MigrantsPage";
import { MigrantDetailsPage } from "../pages/MigrantDetailsPage";
import { AdminCategoriesPage } from "../pages/AdminCategoriesPage";

export const router = createBrowserRouter([
    { path: "/login", element: <LoginPage /> },
    { path: "/", element: <MigrantsPage /> },
    { path: "/migrants/:id", element: <MigrantDetailsPage /> },
    { path: "/admin/categories", element: <AdminCategoriesPage /> },
]);