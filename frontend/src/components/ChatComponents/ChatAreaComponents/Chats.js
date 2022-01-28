import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Audio from "./FileComponents/Audio";
import Document from "./FileComponents/Document";
import Image from "./FileComponents/Image";
import Video from "./FileComponents/Video";

const getTimestamp = (d) =>
  new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });

const linkifyMessage = (text) => {
  const urlRegex =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\\/%?=~_|!:,.;]*[-A-Z0-9+&@#\\/%=~_|])/gi;
  return text.replace(
    urlRegex,
    (url) => `<a href="${url}" target="_blank">${url}</a>`
  );
};

const AlwaysScrollToBottom = () => {
  const elementRef = useRef();
  useEffect(() => elementRef.current.scrollIntoView());
  return <div ref={elementRef} />;
};

const LoadChats = ({ chats, username }) =>
  chats.map((msg, i) => {
    let classList = msg.sender === username ? "message message-out" : "message";
    return (
      <div className={classList} key={i}>
        <Link
          to={`/profile/${msg.sender}`}
          className='avatar avatar-responsive'>
          <img
            src={msg.photo}
            className='avatar-img'
            style={{ width: "50px", height: "50px" }}
            alt='user'
          />
        </Link>
        <div className='message-inner'>
          <div className='message-body'>
            <div className='message-content'>
              {msg.msgType.toLowerCase() === "text" && (
                <div className='message-text'>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: linkifyMessage(msg.message),
                    }}
                  />
                </div>
              )}
              {msg.msgType.toLowerCase() === "audio" && (
                <Audio files={JSON.parse(msg.files)} />
              )}
              {msg.msgType.toLowerCase() === "document" && (
                <Document files={JSON.parse(msg.files)} />
              )}
              {msg.msgType.toLowerCase() === "image" && (
                <Image files={JSON.parse(msg.files)} />
              )}
              {msg.msgType.toLowerCase() === "video" && (
                <Video files={JSON.parse(msg.files)} />
              )}
            </div>
            <div className='message-footer'>
              <span className='extra-small text-muted'>
                {getTimestamp(msg.timestamp)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  });

const Chats = ({ chats }) => {
  const { username } = useSelector((state) => state.auth);

  return (
    <div className='chat-body hide-scrollbar flex-1 h-100'>
      <div className='chat-body-inner' style={{ paddingBottom: "87px" }}>
        <div className='py-5'>
          <LoadChats chats={chats} username={username} />
        </div>
      </div>
      <AlwaysScrollToBottom />
    </div>
  );
};

export default Chats;
