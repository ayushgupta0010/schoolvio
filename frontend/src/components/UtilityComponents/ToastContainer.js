import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toastNotification } from "../../redux/actions/actionStates";
import { WEBSITE_NAME } from "../../utils/websiteData";

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

const ToastContainer = () => {
  const { toastNotifs } = useSelector((state) => state.toasts);

  const dispatch = useDispatch();

  return (
    <div
      className='toast-container position-absolute bottom-0 end-0 p-3'
      style={{ zIndex: 5 }}>
      {toastNotifs.map((notif, index) => (
        <div
          key={index}
          className='toast'
          role='alert'
          aria-live='assertive'
          aria-atomic='true'>
          <div className='toast-header flex justify-content-between'>
            <strong className='me-5'>{WEBSITE_NAME}</strong>
            <small className='text-muted styledFont2'>
              {getDate(notif.timestamp)}
            </small>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='toast'
              aria-label='Close'
              onClick={() => dispatch(toastNotification(notif, "remove"))}
            />
          </div>
          <div className='toast-body'>
            <div className='flex justify-content-between'>
              <img
                className='rounded-circle me-3'
                style={{ width: "50px", height: "50px" }}
                src={notif.photo}
                alt='profile-pic'
              />
              <span>{notif.sender}</span>
            </div>
            <span>{notif.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
