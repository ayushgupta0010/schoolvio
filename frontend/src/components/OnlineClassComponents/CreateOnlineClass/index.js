import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CREATE_ONLINE_CLASS_MUTATION } from "../../../utils/mutation";
import client from "../../../utils/apollo";
import ClassList from "../../UtilityComponents/ClassList";
import SectionList from "../../UtilityComponents/SectionList";
import SubjectList from "../../UtilityComponents/SubjectList";

const CreateOnlineClass = () => {
  const { role } = useSelector((state) => state.auth);

  const [link, setLink] = useState("");
  const [subject, setSubject] = useState("");
  const [endTime, setEndTime] = useState("");
  const [passcode, setPasscode] = useState("");
  const [startTime, setStartTime] = useState("");
  const [currentClass, setCurrentClass] = useState("");
  const [currentSection, setCurrentSection] = useState("");

  const navigate = useNavigate();

  const clearForm = () => {
    setLink("");
    setSubject("");
    setEndTime("");
    setPasscode("");
    setStartTime("");
    setCurrentClass("");
    setCurrentSection("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let classSection = `C_${currentClass}_${currentSection}`;
    client
      .mutate({
        mutation: CREATE_ONLINE_CLASS_MUTATION,
        variables: {
          link,
          subject,
          endTime,
          passcode,
          startTime,
          classSection,
        },
      })
      .then((res) => {
        if (res.data.createOnlineClass.success) {
          clearForm();
          alert("Created");
        } else alert("Something went wrong");
      })
      .catch((err) => err);
  };

  useEffect(() => {
    if (role === null) return;
    else if (role !== "TEACHER") return navigate("/access_denied");

    document.title = "Create Online Class";
  }, [navigate, role]);

  return (
    <div className='container my-3'>
      <form onSubmit={handleSubmit}>
        <div className='row g-2'>
          <div className='col-md'>
            <div className='form-floating mb-3'>
              <input
                type='datetime-local'
                className='form-control bg-transparent text-revert border-secondary'
                id='floatingInput'
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
              <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
                Start Time
              </label>
            </div>
          </div>

          <div className='col-md'>
            <div className='form-floating mb-3'>
              <input
                type='datetime-local'
                className='form-control bg-transparent text-revert border-secondary'
                id='floatingInput'
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
              <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
                End Time
              </label>
            </div>
          </div>
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

        <div className='form-floating mb-3'>
          <input
            type='text'
            className='form-control bg-transparent text-revert border-secondary'
            placeholder='Link'
            id='floatingInput'
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
          <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
            Link
          </label>
        </div>

        <div className='form-floating mb-3'>
          <input
            type='text'
            className='form-control bg-transparent text-revert border-secondary'
            placeholder='Passcode (Optional)'
            id='floatingInput'
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
          />
          <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
            Passcode (Optional)
          </label>
        </div>

        <div className='text-center'>
          <button className='btn btn-outline-success'>Create</button>
        </div>
      </form>
    </div>
  );
};

export default CreateOnlineClass;
