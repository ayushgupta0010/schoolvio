import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ATTENDANCE_FOR_DATE_QUERY,
  STUDENTS_FOR_ATTENDANCE_QUERY,
} from "../../utils/query";
import { ATTENDANCE_EDIT_MUTATION } from "../../utils/mutation";
import client from "../../utils/apollo";
import LoadingComponent from "../UtilityComponents/LoadingComponent";

const Attendance = () => {
  const { role } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [id, setId] = useState();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const navigate = useNavigate();

  const handleChange = (id) => {
    setAttendance((att) =>
      att.map((s) => (s.id === id ? { ...s, present: !s.present } : s))
    );
  };

  const handleSave = () => {
    let data = JSON.stringify(attendance);
    client
      .mutate({
        mutation: ATTENDANCE_EDIT_MUTATION,
        variables: { id, data },
      })
      .then((res) => res.data.editAttendance.success && alert("Saved"))
      .catch((err) => err);
  };

  useEffect(() => {
    if (role === null) return;
    if (role !== "TEACHER") return navigate("/access_denied");

    document.title = "Attendance";
    client
      .query({ query: ATTENDANCE_FOR_DATE_QUERY, variables: { date } })
      .then((res) => {
        if (res.data.attendance.data !== null) {
          setAttendance(JSON.parse(res.data.attendance.data));
        } else {
          client
            .query({
              query: STUDENTS_FOR_ATTENDANCE_QUERY,
              fetchPolicy: "cache-first",
            })
            .then((res) => {
              let students = res.data.students;
              setAttendance(
                students.map((student) => ({
                  id: student.id,
                  name: student.name,
                  photo: student.user.photo,
                  present: false,
                }))
              );
            })
            .catch((err) => err);
        }
        setId(res.data.attendance.id);
        setIsLoading(false);
      })
      .catch((err) => err);
  }, [date, navigate, role]);

  if (isLoading) return <LoadingComponent />;

  if (!isLoading && attendance.length === 0) {
    return <div className='text-center'>No students found for you</div>;
  }

  return (
    <div className='container my-3'>
      <div className='form-floating mb-3'>
        <input
          type='date'
          className='form-control bg-transparent text-revert border-secondary'
          id='floatingInput'
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
          Filter by date
        </label>
      </div>
      <div className='text-center mb-3'>
        <button className='btn btn-success' onClick={handleSave}>
          Save
        </button>
      </div>
      {attendance.map((student, i) => (
        <div
          className='bg-dark p-5 my-2 rounded d-flex justify-content-between align-items-center'
          key={i}>
          <div>
            <img
              className='rounded-circle me-3'
              style={{ width: "50px", height: "50px" }}
              src={student.photo}
              alt='profile-pic'
            />
            <span className='styledFont'>{student.name}</span>
          </div>
          <div>
            <input
              className={`form-check-input me-5 fs-1 bg-${
                student.present ? "success" : "danger"
              }`}
              type='checkbox'
              checked={student.present}
              onChange={() => handleChange(student.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Attendance;
