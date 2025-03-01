import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from "../../assets/logo4.avif";
import { useClerk, useUser } from '@clerk/clerk-react'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'
import { useAuth } from '@clerk/clerk-react'
import './Header.css'

const Header = () => {
  const { userId } = useAuth();
  const { signOut } = useClerk();
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const navigate = useNavigate()
  const { isSignedIn, user, isLoaded } = useUser();

  const handleSignOut = async () => {
    try {
      await signOut();
      setCurrentUser(null)
      localStorage.clear();
      navigate('/')
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <div className="header-wrapper">
      <nav className="header">
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <div className="logo">
              <span className="logo-quick">Quick</span>
              <span className="logo-blog">Blog</span>
            </div>
          </Link>
        </div>
        
        <ul className="nav-list">
          {!isSignedIn ? (
            <>
              <li>
                <Link to="signin" className="signin-button">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="signup" className="signup-button">
                  Sign Up
                </Link>
              </li>
            </> 
          ) : (
            <div className="user-controls">
              <div className="user-info">
                <div className="user-image-container">
                  <img
                    src={user.imageUrl}
                    className="user-image"
                    alt=""
                  />
                  <div className="user-role-badge">{currentUser.role}</div>
                </div>
                <p className="user-name">{user.firstName}</p>
              </div>
              <button 
                onClick={handleSignOut} 
                className="signout-button"
              >
                <span>Sign out</span>
              </button>
            </div>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Header;