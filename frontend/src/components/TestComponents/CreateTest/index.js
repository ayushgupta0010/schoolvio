import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CREATE_TEST_MUTATION } from "../../../utils/mutation";
import { TESTS_BY_TEACHER_QUERY } from "../../../utils/query";
import client from "../../../utils/apollo";
import Headers from "../Common/Headers";
import LoadQuestions from "../Common/LoadQuestions";

const newQuestion = {
  question: "",
  optA: "",
  optB: "",
  optC: "",
  optD: "",
  correctOpt: "",
};

const CreateTest = () => {
  const { role } = useSelector((state) => state.auth);

  const [currentClass, setCurrentClass] = useState("");
  const [currentSection, setCurrentSection] = useState("");
  const [duration, setDuration] = useState(0);
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [msg, setMsg] = useState({ text: "", color: "" });

  const navigate = useNavigate();

  const addNewQuestion = () =>
    setQuestions((original) => [...original, newQuestion]);

  const removeQuestion = (index) =>
    setQuestions((questions) => questions.filter((q, i) => i !== index));

  const handleChange = (e, index) => {
    setQuestions(
      questions.map((question, i) =>
        i === index
          ? { ...question, [e.target.name]: e.target.value }
          : question
      )
    );
  };

  const handleCorrectOptChange = (e, index) => {
    setQuestions(
      questions.map((que, i) =>
        i === index ? { ...que, correctOpt: e.target.value } : que
      )
    );
  };

  const resetForm = () => {
    setCurrentClass("");
    setCurrentSection("");
    setDuration(0);
    setSubject("");
    setTitle("");
    setQuestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (questions.length === 0) {
      alert("Please add atleast 1 question");
      return;
    }
    setMsg({ text: "Saving...", color: "info" });
    let classSection = `C_${currentClass}_${currentSection}`;
    let temp_ques = questions.map((que, i) => ({ ...que, id: i + 1 }));
    let variables = {
      title,
      duration,
      classSection,
      subject,
      questions: JSON.stringify(temp_ques),
    };

    client
      .mutate({
        mutation: CREATE_TEST_MUTATION,
        variables,
        refetchQueries: [TESTS_BY_TEACHER_QUERY],
      })
      .then((res) => {
        if (res.data.createTest.success) {
          resetForm();
          setMsg({ text: "Saved", color: "success" });
        }
      })
      .catch((err) =>
        setMsg({ text: "An unknown error occurred", color: "danger" })
      );

    setTimeout(() => setMsg({ text: "", color: "" }), 2000);
  };

  useEffect(() => {
    if (role === null) return;
    else if (role !== "TEACHER") return navigate("/access_denied");
    document.title = "Create Test";
  }, [navigate, role]);

  return (
    <div className='container my-3'>
      <div className='d-flex justify-content-center my-3'>
        {msg.text && (
          <div className={`alert alert-${msg.color}`} role='alert'>
            {msg.text}
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <Headers
          currentClass={currentClass}
          currentSection={currentSection}
          duration={duration}
          subject={subject}
          title={title}
          setTitle={setTitle}
          setSubject={setSubject}
          setDuration={setDuration}
          setCurrentClass={setCurrentClass}
          setCurrentSection={setCurrentSection}
        />
        <LoadQuestions
          questions={questions}
          handleChange={handleChange}
          removeQuestion={removeQuestion}
          handleCorrectOptChange={handleCorrectOptChange}
        />
        <hr />
        <div className='text-center'>
          <button className='btn' type='button' onClick={addNewQuestion}>
            <i className='bi bi-plus-circle' style={{ fontSize: "30px" }} />
          </button>
        </div>
        <div className='text-center'>
          <button className='btn btn-success' type='submit'>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTest;
