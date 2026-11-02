import chapterModel from "../models/chapter.js";
import examModel from "../models/exam.js";
import lectureModel from "../models/lecture.js";
import noteModel from "../models/notes.js";
import sheetModel from "../models/sheet.js";
import subjectModel from "../models/subjects.js";
import { convertYoutubeLink,getImage } from "../utils.js";
import updateModel from "../models/update.js";
import userModel from "../models/user.js";
import quoteModel from "../models/quote.js";
import questionModel from "../models/questionBank.js";
import quizModel from "../models/quiz.js";
import quizAttemptModel from "../models/quizAttempt.js";
import { generateQuestionFromAI } from "../services/geminiService.js";

export async function renderAddExam(req,res) {

  
  res.render("addExam")
}

export async function addExam(req,res) {

    let {examName,courseType, otherCourseType,icon}=req.body;
    
if (courseType === "Other") {
  courseType = otherCourseType;
 }

if(!icon || icon.trim() === "") icon = "\uD83D\uDCDA"
    let data = await examModel.create({
      examName,courseType,icon,
      createdBy: req.user._id,
      updatedBy: req.user._id
    })

 
let exam = data;

    req.flash("success","Exam Added")
    return res.redirect("/")
  
}

export async function renderAddSubject(req,res) {

  let {id}=req.params;
  let exam = await examModel.findById(id);
  res.render("addSub1",{exam})
  
}


export async function addSubject(req,res) {
  let { id: exam_id } = req.params;

  let {subjects}=req.body;
  subjects = Array.isArray(subjects) ? subjects : [subjects];
  for(const subject of subjects) {
if(!subject.icon || subject.icon.trim() === "") {subject.icon="\uD83D\uDCDA"}

    await subjectModel.create({
      examID:exam_id,
      subjectName:subject.subjectName,
      description:subject.description,
      chapterCount:subject.chapterCount,
      icon:subject.icon,
      createdBy: req.user._id,
      updatedBy: req.user._id
    })
    
  }
  req.flash("success","Subject Added");
  res.redirect("/")

  
}
export async function addNewSubject(req,res) {
  let {id}=req.params;
    let {subject}=req.body;
    
      let exam = await examModel.findById(id);
      exam.subjects.push(subject.subjectName);
      await exam.save()
if(!subject.icon || subject.icon.trim() === "") {subject.icon="\uD83D\uDCDA"}

    await subjectModel.create({
      examID:id,
      subjectName:subject.subjectName,
      description:subject.description,
      chapterCount:subject.chapterCount,
      icon:subject.icon,
      createdBy: req.user._id,
      updatedBy: req.user._id
    })

    req.flash("success","Subject Added")
    return res.redirect(`/subject/${id}`)
  
}

export async function renderEditChapter(req,res) {

  let {id}=req.params;
  let chapter = await chapterModel.findById(id);
  let subID = chapter.subjectID;
  let subject = await subjectModel.findById(subID);
  res.render("editChapter",{chapter,subject})
}
export async function editChapter(req,res) {
  let {id}=req.params;
  let{chapter}=req.body;

  await chapterModel.findByIdAndUpdate(id,{
     chapterName:chapter.chapterName,
    description:chapter.description,
    updatedBy: req.user._id
  })
  let ch = await chapterModel.findById(id);
  let subID=ch.subjectID
  res.redirect(`/subject/${subID}/chapter`);
}
export async function editExamRender(req,res) {

  let {id}=req.params;
  let exam = await examModel.findById(id);
  let examName = exam.examName;
  let courseType=exam.courseType;
  let icon = exam.icon;
  res.render("editExam",{
    examName,courseType,icon,exam
  })
  
}

