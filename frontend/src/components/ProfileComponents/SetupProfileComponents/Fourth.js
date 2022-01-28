import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { uploadFile } from "../../../utils/fileManager";
import { GET_ACTIONS } from "../../../redux/actions";
import {
  CREATE_STUDENT_MUTATION,
  CREATE_TEACHER_MUTATION,
  CREATE_SCHOOL_MUTATION,
} from "../../../utils/mutation";
import client from "../../../utils/apollo";
import BoardList from "../../UtilityComponents/BoardList";
import ClassList from "../../UtilityComponents/ClassList";
import SectionList from "../../UtilityComponents/SectionList";

const Fourth = ({ data }) => {
  const [classNo, setClassNo] = useState("");
  const [section, setSection] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [msg, setMsg] = useState({ text: "", color: "" });

  const handleChange = (e) =>
    data.setAccount({
      ...data.account,
      [e.target.name]: e.target.value,
    });

  const handleProfilePicChange = (e) => {
    if (e.target.files.length !== 0) {
      setProfilePic(URL.createObjectURL(e.target.files[0]));
      setProfilePicFile(e.target.files[0]);
    }
  };

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: "Creating account. Please wait...", color: "info" });

    let extension = profilePicFile.name.substring(
      profilePicFile.name.lastIndexOf(".") + 1
    );

    let photo = await uploadFile(
      profilePicFile,
      `${data.username}/${data.username}_profilePhoto.${extension}`
    );

    let mutation = CREATE_STUDENT_MUTATION;
    if (data.accountType === "teacher") mutation = CREATE_TEACHER_MUTATION;
    else if (data.accountType === "school") mutation = CREATE_SCHOOL_MUTATION;

    let variables = {
      ...data.account,
      photo,
      classSection: `C_${classNo}_${section}`,
    };

    client
      .mutate({ mutation, variables })
      .then((res) => {
        let success;
        if (data.accountType === "student")
          success = res.data.createStudent.success;
        else if (data.accountType === "teacher")
          success = res.data.createTeacher.success;
        else success = res.data.createSchool.success;

        if (success) {
          dispatch(GET_ACTIONS.USER_DETAIL());
          return;
        }
        setMsg({ text: "School ID is incorrect", color: "danger" });
      })
      .catch((err) => err);
  };

  return (
    <div className='d-flex justify-content-center my-5'>
      <div className='box py-4'>
        {msg.text && (
          <div className={`alert alert-${msg.color}`} role='alert'>
            {msg.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {profilePic ? (
            <label
              name='pic'
              htmlFor='profilePic'
              id='profilePic_default'
              style={{
                backgroundImage: `url(${profilePic})`,
              }}
            />
          ) : (
            <label htmlFor='profilePic' name='pic' id='profilePic_default' />
          )}
          <input
            className='d-none'
            id='profilePic'
            type='file'
            accept='image/*'
            onChange={handleProfilePicChange}
            required
          />
          {data.accountType === "student" && (
            <>
              <select
                className='w-100'
                name='class'
                style={{ textAlignLast: "center" }}
                value={classNo}
                onChange={(e) => setClassNo(e.target.value)}
                required>
                <option value='' disabled hidden>
                  Class
                </option>
                <ClassList />
              </select>
              <select
                className='w-100'
                name='section'
                style={{ textAlignLast: "center" }}
                value={section}
                onChange={(e) => setSection(e.target.value)}
                required>
                <option value='' disabled hidden>
                  Section
                </option>
                <SectionList />
              </select>
            </>
          )}
          {data.accountType !== "school" ? (
            <input
              type='text'
              name='school'
              placeholder='School Id'
              value={data.account.school}
              onChange={handleChange}
              required
            />
          ) : (
            <select
              className='w-100'
              style={{ textAlignLast: "center" }}
              name='board'
              value={data.account.board}
              onChange={handleChange}
              required>
              <BoardList />
            </select>
          )}
          <button className='styledButton'>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Fourth;
