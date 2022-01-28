import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { PUBLISH_TEST_MUTATION } from "../../../utils/mutation";
import {
  TESTS_BY_TEACHER_QUERY,
  TESTS_FOR_STUDENT_QUERY,
} from "../../../utils/query";
import client from "../../../utils/apollo";
import Offcanvas from "./Offcanvas";
import LoadTestsForStudent from "./LoadTestsForStudent";
import LoadTestsForTeacher from "./LoadTestsForTeacher";
import Modal from "./Modal";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const Test = () => {
  const { role, classSection, school } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [modalData, setModalData] = useState({ questions: [], answers: [] });
  const [testsList, setTestsList] = useState([]);

  const navigate = useNavigate();

  const handlePublish = (id) => {
    client
      .mutate({ mutation: PUBLISH_TEST_MUTATION, variables: { id } })
      .then(
        (res) =>
          res.data.publishTest.success &&
          setTestsList((tests) =>
            tests.map((test) =>
              test.id === id ? { ...test, isPublished: true } : test
            )
          )
      )
      .catch((err) => err);
  };

  useEffect(() => {
    if (role === null) return;
    else if (role === "SCHOOL") return navigate("/access_denied");

    document.title = "Test";
    let query =
      role === "STUDENT" ? TESTS_FOR_STUDENT_QUERY : TESTS_BY_TEACHER_QUERY;
    let variables = role === "STUDENT" ? { school, classSection } : {};

    client
      .query({ query, variables })
      .then((res) => {
        setTestsList(res.data.tests);
        setIsLoading(false);
      })
      .catch((err) => err);
  }, [classSection, navigate, role, school]);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className='container'>
      <Modal questions={modalData.questions} answers={modalData.answers} />
      {role === "TEACHER" && (
        <>
          <div className='d-flex justify-content-center d-md-block'>
            <Link
              to='/test/create'
              className='styledButton text-white'
              style={{ width: "225px" }}>
              Create Test
            </Link>
          </div>
          {testsList.length !== 0 ? (
            <LoadTestsForTeacher
              testsList={testsList}
              handlePublish={handlePublish}
            />
          ) : (
            <span className='styledFont'>You have not given any tests</span>
          )}
          <Offcanvas testsList={testsList} setModalData={setModalData} />
        </>
      )}
      {role === "STUDENT" && (
        <>
          {testsList.length !== 0 ? (
            <LoadTestsForStudent
              testsList={testsList}
              setModalData={setModalData}
            />
          ) : (
            <div className='text-center mt-5'>
              <span className='styledFont'>No tests found for you</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Test;
