import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SCHOOL_UNVERIFIED_USERS_QUERY } from "../../../utils/query";
import client from "../../../utils/apollo";
import Details from "./Details";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const AddUser = () => {
  const { role } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState("");
  const [unverifiedUserList, setUnverifiedUserList] = useState([]);

  const navigate = useNavigate();

  const cleanForm = () =>
    setUnverifiedUserList(
      unverifiedUserList.filter((user) => user !== selectedUser)
    );

  const LoadUnverifiedUsersList = () =>
    unverifiedUserList.map((x, i) => (
      <option className='bg-dark' value={x} key={i}>
        {x}
      </option>
    ));

  useEffect(() => {
    if (role === null) return;
    else if (role !== "SCHOOL") return navigate("/access_denied");
    document.title = "Add Student / Teacher";
    client
      .query({ query: SCHOOL_UNVERIFIED_USERS_QUERY })
      .then((response) => {
        setUnverifiedUserList(response.data.schoolUnverifiedUsers);
        setIsLoading(false);
      })
      .catch((error) => error);
  }, [navigate, role]);

  useEffect(() => {
    unverifiedUserList.length !== 0
      ? setSelectedUser(unverifiedUserList[0])
      : setSelectedUser("");
  }, [unverifiedUserList]);

  if (isLoading) return <LoadingComponent />;

  if (!isLoading && unverifiedUserList.length === 0) {
    return (
      <div className='text-center mt-5'>
        <p className='styledFont2 text-revert'>No unverified users</p>
      </div>
    );
  }

  return (
    <div className='container my-3'>
      <div className='form-floating mb-3'>
        <select
          className='form-select bg-transparent text-revert border-secondary'
          id='floatingSelect'
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          required>
          <LoadUnverifiedUsersList />
        </select>
        <label htmlFor='floatingSelect' className='text-skyblue fw-bolder'>
          Select a user
        </label>
      </div>
      {selectedUser !== "" ? (
        <Details selectedUser={selectedUser} cleanForm={cleanForm} />
      ) : (
        <div className='text-center'>
          <p className='h4'>No user selected</p>
        </div>
      )}
    </div>
  );
};

export default AddUser;
