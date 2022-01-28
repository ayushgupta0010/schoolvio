import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SUBJECTS_QUERY } from "../../../utils/query";
import { UPDATE_SUBJECT_MUTATION } from "../../../utils/mutation";
import client from "../../../utils/apollo";
import Header from "./Header";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const Subject = () => {
  const { role, school } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState({});

  const navigate = useNavigate();

  const handleSubmit = () => {
    client
      .mutate({
        mutation: UPDATE_SUBJECT_MUTATION,
        variables: { data: JSON.stringify(subjects) },
      })
      .then((res) => res.data.updateSubject.success && alert("Saved"))
      .catch((err) => err);
  };

  useEffect(() => {
    if (role === null || school === null) return;
    else if (role !== "SCHOOL") return navigate("/access_denied");

    document.title = "Edit Subjects";
    client
      .query({ query: SUBJECTS_QUERY, variables: { school } })
      .then((res) => {
        if (res.data.subjects.data !== null) {
          setSubjects(JSON.parse(res.data.subjects.data));
        }
        setIsLoading(false);
      })
      .catch((err) => err);
  }, [navigate, role, school]);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className='container my-3'>
      <Header subjects={subjects} setSubjects={setSubjects} />
      <hr />
      <div className='text-end'>
        <button className='btn btn-success' onClick={handleSubmit}>
          Save
        </button>
      </div>
      {Object.keys(subjects).map((x, i) => (
        <div className='bg-dark p-5 rounded my-2' key={i}>
          <span className='styledFont fs-6'>Class {x}: </span>
          <span>{subjects[x].join(", ")}</span>
        </div>
      ))}
    </div>
  );
};

export default Subject;
