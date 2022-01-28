import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { REST_URL } from "../../../utils/urls";
import axios from "axios";
import Modal from "./Modal";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const LoadResults = ({ searchResult, setUsernameRole }) => (
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
            data-bs-target='#removeModal'
            onClick={() => setUsernameRole(x.username, x.role)}>
            <i className='bi bi-person-x-fill fs-5' />
          </button>
        </div>
      </div>
    ))}
  </div>
);

const RemoveUser = () => {
  const { username: school, role: loggedInUserRole } = useSelector(
    (state) => state.auth
  );

  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [found, setFound] = useState();

  const navigate = useNavigate();

  const setUsernameRole = (selectedUsername, selectedRole) => {
    setUsername(selectedUsername);
    setRole(selectedRole);
  };

  const cleanForm = () => {
    setSearch("");
    setSearchResult([]);
    setUsername("");
    setRole("");
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
    if (loggedInUserRole === null) return;
    else if (loggedInUserRole !== "SCHOOL") return navigate("/access_denied");
    else document.title = "Remove Student / Teacher";
  }, [navigate, loggedInUserRole]);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className='container my-3'>
      <Modal username={username} role={role} cleanForm={cleanForm} />
      <div className='text-center'>
        <form onSubmit={handleSearch}>
          <input
            className='bg-black border border-secondary rounded text-white p-2 w-50'
            type='search'
            placeholder='Search by name or username or admission no'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            required
          />
        </form>
      </div>
      <LoadResults
        searchResult={searchResult}
        setUsernameRole={setUsernameRole}
      />
      {found === false && (
        <div className='text-center mt-3'>
          <p className='styledFont2 text-revert'>No student or teacher found</p>
        </div>
      )}
    </div>
  );
};

export default RemoveUser;
