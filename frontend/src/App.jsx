import React, { useState, useEffect } from "react";
import VideoPlayer from "./components/VideoPlayer";
import OverlayEditor from "./components/OverlayEditor";
import axios from "axios";

const API_BASE = "";

function App() {
  const [overlays, setOverlays] = useState([]);
  const streamUrl = `/stream/stream.m3u8`; // proxied to backend by Vite

  useEffect(() => {
    fetchOverlays();
  }, []);

  async function fetchOverlays() {
    try {
      const res = await axios.get(`/overlays`);
      setOverlays(res.data);
    } catch (err) {
      console.error("Fetch overlays failed", err);
    }
  }

  async function onUpdate(id, updated) {
    // optimistic update
    setOverlays(prev => prev.map(p => p._id === id ? updated : p));
    try {
      await axios.put(`/overlays/${id}`, updated);
    } catch (err) {
      console.error("Update failed", err);
      fetchOverlays();
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>RTSP Livestream with Overlays</h2>

      <div style={{ position: "relative", width: 960, maxWidth: "100%" }}>
        <div style={{ width: "100%", background: "#000" }}>
          <VideoPlayer src={streamUrl} />
        </div>

        {/* overlay container sits on top of video */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10
        }}>
          <div style={{ pointerEvents: "auto", width: "100%" }}>
            <OverlayEditor overlays={overlays} onUpdate={onUpdate} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
