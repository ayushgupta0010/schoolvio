import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { useSelector } from "react-redux";
import { downloadFile, uploadFile } from "../../../utils/fileManager";
import { WRITTEN_EXAMS_FOR_STUDENT_QUERY } from "../../../utils/query";
import { CREATE_WRITTEN_EXAM_ANSWER_MUTATION } from "../../../utils/mutation";
import client from "../../../utils/apollo";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

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
  let filesList = files.split(", ");
  for (let i = 0; i < filesList.length; i++) downloadFile(filesList[i]);
};

const LoadWrittenExamsForStudent = () => {
  const { school, classSection, username } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [writtenExams, setWrittenExams] = useState([]);
  const [msg, setMsg] = useState({ text: "", color: "" });

  const checkTimeUp = (currentTime, publishDate, duration) => {
    let timeA = new Date(currentTime);
    let timeB = new Date(publishDate);
    timeB.setMinutes(timeB.getMinutes() + duration);
    return timeA - timeB >= 0;
  };

  const checkPublished = (currentTime, publishDate) => {
    let timeA = new Date(currentTime);
    let timeB = new Date(publishDate);
    return timeA - timeB >= 0;
  };

  const getPublishTime = (publishDate, duration) => {
    const time = new Date(publishDate);
    time.setMinutes(time.getMinutes() + duration);
    return time;
  };

  const handleTimeUp = (id) => {
    setWrittenExams((exams) =>
      exams.map((x) => (x.id === id ? { ...x, isTimeUp: true } : x))
    );
  };

  const publish = (id) => {
    setWrittenExams((exams) =>
      exams.map((exam) =>
        exam.id === id ? { ...exam, isPublished: true } : exam
      )
    );
  };

  const handleUploadFiles = async (files, examName) => {
    let fileUrls = [];
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let url = await uploadFile(
        file,
        `${school}/exam_answers/${examName}/${classSection}/${username}/${file.name}`
      );
      fileUrls.push(url);
    }
    return fileUrls;
  };

  const handleSubmit = async (id, examName) => {
    setMsg({ text: "Uploading answers. Please wait...", color: "info" });
    let elem = document.getElementById("upload-files");
    let fileUrls = await handleUploadFiles(elem.files, examName);
    let files = fileUrls.join(", ");

    client
      .mutate({
        mutation: CREATE_WRITTEN_EXAM_ANSWER_MUTATION,
        variables: { id, files },
      })
      .then((res) => {
        if (res.data.created) {
          setMsg({ text: "Uploaded successfully", color: "success" });
          setWrittenExams((exams) =>
            exams.map((exam) =>
              exam.id === id ? { ...exam, uploadedAnswer: { files } } : exam
            )
          );
        } else setMsg({ text: "Already answered", color: "danger" });
      })
      .catch((err) => err);
  };

  useEffect(() => {
    client
      .query({ query: WRITTEN_EXAMS_FOR_STUDENT_QUERY })
      .then((res) => {
        setWrittenExams(
          res.data.exams.map((exam) => ({
            ...exam,
            isPublished: checkPublished(exam.currentTime, exam.publishDate),
            isTimeUp: checkTimeUp(
              exam.currentTime,
              exam.publishDate,
              exam.duration
            ),
          }))
        );
        setIsLoading(false);
      })
      .catch((err) => err);
  }, []);

  if (isLoading) return <LoadingComponent />;

  if (!isLoading && writtenExams.length === 0) {
    return (
      <div className='mt-5 text-center'>
        <span className='styledFont'>No exams found</span>
      </div>
    );
  }

  return (
    <div className='container my-3'>
      {msg.text && (
        <div className='d-flex justify-content-center my-3'>
          <div className={`alert alert-${msg.color}`} role='alert'>
            {msg.text}
          </div>
        </div>
      )}
      {writtenExams.map((exam, i) => (
        <div className='bg-dark my-4 p-3 rounded' key={i}>
          <div className='container'>
            <span className='badge bg-primary me-2 styledFont'>
              {exam.subject.replaceAll("_", " ")}
            </span>
            {!exam.isTimeUp &&
              exam.isPublished &&
              exam.uploadedAnswer === null && (
                <span className='styledFont float-end fs-6'>
                  Time left:{" "}
                  <Countdown
                    className='styledFont text-info'
                    date={
                      new Date(getPublishTime(exam.publishDate, exam.duration))
                    }
                    onComplete={() => handleTimeUp(exam.id)}
                  />
                </span>
              )}
            <div className='text-center'>
              <h3
                className='text-revert border-bottom border-secondary'
                style={{ fontFamily: "Poiret One" }}>
                {exam.exam.name}
              </h3>
            </div>
            <span className='text-revert styledFont mb-2'>
              Duration (in mins): {exam.duration}
            </span>
            <div className='d-md-flex justify-content-between align-items-center'>
              <span className='text-revert styledFont2'>
                {getDate(exam.publishDate)}
              </span>
              {!exam.isTimeUp &&
                exam.isPublished &&
                exam.uploadedAnswer === null && (
                  <div>
                    <button
                      className='btn btn-sm btn-outline-success me-3'
                      onClick={() => handleDownload(exam.files)}>
                      Download files <i className='bi bi-chevron-double-down' />
                    </button>
                    <button
                      className='btn btn-sm btn-outline-info'
                      onClick={() =>
                        document.getElementById("upload-files").click()
                      }>
                      Upload Files <i className='bi bi-chevron-double-up' />
                    </button>
                  </div>
                )}
              {!exam.isPublished && (
                <span className='styledFont'>
                  Starts in:
                  <Countdown
                    className='styledFont text-info ms-3'
                    date={new Date(exam.publishDate)}
                    onComplete={() => publish(exam.id)}
                  />
                </span>
              )}
            </div>
          </div>
          <input
            type='file'
            id='upload-files'
            multiple
            hidden
            onChange={() => handleSubmit(exam.id, exam.exam.name)}
          />
        </div>
      ))}
    </div>
  );
};

export default LoadWrittenExamsForStudent;
