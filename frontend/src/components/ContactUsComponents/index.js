import React, { useEffect, useState } from "react";
import { CREATE_REPORT_MUTATION } from "../../utils/mutation";
import client from "../../utils/apollo";
import QueryList from "../UtilityComponents/QueryList";

const ContactUs = () => {
  const [queryData, setQueryData] = useState({
    qType: "Feedback",
    query: "",
  });
  const [msg, setMsg] = useState({ text: "", color: "" });

  const handleChange = (e) =>
    setQueryData({
      ...queryData,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    client
      .mutate({
        mutation: CREATE_REPORT_MUTATION,
        variables: { ...queryData },
      })
      .then((res) =>
        setMsg({
          text: "Your query has been received. We will write to you soon.",
          color: "success",
        })
      )
      .catch((err) =>
        setMsg({ text: "Something went wrong", color: "danger" })
      );
  };

  useEffect(() => (document.title = "Contact Us"), []);

  return (
    <div className='container my-5'>
      <div className='d-flex justify-content-center mb-5'>
        {msg.text && (
          <div className={`alert alert-${msg.color}`} role='alert'>
            {msg.text}
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className='form-floating mb-3'>
          <select
            className='form-select bg-transparent text-revert border-secondary'
            id='floatingSelect'
            name='qType'
            value={queryData.qType}
            onChange={handleChange}
            required>
            <QueryList />
          </select>
          <label htmlFor='floatingSelect' className='text-skyblue fw-bolder'>
            Query Type
          </label>
        </div>
        <div className='form-floating mb-3'>
          <textarea
            className='form-control bg-transparent text-revert border-secondary'
            style={{ height: "275px" }}
            id='floatingTextarea'
            name='query'
            value={queryData.query}
            onChange={handleChange}
            required
          />
          <label htmlFor='floatingTextarea' className='text-skyblue fw-bolder'>
            Query
          </label>
        </div>
        <button className='btn btn-dark my-3 d-block'>Send</button>
      </form>
    </div>
  );
};

export default ContactUs;
