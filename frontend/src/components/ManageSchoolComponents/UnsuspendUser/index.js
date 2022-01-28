import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { SUSPENDED_USERS_QUERY } from "../../../utils/query";
import { UPDATE_USER_DETAIL_MUTATION } from "../../../utils/mutation";
import client from "../../../utils/apollo";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const UnsuspendUser = () => {
  const { role } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [suspendList, setSuspendList] = useState([]);

  const navigate = useNavigate();

  const handleUnsuspension = (username) => {
    client
      .mutate({
        mutation: UPDATE_USER_DETAIL_MUTATION,
        variables: { username, isSuspended: false, reason: "" },
      })
      .then(
        (res) =>
          res.data.updateUserDetail.success &&
          setSuspendList(
            suspendList.filter((x) => x.user.username !== username)
          )
      )
      .catch((err) => err);
  };

  const LoadResults = () => (
    <div className='list-group mt-3'>
      {suspendList.map((x, i) => (
        <div className='list-group-item mb-1 bg-dark' key={i}>
          <img
            className='rounded-circle me-3 float-start'
            style={{ width: "50px", height: "50px" }}
            src={x.user.photo}
            alt='profile-pic'
          />
          <div className='container'>
            <div className='d-flex flex-column float-start'>
              <Link
                to={`/profile/${x.user.username}`}
                className='styledFont2 text-revert'>
                {x.user.username}
              </Link>
              <span className='styledFont2 text-info font-italic'>
                {x.name}
              </span>
            </div>
            {x.__typename === "StudentType" && (
              <>
                <span className='badge bg-danger ms-0 ms-md-5'>
                  Class {x.classSection.replace("C_", "").replace("_", "-")}
                </span>
                <span
                  className='badge bg-info ms-2'
                  style={{ letterSpacing: "1px" }}>
                  Admission No: {x.admNo}
                </span>
              </>
            )}
            <span className='text-revert ms-5 ps-5'>{x.user.reason}</span>
            <button
              className='btn btn-outline-danger float-end'
              onClick={() => handleUnsuspension(x.user.username)}>
              <i className='bi bi-unlock-fill fs-5' />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    if (role === null) return;
    else if (role !== "SCHOOL") return navigate("/access_denied");
    client
      .query({ query: SUSPENDED_USERS_QUERY })
      .then((res) => {
        res.data.suspendedUsers && setSuspendList(res.data.suspendedUsers);
        setIsLoading(false);
      })
      .catch((err) => err);
  }, [navigate, role]);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className='container my-3'>
      {suspendList.length !== 0 ? (
        <LoadResults />
      ) : (
        <div className='text-center mt-12'>
          <p className='styledFont text-revert'>No suspended users</p>
        </div>
      )}
    </div>
  );
};

export default UnsuspendUser;
