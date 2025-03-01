import { useContext, useEffect, useState } from 'react'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj)

  const { isSignedIn, user, isLoaded } = useUser()
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // console.log("isSignedIn :", isSignedIn)
   console.log("User :", user)
  // console.log("isLolded :", isLoaded)


  async function onSelectRole(e) {
    setError('')
    const selectedRole = e.target.value;
    currentUser.role = selectedRole;

    const allowedAdminEmail = "pavankumar2005712@gmail.com"; // Your email

    if (selectedRole === 'admin' && currentUser.email !== allowedAdminEmail) {
      setError("Sorry, only the authorized user can be an admin.");
      return;
    }
    
    let res = null;
    try {
      if (selectedRole === 'author') {
        res = await axios.post(`${BACKEND_URL}/author-api/author`, currentUser)
        let { message, payload } = res.data;
        if (message === 'author') {
          setCurrentUser({ ...currentUser, ...payload })
          localStorage.setItem("currentuser",JSON.stringify(payload))
        } else {
          setError(message);
        }
      }
      if (selectedRole === 'user') {
        console.log(currentUser)
        res = await axios.post(`${BACKEND_URL}/user-api/user`, currentUser)
        let { message, payload } = res.data;
        console.log(message)
        if (message === 'user') {
          setCurrentUser({ ...currentUser, ...payload })
           localStorage.setItem("currentuser",JSON.stringify(payload))
        } else {
          setError(message);
        }
      }
      if (selectedRole === 'admin') {
        res = await axios.post(`${BACKEND_URL}/admin-api/admin`, currentUser);
        let { message, payload } = res.data;
        if (message === 'admin') {
          setCurrentUser({ ...currentUser, ...payload });
          localStorage.setItem("currentuser", JSON.stringify(payload));
        } else {
          setError(message);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  }


  useEffect(() => {
    if (isSignedIn === true) {
      setCurrentUser({
        ...currentUser,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        profileImageUrl: user.imageUrl,
      });
    }
  }, [isLoaded])



  useEffect(() => {

    if (currentUser?.role === "user" && error.length === 0) {
      navigate(`/user-profile/${currentUser.email}`);
    }
    if (currentUser?.role === "author" && error.length === 0) {
      navigate(`/author-profile/${currentUser.email}`);
    }
    if (currentUser?.role === "admin" && error.length === 0) {
      navigate(`/admin-profile/${currentUser.email}`);
    }
  }, [currentUser]);

  // console.log("cu",currentUser)
  //console.log("is loaded",isLoaded)

  return (
    <div className="home-container">
      <div className='container py-5'>
        {!isSignedIn ? (
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome to QuickBlog</h1>
            <p className="welcome-text">
              Experience blogging at the speed of thought. QuickBlog combines cutting-edge technology 
              with seamless user experience to bring your ideas to life.
            </p>
            <p className="welcome-text">
              Share your knowledge, connect with like-minded individuals, and be part of the future of content creation.
            </p>
            <div className="cta-box">
              <p className="cta-text">
                Ready to start your journey? Sign up now and join our community of tech-savvy creators.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="user-profile-card">
              <img src={user.imageUrl} className="user-avatar" alt="" />
              <p className="user-name">{user.firstName}</p>
              <p className="user-email">{user.emailAddresses[0].emailAddress}</p>
            </div>
            
            <div className="role-selection-card">
              <p className="role-title">Select your role:</p>
              {error && <p className="error-message">{error}</p>}
              <div className="role-options">
                <div className="form-check">
                  <input type="radio" name="role" id="author" value="author" 
                         className="form-check-input" onChange={onSelectRole} />
                  <label htmlFor="author" className="form-check-label">Author</label>
                </div>
                <div className="form-check">
                  <input type="radio" name="role" id="user" value="user" 
                         className="form-check-input" onChange={onSelectRole} />
                  <label htmlFor="user" className="form-check-label">User</label>
                </div>
                <div className="form-check">
                  <input type="radio" name="role" id="admin" value="admin" 
                         className="form-check-input" onChange={onSelectRole} />
                  <label htmlFor="admin" className="form-check-label">Admin</label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home