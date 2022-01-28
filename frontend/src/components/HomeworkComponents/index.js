import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HW_BY_TEACHER_QUERY, HW_FOR_CLASS_QUERY } from "../../utils/query";
import client from "../../utils/apollo";
import HwUpload from "./HwUpload";
import ListHw from "./ListHw";
import LoadingComponent from "../UtilityComponents/LoadingComponent";

const Homework = () => {
  const { role } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [hwList, setHwList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (role === null) return;
    else if (role === "SCHOOL") return navigate("/access_denied");

    document.title = "Homework";
    let query = role === "TEACHER" ? HW_BY_TEACHER_QUERY : HW_FOR_CLASS_QUERY;
    client
      .query({ query })
      .then((res) => {
        res.data.hwList && setHwList(res.data.hwList);
        setIsLoading(false);
      })
      .catch((err) => err);
  }, [navigate, role]);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className='container my-5'>
      {role === "TEACHER" && (
        <>
          <div className='d-flex justify-content-center d-md-block'>
            <button
              className='styledButton m-0 mb-5'
              type='button'
              style={{ width: "225px" }}
              data-bs-toggle='collapse'
              data-bs-target='#homeworkBox'
              aria-expanded='false'
              aria-controls='homeworkBox'>
              Upload homework
            </button>
          </div>
          <div className='collapse mb-3 bg-black p-3 rounded' id='homeworkBox'>
            <HwUpload setHwList={setHwList} />
          </div>
        </>
      )}
      {hwList.length !== 0 ? (
        <ListHw hwList={hwList} role={role} setHwList={setHwList} />
      ) : (
        <div className='text-center mt-5'>
          <p className='styledFont2 text-revert'>No homeworks</p>
        </div>
      )}
    </div>
  );
};

export default Homework;
