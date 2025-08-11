import type { RouteObject } from "react-router-dom";
import App from "./App";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Goals from "./pages/Goals";
import Expeditions from "./pages/Expeditions";
import Locales from "./pages/Locales";
import Pokedex from "./pages/Pokedex";

export const routes = [
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            // {
            //     path: "/expeditions",
            //     element: <Expeditions />,
            // },
            // {
            //     path: "/locales",
            //     element: <Locales />
            // },
            // {
            //     path: "/users/:id",
            //     element: <Profile />,
            // },
            // {
            //     path: "/users/:id/pokedex",
            //     element: <Pokedex />
            // },
            // {
            //     path: "/goals",
            //     element: <Goals />,
            // },
            // {
            //     path: "/signup",
            //     element: <Signup />
            // },
            // {
            //     path: "/login",
            //     element: <Login />
            // },
        ]
    }
];