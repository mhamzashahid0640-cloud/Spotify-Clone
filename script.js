let currentSong = new Audio();
let songs = [];
let currentIndex = 0;
let currentPlaylist = "";

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

// async function loadSongsFromFolder(folder = "") {
//   try {
//     const path = folder ? `songs/${folder}/` : "songs/";
//     // let a = await fetch(`http://127.0.0.1:3000/${path}`);
//     let a = await fetch(`${path}`);

//     if (!a.ok) throw new Error(`HTTP error! Status: ${a.status}`);
//     let response = await a.text();
//     console.log("Server response for", path, ":", response);
//     let div = document.createElement("div");
//     div.innerHTML = response;
//     let as = div.getElementsByTagName("a");
//     let songsList = [];
//     for (let index = 0; index < as.length; index++) {
//       const element = as[index];
//       let songName = element.innerText.trim();
//       if (songName.endsWith(".mp3") && songName !== "") {
//         songsList.push(songName);
//       }
//     }
//     console.log("Parsed songs for", folder || "default", ":", songsList);
//     return songsList;
//   } catch (error) {
//     console.error("Fetch error for folder", folder, ":", error);
//     return [];
//   }
// }

async function loadSongsFromFolder(folder = "") {
  try {
    // Define base path
    const path = folder ? `songs/${folder}/` : "songs/";

    // ✅ Manually define your song files (Netlify can’t list them automatically)
    const songMap = {
      "": [
        "songs/songs/295.mp3",
        "songs/songs/Daku.mp3",
        "songs/songs/Hum-Tere-Bin-Ab-Reh-Nhi-Sakte.mp3",
        "songs/songs/JO-TUM-Mere-HO.mp3",
        "songs/songs/Pal-Pal.mp3"
            ],
      "songs": [
        "songs/songs/295.mp3",
        "songs/songs/Daku.mp3",
        "songs/songs/Hum-Tere-Bin-Ab-Reh-Nhi-Sakte.mp3",
        "songs/songs/JO-TUM-Mere-HO.mp3",
        "songs/songs/Pal-Pal.mp3"
      ],
      "naat": [
        "songs/naat/Humne Aankhon Se Dekha Nahi Hai Magar.mp3",
        "songs/naat/Kabhi Mayoos Mat Hona.mp3",
        "songs/naat/Main Banda e Aasi Hoon.mp3",
        "songs/naat/shehar-e-muhabbat.mp3",
        "songs/naat/Ya Nabi Salam Alaika.mp3"
      ],
      "background-music": [
        "songs/background-music/theme.mp3",
        "songs/background-music/relax.mp3"
      ]
    };

    // Pick songs based on folder
    const songsList = songMap[folder] || songMap[""];
    console.log("Loaded songs for", folder || "default", ":", songsList);

    // ✅ Extract filenames only
    return songsList.map(song => song.split("/").pop());
  } catch (error) {
    console.error("Error loading songs for folder", folder, ":", error);
    return [];
  }
}



const playMusic = (index, pause = false) => {
  if (index === undefined || index < 0 || index >= songs.length) {
    console.warn("Invalid index:", index);
    return;
  }
  const track = songs[index];
  if (!track) {
    console.warn("No track at index:", index);
    return;
  }

  if (!currentSong.paused) {
    currentSong.pause();
  }

  currentSong.src = `/songs/${
    currentPlaylist ? currentPlaylist + "/" : ""
  }${encodeURIComponent(track)}`;
  currentSong.load();
  document.querySelector(".song-info").innerHTML = decodeURI(track);
  document.querySelector(".song-time").innerHTML = "00:00";

  if (!pause) {
    console.log("Attempting to play:", track);
    currentSong.play().catch((error) => console.error("Play error:", error));
    document.querySelector("#play").src = "pause.svg";
  }
  currentIndex = index;
};

async function loadPlaylist(playlistName) {
  // Map card names to folder names
  const playlistMap = {
    Daku: "songs",
    295: "songs",
    Naat: "naat", // For if you add a Naat card
  };
  const folder = playlistMap[playlistName] || playlistName.toLowerCase();
  currentPlaylist = folder;
  songs = await loadSongsFromFolder(folder);
  if (songs.length === 0) {
    console.warn("No songs in playlist:", playlistName);
    document.querySelector(".song-info").innerHTML =
      "No songs in this playlist";
    return;
  }

  let songUL = document
    .querySelector(".song-list")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const [index, song] of songs.entries()) {
    songUL.innerHTML += `
      <li data-index="${index}">
        <div class="icon"><i class="fa-solid fa-music"></i></div>
        <span class="info"><span>${song}</span><div>Hamza</div></span>
        <div class="play-now">Play Now</div>
        <div class="icon"><i class="fa-solid fa-circle-play"></i></div>
      </li>`;
  }

  Array.from(
    document.querySelector(".song-list").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      const index = parseInt(e.getAttribute("data-index"));
      console.log("Song clicked in", playlistName, ":", songs[index]);
      playMusic(index);
    });
  });

  playMusic(0);
}

async function main() {
  currentPlaylist = "";
  songs = await loadSongsFromFolder();
  let songUL = document
    .querySelector(".song-list")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";

  if (songs.length > 0) {
    playMusic(0, true);
    for (const [index, song] of songs.entries()) {
      songUL.innerHTML += `
        <li data-index="${index}">
          <div class="icon"><i class="fa-solid fa-music"></i></div>
          <span class="info"><span>${song}</span><div>Hamza</div></span>
          <div class="play-now">Play Now</div>
          <div class="icon"><i class="fa-solid fa-circle-play"></i></div>
        </li>`;
    }
    Array.from(
      document.querySelector(".song-list").getElementsByTagName("li")
    ).forEach((e) => {
      e.addEventListener("click", () => {
        const index = parseInt(e.getAttribute("data-index"));
        console.log("Song clicked:", songs[index]);
        playMusic(index);
      });
    });
  } else {
    console.log("No initial songs; waiting for playlist selection");
    document.querySelector(".song-info").innerHTML =
      "Select a playlist to load songs";
  }

  const play = document.querySelector("#play");
  const previous = document.querySelector("#previous");
  const next = document.querySelector("#next");

  play.addEventListener("click", () => {
    console.log("Play clicked");
    if (currentSong.paused) {
      currentSong.play().catch((error) => console.error("Play error:", error));
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });

  previous.addEventListener("click", () => {
    console.log("Previous clicked, currentIndex:", currentIndex);
    previous.style.pointerEvents = "auto";
    let newIndex = currentIndex - 1;
    if (newIndex < 0) {
      newIndex = 0;
    }
    playMusic(newIndex);
  });

  next.addEventListener("click", () => {
    console.log("Next clicked, currentIndex:", currentIndex);
    next.style.pointerEvents = "auto";
    let newIndex = currentIndex + 1;
    if (newIndex >= songs.length) {
      newIndex = songs.length - 1;
    }
    playMusic(newIndex);
  });

  currentSong.addEventListener("ended", () => {
    console.log("Track ended, moving to next");
    let newIndex = (currentIndex + 1) % songs.length;
    playMusic(newIndex);
  });

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".song-time").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  document.querySelector(".seek-bar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-110%";
  });

  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log("Setting Volume to", e.target.value, "/100");
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const playlistName = card.querySelector("h2").innerText.trim();
      console.log("Card clicked:", playlistName);
      loadPlaylist(playlistName); // Fixed: Pass playlistName
    });
  });
}
main();


