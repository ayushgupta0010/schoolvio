import React from "react";

const getDate = (d) =>
  new Date(d).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const Info = ({ profile, sameUser, loggedInUserRole, loggedInUserSchool }) => {
  const LoadStudentProfile = () => (
    <>
      {(sameUser ||
        (loggedInUserRole &&
          loggedInUserRole !== "STUDENT" &&
          loggedInUserSchool === profile.school.user.username)) && (
        <>
          <p>
            <span className='slight-bold styledFont text-skyblue'>
              Father's Name:{" "}
            </span>
            {profile.fatherName}
          </p>
          <p>
            <span className='slight-bold styledFont text-skyblue'>
              Mother's Name:{" "}
            </span>
            {profile.motherName}
          </p>
          <p>
            <span className='slight-bold styledFont text-skyblue'>
              Admission No:{" "}
            </span>
            {profile.admNo}
          </p>
          <p>
            <span className='slight-bold styledFont text-skyblue'>
              Roll No:{" "}
            </span>
            {profile.rollNo}
          </p>
          <p>
            <span className='slight-bold styledFont text-skyblue'>
              Bus No:{" "}
            </span>
            {profile.busNo ? profile.busNo : "None"}
          </p>
          <p>
            <span className='slight-bold styledFont text-skyblue'>
              Contact:{" "}
            </span>
            {profile.contact}
          </p>
          <p>
            <span className='slight-bold styledFont text-skyblue'>
              Address:{" "}
            </span>
            {profile.address}
          </p>
        </>
      )}
      <p>
        <span className='slight-bold styledFont text-skyblue'>
          Date of Birth:{" "}
        </span>
        {getDate(profile.dob)}
      </p>
      <p>
        <span className='slight-bold styledFont text-skyblue'>Goal: </span>
        {profile.goal}
      </p>
    </>
  );

  const LoadTeacherProfile = () => (
    <>
      <p>
        <span className='slight-bold styledFont text-skyblue'>
          Date of Birth:{" "}
        </span>
        {getDate(profile.dob)}
      </p>
      <p>
        <span className='slight-bold styledFont text-skyblue'>
          Qualification:{" "}
        </span>
        {profile.qualification}
      </p>
      <p>
        <span className='slight-bold styledFont text-skyblue'>
          Started teaching:{" "}
        </span>
        {profile.startedTeaching}
      </p>
      <p>
        <span className='slight-bold styledFont text-skyblue'>
          Joining Date:{" "}
        </span>
        {getDate(profile.joiningDate)}
      </p>
    </>
  );

  const LoadSchoolProfile = () => (
    <>
      <p>
        <span className='slight-bold styledFont text-skyblue'>Board: </span>
        {profile.board}
      </p>
      <p>
        <span className='slight-bold styledFont text-skyblue'>Contact: </span>
        {profile.contact}
      </p>
      <p>
        <span className='slight-bold styledFont text-skyblue'>Address: </span>
        {profile.address}
      </p>
    </>
  );

  const profileTypes = {
    SchoolType: LoadSchoolProfile,
    StudentType: LoadStudentProfile,
    TeacherType: LoadTeacherProfile,
  };

  const LoadProfile = profileTypes[profile.__typename];

  return <LoadProfile />;
};
export default Info;
