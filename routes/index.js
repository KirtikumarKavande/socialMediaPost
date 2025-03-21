const { Router } =require("express");
const v1Routes =require("./v1");

const apiRoutes = Router();
apiRoutes.use("/v1", v1Routes);

module.exports= apiRoutes;
