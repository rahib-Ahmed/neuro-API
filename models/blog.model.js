const mongoose = require("mongoose");
const { Schema } = mongoose;

const BlogSchema = new Schema(
  {
    id: Number,
    isVerified: Boolean,
    title: String,
    imageBlog: {
      blogCover: {
        type: String,
        default: "true",
      },
      blogImagedata: {
        type: Array,
      },
    },
    description: {
      type: String,
    },
    categories: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    isArchived: {
      type: Boolean,
      default: false,
    },
    modifiedOn: {
      type: Date,
      default: new Date(),
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
    },
    createdOn: {
      type: Date,
      default: new Date().toISOString(),
    },
  },
  {
    versionKey: false,
  }
);

BlogSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, rec) => {
    delete rec._id;
  },
});
module.exports = mongoose.model("Blogs", BlogSchema, "Blogs");
