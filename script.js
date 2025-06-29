const SPOTIFY_CLIENT_ID = ""; // ← Add your client ID
const SPOTIFY_CLIENT_SECRET = ""; // ← Add your client secret
const OPENAI_API_KEY = ""; // ← Optional

const moodInput = document.getElementById("moodInput");
const detectButton = document.getElementById("detectButton");
const resultDiv = document.getElementById("result");
const getPlaylistButton = document.getElementById("getPlaylistButton");
const playlistOutput = document.getElementById("playlist-output");
const moodOptionsDiv = document.getElementById("moodOptions");
const micButton = document.getElementById("micButton");

const webcam = document.createElement("video");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
webcam.setAttribute("autoplay", true);
webcam.setAttribute("playsinline", true);
webcam.style.display = "none";
document.body.appendChild(webcam);
document.body.appendChild(canvas);

const MOODS = ["happy", "sad", "angry", "calm", "romantic", "party", "focus"];
function moodEmoji(mood) {
  const emojis = {
    happy: "😊", sad: "😢", angry: "😠", calm: "😌",
    romantic: "❤️", party: "🎉", focus: "🧠"
  };
  return emojis[mood] || "🎶";
}

function populateMoodOptions() {
  MOODS.forEach(mood => {
    const btn = document.createElement("span");
    btn.className = "bg-gray-800 hover:bg-purple-700 text-gray-100 px-4 py-2 rounded-full cursor-pointer transition duration-200 transform hover:scale-105 text-sm";
    btn.innerHTML = `${moodEmoji(mood)} ${mood}`;
    btn.onclick = () => {
      moodInput.value = mood;
      fetchAndDisplayPlaylists(mood);
    };
    moodOptionsDiv.appendChild(btn);
  });
}
document.addEventListener("DOMContentLoaded", populateMoodOptions);

// 🎤 Speech-to-text
micButton.onclick = () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    moodInput.value = transcript;
  };
  recognition.start();
};

// 🎵 Spotify Token
async function getSpotifyToken() {
  const credentials = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`
    },
    body: "grant_type=client_credentials"
  });
  const data = await res.json();
  return data.access_token;
}

// 🎵 Fetch Playlist
async function fetchPlaylists(mood, token) {
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(mood)}&type=playlist&limit=6`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  return data.playlists.items;
}

// 🎵 Display Playlist
async function fetchAndDisplayPlaylists(mood) {
  playlistOutput.innerHTML = `<p class="text-purple-300 text-center col-span-3">Fetching playlists...</p>`;
  const token = await getSpotifyToken();
  const playlists = await fetchPlaylists(mood, token);

  if (!playlists.length) {
    playlistOutput.innerHTML = `<p class="text-red-400">No playlists found for "${mood}".</p>`;
    return;
  }

  playlistOutput.innerHTML = "";
  playlists.forEach(pl => {
    const div = document.createElement("div");
    div.className = "playlist-card";
    div.innerHTML = `
      <img src="${pl.images[0]?.url}" alt="cover" class="playlist-img"/>
      <div class="playlist-name">${pl.name}</div>
      <div class="playlist-description">${pl.description || 'No description'}</div>
      <div class="playlist-owner">👤 ${pl.owner.display_name}</div>
      <div class="playlist-tracks">🎵 ${pl.tracks.total} tracks</div>
      <div class="playlist-followers">❤️ ${pl.followers?.total || 'N/A'} followers</div>
      <a class="spotify-link mt-3" href="${pl.external_urls.spotify}" target="_blank">Open on Spotify</a>
    `;
    playlistOutput.appendChild(div);
  });
}

// 📷 Detect Emotion via Webcam (15 frames)
detectButton.onclick = async () => {
  resultDiv.innerText = "Starting webcam...";
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  webcam.srcObject = stream;

  let previous = "";
  let count = 0;
  let confirmed = "";

  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 300));

    canvas.width = webcam.videoWidth;
    canvas.height = webcam.videoHeight;
    ctx.drawImage(webcam, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg"));
    const formData = new FormData();
    formData.append("frame", blob);

    const res = await fetch("http://127.0.0.1:5000/detect-emotion", { method: "POST", body: formData });
    const data = await res.json();

    if (data.error) {
      resultDiv.innerText = "Error detecting emotion.";
      console.error(data.error);
      return;
    }

    const emotion = data.emotion;
    resultDiv.innerText = `Frame ${i + 1} → Detected: ${emotion}`;

    if (emotion === previous) {
      count++;
    } else {
      previous = emotion;
      count = 1;
    }

    if (count >= 5) {
      confirmed = emotion;
      break;
    }
  }

  stream.getTracks().forEach(track => track.stop());

  if (!confirmed) confirmed = previous;
  resultDiv.innerHTML = `🎭 Final Emotion: <strong>${confirmed}</strong>`;
  moodInput.value = confirmed;
  fetchAndDisplayPlaylists(confirmed);
};

// 🔘 Manual Mood Button
getPlaylistButton.onclick = () => {
  const mood = moodInput.value.trim().toLowerCase();
  if (!mood) return alert("Please enter a mood!");
  fetchAndDisplayPlaylists(mood);
};
