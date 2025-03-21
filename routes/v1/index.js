const { Router } = require("express");
const postRoutes = require("./posts/posts.route");


const v1Routes = Router();
v1Routes.use("/posts", postRoutes);

module.exports= v1Routes;
