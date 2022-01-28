import React from "react";
import {
  UNVERIFY_STUDENT_MUTATION,
  UNVERIFY_TEACHER_MUTATION,
} from "../../../utils/mutation";
import client from "../../../utils/apollo";

const Modal = ({ username, role, cleanForm }) => {
  const handleRemoval = () => {
    let mutation =
      role === "STUDENT"
        ? UNVERIFY_STUDENT_MUTATION
        : UNVERIFY_TEACHER_MUTATION;

    client
      .mutate({ mutation, variables: { username } })
      .then((res) => {
        document.getElementById("removeModal").classList.remove("show");
        document
          .getElementsByClassName("modal-backdrop")[0]
          .classList.remove("modal-backdrop");
        cleanForm();
      })
      .catch((err) => err);
  };

  return (
    <div
      className='modal fade'
      id='removeModal'
      tabIndex='-1'
      role='dialog'
      aria-labelledby='removeModalTitle'
      aria-hidden='true'>
      <div className='modal-dialog modal-dialog-centered' role='document'>
        <div className='modal-content bg-black'>
          <div className='modal-header'>
            <h5 className='modal-title text-danger '>Remove User</h5>
            <button
              className='btn-close bg-dark text-light'
              data-bs-dismiss='modal'
              aria-label='Close'
            />
          </div>
          <div className='modal-body'>
            <p className='text-danger m-0'>
              <strong className='text-danger h4'>Warning! </strong> This action
              can't be undone and will remove the user from the school. Proceed
              carefully.
            </p>
          </div>
          <div className='modal-footer border-0 py-0'>
            <button className='btn btn-danger' onClick={handleRemoval}>
              Remove
            </button>
            <button className='btn btn-secondary' data-bs-dismiss='modal'>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
