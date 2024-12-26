import React, { useState } from "react";
import { togglePublishStatus } from "../helper/videoapicalls";
import { useDispatch } from "react-redux";
import { togglePublishedSuccess } from "../store/Slice/video.slice";

const TogglePublish = ({ videoId, isPublished }) => {
  const [isChecked, setIsChecked] = useState(isPublished);
  const dispatch = useDispatch();

  const handleTogglePublishStatus = async (e) => {
    e.preventDefault();

    await togglePublishStatus({ videoId })
      .then((data) => {
        dispatch(togglePublishedSuccess(data.isPublished));
        setIsChecked((prev) => !prev);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <label className="relative inline-block w-12 cursor-pointer overflow-hidden">
        <input
          type="checkbox"
          value=""
          className="peer sr-only"
          checked={isChecked}
          onChange={handleTogglePublishStatus}
        />
        <span className="inline-block h-6 w-full rounded-2xl bg-gray-200 duration-200 after:absolute after:bottom-1 after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-black after:duration-200 peer-checked:bg-[#ae7aff] peer-checked:after:left-7"></span>
      </label>
    </>
  );
};

export default TogglePublish;
