import User from "../models/user.model.js";
import Story from "../models/story.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const uploadStory = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ message: "user not found" })
    }
    if (user.story) {
      await Story.findByIdAndDelete(user.story)
      user.story = null;
    }
    const { mediaType } = req.body;
    let media;
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "media is required" })
    }

    const story = await Story.create({
      author: req.userId, mediaType, media
    })
    user.story = story._id
    await user.save()
    const populatedStory = await Story.findById(story._id)
      .populate("author", "name  userName profileImage")
      .populate("viewers", "name userName profileImage")

    return res.status(200).json(populatedStory)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "upload story error" })
  }
}

export const viewStory = async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const story = await Story.findById(storyId)

    if (!story) {
      return res.status(400).json({ message: "story not found" })
    }

    const viewersIds = story.viewers.map(id => id.toString())

    if (!viewersIds.includes(req.userId.toString())) {
      story.viewers.push(req.userId)
      await story.save()
    }

    const populatedStory = await Story.findById(story._id)
      .populate("author", "name  userName profileImage")
      .populate("viewers", "name userName profileImage")

    return res.status(200).json(populatedStory)
  } catch (error) {
    return res.status(500).json({ message: "story view error" })
  }
}

export const getStoryByUserName = async (req, res) => {
  try {
    const userName = req.params.userName
    const user = await User.findOne({ userName })

    if (!user) {
      return res.status(400).json({ message: "user not found" })
    }

    const story = await Story.find({
      author: user._id
    })
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage")
      .sort({ createdAt: -1 })

    return res.status(200).json(story)
  } catch (error) {
    return res.status(500).json({ message: "story get by username error" })
  }
}

//the story tray on the feed — everyone the current user follows who still has a
//live story. expired ones are gone from the collection already (24h TTL), so no
//date filtering is needed here
export const getAllStories = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId)

    if (!currentUser) {
      return res.status(400).json({ message: "user not found" })
    }

    const stories = await Story.find({
      author: { $in: currentUser.following }
    })
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage")
      .sort({ createdAt: -1 })

    return res.status(200).json(stories)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "get all stories error" })
  }
}