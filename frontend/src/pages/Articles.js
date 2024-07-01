import React, { useState, useEffect } from 'react';
import '../Articles.css';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');
  const [openArticleName, setOpenArticleName] = useState(null);
  const [likedArticles, setIsLikedArticles] = useState([]);
  const [openComments, setOpenComments] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('username'));

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('https://blog-management-1.onrender.com/api/articles');
        const data = await response.json();
        if (response.ok) {
          setArticles(data.map(article => ({ ...article, isLiked: false, comments: [] })));
        } else {
          setErrorWithTimeout(data.error);
        }
      } catch (error) {
        setErrorWithTimeout(error.message);
      }
    };

    const fetchLikedArticles = async () => {
      if (username) {
        try {
          const response = await fetch(`https://blog-management-1.onrender.com/api/users/${username}/liked-articles`);
          const likedarticles = await response.json();
          if (response.ok) {
            setIsLikedArticles(likedarticles);
          } else {
            setErrorWithTimeout(likedArticles.error);
          }
        } catch (error) {
          setErrorWithTimeout('An error occurred while fetching liked articles');
        }
      } else {
        setIsLikedArticles([]);
      }
    };

    fetchArticles();
    fetchLikedArticles();
  }, [username]);

  useEffect(() => {
    const handleStorageChange = () => {
      setUsername(localStorage.getItem('username'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const setErrorWithTimeout = (message) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 2000);
  };

  const handleLike = async (articleName, a_id) => {
    try {
      const response = await fetch(`https://blog-management-1.onrender.com/api/articles/${articleName}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
      });
      if (response.ok) {
        const updatedLikedArticles = [...likedArticles, { _id: a_id }];
        setIsLikedArticles(updatedLikedArticles);
        setArticles(articles.map(article => 
          article.name === articleName ? { ...article, isLiked: true, likes: article.likes + 1 } : article
        ));
      } else {
        const likedarticles = await response.json();
        setErrorWithTimeout(likedarticles.error);
      }
    } catch (error) {
      setErrorWithTimeout('An error occurred while liking the article');
    }
  };

  const handleCommentSubmit = async (e, articleName) => {
    e.preventDefault();
    const content = e.target.elements.comment.value;
    try {
      const response = await fetch(`https://blog-management-1.onrender.com/api/articles/${articleName}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, content })
      });
      const data = await response.json();
      if (response.ok) {
        setArticles(articles.map(article => 
          article.name === articleName ? { 
            ...article, 
            comments: [...article.comments, data.comments], 
            commentsCount: data.commentsCount 
          } : article
        ));
        e.target.reset();
        handleFetchCommentsCount(articleName , data.commentsCount);
      } else {
        setErrorWithTimeout(data.error);
      }
    } catch (error) {
      setErrorWithTimeout(error.message);
    }
  };

  const handleFetchCommentsCount = async (articleName , commentsCount) => {
    try {
      const response = await fetch(`https://blog-management-1.onrender.com/api/articles/${articleName}/comments`);
      const comments = await response.json();
      if (response.ok) {
        setArticles(articles.map(article =>
          article.name === articleName ? { ...article, comments , commentsCount } : article
        ));
      } else {
        setErrorWithTimeout(comments.error);
      }
    } catch (error) {
      setErrorWithTimeout('An error occurred while fetching comments');
    }
  };

  const handleFetchComments = async (articleName) => {
    try {
      const response = await fetch(`https://blog-management-1.onrender.com/api/articles/${articleName}/comments`);
      const comments = await response.json();
      if (response.ok) {
        setArticles(articles.map(article =>
          article.name === articleName ? { ...article, comments } : article
        ));
        setOpenComments(!openComments);
      } else {
        setErrorWithTimeout(comments.error);
      }
    } catch (error) {
      setErrorWithTimeout('An error occurred while fetching comments');
    }
  };

  const handleOpen = (articleName) => {
    setOpenArticleName(articleName);
  };

  return (
    <div className="articles-container">
      <h2>Articles</h2>
      <ul>
        {articles.map(article => (
          <li key={article.name} className="article-bar">
            <div className="article-content" onClick={() => handleOpen(article.name)}>
              <h3>{article.title}</h3>
              <p className={openArticleName === article.name ? 'full-content' : 'truncated-content'}>
                {article.content}
              </p>
              {openArticleName === article.name && (
                <div className="article-actions">
                  <span onClick={() => handleLike(article.name, article._id)}>
                    {likedArticles.some(likedArticle => likedArticle._id === article._id) ? (
                      <i className="fa-solid fa-heart"></i>
                    ) : (
                      <i className="fa-regular fa-heart"></i>
                    )}
                    <span className='inner'>
                      {article.likes}
                    </span>
                  </span>
                  <span onClick={() => handleFetchComments(article.name)}>
                    <i className="fa-regular fa-comment"></i>
                    <span className='inner_1'>
                      {article.commentsCount}
                    </span>
                  </span>
                </div>
              )}
              {openComments && openArticleName === article.name && (
                <ul className="comments-list">
                  {article.comments.map((comment, index) => (
                    <li key={index}>{comment.content}</li>
                  ))}
                </ul>
              )}
              {openArticleName === article.name && (
                <form onSubmit={(e) => handleCommentSubmit(e, article.name)}>
                  <input className='padding' type="text" name="comment" placeholder="Add a comment" required />
                  <button className="button_4" type="submit">Submit</button>
                </form>
              )}
              {openArticleName === article.name && error && <div className="message_3">{error}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Articles;
