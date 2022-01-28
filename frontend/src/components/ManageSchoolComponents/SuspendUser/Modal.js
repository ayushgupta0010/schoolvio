import React from "react";
import { UPDATE_USER_DETAIL_MUTATION } from "../../../utils/mutation";
import client from "../../../utils/apollo";

const Modal = ({ data }) => {
  const handleSuspendUser = (e) => {
    e.preventDefault();
    client
      .mutate({
        mutation: UPDATE_USER_DETAIL_MUTATION,
        variables: {
          username: data.username,
          isSuspended: true,
          reason: data.reason,
        },
      })
      .then((res) => {
        document.getElementById("suspendModal").classList.remove("show");
        document
          .getElementsByClassName("modal-backdrop")[0]
          .classList.remove("modal-backdrop");
        data.cleanForm();
      })
      .catch((err) => err);
  };

  return (
    <div
      className='modal fade'
      id='suspendModal'
      tabIndex='-1'
      role='dialog'
      aria-labelledby='suspendModalTitle'
      aria-hidden='true'>
      <div className='modal-dialog modal-dialog-centered' role='document'>
        <div className='modal-content bg-black'>
          <div className='modal-header'>
            <h5 className='modal-title text-danger styledFont'>Suspend User</h5>
            <button
              className='btn-close bg-dark text-light'
              data-bs-dismiss='modal'
              aria-label='Close'
            />
          </div>
          <form onSubmit={handleSuspendUser}>
            <div className='modal-body pb-0'>
              <div className='form-floating mb-3'>
                <textarea
                  className='form-control bg-transparent text-revert border-secondary'
                  style={{ height: "100px" }}
                  id='floatingTextarea'
                  value={data.reason}
                  onChange={(e) => data.setReason(e.target.value)}
                  required
                />
                <label
                  htmlFor='floatingTextarea'
                  className='text-danger fw-bolder'>
                  Reason for suspension
                </label>
              </div>
            </div>
            <div className='modal-footer border-0 pt-0'>
              <button className='btn btn-danger' type='submit'>
                Suspend
              </button>
              <button
                className='btn btn-secondary'
                type='button'
                data-bs-dismiss='modal'>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
