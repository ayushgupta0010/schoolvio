import React from "react";
import SubjectListLite from "../../UtilityComponents/SubjectListLite";
import ListTeacher from "./ListTeacher";

const SubjectListTR = ({ data }) => {
  const LoadSelect = ({ day, period }) => {
    day = day.toLowerCase();
    const periodData = `period${period}`;
    const class_section = `${data.currentClass}-${data.currentSection}`;
    const teacherValue = data.timeTable?.[class_section]
      ? data.timeTable?.[class_section]?.[day]?.[periodData]?.teacher
      : "";
    const subjectValue = data.timeTable?.[class_section]
      ? data.timeTable?.[class_section]?.[day]?.[periodData]?.subject
      : "";

    return (
      <div className='d-flex flex-column align-items-center'>
        <select
          className='styledFont2 border-0 bg-transparent text-white'
          style={{ appearance: "none" }}
          name='subject'
          value={subjectValue}
          onChange={(e) => data.handleTimeTableChange(e, day, periodData)}
          disabled={data.role !== "SCHOOL"}>
          <SubjectListLite />
        </select>
        <select
          className='styledFont2 border-0 bg-transparent text-white'
          style={{ appearance: "none" }}
          name='teacher'
          value={teacherValue}
          onChange={(e) => data.handleTimeTableChange(e, day, periodData)}
          disabled={data.role !== "SCHOOL"}>
          <option className='bg-dark' value=''>
            ----------
          </option>
          <ListTeacher teachersList={data.teachersList} />
        </select>
      </div>
    );
  };

  const LoadTRWithSelect = ({ dayname }) => (
    <tr>
      <th className='text-skyblue styledFont2 text-center align-middle'>
        {dayname}
      </th>
      <td>
        <LoadSelect day={dayname} period='1' />
      </td>
      <td>
        <LoadSelect day={dayname} period='2' />
      </td>
      <td>
        <LoadSelect day={dayname} period='3' />
      </td>
      <td>
        <LoadSelect day={dayname} period='4' />
      </td>
      <td>
        <LoadSelect day={dayname} period='5' />
      </td>
      <td>
        <LoadSelect day={dayname} period='6' />
      </td>
      <td>
        <LoadSelect day={dayname} period='7' />
      </td>
      <td>
        <LoadSelect day={dayname} period='8' />
      </td>
    </tr>
  );

  return (
    <>
      <LoadTRWithSelect dayname='Monday' />
      <LoadTRWithSelect dayname='Tuesday' />
      <LoadTRWithSelect dayname='Wednesday' />
      <LoadTRWithSelect dayname='Thursday' />
      <LoadTRWithSelect dayname='Friday' />
      <LoadTRWithSelect dayname='Saturday' />
    </>
  );
};

export default SubjectListTR;
