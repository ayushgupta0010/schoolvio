import React from "react";
import { Link } from "react-router-dom";

const FollowersList = ({ followersList, currentUser, handleFollow }) => (
  <ul className='list-group rounded my-3'>
    {followersList.length !== 0 ? (
      followersList.map((user, i) => (
        <li
          key={i}
          className='list-group-item bg-dark d-flex justify-content-between'>
          <Link to={`/profile/${user.username}`} className='styledFont2'>
            <img
              className='rounded-circle me-5'
              style={{ width: "50px", height: "50px" }}
              src={user.photo}
              alt='profile-pic'
            />
            {user.username}
          </Link>
          {currentUser !== user.username && (
            <button
              className='btn btn-primary'
              onClick={() => handleFollow(user.username, user.isFollowing)}>
              {user.isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </li>
      ))
    ) : (
      <div className='text-center mt-3'>
        <p className='styledFont2 text-revert'>This user has no followers</p>
      </div>
    )}
  </ul>
);

export default FollowersList;
