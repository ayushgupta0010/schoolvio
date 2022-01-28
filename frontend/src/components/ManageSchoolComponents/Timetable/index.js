import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { UPDATE_TIMETABLE_MUTATION } from "../../../utils/mutation";
import { TEACHERS_LIST_QUERY, TIMETABLE_QUERY } from "../../../utils/query";
import client from "../../../utils/apollo";
import ClassList from "../../UtilityComponents/ClassList";
import SectionList from "../../UtilityComponents/SectionList";
import ListTeacher from "./ListTeacher";
import PeriodHeader from "./PeriodHeader";
import SubjectListTR from "./SubjectListTR";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const TimeTable = () => {
  const { school, role } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [currentClass, setCurrentClass] = useState("1");
  const [currentSection, setCurrentSection] = useState("A");
  const [teachersList, setTeachersList] = useState([]);
  const [timeTable, setTimeTable] = useState({});
  const [msg, setMsg] = useState({ text: "", color: "" });

  const handleClassTeacherChange = (e) => {
    const classSection = `${currentClass}-${currentSection}`;
    setTimeTable((original) => ({
      ...original,
      [classSection]: {
        ...original[classSection],
        classTeacher: e.target.value,
      },
    }));
  };

  const handleTimeTableChange = (e, day, period) => {
    const classSection = `${currentClass}-${currentSection}`;
    setTimeTable((original) => ({
      ...original,
      [classSection]: {
        ...original?.[classSection],
        [day]: {
          ...original?.[classSection]?.[day],
          [period]: {
            ...original?.[classSection]?.[day]?.[period],
            [e.target.name]: e.target.value,
          },
        },
      },
    }));
  };

  const handleTimeTableSubmit = () => {
    setMsg({ text: "Saving...", color: "info" });
    client
      .mutate({
        mutation: UPDATE_TIMETABLE_MUTATION,
        variables: { data: JSON.stringify(timeTable) },
      })
      .then((res) => {
        setTimeTable(JSON.parse(res.data.updateTimetable.timetable.detail));
        setMsg({ text: "Saved", color: "success" });
        setTimeout(() => setMsg({ text: "", color: "" }), 2000);
      })
      .catch((err) =>
        setMsg({ text: "Something went wrong", color: "danger" })
      );
  };

  const getTimeTable = useCallback(async () => {
    await client
      .query({ query: TIMETABLE_QUERY, variables: { school } })
      .then(
        (res) =>
          res.data.timetable.detail &&
          setTimeTable(JSON.parse(res.data.timetable.detail))
      )
      .catch((err) => err);
  }, [school]);

  const getTeachersList = useCallback(async () => {
    await client
      .query({ query: TEACHERS_LIST_QUERY, variables: { school } })
      .then((res) => setTeachersList(res.data.teachersList))
      .catch((err) => err);
  }, [school]);

  useEffect(() => {
    document.title = "Time Table";
    if (!school) return;
    getTeachersList();
    getTimeTable();
    setIsLoading(false);
  }, [getTeachersList, getTimeTable, school]);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className='container my-5'>
      <div className='d-flex justify-content-center'>
        {msg.text && (
          <div className={`alert alert-${msg.color}`} role='alert'>
            {msg.text}
          </div>
        )}
      </div>
      <div className='row g-2'>
        <div className='col-md'>
          <div className='form-floating mb-3'>
            <select
              className='form-select bg-transparent text-revert border-secondary'
              id='floatingSelect'
              value={currentClass}
              onChange={(e) => setCurrentClass(e.target.value)}>
              <ClassList />
            </select>
            <label htmlFor='floatingSelect' className='text-skyblue fw-bolder'>
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
              onChange={(e) => setCurrentSection(e.target.value)}>
              <SectionList />
            </select>
            <label htmlFor='floatingSelect' className='text-skyblue fw-bolder'>
              Section
            </label>
          </div>
        </div>
      </div>

      <div className='form-floating mb-3'>
        <select
          className='form-select bg-transparent text-revert border-secondary'
          id='floatingSelectGrid'
          value={
            timeTable[`${currentClass}-${currentSection}`]
              ? timeTable[`${currentClass}-${currentSection}`].classTeacher
              : ""
          }
          onChange={handleClassTeacherChange}
          disabled={role !== "SCHOOL"}>
          <option className='bg-dark text-revert' value='' disabled hidden>
            Select class teacher
          </option>
          <ListTeacher teachersList={teachersList} />
        </select>
        <label htmlFor='floatingSelect' className='text-skyblue fw-bolder'>
          Class Teacher
        </label>
      </div>

      <div className='table-responsive'>
        <table className='table table-bordered table-dark'>
          <thead>
            <tr>
              <th />
              <PeriodHeader />
            </tr>
          </thead>
          <tbody>
            <SubjectListTR
              data={{
                role,
                timeTable,
                teachersList,
                currentClass,
                currentSection,
                handleTimeTableChange,
              }}
            />
          </tbody>
        </table>
      </div>
      {role === "SCHOOL" && (
        <div className='text-center mb-3'>
          <button
            className='btn btn-outline-success'
            onClick={handleTimeTableSubmit}>
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default TimeTable;
