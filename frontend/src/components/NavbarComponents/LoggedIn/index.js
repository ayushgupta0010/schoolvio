import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { TRY_ACTIONS } from "../../../redux/actions";
import { WEBSITE_NAME } from "../../../utils/websiteData";
import Notifications from "../Notifications";
import SchoolList from "./SchoolList";
import StudentTeacherList from "./StudentTeacherList";

const LoggedIn = () => {
  const { username, role, photo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  return (
    <div className='btn-group'>
      <Notifications />
      <button
        className='bg-transparent border-0 mx-2'
        data-bs-toggle='dropdown'
        data-bs-auto-close='true'
        aria-expanded='false'
        style={{ outline: "none" }}>
        {photo ? (
          <img
            src={photo}
            alt='profile-pic'
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
            }}
          />
        ) : (
          <i className='bi bi-person-fill text-skyblue fs-2 mt-1' />
        )}
      </button>
      <ul className='dropdown-menu dropdown-menu-end bg-black'>
        <Link
          className='dropdown-header styledFont fw-bolder text-skyblue fs-3'
          to={`/profile/${username}`}>
          {username}
        </Link>

        {role && role === "TEACHER" && (
          <Link className='dropdown-item text-revert py-2' to='/attendance'>
            Attendance
          </Link>
        )}

        {role && role !== "SCHOOL" && <StudentTeacherList />}

        {role && role === "SCHOOL" && <SchoolList />}

        {role && role === "TEACHER" && (
          <Link
            className='dropdown-item text-revert py-2'
            to='/school/view/user'>
            View Student / Teacher
          </Link>
        )}

        <hr className='dropdown-divider bg-revert' />
        <Link className='dropdown-item text-revert py-2' to='/profile/edit'>
          Edit Profile
        </Link>
        <Link className='dropdown-item text-revert py-2' to='/settings'>
          Account Settings
        </Link>
        <hr className='dropdown-divider bg-revert' />
        <Link className='dropdown-item text-revert py-2' to='/about'>
          About {WEBSITE_NAME}
        </Link>
        <hr className='dropdown-divider bg-revert' />
        <Link
          to='/login'
          className='dropdown-item text-revert py-2'
          onClick={() => dispatch(TRY_ACTIONS.LOGOUT())}>
          Log Out
        </Link>
      </ul>
    </div>
  );
};

export default LoggedIn;
