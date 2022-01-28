import React from "react";

const getDate = (d) =>
  new Date(d).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });

const ListNotice = ({ noticeList }) =>
  noticeList.map((x, i) => (
    <div className='bg-black my-4 p-3 rounded' key={i}>
      <div className='container'>
        <p className='text-justify mt-2'>{x.notice}</p>
        <span className='text-revert styledFont2'>{getDate(x.timestamp)}</span>
      </div>
    </div>
  ));

export default ListNotice;
