import mongoose from "mongoose";

const Schema = mongoose.Schema;

const quizSchema = new Schema(
  {
    chapterID: {
      type: Schema.Types.ObjectId,
      ref: "chapterModel",
      required: [true, "Chapter ID is required."],
    },
    title: {
      type: String,
      required: [true, "Quiz title is required."],
      trim: true,
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: "questionModel",
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add index on chapterID for efficient queries
quizSchema.index({ chapterID: 1 });

const quizModel = mongoose.model("quizModel", quizSchema);

export default quizModel;
