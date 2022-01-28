import gql from "graphql-tag";

export const ALL_QUES_QUERY = gql`
  query {
    listQuesAll {
      id
      user {
        username
        photo
      }
      question
      countAnswers
      timestamp
    }
  }
`;

export const ANS_BY_USER_QUERY = gql`
  query AnsByUser($username: String!) {
    answers: listAnsByUser(username: $username) {
      question {
        id
        question
      }
      answer
    }
  }
`;

export const ATTENDANCE_FOR_DATE_QUERY = gql`
  query AttendanceForDate($date: Date!) {
    attendance: attendanceForDate(date: $date) {
      id
      data
    }
  }
`;

export const EDIT_PROFILE_QUERY = gql`
  query {
    editProfile: me {
      id
      student {
        id
        goal
        about
      }
      teacher {
        id
        qualification
        about
      }
      school {
        id
        name
        contact
        principal
      }
    }
  }
`;

export const EXAMS_QUERY = gql`
  query Exams($school: String!) {
    exams(school: $school) {
      id
      name
      isPublished
    }
  }
`;

export const GROUP_CONTACTS_QUERY = gql`
  query GroupContacts($group: String!) {
    contacts: groupContacts(group: $group) {
      id
      user {
        username
        photo
        role
        isOnline
      }
    }
  }
`;

export const HW_FOR_CLASS_QUERY = gql`
  query {
    hwList: listHwByClass {
      id
      title
      homework
      subject
      files
      classSection
      timestamp
    }
  }
`;

export const HW_BY_TEACHER_QUERY = gql`
  query {
    hwList: listHwByTeacher {
      id
      title
      homework
      subject
      files
      classSection
      timestamp
    }
  }
`;

export const ME_QUERY = gql`
  query {
    user: me {
      id
      username
      email
      role
      verified
      isProfileCompleted
      isSchoolVerified
      isSuspended
      reason
      photo
      student {
        id
        classSection
        school {
          id
          isSubscriptionExpired
          name
          user {
            id
            username
            photo
          }
        }
      }
      teacher {
        id
        ct {
          classSection
        }
        school {
          id
          isSubscriptionExpired
          name
          user {
            id
            username
            photo
          }
        }
      }
      school {
        id
        isSubscriptionExpired
        name
        user {
          photo
        }
      }
    }
  }
`;

export const NOTICE_QUERY = gql`
  query Notice($school: String!) {
    notices(school: $school) {
      id
      notice
      timestamp
    }
  }
`;

export const ONLINE_CLASSES_FOR_SCHOOL_QUERY = gql`
  query OnlineClassesForSchool {
    classes: onlineClassesForSchool {
      id
      startTime
      endTime
      subject
      link
      passcode
      classSection
      teacher {
        name
      }
    }
  }
`;

export const ONLINE_CLASSES_FOR_STUDENT_QUERY = gql`
  query OnlineClassesForStudent {
    classes: onlineClassesForStudent {
      id
      link
      subject
      endTime
      passcode
      startTime
    }
  }
`;

export const ONLINE_CLASSES_FOR_TEACHER_QUERY = gql`
  query OnlineClassesForTeacher {
    classes: onlineClassesForTeacher {
      id
      link
      subject
      endTime
      passcode
      startTime
      classSection
    }
  }
`;

export const POST_QUERY = gql`
  query PostDetail($id: ID!) {
    postDetail(pk: $id) {
      id
      user {
        username
        photo
      }
      photo
      description
      timestamp
      likes
      isLikedByUser
    }
  }
`;

export const POSTS_BY_USER_QUERY = gql`
  query PostsByUserList($username: String!) {
    posts: listPostsBy(username: $username) {
      id
      photo
    }
  }
`;

export const POSTS_FOR_QUERY = gql`
  query {
    postList: listPostsFor {
      id
      user {
        username
        photo
      }
      photo
      description
      timestamp
      likes
      isLikedByUser
    }
  }
`;

export const QUE_WITH_ANS_QUERY = gql`
  query QuestionDetail($id: ID!) {
    queDetail(id: $id) {
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
`;

export const QUES_BY_USER_QUERY = gql`
  query QuesByUser($username: String!) {
    questions: listQuesBy(username: $username) {
      id
      question
      countAnswers
    }
  }
`;

export const RESULT_BY_ID_QUERY = gql`
  query ResultById($id: ID!) {
    result: resultById(pk: $id) {
      id
      exam {
        name
        isPublished
      }
      results
      teacher {
        user {
          username
        }
      }
    }
  }
`;

export const RESULT_CREATE_QUERY = gql`
  query ResultCreateQuery($school: String!) {
    exams(school: $school) {
      id
      name
      isPublished
    }
    subjects(school: $school) {
      id
      data
    }
    students: studentsForClassTeacher {
      id
      name
      classSection
      rollNo
      admNo
      user {
        username
        photo
      }
    }
  }
`;

export const RESULTS_BY_TEACHER_QUERY = gql`
  query ResultsByTeacher {
    results: resultsByTeacher {
      id
      exam {
        name
        isPublished
      }
    }
  }
`;

export const RESULTS_FOR_SCHOOL_QUERY = gql`
  query ResultsForSchool($examId: ID!, $classSection: String!) {
    result: resultsForSchool(examId: $examId, classSection: $classSection) {
      id
      exam {
        name
      }
    }
  }
`;

export const RESULTS_FOR_STUDENT_QUERY = gql`
  query ResultsForStudent {
    results: resultsForStudent {
      id
      exam {
        name
      }
      result
    }
  }
`;

