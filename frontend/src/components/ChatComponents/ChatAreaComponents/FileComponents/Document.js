import React from "react";
import { Link } from "react-router-dom";
import { downloadFile } from "../../../../utils/fileManager";

const Document = ({ files }) =>
  files.map((file, i) => (
    <div className='message-text' key={i}>
      <div className='row align-items-center gx-4'>
        <div className='col-auto'>
          <Link
            to='#'
            className='avatar avatar-sm'
            onClick={() => downloadFile(file.url)}>
            <div className='avatar-text bg-white text-primary'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='feather feather-arrow-down'>
                <line x1='12' y1='5' x2='12' y2='19' />
                <polyline points='19 12 12 19 5 12' />
              </svg>
            </div>
          </Link>
        </div>
        <div className='col overflow-hidden'>
          <h6 className='text-truncate text-reset'>
            <p className='text-reset'>{file.name}</p>
          </h6>
        </div>
      </div>
    </div>
  ));

export default Document;
