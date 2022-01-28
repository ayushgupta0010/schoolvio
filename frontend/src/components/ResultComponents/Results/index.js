import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import LoadResultsForSchool from "./LoadResultsForSchool";
import LoadResultsForStudent from "./LoadResultsForStudent";
import LoadResultsForTeacher from "./LoadResultsForTeacher";

const LoadResults = {
  SCHOOL: <LoadResultsForSchool />,
  STUDENT: <LoadResultsForStudent />,
  TEACHER: <LoadResultsForTeacher />,
};

const Results = () => {
  const { role } = useSelector((state) => state.auth);

  useEffect(() => (document.title = "Results"), []);

  return <>{role && LoadResults[role]}</>;
};

export default Results;
