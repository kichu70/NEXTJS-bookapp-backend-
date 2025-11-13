import express from "express"
import { AddUser, login, UpdateUser } from "../controllers/userController.js";
import { check } from "express-validator";
import { verifyToken } from "../middlewares/verifyToken.js";


const router =express.Router();

router.post("/add-user",
     [
    check("name")
    .notEmpty()
    .withMessage("username must Required")
    .isLength({ min: 3 })
    .withMessage("name must contain at least 3 charecters"),
    check("password")
    .notEmpty()
    .withMessage("Password is Reqierd")
    .isLength({ min: 8 })
    .withMessage("must contain atleast 8 charecter"),
    check("email")
    .isEmail()
    .withMessage("Invalid email format")
    .notEmpty()
    .withMessage("Email required")
  ],AddUser)



router.post("/login",[
  check("email")
  .notEmpty().withMessage("Email requiered")
  .isEmail()
  .withMessage("Invalid email format"),
  check("password")
  .notEmpty()
  .withMessage("Password is Reqierd")
  .isLength({ min: 8 })
  .withMessage("must contain atleast 8 charecter"),
],login)



router.use(verifyToken);
router.put("/update",UpdateUser)


export default router;