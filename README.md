# 🎥 Fullstack RTSP Livestream with Overlay Editor (Flask + React + HLS)

This project demonstrates a **full-stack livestream web app** that plays an RTSP video stream converted into HLS and served via a Flask backend, with a React-based frontend allowing **overlay editing** (text/images) in real-time.

---

## 🚀 Features

- **RTSP → HLS** conversion using FFmpeg  
- **Flask backend** serving static video and REST API for overlays  
- **React (Vite)** frontend player using HLS.js  
- **Overlay Editor** using `react-rnd` (drag, resize, update overlays)  
- **MongoDB** integration for overlay persistence  
- Modular design — backend and frontend run separately

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Backend | Python (Flask), MongoDB, FFmpeg |
| Frontend | React + Vite |
| Video Streaming | RTSP → HLS via FFmpeg |
| Player | HLS.js |
| Overlays | react-rnd |

---

## 🧩 Folder Structure

fullstack-rtsp/
│
├── backend/
│ ├── app.py
│ ├── models.py
│ ├── static/
│ │ └── stream.m3u8 (generated)
│ ├── requirements.txt
│ └── ...
│
├── frontend/
│ ├── src/
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── components/
│ │ ├── VideoPlayer.jsx
│ │ └── OverlayEditor.jsx
│ ├── package.json
│ └── ...
│
├── video.mp4 (or RTSP input source)
├── README.md
└── API_DOCS.md


---

## ⚙️ Setup Guide (Ubuntu + VS Code)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/abhishek2452002/fullstack-rtsp.git
cd fullstack-rtsp


Backend Setup (Flask):

cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt


Run the Flask server:

python app.py


Default server runs on:
👉 http://localhost:5000

3️⃣ RTSP → HLS Stream (via FFmpeg)

Create HLS output segments continuously to be served from backend/static/:

Option 1: RTSP stream
ffmpeg -rtsp_transport tcp -i "RTSP_URL" \
  -c:v libx264 -preset veryfast -b:v 1000k -c:a aac \
  -f hls -hls_time 3 -hls_list_size 5 -hls_flags delete_segments \
  backend/static/stream.m3u8

Option 2: Local video file
ffmpeg -re -i video.mp4 \
  -c:v libx264 -preset veryfast -b:v 1000k -c:a aac \
  -f hls -hls_time 3 -hls_list_size 5 -hls_flags delete_segments \
  backend/static/stream.m3u8

✅ Verify by opening:
http://localhost:5000/stream/stream.m3u8


4️⃣ Frontend Setup (React + Vite)
cd ../frontend
npm install
npm run dev


Frontend runs on:
👉 http://localhost:5173

5️⃣ Using the App

Start Flask backend (python app.py)

Start FFmpeg in a separate terminal (streaming process)

Start frontend (npm run dev)

Open http://localhost:5173 to view the live stream

Drag/resize overlays in real time!

🧪 API Reference

See API_DOCS.md

🧰 Troubleshooting
Issue	Solution
RTSP    not working	Use -rtsp_transport tcp flag
FFmpeg  error: codec unsupported	Replace -c:v copy with -c:v libx264
HLS     not updating	Check if FFmpeg is still running
CORS    error	Verify Flask CORS(app) is enabled

📜 License

MIT License — free to use, modify, and share.

👤 Author

Abhishek A.

