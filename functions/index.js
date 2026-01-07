const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const csv = require("csv-parser");
const { Readable } = require("stream");

admin.initializeApp();
const db = admin.firestore();

/**
 * POST /uploadTransactions
 * Headers:
 *  - Authorization: Firebase ID token
 * Body:
 *  - CSV file (raw text)
 */
exports.uploadTransactions = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      // 🔐 1. VERIFY USER
      const idToken = req.headers.authorization?.split("Bearer ")[1];
      if (!idToken) {
        return res.status(401).send("Unauthorized");
      }

      const decoded = await admin.auth().verifyIdToken(idToken);
      const userId = decoded.uid;

      // 📄 2. READ CSV TEXT
      const csvText = req.body;
      const transactions = [];

      const stream = Readable.from(csvText);

      stream
        .pipe(csv())
        .on("data", (row) => {
          const description = row.Description || row.description || "";
          const amount = Number(row.Amount || row.amount || 0);

          // 🧠 SIMPLE AUTO-CATEGORY
          let category = "Others";
          if (description.toUpperCase().includes("ZOMATO")) category = "Food & Dining";
          if (description.toUpperCase().includes("UBER")) category = "Transportation";
          if (description.toUpperCase().includes("AMAZON")) category = "Shopping";
          if (description.toUpperCase().includes("NETFLIX")) category = "Entertainment";

          transactions.push({
            userId,
            amount,
            category,
            description,
            date: admin.firestore.Timestamp.now(),
            source: "bank_upload",
          });
        })
        .on("end", async () => {
          const batch = db.batch();

          transactions.forEach((tx) => {
            const ref = db.collection("transactions").doc();
            batch.set(ref, tx);
          });

          await batch.commit();
          res.status(200).json({ success: true, count: transactions.length });
        });

    } catch (err) {
      console.error(err);
      res.status(500).send("Upload failed");
    }
  });
});
