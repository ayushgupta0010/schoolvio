import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { USER_DETAIL_FOR_SCHOOL_QUERY } from "../../../utils/query";
import client from "../../../utils/apollo";
import LoadStudent from "./LoadStudent";
import LoadTeacher from "./LoadTeacher";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const EditUser = () => {
  const { school, role } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [defaultUser, setDefaultUser] = useState({});
  const [user, setUser] = useState({});

  const navigate = useNavigate();

  const { username } = useParams();

  const handleChange = (e) => {
    if (
      (e.target.name === "name" ||
        e.target.name === "fatherName" ||
        e.target.name === "motherName" ||
        e.target.name === "principal") &&
      e.target.value.length > 50
    ) {
      alert("Only 50 characters allowed");
      return;
    } else if (e.target.name === "contact" && e.target.value.length > 10) {
      alert("Only 10 digits allowed");
      return;
    } else if (e.target.name === "busNo" && e.target.value.length > 2) {
      alert("Only 2 characters allowed");
      return;
    }

    setUser((original) => ({
      ...original,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUserUpdated = () => setDefaultUser(user);

  const handleCancel = () => setUser(defaultUser);

  useEffect(() => {
    if (role === null) return;
    else if (role !== "SCHOOL") return navigate("/access_denied");

    document.title = "Edit Student / Teacher";
    client
      .query({
        query: USER_DETAIL_FOR_SCHOOL_QUERY,
        variables: { username },
      })
      .then((res) => {
        if (school !== res.data.profile.school.user.username)
          return navigate("/access_denied");

        setDefaultUser(res.data.profile);
        setUser(res.data.profile);
        setIsLoading(false);
      })
      .catch((err) => err);
  }, [navigate, role, school, username]);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className='container my-3'>
      {user.__typename === "StudentType" && (
        <LoadStudent
          student={user}
          setUser={setUser}
          handleCancel={handleCancel}
          handleChange={handleChange}
          handleUserUpdated={handleUserUpdated}
        />
      )}
      {user.__typename === "TeacherType" && (
        <LoadTeacher
          teacher={user}
          setUser={setUser}
          handleCancel={handleCancel}
          handleChange={handleChange}
          handleUserUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
};

export default EditUser;
