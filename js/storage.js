const STORAGE_KEY = 'memory_game_leaderboard';

export function getLeaderboardLS() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        const parsedData = data ? JSON.parse(data) : [];
        return Array.isArray(parsedData) ? parsedData : [];
    } catch {
        return [];
    }
}

export function saveResultInLS(moves) {
    const records = getLeaderboardLS();

    const now = new Date();
    const date = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`
    const timestamp = now.getTime(); // время в мс от  января 1970 года

    const newResult = {
        moves,
        date,
        timestamp
    };
    records.push(newResult);

    records.sort((prev, next) => {
        if (prev.moves === next.moves) {
            return prev.timestamp - next.timestamp;
        }
        return prev.moves - next.moves;
    });

    const top10 = records.slice(0, 10);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(top10));
}