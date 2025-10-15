import React from "react";
import { Rnd } from "react-rnd";

export default function OverlayEditor({ overlays, onUpdate }) {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {overlays.map((ov) => (
        <Rnd
          key={ov._id}
          size={{ width: ov.width, height: ov.height }}
          position={{ x: ov.x, y: ov.y }}
          onDragStop={(e, d) => onUpdate(ov._id, { ...ov, x: d.x, y: d.y })}
          onResizeStop={(e, direction, ref, delta, position) => {
            onUpdate(ov._id, { 
              ...ov,
              width: parseInt(ref.style.width, 10),
              height: parseInt(ref.style.height, 10),
              x: position.x,
              y: position.y
            });
          }}
        >
          <div style={{
            border: "1px dashed rgba(255,255,255,0.6)",
            background: "rgba(0,0,0,0.25)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            pointerEvents: "auto"
          }}>
            {ov.type === "text" ? (
              <div>{ov.content}</div>
            ) : (
              <img
                src={ov.content}
                alt="overlay"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            )}
          </div>
        </Rnd>
      ))}
    </div>
  );
}
