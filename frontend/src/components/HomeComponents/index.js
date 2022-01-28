import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import About from "../AboutComponents";
import People from "./People";
import Posts from "./Posts/";

const Home = () => {
  const { isLoggedIn, schoolName, schoolPhoto } = useSelector(
    (state) => state.auth
  );

  const [showPeople, setShowPeople] = useState(false);

  useEffect(() => (document.title = "Home"), []);

  if (!isLoggedIn) return <About />;

  return (
    <div className='container mt-3'>
      <div className='rounded my-3 p-5' style={{ backgroundColor: "#1cb65d " }}>
        <div className='container text-center'>
          <img
            src={schoolPhoto}
            className='mx-auto rounded-circle mb-1'
            style={{
              width: "100px",
              height: "100px",
              boxShadow: "0 0 0 8px #1f1e1e",
            }}
            alt='profile_img'
          />
          <h1 className='styledFont text-light mt-3'>
            Welcome to{" "}
            <span
              className='styledFont'
              style={{ textTransform: "capitalize" }}>
              {schoolName}
            </span>
          </h1>
        </div>
      </div>
      <div className='text-center'>
        <div className='d-flex justify-content-center'>
          <Link
            to='/post/new'
            className='styledButton m-0 my-3 text-white'
            style={{ width: "225px" }}>
            New Post
          </Link>
        </div>
        <button
          className='btn btn-primary'
          type='button'
          data-bs-toggle='offcanvas'
          data-bs-target='#offcanvasRight'
          aria-controls='offcanvasRight'
          onClick={() => setShowPeople(true)}>
          <i className='bi bi-people-fill' />
        </button>
      </div>
      <div className='d-flex justify-content-center'>
        <div className='d-block'>
          <Posts />
        </div>
      </div>
      <div
        className='offcanvas offcanvas-end bg-dark'
        data-bs-scroll='true'
        data-bs-backdrop='true'
        tabIndex='-1'
        id='offcanvasRight'
        aria-labelledby='offcanvasRightLabel'>
        <div className='offcanvas-header text-revert'>
          <h5 id='offcanvasRightLabel'>People you might know</h5>
          <button
            type='button'
            className='btn-close text-reset bg-light'
            data-bs-dismiss='offcanvas'
            aria-label='Close'
          />
        </div>
        <div className='offcanvas-body py-0'>{showPeople && <People />}</div>
      </div>
    </div>
  );
};

export default Home;
