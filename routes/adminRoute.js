import express from "express";
import {
  adminUpdateBook,
  allBooks,
  allUser,
  bookOfuser,
  deletBook,
  deletUser,
  sinlgeBook,
  verifyUser,
} from "../controllers/adminController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { check } from "express-validator";

const router = express.Router();
// ----------------admin functin towards user------------------
router.use(verifyToken);
router.get("/user", allUser);
router.put("/delete", deletUser);
router.put("/verify-user", verifyUser);

// ---------------admin function towards book---------------

router.get("/book", allBooks);
router.put("/book-delete", deletBook);
router.put(
  "/book-update",
  [
    check("book_name")
      .optional()
      .isLength({ min: 3 })
      .withMessage("length need more than 3 "),
    check("author")
      .optional()
      .isLength({ min: 3 })
      .withMessage("length need morethan 3 character"),
    check("description")
      .optional()
      .isLength({ min: 3 })
      .withMessage("length need morethan 3 character"),
    check("price")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("Price must be a number greater than 0"),
    check("category")
      .optional()
      .notEmpty()
      .withMessage("Category is required")
      .isIn(["New", "Used"])
      .withMessage("Category must be either 'New' or 'Used'"),
  ],
  adminUpdateBook
);

router.get("/single-book",sinlgeBook)
router.get("/user-books",bookOfuser)


export default router;
