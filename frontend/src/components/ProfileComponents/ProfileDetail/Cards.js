import React from "react";
import { Link } from "react-router-dom";
import {
  UPDATE_STUDENT_PREV_SCHOOL_MUTATION,
  UPDATE_TEACHER_PREV_SCHOOL_MUTATION,
} from "../../../utils/mutation";
import client from "../../../utils/apollo";

const cls_sup = {
  1: "st",
  2: "nd",
  3: "rd",
  UKG: "",
  LKG: "",
};

const getClass = (classSection) => {
  const cls = classSection.replace("C_", "").split("_")[0];
  let sup = cls_sup[cls] !== undefined ? cls_sup[cls] : "th";

  return (
    <>
      In {cls}
      <sup>{sup}</sup>
    </>
  );
};

export const StudentCard = ({ profile }) => (
  <div className='details m-2'>
    <h6 className='text-revert'>{profile.name}</h6>
    <h6 className='text-revert'>
      <span>{getClass(profile.classSection)}</span>{" "}
      <i className='bi bi-at fs-5' />
      <Link
        to={`/profile/${profile.school.user.username}`}
        className='text-skyblue h5'>
        {profile.school.user.username}
      </Link>
    </h6>
    <p className='container text-revert m-0'>{profile.about}</p>
  </div>
);

export const TeacherCard = ({ profile }) => (
  <div className='details m-2'>
    <h6 className='text-revert'>{profile.name}</h6>
    <h6 className='text-revert'>
      <Link
        to={`/profile/${profile.school.user.username}`}
        className='text-skyblue h5'>
        {profile.school.user.username}
      </Link>
    </h6>
    <p className='container text-revert m-0'>{profile.about}</p>
  </div>
);

export const SchoolCard = ({
  profile,
  paramsUsername,
  loggedInUserRole,
  loggedInUserSchool,
}) => {
  const handlePrevSchool = (prev_school) => {
    let mutation =
      loggedInUserRole === "STUDENT"
        ? UPDATE_STUDENT_PREV_SCHOOL_MUTATION
        : UPDATE_TEACHER_PREV_SCHOOL_MUTATION;
    client
      .mutate({ mutation, variables: { school: prev_school } })
      .then((res) =>
        alert(
          "Thanks! We will use this to find your friends from your previous school."
        )
      )
      .catch((err) => err);
  };

  return (
    <div className='details m-2'>
      <h6 className='text-revert'>{profile.name}</h6>
      <h6 className='text-revert'>{profile.principal}</h6>
      {loggedInUserSchool !== paramsUsername &&
        loggedInUserRole &&
        loggedInUserRole !== "SCHOOL" && (
          <Link
            to='#'
            className='text-skyblue'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            title='If you mark this as your previous school, then we will use it to find your friends from your previous school'
            onClick={() => handlePrevSchool(paramsUsername)}>
            This is my previous school
          </Link>
        )}
    </div>
  );
};
