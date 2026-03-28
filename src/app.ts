import express, { urlencoded } from "express";
import type { Request, Response } from "express";
import "dotenv/config";
import router from "./routes/routes.js";
import morgan from "morgan";
import { errorHandler } from "./middleware/error.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to Todo App API",
  });
});

app.use("/api/v1", router);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
