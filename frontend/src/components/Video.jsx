import React from "react";

const Video = ({ videoUrl, thumbnail }) => {
  return (
    <>
      <video
        src={videoUrl}
        poster={thumbnail}
        autoPlay
        controls
        playsInline
        className="h-full w-full"
      />
    </>
  );
};

export default Video;
