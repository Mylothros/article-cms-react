import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/article.scss';

const Article = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const getArticles = async () => {
      try {
        const response = await axios.get('http://localhost:3307/api/getarticles');
        const articlesData = response.data;
        setArticles(articlesData);
        setTotalPages(Math.ceil(articlesData.length / 6));
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    getArticles();
  }, []);
  const getArticlesForPage = () => {
    const startIndex = (currentPage - 1) * 6;
    const endIndex = startIndex + 6;
    return articles.slice(startIndex, endIndex);
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
  const handleArticleClick = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  return (
    <div className="articles-grid">
      <h1 className="grid-title">Articles</h1>
      <div className="grid">
        {getArticlesForPage().map((article) => (
          <div key={article.id} className="article-card" onClick={() => handleArticleClick(article.id)}>
          <h2 className="article-title">{article.name}</h2>
          <img src={article.image_path} alt="image" />
        </div>
        ))}
      </div>
      <div className="pagination">
        <button
          className="pagination-button"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="pagination-page">{currentPage}</span>
        <button
          className="pagination-button"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Article;