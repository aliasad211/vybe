import React from 'react'
import { useState } from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { FiPlusSquare } from "react-icons/fi";
import { useRef } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import axios from "axios";
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setPostData } from '../redux/postSlice';
import { setUserData } from "../redux/userSlice";
import { setLoopData } from "../redux/loopSlice";
import { ClipLoader } from "react-spinners";

const TABS = ["post", "story", "loop"];

function Upload() {
  const [uploadType, setUploadType] = useState("post");
  const [fontendMedia, setFrontendMedia] = useState(null);
  const [backendMedia, setBackendMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [caption, setCaption] = useState("");
  const mediaInput = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { postData } = useSelector(state => state.post);
  const { userData } = useSelector(state => state.user);
  const { loopData } = useSelector(state => state.loop);
  const [loading, setLoading] = useState(false);

  const handleMedia = (e) => {
    const file = e.target.files[0]

    if (file.type.includes("image")) {
      setMediaType("image")
    } else {
      setMediaType("video")
    }

    setBackendMedia(file)
    setFrontendMedia(URL.createObjectURL(file))
  }

  const uploadPost = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("caption", caption)
      formData.append("mediaType", mediaType)
      formData.append("media", backendMedia)

      const response = await axios.post(`${serverUrl}/api/post/upload`, formData, { withCredentials: true })
      dispatch(setPostData([response.data, ...postData]));
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const uploadStory = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("mediaType", mediaType)
      formData.append("media", backendMedia)

      const response = await axios.post(`${serverUrl}/api/story/upload`, formData, { withCredentials: true })
      //storyData is the tray of people you follow — your own story lives on userData,
      //so light the ring there instead of refetching the whole user
      dispatch(setUserData({ ...userData, story: response.data }));
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const uploadLoop = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("caption", caption)
      formData.append("media", backendMedia)

      const response = await axios.post(`${serverUrl}/api/loop/upload`, formData, { withCredentials: true })
      dispatch(setLoopData([...loopData, response.data]));
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const handleUpload = () => {
    if (uploadType == "post") {
      uploadPost()
    } else if (uploadType == "story") {
      uploadStory()
    } else {
      uploadLoop()
    }
  }

  return (
    <div className='min-h-screen w-full bg-background'>

      <header className='sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl sm:px-6'>
        <button aria-label='Back'
          className='grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground'
          onClick={() => navigate("/")}>
          <IoIosArrowRoundBack className='size-6' />
        </button>
        <h1 className='font-display text-xl font-semibold text-foreground'>Create</h1>
      </header>

      <div className='mx-auto w-full max-w-[520px] px-4 py-6 sm:px-6'>

        <div className='flex items-center gap-1.5 rounded-full border border-border/70 bg-card p-1.5'>
          {TABS.map(tab =>
            <button
              key={tab}
              className={`h-9 flex-1 rounded-full text-xs font-semibold capitalize transition ${uploadType === tab
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setUploadType(tab)}
            >
              {tab}
            </button>
          )}
        </div>

        {!fontendMedia &&
          <button
            className='mt-6 flex aspect-[4/5] w-full flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-border bg-card transition hover:border-primary hover:bg-accent/40'
            onClick={() => mediaInput.current.click()}
          >
            <input type='file' accept={uploadType == "loop" ? "video/*" : ""} hidden ref={mediaInput} onChange={handleMedia} />
            <span className='grid size-12 place-items-center rounded-full bg-muted'>
              <FiPlusSquare className='size-5 text-muted-foreground' />
            </span>
            <span className='font-display text-sm font-semibold text-foreground'>Upload {uploadType}</span>
            <span className='text-[11px] text-muted-foreground'>
              {uploadType === "loop" ? "Video only" : "Image or video"}
            </span>
          </button>}

        {fontendMedia &&
          <div className='mt-6'>
            <div className='aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border/70 bg-muted'>
              {mediaType === "image"
                ? <img src={fontendMedia} className='size-full object-cover' />
                : <VideoPlayer media={fontendMedia} />}
            </div>

            {uploadType !== "story" &&
              <input
                type='text'
                className='mt-4 h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring'
                placeholder='Write a caption...'
                onChange={(e) => setCaption(e.target.value)}
                value={caption}
              />}

            <div className='mt-5 flex items-center gap-2.5'>
              <button className='h-12 flex-1 rounded-full border border-border text-sm font-semibold text-foreground transition hover:bg-accent'
                onClick={() => { setFrontendMedia(null); setBackendMedia(null); setMediaType(null); }}>
                Change
              </button>
              <button className='grid h-12 flex-1 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60'
                onClick={handleUpload} disabled={loading}>
                {loading ? <ClipLoader size={22} color='currentColor' /> : `Share ${uploadType}`}
              </button>
            </div>
          </div>}

      </div>
    </div>
  )
}

export default Upload
