import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/books" element={<div>Books page</div>} />
      <Route path="/" element={<div>Home page</div>} />
    </Routes>
  );
}

export default App;
