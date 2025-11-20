import dotenv from 'dotenv';
dotenv.config()

import express from "express"
import { AddBook, addrating, allBooks, deleteBook, getTopest, newBooks, oldBooks, sinlgeBook, updateBook } from '../controllers/booksController.js';
import { upload } from '../middlewares/multerFileUploads.js';
import { check } from 'express-validator';
import { verifyToken } from '../middlewares/verifyToken.js';




const router =express.Router();
router.get("/",allBooks)
router.get("/used-book",oldBooks)
router.get("/new-book",newBooks)

router.use(verifyToken)
router.post("/add-book",
    upload.array("image",10)
    ,
    [
    check("book_name")
        .notEmpty().withMessage("Name Requierd")
        .isLength({min:3}).withMessage("length need more than 3 "),
    check("author")
        .notEmpty().withMessage("Auther Reqiued")
        .isLength({min:3}).withMessage("length need morethan 3 character"),
    check("description")
        .notEmpty().withMessage("must need a description")
        .isLength({min:3}).withMessage("length need morethan 3 character"),        
    check("price")
        .notEmpty().withMessage("please give the price"),
    check("category")
        .notEmpty().withMessage("Category is required")
        .isIn(["New", "Used"]).withMessage("Category must be either 'New' or 'Used'"),
    ],AddBook)
router.put("/upadte-book",[
        check("book_name")
        .optional()
        .isLength({min:3}).withMessage("length need more than 3 "),
    check("author")
        .optional()
        .isLength({min:3}).withMessage("length need morethan 3 character"),
    check("description")
        .optional()
        .isLength({min:3}).withMessage("length need morethan 3 character"),
    check("price")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("Price must be a number greater than 0"),  
    check("category")
        .optional()
        .notEmpty().withMessage("Category is required")
        .isIn(["New", "Used"]).withMessage("Category must be either 'New' or 'Used'"),  
    
],updateBook)
router.put("/delete-book",deleteBook)
router.get("/single-book",sinlgeBook)

router.post("/add-rating",addrating)
router.get("/top",getTopest)

export default router;  