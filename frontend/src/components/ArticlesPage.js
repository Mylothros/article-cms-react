import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/articlesPage.scss';

const Article = () => {
  const { id } = useParams();
  const [articlesRelated, setArticlesRelated] = useState([]);
  const [articlesInfo, setArticlesInfo] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getRelatedArticlesInfo = async () => {
      try {
        const response = await axios.post('http://localhost:3307/api/getarticlesrelated', { id });
        setArticlesRelated(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    const getArticlesInfo = async () => {
      try {
        const response = await axios.post('http://localhost:3307/api/getarticleinfo', { id });
        setArticlesInfo(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    getArticlesInfo();
    getRelatedArticlesInfo();
  }, [id]);

  const handleArticleClick = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  return (
    <article className="article">
      <section className="section title-section">
        <h1 className="title">Article Title {id}</h1>
      </section>
      <section className="section text-section">
        <p className="text">
          {articlesInfo.map((article) => (
            <div>
              <h2 className="article-title">{article.name}</h2>
              <img src={article.image_path} alt="image" />
              <p>{article.content}</p>
            </div>
          ))}
          <div>
            <h3 className="grid-titlePage">Related Articles</h3>
            <div className="gridPage">
            {articlesRelated.map((article) => (
              <div key={article.id} className="article-cardPage" onClick={() => handleArticleClick(article.id)}>
                <h2 className="article-title">{article.name}</h2>
                <img src={article.image_path} alt="image" />
              </div>
            ))}
            </div>
          </div>
        </p>
      </section>
    </article>
  );
};

export default Article;