export async function editExam(req,res) {
  try {
    let { examName, courseType, otherCourseType, icon } = req.body;
    const { id } = req.params;

    if (courseType === "Other") {
      courseType = otherCourseType;
    }

    if (!icon || icon.trim() === "") {
      icon = "\uD83D\uDCDA";
    }

    await examModel.findByIdAndUpdate(
      id,
      {
        examName,
        courseType,
        icon,
        updatedBy: req.user._id
      }
    );

    req.flash("success", "Exam updated successfully");
    res.redirect("/"); // change to your exam listing route

  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to update exam");
    res.redirect("/");
  }

}
export async function renderEditSubject(req,res) {
  let {id}=req.params;

  let subject = await subjectModel.findById(id);
// let subject = subjectList.subjectName;
  let eID = subject.examID;
  let exam = await examModel.findById(eID);
  res.render("editSub",{exam,subject})
  
}
export async function editSubject(req,res) {
  let {id}=req.params;
    let {subjects}=req.body;
    let subjectList = await subjectModel.findById(id);
    let eID = subjectList.examID;
  let update = await subjectModel.findByIdAndUpdate(id,{


      subjectName:subjects.name,
      description:subjects.description,
      chapterCount:subjects.chapterCount,
      icon:subjects.icon,
      updatedBy: req.user._id

  })

  req.flash("success","Subject Edited")
  res.redirect(`/subject/${eID}`)

  
}
export async function addChapterForm(req,res) {
let {id }= req.params;
let subject = await subjectModel.findById(id);
let eID = subject.examID;
let exam = await examModel.findById(eID)
  res.render("addChapter",{subject,exam})
  
}

export async function addChapter(req,res) {


   let {subjectID, chapters}=req.body;
   for(let i =0;i<chapters.length;i++)
   {
     await chapterModel.create({
        subjectID,chapterName:chapters[i].chapterName,
        description:chapters[i].description,
        createdBy: req.user._id,
        updatedBy: req.user._id
 })
   }
   res.redirect(`/subject/${subjectID}/chapter`)
  
}


export async function addNote(req,res) {
let {chapterID,title,url,page,designedBy}=req.body;
 await noteModel.create({
  chapterID,title,url,page,designedBy,
  createdBy: req.user._id,
  updatedBy: req.user._id
 })
  res.redirect(`/content/${chapterID}`)
}
export async function addSheet(req,res) {
let {chapterID,title,url,page,level}=req.body;
 await sheetModel.create({
  chapterID,title,url,page,level,
  createdBy: req.user._id,
  updatedBy: req.user._id
 })
  res.redirect(`/content/${chapterID}`)
}
export async function renderAddContent(req,res) {
  let {id}=req.params;
  let selectedChapter = await chapterModel.findById(id);
  res.render("addContent",{selectedChapter})
  
}
export async function addLecture(req,res) {
let {chapterID,title,url,duration,faculty}=req.body;
url = convertYoutubeLink(url);
  await lectureModel.create({
  chapterID,title,url,duration,faculty,
  createdBy: req.user._id,
  updatedBy: req.user._id
 })
res.redirect(`/content/${chapterID}`)  
}
export async function renderEditLecture(req,res) {
  let {id}=req.params;
  let lecture = await lectureModel.findById(id);
  let cID = lecture.chapterID;
  let chapterData= await chapterModel.findById(cID)
  res.render("editLecture",{
    lecture,chapterData
  })
  
}

export async function editLecture(req,res) {
  let {id}=req.params;
let {chapterID,title,url,duration,faculty}=req.body;
url = convertYoutubeLink(url);
let lecture = await lectureModel.findByIdAndUpdate(id,{
  title,url,duration,faculty,
  updatedBy: req.user._id
});
res.redirect(`/content/${chapterID}`)  
}

export async function renderEditSheet(req,res) {
   let {id}=req.params;
  let sheet = await sheetModel.findById(id);
  let cID =  sheet.chapterID;
    let chapterData= await chapterModel.findById(cID)
res.render("editSheet",{chapterData,sheet})
}

export async function editSheet(req,res) {

   let {id}=req.params;
let {chapterID,title,url,page,level}=req.body;
let sheet = await sheetModel.findByIdAndUpdate(id,{
  title,url,page,level,
  updatedBy: req.user._id
});
res.redirect(`/content/${chapterID}`)  
}

