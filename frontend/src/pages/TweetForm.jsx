import React, { useState } from 'react';
import axios from 'axios';
import './TweetForm.css';

function TweetForm({ onTweetPosted }) {
  const [tweetContent, setTweetContent] = useState('');
  const [error, setError] = useState('');

  const handleTweetSubmit = async (e) => {
    e.preventDefault();
    if (!tweetContent) {
      setError('Tweet content cannot be empty');
      return;
    }
    const userId = sessionStorage.getItem('userId');
    try {
      const response = await axios.post(
        'https://twitter-clone-fu8e.onrender.com/tweets/create',
        { content: tweetContent, userId },
        { withCredentials: true } // Include session credentials
      );
      console.log('Tweet posted successfully', response.data);
      setTweetContent('');
      setError('');
      if (onTweetPosted) {
        onTweetPosted(response.data.tweet);
      }
    } catch (err) {
      console.error('Failed to post tweet', err);
      setError('Must be signed in to post tweets');
    }
  };

  return (
    <form className="tweet-form" onSubmit={handleTweetSubmit}>
      <textarea
        value={tweetContent}
        onChange={(e) => setTweetContent(e.target.value)}
        placeholder="What's on your mind?"
      />
      <button type="submit">Tweet</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default TweetForm;
