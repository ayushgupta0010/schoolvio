import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { QUES_BY_USER_QUERY } from "../../../utils/query";
import client from "../../../utils/apollo";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const getAns = (ans) => (ans === 1 ? "1 answer" : ans + " answers");

const Questions = ({ username }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [questionsList, setQuestionsList] = useState([]);

  useEffect(() => {
    client
      .query({ query: QUES_BY_USER_QUERY, variables: { username } })
      .then((res) => {
        setQuestionsList(res.data.questions);
        setIsLoading(false);
      })
      .catch((err) => err);
  }, [username]);

  if (isLoading) return <LoadingComponent />;

  if (!isLoading && questionsList.length === 0) {
    return (
      <div className='text-center mt-6'>
        <p className='styledFont2'>This user has not asked any questions</p>
      </div>
    );
  }

  return (
    <>
      {questionsList.map((que, i) => (
        <div className='mt-3' key={i}>
          <div className='bg-secondary my-2 rounded p-5'>
            <Link to={`/question/${que.id}`} className='styledFont'>
              {que.question}
            </Link>
            <p className='styledFont2 text-primary'>
              {getAns(que.countAnswers)}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Questions;
