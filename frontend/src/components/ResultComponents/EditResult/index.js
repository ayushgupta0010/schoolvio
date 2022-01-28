import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RESULT_BY_ID_QUERY } from "../../../utils/query";
import { EDIT_RESULT_MUTATION } from "../../../utils/mutation";
import { rankingsCalculator } from "../Common/rankingsCalculator";
import client from "../../../utils/apollo";
import Header from "./Header";
import ListStudents from "../Common/ListStudents";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const EditResult = () => {
  const { role, username } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [examName, setExamName] = useState("");
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [maxMarks, setMaxMarks] = useState(100);
  const [results, setResults] = useState({});
  const [rankings, setRankings] = useState({});
  const [msg, setMsg] = useState("");

  const { id } = useParams();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg("Saving. Please wait...");

    let finalResults = {};
    Object.keys(results).forEach((student) => {
      finalResults[student] = {
        ...results[student],
        ...rankings[student],
      };
    });

    client
      .mutate({
        mutation: EDIT_RESULT_MUTATION,
        variables: { id, results: JSON.stringify(finalResults) },
      })
      .then((res) => {
        if (!res.data.editResult.success) return;
        setMsg("Saved");
        setInterval(() => setMsg(""), 3000);
        alert("Saved");
      })
      .catch((err) => err);
  };

  useEffect(() => {
    if (role === null || username === null) return;
    else if (role !== "TEACHER") return navigate("/access_denied");

    document.title = "Edit Result " + id;
    client
      .query({ query: RESULT_BY_ID_QUERY, variables: { id } })
      .then((res) => {
        if (res.data.result === null) return navigate("/page_not_found");
        let tempResult = res.data.result;
        if (
          tempResult.exam.isPublished ||
          tempResult.teacher.user.username !== username
        ) {
          return navigate("/access_denied");
        }
        let parsed_results = JSON.parse(tempResult.results);
        let firstEntry = parsed_results[Object.keys(parsed_results)[0]];

        setExamName(firstEntry.examName);
        setMaxMarks(+firstEntry.maxMarks);
        setTotalAttendance(+firstEntry.totalAttendance);
        setResults(parsed_results);
        setIsLoading(false);
      })
      .catch((err) => err);
  }, [navigate, id, role, username]);

  useEffect(() => {
    setRankings(rankingsCalculator(results, maxMarks, totalAttendance));
  }, [maxMarks, results, totalAttendance]);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className='container my-3'>
      <form onSubmit={handleSubmit}>
        <Header
          examName={examName}
          maxMarks={maxMarks}
          setMaxMarks={setMaxMarks}
          totalAttendance={totalAttendance}
          setTotalAttendance={setTotalAttendance}
        />
        <ListStudents
          results={results}
          rankings={rankings}
          maxMarks={maxMarks}
          setResults={setResults}
          totalAttendance={totalAttendance}
        />
        <div className='text-center mt-5'>
          {msg && <p className='text-info'>{msg}</p>}
          <button
            className='btn btn-success'
            disabled={msg === "Saving. Please wait..."}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditResult;
