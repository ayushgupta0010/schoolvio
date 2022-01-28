import React from "react";

const handleFileInput = (e) => {
  document.getElementById("modal-profile").classList.remove("show");
  let fileType = e.currentTarget.name;
  if (fileType === "audio") document.getElementById("audio-input").click();
  else if (fileType === "document")
    document.getElementById("document-input").click();
  else if (fileType === "image") document.getElementById("image-input").click();
  else document.getElementById("video-input").click();
};

const FileModal = () => (
  <div
    className='modal fade'
    id='modal-profile'
    tabIndex='-1'
    aria-labelledby='modal-profile'
    aria-hidden='true'>
    <div className='modal-dialog modal-dialog-centered'>
      <div className='modal-content'>
        <div className='modal-body py-0'>
          <div className='d-flex justify-content-around'>
            <button className='btn' name='audio' onClick={handleFileInput}>
              <i className='bi bi-file-music-fill h1' />
              <p>Audio</p>
            </button>
            <button className='btn' name='document' onClick={handleFileInput}>
              <i className='bi bi-file-earmark-text-fill h1' />
              <p>Document</p>
            </button>
            <button className='btn' name='image' onClick={handleFileInput}>
              <i className='bi bi-file-earmark-image-fill h1' />
              <p>Image</p>
            </button>
            <button className='btn' name='video' onClick={handleFileInput}>
              <i className='bi bi-file-earmark-play-fill h1' />
              <p>Video</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FileModal;
