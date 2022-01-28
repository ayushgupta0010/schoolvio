import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { REST_URL } from "../../../utils/urls";
import axios from "axios";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const SearchUser = ({ searchValue, method }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    let SEARCH_URL =
      method === "name" ? REST_URL.SEARCH_BY_NAME : REST_URL.SEARCH_BY_USERNAME;
    axios
      .get(SEARCH_URL + searchValue)
      .then((response) => {
        setSearchResult(response.data);
        setIsLoading(false);
      })
      .catch((error) => error);
  }, [method, searchValue]);

  if (isLoading) return <LoadingComponent />;

  if (!isLoading && searchResult.length === 0) {
    return (
      <div className='text-center mt-12'>
        <p className='styledFont text-revert'>No results found</p>
      </div>
    );
  }

  return (
    <div className='container my-3'>
      <ul className='list-group'>
        {searchResult.map((x, i) => (
          <li className='list-group-item mb-1 bg-dark' key={i}>
            <img
              className='rounded-circle me-3 float-start'
              style={{ width: "50px", height: "50px" }}
              src={x.photo}
              alt='profile-pic'
            />
            <div className='container'>
              <div className='d-flex flex-column float-start'>
                <Link to={`/profile/${x.username}`} className='styledFont2'>
                  {method === "name" ? x.name : x.username}
                </Link>
                {x.role === "school" ? (
                  <span className='styledFont2 text-info font-italic'>
                    {x.principal}
                  </span>
                ) : (
                  <Link
                    to={`/profile/${x.school}`}
                    className='styledFont2 text-info font-italic'>
                    {x.school}
                  </Link>
                )}
              </div>
              <span className='badge bg-danger ms-5'>
                {x.role.toUpperCase()}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchUser;
