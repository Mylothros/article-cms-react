import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import './styles/hero.scss';

const Hero = () => {
  const storedToken = localStorage.getItem('token');
  const [authenticated, setAuthenticated] = useState(storedToken);
  const [isToken, setIsToken] = useState(false);
  const [loginFormData, setLoginFormData] = useState({
    username: '',
    password: '',
  });
  const [errorMessageName, setErrorMessageName] = useState('');
  const [errorMessageSlug, setErrorMessageSlug] = useState('');
  const [errorMessageImage, setErrorMessageImage] = useState('');
  const [errorMessageContent, setErrorMessageContent] = useState('');
  const [errorMessageDate, setErrorMessageDate] = useState('');
  const [errorMessageTags, setErrorMessageTags] = useState('');

  const handleLoginInputChange = (event) => {
    const { name, value } = event.target;
    setLoginFormData({ ...loginFormData, [name]: value });
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3307/api/login', loginFormData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      setIsToken(true);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const checkTokenExpiration = () => {
    const stored = localStorage.getItem('token');
    if (stored) {
      const decoded = jwtDecode(stored);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp > currentTime) {
        setAuthenticated(true);
      } else {
        localStorage.removeItem('token');
        setAuthenticated(false);
      }
    } else {
      setAuthenticated(false);
    }
  }

  useEffect(() => {
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(interval);
  }, [isToken]);

  const [formData, setformData] = useState({
    name: '',
    slug: '',
    image_path: '',
    content: '',
    date: '',
    tags: ['', '', ''],
  });

  useEffect(() => {
    if (formData.name !== '') {
      setErrorMessageName('');
    }
    if (formData.slug !== '') {
      setErrorMessageSlug('');
    }
    if (formData.image_path !== '') {
      setErrorMessageImage('');
    }
    if (formData.content !== '') {
      setErrorMessageContent('');
    }
    if (formData.date !== '') {
      setErrorMessageDate('');
    }
    if (formData.tags !== '') {
      setErrorMessageTags('');
    }
  }, [formData]);
  
  const handleInput = (event) => {
    const { name, value } = event.target;
    setformData({ ...formData, [name]: value });
  };
  const handleTags = (index, event) => {
    const newTags = [...formData.tags];
    newTags[index] = event.target.value;
    setformData({ ...formData, tags: newTags });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.name === '') {
      setErrorMessageName('Mandatory Field!');
    }
    if (formData.slug === '') {
      setErrorMessageSlug('Mandatory Field!');
    }
    if (formData.image_path === '') {
      setErrorMessageImage('Mandatory Field!');
    }
    if (formData.content === '') {
      setErrorMessageContent('Mandatory Field!');
    }
    if (formData.date === '') {
      setErrorMessageDate('Mandatory Field!');
    }
    if (formData.tags[0] === '' || formData.tags[1] === '' || formData.tags[2] === '') {
      setErrorMessageTags('Mandatory Fields!');
    }
    axios
      .post('http://localhost:3307/api/articles', formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error creating article:', error);
      });
  };

  if (!authenticated) {
    return (
      <section className="hero">
        <div className="container2">
          <h1>Login</h1>
          <form onSubmit={handleLoginSubmit}>
            <div>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={loginFormData.username}
                onChange={handleLoginInputChange}
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={loginFormData.password}
                onChange={handleLoginInputChange}
              />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="hero">
      <div className="container">
        <h1>Add New Item</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Όνομα:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInput}
            />
          </div>
          {errorMessageName && <p className="error-message">{errorMessageName}</p>}
          <div className="form-group">
            <label htmlFor="slug">Slug:</label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleInput}
            />
          </div>
          {errorMessageSlug && <p className="error-message">{errorMessageSlug}</p>}
          <div className="form-group">
            <label htmlFor="image_path">Φωτογραφία:</label>
            <input
              type="text"
              id="image_path"
              name="image_path"
              value={formData.image_path}
              onChange={handleInput}
            />
          </div>
          {errorMessageImage && <p className="error-message">{errorMessageImage}</p>}
          <div className="form-group">
            <label htmlFor="content">Περιεχόμενο HTML:</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInput}
            />
          </div>
          {errorMessageContent && <p className="error-message">{errorMessageContent}</p>}
          <div className="form-group">
            <label htmlFor="date">Ημερομηνία:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInput}
            />
          </div>
          {errorMessageDate && <p className="error-message">{errorMessageDate}</p>}
            <div className="form-group">
            <br />
            <label htmlFor="genre">Είδος:</label>
            <input
              type="text"
              name="tags"
              value={formData.tags[0]}
              onChange={(event) => handleTags(0, event)}
              placeholder="article 1"
            />
            <br />
            <input
              type="text"
              name="tags"
              value={formData.tags[1]}
              onChange={(event) => handleTags(1, event)}
              placeholder="article 2"
            />
            <br />
            <input
              type="text"
              name="tags"
              value={formData.tags[2]}
              onChange={(event) => handleTags(2, event)}
              placeholder="article 3"
            />
            {errorMessageTags && <p className="error-message">{errorMessageTags}</p>}
            <br />
            <br />
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Hero;
