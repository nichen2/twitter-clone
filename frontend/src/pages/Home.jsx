import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TweetForm from './TweetForm';
import Tweet from '../components/Tweet';
import './Home.css';

function Home() {
  const [tweets, setTweets] = useState([]);
  const currentUserId = sessionStorage.getItem('userId');

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await axios.get('https://twitter-clone-fu8e.onrender.com/tweets/', {
          withCredentials: true
        });

        // Process tweets to determine if they are liked by the current user
        const processedTweets = response.data.tweets.map(tweet => ({
          ...tweet,
          likedByCurrentUser: tweet.likes.some(like => like.userId === parseInt(currentUserId))
        }));

        setTweets(processedTweets);
      } catch (error) {
        console.error('Failed to fetch tweets', error);
      }
    };

    fetchTweets();
  }, [currentUserId]);

  const handleTweetPosted = (newTweet) => {
    // Update the new tweet to include the likedByCurrentUser property
    const processedTweet = {
      ...newTweet,
      likedByCurrentUser: newTweet.likes.some(like => like.userId === parseInt(currentUserId))
    };
    setTweets((prevTweets) => [processedTweet, ...prevTweets]);
  };

  return (
    <div className='home-container'>
      <h1>Home Feed</h1>
      <TweetForm onTweetPosted={handleTweetPosted} />
      <div className='tweets-container'>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} currentUserId={currentUserId} />
        ))}
      </div>
    </div>
  );
}

export default Home;
