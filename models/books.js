import mongoose from "mongoose";

// --------------------book details  schema-------------------------
const BooksSchema = new mongoose.Schema(
  {
    book_name: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    image: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["New", "Used"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userData",
      required: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    rating: [
      {value: {type: Number, min:1,max:5 },
       user: { type: mongoose.Schema.Types.ObjectId, ref: "userData" } },
    ],
    avarage_rating: {
      type: Number,
      default: 1.5,
    },
  },
  {
    timestamps: true,
  }
);
const Books = mongoose.model("Books-Data", BooksSchema);

export default Books;
