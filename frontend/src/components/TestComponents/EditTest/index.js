import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { EDIT_TEST_MUTATION } from "../../../utils/mutation";
import { TEST_BY_ID_QUERY } from "../../../utils/query";
import client from "../../../utils/apollo";
import Headers from "../Common/Headers";
import LoadQuestions from "../Common/LoadQuestions";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const newQuestion = {
  question: "",
  optA: "",
  optB: "",
  optC: "",
  optD: "",
  correctOpt: "",
};

const EditTest = () => {
  const { username, role } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [currentClass, setCurrentClass] = useState("");
  const [currentSection, setCurrentSection] = useState("");
  const [duration, setDuration] = useState(0);
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [found, setFound] = useState();
  const [msg, setMsg] = useState({ text: "", color: "" });

  const { id } = useParams();

  const navigate = useNavigate();

  const addNewQuestion = () =>
    setQuestions((original) => [...original, newQuestion]);

  const removeQuestion = (index) =>
    setQuestions((questions) => questions.filter((q, i) => i !== index));

  const handleChange = (e, index) => {
    setQuestions(
      questions.map((que, i) =>
        i === index ? { ...que, [e.target.name]: e.target.value } : que
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
      id,
      title,
      subject,
      duration,
      classSection,
      questions: JSON.stringify(temp_ques),
    };

    client
      .mutate({ mutation: EDIT_TEST_MUTATION, variables })
      .then((res) => {
        if (!res.data.editTest.success) return;
        setMsg({ text: "Saved", color: "success" });
        alert("Saved");
      })
      .catch((err) =>
        setMsg({ text: "An unknown error occurred", color: "danger" })
      );

    setTimeout(() => setMsg({ text: "", color: "" }), 2000);
  };

  useEffect(() => {
    document.title = "Edit Test " + id;

    if (username === null || role === null) return;
    else if (role !== "TEACHER") return navigate("/access_denied");

    client
      .query({ query: TEST_BY_ID_QUERY, variables: { id } })
      .then((res) => {
        if (res.data.test === null) {
          setFound(false);
          return;
        }

        let test = res.data.test;
        if (test.teacher.user.username !== username || test.isPublished)
          return navigate("/access_denied");
        else {
          setCurrentClass(test.classSection.replace("C_", "").split("_")[0]);
          setCurrentSection(test.classSection.replace("C_", "").split("_")[1]);
          setTitle(test.title);
          setDuration(test.duration);
          setSubject(test.subject);
          setQuestions(JSON.parse(test.questions));
        }
        setFound(true);
        setIsLoading(false);
      })
      .catch((err) => err);
  }, [navigate, id, role, username]);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className='container my-3'>
      <div className='d-flex justify-content-center my-3'>
        {msg.text && (
          <div className={`alert alert-${msg.color}`} role='alert'>
            {msg.text}
          </div>
        )}
      </div>
      {found && (
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
      )}
    </div>
  );
};

export default EditTest;
