import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { EXAMS_QUERY } from "../../../utils/query";
import {
  DELETE_EXAM_MUTATION,
  PUBLISH_EXAM_MUTATION,
} from "../../../utils/mutation";
import client from "../../../utils/apollo";
import CreateExam from "./CreateExam";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const Exam = () => {
  const { role, school } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [examsList, setExamsList] = useState([]);

  const navigate = useNavigate();

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    client
      .mutate({ mutation: DELETE_EXAM_MUTATION, variables: { id } })
      .then(
        (res) =>
          res.data.deleteExam.success &&
          setExamsList((exams) => exams.filter((exam) => exam.id !== id))
      )
      .catch((err) => err);
  };

  const handlePublish = (id) => {
    client
      .mutate({ mutation: PUBLISH_EXAM_MUTATION, variables: { id } })
      .then(
        (res) =>
          res.data.publishExam.success &&
          setExamsList((exams) =>
            exams.map((exam) =>
              exam.id === id ? { ...exam, isPublished: true } : exam
            )
          )
      )
      .catch((err) => err);
  };

  useEffect(() => {
    if (role === null) return;
    else if (role !== "SCHOOL") return navigate("/access_denied");

    document.title = "Exam";
    client
      .query({ query: EXAMS_QUERY, variables: { school } })
      .then((res) => {
        setExamsList(res.data.exams);
        setIsLoading(false);
      })
      .catch((err) => err);
  }, [navigate, role, school]);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className='container my-3'>
      <CreateExam setExamsList={setExamsList} />
      {examsList.length !== 0 ? (
        examsList.map((exam, i) => (
          <div
            className='bg-dark my-3 p-5 rounded d-flex justify-content-between align-items-center'
            key={i}>
            <span className='styledFont'>{exam.name}</span>
            <div className='text-end'>
              {!exam.isPublished && (
                <button
                  className='btn btn-success btn-sm me-3'
                  onClick={() => handlePublish(exam.id)}>
                  Publish Results
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    fill='currentColor'
                    className='bi bi-send-fill ms-2'
                    viewBox='0 0 16 16'>
                    <path
                      fillRule='evenodd'
                      d='M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89.471-1.178-1.178.471L5.93 9.363l.338.215a.5.5 0 0 1 .154.154l.215.338 7.494-7.494Z'
                    />
                  </svg>
                </button>
              )}
              <button
                className='btn btn-outline-danger btn-sm'
                onClick={() => handleDelete(exam.id)}>
                <i className='bi bi-trash-fill' />
              </button>
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

export default Exam;
