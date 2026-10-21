const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "public");

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(express.static(publicDir, {
  etag: true,
  maxAge: process.env.NODE_ENV === "production" ? "1h" : 0
}));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    name: "The Delusional Handbook",
    version: "2.0.0",
    message: "Server is alive. Unlike your abandoned productivity apps."
  });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`\n📕 The Delusional Handbook is running at http://localhost:${PORT}`);
  console.log("Ambition: unlimited. Server costs: currently one terminal window.\n");
});