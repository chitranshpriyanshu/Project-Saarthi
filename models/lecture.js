import mongoose from "mongoose";
const Schema = mongoose.Schema;

const lectureSchema = new Schema({

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
  duration:{
    type:String,
     required:[true,"Duration is required."]

  },
  faculty:{
    type:String,
        required:[true,"Faculty is required."]

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

lectureSchema.index({ chapterID: 1 });

const lectureModel = mongoose.model("lectureModel",lectureSchema);
export default lectureModel
