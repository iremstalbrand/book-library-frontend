import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Books from "./pages/Books";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/AuthContext";

function Root() {
  const { token } = useAuth();
  return <Navigate to={token ? "/books" : "/login"} replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/books"
        element={
          <ProtectedRoute>
            <Books />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Root />} />
    </Routes>
  );
}

export default App;