export const SCHOOL_UNVERIFIED_USERS_QUERY = gql`
  query {
    schoolUnverifiedUsers
  }
`;

export const STUDENTS_FOR_ATTENDANCE_QUERY = gql`
  query StudentsForAttendance {
    students: studentsForClassTeacher {
      id
      name
      user {
        photo
      }
    }
  }
`;

export const SUBJECTS_QUERY = gql`
  query Subjects($school: String!) {
    subjects(school: $school) {
      id
      data
    }
  }
`;

export const SUBSCRIPTION_QUERY = gql`
  query Subscription {
    subscription {
      plan: subscription
      startDate
      endDate
      school {
        name
        address
      }
    }
  }
`;

export const SUSPENDED_USERS_QUERY = gql`
  query {
    suspendedUsers {
      __typename
      ... on StudentType {
        name
        classSection
        admNo
        user {
          username
          photo
          reason
        }
      }
      ... on TeacherType {
        name
        user {
          username
          photo
          reason
        }
      }
    }
  }
`;

export const TEACHERS_LIST_QUERY = gql`
  query TeachersList($school: String!) {
    teachersList(school: $school) {
      name
      user {
        username
      }
    }
  }
`;

export const TEST_BY_ID_QUERY = gql`
  query TestById($id: ID!) {
    test: testById(pk: $id) {
      id
      teacher {
        user {
          username
        }
        school {
          user {
            username
          }
        }
      }
      title
      duration
      classSection
      subject
      questions
      isPublished
      isTestTaken
    }
  }
`;

export const TESTS_BY_TEACHER_QUERY = gql`
  query TestsByTeacher {
    tests: testsByTeacher {
      id
      title
      duration
      subject
      classSection
      questions
      isPublished
      timestamp
      answers: getTestAnswers {
        student {
          name
          user {
            username
            photo
          }
        }
        answers
        marks
      }
    }
  }
`;

export const TESTS_FOR_STUDENT_QUERY = gql`
  query TestsForStudent($school: String!, $classSection: String!) {
    tests: testsForStudent(school: $school, cls: $classSection) {
      id
      teacher {
        user {
          username
          photo
        }
      }
      title
      duration
      classSection
      subject
      questions
      timestamp
      getAnswer: getAnswerByCurrentUser {
        answers
        marks
      }
    }
  }
`;

export const TIMETABLE_QUERY = gql`
  query Timetable($school: String!) {
    timetable(school: $school) {
      id
      detail
    }
  }
`;

export const USER_DETAIL_QUERY = gql`
  query UserDetail($username: String!) {
    profile: detailFor(username: $username) {
      __typename
      ... on StudentType {
        user {
          photo
          followers {
            username
            photo
            isFollowing
          }
          following {
            username
            photo
            isFollowing
          }
          followersCount
          followingCount
          isFollowing
        }
        name
        fatherName
        motherName
        admNo
        rollNo
        busNo
        classSection
        contact
        address
        dob
        goal
        about
        school {
          user {
            username
          }
        }
      }
      ... on TeacherType {
        user {
          photo
          followers {
            username
            photo
            isFollowing
          }
          following {
            username
            photo
            isFollowing
          }
          followersCount
          followingCount
          isFollowing
        }
        name
        startedTeaching
        joiningDate
        qualification
        contact
        address
        dob
        about
        school {
          user {
            username
          }
        }
      }
      ... on SchoolType {
        user {
          photo
          followers {
            username
            photo
            isFollowing
          }
          following {
            username
            photo
            isFollowing
          }
          followersCount
          followingCount
          isFollowing
        }
        principal
        name
        address
        contact
        board
      }
    }
  }
`;

export const USER_DETAIL_FOR_SCHOOL_QUERY = gql`
  query UserDetailForSchoolVerification($username: String!) {
    profile: detailFor(username: $username) {
      __typename
      ... on StudentType {
        user {
          username
          photo
        }
        name
        fatherName
        motherName
        admNo
        rollNo
        busNo
        dob
        address
        contact
        classSection
        school {
          user {
            username
          }
        }
      }
      ... on TeacherType {
        user {
          username
          photo
        }
        name
        address
        dob
        contact
        startedTeaching
        joiningDate
        qualification
        school {
          user {
            username
          }
        }
      }
    }
  }
`;

export const WRITTEN_EXAMS_BY_SCHOOL_QUERY = gql`
  query WrittenExamsBySchool {
    exams: writtenExamsBySchool {
      id
      exam {
        name
        isPublished
      }
      files
      subject
      duration
      classSection
      publishDate
      currentTime
    }
  }
`;

export const WRITTEN_EXAMS_FOR_STUDENT_QUERY = gql`
  query WrittenExamsForStudent {
    exams: writtenExamsForStudent {
      id
      exam {
        name
      }
      subject
      duration
      currentTime
      publishDate
      uploadedAnswer {
        files
      }
    }
  }
`;

export const WRITTEN_EXAMS_ANS_FOR_TEACHER_QUERY = gql`
  query WrittenExamAnsForTeacher(
    $id: ID!
    $subject: String!
    $classSection: String!
  ) {
    ans: writtenExamsAnsForTeacher(
      subject: $subject
      writtenExamId: $id
      classSection: $classSection
    ) {
      id
      writtenExam {
        exam {
          name
        }
      }
      files
      student {
        name
        user {
          photo
        }
      }
    }
  }
`;
