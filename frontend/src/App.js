import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Article from './components/Article';
import ArticlesPage from './components/ArticlesPage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route index element={<Article />} />
        <Route path="admin" element={<Hero />} />
        <Route path="article/:id" element={<ArticlesPage />} />
      </Route>
    </Routes>
    <Footer />
  </BrowserRouter>
  );
}

export default App;