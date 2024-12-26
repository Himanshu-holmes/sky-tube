import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createTweet } from "../helper/tweetapicalls";
import { creatUserTweet } from "../store/Slice/tweetSlice";
import { addComment } from "../helper/commentapicalls";
import { createACommnetSuccess } from "../store/Slice/comment.slice";
import toast from "react-hot-toast";

const TweetAndCommentInput = ({ comment, tweet, videoId }) => {
  const { handleSubmit, register, setValue } = useForm();

  const dispatch = useDispatch();

  const sendContent = (data) => {
    if (data) {
      if (tweet) {
        createTweet(data).then((data) => {
          dispatch(creatUserTweet(data));
        });
      } else if (comment) {
        addComment({ videoId, content: data.content })
          .then((data) => {
            dispatch(createACommnetSuccess(data));
            toast.success("PLZ RELOAD TO SEE COMMENT FOR NOW WIll FiX IT SOON");
          })
          .catch((err) => console.log(err));
      }

      setValue("content", "");
    }
  };

  return (
    <form className="mt-2 border pb-2" onSubmit={handleSubmit(sendContent)}>
      <textarea
        className="mb-2 h-10 w-full resize-none border-none bg-transparent px-3 pt-2 outline-none"
        placeholder={`${tweet ? "Write a tweet" : "Write A Comment"}`}
        {...register("content", { required: true })}
        rows={2}
      />
      <div className="flex items-center justify-end gap-x-3 px-3">
        <button
          className="bg-[#ae7aff] px-3 py-2 font-semibold text-black"
          type="submit"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default TweetAndCommentInput;
