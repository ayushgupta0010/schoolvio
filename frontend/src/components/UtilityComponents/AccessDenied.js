import React, { useEffect } from "react";

const AccessDenied = () => {
  useEffect(() => {
    document.title = "Access Denied";
  }, []);

  return (
    <div
      className='container d-flex justify-content-center flex-column align-items-center'
      style={{ height: "80vh" }}>
      <i className='bi bi-lock-fill d-block' style={{ fontSize: "30px" }} />
      <p className='styledFont2 fs-3' style={{ letterSpacing: "5px" }}>
        Access Denied
      </p>
    </div>
  );
};

export default AccessDenied;
