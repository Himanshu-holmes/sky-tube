import React from "react";
import { Logo } from "../assets/Logo";

const NoVideoFound = ({ subs = false, playlist = false }) => {
  if (playlist === true) {
    return (
      <div className="h-screen overflow-y-auto bg-[#121212] text-white">
        <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
          <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
            <div className="flex h-full items-center justify-center">
              <div className="w-full max-w-sm text-center">
                <p className="mb-3 w-full">
                  <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                    <Logo />
                  </span>
                </p>
                <h5 className="mb-2 font-semibold">
                  No Playlist Created By You.
                </h5>
                <p>
                  There are no Playlist here available. Please Add Video And
                  Create A New Playlist. For You 🙂.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (subs === true) {
    return (
      <div className="h-screen overflow-y-auto bg-[#121212] text-white">
        <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
          <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
            <div className="flex h-full items-center justify-center">
              <div className="w-full max-w-sm text-center">
                <p className="mb-3 w-full">
                  <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                    <Logo />
                  </span>
                </p>
                <h5 className="mb-2 font-semibold">
                  No Subscribed Channel is available
                </h5>
                <p>
                  There are no Channel here available. Please try to Subscribed
                  The Channel And Then Try 🙂.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
  return (
    <div className="h-screen overflow-y-auto bg-[#121212] text-white">
      <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
        <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
          <div className="flex h-full items-center justify-center">
            <div className="w-full max-w-sm text-center">
              <p className="mb-3 w-full">
                <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                  <Logo />
                </span>
              </p>
              <h5 className="mb-2 font-semibold">No videos available</h5>
              <p>
                There are no videos here available. Please try to search some
                thing else.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NoVideoFound;
