const axios = require("axios");

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
          Authorization:
            "BEARER AAAAVH71LpA:APA91bGA1bkEE6YJWgyO5bbEx54DQsfDT1b9APddrj1h5KS--MUNiGjsmNeOUMcmZJhs8rlwOaHPQYmdpgsgrJMxCaMaoeNd-wDFTxzZkBiGd3RjJ25f5WZwS1i1z9-UD1hLAwWu6S9M",
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
