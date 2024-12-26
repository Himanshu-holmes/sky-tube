import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserTweets } from "../../helper/tweetapicalls";
import { getUserTweetSuccess } from "../../store/Slice/tweetSlice";
import { TweetAndCommentInput, TweetList } from "../../components";

const ChannelTweets = () => {
  const dispatch = useDispatch();
  const authId = useSelector((state) => state?.auth?.userData?._id);
  const userId = useSelector((state) => state?.user?.profileData?._id);

  // TODO:EDIT TWEET AND DELTE TWEET

  useEffect(() => {
    if (userId) {
      getUserTweets({ userId })
        .then((data) => {
          dispatch(getUserTweetSuccess(data));
        })
        .catch((err) => console.log(err));
    }
  }, [userId, authId, dispatch]);

  const tweets = useSelector((state) => state.tweet?.tweets);

  return (
    <div>
      <div className="px-4 pb-4">
        {authId === userId && <TweetAndCommentInput tweet={true} />}
        {tweets?.map((tweet) => (
          <TweetList
            key={tweet?._id}
            avatar={tweet?.ownerDetails?.avatar}
            content={tweet?.content}
            createdAt={tweet?.createdAt}
            likesCount={tweet?.likesCount}
            tweetId={tweet?._id}
            username={tweet?.ownerDetails?.username}
            isLiked={tweet?.isLiked}
          />
        ))}
      </div>
    </div>
  );
};

export default ChannelTweets;
