require("dotenv").config();
const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/Products");
const app = express();
const connectToDatabase = require("./database/ConnectToDatabase");

app.use(cors());
app.use(express.json());

connectToDatabase();

// Routes
app.use("/api/products", productRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port localhost:${PORT}`);
});
