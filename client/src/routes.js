import App from "./App";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Goals from "./pages/Goals";

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