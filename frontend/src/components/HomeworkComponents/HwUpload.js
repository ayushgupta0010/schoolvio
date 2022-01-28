import React, { useState } from "react";
import { useSelector } from "react-redux";
import { uploadFile } from "../../utils/fileManager";
import { CREATE_HW_MUTATION } from "../../utils/mutation";
import client from "../../utils/apollo";
import ClassList from "../UtilityComponents/ClassList";
import SectionList from "../UtilityComponents/SectionList";
import SubjectList from "../UtilityComponents/SubjectList";

const HwUpload = ({ setHwList }) => {
  const { username } = useSelector((state) => state.auth);

  const [currentClass, setCurrentClass] = useState("");
  const [currentSection, setCurrentSection] = useState("");
  const [subject, setSubject] = useState("");
  const [files, setFiles] = useState([]);
  const [hw, setHw] = useState("");
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState({ text: "", color: "" });

  const handleFileInput = (e) => {
    let size = 0;
    for (let i = 0; i < e.target.files.length; i++) {
      size += e.target.files[i].size;
    }
    if (size > 10485760) {
      alert("File input size should be < 10MB");
      document.getElementById("hw-files").value = "";
    } else setFiles(e.target.files);
  };

  const handleAttachFiles = async () => {
    let fileUrls = [];
    setMsg({ text: "Uploading your files. Please wait...", color: "info" });
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let url = await uploadFile(file, `${username}/homeworks/${file.name}`);
      fileUrls.push(url);
    }
    setMsg({ text: "Your files have been uploaded", color: "success" });
    return fileUrls;
  };

  const clearForm = (elem) => {
    setMsg({ text: "Homework uploaded", color: "success" });
    setTitle("");
    setHw("");
    setCurrentClass("");
    setCurrentSection("");
    setSubject("");
    elem.value = "";
    setInterval(() => setMsg({ text: "", color: "" }), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const elem = document.getElementById("hw-files");
    const fileUrls = elem.files.length !== 0 ? await handleAttachFiles() : [];
    const classSection = `C_${currentClass}_${currentSection}`;
    const files = fileUrls.length !== 0 ? JSON.stringify(fileUrls) : "";
    client
      .mutate({
        mutation: CREATE_HW_MUTATION,
        variables: { title, homework: hw, files, classSection, subject },
      })
      .then((res) => {
        if (res.data.createHw.success) {
          clearForm(elem);
          setHwList((original) => [res.data.createHw.hw, ...original]);
        }
      })
      .catch((err) =>
        setMsg({ text: "Something went wrong", color: "danger" })
      );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='d-flex justify-content-center my-3'>
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
              onChange={(e) => setCurrentClass(e.target.value)}
              required>
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
              onChange={(e) => setCurrentSection(e.target.value)}
              required>
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
          id='floatingInput'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label htmlFor='floatingInput' className='text-skyblue fw-bolder'>
          Title
        </label>
      </div>

      <div className='form-floating mb-3'>
        <textarea
          className='form-control bg-transparent text-revert border-secondary'
          style={{ height: "200px" }}
          id='floatingTextarea'
          value={hw}
          onChange={(e) => setHw(e.target.value)}
          required
        />
        <label htmlFor='floatingTextarea' className='text-skyblue fw-bolder'>
          Homework
        </label>
      </div>

      <input
        className='form-control bg-transparent text-revert border-secondary'
        type='file'
        id='hw-files'
        multiple
        onChange={handleFileInput}
      />

      <button
        className='btn btn-dark mt-3'
        disabled={msg === "Uploading your files. Please wait..."}>
        Upload
      </button>
    </form>
  );
};

export default HwUpload;
