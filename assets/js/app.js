document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('main-audio');
    const playBtn = document.getElementById('play-btn');
    const progressBar = document.getElementById('progress-bar');
    const volumeSlider = document.getElementById('volume-slider');
    const trackTitle = document.getElementById('player-track-title');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    
    // Tracks array (updated from previous interaction)
    const tracks = [
        { name: "Alive But I'm Dying.wav", path: "music/Alive But I'm Dying.wav", cover: "assets/img/music_covers/Alive But I'm Dying.jpg" },
        { name: "Sorry.wav", path: "music/Sorry.wav", cover: "assets/img/music_covers/Sorry.jpg" },
        { name: "Promise.wav", path: "music/Promise.wav", cover: "assets/img/music_covers/Promise.jpg" },
        { name: "Need Somebody.wav", path: "music/Need Somebody.wav", cover: "assets/img/music_covers/Need Somebody.jpg" },
        { name: "Meant to Be.wav", path: "music/Meant to Be.wav", cover: "assets/img/music_covers/Meant to Be.jpg" },
        { name: "Look At What You've Done.wav", path: "music/Look At What You've Done.wav", cover: "assets/img/music_covers/Look At What You've Done.jpg" },
        { name: "Coulda Been (feat. Emerson Vernon).wav", path: "music/Coulda Been (feat. Emerson Vernon).wav", cover: "assets/img/music_covers/Coulda Been (feat. Emerson Vernon).jpg" }
    ];

    let currentTrackIdx = parseInt(localStorage.getItem('cec_current_track')) || 0;
    
    // --- Boot Screen Auto-Exit Logic ---
    const bootScreen = document.getElementById('boot-screen');
    if (bootScreen) { // Check if boot screen exists (i.e., we are on index.html)
        setTimeout(() => {
            bootScreen.classList.add('hidden');
            document.body.classList.remove('booting'); // Remove body class that might prevent scroll
        }, 3500); // Hide after 3.5 seconds as per user's description
    }

    function loadTrack(idx) {
        if (!audio || !tracks[idx]) return; // Null check
        audio.src = tracks[idx].path;
        trackTitle && (trackTitle.innerText = tracks[idx].name.replace('.wav', '').replace(/_/g, ' ')); // Optional chaining for trackTitle
        localStorage.setItem('cec_current_track', idx);
        document.querySelectorAll('.fs-item').forEach((el, i) => el.classList.toggle('playing', i === idx));
        
        // Update album cover if element exists
        const activeCover = document.getElementById('active-cover');
        if (activeCover && tracks[idx]?.cover) {
            activeCover.src = tracks[idx].cover;
        }
        // Update lyric snippet (placeholder)
        const lyricText = document.getElementById('lyric-text');
        if (lyricText) {
            lyricText.innerText = `"${tracks[idx].name.replace('.wav', '').replace(/_/g, ' ')} is now playing."`;
        }
    }

    // Only attempt to load track if audio element exists and tracks are available
    if (audio && tracks.length > 0) {
        loadTrack(currentTrackIdx);
    }

    playBtn?.addEventListener('click', () => { // Optional chaining for playBtn
        if (audio?.paused) { // Optional chaining for audio
            audio.play();
            if (playBtn) playBtn.innerText = "⏸";
        } else {
            audio?.pause();
            if (playBtn) playBtn.innerText = "▶";
        }
    });

    audio?.addEventListener('timeupdate', () => { // Optional chaining for audio
        if (progressBar) progressBar.value = (audio.currentTime / audio.duration) * 100 || 0;
        if (currentTimeEl) currentTimeEl.innerText = formatTime(audio.currentTime);
        if (durationEl) durationEl.innerText = formatTime(audio.duration);
    });

    function formatTime(s) { if (isNaN(s)) return "0:00"; const m = Math.floor(s/60); const sec = Math.floor(s%60); return `${m}:${sec<10?'0':''}${sec}`; }

    if (document.body.classList.contains('page-systems')) {
        setInterval(() => {
            document.getElementById('cpu-fill')?.style.width = (Math.random()*15+5) + "%"; // Optional chaining
            document.getElementById('ram-fill')?.style.width = (Math.random()*10+40) + "%"; // Optional chaining
            const p = document.createElement('p'); p.innerText = `[${new Date().toLocaleTimeString()}] GET /api/v1/telemetry 200 OK`;
            const logStream = document.getElementById('log-stream');
            if(logStream) { // Null check
                logStream.prepend(p);
                // Keep log stream manageable, perhaps a max number of lines
                if (logStream.children.length > 20) {
                    logStream.removeChild(logStream.lastChild);
                }
            }
        }, 2000);
    }

    const cliOverlay = document.getElementById('cli-overlay');
    const cliTrigger = document.getElementById('cli-trigger'); // New: for systems/music pages
    const cliInput = document.getElementById('cli-input');
    const cliOutput = document.getElementById('cli-output');

    cliTrigger?.addEventListener('click', () => { // Optional chaining
        cliOverlay?.classList.toggle('hidden');
        if (!cliOverlay?.classList.contains('hidden')) {
            cliInput?.focus();
        }
    });


    window.addEventListener('keydown', (e) => {
        if (e.key === '~' || e.key === '`') {
            e.preventDefault();
            cliOverlay?.classList.toggle('hidden'); // Optional chaining
            if (!cliOverlay?.classList.contains('hidden')) {
                cliInput?.focus();
            }
        }
    });

    // CLI Command processing - Placeholder, actual implementation would be more complex
    cliInput?.addEventListener('keydown', (e) => { // Optional chaining
        if (e.key === 'Enter') {
            const command = cliInput.value.trim();
            if (cliOutput) {
                const commandLine = document.createElement('p');
                commandLine.innerHTML = `<span style="color: var(--gold);">opc@cec:~$</span> ${command}`;
                cliOutput.appendChild(commandLine);
            }
            // Basic command response (e.g., help, cd)
            if (command === 'help') {
                const helpOutput = document.createElement('p');
                helpOutput.innerHTML = `<span style="color: var(--terminal-green);">Available commands: help, cd [systems|music|hub], clear</span>`;
                cliOutput?.appendChild(helpOutput);
            } else if (command.startsWith('cd ')) {
                const target = command.split(' ')[1];
                let url = '';
                if (target === 'systems') url = 'systems.html';
                else if (target === 'music') url = 'music.html';
                else if (target === 'hub') url = 'index.html';

                if (url) {
                    window.location.href = url;
                } else {
                    const errorOutput = document.createElement('p');
                    errorOutput.innerHTML = `<span style="color: red;">Error: Invalid path.</span>`;
                    cliOutput?.appendChild(errorOutput);
                }
            } else if (command === 'clear') {
                if (cliOutput) cliOutput.innerHTML = '';
            }
            cliInput.value = '';
            cliOutput?.scrollTop = cliOutput.scrollHeight;
        }
    });

    // --- Audio Player Controls & Playlist Management ---
    // The previous app.js had a full audio implementation. I will integrate the user's provided `tracks` array and enhance the existing logic.

    // Re-integrating complete audio logic with null checks and optional chaining
    if (audio) {
        // Initial setup for existing tracks array (from user's code block)
        if (tracks.length > 0) {
            loadTrack(currentTrackIdx);
        }

        audio.addEventListener('ended', () => {
            currentTrackIdx = (currentTrackIdx + 1) % tracks.length;
            loadTrack(currentTrackIdx);
            audio.play();
        });

        if (progressBar) {
            progressBar.addEventListener('input', () => {
                audio.currentTime = (progressBar.value / 100) * audio.duration;
            });
        }
        
        if (volumeSlider) {
            volumeSlider.addEventListener('input', () => {
                audio.volume = volumeSlider.value;
            });
            audio.volume = volumeSlider.value; // Set initial volume
        }
    }
    // Music Page Tracklist Click Handler
    document.querySelectorAll('.track-select')?.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentTrackIdx = index;
            loadTrack(currentTrackIdx);
            audio?.play();
            playBtn && (playBtn.innerText = "⏸");
            
            // Update album cover if element exists
            const activeCover = document.getElementById('active-cover');
            if (activeCover && tracks[currentTrackIdx]?.cover) {
                activeCover.src = tracks[currentTrackIdx].cover;
            }
            // Update lyric snippet (placeholder)
            const lyricText = document.getElementById('lyric-text');
            if (lyricText) {
                lyricText.innerText = `"${tracks[currentTrackIdx].name.replace('.wav', '').replace(/_/g, ' ')} is now playing."`;
            }

        });
    });

    // Player controls (prev/next)
    document.getElementById('prev-btn')?.addEventListener('click', () => {
        currentTrackIdx = (currentTrackIdx - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrackIdx);
        audio?.play();
        playBtn && (playBtn.innerText = "⏸");
    });

    document.getElementById('next-btn')?.addEventListener('click', () => {
        currentTrackIdx = (currentTrackIdx + 1) % tracks.length;
        loadTrack(currentTrackIdx);
        audio?.play();
        playBtn && (playBtn.innerText = "⏸");
    });

});
