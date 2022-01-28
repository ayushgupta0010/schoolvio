import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadClassesForSchool from "./LoadClassesForSchool";
import LoadClassesForStudent from "./LoadClassesForStudent";
import LoadClassesForTeacher from "./LoadClassesForTeacher";

const OnlineClasses = () => {
  const { role } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (role === null) return;
    document.title = "Online Classes";
  }, [navigate, role]);

  return (
    <>
      {role === "SCHOOL" && <LoadClassesForSchool />}
      {role === "STUDENT" && <LoadClassesForStudent />}
      {role === "TEACHER" && <LoadClassesForTeacher />}
    </>
  );
};

export default OnlineClasses;
