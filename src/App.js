import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav/Nav";
import Welcome from "./components/Welcome/Welcome";
import Aside from "./components/Aside/Aside";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import MetaData from "./components/meta-data/MetaData";

function App() {
  return (
    <div className="grid-container">
      <div className="header-section">
        <Header />
      </div>
      <Router>
        <div className="nav-section">
          <Nav />
        </div>

        <div className="main-section">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/manageMetaData" element={<MetaData />} />
          </Routes>
        </div>
      </Router>
      <div className="aside-section">
        <Aside />
      </div>

      <div className="footer-section">
        <Footer />
      </div>
    </div>
  );
}

export default App;
