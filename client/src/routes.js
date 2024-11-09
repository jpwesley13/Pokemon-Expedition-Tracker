import App from "./App";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Goals from "./pages/Goals";
import Locales from "./pages/Locales";

const routes = [
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/locales",
                element: <Locales />
            },
            {
                path: "/users/:id",
                element: <Profile />
            },
            {
                path: "/goals",
                element: <Goals />,
            },
            {
                path: "/signup",
                element: <Signup />
            },
            {
                path: "/login",
                element: <Login />
            },
        ]
    }
];

export default routes;