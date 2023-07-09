const axios = require("axios");
const sendMessage = require("./sendNotification");

// URL API yang ingin Anda pantau
const apiUrl = "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json";

// Variabel untuk menyimpan data terakhir yang diperoleh dari API
let lastData = null;

// Fungsi untuk memeriksa perubahan data pada API
const checkDataChanges = async () => {
  try {
    // Mengirim permintaan GET ke API
    const response = await axios.get(apiUrl);

    // Mendapatkan data dari respons
    const newData = response.data.Infogempa.gempa;

    // Memeriksa perubahan data
    if (JSON.stringify(newData) !== JSON.stringify(lastData)) {
      // Menampilkan data baru dalam konsol jika terjadi perubahan
      console.log("Data baru:", newData);
      const title = `Gempa Bumi di ${newData.Dirasakan}`;
      const message = `#News Gempa dengan kekuatan ${newData.Magnitude} SL , ${newData.Tanggal} ${newData.Jam}, Lokasi : ${newData.Wilayah}`;
      sendMessage(title, "test-api", message);

      // Memperbarui data terakhir dengan data baru
      lastData = newData;
    }
  } catch (error) {
    console.error("Terjadi kesalahan:", error.message);
  }
};

// Memanggil fungsi checkDataChanges setiap 5 detik
setInterval(checkDataChanges, 5000);
