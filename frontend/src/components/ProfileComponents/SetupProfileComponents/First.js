import React from "react";

const First = ({ data }) => {
  const handleChange = (e) => {
    if (
      (e.target.name === "name" || e.target.name === "principal") &&
      e.target.value.length > 50
    ) {
      alert("Only 50 characters allowed");
      return;
    } else if (e.target.name === "contact" && e.target.value.length > 10) {
      alert("Only 10 digits allowed");
      return;
    }

    data.setAccount({
      ...data.account,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.accountType !== "school") data.setViewPage(2);
    else data.setViewPage(4);
  };

  const hideModal = (e) => {
    if (data.accountType !== "") {
      document
        .getElementById("exampleModalCenter")
        .classList.remove("show", "d-block");
      const box = document.getElementsByClassName("blur");
      box[0].classList.remove("blur");
    }
  };

  return (
    <div className='d-flex justify-content-center my-5'>
      <div
        className='modal fade show d-block'
        id='exampleModalCenter'
        tabIndex='-1'
        role='dialog'
        aria-hidden='true'>
        <div className='modal-dialog modal-dialog-centered' role='document'>
          <div className='modal-content border-0'>
            <div className='box m-0 rounded'>
              <select
                className='text-white'
                style={{ textAlignLast: "center", width: "200px" }}
                name='accountType'
                value={data.accountType}
                onChange={(e) => data.setAccountType(e.target.value)}
                required>
                <option value='' disabled hidden>
                  Account Type
                </option>
                <option className='bg-black text-revert' value='student'>
                  Student
                </option>
                <option className='bg-black text-revert' value='teacher'>
                  Teacher
                </option>
                <option className='bg-black text-revert' value='school'>
                  School
                </option>
              </select>
              <button
                className='styledButton'
                style={{ width: "200px" }}
                data-dismiss='modal'
                onClick={hideModal}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='box blur'>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            name='name'
            placeholder='Name'
            value={data.account.name}
            onChange={handleChange}
            required
          />
          {data.accountType !== "school" ? (
            <input
              className='styledInput w-100'
              type='text'
              name='dob'
              placeholder='Date of Birth'
              onFocus={(e) => (e.currentTarget.type = "date")}
              onBlur={(e) => (e.currentTarget.type = "text")}
              value={data.account.dob}
              onChange={handleChange}
              required
            />
          ) : (
            <input
              type='text'
              name='principal'
              placeholder="Principal's Name"
              value={data.account.principal}
              onChange={handleChange}
              required
            />
          )}
          <input
            type='text'
            name='contact'
            placeholder='Phone Number'
            value={data.account.contact}
            onChange={handleChange}
            required
          />
          <input
            type='text'
            name='address'
            placeholder='Address'
            value={data.account.address}
            onChange={handleChange}
            required
          />
          <button className='styledButton'>Next</button>
        </form>
      </div>
    </div>
  );
};

export default First;
