document.getElementById("ua").textContent = navigator.userAgent;

fetch("https://ipapi.co/json/")
  .then(res => res.json())
  .then(data => {
    document.getElementById("ip").textContent = data.ip;
  })
  .catch(() => {
    document.getElementById("ip").textContent = "Gagal ambil IP";
  });

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude.toFixed(7);
      const lon = pos.coords.longitude.toFixed(7);
      const acc = pos.coords.accuracy.toFixed(2);

      document.getElementById("lat").textContent = lat;
      document.getElementById("lon").textContent = lon;
      document.getElementById("accuracy").textContent = `${acc} meter`;

      const map = L.map('map').setView([lat, lon], 16);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map);

      L.marker([lat, lon]).addTo(map)
        .bindPopup('Lokasi Anda Sekarang')
        .openPopup();

      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
        .then(res => res.json())
        .then(data => {
          const lokasi = data.display_name || "Alamat tidak ditemukan";
          document.getElementById("location").textContent = lokasi;
        })
        .catch(() => {
          document.getElementById("location").textContent = "Gagal ambil alamat";
        });
    },
    (err) => {
      document.getElementById("accuracy").textContent = err.message;
      document.getElementById("location").textContent = "Gagal mendapatkan lokasi";
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
} else {
  document.getElementById("location").textContent = "Geolocation tidak didukung browser.";
}
