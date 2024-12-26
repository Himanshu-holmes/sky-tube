import React from "react";
import { calculateTimeAgo } from "../../constants";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import toast from "react-hot-toast";
import Like from "./Like";

const TweetList = ({
  tweetId,
  avatar,
  username,
  createdAt,
  content,
  likesCount = 0,
  isLiked,
}) => {
  return (
    <div className="py-4">
      <div className="flex gap-3 border-b border-gray-700 py-4 last:border-b-transparent">
        <div className="h-14 w-14 shrink-0">
          <img
            src={avatar}
            alt={username}
            className="h-full w-full rounded-full"
          />
        </div>
        <div className="w-full">
          <h4 className="mb-1 flex items-center gap-x-2">
            <span className="font-semibold">{username}</span> 
            <span className="inline-block text-sm text-gray-400">
              {calculateTimeAgo(createdAt)}
            </span>
          </h4>
          <p className="mb-2">{content}</p>
          <div className="flex gap-4">
            <Like isLiked={isLiked} likeCount={likesCount} tweetId={tweetId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetList;
