import React, { useState } from "react";
import { useSelector } from "react-redux";
import { uploadFile } from "../../../../utils/fileManager";
import FileModal from "./FileModal";

const getFilesSuffix = (length) =>
  length === 1 ? "1 file" : `${length} files`;

const checkFileSize = (files) => {
  let size = 0;
  for (let i = 0; i < files.length; i++) {
    size += files[i].size;
  }
  return size;
};

const MsgInput = ({ group, title }) => {
  const { username, websocket, role } = useSelector((state) => state.auth);

  const [message, setMessage] = useState("");
  const [uploadingMessage, setUploadingMessage] = useState({
    text: "",
    color: "",
  });

  const handleModal = () => {
    const elem = document.getElementsByClassName("modal-backdrop");
    for (var i = 0; i < elem.length; i++) {
      elem[i].classList.remove("modal-backdrop");
    }
  };

  const handleFileInput = async (e) => {
    let files = e.target.files;
    setUploadingMessage({
      text: `Uploading ${getFilesSuffix(files.length)}. Please wait...`,
      color: "info",
    });
    let data = {
      type: "new_chat",
      sender: username,
      group,
      message: "",
      msg_type: e.target.name,
      files: [],
    };
    let size = checkFileSize(files);
    if (size < 20971520) {
      for (let i = 0; i < files.length; i++) {
        let name = files[i].name;
        let url = await uploadFile(
          files[i],
          `${username}/chats/${group}/${name}`
        );
        data.files = [...data.files, { name, url }];
      }
      data.files = JSON.stringify(data.files);
      websocket.send(JSON.stringify(data));
      setUploadingMessage({
        text: `${getFilesSuffix(files.length)} uploaded successfully`,
        color: "success",
      });
    } else alert("File input size should be < 20MB");
    document.getElementById(`${e.target.name}-input`).value = "";
    setTimeout(() => setUploadingMessage({ text: "", color: "" }), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message === "") return;
    let data = {
      type: "new_chat",
      sender: username,
      group,
      message: message.trim(),
      msg_type: "text",
      files: [],
    };
    websocket.send(JSON.stringify(data));
    setMessage("");
  };

  if (role === "STUDENT" && title.startsWith("Class")) return <></>;

  return (
    <div className='chat-footer pb-3 pb-lg-7 position-absolute bottom-0 start-0'>
      {uploadingMessage.text && (
        <div className={`alert alert-${uploadingMessage.color}`} role='alert'>
          {uploadingMessage.text}
        </div>
      )}
      <form className='chat-form rounded-pill bg-dark' onSubmit={handleSubmit}>
        <div className='row align-items-center gx-0'>
          <div className='col-auto'>
            <button
              type='button'
              data-bs-toggle='modal'
              data-bs-target='#modal-profile'
              className='btn btn-icon btn-link text-body rounded-circle'
              onClick={handleModal}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='feather feather-paperclip'>
                <path d='M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48' />
              </svg>
            </button>
          </div>
          <div className='col'>
            <div className='input-group'>
              <textarea
                className='form-control px-5'
                placeholder='Type your message...'
                rows='1'
                data-autosize='true'
                style={{
                  overflow: "hidden",
                  overflowWrap: "break-word",
                  resize: "none",
                  height: "46px",
                }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

          <div className='col-auto'>
            <button
              className='btn btn-icon btn-primary rounded-circle ms-5'
              type='submit'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='feather feather-send'>
                <line x1='22' y1='2' x2='11' y2='13' />
                <polygon points='22 2 15 22 11 13 2 9 22 2' />
              </svg>
            </button>
          </div>
        </div>
      </form>

      <FileModal />
      <input
        type='file'
        accept='audio/*'
        id='audio-input'
        name='audio'
        multiple
        hidden
        onChange={handleFileInput}
      />
      <input
        type='file'
        accept='all'
        id='document-input'
        name='document'
        multiple
        hidden
        onChange={handleFileInput}
      />
      <input
        type='file'
        accept='image/*'
        id='image-input'
        name='image'
        multiple
        hidden
        onChange={handleFileInput}
      />
      <input
        type='file'
        accept='video/*'
        id='video-input'
        name='video'
        multiple
        hidden
        onChange={handleFileInput}
      />
    </div>
  );
};

export default MsgInput;
