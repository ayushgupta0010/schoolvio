import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { EXAMS_QUERY, RESULTS_FOR_SCHOOL_QUERY } from "../../../utils/query";
import client from "../../../utils/apollo";
import ClassList from "../../UtilityComponents/ClassList";
import SectionList from "../../UtilityComponents/SectionList";

const LoadResultsForSchool = () => {
  const { school } = useSelector((state) => state.auth);

  const [currentClass, setCurrentClass] = useState("");
  const [currentSection, setCurrentSection] = useState("");
  const [examsList, setExamsList] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [result, setResult] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const classSection = `C_${currentClass}_${currentSection}`;
    client
      .query({
        query: RESULTS_FOR_SCHOOL_QUERY,
        variables: { examId: selectedExam, classSection },
      })
      .then((res) => {
        if (res.data.result === null) {
          alert("No result found");
          return;
        }
        setResult(res.data.result);
      })
      .catch((err) => err);
  };

  useEffect(() => {
    if (school === null) return;
    client
      .query({ query: EXAMS_QUERY, variables: { school } })
      .then((res) => setExamsList(res.data.exams))
      .catch((err) => err);
  }, [school]);

  return (
    <div className='container my-3'>
      <form onSubmit={handleSubmit}>
        <div className='form-floating mb-3'>
          <select
            className='form-select bg-transparent text-revert border-secondary'
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            required>
            <option value='' disabled hidden>
              Select an exam
            </option>
            {examsList.map((exam, i) => (
              <option
                className='bg-secondary text-revert'
                value={exam.id}
                key={i}>
                {exam.name}
              </option>
            ))}
          </select>
          <label htmlFor='floatingSelect' className='text-skyblue fw-bolder'>
            Exam
          </label>
        </div>
        <div className='row g-2'>
          <div className='col-md'>
            <div className='form-floating mb-3'>
              <select
                className='form-select bg-transparent text-revert border-secondary'
                id='floatingSelect'
                value={currentClass}
                onChange={(e) => setCurrentClass(e.target.value)}
                required>
                <ClassList />
              </select>
              <label
                htmlFor='floatingSelect'
                className='text-skyblue fw-bolder'>
                Class
              </label>
            </div>
          </div>

          <div className='col-md'>
            <div className='form-floating mb-3'>
              <select
                className='form-select bg-transparent text-revert border-secondary'
                id='floatingSelectGrid'
                value={currentSection}
                onChange={(e) => setCurrentSection(e.target.value)}
                required>
                <SectionList />
              </select>
              <label
                htmlFor='floatingSelect'
                className='text-skyblue fw-bolder'>
                Section
              </label>
            </div>
          </div>
        </div>
        <div className='text-center mt-2'>
          <button className='btn btn-outline-success'>
            <i className='bi bi-search fs-2' />
          </button>
        </div>
      </form>
      {result.id !== undefined && (
        <div className='bg-dark p-5 mt-3 rounded d-flex justify-content-between align-items-center'>
          <span className='styledFont fs-6'>{result.exam.name}</span>
          <Link
            to={`/results/view/${result.id}`}
            className='btn btn-sm btn-outline-info'>
            View
          </Link>
        </div>
      )}
    </div>
  );
};

export default LoadResultsForSchool;
