import { validationResult } from "express-validator";
import Books from "../models/books.js";
export const AddBook = async (req, res) => {
  try {
    const { id: userId, role: userRole } = req.user;

    if (userRole !== "User") {
      return res.status(401).json({
        message: "User not authorized",
      });
    } else {
      const { book_name, category, author, description, price, user } =
        req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const FeildErrors = {};
        errors.array().forEach((err) => {
          const key = err.path;
          FeildErrors[key] = err.msg;
        });
        return res.status(400).json({
          message: "feild missilg",
          msg: FeildErrors,
        });
      }
      if (!req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ message: "At least one image is requierd" });
      }
      const imagePaths = req.files.map((file) => file.path);

      const newBook = await Books.create({
        book_name,
        author,
        image: imagePaths,
        description,
        price,
        category,
        user: userId,
      });
      res.status(201).json({
        message: "New Book added",
        data: newBook,
      });
    }
  } catch (err) {
    console.log(err, "error in the books adding");
    res.status(500).json({ message: "server error", Error: err.message });
  }
};

export const allBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;

    const skip = (page - 1) * limit;

    const total = await Books.countDocuments({ is_deleted: false });

    const data = await Books.find({ is_deleted: false })
      .skip(skip)
      .limit(limit);
    res.status(201).json({
      totalPage: Math.ceil(total / limit),
      totalIteam: total,
      message: "Books are",
      data: data,
    });
  } catch (err) {
    console.log(err, "error is in the view all book");
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.query;
    const userId = req.user.id;
    const data = await Books.find({ user: userId, _id: id, is_deleted: false });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const FeildErrors = {};
      errors.array().forEach((err) => {
        const key = err.path;
        FeildErrors[key] = err.msg;
      });
      return res.status(400).json({
        message: "feild missilg",
        msg: FeildErrors,
      });
    }
    const data1 = data.find((p) => p.id === id);
    if (!data1) {
      console.log("Access denied");
      return res.json({ message: "cant't update the book" });
    }
    const { book_name, author, category, description, price } = req.body;
    const UpdatedBook = await Books.findByIdAndUpdate(
      id,
      { book_name, author, category, description, price },
      {
        new: true,
      }
    );
    if (!UpdatedBook) {
      return res.status(404).json({ message: "book not found" });
    }
    res
      .status(201)
      .json({ message: "Book have been updated", data: UpdatedBook });
  } catch (err) {
    res.status(500).json({ message: "server Error", Error: err.message });
    console.error(err, "catch");
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.query;
    const userId = req.user.id;
    const book = await Books.find({ user: userId, _id: id, is_deleted: false });
    if (!book) {
      return res.status(404).json({ message: "Book not found" }, id);
    }
    const dltData = await Books.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true }
    );

    if (!dltData) {
      return res.status(404).json({ message: "page Not Found" });
    }
    res.status(201).json({ message: "book have been deleted", data: dltData });
  } catch (err) {
    console.log(err, "error is in the delete function ");
    res.status(500).json("server error");
  }
};

export const sinlgeBook = async (req, res) => {
  try {
    const { id } = req.query;
    const book = await Books.find({ is_deleted: false, _id: id });

    res.status(201).json({ message: "the single book is", data: book });
  } catch (err) {
    console.log(err, "error is in the fathing single book");
  }
};

export const oldBooks = async (req, res) => {
  try {
    const data = await Books.find({ is_deleted: false, category: "Used" });
    res.status(201).json({ message: "old books are", data: data });
  } catch (err) {
    console.log(err, "error is in the oldbook");
    res.status(500).json({ message: "error is in the oldbook sever error" });
  }
};
export const newBooks = async (req, res) => {
  try {
    const data = await Books.find({ is_deleted: false, category: "New" });
    res.status(201).json({ message: "newBooks are", data: data });
  } catch (err) {
    console.log(err, "error is in the NewBook");
    res.status(500).json({ message: "error is in the NewBook's sever error" });
  }
};

export const addrating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.query;
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "rating must be between 1 and 5" });
    }
    const book = await Books.findOne({ is_deleted: false, _id: id });
    if (!book) {
      return res.status(404).json({ message: "book not found !!" });
    }
    console.log(rating);
    if (!Array.isArray(book.rating)) {
      book.rating = [];
    }

    const alreadyRated = book.rating.find(
      (r) => r?.user?.toString() === userId.toString()
    );
    if (alreadyRated) {
      return res.status(400).json({ message: "You already Rated" });
    }
    book.rating.push({ user: userId, value: Number(rating) });
    const total = book.rating.reduce((sum, r) => sum + r.value, 0);
    const avarage = total / book.rating.length;
    book.avarage_rating = Number(avarage);
    console.log(avarage);

    await book.save();

    res
      .status(201)
      .json({ message: "Rating added", data: book, newAvarage: avarage });
  } catch (err) {
    res.status(500).json({ message: "server down rating ", err: err });
    console.log(err, "error is in the erating backend");
  }
};

export const getTopest = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;

    const skip = (page - 1) * limit;

    const total = await Books.countDocuments({ is_deleted: false });

    const data = await Books.find({ is_deleted: false })
      .sort({ avarage_rating: -1 })
      .skip(skip)
      .limit(limit);
    res.status(201).json({
      totalPage: Math.ceil(total / limit),
      totalIteam: total,
      message: "Books are",
      data: data,
    });
  } catch (err) {
    res.status(500).json(err, "error is in the get top rated backend");
    console.log(err, "error is in the get top book in the front end");
  }
};
