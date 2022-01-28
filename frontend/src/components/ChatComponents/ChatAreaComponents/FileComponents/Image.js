import React from "react";

const Image = ({ files }) => (
  <div className='message-gallery'>
    <div className='row gx-3'>
      {files.map((file, i) => (
        <div className='col' key={i}>
          <img className='img-fluid rounded' src={file.url} alt='user' />
        </div>
      ))}
    </div>
  </div>
);

export default Image;
