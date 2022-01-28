import React from "react";

const ListTeacher = ({ teachersList }) =>
  teachersList.map((x, i) => (
    <option className='bg-black' value={x.user.username} key={i}>
      {x.name}
    </option>
  ));

export default ListTeacher;
