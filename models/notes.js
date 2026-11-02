import mongoose from "mongoose";
const Schema = mongoose.Schema;

const noteSchema = new Schema({

  chapterID:{
    type:Schema.Types.ObjectId,
    ref:"chapterModel",
    required:[true,"ChapterID is required."]
  },
  title:{
    type:String,
        required:[true,"Title is required."]
  },
  url:{
    type:String,
        required:[true,"URL is required."]
  }
  ,
  page:{
    type:Number,
     required:[true,"Number of Page is required."]

  },
  designedBy:{
    type:String,
        required:[true,"Designed By is required."]

  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "userModel"
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "userModel"
  }
}, {
  timestamps: true
})

noteSchema.index({ chapterID: 1 });

const noteModel = mongoose.model("noteModel",noteSchema);
export default noteModel
