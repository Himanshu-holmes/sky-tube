import React, { useEffect, useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../helper/likeapicalls";
import toast from "react-hot-toast";

const Like = ({ isLiked, videoId, tweetId, commentId, likeCount = 0 }) => {
  const [liked, setLiked] = useState(isLiked);
  const [totalLike, setTotalLike] = useState(likeCount);

  const handleToggleLike = (e) => {
    e.preventDefault();

    if (liked) {
      setTotalLike((prev) => prev - 1);
    } else {
      setTotalLike((prev) => prev + 1);
    }

    setLiked((prev) => !prev);

    if (videoId) {
      toggleVideoLike({ videoId });
    }
    if (tweetId) {
      toggleTweetLike({ tweetId });
    }
    if (commentId) {
      toggleCommentLike({ commentId });
    }
  };

  useEffect(() => {
    setLiked(isLiked);
    setTotalLike(likeCount);
  }, [isLiked, totalLike]);

  const handleDislike = () => {
    toast.success("Dislike The Tweet 😞");
  };

  return (
    <div className="flex overflow-hidden rounded-lg border">
      <button
        className="group/btn flex items-center gap-x-2 border-r border-gray-700 px-4 py-1.5 after:content-[attr(data-like)] hover:bg-white/10 focus:after:content-[attr(data-like-alt)]"
        data-like={likeCount}
        onClick={handleToggleLike}
      >
        <ThumbsUp height={20} width={20} />
      </button>
      <button
        className="group/btn flex items-center gap-x-2 px-4 py-1.5 after:content-[attr(data-like)] hover:bg-white/10 focus:after:content-[attr(data-like-alt)]"
        data-like=""
        data-like-alt=""
        onClick={handleDislike}
      >
        <span className="inline-block w-5 group-focus/btn:text-[#ae7aff]">
          <ThumbsDown height={20} width={20} />
        </span>
      </button>
    </div>
  );
};

export default Like;
