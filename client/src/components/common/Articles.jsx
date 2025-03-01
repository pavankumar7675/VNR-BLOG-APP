import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import './Articles.css';

function Articles() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  async function getArticles(category = '') {
    try {
        const token = await getToken();
        const url = category 
            ? `${BACKEND_URL}/author-api/articles/filter/${category}` 
            : `${BACKEND_URL}/author-api/articles`;

        // console.log("Fetching articles from:", url); 

        const res = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // console.log("Response received:", res.data); 

        if (res.data.message === 'articles') {
            setArticles(res.data.payload || []); 
            setError(res.data.payload.length === 0 ? 'No articles found.' : '');
        } else {
            setError('Unexpected response format.');
        }
    } catch (err) {
        // console.error("Fetch error:", err);
        setError('Failed to fetch articles');
    }
}


  function gotoArticleById(articleObj) {
    navigate(`../${articleObj.articleId}`, { state: articleObj });
  }

  useEffect(() => {
    getArticles();
  }, []);

  function handleCategoryChange(event) {
    const category = event.target.value;
    setSelectedCategory(category);
    getArticles(category);
  }

  return (
    <div className='container py-4'>
      <div className='category-select-container mb-4'>
        <label className='form-label category-label mb-2'>Filter by Category</label>
        <select 
          className='form-select custom-select' 
          value={selectedCategory} 
          onChange={handleCategoryChange}
        >
          <option value=''>All Categories</option>
          <option value='programming'>Programming</option>
          <option value='AI&M'>AI & Machine Learning</option>
          <option value='database'>Database</option>
        </select>
      </div>

      {error && <div className='error-message'>{error}</div>}

      <div className='row g-4'>
        {articles.map((articleObj) => (
          <div className='col-12 col-md-6 col-lg-4' key={articleObj.articleId}>
            <motion.div 
              className='article-card'
              whileHover={{ y: -5 }}
              onClick={() => gotoArticleById(articleObj)}
            >
              <div className='article-header'>
                <img 
                  src={articleObj.authorData.profileImageUrl} 
                  className='author-avatar'
                  alt='' 
                />
                <div>
                  <h6 className='author-name'>{articleObj.authorData.nameOfAuthor}</h6>
                  <small className='article-date'>
                    {new Date(articleObj.dateOfModification).toLocaleDateString()}
                  </small>
                </div>
              </div>

              <div className='article-content'>
                <h5 className='article-title'>{articleObj.title}</h5>
                <p className='article-excerpt'>{articleObj.content.substring(0, 120)}...</p>
                
                <div className='article-footer'>
                  <span className='category-tag'>{articleObj.category || 'Uncategorized'}</span>
                  <button className='read-more-btn'>Read More →</button>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Articles;
