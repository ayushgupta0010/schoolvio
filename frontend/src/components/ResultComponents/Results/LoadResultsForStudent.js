import React, { useEffect, useState } from "react";
import { RESULTS_FOR_STUDENT_QUERY } from "../../../utils/query";
import client from "../../../utils/apollo";
import StudentResultModal from "./StudentResultModal";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const LoadResultsForStudent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState({});
  const [resultsList, setResultsList] = useState([]);

  useEffect(() => {
    client
      .query({ query: RESULTS_FOR_STUDENT_QUERY })
      .then((res) => {
        setResultsList(res.data.results);
        setIsLoading(false);
      })
      .catch((err) => err);
  }, []);

  if (isLoading) return <LoadingComponent />;

  if (!isLoading && resultsList.length === 0) {
    return (
      <div className='mt-5 text-center'>
        <span className='styledFont'>No results found</span>
      </div>
    );
  }

  return (
    <div className='container my-3'>
      <StudentResultModal result={result} />
      {resultsList.map((res, i) => (
        <div
          className='bg-dark p-5 my-3 rounded d-flex justify-content-between align-items-center'
          key={i}>
          {res.exam.name}
          <button
            className='btn btn-sm btn-primary'
            data-bs-toggle='modal'
            data-bs-target='#studentResultModal'
            onClick={() => setResult(JSON.parse(res.result))}>
            View
          </button>
        </div>
      ))}
    </div>
  );
};

export default LoadResultsForStudent;
