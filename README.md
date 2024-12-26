# 📹 Welcome To My-Tube

MyTube is a modern web-based platform that enables content creators to share their content through various media formats, including videos and tweets effortlessly. It's built using the MERN stack and integrates Cloudinary for seamless image and video storage.MyTube ensures a smooth user experience across devices.

## 🧊 Technologies

- `Javascript`
- `Node.js`
- `Express.js`
- `MongoDb For Database`
- `Cloudinary For Storage of Media Files`
- `React.js`
- `React-Redux For State Management`
- `React-Router-Dom`

## 🚀 Features

Here's what you can do with MyTube.

- **Account Creation**: Users can easily sign up for a free account, creating their channel automatically.

- **My Content Dashboard**: Manage uploaded videos, toggle video visibility, and track channel engagement metrics.

- **Video Upload**: Seamlessly upload and update video details via the My Content page.

- **Video Interaction**: Like videos and easily access all liked videos on the Liked Videos page.

- **Subscription Management**: Subscribe or unsubscribe to channels and view a compact list of subscribed channels on the My Subscriptions page.

- **Playlist Creation**: Curate a series of videos into personalized playlists for easy sharing and viewing.

- **Viewing History**: Access a comprehensive list of watched videos in the Watch History page.

- **Tweeting**: Share thoughts and updates with your audience and the world via the dedicated Tweets section.

- **Account Settings**: Customize profile settings, including password changes, avatar updates, channelBaneer Update, and personal information adjustments.

## 📝 What I Learned

During this project, I've improved my skills and gained a better understanding of complex project architecture. I've learned how to tackle big problems by breaking them down into smaller, more manageable tasks.

## 🐞 BUG

- Some State Related Issue

<details>
<summary>Click to expand</summary>

#### Description

After posting a tweet or comment, the data fetched from the backend is not displaying correctly due to state management issues:

- Comments are displaying "NAN" instead of the expected data, despite receiving valid data from the backend.
- Tweets fail to update the associated image in the UI, even though the Redux state is updated correctly. However, upon reloading the page, the data appears as expected.

#### Steps to Reproduce

1. Log in to the MyTube platform.
2. Navigate to the tweet or comment section.
3. Post a new tweet or comment.
4. Observe the displayed data for the posted tweet or comment.

#### Expected Behavior

After posting a tweet or comment, the displayed data should accurately reflect the content posted, including any associated images, without requiring a page reload.

#### Actual Behavior

- Comments display "NAN" instead of the expected data, indicating a state management issue.
- Tweets fail to update the associated image in the UI, suggesting a disconnect between the Redux state and the UI rendering. However, the data appears correctly after reloading the page.

#### Additional Information

- This issue was observed on both desktop and mobile devices.
- No error messages are displayed to indicate the problem.
- Redux DevTools show that the state is updated correctly after posting a tweet or comment.

</details>

---

# 🚧 Improvements

- **Add features to frontend**:

  1. **Delete & Edit in Tweet And Comment**: Allow users to delete or edit their tweets and comments after posting.
  2. **Like And Dislike in Tweet And Comment**: Enable users to like or dislike tweets and comments to express their opinions.
  3. **Delete The Playlist**: Provide an option for users to delete their created playlists.

  **[Last-Update->The Backend API is completed for the above mentioned features, left with frontend implementation part]**

  4. **Add Image Attachment Option in the tweet section**: Allow users to attach images to their tweets, enhancing the visual appeal and expressiveness of their posts.

  5. **Nested Comment Section**: Implement a nested comment section to facilitate deeper discussions and interactions between users within the comment section. This feature will allow users to reply to specific comments, promoting engagement and community building.

# 🏃Running the Project

1. Clone the repository to your local machine.

2. Run `npm install` or `yarn` in the project directory to install the required dependencies.

3. **Set up environment variables**:

- Create a `.env` file in both the frontend and backend folders.
- Add the required environment variables with your credentials, referencing the `.env.sample` file.

4. **Start the backend server**:

- `cd backend` -` npm run dev`

5. **Start the frontend development server**:

- `cd frontend` -` npm run dev`

6. Open [http://localhost:5173](http://localhost:5173) (or the address shown in your console) in your web browser to view the app.

## Special Thanks

- A special thank you to [HiteshSir](https://www.youtube.com/@@HiteshChoudharydotcom) for providing the initial idea and valuable insights that inspired this project.

- I would like to express my gratitude to the [devUi Team](https://www.devui.io/) for their exceptional UI resources, which significantly enhanced the user experience of this project.
