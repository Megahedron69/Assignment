require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  host: "aws-0-ap-south-1.pooler.supabase.com",
  port: 6543,
  database: "postgres",
  user: "postgres.raadqkllepoitoxsseyx",
  password: `${process.env.DB_PASS}`,
});
try {
  pool.connect();
  console.log("Connected to the database.");
} catch (error) {
  console.error("Error connecting to the database:", error.message);
}

app.post("/createUser", async (req, res) => {
  const { userName } = req.body;
  console.log("Received userName:", userName);
  if (!userName) {
    return res.status(400).json({ message: "userName is required" });
  }

  try {
    const checkUserQuery = 'SELECT * FROM leaderboard WHERE "userName" = $1';
    const checkUserResult = await pool.query(checkUserQuery, [userName]);

    if (checkUserResult.rows.length === 0) {
      const insertUserQuery =
        'INSERT INTO leaderboard ("userName", "score") VALUES ($1, $2)';
      await pool.query(insertUserQuery, [userName, 0]);
      return res
        .status(201)
        .json({ status: true, message: "User added to leaderboard." });
    } else {
      return res
        .status(200)
        .json({ status: true, message: "User already exists, proceeding." });
    }
  } catch (err) {
    console.error("Error creating user:", err.stack);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error." });
  }
});

app.get("/quizzes", async (req, res) => {
  try {
    const getQuizzesQuery = 'SELECT * FROM "Quizzes"';
    const quizzesResult = await pool.query(getQuizzesQuery);
    return res.status(200).json(quizzesResult.rows);
  } catch (err) {
    console.error("Error fetching quizzes:", err.stack);
    return res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/quizzes/:id", async (req, res) => {
  try {
    const { id: quizID } = req.params;
    if (!quizID) {
      return res
        .status(400)
        .json({ message: "quizID is required", status: false });
    }
    const getQuestionsQuery =
      'SELECT "questions" FROM "Quizzes" WHERE "quizID"=$1';
    const getQuestions = await pool.query(getQuestionsQuery, [quizID]);

    if (getQuestions.rows.length === 0) {
      return res.status(404).json({ message: "Quiz not found", status: false });
    }
    const questions = getQuestions.rows[0].questions;
    return res.status(200).json({
      status: true,
      questions,
    });
  } catch (err) {
    console.error("Error fetching content:", err.stack);
    return res
      .status(500)
      .json({ message: "Internal server error.", status: false });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "hi" });
});

app.post("/quizzes", async (req, res) => {
  const { quizName, questions, totalQuestions } = req.body;

  if (!quizName || !questions || !totalQuestions) {
    return res.status(400).json({
      message: "quizName, totalQuestions and questions are required.",
      status: false,
    });
  }

  try {
    const getNextQuizIdQuery = `SELECT COALESCE(MAX("quizID"), 0) + 1 AS nextQuizID FROM "Quizzes";`;
    const nextQuizIdResult = await pool.query(getNextQuizIdQuery);
    const nextQuizID = nextQuizIdResult.rows[0].nextquizid;

    const insertQuizQuery = `
    INSERT INTO "Quizzes" ("quizID", "quizName", "totalQuestions", "questions", "created_at")
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING *;
  `;

    const result = await pool.query(insertQuizQuery, [
      nextQuizID,
      quizName,
      totalQuestions,
      questions,
    ]);

    res.status(201).json({
      message: "Quiz added successfully.",
      quiz: result.rows[0],
      status: true,
    });
  } catch (err) {
    console.error("Error adding quiz:", err.stack);
    res.status(500).json({ message: "Internal server error.", status: false });
  }
});

app.post("/quizzes/:id/submit", async (req, res) => {
  const { userName, score } = req.body;
  const quizId = req.params.id;

  console.log(userName, score, quizId);

  if (!userName || !score) {
    return res
      .status(400)
      .json({ message: "userName and score are required." });
  }

  try {
    const checkUserQuizQuery = `
      SELECT * FROM leaderboard 
      WHERE "userName" = $1 AND "quizID" = $2;
    `;
    const userQuizResult = await pool.query(checkUserQuizQuery, [
      userName,
      quizId,
    ]);

    if (userQuizResult.rows.length === 0) {
      const insertUserQuizQuery = `
        INSERT INTO leaderboard ("userName", "score", "quizID")
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      await pool.query(insertUserQuizQuery, [userName, score * 10, quizId]);
      return res
        .status(201)
        .json({ message: "User added to leaderboard for this quiz." });
    }

    const multipliedScore = score * 10;
    const updateScoreQuery = `
      UPDATE "leaderboard" 
      SET "score" = "score" + $1
      WHERE "userName" = $2 AND "quizID" = $3
      RETURNING *;
    `;
    const result = await pool.query(updateScoreQuery, [
      multipliedScore,
      userName,
      quizId,
    ]);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "User or Quiz not found in the leaderboard." });
    }

    res
      .status(200)
      .json({ message: "Score updated successfully.", score: multipliedScore });
  } catch (err) {
    console.error("Error submitting quiz score:", err.stack);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/quizzes/:id/leaderboard", async (req, res) => {
  const quizId = req.params.id;

  try {
    const getLeaderboardQuery = `
      SELECT "userName", score 
      FROM leaderboard 
      WHERE "quizID" = $1 
      ORDER BY score DESC;
    `;
    const result = await pool.query(getLeaderboardQuery, [quizId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No leaderboard entries found for this quiz.",
        status: false,
      });
    }

    res.status(200).json({ dat: result.rows, status: true });
  } catch (err) {
    console.error("Error fetching leaderboard:", err.stack);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