export async function renderEditNote(req,res) {
   let {id}=req.params;
  let note = await noteModel.findById(id);
  let cID =  note.chapterID;
    let chapterData= await chapterModel.findById(cID)
res.render("editNote",{chapterData,note})
}
export async function editNote(req,res) {
 let {id}=req.params;
let {chapterID,title,url,page,designedBy}=req.body;
let sheet = await noteModel.findByIdAndUpdate(id,{
  title,url,page,designedBy,
  updatedBy: req.user._id
});
res.redirect(`/content/${chapterID}`) 
}
export async function renderAddUpdate(req, res) {
  const exams = await examModel.find();
  res.render("addUpdate", { exams });
}
export async function addUpdate(req, res) {
  const { title, category, content, examID, isImportant } = req.body;
  await updateModel.create({
    title,
    category,
    content,
    examID: examID || null,
    isImportant: isImportant === "on" || isImportant === true,
    createdBy: req.user._id,
    updatedBy: req.user._id
  });
  req.flash("success", "Update posted successfully");
  res.redirect("/updates");
}
export async function renderAdminMenu(req, res) {
  try {
    const users = await userModel.find();
    const exams = await examModel.find().populate('createdBy updatedBy');
    const subjects = await subjectModel.find().populate('createdBy updatedBy');
    const chapters = await chapterModel.find().populate('createdBy updatedBy');
    const lectures = await lectureModel.find().populate('createdBy updatedBy');
    const notes = await noteModel.find().populate('createdBy updatedBy');
    const sheets = await sheetModel.find().populate('createdBy updatedBy');
    const updates = await updateModel.find().populate('createdBy updatedBy examID').sort({ date: -1 });

    const allEvents = [
      ...exams.map(e => ({ title: `Exam: ${e.examName}`, type: 'Exam', updatedBy: e.updatedBy, createdBy: e.createdBy, updatedAt: e.updatedAt || e.createdAt, action: e.updatedAt > e.createdAt ? 'updated' : 'created' })),
      ...subjects.map(s => ({ title: `Subject: ${s.subjectName}`, type: 'Subject', updatedBy: s.updatedBy, createdBy: s.createdBy, updatedAt: s.updatedAt || s.createdAt, action: s.updatedAt > s.createdAt ? 'updated' : 'created' })),
      ...chapters.map(c => ({ title: `Chapter: ${c.chapterName}`, type: 'Chapter', updatedBy: c.updatedBy, createdBy: c.createdBy, updatedAt: c.updatedAt || c.createdAt, action: c.updatedAt > c.createdAt ? 'updated' : 'created' })),
      ...lectures.map(l => ({ title: `Lecture: ${l.title}`, type: 'Lecture', updatedBy: l.updatedBy, createdBy: l.createdBy, updatedAt: l.updatedAt || l.createdAt, action: l.updatedAt > l.createdAt ? 'updated' : 'created' })),
      ...notes.map(n => ({ title: `Note: ${n.title}`, type: 'Note', updatedBy: n.updatedBy, createdBy: n.createdBy, updatedAt: n.updatedAt || n.createdAt, action: n.updatedAt > n.createdAt ? 'updated' : 'created' })),
      ...sheets.map(sh => ({ title: `Sheet: ${sh.title}`, type: 'Sheet', updatedBy: sh.updatedBy, createdBy: sh.createdBy, updatedAt: sh.updatedAt || sh.createdAt, action: sh.updatedAt > sh.createdAt ? 'updated' : 'created' })),
      ...updates.map(u => ({ title: `Update: ${u.title}`, type: 'Announcement', updatedBy: u.updatedBy, createdBy: u.createdBy, updatedAt: u.updatedAt || u.createdAt, action: u.updatedAt > u.createdAt ? 'updated' : 'created' }))
    ];

    const recentActivities = allEvents
      .filter(event => event.updatedAt)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 6);

    const hierarchy = [];
    for (const exam of exams) {
      const examSubjects = subjects.filter(s => s.examID && s.examID.toString() === exam._id.toString());
      const subjectList = [];
      for (const sub of examSubjects) {
        const subChapters = chapters.filter(c => c.subjectID && c.subjectID.toString() === sub._id.toString());
        subjectList.push({
          _id: sub._id,
          name: sub.subjectName,
          chapters: subChapters.map(c => ({ _id: c._id, name: c.chapterName }))
        });
      }
      hierarchy.push({
        examId: exam._id,
        exam: exam.examName,
        subjects: subjectList
      });
    }

    res.render("adminDashboard", {
      stats: {
        users: users.length,
        exams: exams.length,
        subjects: subjects.length,
        chapters: chapters.length,
        lectures: lectures.length,
        notes: notes.length,
        sheets: sheets.length,
        updates: updates.length
      },
      recentActivities,
      exams,
      hierarchy,
      users
    });
  } catch (error) {
    console.error("Error loading Admin Dashboard:", error);
    req.flash("error", "Failed to load dashboard data");
    res.redirect("/");
  }
}

export async function toggleAdminStatus(req, res) {
  try {
    const { id } = req.params;
    
    // Prevent self-demotion
    if (id === req.user._id.toString()) {
      req.flash("error", "You cannot demote yourself from Admin status.");
      return res.redirect("/admin");
    }

    const targetUser = await userModel.findById(id);
    if (!targetUser) {
      req.flash("error", "User not found");
      return res.redirect("/admin");
    }

    targetUser.admin = !targetUser.admin;
    await targetUser.save();

    req.flash("success", `User role for "${targetUser.username}" updated to ${targetUser.admin ? 'Admin' : 'Student'}`);
    res.redirect("/admin");
  } catch (error) {
    console.error("Error toggling admin status:", error);
    req.flash("error", "Failed to update user administrative status");
    res.redirect("/admin");
  }
}

