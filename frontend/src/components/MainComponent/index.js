import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GET_ACTIONS } from "../../redux/actions";
import About from "../AboutComponents";
import AccessDenied from "../UtilityComponents/AccessDenied";
import AccountSuspended from "../UtilityComponents/AccountSuspended";
import AccountUnverified from "../UtilityComponents/AccountUnverified";
import AddUser from "../ManageSchoolComponents/AddUser";
import Attendance from "../AttendanceComponents";
import ContactUs from "../ContactUsComponents";
import Chat from "../ChatComponents";
import CreateOnlineClass from "../OnlineClassComponents/CreateOnlineClass";
import CreateResult from "../ResultComponents/CreateResult";
import CreateTest from "../TestComponents/CreateTest";
import CreateWrittenExam from "../WrittenExamComponents/CreateWrittenExam";
import EditProfile from "../ProfileComponents/EditProfileComponents";
import EditResult from "../ResultComponents/EditResult";
import EditTest from "../TestComponents/EditTest";
import EditUser from "../ManageSchoolComponents/EditUser";
import EmailSend from "../AuthComponents/EmailSend";
import EmailVerify from "../AuthComponents/EmailVerify";
import Exam from "../ManageSchoolComponents/Exam";
import ForgotPassword from "../AuthComponents/ForgotPassword";
import HighlySecuredRoute from "./HighlySecuredRoute";
import Home from "../HomeComponents";
import Homework from "../HomeworkComponents";
import Login from "../AuthComponents/Login";
import Navbar from "../NavbarComponents";
import NewPost from "../HomeComponents/Posts/NewPost";
import Notice from "../NoticeComponents";
import OnlineClasses from "../OnlineClassComponents/OnlineClasses";
import PageNotFound404 from "../UtilityComponents/PageNotFound404";
import PostDetail from "../HomeComponents/Posts/PostDetail";
import Profile from "../ProfileComponents/ProfileDetail";
import Question from "../QuestionComponents";
import QuestionDetail from "../QuestionComponents/QuestionDetail/";
import RemoveUser from "../ManageSchoolComponents/RemoveUser";
import ResetPassword from "../AuthComponents/ResetPassword";
import Results from "../ResultComponents/Results";
import SchoolUnverified from "../UtilityComponents/SchoolUnverified";
import Search from "../NavbarComponents/SearchComponents";
import SecuredHomeRoute from "./SecuredHomeRoute";
import Settings from "../ProfileComponents/EditProfileComponents/Settings";
import SetupProfile from "../ProfileComponents/SetupProfileComponents";
import Signup from "../AuthComponents/Signup";
import SlightlySecuredRoute from "./SlightlySecuredRoute";
import Subject from "../ManageSchoolComponents/Subject";
import SubscriptionExpired from "../UtilityComponents/SubscriptionExpired";
import SuspendUser from "../ManageSchoolComponents/SuspendUser";
import TakeTest from "../TestComponents/TakeTest";
import Test from "../TestComponents/Test";
import TimeTable from "../ManageSchoolComponents/Timetable";
import ToastContainer from "../UtilityComponents/ToastContainer";
import UnsuspendUser from "../ManageSchoolComponents/UnsuspendUser";
import ViewResult from "../ResultComponents/ViewResult";
import ViewUser from "../ManageSchoolComponents/ViewUser";
import WrittenExams from "../WrittenExamComponents/WrittenExams";

const Main = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    isLoggedIn && dispatch(GET_ACTIONS.USER_DETAIL());
  }, [dispatch, isLoggedIn]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/about' element={<About />} />
        <Route path='/forgot_password' element={<ForgotPassword />} />
        <Route path='/login' element={<Login />} />
        <Route path='/password_reset/:token' element={<ResetPassword />} />
        <Route path='/search' element={<Search />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/verify_email/:token' element={<EmailVerify />} />

        <Route element={<SecuredHomeRoute />}>
          <Route path='/' element={<Home />} />
        </Route>

        <Route element={<SlightlySecuredRoute />}>
          <Route path='/access_denied' element={<AccessDenied />} />
          <Route path='/account_suspended' element={<AccountSuspended />} />
          <Route path='/account_unverified' element={<AccountUnverified />} />
          <Route path='/contact_us' element={<ContactUs />} />
          <Route path='/profile/setup' element={<SetupProfile />} />
          <Route path='/school_unverified' element={<SchoolUnverified />} />
          <Route path='/send_verification_email' element={<EmailSend />} />
          <Route
            path='/subscription_expired'
            element={<SubscriptionExpired />}
          />
        </Route>

        <Route element={<HighlySecuredRoute />}>
          <Route path='/attendance' element={<Attendance />} />
          <Route path='/chats' element={<Chat />} />
          <Route path='/homework' element={<Homework />} />
          <Route path='/notice' element={<Notice />} />
          <Route path='/online_classes' element={<OnlineClasses />} />
          <Route
            path='/online_classes/create'
            element={<CreateOnlineClass />}
          />
          <Route path='/post/new' element={<NewPost />} />
          <Route path='/post/:id' element={<PostDetail />} />
          <Route path='/profile/edit' element={<EditProfile />} />
          <Route path='/profile/:username' element={<Profile />} />
          <Route path='/question/:id' element={<QuestionDetail />} />
          <Route path='/questions' element={<Question />} />
          <Route path='/results' element={<Results />} />
          <Route path='/results/create' element={<CreateResult />} />
          <Route path='/results/edit/:id' element={<EditResult />} />
          <Route path='/results/view/:id' element={<ViewResult />} />
          <Route path='/school/add/user' element={<AddUser />} />
          <Route path='/school/edit/user/:username' element={<EditUser />} />
          <Route path='/school/exam' element={<Exam />} />
          <Route path='/school/subject' element={<Subject />} />
          <Route path='/school/suspend/user' element={<SuspendUser />} />
          <Route path='/school/view/user' element={<ViewUser />} />
          <Route path='/school/unsuspend/user' element={<UnsuspendUser />} />
          <Route path='/school/remove/user' element={<RemoveUser />} />
          <Route path='/school/timetable' element={<TimeTable />} />
          <Route path='/school/written/exams' element={<WrittenExams />} />
          <Route
            path='/school/written/exams/create'
            element={<CreateWrittenExam />}
          />
          <Route path='/settings' element={<Settings />} />
          <Route path='/test' element={<Test />} />
          <Route path='/test/create' element={<CreateTest />} />
          <Route path='/test/edit/:id' element={<EditTest />} />
          <Route path='/test/take/:id' element={<TakeTest />} />
        </Route>

        <Route path='*' element={<PageNotFound404 />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default Main;
