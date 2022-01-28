import React, { useState } from "react";
import {
  FOLLOW_USER_MUTATION,
  UNFOLLOW_USER_MUTATION,
} from "../../../utils/mutation";
import client from "../../../utils/apollo";
import Answers from "./Answers";
import FollowersList from "./FollowersList";
import FollowingList from "./FollowingList";
import Info from "./Info";
import Posts from "./Posts";
import Questions from "./Questions";

const TabbedNav = ({
  profile,
  sameUser,
  setProfile,
  paramsUsername,
  loggedInUsername,
  loggedInUserRole,
  loggedInUserSchool,
}) => {
  const [showPosts, setShowPosts] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const handleFollowInFollowerOrFollowingList = (username, isFollowing) => {
    if (isFollowing) {
      client
        .mutate({ mutation: UNFOLLOW_USER_MUTATION, variables: { username } })
        .then(
          setProfile((original) => ({
            ...original,
            user: {
              ...original.user,
              followers: original.user.followers.map((x) =>
                x.username === username ? { ...x, isFollowing: false } : x
              ),
              following: original.user.following.map((x) =>
                x.username === username ? { ...x, isFollowing: false } : x
              ),
            },
          }))
        )
        .catch((err) => err);
    } else {
      client
        .mutate({ mutation: FOLLOW_USER_MUTATION, variables: { username } })
        .then(
          setProfile((original) => ({
            ...original,
            user: {
              ...original.user,
              followers: original.user.followers.map((x) =>
                x.username === username ? { ...x, isFollowing: true } : x
              ),
              following: original.user.following.map((x) =>
                x.username === username ? { ...x, isFollowing: true } : x
              ),
            },
          }))
        )
        .catch((err) => err);
    }
  };

  return (
    <>
      <ul className='nav nav-tabs justify-content-center' role='tablist'>
        <li className='nav-item'>
          <a
            className='nav-link active bg-transparent'
            id='info-tab'
            href='#info'
            role='tab'
            data-bs-toggle='tab'
            aria-controls='info'
            aria-selected='true'>
            Info
          </a>
        </li>
        <li className='nav-item'>
          <a
            className='nav-link bg-transparent'
            id='followers-tab'
            href='#followers'
            role='tab'
            data-bs-toggle='tab'
            aria-controls='followers'
            aria-selected='false'>
            {profile.user.followersCount} followers
          </a>
        </li>
        <li className='nav-item'>
          <a
            className='nav-link bg-transparent'
            id='following-tab'
            href='#following'
            role='tab'
            data-bs-toggle='tab'
            aria-controls='following'
            aria-selected='false'>
            {profile.user.followingCount} following
          </a>
        </li>
        <li className='nav-item'>
          <a
            className='nav-link bg-transparent'
            id='posts-tab'
            href='#posts'
            role='tab'
            data-bs-toggle='tab'
            aria-controls='posts'
            aria-selected='false'
            onClick={() => setShowPosts(true)}>
            Posts
          </a>
        </li>
        <li className='nav-item'>
          <a
            className='nav-link bg-transparent'
            id='questions-tab'
            href='#questions'
            role='tab'
            data-bs-toggle='tab'
            aria-controls='questions'
            aria-selected='false'
            onClick={() => setShowQuestions(true)}>
            Questions
          </a>
        </li>
        <li className='nav-item'>
          <a
            className='nav-link bg-transparent'
            id='answers-tab'
            href='#answers'
            role='tab'
            data-bs-toggle='tab'
            aria-controls='answers'
            aria-selected='false'
            onClick={() => setShowAnswers(true)}>
            Answers
          </a>
        </li>
      </ul>
      <div className='tab-content'>
        <div
          className='tab-pane fade show active'
          id='info'
          role='tabpanel'
          aria-labelledby='info-tab'>
          <section className='p-3'>
            <Info
              profile={profile}
              sameUser={sameUser}
              loggedInUserRole={loggedInUserRole}
              loggedInUserSchool={loggedInUserSchool}
            />
          </section>
        </div>
        <div
          className='tab-pane fade'
          id='followers'
          role='tabpanel'
          aria-labelledby='followers-tab'>
          <FollowersList
            followersList={profile.user.followers}
            currentUser={loggedInUsername}
            handleFollow={handleFollowInFollowerOrFollowingList}
          />
        </div>
        <div
          className='tab-pane fade'
          id='following'
          role='tabpanel'
          aria-labelledby='following-tab'>
          <FollowingList
            followingList={profile.user.following}
            currentUser={loggedInUsername}
            handleFollow={handleFollowInFollowerOrFollowingList}
          />
        </div>
        <div
          className='tab-pane fade'
          id='posts'
          role='tabpanel'
          aria-labelledby='posts-tab'>
          {showPosts && <Posts username={paramsUsername} />}
        </div>
        <div
          className='tab-pane fade'
          id='questions'
          role='tabpanel'
          aria-labelledby='questions-tab'>
          {showQuestions && <Questions username={paramsUsername} />}
        </div>
        <div
          className='tab-pane fade'
          id='answers'
          role='tabpanel'
          aria-labelledby='answers-tab'>
          {showAnswers && <Answers username={paramsUsername} />}
        </div>
      </div>
    </>
  );
};

export default TabbedNav;
