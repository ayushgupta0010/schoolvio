import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RESULT_CREATE_QUERY } from "../../../utils/query";
import { CREATE_RESULT_MUTATION } from "../../../utils/mutation";
import { rankingsCalculator } from "../Common/rankingsCalculator";
import client from "../../../utils/apollo";
import Header from "./Header";
import ListStudents from "../Common/ListStudents";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const getClass = (classSection) =>
  classSection.replace("C_", "").replace("_", "-");

const CreateResult = () => {
  const { role, classSection, school } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState("");
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [maxMarks, setMaxMarks] = useState(100);
  const [examsList, setExamsList] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [results, setResults] = useState({});
  const [rankings, setRankings] = useState({});
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg("Creating result. Please wait...");

    let finalResults = {};
    Object.keys(results).forEach((student) => {
      finalResults[student] = {
        ...results[student],
        ...rankings[student],
        examId: selectedExam,
        examName:
          examsList[examsList.findIndex((x) => x.id === selectedExam)].name,
      };
    });

    client
      .mutate({
        mutation: CREATE_RESULT_MUTATION,
        variables: {
          examId: selectedExam,
          classSection,
          results: JSON.stringify(finalResults),
        },
      })
      .then((res) => {
        if (res.data.createResult.success) {
          alert("Saved");
          return navigate("/results");
        } else {
          setMsg("An error occurred");
          setInterval(() => setMsg(""), 3000);
          alert(
            "An error occurred. You are trying to overwrite an existing result. Go to Results and edit the required result."
          );
        }
      })
      .catch((err) => err);
  };

  useEffect(() => {
    if (role === null || school === null) return;
    else if (role !== "TEACHER") return navigate("/access_denied");

    document.title = "Create Result";
    client
      .query({ query: RESULT_CREATE_QUERY, variables: { school } })
      .then((res) => {
        setExamsList(res.data.exams.filter((exam) => !exam.isPublished));
        res.data.students && setStudentsList(res.data.students);
        let sub = JSON.parse(res.data.subjects.data);
        let key = classSection.replace("C_", "").split("_")[0];
        if (sub[key] !== undefined) setSubjectList(sub[key]);
        setIsLoading(false);
      })
      .catch((err) => err);
  }, [classSection, navigate, role, school]);

  useEffect(() => {
    if (studentsList.length === 0 || subjectList.length === 0) return;

    let sub = subjectList.reduce(
      (res, subject) => ({
        ...res,
        [subject]: "",
      }),
      {}
    );

    setResults(
      studentsList.reduce(
        (res, student) => ({
          ...res,
          [student.user.username]: {
            ...res[student.user.username],
            name: student.name,
            photo: student.user.photo,
            classSection: getClass(student.classSection),
            rollNo: student.rollNo,
            admNo: student.admNo,
            subjects: sub,
            attendance: "",
            rank: "",
            percentage: "",
          },
        }),
        {}
      )
    );
  }, [studentsList, subjectList]);

  useEffect(() => {
    setRankings(rankingsCalculator(results, maxMarks, totalAttendance));
  }, [maxMarks, results, totalAttendance]);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className='container my-3'>
      <form onSubmit={handleSubmit}>
        <Header
          maxMarks={maxMarks}
          examsList={examsList}
          setMaxMarks={setMaxMarks}
          selectedExam={selectedExam}
          setSelectedExam={setSelectedExam}
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
            disabled={msg === "Creating result. Please wait..."}>
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateResult;
