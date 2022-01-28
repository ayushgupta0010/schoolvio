import React, { useState, useEffect } from "react";
import { USER_DETAIL_FOR_SCHOOL_QUERY } from "../../../utils/query";
import client from "../../../utils/apollo";
import LoadStudent from "./LoadStudent";
import LoadTeacher from "./LoadTeacher";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const Details = ({ selectedUser: username, cleanForm }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});

  const handleChange = (e) => {
    if (
      (e.target.name === "name" ||
        e.target.name === "fatherName" ||
        e.target.name === "motherName" ||
        e.target.name === "principal") &&
      e.target.value.length > 50
    ) {
      alert("Only 50 characters allowed");
      return;
    } else if (e.target.name === "contact" && e.target.value.length > 10) {
      alert("Only 10 digits allowed");
      return;
    } else if (e.target.name === "busNo" && e.target.value.length > 2) {
      alert("Only 2 characters allowed");
      return;
    }

    setUser((original) => ({
      ...original,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    setIsLoading(true);
    client
      .query({ query: USER_DETAIL_FOR_SCHOOL_QUERY, variables: { username } })
      .then((res) => {
        setUser(res.data.profile);
        setIsLoading(false);
      })
      .catch((err) => err);
  }, [username]);

  if (isLoading) return <LoadingComponent />;

  return (
    <>
      {user.__typename === "StudentType" && (
        <LoadStudent
          student={user}
          handleChange={handleChange}
          cleanForm={cleanForm}
          setUser={setUser}
        />
      )}
      {user.__typename === "TeacherType" && (
        <LoadTeacher
          teacher={user}
          handleChange={handleChange}
          cleanForm={cleanForm}
          setUser={setUser}
        />
      )}
    </>
  );
};

export default Details;
