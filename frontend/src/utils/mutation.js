import gql from "graphql-tag";

export const ATTENDANCE_EDIT_MUTATION = gql`
  mutation AttendanceEditMutation($id: ID!, $data: JSONString) {
    editAttendance(pk: $id, data: $data) {
      success
    }
  }
`;

export const CREATE_ANSWER_MUTATION = gql`
  mutation CreateAnswer($id: ID!, $ans: String!) {
    createAnswer(que: $id, ans: $ans) {
      question {
        __typename
        id
        user {
          username
          photo
        }
        question
        timestamp
        answers: getAnswers {
          id
          user {
            username
            photo
          }
          answer
          timestamp
        }
      }
    }
  }
`;

export const CREATE_CONTACT_MUTATION = gql`
  mutation CreateContact($group: String!, $user: String!) {
    createContact(groupName: $group, user: $user) {
      success
    }
  }
`;

export const CREATE_EXAM_MUTATION = gql`
  mutation CreateExam($name: String!) {
    createExam(name: $name) {
      success
      exam {
        id
        name
        isPublished
      }
    }
  }
`;

export const CREATE_HW_MUTATION = gql`
  mutation CreateHw(
    $title: String!
    $homework: String!
    $files: String
    $classSection: String!
    $subject: String!
  ) {
    createHw(
      title: $title
      homework: $homework
      files: $files
      classSection: $classSection
      subject: $subject
    ) {
      success
      hw {
        id
        title
        homework
        subject
        files
        classSection
        timestamp
      }
    }
  }
`;

export const CREATE_NOTICE_MUTATION = gql`
  mutation CreateNotice($notice: String!) {
    createNotice(notice: $notice) {
      success
      error
      notice {
        notice
        timestamp
      }
    }
  }
`;

export const CREATE_ONLINE_CLASS_MUTATION = gql`
  mutation CreateOnlineClass(
    $link: String!
    $passcode: String
    $startTime: DateTime!
    $endTime: DateTime!
    $subject: String!
    $classSection: String!
  ) {
    createOnlineClass(
      link: $link
      passcode: $passcode
      startTime: $startTime
      endTime: $endTime
      subject: $subject
      classSection: $classSection
    ) {
      success
    }
  }
`;

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($desc: String, $photo: String!) {
    createPost(desc: $desc, photo: $photo) {
      success
    }
  }
`;

export const CREATE_QUESTION_MUTATION = gql`
  mutation CreateQuestion($question: String!) {
    createQuestion(que: $question) {
      question {
        id
        question
        user {
          username
          photo
        }
        timestamp
        countAnswers
      }
    }
  }
`;

export const CREATE_REPORT_MUTATION = gql`
  mutation CreateReport($qType: String!, $query: String!) {
    createReport(qType: $qType, query: $query) {
      success
    }
  }
`;

export const CREATE_RESULT_MUTATION = gql`
  mutation CreateResultMutation(
    $examId: ID!
    $classSection: String!
    $results: JSONString!
  ) {
    createResult(
      examId: $examId
      classSection: $classSection
      results: $results
    ) {
      success
    }
  }
`;

export const CREATE_SCHOOL_MUTATION = gql`
  mutation CreateSchool(
    $username: String!
    $name: String!
    $principal: String!
    $address: String!
    $contact: String!
    $board: String!
    $photo: String!
  ) {
    createSchool(
      name: $name
      principal: $principal
      address: $address
      contact: $contact
      board: $board
    ) {
      success
    }
    updateUserDetail(username: $username, photo: $photo) {
      success
    }
  }
`;

export const CREATE_STUDENT_MUTATION = gql`
  mutation CreateStudent(
    $username: String!
    $school: String!
    $name: String!
    $fatherName: String!
    $motherName: String!
    $admNo: Int!
    $dob: Date!
    $address: String!
    $contact: String!
    $rollNo: Int!
    $busNo: String
    $goal: String!
    $about: String!
    $classSection: String!
    $photo: String!
  ) {
    createStudent(
      studentData: {
        name: $name
        fatherName: $fatherName
        motherName: $motherName
        admNo: $admNo
        dob: $dob
        address: $address
        contact: $contact
        rollNo: $rollNo
        busNo: $busNo
        goal: $goal
        about: $about
        classSection: $classSection
        school: $school
      }
    ) {
      success
      error
    }
    updateUserDetail(username: $username, photo: $photo) {
      success
    }
  }
