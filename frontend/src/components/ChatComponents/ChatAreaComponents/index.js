import React from "react";
import Chats from "./Chats";
import Title from "./Title";
import MsgInput from "./InputComponents/MsgInput";

const ChatArea = (props) => (
  <main className='main is-visible'>
    <div className='container h-100'>
      <div className='d-flex flex-column h-100 position-relative'>
        <Title
          photo={props.photo}
          title={props.title}
          group={props.group}
          setGroup={props.setGroup}
        />
        <Chats chats={props.chats} />
        <MsgInput title={props.title} group={props.group} />
      </div>
    </div>
  </main>
);

export default ChatArea;
