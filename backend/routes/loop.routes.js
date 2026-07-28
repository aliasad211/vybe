import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { comment, getAllLoops, like,uploadLoop} from "../controllers/loop.controllers.js";

const loopRouter = express.Router();

loopRouter.post("/upload",isAuth,upload.single("media"),uploadLoop);
loopRouter.get("/like/:loopId",isAuth,like);
loopRouter.get("/comment",isAuth,comment);
loopRouter.get("/getAll",isAuth,getAllLoops);

export default loopRouter;