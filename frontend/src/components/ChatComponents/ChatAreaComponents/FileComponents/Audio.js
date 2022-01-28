import React from "react";

const Audio = ({ files }) =>
  files.map((file, i) => <audio src={file.url} controls key={i} />);

export default Audio;