export async function renderAddQuote(req, res) {
  res.render("addQuote");
}

export async function addQuote(req, res) {
  try {
    let { content, author } = req.body;
    if (!author || author.trim() === "") {
      author = "Anonymous";
    }

    await quoteModel.create({
      content,
      author,
      createdBy: req.user._id,
      updatedBy: req.user._id
    });

    req.flash("success", "Quote of the Day added successfully!");
    res.redirect("/admin");
  } catch (error) {
    console.error("Error creating quote:", error);
    req.flash("error", "Failed to add Quote of the Day");
    res.redirect("/admin");
  }
}

export async function renderAddQuestion(req,res) {
  let {id}=req.params;
  let exam = await examModel.findById(id);
  let sub = exam.subjects;
res.render("addQuestion",{sub,id})
  
}
export async function addQuestion(req,res) {
  try {
    let {course,question_text,optionAtext,optionBtext,optionCtext,optionDtext,correctOption,subject,chapter,level,tags,solution_text}=req.body;
    
    let {question_img,optionAImage,optionBImage,optionCImage,optionDImage,solution}=req.files;
    let qsn_img = getImage(question_img);
    let optionAImg=getImage(optionAImage);
    let optionBImg=getImage(optionBImage);
    let optionCImg=getImage(optionCImage);
    let optionDImg=getImage(optionDImage);
    let solution_img=getImage(solution)

    let options = [{text:optionAtext,img:optionAImg},{text:optionBtext,img:optionBImg},{text:optionCtext,img:optionCImg},{text:optionDtext,img:optionDImg} ]
    let soln = {
      text:solution_text,img:solution_img
    }
    let qsn = new questionModel({
      course,question_text,question_img:qsn_img,options,subject,chapter,level,solution:soln, tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
      createdBy: req.user._id
    })
    const index = Number(correctOption);
    qsn.correctOption = qsn.options[index]._id;
    await qsn.save();

    req.flash("success", "Question added successfully!");
    res.redirect("/admin/questionBank");
  } catch (error) {
    console.error("Error adding question:", error);
    req.flash("error", "Failed to add question.");
    res.redirect("/admin");
  }
}

export async function renderQuestionBank(req,res) {
  try {
    const exams = await examModel.find();
    const questions = await questionModel.find().populate("course").sort({ createdAt: -1 });
    res.render("questionBank", { questions, exams });
  } catch (error) {
    console.error("Error rendering question bank:", error);
    req.flash("error", "Failed to render question bank.");
    res.redirect("/admin");
  }
}

export async function renderEditQuestion(req, res) {
  try {
    const { id } = req.params;
    const question = await questionModel.findById(id);
    if (!question) {
      req.flash("error", "Question not found");
      return res.redirect("/admin/questionBank");
    }
    const exams = await examModel.find();
    const currentExam = await examModel.findById(question.course);
    const sub = currentExam ? currentExam.subjects : [];
    
    res.render("editQuestion", { question, exams, sub });
  } catch (error) {
    console.error("Error rendering edit question form:", error);
    req.flash("error", "Failed to render edit question form.");
    res.redirect("/admin/questionBank");
  }
}

