import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QUE_WITH_ANS_QUERY } from "../../../utils/query";
import { CREATE_ANSWER_MUTATION } from "../../../utils/mutation";
import client from "../../../utils/apollo";
import AnswersList from "./AnswersList";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const QuestionDetail = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [question, setQuestion] = useState({});
  const [answer, setAnswer] = useState("");
  const [msg, setMsg] = useState({ text: "", color: "" });

  const { id: questionId } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    client
      .mutate({
        mutation: CREATE_ANSWER_MUTATION,
        variables: { id: questionId, ans: answer },
      })
      .then((res) => {
        setQuestion(res.data.createAnswer.question);
        setAnswer("");
        setMsg({ text: "Answer uploaded", color: "success" });
        setInterval(() => setMsg({ text: "", color: "" }), 2000);
      })
      .catch((err) => err);
  };

  useEffect(() => {
    document.title = `Question ${questionId}`;
    client
      .query({ query: QUE_WITH_ANS_QUERY, variables: { id: questionId } })
      .then((res) => {
        res.data.queDetail
          ? setQuestion(res.data.queDetail)
          : setMsg({ text: "Question not found", color: "danger" });
        setIsLoading(false);
      })
      .catch((err) => err);
  }, [questionId]);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className='container my-5'>
      <div className='d-flex justify-content-center my-3'>
        {msg.text && (
          <div className={`alert alert-${msg.color}`} role='alert'>
            {msg.text}
          </div>
        )}
      </div>
      {Object.keys(question).length !== 0 && (
        <div className='bg-black p-3 py-5 rounded'>
          <header className='d-flex'>
            <Link
              to={`/profile/${question.user.username}`}
              className='d-block styledFont'>
              <img
                className='rounded-circle m-3'
                style={{ width: "75px", height: "75px" }}
                src={question.user.photo}
                alt='profile-pic'
              />
              {question.user.username}
            </Link>
          </header>
          <section className='mt-0 mx-3'>
            <p className='text-justify'>{question.question}</p>

            <button
              className='styledButton m-0 mb-3'
              style={{ width: "200px" }}
              data-bs-toggle='collapse'
              data-bs-target='#answerBox'
              aria-expanded='false'
              aria-controls='answerBox'>
              Add an answer
            </button>

            <div className='collapse mb-3' id='answerBox'>
              <form onSubmit={handleSubmit}>
                <div className='form-floating mb-3'>
                  <textarea
                    className='form-control bg-transparent text-revert border-secondary'
                    style={{ height: "200px" }}
                    id='floatingTextarea'
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    required
                  />
                  <label
                    htmlFor='floatingTextarea'
                    className='text-skyblue fw-bolder'>
                    Answer
                  </label>
                </div>
                <button className='btn btn-dark'>Post</button>
              </form>
            </div>

            <h3 className='styledFont text-skyblue border-bottom'>
              Answers
              <span className='badge bg-secondary ms-2 mb-1 styledFont'>
                {question.answers.length}
              </span>
            </h3>
            {question.answers.length !== 0 ? (
              <AnswersList answersList={question.answers} />
            ) : (
              <div className='text-center mt-5'>
                <p className='styledFont2 text-revert'>No answers</p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default QuestionDetail;
