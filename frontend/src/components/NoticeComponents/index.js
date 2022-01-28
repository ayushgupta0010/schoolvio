import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CREATE_NOTICE_MUTATION } from "../../utils/mutation";
import { NOTICE_QUERY } from "../../utils/query";
import client from "../../utils/apollo";
import ListNotice from "./ListNotice";
import LoadingComponent from "../UtilityComponents/LoadingComponent";

const Notice = () => {
  const { role, school } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [noticeList, setNoticeList] = useState([]);
  const [msg, setMsg] = useState({ text: "", color: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    client
      .mutate({ mutation: CREATE_NOTICE_MUTATION, variables: { notice } })
      .then((res) => {
        res.data.createNotice.success &&
          setMsg({ text: "Notice added", color: "success" });
        setNoticeList([res.data.createNotice.notice, ...noticeList]);
        setNotice("");
        setTimeout(() => setMsg({ text: "", color: "" }), 2000);
      })
      .catch((err) =>
        setMsg({ text: "Something went wrong", color: "danger" })
      );
  };

  useEffect(() => {
    if (school === null) return;
    document.title = "Notice";
    client
      .query({ query: NOTICE_QUERY, variables: { school } })
      .then((res) => {
        res.data.notices && setNoticeList(res.data.notices);
        setIsLoading(false);
      })
      .catch((err) => err);
  }, [school]);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className='container my-5'>
      {role === "SCHOOL" && (
        <>
          <button
            className='styledButton m-0 mb-5'
            type='button'
            style={{ width: "225px" }}
            data-bs-toggle='collapse'
            data-bs-target='#noticeBox'
            aria-expanded='false'
            aria-controls='noticeBox'>
            Upload Notice
          </button>
          <form onSubmit={handleSubmit}>
            <div className='collapse mb-3 bg-black p-3 rounded' id='noticeBox'>
              <div className='d-flex justify-content-center'>
                {msg.text && (
                  <div className={`alert alert-${msg.color}`} role='alert'>
                    {msg.text}
                  </div>
                )}
              </div>
              <div className='form-floating mb-3'>
                <textarea
                  className='form-control bg-transparent text-revert border-secondary'
                  style={{ height: "200px" }}
                  id='floatingTextarea'
                  value={notice}
                  onChange={(e) => setNotice(e.target.value)}
                  required
                />
                <label
                  htmlFor='floatingTextarea'
                  className='text-skyblue fw-bolder'>
                  Notice
                </label>
              </div>
              <button className='btn btn-dark d-block'>Upload</button>
            </div>
          </form>
        </>
      )}
      {noticeList.length !== 0 ? (
        <ListNotice noticeList={noticeList} />
      ) : (
        <div className='text-center mt-5'>
          <p className='styledFont2 text-revert'>No notice</p>
        </div>
      )}
    </div>
  );
};

export default Notice;
