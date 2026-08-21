import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowLeft, FiImage, FiVideo, FiX } from "react-icons/fi";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import VideoPlayer from '../components/VideoPlayer';
import Avatar from '../components/Avatar';
import { serverUrl } from '../App';
import { setPostData } from '../redux/postSlice';
import { setUserData } from "../redux/userSlice";
import { setLoopData } from "../redux/loopSlice";

const TABS = [
  { key: "post", label: "Post", hint: "A photo or a video for your feed" },
  { key: "story", label: "Story", hint: "Disappears after 24 hours" },
  { key: "loop", label: "Loop", hint: "Short video only" },
];

function Upload() {
  const [uploadType, setUploadType] = useState("post");
  const [frontendMedia, setFrontendMedia] = useState(null);
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

  const active = TABS.find(tab => tab.key === uploadType);

  const handleMedia = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setMediaType(file.type.includes("image") ? "image" : "video")
    setBackendMedia(file)
    setFrontendMedia(URL.createObjectURL(file))
  }

  const clearMedia = () => {
    setFrontendMedia(null)
    setBackendMedia(null)
    setMediaType(null)
  }

  const uploadPost = async () => {
    const formData = new FormData();
    formData.append("caption", caption)
    formData.append("mediaType", mediaType)
    formData.append("media", backendMedia)
    const response = await axios.post(`${serverUrl}/api/post/upload`, formData, { withCredentials: true })
    dispatch(setPostData([response.data, ...postData]));
  }

  const uploadStory = async () => {
    const formData = new FormData();
    formData.append("mediaType", mediaType)
    formData.append("media", backendMedia)
    const response = await axios.post(`${serverUrl}/api/story/upload`, formData, { withCredentials: true })
    //storyData is the tray of people you follow — your own story lives on userData,
    //so light the ring there instead of refetching the whole user
    dispatch(setUserData({ ...userData, story: response.data }));
  }

  const uploadLoop = async () => {
    const formData = new FormData();
    formData.append("caption", caption)
    formData.append("media", backendMedia)
    const response = await axios.post(`${serverUrl}/api/loop/upload`, formData, { withCredentials: true })
    dispatch(setLoopData([...loopData, response.data]));
  }

  const handleUpload = async () => {
    if (!backendMedia) return
    setLoading(true);
    try {
      if (uploadType === "post") await uploadPost()
      else if (uploadType === "story") await uploadStory()
      else await uploadLoop()
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-svh bg-background'>

      <header className='sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8'>
        <button
          aria-label='Back to home'
          className='grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground'
          onClick={() => navigate("/")}
        >
          <FiArrowLeft className='size-4' />
        </button>
        <div>
          <p className='eyebrow mb-1'>New</p>
          <h1 className='font-display text-lg font-semibold tracking-tight text-foreground'>Create</h1>
        </div>
      </header>

      <main className='mx-auto w-full max-w-lg px-4 py-7 sm:px-6'>
        <div className='rounded-lg border border-border bg-card p-5 shadow-[0_20px_60px_-45px_var(--shadow-color)] sm:p-6'>

          <div className='mb-5'>
            <p className='eyebrow mb-1'>New {active.label.toLowerCase()}</p>
            <h2 className='font-display text-xl font-semibold text-foreground'>What&rsquo;s on your mind?</h2>
          </div>

          <div className='mb-5 flex gap-1 rounded-full bg-muted p-1'>
            {TABS.map(tab =>
              <button
                key={tab.key}
                type='button'
                onClick={() => setUploadType(tab.key)}
                className={`flex-1 rounded-full py-2 text-xs font-semibold transition ${uploadType === tab.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"}`}
              >
                {tab.label}
              </button>
            )}
          </div>

          {uploadType !== "story" &&
            <div className='flex items-start gap-3'>
              <Avatar user={userData} size='size-10' />
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder='Share a thought, a moment, a little beauty...'
                className='min-h-24 flex-1 resize-none bg-transparent pt-1 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground'
              />
            </div>}

          {!frontendMedia
            ? <button
              type='button'
              className='mt-4 flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface transition hover:border-primary hover:bg-accent/40'
              onClick={() => mediaInput.current.click()}
            >
              <input
                type='file'
                accept={uploadType === "loop" ? "video/*" : "image/*,video/*"}
                hidden
                ref={mediaInput}
                onChange={handleMedia}
              />
              <span className='grid size-11 place-items-center rounded-full bg-muted'>
                {uploadType === "loop"
                  ? <FiVideo className='size-5 text-muted-foreground' />
                  : <FiImage className='size-5 text-muted-foreground' />}
              </span>
              <span className='font-display text-sm font-semibold text-foreground'>Add {uploadType === "loop" ? "a video" : "media"}</span>
              <span className='text-[11px] text-muted-foreground'>{active.hint}</span>
            </button>
            : <div className='relative mt-4 overflow-hidden rounded-xl border border-border/70 bg-muted'>
              <button
                aria-label='Remove media'
                className='absolute right-2 top-2 z-10 grid size-8 place-items-center rounded-full bg-foreground/45 text-background backdrop-blur transition hover:bg-foreground/60'
                onClick={clearMedia}
              >
                <FiX className='size-4' />
              </button>
              <div className='aspect-square w-full'>
                {mediaType === "image"
                  ? <img src={frontendMedia} className='size-full object-cover' />
                  : <VideoPlayer media={frontendMedia} />}
              </div>
            </div>}

          <div className='mt-5 flex items-center justify-between border-t border-border/70 pt-4'>
            <div className='flex gap-1'>
              <button
                aria-label='Add image'
                className='grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground disabled:opacity-40'
                onClick={() => mediaInput.current?.click()}
                disabled={uploadType === "loop"}
              >
                <FiImage className='size-4' />
              </button>
              <button
                aria-label='Add video'
                className='grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground'
                onClick={() => mediaInput.current?.click()}
              >
                <FiVideo className='size-4' />
              </button>
            </div>

            <div className='flex gap-2'>
              <button
                className='h-9 rounded-full px-4 text-xs font-semibold text-muted-foreground transition hover:bg-accent hover:text-foreground'
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
              <button
                className='grid h-9 min-w-24 place-items-center rounded-full bg-primary px-5 text-xs font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-40'
                onClick={handleUpload}
                disabled={loading || !backendMedia}
              >
                {loading ? <ClipLoader size={16} color='currentColor' /> : `Share ${active.label.toLowerCase()}`}
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default Upload
