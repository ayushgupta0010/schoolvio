import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ANS_BY_USER_QUERY } from "../../../utils/query";
import client from "../../../utils/apollo";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const Answers = ({ username }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [answersList, setAnswersList] = useState([]);

  useEffect(() => {
    client
      .query({ query: ANS_BY_USER_QUERY, variables: { username } })
      .then((res) => {
        setAnswersList(res.data.answers);
        setIsLoading(false);
      })
      .catch((err) => err);
  }, [username]);

  if (isLoading) return <LoadingComponent />;

  if (!isLoading && answersList.length === 0) {
    return (
      <div className='text-center mt-6'>
        <p className='styledFont2'>This user has not answered any questions</p>
      </div>
    );
  }

  return (
    <>
      {answersList.map((ans, i) => (
        <div className='mt-3' key={i}>
          <div className='bg-secondary my-2 rounded p-5'>
            <Link to={`/question/${ans.question.id}`} className='styledFont'>
              {ans.question.question}
            </Link>
            <p className='styledFont2 text-primary px-5'>{ans.answer}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Answers;
