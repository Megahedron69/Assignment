require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 3000;

app.use(express.json());

const pool = new Pool({
  host: "aws-0-ap-south-1.pooler.supabase.com",
  port: 6543,
  database: "postgres",
  user: "postgres.raadqkllepoitoxsseyx",
  password: "karticjoshi13",
});
try {
  pool.connect();
  console.log("Connected to the database.");
} catch (error) {
  console.error("Error connecting to the database:", error.message);
}

app.post("/createUser", async (req, res) => {
  const { userName } = req.body;

  if (!userName) {
    return res.status(400).json({ message: "userName is required" });
  }

  try {
    const checkUserQuery = "SELECT * FROM leaderboard WHERE userName = $1";
    const checkUserResult = await pool.query(checkUserQuery, [userName]);

    if (checkUserResult.rows.length === 0) {
      const insertUserQuery =
        "INSERT INTO leaderboard (userName, score) VALUES ($1, $2)";
      await pool.query(insertUserQuery, [userName, 0]);
      return res.status(201).json({ message: "User added to leaderboard." });
    } else {
      return res
        .status(200)
        .json({ message: "User already exists, proceeding." });
    }
  } catch (err) {
    console.error("Error creating user:", err.stack);
    return res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/quizzes", async (req, res) => {
  try {
    const getQuizzesQuery = "SELECT * FROM quizzes";
    const quizzesResult = await pool.query(getQuizzesQuery);
    return res.status(200).json(quizzesResult.rows);
  } catch (err) {
    console.error("Error fetching quizzes:", err.stack);
    return res.status(500).json({ message: "Internal server error." });
  }
});
app.get("/", (req, res) => {
  res.status(200).json({ message: "hi" });
});

app.post("/quizzes", async (req, res) => {
  const { quizName, questions } = req.body;

  if (!quizName || !questions) {
    return res
      .status(400)
      .json({ message: "quizName and questions are required." });
  }

  try {
    const insertQuizQuery = `
      INSERT INTO quizzes (quizName, questions, createdAt)
      VALUES ($1, $2, NOW()) 
      RETURNING *;
    `;
    const result = await client.query(insertQuizQuery, [quizName, questions]);

    res
      .status(201)
      .json({ message: "Quiz added successfully.", quiz: result.rows[0] });
  } catch (err) {
    console.error("Error adding quiz:", err.stack);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/quizzes/:id/submit", async (req, res) => {
  const { userName, score } = req.body;
  const quizId = req.params.id;

  if (!userName || !score) {
    return res
      .status(400)
      .json({ message: "userName and score are required." });
  }

  try {
    const multipliedScore = score * 10;
    const updateScoreQuery = `
      UPDATE leaderboard 
      SET score = score + $1
      WHERE userName = $2 AND quizId = $3
      RETURNING *;
    `;
    const result = await client.query(updateScoreQuery, [
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
      SELECT userName, score 
      FROM leaderboard 
      WHERE quizId = $1 
      ORDER BY score DESC;
    `;
    const result = await client.query(getLeaderboardQuery, [quizId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No leaderboard entries found for this quiz." });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching leaderboard:", err.stack);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
