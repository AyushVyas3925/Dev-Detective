(function () {
    const profileSection = document.getElementById('profileSection');
    const searchError = document.getElementById('searchError');

    // Helper to generate Card HTML string
    function generateProfileHTML(user) {
        const {
            avatar_url, name, login, created_at, bio,
            public_repos, followers, following, location,
            blog, twitter_username, company
        } = user;

        const date = new Date(created_at);
        const dateString = `Joined ${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        const check = (val) => val ? val : 'Not Available';

        return `
            <div class="profile-card">
                <img src="${avatar_url}" alt="${login}" class="avatar">
                
                <div class="profile-header">
                    <div class="profile-name">
                        <h2>${name || login}</h2>
                        <a href="https://github.com/${login}" target="_blank">@${login}</a>
                    </div>
                    <p class="joined-date">${dateString}</p>
                </div>
                
                <p class="bio">${bio || 'This profile has no bio'}</p>
                
                <div class="stats-container">
                    <div class="stat">
                        <h4>Repos</h4>
                        <p>${public_repos}</p>
                    </div>
                    <div class="stat">
                        <h4>Followers</h4>
                        <p>${followers}</p>
                    </div>
                    <div class="stat">
                        <h4>Following</h4>
                        <p>${following}</p>
                    </div>
                </div>

                <div class="links-container">
                    <div class="link-item ${!location || location === '' ? 'dim' : ''}">
                        <span class="icon">📍</span> ${check(location)}
                    </div>
                    <div class="link-item ${!blog || blog === '' ? 'dim' : ''}">
                        <span class="icon">🔗</span> ${blog ? `<a href="${blog.startsWith('http') ? blog : 'https://' + blog}" target="_blank">${blog}</a>` : 'Not Available'}
                    </div>
                    <div class="link-item ${!twitter_username || twitter_username === '' ? 'dim' : ''}">
                        <span class="icon">🐦</span> ${check(twitter_username)}
                    </div>
                    <div class="link-item ${!company || company === '' ? 'dim' : ''}">
                        <span class="icon">🏢</span> ${check(company)}
                    </div>
                </div>
            </div>
        `;
    }

    window.renderProfile = function (user) {
        profileSection.innerHTML = generateProfileHTML(user);
        profileSection.classList.remove('hidden');
    };

    window.renderBattle = function (user1, user2) {
        // Basic Comparison Metric: Followers + Repos (simplified)
        // Or just Followers as per Level 3 hint "Total repository stars OR follower count"
        // We don't have stars unless we fetch all repos, which is expensive. Let's use Followers + Public Repos.
        const score1 = user1.followers + user1.public_repos;
        const score2 = user2.followers + user2.public_repos;

        let winner1 = false;
        let winner2 = false;

        if (score1 > score2) winner1 = true;
        else if (score2 > score1) winner2 = true;

        const html1 = generateProfileHTML(user1);
        const html2 = generateProfileHTML(user2);

        profileSection.innerHTML = `
            <div class="battle-arena">
                <div class="battle-card ${winner1 ? 'winner-card' : 'loser-card'}">
                    ${winner1 ? '<div class="winner-badge">WINNER 👑</div>' : ''}
                    ${html1}
                </div>
                <div class="battle-card ${winner2 ? 'winner-card' : 'loser-card'}">
                    ${winner2 ? '<div class="winner-badge">WINNER 👑</div>' : ''}
                    ${html2}
                </div>
            </div>
        `;
        profileSection.classList.remove('hidden');
    };

    window.renderRepos = function (repos) {
        // Check if repos exist
        if (!repos || repos.length === 0) {
            // Could append a "No Repos" message or just do nothing
            return;
        }

        // Create container if not already in main structure (it's not, we append it to profile or new section)
        // The design usually puts it below the profile.
        // Let's create a generic container inside the profileSection or append to it.
        // For cleaner DOM, let's append a new div to profileSection

        const repoList = document.createElement('div');
        repoList.classList.add('repo-list');

        // Sort logic handled in API call? 
        // Wait, API call request asked for `?sort=updated`. 
        // But Requirements Level 2 says "Sort repositories by latest update date" and "Limit display to top 5".
        // My api.js already does `per_page=5` and `sort=updated`.

        const repoItems = repos.map(repo => {
            return `
                <a href="${repo.html_url}" target="_blank" class="repo-item">
                    <div class="repo-info">
                        <div class="repo-name">${repo.name}</div>
                        <div class="repo-date">Updated ${new Date(repo.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                    <div class="repo-stars">⭐ ${repo.stargazers_count}</div>
                </a>
            `;
        }).join('');

        repoList.innerHTML = repoItems;
        profileSection.appendChild(repoList);
    };

    window.showError = function (msg) {
        searchError.textContent = msg;
        searchError.style.display = 'block';
    };

    window.clearError = function () {
        searchError.style.display = 'none';
    };
})();
