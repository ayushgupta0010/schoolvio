import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchQuestion from "./SearchQuestion";
import SearchUser from "./SearchUser";

const Search = () => {
  const url = useLocation().search;
  const searchValue = new URLSearchParams(url).get("q").replaceAll(" ", "-");
  const wordCount = searchValue.split("-").length;

  useEffect(() => (document.title = "Search"), []);

  return (
    <div className='container'>
      {wordCount === 1 && (
        <SearchUser searchValue={searchValue} method='username' />
      )}
      {2 <= wordCount && wordCount < 3 && (
        <SearchUser searchValue={searchValue} method='name' />
      )}
      {wordCount >= 3 && <SearchQuestion searchValue={searchValue} />}
    </div>
  );
};

export default Search;
