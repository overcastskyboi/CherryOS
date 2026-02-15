/**
 * CEC Portfolio - Main Application Logic
 * Handles: Boot Transition, Live Telemetry, and Music Player
 */

// --- Configuration Constants ---
const BOOT_TRANSITION_DELAY_MS = 1200; // 1.2 seconds
const TELEMETRY_API_ENDPOINT = 'http://129.80.222.26:3000/metrics';
const TELEMETRY_UPDATE_INTERVAL_MS = 10000; // 10 seconds

// --- 1. BOOT SEQUENCE TRANSITION ---
// Initial site setup and boot sequence
window.addEventListener('load', initializeSite);

// Fallback: Force transition after 3 seconds if telemetry fails or is slow
setTimeout(hideBootScreen, 3000);

// Function to hide the boot screen and show main content
function hideBootScreen() {
    const bootScreen = document.getElementById('boot-screen');
    const mainPortfolio = document.getElementById('main-portfolio');
    if (bootScreen) {
        bootScreen.classList.add('hidden');
    }
    if (mainPortfolio) {
        mainPortfolio.style.opacity = '1';
    }
}

// Function to initialize the site, including telemetry and boot sequence
async function initializeSite() {
    // Initial delay for boot sequence
    await new Promise(resolve => setTimeout(resolve, BOOT_TRANSITION_DELAY_MS));

    if (document.body.classList.contains('page-systems')) {
        try {
            await updateLiveTelemetry(); // Perform initial telemetry fetch
        } catch (err) {
            console.error("Telemetry offline, proceeding to hub...", err);
        } finally {
            // Ensure boot screen hides after initial telemetry attempt (or delay)
            hideBootScreen();
            // Start continuous telemetry updates only after initial load
            setInterval(updateLiveTelemetry, TELEMETRY_UPDATE_INTERVAL_MS);
        }
    } else {
        // If not a systems page, just hide boot screen after delay
        hideBootScreen();
    }
}

// --- 2. LIVE TELEMETRY (ORACLE OCI) ---
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');

function updateServerStatus(isOnline) {
    if (statusDot) statusDot.className = isOnline ? 'dot-online' : 'dot-offline';
    if (statusText) statusText.innerText = isOnline ? 'SERVER LIVE' : 'SERVER OFFLINE';
}

async function updateLiveTelemetry() {
    try {
        const response = await fetch(TELEMETRY_API_ENDPOINT);
        if (!response.ok) throw new Error('Offline');
        
        const data = await response.json();

        // Update Hardware Progress Bars
        updateProgressBar('cpu-fill', 'cpu-perc', data.cpu);
        updateProgressBar('ram-fill', 'ram-perc', data.mem);
        updateProgressBar('disk-fill', 'disk-perc', data.disk.capacity);

        // Update Text Metrics
        if (document.getElementById('uptime-val')) {
            const h = Math.floor(data.uptime / 3600);
            const m = Math.floor((data.uptime % 3600) / 60);
            document.getElementById('uptime-val').innerText = `${h}h ${m}m`;
        }
        if (document.getElementById('disk-total')) {
            document.getElementById('disk-total').innerText = data.disk.total;
        }

        // Set Online Status
        updateServerStatus(true);

    } catch (error) {
        console.error('Telemetry Error:', error);
        updateServerStatus(false);
    }
}

function updateProgressBar(fillId, textId, value) {
    const fill = document.getElementById(fillId);
    const text = document.getElementById(textId);
    if (fill) fill.style.width = `${value}%`;
    if (text) text.innerText = `${value}%`;
}



// --- 3. MUSIC PLAYER LOGIC ---
// Simplified setup for the "Studio" page
const audio = document.getElementById('main-audio');
const playBtn = document.getElementById('play-btn');

if (playBtn && audio) {
    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playBtn.innerText = '⏸';
        } else {
            audio.pause();
            playBtn.innerText = '▶';
        }
    });
}

// --- 4. TERMINAL (CLI) OVERLAY ---
const cliTrigger = document.getElementById('cli-trigger');
const cliOverlay = document.getElementById('cli-overlay');

if (cliTrigger && cliOverlay) {
    cliTrigger.addEventListener('click', () => {
        cliOverlay.classList.toggle('hidden');
    });
}