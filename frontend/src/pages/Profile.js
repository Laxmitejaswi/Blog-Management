import React, { useState, useEffect } from 'react';
import '../Profile.css';

const Profile = () => {
  const [articles, setArticles] = useState([]);
  const [openArticleName, setOpenArticleName] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newArticle, setNewArticle] = useState({ name: '', title: '', content: '' });
  const [editArticle, setEditArticle] = useState(null);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchUserArticles = async () => {
      try {
        const response = await fetch(`https://blog-management-1.onrender.com/api/articles/${username}`);
        if (response.ok) {
          const data = await response.json();
          setArticles(data); 
        } else {
          const errorData = await response.json();
          setError(errorData.error);
        }
      } catch (error) {
        setError('An error occurred while fetching articles');
      }
    };
    if (username) {
      fetchUserArticles();
    }
  }, [username]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArticle({ ...newArticle, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://blog-management-1.onrender.com/api/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...newArticle, username })
      });
      if (response.ok) {
        const data = await response.json();
        setArticles([data, ...articles]); 
        setNewArticle({ name: '', title: '', content: '' });
        setShowForm(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      setError('An error occurred while adding the article');
    }
  };

  const handleDelete = async (articleName) => {
    try {
      const response = await fetch(`https://blog-management-1.onrender.com/api/articles/${articleName}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setArticles(articles.filter(article => article.name !== articleName));
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      setError('An error occurred while deleting the article');
    }
  };

  const handleEdit = (article) => {
    setEditArticle(article);
    setNewArticle({ title: article.title, content: article.content });
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://blog-management-1.onrender.com/api/articles/${editArticle.name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...newArticle, username })
      });
      if (response.ok) {
        const updatedArticle = await response.json();
        setArticles(articles.map(article => (
          article._id === updatedArticle._id ? updatedArticle : article
        )));
        setNewArticle({ title: '', content: '' });
        setShowForm(false);
        setEditArticle(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      setError('An error occurred while updating the article');
    }
  };

  const handleOpen = (articleName) => {
    setOpenArticleName(articleName);
  }

  return (
    <div className="profile-container">
      {username ? <h2>Hi, {username}</h2> : <h2>Loading...</h2>}
      {error && <div className="message_3">{error}</div>}
      <button className='button_3' onClick={() => {
        setShowForm(!showForm);
        setEditArticle(null);
      }}>
        {showForm ? 'Cancel' : 'Add Blog'}
      </button>
      {showForm && (
        <form className="article-form" onSubmit={editArticle ? handleUpdate : handleSubmit}>
          {!editArticle && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newArticle.name}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newArticle.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={newArticle.content}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <button className='button' type="submit">{editArticle ? 'Update Blog' : 'Add Blog'}</button>
        </form>
      )}
      <ul>
        {articles.map(article => (
          <li key={article._id} className="article-bar">
            <div className="article-content" onClick={() => handleOpen(article.name)}>
              <h3>{article.title}</h3>
              <p className={openArticleName === article.name ? 'full-content' : 'truncated-content'}>
                {article.content}
              </p>
              {openArticleName === article.name  &&
              <div>
                <button className="button" onClick={() => handleEdit(article)}>Edit</button>
                <button className="button_2" onClick={() => handleDelete(article.name)}>Delete</button>
              </div>
              }
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
