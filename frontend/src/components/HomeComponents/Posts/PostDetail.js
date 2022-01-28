import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { POST_QUERY } from "../../../utils/query";
import { LIKE_POST_MUTATION } from "../../../utils/mutation";
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

const PostDetail = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState({});

  const { id } = useParams();

  const handleLike = (id) => {
    client
      .mutate({ mutation: LIKE_POST_MUTATION, variables: { id } })
      .then(
        (res) =>
          res.data.post &&
          setPost({
            ...post,
            likes: res.data.post.likes,
            isLikedByUser: !post?.isLikedByUser,
          })
      )
      .catch((err) => err);
  };

  useEffect(() => {
    document.title = "Post " + id;
    client
      .query({ query: POST_QUERY, variables: { id } })
      .then((res) => {
        res.data.postDetail && setPost(res.data.postDetail);
        setIsLoading(false);
      })
      .catch((err) => err);
  }, [id]);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className='container d-flex justify-content-center'>
      <div className='card posts-card border-dark bg-transparent my-3'>
        <div className='card-header d-flex p-0'>
          <img
            className='rounded-circle m-3'
            style={{ width: "75px", height: "75px" }}
            src={post?.user?.photo}
            alt='profile-pic'
          />
          <div className='d-flex align-items-center text-light'>
            <Link
              to={`/profile/${post?.user?.username}`}
              className='d-block styledFont'>
              {post?.user?.username}
            </Link>
          </div>
        </div>
        <img className='card-img-top' src={post?.photo} alt='post' />
        <div className='card-body'>
          <button
            className='btn btn-outline-danger mb-2'
            onClick={() => handleLike(post?.id)}>
            {post?.isLikedByUser ? "Unlike" : "Like"}
          </button>
          <p className='d-block text-revert styledFont'>
            {getLikes(post?.likes)}
          </p>
          <p className='card-text'>{post?.description}</p>
          <p className='card-text'>
            <small className='text-muted styledFont2'>
              {getDate(post?.timestamp)}
            </small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
