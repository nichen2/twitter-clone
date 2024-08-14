import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Tweet from '../components/Tweet.jsx';
import './Profile.css'; 

function Profile() {
  const { id } = useParams(); 
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [isFollowing, setIsFollowing] = useState(false);

  const currentUserId = sessionStorage.getItem('userId'); // Get current user ID from session storage

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`https://twitter-clone-fu8e.onrender.com/users/${id}`, { withCredentials: true });
        const userData = response.data.user;

        setUser(userData);

        // Check if the current user is following this profile user
        const followedByCurrentUser = response.data.followedByCurrentUser;
        console.log(followedByCurrentUser)
        setIsFollowing(followedByCurrentUser);

      } catch (error) {
        setError('Failed to fetch user data');
        console.error('Failed to fetch user data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id, currentUserId]); // Dependency array ensures fetchUserProfile runs when id or currentUserId changes

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>User not found.</p>;
  }

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await axios.post(`https://twitter-clone-fu8e.onrender.com/users/${id}/unfollow`, {}, { withCredentials: true });
        setIsFollowing(false);
      } else {
        await axios.post(`https://twitter-clone-fu8e.onrender.com/users/${id}/follow`, {}, { withCredentials: true });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Failed to update follow status', error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>{user.username}'s Profile</h1>
        <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
        <button onClick={handleFollow}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      </div>
      
      <div className="tweets-section">
        <h3>Tweets</h3>
        {user.tweets && user.tweets.length === 0 ? (
          <p>No tweets to show.</p>
        ) : (
          user.tweets.map((tweet) => (
            <Tweet key={tweet.id} tweet={tweet} currentUserId={currentUserId} />
          ))
        )}
      </div>
      
      <div className="followers-section">
        <h3>Following: {user.followers?.length || 0}</h3>
      </div>
      
      <div className="following-section">
        <h3>Followers: {user.following?.length || 0}</h3>
      </div>
      
      <div className="likes-section">
        <h3>Liked Tweets</h3>
        {user.likes && user.likes.length === 0 ? (
          <p>No liked tweets to show.</p>
        ) : (
          user.likes.map((like) => (
            <Tweet key={like.tweet.id} tweet={like.tweet} currentUserId={currentUserId} />
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;
