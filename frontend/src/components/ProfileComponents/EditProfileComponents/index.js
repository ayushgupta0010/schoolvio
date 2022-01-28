import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { EDIT_PROFILE_QUERY } from "../../../utils/query";
import {
  UPDATE_SCHOOL_MUTATION,
  UPDATE_STUDENT_MUTATION,
  UPDATE_TEACHER_MUTATION,
} from "../../../utils/mutation";
import client from "../../../utils/apollo";
import EditStudent from "./EditStudent";
import EditTeacher from "./EditTeacher";
import EditSchool from "./EditSchool";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const EditProfile = () => {
  const { username, photo, role } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({
    goal: "",
    qualification: "",
    name: "",
    principal: "",
    contact: "",
    about: "",
  });
  const [msg, setMsg] = useState({ text: "", color: "" });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === "STUDENT") {
      client
        .mutate({
          mutation: UPDATE_STUDENT_MUTATION,
          variables: {
            goal: profile.goal,
            about: profile.about,
            username,
            photo,
          },
        })
        .then((res) => {
          if (!res.data.updateStudent.success) return;
          setMsg({ text: "Updated", color: "success" });
          setTimeout(() => setMsg({ text: "", color: "" }), 2000);
        })
        .catch((err) =>
          setMsg({ text: "Something went wrong", color: "danger" })
        );
    } else if (role === "TEACHER") {
      client
        .mutate({
          mutation: UPDATE_TEACHER_MUTATION,
          variables: {
            qualification: profile.qualification,
            about: profile.about,
            username,
            photo,
          },
        })
        .then((res) => {
          if (!res.data.updateTeacher.success) return;
          setMsg({ text: "Updated", color: "success" });
          setTimeout(() => setMsg({ text: "", color: "" }), 2000);
        })
        .catch((err) =>
          setMsg({ text: "Something went wrong", color: "danger" })
        );
    } else {
      client
        .mutate({
          mutation: UPDATE_SCHOOL_MUTATION,
          variables: {
            name: profile.name,
            contact: profile.contact,
            principal: profile.principal,
          },
        })
        .then((res) => {
          if (!res.data.updateSchool.success) return;
          setMsg({ text: "Updated", color: "success" });
          setTimeout(() => setMsg({ text: "", color: "" }), 2000);
        })
        .catch((err) =>
          setMsg({ text: "Something went wrong", color: "danger" })
        );
    }
  };

  useEffect(() => {
    document.title = "Edit Profile";
    if (role === null) return;
    client
      .query({ query: EDIT_PROFILE_QUERY })
      .then((res) => {
        let data;
        if (role === "STUDENT") data = res.data.editProfile.student;
        else if (role === "TEACHER") data = res.data.editProfile.teacher;
        else data = res.data.editProfile.school;
        setProfile({ ...data });
        setIsLoading(false);
      })
      .catch((err) => err);
  }, [navigate, role]);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className='container my-5'>
      <div className='d-flex justify-content-center'>
        {msg.text && (
          <div className={`alert alert-${msg.color}`} role='alert'>
            {msg.text}
          </div>
        )}
      </div>
      <div className='container'>
        <form onSubmit={handleSubmit}>
          {role === "STUDENT" && <EditStudent data={{ profile, setProfile }} />}

          {role === "TEACHER" && <EditTeacher data={{ profile, setProfile }} />}

          {role === "SCHOOL" && <EditSchool data={{ profile, setProfile }} />}

          {role && role !== "SCHOOL" && (
            <div className='form-floating mb-3'>
              <textarea
                className='form-control bg-transparent text-revert border-secondary'
                style={{ height: "200px" }}
                id='floatingTextarea'
                value={profile.about}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    about: e.target.value,
                  })
                }
                required
              />
              <label
                htmlFor='floatingTextarea'
                className='text-skyblue fw-bolder'>
                About
              </label>
            </div>
          )}
          <button className='btn btn-outline-success'>Save</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
