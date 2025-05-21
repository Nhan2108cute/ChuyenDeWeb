import React from "react";
import Header from "./components/Header/Header";
import Menu from "./components/Menu/Menu";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

function App() {
    return (
        <AuthProvider>
            <Header />
            <Menu />
            <Outlet /> {/* sẽ render các element được định nghĩa trong router.ts */}
        </AuthProvider>
    );
}

export default App;
