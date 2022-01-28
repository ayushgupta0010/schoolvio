import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RESULT_BY_ID_QUERY } from "../../../utils/query";
import client from "../../../utils/apollo";
import ListUnmodifiableStudents from "./ListUnmodifiableStudents";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const ViewResult = () => {
  const { role } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [examName, setExamName] = useState("");
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [maxMarks, setMaxMarks] = useState(100);
  const [results, setResults] = useState({});

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (role === null) return;
    else if (role === "STUDENT") return navigate("/access_denied");

    document.title = "View Result " + id;
    client
      .query({ query: RESULT_BY_ID_QUERY, variables: { id } })
      .then((res) => {
        if (res.data.result === null) return navigate("/page_not_found");
        let parsed_results = JSON.parse(res.data.result.results);
        let firstEntry = parsed_results[Object.keys(parsed_results)[0]];

        setExamName(firstEntry.examName);
        setMaxMarks(+firstEntry.maxMarks);
        setTotalAttendance(+firstEntry.totalAttendance);
        setResults(parsed_results);
        setIsLoading(false);
      })
      .catch((err) => err);
  }, [navigate, id, role]);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className='container my-3'>
      <div className='text-center'>
        <span className='styledFont'>{examName}</span>
        <hr className='mt-0' />
      </div>
      <div className='d-flex justify-content-between mb-3'>
        <span className='styledFont'>Total Attendance: {totalAttendance}</span>
        <span className='styledFont'>Max Marks: {maxMarks}</span>
      </div>
      <ListUnmodifiableStudents results={results} />
    </div>
  );
};

export default ViewResult;