`;

export const CREATE_TEACHER_MUTATION = gql`
  mutation CreateTeacher(
    $username: String!
    $school: String!
    $name: String!
    $dob: Date!
    $address: String!
    $contact: String!
    $about: String!
    $startedTeaching: Int!
    $joiningDate: Date!
    $qualification: String!
    $photo: String!
  ) {
    createTeacher(
      teacherData: {
        name: $name
        dob: $dob
        address: $address
        contact: $contact
        about: $about
        startedTeaching: $startedTeaching
        joiningDate: $joiningDate
        qualification: $qualification
        school: $school
      }
    ) {
      success
      error
    }
    updateUserDetail(username: $username, photo: $photo) {
      success
    }
  }
`;

export const CREATE_TEST_ANSWER_MUTATION = gql`
  mutation CreateTestAnswer($id: ID!, $answers: JSONString!, $marks: String!) {
    createTestAnswer(test: $id, answers: $answers, marks: $marks) {
      success
    }
  }
`;

export const CREATE_TEST_MUTATION = gql`
  mutation CreateTest(
    $title: String!
    $duration: Int!
    $classSection: String!
    $subject: String!
    $questions: JSONString!
  ) {
    createTest(
      data: {
        title: $title
        duration: $duration
        classSection: $classSection
        subject: $subject
        questions: $questions
      }
    ) {
      success
    }
  }
`;

export const CREATE_WRITTEN_EXAM_MUTATION = gql`
  mutation CreateWrittenExam(
    $examId: ID!
    $classSection: String!
    $subject: String!
    $files: String!
    $publishDate: DateTime!
    $duration: Int!
  ) {
    createWrittenExam(
      examId: $examId
      classSection: $classSection
      subject: $subject
      files: $files
      duration: $duration
      publishDate: $publishDate
    ) {
      success
    }
  }
`;

export const CREATE_WRITTEN_EXAM_ANSWER_MUTATION = gql`
  mutation CreateWrittenExamAnswer($id: ID!, $files: String!) {
    created: createWrittenExamAnswer(pk: $id, files: $files) {
      success
    }
  }
`;

export const DELETE_EXAM_MUTATION = gql`
  mutation DeleteExam($id: ID!) {
    deleteExam(pk: $id) {
      success
    }
  }
`;

export const DELETE_HW_MUTATION = gql`
  mutation DeleteHwMutation($id: ID!) {
    deleteHw(pk: $id) {
      success
    }
  }
`;

export const DELETE_ONLINE_CLASS_MUTATION = gql`
  mutation DeleteOnlineClassMutation($id: ID!) {
    deleteOnlineClass(pk: $id) {
      success
    }
  }
`;

export const DELETE_WRITTEN_EXAM_MUTATION = gql`
  mutation DeleteWrittenExam($id: ID!) {
    delete: deleteWrittenExam(pk: $id) {
      success
    }
  }
`;

export const EDIT_RESULT_MUTATION = gql`
  mutation EditResult($id: ID!, $results: JSONString!) {
    editResult(examId: $id, results: $results) {
      success
    }
  }
`;

export const EDIT_TEST_MUTATION = gql`
  mutation EditMutation(
    $id: ID!
    $title: String!
    $duration: Int!
    $classSection: String!
    $subject: String!
    $questions: JSONString!
  ) {
    editTest(
      pk: $id
      data: {
        title: $title
        duration: $duration
        classSection: $classSection
        subject: $subject
        questions: $questions
      }
    ) {
      success
    }
  }
