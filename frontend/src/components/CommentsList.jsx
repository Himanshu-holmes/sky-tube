import React from "react";
import { useSelector } from "react-redux";
import { calculateTimeAgo } from "../../constants";
import TweetAndCommentInput from "./TweetAndCommentInput";
import { useNavigate } from "react-router-dom";

const CommentsList = ({ videoId }) => {
  const comments = useSelector((state) => state.comment?.comments);
  const totalComments = useSelector((state) => state.comment?.totalComments);
  const hasNextPage = useSelector((state) => state.comment?.hasNextPage);
  const navigate = useNavigate();
  return (
    <div className="fixed inset-x-0 top-full z-[60] h-[calc(100%-69px)] overflow-auto rounded-lg border bg-[#121212] p-4 duration-200 hover:top-[67px] peer-focus:top-[67px] sm:static sm:h-auto sm:max-h-[500px] lg:max-h-none">
      <div className="block">
        <h6 className="mb-4 font-semibold">{totalComments} Comments</h6>
        {/* <input
          type="text"
          className="w-full rounded-lg border bg-transparent px-2 py-1 placeholder-white"
          placeholder="Add a Comment"
        /> */}

        <TweetAndCommentInput comment={true} videoId={videoId} />
      </div>
      <hr className="my-4 border-white" />
      <div>
        {comments && comments.length > 0 ? (
          comments?.map((comment) => (
            <>
              <div className="flex gap-x-4" key={comment._id}>
                <div
                  className="mt-2 h-11 w-11 shrink-0"
                  onClick={() =>
                    navigate(`/channel/${comment?.owner?.username}`)
                  }
                >
                  <img
                    src={comment?.owner?.avatar}
                    alt="sarahjv"
                    className="h-full w-full rounded-full"
                  />
                </div>
                <div className="block">
                  <p className="flex items-center text-gray-200">
                    <span className="text-sm">
                      {calculateTimeAgo(comment?.createdAt)}
                    </span>
                  </p>
                  <p className="text-sm text-gray-200">
                    @{comment?.owner?.username}
                  </p>
                  <p className="mt-3 text-sm">{comment?.content}</p>
                </div>
              </div>
              <hr className="my-4 border-white" />
            </>
          ))
        ) : (
          <span>No Comment's Found Be The First To Add Comment 😃</span>
        )}
      </div>
    </div>
  );
};

export default CommentsList;
