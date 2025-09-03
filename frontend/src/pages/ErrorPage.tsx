import { useRouteError, NavLink } from "react-router-dom";
import Header from "../components/Header";

function ErrorPage() {
  const error = useRouteError() as string;
  console.error(error);

  return (
    <main>
      <nav className="navbar">
          <div className="navbutton">
            <NavLink
            to="/"
            >
              Home
            </NavLink>
            <NavLink
            to="/expeditions"
            >
              Expeditions
            </NavLink>
            <NavLink
            to="/goals"
            >
              Goals
            </NavLink>
            <NavLink
            to="/locales"
            >
              Locales
            </NavLink>
          </div>
      </nav>
      <Header />
        <h1>You're in deep, uncharted territory now. Better play it safe and try another page!</h1>
    </main>
  );
}

export default ErrorPage;