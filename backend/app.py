from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder="static")
CORS(app)

# Mongo connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["rtsp_app"]
overlays_col = db["overlays"]

# Helper to convert ObjectId
def serialize(doc):
    doc["_id"] = str(doc["_id"])
    return doc

@app.route("/overlays", methods=["POST"])
def create_overlay():
    data = request.json
    # Remove _id if present
    data.pop("_id", None)
    res = overlays_col.insert_one(data)
    return jsonify({"_id": str(res.inserted_id)}), 201

@app.route("/overlays", methods=["GET"])
def list_overlays():
    docs = [serialize(d) for d in overlays_col.find()]
    return jsonify(docs), 200  # will return [] if DB empty

@app.route("/overlays/<id>", methods=["GET"])
def get_overlay(id):
    try:
        doc = overlays_col.find_one({"_id": ObjectId(id)})
    except:
        return jsonify({"error": "Invalid ID"}), 400

    if not doc:
        return jsonify({"error": "Not found"}), 404
    return jsonify(serialize(doc)), 200

@app.route("/overlays/<id>", methods=["PUT"])
def update_overlay(id):
    data = request.json
    data.pop("_id", None)  # prevent MongoDB error

    try:
        res = overlays_col.update_one({"_id": ObjectId(id)}, {"$set": data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    if res.matched_count == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"updated": True}), 200

@app.route("/overlays/<id>", methods=["DELETE"])
def delete_overlay(id):
    try:
        res = overlays_col.delete_one({"_id": ObjectId(id)})
    except:
        return jsonify({"error": "Invalid ID"}), 400

    if res.deleted_count == 0:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"deleted": True}), 200

# Serve HLS stream files
@app.route("/stream/<path:filename>")
def stream_files(filename):
    return send_from_directory(os.path.join(app.root_path, "static"), filename)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
