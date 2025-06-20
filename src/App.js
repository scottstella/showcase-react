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
const App = () => {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div",
      { className: "grid-container" },
      React.createElement(
        Router,
        null,
        React.createElement(
          "div",
          { className: "header-section" },
          React.createElement(Header, null)
        ),
        React.createElement("div", { className: "nav-section" }, React.createElement(Nav, null)),
        React.createElement(
          "div",
          { className: "main-section" },
          React.createElement(
            Routes,
            null,
            React.createElement(Route, { path: "/", element: React.createElement(Welcome, null) }),
            React.createElement(Route, {
              path: "/manageMetaData",
              element: React.createElement(MetaData, null),
            })
          )
        ),
        React.createElement(
          "div",
          { className: "aside-section" },
          React.createElement(Aside, null)
        ),
        React.createElement(
          "div",
          { className: "footer-section" },
          React.createElement(Footer, null)
        )
      )
    ),
    React.createElement(ToastContainer, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      newestOnTop: false,
      closeOnClick: true,
      rtl: false,
      pauseOnFocusLoss: true,
      draggable: true,
      pauseOnHover: true,
    })
  );
};
export default App;
