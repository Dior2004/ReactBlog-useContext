import { React, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import Loader from "./Loader";

const EditPost = ({
  editTitle,
  setEditTitle,
  editBody,
  setEditBody,
  posts,
  handleEdit,
  handleDelete,
  handleCancel,
  loader,
}) => {
  const { id } = useParams();
  const postArr = posts.find((post) => post.id.toString() === id);

  useEffect(() => {
    if (postArr) {
      setEditTitle(postArr.title);
      setEditBody(postArr.body);
    }
  }, [postArr, setEditBody, setEditTitle]);

  return (
    <main className="EditPost">
      {loader ? (
        <div className="wrap">
          {postArr && (
            <form onSubmit={(e) => e.preventDefault()}>
              <textarea
                className="edit_title"
                required
                placeholder="Should have a title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              ></textarea>
              <textarea
                autoFocus
                className="edit_body"
                required
                placeholder="Post should be at least 3 letters"
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
              >
                {}
              </textarea>
              <div className="btns">
                <button
                  type="submit"
                  className={
                    editBody.length >= 3 &&
                    editTitle.length &&
                    (postArr.title !== editTitle.trimEnd() ||
                      postArr.body !== editBody.trimEnd())
                      ? "edit_post_button"
                      : "edit_button_not_ok"
                  }
                  onClick={() => handleEdit(postArr.id)}
                >
                  <FiEdit3 style={{ marginBottom: -1.5 }} /> Edit
                </button>
                <button
                  type="button"
                  className="cancel_post_button"
                  onClick={() => handleCancel(postArr.id)}
                >
                  <MdOutlineCancel style={{ marginBottom: -1.5 }} /> Cancel
                </button>
                <button
                  type="button"
                  className="delete_post_button"
                  onClick={() => handleDelete(postArr.id)}
                >
                  <FiTrash2 style={{ marginBottom: -1.5 }} /> Delete
                </button>
              </div>
            </form>
          )}
          {!postArr && (
            <>
              <h2>Post isn't found</h2>
              <p className="post_body">We feel sorry 😞</p>
              <p>
                Visit our{" "}
                <Link to="/">
                  <b style={{ color: "dodgerblue" }}>Home Page.</b>
                </Link>
              </p>
            </>
          )}
        </div>
      ) : (
        <Loader />
      )}
    </main>
  );
};

export default EditPost;
