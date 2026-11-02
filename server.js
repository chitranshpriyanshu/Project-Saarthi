import app from "./app.js";
import connectDB from "./config/database.js";

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`BrightFuture running at http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  });