`;

export const FOLLOW_USER_MUTATION = gql`
  mutation FollowUser($username: String!) {
    followUser(username: $username) {
      success
    }
  }
`;

export const FORGOT_PASSWORD_SEND_MAIL_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    sendPasswordResetEmail(email: $email) {
      success
      errors
    }
  }
`;

export const LIKE_POST_MUTATION = gql`
  mutation LikePost($id: ID!) {
    post: likePost(postId: $id) {
      likes
    }
  }
`;

export const LOGIN_WITH_EMAIL_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      token
      refreshToken
    }
  }
`;

export const LOGIN_WITH_USERNAME_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      success
      token
      refreshToken
    }
  }
`;

export const PASSWORD_CHANGE_MUTATION = gql`
  mutation PasswordChange(
    $oldPassword: String!
    $newPassword1: String!
    $newPassword2: String!
    $refreshToken: String!
  ) {
    passwordChange(
      oldPassword: $oldPassword
      newPassword1: $newPassword1
      newPassword2: $newPassword2
    ) {
      success
      errors
      token
      refreshToken
    }
    revokeToken(refreshToken: $refreshToken) {
      revoked
      success
      errors
    }
  }
`;

export const PUBLISH_EXAM_MUTATION = gql`
  mutation PublishExam($id: ID!) {
    publishExam(pk: $id) {
      success
    }
  }
`;

export const PUBLISH_TEST_MUTATION = gql`
  mutation PublishTestMutation($id: ID!) {
    publishTest(pk: $id) {
      success
    }
  }
`;

export const REFRESH_AND_REVOKE_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    getToken: refreshToken(refreshToken: $refreshToken) {
      token
      refreshToken
    }
    revokeToken(refreshToken: $refreshToken) {
      revoked
    }
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($token: String!, $password: String!) {
    passwordReset(
      token: $token
      newPassword1: $password
      newPassword2: $password
    ) {
      success
      errors
    }
  }
`;

export const REVOKE_TOKEN_MUTATION = gql`
  mutation RevokeToken($refreshToken: String!) {
    revokeToken(refreshToken: $refreshToken) {
      revoked
    }
  }
