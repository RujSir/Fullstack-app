import express from "express";
import cors from "cors";
import apiRouter1 from "./api.js";
import { seedData as seedData1 } from "./data.js";

const app = express();
const PORT = process.env.PORT || 3001;
const isSeeding = process.argv.includes("--seed");

app.use(cors());
app.use(express.json());
app.use("/api/challenge1", apiRouter1);

if (isSeeding) {
  seedData1(50000, 500000);
}

app.listen(PORT, () => {
  if (isSeeding) {
    console.log("Data seeded. The server is ready to use.");
  } else {
    console.log(
      "Server started without seeding. Use `npm run seed` to generate data."
    );
  }
});
