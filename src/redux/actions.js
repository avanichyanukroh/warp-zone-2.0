import axios from 'axios';

const PROXY_URL = "https://cors-anywhere.herokuapp.com/";

export const LOAD_POPULAR_GAMES = 'LOAD_POPULAR_GAMES';
export const loadPopularGames = (popularGames) => ({
	type: LOAD_POPULAR_GAMES,
	popularGames
});

export const LOAD_GAME_PROFILE = 'LOAD_GAME_PROFILE';
export const loadGameProfile = (gameProfile) => ({
	type: LOAD_GAME_PROFILE,
	gameProfile
});

export const LOAD_NEW_RELEASES = 'LOAD_NEW_RELEASES';
export const loadNewReleases = (newReleases) => ({
	type: LOAD_NEW_RELEASES,
	newReleases
});

export const LOAD_COMING_SOONS = 'LOAD_COMING_SOONS';
export const loadComingSoons = (comingSoons) => ({
	type: LOAD_COMING_SOONS,
	comingSoons
});

export const LOAD_GAME_SEARCH_RESULTS = 'LOAD_GAME_SEARCH_RESULTS';
export const loadGameSearchResults = (gameSearchResults) => ({
	type: LOAD_GAME_SEARCH_RESULTS,
	gameSearchResults
});

export const getPopularGames = () => dispatch => {
    axios({
        url: PROXY_URL + 'https://api-v3.igdb.com/games',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': 'e3a95dd164fdc12b9eb483624161e322'
        },
        data: `
            fields
                name,
                popularity,
                screenshots.image_id,
                rating,
                genres.name;
            sort
                popularity desc;`
    })
    .then(res => {
        dispatch(loadPopularGames(res.data));
    })
    .catch(err => {
        console.error(err);
    });
}

export const getGameProfile = (gameId) => dispatch => {
    axios({
        url: PROXY_URL + 'https://api-v3.igdb.com/games',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': 'e3a95dd164fdc12b9eb483624161e322'
        },
        data: `
            fields
                *,
                screenshots.image_id,
                cover.image_id,
                genres.name,
                platforms.abbreviation,
                involved_companies.company.name,
                player_perspectives.name,
                game_modes.name,
                themes.name,
                game_engines.name,
                collection.name,
                franchise.name,
                release_dates.date,
                release_dates.platform.abbreviation,
                age_ratings.rating,
                similar_games.name,
                similar_games.cover,
                similar_games.first_release_date,
                similar_games.rating,
                videos.video_id;
            where
                id=${gameId};`
    })
    .then(res => {
        dispatch(loadGameProfile(res.data));
    })
    .catch(err => {
        console.error(err);
    });
}

export const getGameProfiles = (gameIds) => dispatch => {
    return axios({
        url: PROXY_URL + 'https://api-v3.igdb.com/games',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': 'e3a95dd164fdc12b9eb483624161e322'
        },
        data: `
            fields
                *,
                screenshots.*,
                cover.image_id,
                genres.name,
                platforms.abbreviation,
                release_dates.*,
                videos.video_id,
                involved_companies.company.name;
            where
                id=(${gameIds});`
    })
    .then(res => {
        return res.data;
    })
    .catch(err => {
        console.error(err);
    });
}

export const getNewReleases = () => dispatch => {
    axios({
        url: PROXY_URL + 'https://api-v3.igdb.com/release_dates',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': 'e3a95dd164fdc12b9eb483624161e322'
        },
        data: `
            fields
                *;
                   where
                       date < 1558655459;
                   sort
                       date desc;`
    })
    .then(res => {
        console.log(res.data)
        let newReleaseIds = [];

        res.data.forEach(result => {
            newReleaseIds.push(result.game);
        });
        return dispatch(getGameProfiles(newReleaseIds));
    })
    .then(newReleases => {
        dispatch(loadNewReleases(newReleases));
    })
    .catch(err => {
        console.error(err);
    });
}

export const getComingSoons = () => dispatch => {
    axios({
        url: PROXY_URL + 'https://api-v3.igdb.com/release_dates',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': 'e3a95dd164fdc12b9eb483624161e322'
        },
        data: `
            fields
                *;
            where
                date > ${Date.now()};
            sort
                date asc;`
    })
    .then(res => {
        let comingSoonIds = [];

        res.data.forEach(result => {
            comingSoonIds.push(result.id);
        });

        return getGameProfiles(comingSoonIds);
    })
    .then(comingSoons => {
        dispatch(loadComingSoons(comingSoons));
    })
    .catch(err => {
        console.error(err);
    });
}

export const getGameSearchResults = (query, limit) => dispatch => {
    dispatch(loadGameSearchResults(null));
    axios({
        url: PROXY_URL + 'https://api-v3.igdb.com/games',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': 'e3a95dd164fdc12b9eb483624161e322'
        },
        data: `
            fields
                *,
                cover.image_id,
                genres.name,
                platforms.abbreviation,
                involved_companies.company.name,
                release_dates.date;
            search
                "${query}";
            where
                version_parent = null;
            limit
                ${limit};`
    })
    .then(res => {
        dispatch(loadGameSearchResults(res.data));
    })
    .catch(err => {
        console.error(err);
    });
}