`;

export const SEND_ACTIVATION_EMAIL_MUTATION = gql`
  mutation ActivationEmail($email: String!) {
    resendActivationEmail(email: $email) {
      success
      errors
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $username: String!, $password: String!) {
    signup(
      email: $email
      username: $username
      password1: $password
      password2: $password
    ) {
      success
      errors
      token
      refreshToken
    }
  }
`;

export const UNFOLLOW_USER_MUTATION = gql`
  mutation UnfollowUser($username: String!) {
    unfollowUser(username: $username) {
      success
    }
  }
`;

export const UNVERIFY_STUDENT_MUTATION = gql`
  mutation DeleteStudent($username: String!) {
    deleteStudent(username: $username) {
      success
    }
  }
`;

export const UNVERIFY_TEACHER_MUTATION = gql`
  mutation DeleteTeacher($username: String!) {
    deleteTeacher(username: $username) {
      success
    }
  }
`;

export const UPDATE_SCHOOL_MUTATION = gql`
  mutation UpdateSchool($name: String, $contact: String, $principal: String) {
    updateSchool(name: $name, contact: $contact, principal: $principal) {
      success
    }
  }
`;

export const UPDATE_STUDENT_MUTATION = gql`
  mutation UpdateStudent(
    $username: String!
    $photo: String!
    $name: String
    $fatherName: String
    $motherName: String
    $admNo: Int
    $dob: Date
    $address: String
    $contact: String
    $rollNo: Int
    $busNo: String
    $goal: String
    $about: String
    $classSection: String
  ) {
    updateStudent(
      studentData: {
        username: $username
        name: $name
        fatherName: $fatherName
        motherName: $motherName
        admNo: $admNo
        dob: $dob
        address: $address
        contact: $contact
        rollNo: $rollNo
        busNo: $busNo
        goal: $goal
        about: $about
        classSection: $classSection
      }
    ) {
      success
    }
    updateUserDetail(username: $username, photo: $photo) {
      success
    }
  }
`;

export const UPDATE_STUDENT_PREV_SCHOOL_MUTATION = gql`
  mutation UpdateStudentPrevSchool($school: String!) {
    updateStudentPrevSchool(school: $school) {
      success
    }
  }
`;

export const UPDATE_SUBJECT_MUTATION = gql`
  mutation UpdateSubject($data: JSONString!) {
    updateSubject(data: $data) {
      success
    }
  }
`;

export const UPDATE_TEACHER_MUTATION = gql`
  mutation UpdateTeacher(
    $username: String!
    $photo: String!
    $name: String
    $dob: Date
    $address: String
    $contact: String
    $about: String
    $startedTeaching: Int
    $joiningDate: Date
    $qualification: String
  ) {
    updateTeacher(
      teacherData: {
        username: $username
        name: $name
        dob: $dob
        address: $address
        contact: $contact
        about: $about
        startedTeaching: $startedTeaching
        joiningDate: $joiningDate
        qualification: $qualification
      }
    ) {
      success
    }
    updateUserDetail(username: $username, photo: $photo) {
      success
    }
  }
`;

export const UPDATE_TEACHER_PREV_SCHOOL_MUTATION = gql`
  mutation UpdateTeacherPrevSchool($school: String!) {
    updateTeacherPrevSchool(school: $school) {
      success
    }
  }
`;

export const UPDATE_TIMETABLE_MUTATION = gql`
  mutation Timetable($data: JSONString!) {
    updateTimetable(data: $data) {
      timetable {
        __typename
        id
        detail
      }
    }
  }
`;

export const UPDATE_USER_AUTH_MUTATION = gql`
  mutation UpdateUserAuth($email: String!) {
    updateUserAuth(email: $email) {
      success
      errors
    }
  }
`;

export const UPDATE_USER_DETAIL_MUTATION = gql`
  mutation UpdateUserDetail(
    $username: String!
    $isProfileCompleted: Boolean
    $isSchoolVerified: Boolean
    $isSuspended: Boolean
    $photo: String
    $reason: String
  ) {
    updateUserDetail(
      username: $username
      isProfileCompleted: $isProfileCompleted
      isSchoolVerified: $isSchoolVerified
      isSuspended: $isSuspended
      photo: $photo
      reason: $reason
    ) {
      success
    }
  }
`;

export const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmail($token: String!) {
    verifyAccount(token: $token) {
      success
      errors
    }
  }
`;

export const VERIFY_STUDENT_MUTATION = gql`
  mutation VerifyStudent(
    $username: String!
    $photo: String!
    $name: String
    $fatherName: String
    $motherName: String
    $admNo: Int
    $dob: Date
    $address: String
    $contact: String
    $rollNo: Int
    $busNo: String
    $goal: String
    $about: String
    $classSection: String
  ) {
    updateStudent(
      studentData: {
        username: $username
        name: $name
        fatherName: $fatherName
        motherName: $motherName
        admNo: $admNo
        dob: $dob
        address: $address
        contact: $contact
        rollNo: $rollNo
        busNo: $busNo
        goal: $goal
        about: $about
        classSection: $classSection
      }
    ) {
      success
    }

    verifySchoolUser(username: $username, photo: $photo) {
      success
    }
  }
`;

export const VERIFY_TEACHER_MUTATION = gql`
  mutation VerifyTeacher(
    $username: String!
    $photo: String!
    $name: String
    $dob: Date
    $address: String
    $contact: String
    $about: String
    $startedTeaching: Int
    $joiningDate: Date
    $qualification: String
  ) {
    updateTeacher(
      teacherData: {
        username: $username
        name: $name
        dob: $dob
        address: $address
        contact: $contact
        about: $about
        startedTeaching: $startedTeaching
        joiningDate: $joiningDate
        qualification: $qualification
      }
    ) {
      success
    }
    verifySchoolUser(username: $username, photo: $photo) {
      success
    }
  }
`;
