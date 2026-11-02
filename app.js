import express from "express";
import methodOverride from "method-override";
import flash from "connect-flash"
import session from "express-session";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import ejsMate from "ejs-mate"
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth_routes.js"
import Route from "./routes/render_index.js";
import config from "./config/config.js";
const app = express();
import { loadUser } from "./middleware/middleware.js";
import adminRoute from "./routes/adminRoutes.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine("ejs", ejsMate)
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(compression());
if (config.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "lax"
  }
}));
app.use(flash())
app.use(cookieParser())
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = null;
  res.locals.title = "Saarthi"
  next();
})
app.use(loadUser);
app.use("/auth", authRouter)
app.use("/", Route)
app.use("/admin", adminRoute)

app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found"
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  req.flash("error", "Something went wrong. Please try again.");
  res.status(500).redirect(req.get("Referer") || "/");
});

export default app;
