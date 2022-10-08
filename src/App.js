import "./css/App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import Header from "./components/Header";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./components/Home";
import NewPost from "./components/NewPost";
import PostPage from "./components/PostPage";
import EditPost from "./components/EditPost";
import About from "./components/About";
import Missing from "./components/Missing";
import apiPosts from "./api/posts";
import useWindowSize from "./hooks/useWindowSize"; // importing the custom hook from hooks folder

function App() {
  const [posts, setPosts] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // axios is used like crud we use the same word such as .get
        const response = await apiPosts.get("/posts"); // posts is the name given to an array in our db.json
        //  we don't need to check for status errors like if(!responce.ok) {}. It automatically does that for us, and no need to JSON
        const reverseData = response.data;
        setPosts(reverseData); // we just need to what to get from that response
        // console.log(response); // result is like {data: [], status: num, statusText: string, config: {...}, ...}
        setLoader(true);
      } catch (error) {
        setFetchError(`Erroe: ${error.message}`);
      }
    };
    fetchPosts();
  }, []);

  const [title, setTitle] = useState("Home");

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const navigateBack = useNavigate(); // function from react-router-dom

  // const useWindowSizeObj = useWindowSize();  // this is a function like we have created in earlier in the hooks directory
  // console.log(useWindowSizeObj); // is an object with width and heigth propertirs like {width: undefined, height: undefined}
  // we can select a specific element following like this ...

  const { width } = useWindowSize(); // result is going to be width value that is changing accordingly

  // search function

  useEffect(() => {
    const filteredSearchResults = posts.filter(
      (post) =>
        post.body.toLowerCase().includes(search.toLowerCase()) ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.datetime.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(filteredSearchResults.reverse());
  }, [posts, search]);

  // CRUD with axios

  //  create post function

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (postBody.length < 3) return;

    // window.location.reload(true);

    const newPostId = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), `MMMM dd, yyyy pp`);
    const newPost = {
      id: newPostId,
      title: postTitle
        .split(" ")
        .filter((e) => e !== "")
        .join(" "),
      body: postBody
        .split(" ")
        .filter((e) => e !== "")
        .join(" "),
      datetime: datetime,
    };
    try {
      // axios CRUD => CR == "POST"
      const response = await apiPosts.post("/posts", newPost);
      const newAllPosts = [...posts, response.data];
      setPosts(newAllPosts);
      setPostTitle("");
      setPostBody("");
      navigateBack("/");
    } catch (error) {
      setFetchError(`Erroe: ${error.message}`);
      navigateBack("/");
    }
  };

  // edit axios CRUD => U == "PATCH" but we use "PUT" instead bcoz we are replaceing the whole array

  const handleEdit = async (id) => {
    if (editBody.length < 3 || editTitle.length < 1) return;

    const datetime = format(new Date(), `MMMM dd, yyyy pp`);
    const updatedPost = {
      id: id,
      title: editTitle
        .split(" ")
        .filter((e) => e !== "")
        .join(" "),
      body: editBody
        .split(" ")
        .filter((e) => e !== "")
        .join(" "),
      datetime: datetime,
    };

    try {
      const oldPost = posts.filter((e) => e.id === id);
      if (
        oldPost[0].title.trimEnd() === editTitle.trimEnd() &&
        oldPost[0].body.trimEnd() === editBody.trimEnd()
      )
        return;

      const response = await apiPosts.put(`/posts/${id}`, updatedPost);
      setPosts(
        posts.map((post) => (post.id === id ? { ...response.data } : post))
      ); // mapping through our old array we check if id of our edited post is equal to id we clicked (which comes from our old posts Array). if true we replace that obj with our new updated obj else return olt obj itself
      // plus it automatically creates a new array instead of we creating by ourselves like [...posts, newSmth] then setState(that array)
      setEditTitle("");
      setEditBody("");
      navigateBack("/");
    } catch (error) {
      setFetchError(`Erroe: ${error.message}`);
      navigateBack("/");
    }
  };

  // delete axios CRUD => D == "DELETE"

  const handleDelete = async (id) => {
    try {
      await apiPosts.delete(`/posts/${id}`);
      const postLists = posts.filter((post) => post.id !== id);
      setPosts(postLists);
      navigateBack("/");
      // console.log(navigateBack);
    } catch (error) {
      setFetchError(`Erroe: ${error.message}`);
      navigateBack("/");
    }
  };

  const handleCancel = (id) => {
    setEditTitle("");
    setEditBody("");
    navigateBack(`/postpage/${id}`);
  };

  return (
    <div className="App">
      <Header title={title} width={width} />
      <Nav
        navigateBack={navigateBack}
        setTitle={setTitle}
        search={search}
        setSearch={setSearch}
      />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Home
              searchResults={searchResults}
              search={search}
              fetchError={fetchError}
              loader={loader}
            />
          }
        />
        <Route
          path="/post"
          element={
            <NewPost
              postTitle={postTitle}
              setPostTitle={setPostTitle}
              postBody={postBody}
              setPostBody={setPostBody}
              handleSubmit={handleSubmit}
            />
          }
        />
        <Route
          path="/postpage/:id"
          element={
            <PostPage
              loader={loader}
              posts={posts}
              handleDelete={handleDelete}
            />
          }
        />
        <Route
          path="/postedit/:id"
          element={
            <EditPost
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              editBody={editBody}
              setEditBody={setEditBody}
              loader={loader}
              posts={posts}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleCancel={handleCancel}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
