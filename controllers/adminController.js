import { validationResult } from "express-validator";
import Books from "../models/books.js";
import user from "../models/user.js";

// ================user functions ====================

// ----------------list all user -----------------
export const allUser = async (req, res) => {
  try {
    const { id: userId, role: userRole } = req.user;

    if (userRole !== "Admin") {
      return res.status(401).json({
        message: "User not authorized",
      });
    } else {
      const query = req.query;
      console.log(query);
      const data = await user.find(query);
      res.status(201).json({ message: "data fetched", data: data });
    }
  } catch (err) {
    console.log(err, "error is in the view all user in backend");
    res
      .status(500)
      .json({ message: "server is error to do fetch user backend" });
  }
};

// -----------------delete user and reactivate user---------------

export const deletUser = async (req, res) => {
  try {
    const { id: userId, role: userRole } = req.user;

    if (userRole !== "Admin") {
      return res.status(401).json({
        message: "User not authorized",
      });
    } else {
      const { id } = req.query;
      console.log(id);
      let msg = "";
      if (!id) {
        return res.status(401).json({ message: "user not found" });
      }
      const data = await user.findById(id);

      const deleted = await user.findByIdAndUpdate(
        id,
        { is_deleted: !data.is_deleted },
        { new: true }
      );
      if (!deleted) {
        return res.status(401).json({ message: "data cant delete" });
      }
      if (data.is_deleted === true) {
        msg = "user have been reactivated";
      } else {
        msg = "user have been deleted";
      }
      res.status(201).json({ message: msg, data: deleted });
    }
  } catch (err) {
    console.log(err, "error is in the delete function");
    res.status(500).json({ message: "server is error in the detele" });
  }
};

// ----------------verify user-------------------

export const verifyUser = async (req, res) => {
  try {
    const { id: userId, role: userRole } = req.user;

    if (userRole !== "Admin") {
      return res.status(401).json({
        message: "User not authorized",
      });
    } else {
      const { id } = req.query;
      if (!id) {
        return res.status(401).json({ message: "user not found" });
      } else {
        const data = await user.find({
          is_deleted: false,
          verify: false,
          _id: id,
        });
        const data1 = data.find((p) => p.id === id);
        if (!data1) {
          console.log("Access denied");
          return res.json({ message: "cant't verify this user" });
        } else {
          const verifyed = await user.findByIdAndUpdate(
            id,
            { verify: true },
            { new: true }
          );
          res
            .status(201)
            .json({ message: "user have been verifyed !!", data: verifyed });
        }
      }
    }
  } catch (err) {
    console.log(err, "error is in the verify user in backend");
  }
};
// *****************************************************************************************************************

//==============book functions==============================

// ------------list all books ----------------

export const allBooks = async (req, res) => {
  try {
    const { id: userId, role: userRole } = req.user;

    if (userRole !== "Admin") {
      return res.status(401).json({
        message: "User not authorized",
      });
    } else {
      const query = req.query;
      console.log(query);
      const data = await Books.find(query);
      res.status(201).json({ message: "data fetched", data: data });
    }
  } catch (err) {
    console.log(err, "error is in the view all user in backend");
    res
      .status(500)
      .json({ message: "server is error to do fetch user backend" });
  }
};

// --------------------delete book----------------------

export const deletBook = async (req, res) => {
  try {
    const { id: userId, role: userRole } = req.user;

    if (userRole !== "Admin") {
      return res.status(401).json({
        message: "User not authorized",
      });
    } else {
      const { id } = req.query;
      console.log(id);
      let msg = "";
      if (!id) {
        return res.status(401).json({ message: "Book not found" });
      }
      const data = await Books.findById(id);

      const deleted = await Books.findByIdAndUpdate(
        id,
        { is_deleted: !data.is_deleted },
        { new: true }
      );
      if (!deleted) {
        return res.status(401).json({ message: "Book cant delete" });
      }
      if (data.is_deleted === true) {
        msg = "Book have been restored";
      } else {
        msg = " Book have been deleted";
      }
      res.status(201).json({ message: msg, data: deleted });
    }
  } catch (err) {
    console.log(err, "error is in the delete function");
    res.status(500).json({ message: "server is error in the detele" });
  }
};

// -----------updatebook-----------------------

export const adminUpdateBook = async (req, res) => {
  try {
    const { id: userId, role: userRole } = req.user;

    if (userRole !== "Admin") {
      return res.status(401).json({
        message: "User not authorized",
      });
    } else {
      const { id } = req.query;
      const data = await Books.find({ _id: id, is_deleted: false });

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
    }
  } catch (err) {
    res.status(500).json({ message: "server Error", Error: err.message });
    console.error(err, "catch");
  }
};
