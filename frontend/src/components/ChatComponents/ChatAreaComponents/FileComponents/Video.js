import React from "react";

const Video = ({ files }) =>
  files.map((file, i) => (
    <video src={file.url} width='320' height='240' controls key={i} />
  ));

export default Video;
