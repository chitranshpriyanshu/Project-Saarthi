import {Router} from "express"
import * as adminController from "../controllers/adminController.js"
import { requireAdmin, requireSameOrigin, validateObjectIdParam } from "../middleware/middleware.js";
import upload from "../middleware/upload.js";
import { admin } from "googleapis/build/src/apis/admin/index.js";
const adminRoute =Router();
adminRoute.param("id", validateObjectIdParam("id"));

adminRoute.get("/",requireAdmin,adminController.renderAdminMenu)
adminRoute.get("/addExam",requireAdmin, adminController.renderAddExam)
adminRoute.get("/subject/:id/addChapter",requireAdmin,adminController.addChapterForm)
adminRoute.get("/exam/edit/:id",requireAdmin,adminController.editExamRender)
adminRoute.get("/content/:id/addContent",requireAdmin,adminController.renderAddContent)
adminRoute.get("/subject/:id/edit",requireAdmin,adminController.renderEditSubject)
adminRoute.get("/chapter/:id/edit",requireAdmin,adminController.renderEditChapter)
adminRoute.get("/subject/:id/add",requireAdmin,adminController.renderAddSubject)
adminRoute.get("/lecture/:id/edit",requireAdmin,adminController.renderEditLecture)
adminRoute.get("/sheet/:id/edit",requireAdmin,adminController.renderEditSheet)
adminRoute.get("/note/:id/edit",requireAdmin,adminController.renderEditNote)
adminRoute.get("/addUpdate",requireAdmin,adminController.renderAddUpdate)
adminRoute.get("/:id/addQuestion",requireAdmin,adminController.renderAddQuestion)
adminRoute.get("/questionBank",requireAdmin,adminController.renderQuestionBank)
adminRoute.get("/addQuote", requireAdmin, adminController.renderAddQuote)

adminRoute.get("/quiz/create", requireAdmin, adminController.renderCreateQuiz);


adminRoute.post("/subject/:id/add",requireSameOrigin,requireAdmin,adminController.addNewSubject)
adminRoute.post("/addExam",requireSameOrigin,requireAdmin,adminController.addExam)
adminRoute.post("/exam/:id/addSubject",requireSameOrigin,requireAdmin,adminController.addSubject)
adminRoute.post("/subject/:id/addChapter",requireSameOrigin,requireAdmin,adminController.addChapter)
adminRoute.post("/addLecture",requireSameOrigin,requireAdmin,adminController.addLecture)
adminRoute.post("/addNote",requireSameOrigin,requireAdmin,adminController.addNote)
adminRoute.post("/addSheet",requireSameOrigin,requireAdmin,adminController.addSheet)
adminRoute.post("/exam/edit/:id",requireSameOrigin,requireAdmin,adminController.editExam)
adminRoute.post("/subject/:id/edit",requireSameOrigin,requireAdmin,adminController.editSubject)
adminRoute.post("/chapter/:id/edit",requireSameOrigin,requireAdmin,adminController.editChapter)
adminRoute.post("/lecture/:id/edit",requireSameOrigin,requireAdmin,adminController.editLecture)
adminRoute.post("/sheet/:id/edit",requireSameOrigin,requireAdmin,adminController.editSheet)
adminRoute.post("/note/:id/edit",requireSameOrigin,requireAdmin,adminController.editNote)
adminRoute.post("/addUpdate",requireSameOrigin,requireAdmin,adminController.addUpdate)
adminRoute.post("/users/:id/toggle-admin", requireSameOrigin, requireAdmin, adminController.toggleAdminStatus)
adminRoute.get("/question/edit/:id", requireAdmin, adminController.renderEditQuestion)

adminRoute.post("/addQuote", requireSameOrigin, requireAdmin, adminController.addQuote)
adminRoute.post("/addQuestion",requireAdmin,   upload.fields([
        { name: "question_img", maxCount: 1 },
        { name: "optionAImage", maxCount: 1 },
        { name: "optionBImage", maxCount: 1 },
        { name: "optionCImage", maxCount: 1 },
        { name: "optionDImage", maxCount: 1 },
        {name:"solution",maxCount:1}
    ]),adminController.addQuestion)

adminRoute.post("/question/edit/:id", requireAdmin, upload.fields([
        { name: "question_img", maxCount: 1 },
        { name: "optionAImage", maxCount: 1 },
        { name: "optionBImage", maxCount: 1 },
        { name: "optionCImage", maxCount: 1 },
        { name: "optionDImage", maxCount: 1 },
        {name:"solution",maxCount:1}
    ]), adminController.editQuestion)
adminRoute.post("/question/delete/:id", requireAdmin, adminController.deleteQuestion)

adminRoute.post("/quiz/create", requireAdmin, adminController.createQuiz);
adminRoute.get("/api/subjects/:examId", requireAdmin, adminController.apiGetSubjects);
adminRoute.get("/api/chapters/:subjectId", requireAdmin, adminController.apiGetChapters);
adminRoute.get("/api/questions", requireAdmin, adminController.apiGetQuestions);
adminRoute.post("/api/generate-question", requireAdmin, adminController.apiGenerateQuestion);

export default adminRoute

