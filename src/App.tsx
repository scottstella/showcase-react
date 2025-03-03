import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav/Nav";
import Welcome from "./components/Welcome/Welcome";
import Aside from "./components/Aside/Aside";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import MetaData from "./components/meta-data/MetaData";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  return (
    <>
      <div className="grid-container">
        <Router>
          <div className="header-section">
            <Header />
          </div>

          <div className="nav-section">
            <Nav />
          </div>

          <div className="main-section">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/manageMetaData" element={<MetaData />} />
            </Routes>
          </div>

          <div className="aside-section">
            <Aside />
          </div>

          <div className="footer-section">
            <Footer />
          </div>
        </Router>
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default App;
