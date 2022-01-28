import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import LoadWrittenExamsForSchool from "./LoadWrittenExamsForSchool";
import LoadWrittenExamsForStudent from "./LoadWrittenExamsForStudent";
import LoadWrittenExamsForTeacher from "./LoadWrittenExamsForTeacher";

const LoadWrittenExams = {
  SCHOOL: <LoadWrittenExamsForSchool />,
  STUDENT: <LoadWrittenExamsForStudent />,
  TEACHER: <LoadWrittenExamsForTeacher />,
};

const WrittenExams = () => {
  const { role } = useSelector((state) => state.auth);

  useEffect(() => (document.title = "Written Exams"), []);

  return <>{role && LoadWrittenExams[role]}</>;
};

export default WrittenExams;
