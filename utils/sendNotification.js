const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const sendMessage = async (title, topic, message) => {
  try {
    const response = await axios.post(
      "https://fcm.googleapis.com/fcm/send",
      {
        to: `/topics/${topic}`,
        notification: {
          title: title,
          body: message,
        },
        data: {
          // Data yang ingin Anda kirim bersamaan dengan pesan
          customKey: "customValue",
        },
      },
      {
        headers: {
          Authorization: "BEARER " + process.env.API_MSG,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Pesan berhasil dikirim:", response.data);
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  }
};

module.exports = sendMessage;
// sendMessage("test-api", "Ini adalah pesan yang akan dikirim");
