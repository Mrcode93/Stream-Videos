import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Login from "./components/Login"; // Make sure the name matches the export in Login.js
import SignUp from "./components/SignUp";
import LivePage from "./components/LivePage";
import MainPage from "./components/MainPage";
import Stream from "./components/Stream";
import Post from "./components/Post";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />{" "}
          <Route path="/login" element={<Login />} />{" "}
          <Route path="/signup" element={<SignUp />} />{" "}
          <Route path="/live-page" element={<LivePage />} />{" "}
          <Route path="/post-page" element={<Post />} />{" "}
          <Route path="/live/:id" element={<Stream />} />{" "}
          <Route path="/live-page" element={<LivePage />} />{" "}
        </Routes>{" "}
      </BrowserRouter>{" "}
    </div>
  );
}

export default App;
