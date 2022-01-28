import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { REST_URL } from "../../utils/urls";
import axios from "axios";
import LoadingComponent from "../UtilityComponents/LoadingComponent";

const People = () => {
  const { username } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [peopleList, setPeopleList] = useState([]);

  useEffect(() => {
    if (username === null) return;
    let url = `${REST_URL.PEOPLE}${username}`;
    axios
      .get(url)
      .then((res) => {
        setPeopleList(res.data);
        setIsLoading(false);
      })
      .catch((err) => err);
  }, [username]);

  if (isLoading) return <LoadingComponent />;

  if (!isLoading && peopleList.length === 0) {
    return (
      <div
        className='d-flex align-items-center justify-content-center'
        style={{ height: "80vh" }}>
        <p className='fs-5 styledFont2'>Can't find anyone you might know :(</p>
      </div>
    );
  }

  return (
    <ul className='list-group'>
      {peopleList.map((people, i) => (
        <li
          className='list-group-item list-group-item-action bg-dark border-0 px-0'
          key={i}>
          <img
            className='rounded-circle'
            style={{ width: "50px", height: "50px" }}
            src={people.photo}
            alt='profile-pic'
          />
          <Link to={`/profile/${people.username}`} className='ms-5 styledFont2'>
            {people.username}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default People;
