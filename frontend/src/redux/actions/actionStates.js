import * as actionTypes from "./actionTypes";

export const addNotif = (notif) => {
  return {
    type: actionTypes.ADD_NOTIF,
    payload: { ...notif },
  };
};

export const login = () => {
  return {
    type: actionTypes.LOGIN,
  };
};

export const logout = () => {
  return {
    type: actionTypes.LOGOUT,
  };
};

export const markNotifRead = (id) => {
  return {
    type: actionTypes.MARK_NOTIF_READ,
    payload: { id },
  };
};

export const setNotifsList = (notifsList) => {
  return {
    type: actionTypes.SET_NOTIF_LIST,
    payload: { notifsList },
  };
};

export const resetNotifsList = () => {
  return {
    type: actionTypes.RESET_NOTIF_LIST,
  };
};

export const toastNotification = (notification, action) => {
  return {
    type:
      action === "add"
        ? actionTypes.ADD_TOAST_NOTIFICATION
        : actionTypes.REMOVE_TOAST_NOTIFICATION,
    payload: {
      sender: notification.sender,
      photo: notification.photo,
      message: notification.message,
      timestamp: notification.timestamp,
    },
  };
};

export const resetToastNotifications = () => {
  return {
    type: actionTypes.RESET_TOAST_NOTIFICATION_LIST,
  };
};

export const updateUserDetail = (user) => {
  let classSection, school, isSubscriptionExpired, schoolName, schoolPhoto;
  if (user.role === "STUDENT") {
    classSection = user.student.classSection;
    school = user.student.school.user.username;
    isSubscriptionExpired = user.student.school.isSubscriptionExpired;
    schoolName = user.student.school.name;
    schoolPhoto = user.student.school.user.photo;
  } else if (user.role === "TEACHER") {
    classSection = user.teacher.ct.classSection;
    school = user.teacher.school.user.username;
    isSubscriptionExpired = user.teacher.school.isSubscriptionExpired;
    schoolName = user.teacher.school.name;
    schoolPhoto = user.teacher.school.user.photo;
  } else if (user.role === "SCHOOL") {
    classSection = null;
    school = user.username;
    isSubscriptionExpired = user.school.isSubscriptionExpired;
    schoolName = user.school.name;
    schoolPhoto = user.school.user.photo;
  }

  return {
    type: actionTypes.UPDATE_USER_DETAIL,
    payload: {
      username: user.username,
      email: user.email,
      role: user.role,
      verified: user.verified,
      isProfileCompleted: user.isProfileCompleted,
      isSchoolVerified: user.isSchoolVerified,
      photo: user.photo,
      isSuspended: user.isSuspended,
      reason: user.reason,
      classSection,
      school,
      isSubscriptionExpired,
      schoolName,
      schoolPhoto,
    },
  };
};

export const updateEmail = (email) => {
  return {
    type: actionTypes.UPDATE_EMAIL,
    payload: { email },
  };
};

export const updateVerified = () => {
  return {
    type: actionTypes.UPDATE_VERIFIED,
  };
};
