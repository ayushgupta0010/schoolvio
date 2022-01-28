import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { uploadFile } from "../../../utils/fileManager";
import { EXAMS_QUERY } from "../../../utils/query";
import { CREATE_WRITTEN_EXAM_MUTATION } from "../../../utils/mutation";
import client from "../../../utils/apollo";
import ClassList from "../../UtilityComponents/ClassList";
import SectionList from "../../UtilityComponents/SectionList";
import SubjectList from "../../UtilityComponents/SubjectList";

const CreateWrittenExam = () => {
  const { school } = useSelector((state) => state.auth);

  const [examsList, setExamsList] = useState([]);
  const [currentClass, setCurrentClass] = useState("");
  const [currentSection, setCurrentSection] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState(0);
  const [files, setFiles] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [examName, setExamName] = useState("");
  const [classSection, setClassSection] = useState("");
  const [msg, setMsg] = useState({ text: "", color: "" });

  const handleFileInput = (e) => {
    let size = 0;
    for (let i = 0; i < e.target.files.length; i++) {
      size += e.target.files[i].size;
    }
    if (size > 20971520) {
      alert("File input size should be < 20MB");
      document.getElementById("exam-files").value = "";
    } else setFiles(e.target.files);
  };

  const handleAttachFiles = async () => {
    let fileUrls = [];
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let url = await uploadFile(
        file,
        `${school}/exams/${examName}/${classSection}/${subject}/${file.name}`
      );
      fileUrls.push(url);
    }
    setMsg({ text: "Your files have been uploaded", color: "success" });
    return fileUrls;
  };

  const clearForm = () => {
    setMsg({ text: "Created", color: "success" });
    setSelectedExam("");
    setCurrentClass("");
    setCurrentSection("");
    setSubject("");
    setDuration(0);
    setPublishDate("");
    document.getElementById("exam-files").value = "";
    setInterval(() => setMsg({ text: "", color: "" }), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: "Uploading your files. Please wait...", color: "info" });
    const fileUrls = await handleAttachFiles();
    const files = fileUrls.join(", ");
    await client
      .mutate({
        mutation: CREATE_WRITTEN_EXAM_MUTATION,
        variables: {
          examId: selectedExam,
          classSection,
          subject,
          files,
          publishDate,
          duration,
        },
      })
      .then((res) => {
        if (res.data.createWrittenExam.success) {
          clearForm();
        } else setMsg({ text: "Exam already exists", color: "danger" });
      })
      .catch((err) =>
        setMsg({ text: "Something went wrong", color: "danger" })
      );
  };

  useEffect(() => {
    if (school === null) return;
    document.title = "Create Written Exam";
    client
      .query({ query: EXAMS_QUERY, variables: { school } })
      .then((res) =>
        setExamsList(res.data.exams.filter((exam) => !exam.isPublished))
      )
      .catch((err) => err);
  }, [school]);

  useEffect(() => {
    setClassSection(`C_${currentClass}_${currentSection}`);
  }, [currentClass, currentSection]);

  useEffect(() => {
    let index = examsList.findIndex((x) => x.id === selectedExam);
    if (index === -1) return;
    setExamName(examsList[index].name);
  }, [examsList, selectedExam]);

  return (
    <div className='container my-3'>
      {msg.text && (
        <div className='d-flex justify-content-center my-3'>
          <div className={`alert alert-${msg.color}`} role='alert'>
            {msg.text}
          </div>
        </div>
      )}
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
        <div className='row g-2'>
          <div className='col-md'>
            <div className='form-floating mb-3'>
              <input
                type='datetime-local'
                className='form-control bg-transparent text-revert border-secondary'
                placeholder='Publish On'
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                required
              />
              <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
                Publish On
              </label>
            </div>
          </div>
          <div className='col-md'>
            <div className='form-floating mb-3'>
              <input
                type='number'
                className='form-control bg-transparent text-revert border-secondary'
                id='floatingInput'
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
              <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
                Duration (in minutes)
              </label>
            </div>
          </div>
        </div>
        <input
          className='form-control bg-transparent text-revert border-secondary'
          type='file'
          id='exam-files'
          onChange={handleFileInput}
          multiple
          required
        />
        <div className='text-center'>
          <button className='btn btn-dark mt-3'>Create</button>
        </div>
      </form>
    </div>
  );
};

export default CreateWrittenExam;
