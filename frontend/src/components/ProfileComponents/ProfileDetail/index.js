import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { USER_DETAIL_QUERY } from "../../../utils/query";
import {
  CREATE_CONTACT_MUTATION,
  FOLLOW_USER_MUTATION,
  UNFOLLOW_USER_MUTATION,
} from "../../../utils/mutation";
import { SchoolCard, StudentCard, TeacherCard } from "./Cards";
import client from "../../../utils/apollo";
import PageNotFound404 from "../../UtilityComponents/PageNotFound404";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";
import TabbedNav from "./TabbedNav";

const Profile = () => {
  const {
    username: loggedInUsername,
    photo: loggedInUserPhoto,
    role: loggedInUserRole,
    school: loggedInUserSchool,
  } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [found, setFound] = useState();

  const navigate = useNavigate();

  const { username: paramsUsername } = useParams();
  const sameUser = loggedInUsername === paramsUsername;

  const handleFollow = () => {
    const action = profile.user.isFollowing ? "unfollow" : "follow";
    if (action === "follow") {
      client
        .mutate({
          mutation: FOLLOW_USER_MUTATION,
          variables: { username: paramsUsername },
        })
        .then((res) =>
          setProfile((original) => ({
            ...original,
            user: {
              ...original.user,
              isFollowing: true,
              followersCount: original.user.followersCount + 1,
              followers: [
                ...original.user.followers,
                { username: loggedInUsername, photo: loggedInUserPhoto },
              ],
            },
          }))
        )
        .catch((err) => err);
    } else {
      client
        .mutate({
          mutation: UNFOLLOW_USER_MUTATION,
          variables: { username: paramsUsername },
        })
        .then((res) =>
          setProfile((original) => ({
            ...original,
            user: {
              ...original.user,
              isFollowing: false,
              followersCount: original.user.followersCount - 1,
              followers: original.user.followers.filter(
                (x) => x.username !== loggedInUsername
              ),
            },
          }))
        )
        .catch((err) => err);
    }
  };

  const handleMessage = () => {
    let tmp = [paramsUsername, loggedInUsername];
    tmp.sort();
    const group = tmp.join("~");
    client
      .mutate({
        mutation: CREATE_CONTACT_MUTATION,
        variables: { group, user: paramsUsername },
      })
      .then((res) => res.data.createContact.success && navigate("/chats"))
      .catch((err) => err);
  };

  useEffect(() => {
    document.title = paramsUsername;
    client
      .query({
        query: USER_DETAIL_QUERY,
        variables: { username: paramsUsername },
      })
      .then((res) => {
        setProfile(res.data.profile);
        setFound(true);
        setIsLoading(false);
      })
      .catch((err) => setFound(false));
  }, [paramsUsername]);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className='container my-5'>
      {found && (
        <>
          <header className='d-flex my-3'>
            <div className='container d-flex justify-content-center p-0'>
              <div className='profile-card' style={{ width: "100%" }}>
                <img
                  src={profile.user.photo}
                  className='mx-auto rounded-circle mb-1'
                  style={{
                    width: "100px",
                    height: "100px",
                    boxShadow: "0 0 0 8px #1f1e1e",
                  }}
                  alt='profile_img'
                />
                <h3 style={{ color: "#1cb65d" }}>{paramsUsername}</h3>

                {profile.__typename === "StudentType" && (
                  <StudentCard profile={profile} />
                )}
                {profile.__typename === "TeacherType" && (
                  <TeacherCard profile={profile} />
                )}
                {profile.__typename === "SchoolType" && (
                  <SchoolCard
                    profile={profile}
                    paramsUsername={paramsUsername}
                    loggedInUserRole={loggedInUserRole}
                    loggedInUserSchool={loggedInUserSchool}
                  />
                )}

                {!sameUser && (
                  <div className='profile-card-buttons'>
                    <button onClick={handleFollow}>
                      {profile.user.isFollowing ? "Unfollow" : "Follow"}
                    </button>
                    {profile.user.isFollowing && (
                      <button onClick={handleMessage}>Message</button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </header>
          <TabbedNav
            profile={profile}
            sameUser={sameUser}
            setProfile={setProfile}
            paramsUsername={paramsUsername}
            loggedInUserRole={loggedInUserRole}
            loggedInUsername={loggedInUsername}
            loggedInUserSchool={loggedInUserSchool}
          />
        </>
      )}
      {found === false && <PageNotFound404 />}
    </div>
  );
};

export default Profile;
