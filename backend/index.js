import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Prisma, PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

const port = process.env.PORT || "8000";

const allowedOrigins = ["http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// get todos
app.get("/api/todos", async (req, res) => {
  const todos = await prisma.todo.findMany({});
  res.json(todos);
});

// get todo
app.get("/api/todo/:id", async (req, res) => {
  const { id } = req.params;
  const todo = await prisma.todo.findUnique({ where: { id: id.toString() } });
  res.json(todo);
});

// create todos
app.post("/api/todos", async (req, res) => {
  const { todoTitle, todoDescription } = req.body;
  if (!todoTitle || !todoDescription) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const post = await prisma.todo.create({
    data: {
      todoTitle,
      todoDescription,
    },
  });
  res.json(post);
});

app.delete("/api/todo/:id", async (req, res) => {
  const { id } = req.params;
  const deletedTodo = await prisma.todo.delete({
    where: { id: id.toString() },
  });
  res.json(deletedTodo);
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
