import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import Books from "./pages/Books";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

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
      <Route path="/" element={<div>Home page</div>} />
    </Routes>
  );
}

export default App;
