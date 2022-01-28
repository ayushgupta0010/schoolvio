import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { POSTS_BY_USER_QUERY } from "../../../utils/query";
import client from "../../../utils/apollo";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const Posts = ({ username }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [postsList, setPostsList] = useState([]);

  useEffect(() => {
    client
      .query({ query: POSTS_BY_USER_QUERY, variables: { username } })
      .then((res) => {
        setPostsList(res.data.posts);
        setIsLoading(false);
      })
      .catch((err) => err);
  }, [username]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/masonry-layout@4.2.2/dist/masonry.pkgd.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  if (isLoading) return <LoadingComponent />;

  if (!isLoading && postsList.length === 0) {
    return (
      <div className='text-center mt-6'>
        <p className='styledFont2'>This user has no posts</p>
      </div>
    );
  }

  return (
    <div className='container'>
      <div className='row' data-masonry='{"percentPosition": true }'>
        {postsList.map((post, i) => (
          <div className='col-sm-4 col-md-3 py-3 px-2' key={i}>
            <div className='card border-0 bg-transparent'>
              <Link to={`/post/${post.id}`}>
                <img className='card-img' src={post.photo} alt='post' />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
