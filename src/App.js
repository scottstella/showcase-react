import "./App.css";
import Nav from "./components/Nav/Nav";
import Article from "./components/Article/Article";
import Aside from "./components/Aside/Aside";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";

function App() {
  return (
    <div className="grid-container">
      <Header />
      <Nav />
      <Article />
      <Aside />
      <Footer />
    </div>
  );
}

export default App;
