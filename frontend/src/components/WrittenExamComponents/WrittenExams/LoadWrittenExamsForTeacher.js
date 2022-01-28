import React, { useEffect, useState } from "react";
import { downloadFile } from "../../../utils/fileManager";
import {
  EXAMS_QUERY,
  WRITTEN_EXAMS_ANS_FOR_TEACHER_QUERY,
} from "../../../utils/query";
import client from "../../../utils/apollo";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";
import ClassList from "../../UtilityComponents/ClassList";
import SectionList from "../../UtilityComponents/SectionList";
import { useSelector } from "react-redux";
import SubjectList from "../../UtilityComponents/SubjectList";

const handleDownload = (files) => {
  let filesList = files.split(", ");
  for (let i = 0; i < filesList.length; i++) downloadFile(filesList[i]);
};

const LoadWrittenExamsForTeacher = () => {
  const { school } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [currentClass, setCurrentClass] = useState("");
  const [currentSection, setCurrentSection] = useState("");
  const [examsList, setExamsList] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [writtenExamsAnswers, setWrittenExamsAnswers] = useState([]);

  const handleSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (
      subject === "" ||
      selectedExam === "" ||
      currentClass === "" ||
      currentSection === ""
    )
      return;
    let classSection = `C_${currentClass}_${currentSection}`;
    client
      .query({
        query: WRITTEN_EXAMS_ANS_FOR_TEACHER_QUERY,
        variables: { id: selectedExam, subject, classSection },
      })
      .then((res) => {
        setWrittenExamsAnswers(res.data.ans);
        setIsLoading(false);
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

  if (isLoading) return <LoadingComponent />;

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

        <div className='form-floating mb-3'>
          <select
            className='form-select bg-transparent text-revert border-secondary'
            id='floatingSelectGrid'
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required>
            <SubjectList />
          </select>
          <label htmlFor='floatingSelect' className='text-skyblue fw-bolder'>
            Subject
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

      {writtenExamsAnswers.length !== 0 ? (
        writtenExamsAnswers.map((ans, i) => (
          <div
            className='bg-dark p-5 my-2 rounded d-flex justify-content-between align-items-center'
            key={i}>
            <div>
              <img
                className='rounded-circle me-3'
                style={{ width: "50px", height: "50px" }}
                src={ans.student.user.photo}
                alt='profile-pic'
              />
              <span className='styledFont'>{ans.student.name}</span>
            </div>
            <button
              className='btn btn-sm btn-outline-success'
              onClick={() => handleDownload(ans.files)}>
              Download files <i className='bi bi-chevron-double-down' />
            </button>
          </div>
        ))
      ) : (
        <div className='mt-5 text-center'>
          <span className='styledFont'>No exam answers found</span>
        </div>
      )}
    </div>
  );
};

export default LoadWrittenExamsForTeacher;
