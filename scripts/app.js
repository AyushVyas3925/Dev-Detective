


// DOM Elements
const searchForm = document.getElementById('searchForm');
const battleForm = document.getElementById('battleForm');
const searchInput = document.getElementById('searchInput');
const player1Input = document.getElementById('player1Input');
const player2Input = document.getElementById('player2Input');
const themeToggle = document.getElementById('themeToggle');
const modeSearch = document.getElementById('modeSearch');
const modeBattle = document.getElementById('modeBattle');
const body = document.body;
const profileSection = document.getElementById('profileSection');
const loading = document.getElementById('loading');
const battleError = document.getElementById('battleError');

// Helper for file:// protocol where localStorage might be disabled
const safeStorage = {
    getItem: (key) => {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.warn('localStorage not available:', e);
            return null;
        }
    },
    setItem: (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.warn('localStorage not available:', e);
        }
    }
};

// State
let darkMode = safeStorage.getItem('theme') === 'dark';
let currentMode = safeStorage.getItem('mode') || 'search';

// Initialize Theme
if (darkMode) {
    body.classList.add('dark-mode');
    if (themeToggle) {
        const themeText = themeToggle.querySelector('.theme-text');
        const themeIcon = themeToggle.querySelector('.icon-moon');
        if (themeText) themeText.textContent = "LIGHT";
        if (themeIcon) themeIcon.textContent = "☀️";
    }
}

// Initialize Logic
window.addEventListener('DOMContentLoaded', async () => {
    // Restore Mode
    switchMode(currentMode);

    // Restore Data
    if (currentMode === 'search') {
        const lastSearch = safeStorage.getItem('lastSearch');
        if (lastSearch) {
            searchInput.value = lastSearch;
            await handleSearch(lastSearch);
        }
    } else if (currentMode === 'battle') {
        const p1 = safeStorage.getItem('player1');
        const p2 = safeStorage.getItem('player2');
        if (p1) player1Input.value = p1;
        if (p2) player2Input.value = p2;

        if (p1 && p2) {
            await handleBattle(p1, p2);
        }
    }
});

// Event Listeners
if (searchForm) {
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = searchInput.value.trim();
        if (username) {
            safeStorage.setItem('lastSearch', username);
            await handleSearch(username);
        }
    });
}

if (battleForm) {
    battleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user1 = player1Input.value.trim();
        const user2 = player2Input.value.trim();

        if (user1 && user2) {
            safeStorage.setItem('player1', user1);
            safeStorage.setItem('player2', user2);
            await handleBattle(user1, user2);
        }
    });
}

if (modeSearch) modeSearch.addEventListener('click', () => switchMode('search'));
if (modeBattle) modeBattle.addEventListener('click', () => switchMode('battle'));
if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

// Handlers
function switchMode(mode) {
    currentMode = mode;
    safeStorage.setItem('mode', mode); // Save mode
    clearError();
    profileSection.classList.add('hidden'); // Clear previous results

    if (mode === 'search') {
        modeSearch.classList.add('active');
        modeBattle.classList.remove('active');
        searchForm.classList.remove('hidden');
        battleForm.classList.add('hidden');
    } else {
        modeSearch.classList.remove('active');
        modeBattle.classList.add('active');
        searchForm.classList.add('hidden');
        battleForm.classList.remove('hidden');
    }
}

async function handleSearch(username) {
    clearError();
    loading.classList.remove('hidden');
    profileSection.classList.add('hidden');
    profileSection.innerHTML = ''; // Clean slate

    try {
        const userData = await window.fetchUser(username);
        loading.classList.add('hidden');

        if (userData.message === "Not Found") {
            showError("User not found");
            return;
        }

        window.renderProfile(userData);

        // Level 2: Fetch Repos
        const repos = await window.fetchRepos(username);
        window.renderRepos(repos);

    } catch (error) {
        loading.classList.add('hidden');
        console.error(error);
        showError("An error occurred");
    }
}

async function handleBattle(u1, u2) {
    // Custom error for battle
    battleError.style.display = 'none';
    loading.classList.remove('hidden');
    profileSection.classList.add('hidden');
    profileSection.innerHTML = '';

    try {
        // Run both fetches in parallel
        const [data1, data2] = await Promise.all([
            window.fetchUser(u1),
            window.fetchUser(u2)
        ]);

        loading.classList.add('hidden');

        // Check for 404s
        if (data1.message === "Not Found" || data2.message === "Not Found") {
            const missing = [];
            if (data1.message === "Not Found") missing.push(u1);
            if (data2.message === "Not Found") missing.push(u2);
            battleError.textContent = `User not found: ${missing.join(', ')}`;
            battleError.style.display = 'block';
            return;
        }

        window.renderBattle(data1, data2);

        // Optional: Fetch repos for both if we wanted comparison on Stars (Level 3 requirement says Stars OR Followers)
        // Since we are using Followers for speed (available in user object), we skip repo fetch for now.

    } catch (error) {
        loading.classList.add('hidden');
        console.error(error);
        battleError.textContent = "Network error";
        battleError.style.display = 'block';
    }
}

function toggleTheme() {
    darkMode = !darkMode;
    body.classList.toggle('dark-mode');
    safeStorage.setItem('theme', darkMode ? 'dark' : 'light'); // Save theme

    const themeText = themeToggle.querySelector('.theme-text');
    const themeIcon = themeToggle.querySelector('.icon-moon'); // Just text for now

    if (darkMode) {
        themeText.textContent = "LIGHT";
        themeIcon.textContent = "☀️";
    } else {
        themeText.textContent = "DARK";
        themeIcon.textContent = "🌙";
    }
}

// Initial check (Optional: Default search)
// handleSearch('octocat');
