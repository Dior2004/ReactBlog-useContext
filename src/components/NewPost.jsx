import React from "react";
import { FiPlus } from "react-icons/fi";

const NewPost = ({
  postTitle,
  setPostTitle,
  postBody,
  setPostBody,
  handleSubmit,
}) => {
  return (
    <main className="NewPost">
      <div className="wrap">
        <h2>Create New Posts</h2>
        <form
          autoComplete="off"
          className="cr_new_post"
          onSubmit={handleSubmit}
        >
          <label htmlFor="postTitle">Post Title:</label>
          <input
            id="postTitle"
            type="text"
            autoFocus
            required
            placeholder="Give it a Title"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value.trimStart())}
          />
          <label htmlFor="postBody">Post Content:</label>
          <textarea
            id="postBody"
            placeholder="Compose a Post (at least 3 letters)"
            required
            value={postBody}
            onChange={(e) => setPostBody(e.target.value.trimStart())}
          ></textarea>

          <button
            className={
              postTitle.length && postBody.length >= 3
                ? "create_post_button_okey"
                : "create_post_button"
            }
            type="submit"
          >
            <FiPlus style={{ marginBottom: -1.5 }} /> Create
          </button>
        </form>
      </div>
    </main>
  );
};

export default NewPost;
