import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GROUP_CONTACTS_QUERY } from "../../../utils/query";
import client from "../../../utils/apollo";

const fixTitleForID = (title) => title.replace(" ", "").replace("-", "_");

const badgeColor = {
  SCHOOL: "success",
  TEACHER: "danger",
  STUDENT: "primary",
};

const Title = ({ photo, title, group, setGroup }) => {
  const [groupContactsList, setGroupContactsList] = useState([]);

  const getGroupContacts = (group) => {
    client
      .query({ query: GROUP_CONTACTS_QUERY, variables: { group } })
      .then((res) => setGroupContactsList(res.data.contacts))
      .catch((err) => err);
  };

  const TitleBehavior = () => {
    if (!(title.startsWith("Class") && title.includes("-")))
      return <Link to={`/profile/${title}`}>{title}</Link>;

    return (
      <Link
        to='#'
        data-bs-toggle='offcanvas'
        data-bs-target={`#${fixTitleForID(title)}`}
        aria-controls={`${fixTitleForID(title)}`}
        onClick={() => getGroupContacts(group)}>
        {title}
      </Link>
    );
  };

  return (
    <>
      <div className='chat-header border-bottom mt-12 mt-xl-0 py-7 position-sticky'>
        <div className='row align-items-center'>
          <div className='col-1 d-xl-none'>
            <Link
              to='#'
              className='icon icon-lg text-muted'
              data-toggle-chat=''
              onClick={() => setGroup("")}>
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
                className='feather feather-chevron-left'>
                <polyline points='15 18 9 12 15 6' />
              </svg>
            </Link>
          </div>
          <div className='col-8 col-xl-12'>
            <div className='row align-items-center'>
              <div className='px-0'>
                <div className='row align-items-center gx-5'>
                  <div className='col-auto'>
                    <div className='avatar d-inline-block'>
                      <img
                        src={photo}
                        className='avatar-img'
                        style={{ width: "50px", height: "50px" }}
                        alt='user'
                      />
                    </div>
                  </div>
                  <div className='col overflow-hidden'>
                    <TitleBehavior />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className='offcanvas offcanvas-end bg-dark'
        data-bs-scroll='true'
        data-bs-backdrop='true'
        tabIndex='-1'
        id={`${fixTitleForID(title)}`}
        aria-labelledby={`${fixTitleForID(title)}Label`}>
        <div className='offcanvas-header text-revert'>
          <h5 id={`${fixTitleForID(title)}Label`}>{title}</h5>
          <button
            type='button'
            className='btn-close text-reset bg-light'
            data-bs-dismiss='offcanvas'
            aria-label='Close'
          />
        </div>
        <div className='offcanvas-body py-0'>
          {groupContactsList.map((contact, i) => (
            <li
              className='list-group-item list-group-item-action bg-dark border-0 px-0'
              key={i}>
              <img
                className='rounded-circle'
                style={{ width: "50px", height: "50px" }}
                src={contact.user.photo}
                alt='profile-pic'
              />
              <Link
                to={`/profile/${contact.user.username}`}
                className='ms-5 styledFont2'>
                {contact.user.username}
                {contact.user.isOnline && (
                  <i
                    className='bi bi-circle-fill text-success ms-3'
                    style={{ fontSize: "8px" }}
                  />
                )}
              </Link>

              <span
                className={`badge float-end styledFont bg-${
                  badgeColor[contact.user.role]
                }`}>
                {contact.user.role}
              </span>
            </li>
          ))}
        </div>
      </div>
    </>
  );
};

export default Title;
