import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Tweet.css';

function Tweet({ tweet }) {
  const [likeCount, setLikeCount] = useState(tweet.likes.length);
  const [liked, setLiked] = useState(tweet.likedByCurrentUser);
  const [isProcessing, setIsProcessing] = useState(false);
  const userId = parseInt(sessionStorage.getItem('userId'));

  const handleLike = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const url = liked
        ? `https://twitter-clone-fu8e.onrender.com/tweets/${tweet.id}/unlike`
        : `https://twitter-clone-fu8e.onrender.com/tweets/${tweet.id}/like`;

      const response = await axios.post(url, {userId}, {
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      }
    } catch (error) {
      console.error('Failed to like/unlike the tweet', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `https://twitter-clone-fu8e.onrender.com/tweets/delete/${tweet.id}`,
        {
          data: { userId }, 
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to delete tweet', error);
    }
  };

  return (
    <div className="tweet">
      <p>
        <Link to={`/profile/${tweet.author.id}`} className="tweet-author">
          <strong>{tweet.author.username}</strong>
        </Link>: {tweet.content}
      </p>
      <p className="tweet-date">{new Date(tweet.createdAt).toLocaleString()}</p>
      <div className="tweet-actions">
        <button onClick={handleLike} disabled={isProcessing}>
          {liked ? 'Unlike' : 'Like'} ({likeCount})
        </button>
        {userId === tweet.author.id && (
          <button onClick={handleDelete} disabled={isProcessing}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default Tweet;
