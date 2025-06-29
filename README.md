Absolutely, here is the clean plain-text version with no emojis, ready for copy-paste:

---

Mood Maestro – Mood to Music Playlist Recommender

1. Project Overview
   Mood Maestro is a web-based application that detects a user's emotional state and recommends personalized music playlists. It uses the webcam and microphone to analyze facial expressions and vocal tone. Based on this analysis, the user’s mood is classified into one of six categories, and a curated playlist is suggested via Spotify.
   The application uses the DeepFace library for facial emotion detection, leveraging advanced deep learning models like VGG-Face and OpenFace to recognize subtle facial expressions with high accuracy.
   An OpenAI-powered chatbot is optionally integrated, allowing users to talk about their feelings and receive supportive AI-generated responses — acting as a lightweight, conversational therapy assistant.

2. Features

* Playlist recommendations using Spotify
* Optional OpenAI chatbot for emotional support
* Mood shortcut buttons for quick selection
* Manual mood search functionality

Build Settings:

* Animated background blobs
* Glassmorphic UI cards
* Smooth color transitions
* Responsive design for desktop and mobile devices

3. Running the Website

Frontend

* Open index.html directly in a browser
* Alternatively, use a local development server (such as the Live Server extension in VS Code)

Backend (Python Flask)
Step 1: Install required packages
pip install flask flask-cors openai deepface vosk pyaudio opencv-python numpy

Step 2: Run the backend server
python app.py

Step 3: Configure API keys
Make sure to place your API keys in the following files:

* script.js (Frontend JavaScript)
* app.py (Flask backend)
* .env file (for sensitive keys such as OpenAI and Spotify)

Note: Use Python version 3.10 or 3.11 for full compatibility with the DeepFace library.

4. Tech Stack and Libraries

Frontend

* HTML
* Tailwind CSS
* JavaScript

Backend

* Python with Flask

APIs Used

* Spotify Web API
* YouTube Music (optional integration)
* OpenAI API

Key Libraries

* DeepFace – Facial emotion recognition
* Vosk – Voice recognition
* PyAudio – Audio stream processing
* OpenCV – Webcam and image processing
* NumPy – Numerical operations
* Flask and Flask-CORS – Server and CORS management
* Web Speech API – Browser-based voice input for the frontend

DeepFace supports multiple detection backends including OpenCV, SSD, Dlib, and MTCNN for robust emotion classification.

5. Supported Platforms

* Spotify
* YouTube Music (optional integration)

6. Project Components
   \| File         | Purpose                                                  |
   \|--------------|----------------------------------------------------------|
   \| index.html   | Main user interface of the web application               |
   \| style.css    | Handles layout and visual styling                        |
   \| script.js    | Controls mood detection, chatbot functionality, and APIs |
   \| app.py       | Flask backend for emotion classification and chatbot API |
   \| .env         | Stores API keys securely (not included in public repo)   |

7. Feature Requests

* Add User Authentication: Implement a secure login/signup system using OAuth (Google or GitHub). This will allow users to save their preferences and history.
* Improve Mobile Responsiveness: Optimize the layout and UI components for smaller screens to ensure better usability on mobile devices.
* Dark Mode Toggle: Add a toggle button for light/dark mode so users can switch themes based on their preference.
* Error Handling for API Calls: Improve error messages and fallback UI when the Spotify API or mood detection services fail to respond or throw errors.
* Add Mood History Dashboard: Create a section where users can see a timeline/log of previously detected moods and recommended playlists.
* Integrate Speech-to-Text for Chatbot Input: Allow users to speak to the therapy bot instead of typing, improving accessibility and user engagement.
* Enhance Playlist Recommendations: Use user mood plus time of day (e.g., sad in the morning vs. night) to make more personalized music suggestions.

8. Authors
   Yuval Gupta
   Nitigya Khaneja
   Datla Vinay Varma

---

Let me know if you want this exported as a `.md` file or ready to upload to GitHub.
# MoodMaestro
