from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from deepface import DeepFace

app = Flask(__name__)
CORS(app)

# Parameters
FRAME_THRESHOLD = 15

# Global variables to track consistent emotion
recognized_count = 0
prev_emotion = ""
confirmed_emotion = ""

@app.route('/detect-emotion', methods=['POST'])
def detect_emotion():
    global recognized_count, prev_emotion, confirmed_emotion

    if 'frame' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files['frame']
    npimg = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    try:
        result = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)
        emotion = result[0]['dominant_emotion']

        if emotion == prev_emotion:
            recognized_count += 1
        else:
            recognized_count = 1
            prev_emotion = emotion

        if recognized_count >= FRAME_THRESHOLD:
            if emotion == "neutral":
                emotion = "calm"
            elif emotion == "surprise":
                emotion = "party"

            confirmed_emotion = emotion
            print("✅ Confirmed Emotion:", confirmed_emotion)

            # Reset for next detection session
            recognized_count = 0
            prev_emotion = ""

            return jsonify({"emotion": confirmed_emotion, "confirmed": True})

        return jsonify({"emotion": emotion, "confirmed": False})
    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
