const express = require("express");
const fs = require("fs");
const app = express();
const port = 4000; // You can change the port number if needed

app.use(express.json()); // Add this line to parse JSON request bodies

// Read data from db.json file
function readDataFromFile() {
  const data = fs.readFileSync("./utils/db.json");
  return JSON.parse(data);
}

// Write data to db.json file
function writeDataToFile(data) {
  fs.writeFileSync("./utils/db.json", JSON.stringify(data, null, 2));
}

// Define your API endpoint to get data from db.json
app.get("/api", (req, res) => {
  const data = readDataFromFile();
  res.json(data);
});

// Define your API endpoint to update data in db.json
app.post("/api/create", (req, res) => {
  const newData = req.body; // Assuming the request body contains the new data

  if (!newData || !newData.message) {
    return res.status(400).json({ error: "Invalid data" });
  }

  // Read the existing data from db.json
  const data = readDataFromFile();

  // Update the data with the new content
  data.message = newData.message;

  // Write the updated data back to db.json
  writeDataToFile(data);

  res.json({ message: "Data updated successfully" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
