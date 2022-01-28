import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { WEBSITE_NAME } from "../../utils/websiteData";
import LoggedIn from "./LoggedIn";
import LoggedOut from "./LoggedOut";

const Navbar = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  const [searchValue, setSearchValue] = useState("");

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchValue}`);
  };

  return (
    <nav
      className='navbar sticky-top navbar-dark navbar-expand-sm justify-content-evenly'
      style={{ backgroundColor: "#0a1e29" }}>
      <div className='container mx-0 px-3'>
        <Link className='navbar-brand m-0' to='/'>
          {WEBSITE_NAME}
        </Link>

        <div className='mt-2'>
          <form onSubmit={handleSearch}>
            <input
              id='searchbar'
              type='search'
              placeholder='Search'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </form>
        </div>
        {isLoggedIn ? <LoggedIn /> : <LoggedOut />}
      </div>
    </nav>
  );
};

export default Navbar;
