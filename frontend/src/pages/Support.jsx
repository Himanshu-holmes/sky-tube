import React from "react";
import { useNavigate } from "react-router-dom";

const Support = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="h-screen overflow-y-auto bg-[#121212] text-white">
        <section className="relative mx-auto max-w-3xl px-4 py-20">
          <div className="mb-16 border-b pb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">Community Support Page</h2>
            <h3 className="text-gray-300">
              Welcome to our support page! We're here to help you make the most
              out of your experience on our platform. Below, you'll find useful
              information on how to use our services responsibly, guidelines for
              content uploading, and how to get assistance if you encounter any
              issues.
            </h3>
          </div>
          <div className="mb-8">
            <h2 className="mb-4 text-4xl font-bold">
              Responsible Usage Guidelines
            </h2>
            <h3 className="mb-4 text-2xl font-bold"> File Size Limitations</h3>
            <p className="mb-4 text-gray-300">
              Please be mindful of the file size limitations when uploading
              images and videos. We utilize free-tier cloud storage services
              like Cloudinary, which have certain restrictions on file sizes.
              Uploading files exceeding these limits may result in errors or
              disruptions to your experience.
            </p>
            <h3 className="mb-4 text-2xl font-bold">Testing Upload Feature</h3>
            <p className="mb-4 text-gray-300 ">
              If you'd like to test the upload feature on our platform, you can
              use the following dummy video and image links:
              <div className="mt-2 mb-2 grid gap-1 ">
                <span>
                  • Dummy Video -
                  <a
                    target="_blank"
                    href="https://file-examples.com/storage/fe7c2cbe4b65fa8179825d1/2017/04/file_example_MP4_480_1_5MG.mp4"
                    className="underline text-[#ae7aff] ml-2"
                  >
                    Dummy Video Link
                  </a>
                </span>
                <span>
                  • Dummy Thumbnail -
                  <a
                    target="_blank"
                    href="https://t4.ftcdn.net/jpg/05/31/79/83/360_F_531798391_XFz7gyPmDRTAfiEE5sRjFu5NpKrJt4rC.jpg"
                    className="underline text-[#ae7aff] ml-2"
                  >
                    Dummy Thumbnail Link
                  </a>
                </span>
                <span>
                  • Dummy Cover Image -
                  <a
                    href="https://ibb.co/QJs8S2X"
                    className="underline text-[#ae7aff] ml-2"
                    target="_blank"
                  >
                    Dummy CoverImage Link
                  </a>
                </span>
                <span>
                  • Dummy Avatar Image -
                  <a
                    href="https://ibb.co/12RFnyV"
                    className="underline text-[#ae7aff] ml-2"
                    target="_blank"
                  >
                    Dummy Avatar Link
                  </a>
                </span>

                <div className="grid mt-8">
                  <h2 className="mb-4 text-2xl font-bold">
                    Dummy Login Credentials If you'd like to explore the login
                  </h2>
                  <div>
                    Functionality on our platform, you can use the following
                    dummy credentials:
                    <div className="grid text-lg">
                      <span className="">• Username: guest </span>
                      <span className="">• Email:guest@gmail.com</span>
                      <span className="">• Password: 12345</span>
                    </div>
                    <span className="font-bold text-[#ae7aff]  mr-2">
                      Please note that these
                    </span>
                    are dummy credentials provided for testing purposes only. Do
                    not use them for any other intention, and ensure that any
                    real account credentials are kept secure and private.
                  </div>
                </div>
              </div>
              Please note that these dummy files are provided solely for testing
              purposes. Do not use them for any other intention, and ensure that
              any content uploaded to our platform complies with our usage
              guidelines and terms of service.
            </p>
            <span className="text-xl">
              • You Also Can Create A New Account{" "}
              <button
                className="underline text-[#ae7aff] ml-2"
                onClick={() => navigate("/signup")}
              >
                Singup
              </button>
            </span>
          </div>
          <div className="mb-8">
            <h3 className="mb-4 text-2xl font-bold sm:text-2xl md:text-3xl">
              Prohibited Content
            </h3>
            <p className="mb-4 text-gray-300">
              Ensure that the content you upload complies with our community
              guidelines and terms of service. Content containing explicit
              material, violence, hate speech, or any illegal activity is
              strictly prohibited and will be promptly removed.
            </p>
            <p className="mb-4 text-gray-300">
              <span className="font-bold underline text-[#ae7aff] ">
                {" "}
                Respect Copyrights :{" "}
              </span>{" "}
              Respect the intellectual property rights of others. Only upload
              content that you have the right to share. Unauthorized use of
              copyrighted material may result in legal consequences.
            </p>
          </div>
          <div className="mb-8">
            <h3 className="mb-4 text-xl font-bold sm:text-2xl md:text-3xl">
              Contact Support
            </h3>
            <p className="mb-4 text-gray-300 flex flex-col">
              <span>
                •
                <a
                  href="https://www.linkedin.com/in/satendra-singh1325/"
                  className="underline text-[#ae7aff] ml-2"
                  target="_blank"
                >
                  Linkdin
                </a>
              </span>
              <span>
                •
                <a
                  href="https://github.com/Satendra-singh-oos"
                  className="underline text-[#ae7aff] ml-2"
                  target="_blank"
                >
                  Github
                </a>
              </span>
            </p>
          </div>
        </section>
        <footer className="px-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between border-t py-2">
            <div className="mr-4 w-12 shrink-0 sm:w-16">
              <svg
                style={{ width: "100%" }}
                viewBox="0 0 63 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M47.25 47.458C55.9485 38.7595 55.9485 24.6565 47.25 15.958C38.5515 7.25952 24.4485 7.25952 15.75 15.958C7.05151 24.6565 7.05151 38.7595 15.75 47.458C24.4485 56.1565 38.5515 56.1565 47.25 47.458Z"
                  stroke="#E9FCFF"
                  stroke-width="1.38962"
                  stroke-miterlimit="10"
                ></path>
                <path
                  d="M10.5366 47.7971V17.5057C10.5366 16.9599 11.1511 16.6391 11.599 16.9495L33.4166 32.0952C33.8041 32.3639 33.8041 32.9368 33.4166 33.2076L11.599 48.3533C11.1511 48.6657 10.5366 48.3429 10.5366 47.7971Z"
                  stroke="url(#paint0_linear_53_10115)"
                  stroke-width="6.99574"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                ></path>
                <path
                  d="M18.1915 27.6963C20.1641 27.6963 21.7285 28.7066 21.7285 30.9021C21.7285 33.0976 20.1621 34.2433 18.1915 34.2433H16.8854V37.8677H14.1733V27.6984H18.1915V27.6963Z"
                  fill="#E9FCFF"
                ></path>
                <path
                  d="M25.2053 27.6963V35.4868H28.484V37.8657H22.4932V27.6963H25.2053Z"
                  fill="#E9FCFF"
                ></path>
                <path
                  d="M35.3142 27.6963L39.4553 37.8657H36.5328L35.9162 36.1763H32.1939L31.5773 37.8657H28.6548L32.7959 27.6963H35.3101H35.3142ZM34.9143 33.5663L34.2144 31.7832C34.1582 31.6395 33.954 31.6395 33.8978 31.7832L33.1979 33.5663C33.1541 33.6767 33.2354 33.7975 33.3562 33.7975H34.756C34.8747 33.7975 34.958 33.6767 34.9143 33.5663Z"
                  fill="#E9FCFF"
                ></path>
                <path
                  d="M40.9491 27.6963L42.8592 30.5188L44.7694 27.6963H48.0355L44.2132 33.2559V37.8657H41.5011V33.2559L37.6787 27.6963H40.9449H40.9491Z"
                  fill="#E9FCFF"
                ></path>
                <path
                  d="M16.894 32.1396V29.9129C16.894 29.8212 16.9982 29.7671 17.0732 29.8191L18.6771 30.9315C18.7417 30.9773 18.7417 31.0731 18.6771 31.1189L17.0732 32.2313C16.9982 32.2834 16.894 32.2313 16.894 32.1375V32.1396Z"
                  fill="#232323"
                ></path>
                <defs>
                  <linearGradient
                    id="paint0_linear_53_10115"
                    x1="2.23416"
                    y1="20.3361"
                    x2="26.863"
                    y2="44.9649"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#007EF8"></stop>
                    <stop offset="1" stop-color="#FF4A9A"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <p className="text-sm">©2024 VideoTube. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Support;
