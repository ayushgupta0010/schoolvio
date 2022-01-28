import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LIKE_POST_MUTATION } from "../../../utils/mutation";
import { POSTS_FOR_QUERY } from "../../../utils/query";
import { FRONTEND_URL } from "../../../utils/urls";
import client from "../../../utils/apollo";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const getDate = (d) =>
  new Date(d).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

const getLikes = (likes) => (likes === 1 ? "1 like" : likes + " likes");

const getSortedList = (list) =>
  [...list].sort((a, b) => b.timestamp.localeCompare(a.timestamp));

const Posts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [postList, setPostList] = useState([]);

  const handleShare = (id) => {
    let url = `${FRONTEND_URL}post/${id}`;
    navigator.clipboard.writeText(url).then(() => alert("Copied!"));
  };

  const handleLike = (id) => {
    client
      .mutate({ mutation: LIKE_POST_MUTATION, variables: { id } })
      .then((res) => {
        setPostList((posts) =>
          posts.map((post) =>
            post.id === id
              ? {
                  ...post,
                  likes: res.data.post.likes,
                  isLikedByUser: !post.isLikedByUser,
                }
              : post
          )
        );
      })
      .catch((err) => err);
  };

  useEffect(() => {
    let cancel = false;

    client
      .query({ query: POSTS_FOR_QUERY })
      .then((res) => {
        if (cancel) return;
        res.data.postList && setPostList(res.data.postList);
        setIsLoading(false);
      })
      .catch((err) => err);

    return () => (cancel = true);
  }, []);

  if (isLoading) return <LoadingComponent />;

  if (!isLoading && postList.length === 0) {
    return (
      <div className='mt-3'>
        <p className='styledFont'>Follow a user to see their posts</p>
      </div>
    );
  }

  return getSortedList(postList).map((post, i) => (
    <div className='card posts-card border-dark bg-transparent my-3' key={i}>
      <div className='card-header d-flex p-0'>
        <img
          className='rounded-circle m-3'
          style={{ width: "75px", height: "75px" }}
          src={post.user.photo}
          alt='profile-pic'
        />
        <div className='d-flex align-items-center text-light'>
          <Link
            to={`/profile/${post.user.username}`}
            className='d-block styledFont'>
            {post.user.username}
          </Link>
        </div>
      </div>
      <img className='card-img-top' src={post.photo} alt='post' />
      <div className='card-body'>
        <button
          className='btn btn-outline-danger mb-2'
          onClick={() => handleLike(post.id)}>
          {post.isLikedByUser ? "Unlike" : "Like"}
        </button>
        <button
          type='button'
          className='btn text-revert float-end'
          onClick={() => handleShare(post.id)}>
          <i className='bi bi-share-fill' />
        </button>
        <p className='d-block text-revert styledFont'>{getLikes(post.likes)}</p>
        <p className='card-text'>{post.description}</p>
        <p className='card-text'>
          <small className='text-muted styledFont2'>
            {getDate(post.timestamp)}
          </small>
        </p>
      </div>
    </div>
  ));
};

export default Posts;
