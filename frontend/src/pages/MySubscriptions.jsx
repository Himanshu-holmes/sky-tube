import React, { useEffect, useState } from "react";
import { NoVideoFound, SubscriberList } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { getUserChannelSubscription } from "../helper/subscriptionapicall";
import { getAllSubscribedChannelsOfUserSuccess } from "../store/Slice/subscribeSlice";

const MySubscriptions = () => {
  const subscriberId = useSelector((state) => state.auth?.userData?._id);

  const dispatch = useDispatch();

  useEffect(() => {
    if (subscriberId) {
      getUserChannelSubscription({ subscriberId })
        .then((data) => {
          dispatch(getAllSubscribedChannelsOfUserSuccess(data));
        })
        .catch((err) => console.log(err));
    }
  }, [subscriberId, dispatch]);

  const subsLists = useSelector((state) => state.subscribe?.mySubscriptions);

  if (subsLists.length === 0) {
    return <NoVideoFound subs={true} />;
  }

  return (
    <>
      <div className="h-screen overflow-y-auto bg-[#121212] text-white">
        <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
          <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
            <div className="px-4 pb-4">
              <div className="flex flex-col gap-y-4 py-4">
                {/* <div className="relative mb-2 rounded-lg bg-white py-2 pl-8 pr-3 text-black">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        stroke-linejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      ></path>
                    </svg>
                  </span>
                  <input
                    className="w-full bg-transparent outline-none"
                    placeholder="Search"
                  />
                </div> */}

                {subsLists.map((subs) => (
                  <SubscriberList
                    username={subs?.subscribedChannel?.username}
                    avatar={subs?.subscribedChannel?.avatar}
                    key={subs._id}
                    channelId={subs?.subscribedChannel?._id}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default MySubscriptions;
