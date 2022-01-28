import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNotif,
  setNotifsList,
  toastNotification,
} from "../../redux/actions/actionStates";
import Contact from "./ContactComponents";
import ChatArea from "./ChatAreaComponents";

const Chat = () => {
  const { websocket } = useSelector((state) => state.auth);

  const [chats, setChats] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [group, setGroup] = useState("");
  const [photo, setPhoto] = useState("");
  const [title, setTitle] = useState("");

  const dispatch = useDispatch();

  useEffect(() => (document.title = "Chats"), []);

  useEffect(() => {
    if (websocket === null) return;
    websocket.send(JSON.stringify({ type: "get_contacts" }));
  }, [websocket]);

  useEffect(() => {
    if (websocket === null) return;
    group && websocket.send(JSON.stringify({ type: "get_chats", group }));
  }, [group, websocket]);

  useEffect(() => {
    if (websocket === null) return;
    group && websocket.send(JSON.stringify({ type: "get_chats", group }));

    websocket.onmessage = (e) => {
      let data = JSON.parse(e.data);
      if (data.type === "get_notifications") {
        dispatch(setNotifsList(data.notifs));
      } else if (data.type === "new_notif") {
        dispatch(addNotif(data));
        dispatch(toastNotification(data, "add"));
      } else if (data.type === "get_contacts") {
        setContactList(data.contacts);
      } else if (data.type === "new_contact") {
        setContactList((original) => [data, ...original]);
      } else if (data.type === "get_chats") {
        setChats(data.chats);
      } else if (data.type === "user_live_status") {
        setContactList((contacts) =>
          contacts.map((contact) =>
            contact.display_name === data.username
              ? { ...contact, isOnline: data.isOnline }
              : contact
          )
        );
      } else if (data.type === "new_chat") {
        if (data.chat.group === group) {
          setChats((original) => [...original, data.chat]);
        } else {
          let notif = {
            sender: data.chat.sender,
            photo: data.chat.photo,
            message:
              data.chat.msgType === "text"
                ? data.chat.message
                : data.chat.msgType,
            timestamp: data.chat.timestamp,
          };
          dispatch(toastNotification(notif, "add"));
        }
        setContactList((contacts) =>
          contacts.map((contact) =>
            contact.group === data.chat.group
              ? { ...contact, last: data.chat }
              : contact
          )
        );
      }
    };
  }, [dispatch, group, websocket]);

  return (
    <div className='layout overflow-hidden'>
      <Contact
        contactList={contactList}
        setGroup={setGroup}
        setPhoto={setPhoto}
        setTitle={setTitle}
      />
      {group && (
        <ChatArea
          chats={chats}
          group={group}
          photo={photo}
          title={title}
          setChats={setChats}
          setGroup={setGroup}
          setContactList={setContactList}
        />
      )}
    </div>
  );
};

export default Chat;
