(function () {
    const BASE_URL = 'https://api.github.com/users';

    window.fetchUser = async function (username) {
        const response = await fetch(`${BASE_URL}/${username}`);
        // Note: GitHub API returns 404 for not found, but we want to parse the JSON error message sometimes.
        // However, fetch doesn't throw on 404.
        const data = await response.json();
        return data;
    };

    window.fetchRepos = async function (username) {
        // Sorting by updated is part of Level 2
        const response = await fetch(`${BASE_URL}/${username}/repos?sort=updated&per_page=5`);
        const data = await response.json();
        return data;
    };
})();
