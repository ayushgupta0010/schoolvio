import React from "react";
import { Link } from "react-router-dom";

const StudentTeacherList = () => (
  <>
    <Link className='dropdown-item text-revert py-2' to='/chats'>
      Chats
    </Link>
    <Link className='dropdown-item text-revert py-2' to='/homework'>
      Homework
    </Link>
    <Link className='dropdown-item text-revert py-2' to='/notice'>
      Notice
    </Link>
    <Link className='dropdown-item text-revert py-2' to='/online_classes'>
      Online Class
    </Link>
    <Link className='dropdown-item text-revert py-2' to='/school/timetable'>
      Timetable
    </Link>
    <Link className='dropdown-item text-revert py-2' to='/test'>
      Test
    </Link>
    <Link className='dropdown-item text-revert py-2' to='/results'>
      Results
    </Link>
    <Link className='dropdown-item text-revert py-2' to='/school/written/exams'>
      Written Exam
    </Link>
    <Link className='dropdown-item text-revert py-2' to='/questions'>
      QnA
    </Link>
  </>
);

export default StudentTeacherList;
