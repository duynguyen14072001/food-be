import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/home", homeController.getHomePage);
  router.get("/", homeController.getHomePage);
  router.get("/about", homeController.getAboutPage);
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.displayGetCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  router.post("/api/login", userController.handleLogin);
  router.post("/api/register", userController.handleRegister);

  router.post("/api/create-food", userController.createFood);
  router.get("/api/get-food", userController.getFoods);
  router.delete("/api/delete-food", userController.deleteFood);
  router.put("/api/update-food", userController.updateFood);

  return app.use("/", router);
};

module.exports = initWebRoutes;
