import React from "react";
import { Link } from "react-router-dom";

const SchoolList = () => (
  <>
    <Link className='dropdown-item text-revert py-2' to='/chats'>
      Chats
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
    <Link className='dropdown-item text-revert py-2' to='/results'>
      Results
    </Link>
    <Link className='dropdown-item text-revert py-2' to='/school/written/exams'>
      Written Exam
    </Link>
    <hr className='dropdown-divider bg-revert' />
    <Link className='dropdown-item text-revert py-2' to='/school/exam'>
      Add / Remove Exam
    </Link>
    <Link className='dropdown-item text-revert py-2' to='/school/subject'>
      Add / Remove Subject
    </Link>
    <Link className='dropdown-item text-revert py-2' to='/school/add/user'>
      Add Student / Teacher
    </Link>
    <Link className='dropdown-item text-revert py-2' to='/school/view/user'>
      View Student / Teacher
    </Link>
    <Link className='dropdown-item text-revert py-2' to='/school/suspend/user'>
      Suspend Student / Teacher
    </Link>
    <Link
      className='dropdown-item text-revert py-2'
      to='/school/unsuspend/user'>
      Unsuspend Student / Teacher
    </Link>
    <Link className='dropdown-item text-revert py-2' to='/school/remove/user'>
      Remove Student / Teacher
    </Link>
  </>
);

export default SchoolList;
