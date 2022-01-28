import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addNotif,
  markNotifRead,
  setNotifsList,
  toastNotification,
} from "../../redux/actions/actionStates";

const getDate = (d) =>
  new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });

const Notifications = () => {
  const { websocket } = useSelector((state) => state.auth);
  const { notifsList } = useSelector((state) => state.notifs);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (path, id, index) => {
    if (!notifsList[index].isRead) {
      websocket.send(JSON.stringify({ type: "read_notif", id }));
      dispatch(markNotifRead(id));
    }
    navigate(path);
  };

  useEffect(() => {
    if (websocket === null) return;
    websocket.send(JSON.stringify({ type: "get_notifications" }));

    websocket.onmessage = (e) => {
      let data = JSON.parse(e.data);
      if (data.type === "get_notifications")
        dispatch(setNotifsList(data.notifs));
      else if (data.type === "new_notif") {
        dispatch(addNotif(data));
        dispatch(toastNotification(data, "add"));
      } else if (data.type === "new_chat") {
        if (window.location.pathname !== "/chats") {
          let notif = {
            photo: data.chat.photo,
            message:
              data.chat.msgType === "text"
                ? data.chat.message
                : data.chat.msgType,
            timestamp: data.chat.timestamp,
          };
          dispatch(toastNotification(notif, "add"));
        }
      }
    };
  }, [dispatch, websocket]);

  const Unread = () => {
    let unread = 0;
    notifsList.forEach((x) => x.isRead === false && unread++);
    return unread !== 0 ? (
      <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger mt-3'>
        {unread}
      </span>
    ) : null;
  };

  const LoadNotifications = () =>
    notifsList.map((x, index) => (
      <button
        key={index}
        onClick={() => handleClick(x.notifUrl, x.id, index)}
        className={`btn bgBlueOnHover d-flex p-${x.isRead ? 4 : 0} mb-5`}>
        {x.isRead === false && <i className='bi bi-dot text-primary mt-4' />}
        <img
          className='rounded-circle'
          style={{ width: "50px", height: "50px" }}
          src={x.photo}
          alt='profile-pic'
        />
        <p className='styledFont2 text-revert ms-5 mb-0'>
          {x.message}
          <small className='text-muted d-block'>{getDate(x.timestamp)}</small>
        </p>
      </button>
    ));

  return (
    <div className='btn-group'>
      <button
        className='bg-transparent border-0 nav-link p-0 pe-1'
        data-bs-toggle='dropdown'
        data-bs-auto-close='true'
        aria-expanded='false'
        style={{ outline: "none" }}>
        <i className='bi bi-bell-fill' style={{ fontSize: "25px" }} />
        <Unread />
      </button>
      <ul
        className='dropdown-menu dropdown-menu-end bg-black m-0'
        style={{
          width: "250px",
          height: "300px",
          overflow: "auto",
        }}>
        {notifsList.length !== 0 ? (
          <LoadNotifications />
        ) : (
          <p className='styledFont2 text-center mt-12 pt-12'>
            No notifications
          </p>
        )}
      </ul>
    </div>
  );
};

export default Notifications;
