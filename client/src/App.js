import React from 'react';
import AuthProvider, {useAuth} from "./context and hooks/AuthContext";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

function MainApp() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <header>
        <NavBar />
      </header>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
