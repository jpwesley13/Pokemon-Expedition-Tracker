import React from 'react';
import { AuthProvider, useAuth } from "./context and utility/AuthContext";
import PokemonProvider from './context and utility/PokemonContext';
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <PokemonProvider>
        <MainApp />
      </PokemonProvider>
    </AuthProvider>
  );
}

function MainApp() {
  const auth = useAuth();
  if (!auth) {
    return <div>Not authenticated</div>;
  }
  const { loading } = auth;

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
