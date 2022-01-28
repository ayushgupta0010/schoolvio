import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { downloadFile } from "../../../utils/fileManager";
import { WRITTEN_EXAMS_BY_SCHOOL_QUERY } from "../../../utils/query";
import { DELETE_WRITTEN_EXAM_MUTATION } from "../../../utils/mutation";
import client from "../../../utils/apollo";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const getClassSection = (c) => c.replace("C_", "").replace("_", "-");

const getDate = (d) =>
  new Date(d).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });

const handleDownload = (files) => {
  let filesList = files.split(", ");
  for (let i = 0; i < filesList.length; i++) downloadFile(filesList[i]);
};

const LoadWrittenExamsForSchool = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [writtenExamsList, setWrittenExamsList] = useState([]);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    client
      .mutate({ mutation: DELETE_WRITTEN_EXAM_MUTATION, variables: { id } })
      .then((res) => {
        if (res.data.delete.success)
          setWrittenExamsList((exams) =>
            exams.filter((exam) => exam.id !== id)
          );
      })
      .catch((err) => err);
  };

  useEffect(() => {
    client
      .query({ query: WRITTEN_EXAMS_BY_SCHOOL_QUERY })
      .then((res) => {
        setWrittenExamsList(res.data.exams);
        setIsLoading(false);
      })
      .catch((err) => err);
  }, []);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className='container my-3'>
      <Link
        to='/school/written/exams/create'
        className='styledButton text-white'
        style={{ width: "225px" }}>
        Create Written Exam
      </Link>
      {writtenExamsList.length !== 0 ? (
        writtenExamsList.map((exam, i) => (
          <div className='bg-dark my-4 p-3 rounded' key={i}>
            <div className='container'>
              <span className='badge bg-primary me-2 styledFont'>
                {exam.subject.replaceAll("_", " ")}
              </span>
              <span className='badge bg-secondary'>
                Class {getClassSection(exam.classSection)}
              </span>
              <button
                className='btn btn-sm btn-outline-danger float-end'
                onClick={() => handleDelete(exam.id)}>
                <i className='bi bi-trash-fill' />
              </button>
              <div className='text-center'>
                <h3
                  className='text-revert border-bottom border-secondary'
                  style={{ fontFamily: "Poiret One" }}>
                  {exam.exam.name}
                </h3>
              </div>
              <span className='text-revert styledFont mb-2'>
                Duration (in mins): {exam.duration}
              </span>
              <div className='d-md-flex justify-content-between align-items-center'>
                <span className='text-revert styledFont2'>
                  {getDate(exam.publishDate)}
                </span>
                <button
                  className='btn btn-sm btn-outline-success'
                  onClick={() => handleDownload(exam.files)}>
                  Download files <i className='bi bi-chevron-double-down' />
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className='mt-5 text-center'>
          <span className='styledFont'>No exams found</span>
        </div>
      )}
    </div>
  );
};

export default LoadWrittenExamsForSchool;
