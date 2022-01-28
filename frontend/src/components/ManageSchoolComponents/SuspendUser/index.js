import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { REST_URL } from "../../../utils/urls";
import axios from "axios";
import Modal from "./Modal";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const LoadResults = ({ searchResult, setUsername }) => (
  <div className='list-group mt-3'>
    {searchResult.map((x, i) => (
      <div className='list-group-item mb-1 bg-dark' key={i}>
        <img
          className='rounded-circle me-3 float-start'
          style={{ width: "50px", height: "50px" }}
          src={x.photo}
          alt='profile-pic'
        />
        <div className='container'>
          <div className='d-flex flex-column float-start'>
            <Link
              to={`/profile/${x.username}`}
              className='styledFont2 text-revert'>
              {x.username}
            </Link>
            <span className='styledFont2 text-info font-italic'>{x.name}</span>
          </div>
          {x.role === "STUDENT" && (
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
          <button
            className='btn btn-outline-danger float-end'
            data-bs-toggle='modal'
            data-bs-target='#suspendModal'
            onClick={() => setUsername(x.username)}>
            <i className='bi bi-lock-fill fs-5' />
          </button>
        </div>
      </div>
    ))}
  </div>
);

const SuspendUser = () => {
  const { username: school, role } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [username, setUsername] = useState("");
  const [reason, setReason] = useState("");
  const [found, setFound] = useState();

  const navigate = useNavigate();

  const cleanForm = () => {
    setSearch("");
    setSearchResult([]);
    setUsername("");
    setReason("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    let url = `${REST_URL.SEARCH_IN_SPECIFIC_SCHOOL}${school}/${search}`;
    axios
      .get(url)
      .then((res) => {
        if (res.data.length === 0) setFound(false);
        else {
          setSearchResult(res.data);
          setFound(true);
        }
        setIsLoading(false);
      })
      .catch((err) => setFound(false));
  };

  useEffect(() => {
    if (role === null) return;
    else if (role !== "SCHOOL") return navigate("/access_denied");
    else document.title = "Suspend Student / Teacher";
  }, [navigate, role]);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className='container my-3'>
      <Modal data={{ username, reason, setReason, cleanForm }} />
      <div className='text-center'>
        <form onSubmit={handleSearch}>
          <input
            className='bg-black border border-secondary rounded text-white p-2 w-50'
            name='search'
            type='search'
            placeholder='Search by name or username or admission no'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            required
          />
        </form>
      </div>
      {found === false ? (
        <div className='text-center mt-3'>
          <p className='styledFont2 text-revert'>No student or teacher found</p>
        </div>
      ) : (
        <LoadResults searchResult={searchResult} setUsername={setUsername} />
      )}
    </div>
  );
};

export default SuspendUser;
