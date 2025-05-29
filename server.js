import express from "express";
import cors from "cors";
import fs from "fs";
import { ContractAuto } from "./controllers/contractController.js";


const app = express();

app.use(cors({
  origin: ["http://localhost:3000"]
}));

app.use(express.json());

app.post("/api/contract", async (req, res) => {
  try {
    const contract = new ContractAuto(req.body);
    const outputPath = await contract.generate();

    if (!fs.existsSync(outputPath)) {
      return res.status(404).json({ error: "PDF not found after generation." });
    }

    res.download(outputPath, "Contract vanzare-cumparare.pdf", (err) => {
      if (err) {
        console.error("Error during download:", err);
        if (!res.headersSent) {
          return res.status(500).json({ error: "Failed to send file" });
        }
      } else {
        fs.unlink(outputPath, (unlinkerr) => {
          if (unlinkerr) console.error("Failed to delete temp PDF:", unlinkerr);
        })
      }
    });
  } catch (err) {
    console.error("Contract generation failed: ", err);
    res.status(400).json({ error: err.message || "Unexpected error" });
  }

});





app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on ${process.env.PORT || 3001}`);
})