import React from "react";

const ListSubjects = ({
  results,
  disabled,
  username,
  maxMarks = null,
  setResults = null,
}) => {
  const subjects = results[username]?.subjects;
  if (subjects === undefined) return null;

  const handleMarksChange = (e, subject) => {
    if (+e.target.value > +maxMarks) {
      alert("Value is greater than maximum marks");
      return;
    }

    setResults((original) => ({
      ...original,
      [username]: {
        ...original[username],
        subjects: {
          ...original[username]?.subjects,
          [subject]: e.target.value,
        },
      },
    }));
  };

  return Object.keys(subjects).map((subject, i) => (
    <div key={i} className='input-group input-group-sm mb-3'>
      <span
        className='input-group-text bg-transparent'
        style={{ width: "130px" }}>
        {subject}
      </span>
      <input
        type='text'
        className='form-control'
        value={results[username]?.subjects?.[subject]}
        onChange={(e) => handleMarksChange(e, subject)}
        disabled={disabled}
      />
    </div>
  ));
};

export default ListSubjects;