export async function editQuestion(req, res) {
  try {
    const { id } = req.params;
    const {
      course,
      question_text,
      optionAtext,
      optionBtext,
      optionCtext,
      optionDtext,
      correctOption,
      subject,
      chapter,
      level,
      tags,
      solution_text
    } = req.body;

    const question = await questionModel.findById(id);
    if (!question) {
      req.flash("error", "Question not found");
      return res.redirect("/admin/questionBank");
    }

    // Process file uploads
    let question_img_upload = req.files && req.files.question_img ? getImage(req.files.question_img) : null;
    let optionAImg_upload = req.files && req.files.optionAImage ? getImage(req.files.optionAImage) : null;
    let optionBImg_upload = req.files && req.files.optionBImage ? getImage(req.files.optionBImage) : null;
    let optionCImg_upload = req.files && req.files.optionCImage ? getImage(req.files.optionCImage) : null;
    let optionDImg_upload = req.files && req.files.optionDImage ? getImage(req.files.optionDImage) : null;
    let solution_img_upload = req.files && req.files.solution ? getImage(req.files.solution) : null;

    // Update main fields
    question.course = course;
    question.question_text = question_text;
    if (question_img_upload) {
      question.question_img = question_img_upload;
    }
    question.subject = subject;
    question.chapter = chapter;
    question.level = level;
    question.tags = tags ? tags.split(",").map(tag => tag.trim()).filter(t => t !== "") : [];

    // Solution
    question.solution = {
      text: solution_text,
      img: solution_img_upload || question.solution.img
    };

    // Update options text and/or images
    const optTexts = [optionAtext, optionBtext, optionCtext, optionDtext];
    const optImgs = [optionAImg_upload, optionBImg_upload, optionCImg_upload, optionDImg_upload];

    for (let i = 0; i < 4; i++) {
      if (question.options[i]) {
        question.options[i].text = optTexts[i] || "";
        if (optImgs[i]) {
          question.options[i].img = optImgs[i];
        }
      } else {
        question.options.push({
          text: optTexts[i] || "",
          img: optImgs[i] || undefined
        });
      }
    }

    // Update correct option field
    const index = Number(correctOption);
    if (!isNaN(index) && index >= 0 && index < question.options.length) {
      question.correctOption = question.options[index]._id;
    }

    await question.save();

    req.flash("success", "Question updated successfully!");
    res.redirect("/admin/questionBank");
  } catch (error) {
    console.error("Error editing question:", error);
    req.flash("error", "Failed to update question.");
    res.redirect("/admin/questionBank");
  }
}

export async function deleteQuestion(req, res) {
  try {
    const { id } = req.params;
    const result = await questionModel.findByIdAndDelete(id);
    if (!result) {
      req.flash("error", "Question not found");
      return res.redirect("/admin/questionBank");
    }
    req.flash("success", "Question deleted successfully!");
    res.redirect("/admin/questionBank");
  } catch (error) {
    console.error("Error deleting question:", error);
    req.flash("error", "Failed to delete question.");
    res.redirect("/admin/questionBank");
  }
}

export async function renderCreateQuiz(req, res) {
  try {
    const exams = await examModel.find();
    res.render("quiz/create", { exams });
  } catch (error) {
    console.error("Error rendering create quiz form:", error);
    req.flash("error", "Failed to load page.");
    res.redirect("/admin");
  }
}

export async function createQuiz(req, res) {
  try {
    const { title, chapterID, questions } = req.body;
    
    if (!title || !chapterID || !questions || questions.length === 0) {
      req.flash("error", "Please provide a title, chapter, and select at least one question.");
      return res.redirect("/admin/quiz/create");
    }

    const questionIds = Array.isArray(questions) ? questions : [questions];

    await quizModel.create({
      title,
      chapterID,
      questions: questionIds,
      createdBy: req.user._id
    });

    req.flash("success", "Quiz created successfully!");
    res.redirect("/admin");
  } catch (error) {
    console.error("Error creating quiz:", error);
    req.flash("error", "Failed to create quiz.");
    res.redirect("/admin/quiz/create");
  }
}

export async function apiGetSubjects(req, res) {
  try {
    const { examId } = req.params;
    const subjects = await subjectModel.find({ examID: examId });
    res.json(subjects);
  } catch (error) {
    console.error("Error getting subjects:", error);
    res.status(500).json({ error: error.message });
  }
}

export async function apiGetChapters(req, res) {
  try {
    const { subjectId } = req.params;
    const chapters = await chapterModel.find({ subjectID: subjectId });
    res.json(chapters);
  } catch (error) {
    console.error("Error getting chapters:", error);
    res.status(500).json({ error: error.message });
  }
}

export async function apiGetQuestions(req, res) {
  try {
    const { examId, subjectName } = req.query;
    if (!examId || !subjectName) {
      return res.status(400).json({ error: "examId and subjectName are required" });
    }
    // course refers to the exam ObjectId, and subject is stored as String in questionModel
    const questions = await questionModel.find({ course: examId, subject: subjectName });
    res.json(questions);
  } catch (error) {
    console.error("Error getting questions:", error);
    res.status(500).json({ error: error.message });
  }
}

export async function apiGenerateQuestion(req, res) {
  try {
    const { prompt, subject, chapter, difficulty } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }
    const data = await generateQuestionFromAI({ prompt, subject, chapter, difficulty });
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error in apiGenerateQuestion:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to generate question" });
  }
}