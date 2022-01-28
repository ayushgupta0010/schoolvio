import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RESULTS_BY_TEACHER_QUERY } from "../../../utils/query";
import client from "../../../utils/apollo";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const LoadResultsForTeacher = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [resultsList, setResultsList] = useState([]);

  useEffect(() => {
    client
      .query({ query: RESULTS_BY_TEACHER_QUERY })
      .then((res) => {
        setResultsList(res.data.results);
        setIsLoading(false);
      })
      .catch((err) => err);
  }, []);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className='container my-3'>
      <Link
        to='/results/create'
        className='styledButton text-white'
        style={{ width: "225px" }}>
        Create Result
      </Link>

      {resultsList.length !== 0 ? (
        resultsList.map((res, i) => (
          <div
            className='bg-dark my-3 p-5 rounded d-flex justify-content-between align-items-center'
            key={i}>
            <span className='styledFont'>{res.exam.name}</span>
            <div className='text-end'>
              {!res.exam.isPublished && (
                <Link
                  to={`/results/edit/${res.id}`}
                  className='btn btn-sm btn-outline-danger me-3'>
                  Edit
                </Link>
              )}
              <Link
                to={`/results/view/${res.id}`}
                className='btn btn-sm btn-info'>
                View
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div className='mt-5 text-center'>
          <span className='styledFont'>No results found</span>
        </div>
      )}
    </div>
  );
};

export default LoadResultsForTeacher;
