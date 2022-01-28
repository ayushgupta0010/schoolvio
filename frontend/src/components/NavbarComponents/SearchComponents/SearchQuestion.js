import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { REST_URL } from "../../../utils/urls";
import axios from "axios";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const SearchQuestion = ({ searchValue }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    let url = `${REST_URL.SEARCH_BY_QUESTION}${searchValue}`;
    axios
      .get(url)
      .then((res) => {
        setSearchResult(res.data);
        setIsLoading(false);
      })
      .catch((err) => err);
  }, [searchValue]);

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
            <p className='styledFont text-skyblue'>{x.question}</p>
            <div className='alert bg-success'>
              <Link to={`/question/${x.id}`}>
                {x.answers === 1 ? "1 answer" : x.answers + " answers"}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchQuestion;
