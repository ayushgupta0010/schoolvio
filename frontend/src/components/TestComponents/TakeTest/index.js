import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { TEST_BY_ID_QUERY } from "../../../utils/query";
import { CREATE_TEST_ANSWER_MUTATION } from "../../../utils/mutation";
import client from "../../../utils/apollo";
import QuestionsList from "./QuestionsList";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const TakeTest = () => {
  const { role, classSection, school } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [found, setFound] = useState();
  const [test, setTest] = useState({});

  const { id } = useParams();

  const navigate = useNavigate();

  const handleAnsChange = (e, ans_id) => {
    setAnswers((answers) =>
      answers.map((ans) =>
        ans.id === ans_id ? { ...ans, myAns: e.target.value } : ans
      )
    );
  };

  const handleSubmit = () => {
    let total = 0;
    let marks = 0;
    answers.forEach((ans) => {
      if (ans.correctOpt === ans.myAns) ++marks;
      ++total;
    });

    let variables = {
      id,
      answers: JSON.stringify(answers),
      marks: `${marks}/${total}`,
    };

    client
      .mutate({ mutation: CREATE_TEST_ANSWER_MUTATION, variables })
      .then((res) => {
        if (res.data.createTestAnswer.success) {
          setTest((original) => ({ ...original, isTestTaken: true }));
          alert("Your marks: " + variables.marks);
          return navigate("/test");
        } else alert("An unknown error occurred");
      })
      .catch((err) => err);
  };

  useEffect(() => {
    if (role === null) return;
    else if (role !== "STUDENT") return navigate("/access_denied");

    document.title = "Test " + id;
    client
      .query({ query: TEST_BY_ID_QUERY, variables: { id } })
      .then((res) => {
        if (res.data.test === null) {
          setFound(false);
          return;
        }

        let t = {
          ...res.data.test,
          questions: JSON.parse(res.data.test.questions),
        };

        if (
          !t.isPublished ||
          classSection !== t.classSection ||
          school !== t.teacher.school.user.username ||
          t.isTestTaken
        ) {
          return navigate("/access_denied");
        } else {
          setTest(t);
          setFound(true);
          setIsLoading(false);
        }
      })
      .catch((err) => err);
  }, [classSection, navigate, id, role, school]);

  useEffect(() => {
    if (test.questions === undefined) return;
    test.questions.forEach((que) =>
      setAnswers((original) => [
        ...original,
        { id: que.id, correctOpt: que.correctOpt, myAns: "" },
      ])
    );
  }, [test]);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className='container my-3'>
      {found && (
        <div className='bg-dark rounded p-5'>
          <p className='styledFont fs-6 text-center'>{test.title}</p>
          <hr />
          <div className='d-flex justify-content-between'>
            <span className='styledFont fs-6'>Subject: {test.subject}</span>
            <span className='styledFont fs-6'>
              Time left:{" "}
              <Countdown
                className='styledFont text-info'
                date={Date.now() + test.duration * 60 * 1000}
                onComplete={handleSubmit}
              />
            </span>
          </div>
          <QuestionsList
            questions={test.questions}
            handleAnsChange={handleAnsChange}
          />
          {!test.isTestTaken && (
            <div className='text-center'>
              <button
                className='btn btn-outline-success'
                onClick={handleSubmit}>
                Submit
              </button>
            </div>
          )}
        </div>
      )}
      {found === false && (
        <div className='text-center mt-5'>This test does not exists</div>
      )}
    </div>
  );
};

export default TakeTest;
