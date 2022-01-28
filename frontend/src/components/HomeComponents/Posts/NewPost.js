import React, { useState } from "react";
import { useSelector } from "react-redux";
import { uploadFile } from "../../../utils/fileManager";
import { CREATE_POST_MUTATION } from "../../../utils/mutation";
import client from "../../../utils/apollo";

const NewPost = () => {
  const { username } = useSelector((state) => state.auth);

  const [desc, setDesc] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [msg, setMsg] = useState({ text: "", color: "" });

  const handleProfilePicChange = (e) => {
    if (e.target.files.length === 0) return;
    setProfilePic(URL.createObjectURL(e.target.files[0]));
    setProfilePicFile(e.target.files[0]);
  };

  const clearForm = () => {
    setMsg({ text: "Image posted", color: "success" });
    setDesc("");
    setProfilePic(null);
    setProfilePicFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profilePicFile) {
      setMsg({ text: "Please select an image", color: "danger" });
      return;
    }
    setMsg({ text: "Uploading image. Please wait...", color: "info" });

    const photo = await uploadFile(
      profilePicFile,
      `${username}/posts/${profilePicFile.name}`
    );
    client
      .mutate({
        mutation: CREATE_POST_MUTATION,
        variables: { desc, photo },
      })
      .then((res) => clearForm())
      .catch((err) => setMsg("Something went wrong"));
  };

  return (
    <div className='container'>
      <div className='d-flex justify-content-center'>
        <div className='box' style={{ width: "18rem" }}>
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
              name='pic'
              id='profilePic'
              type='file'
              accept='image/*'
              onChange={handleProfilePicChange}
            />
            <div className='form-floating mt-3'>
              <textarea
                className='form-control bg-transparent text-revert border-secondary'
                style={{ height: "200px" }}
                id='floatingTextarea'
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
              <label
                htmlFor='floatingTextarea'
                className='text-skyblue fw-bolder'>
                Description
              </label>
            </div>
            <button className='styledButton'>Post</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPost;
