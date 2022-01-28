import React from "react";
import client from "../../utils/apollo";
import { downloadFile } from "../../utils/fileManager";
import { DELETE_HW_MUTATION } from "../../utils/mutation";

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

const handleDownload = (files) => {
  const filesList = files
    .replaceAll('"', "")
    .replace("'", "")
    .replace("[", "")
    .replace("]", "")
    .split(",");
  for (var i = 0; i < filesList.length; i++) {
    downloadFile(filesList[i]);
  }
};

const getClassSection = (c) => c.replace("C_", "").replace("_", "-");

const linkifyMessage = (text) => {
  const urlRegex =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\\/%?=~_|!:,.;]*[-A-Z0-9+&@#\\/%=~_|])/gi;
  return text.replace(
    urlRegex,
    (url) => `<a href="${url}" class="text-skyblue" target="_blank">${url}</a>`
  );
};

const ListHw = ({ hwList, setHwList, role }) => {
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    client
      .mutate({ mutation: DELETE_HW_MUTATION, variables: { id } })
      .then(
        (res) =>
          res.data.deleteHw.success &&
          setHwList((hws) => hws.filter((hw) => hw.id !== id))
      )
      .catch((err) => err);
  };

  return hwList.map((x, i) => (
    <div className='bg-dark my-4 p-3 rounded' key={i}>
      <div className='container'>
        <span className='badge bg-primary me-2 styledFont'>
          {x.subject.replaceAll("_", " ")}
        </span>
        {role === "TEACHER" && (
          <>
            <span className='badge bg-secondary'>
              Class {getClassSection(x.classSection)}
            </span>
            <button
              className='btn btn-sm btn-outline-danger float-end'
              onClick={() => handleDelete(x.id)}>
              <i className='bi bi-trash-fill' />
            </button>
          </>
        )}
        <div className='text-center'>
          <h3
            className='text-revert border-bottom border-secondary'
            style={{ fontFamily: "Poiret One" }}>
            {x.title}
          </h3>
        </div>
        <p
          className='text-justify'
          dangerouslySetInnerHTML={{
            __html: linkifyMessage(x.homework),
          }}
        />
        <div className='d-md-flex justify-content-between'>
          <span className='text-revert styledFont2'>
            {getDate(x.timestamp)}
          </span>
          {x.files && (
            <button
              className='btn btn-outline-success'
              onClick={() => handleDownload(x.files)}>
              Download files <i className='bi bi-chevron-double-down' />
            </button>
          )}
        </div>
      </div>
    </div>
  ));
};

export default ListHw;
