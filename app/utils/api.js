const BASE_URL = "https://reqres.in/api";

export const fetchUsers = async () => {
    try {
        const res = await fetch(`${BASE_URL}/users?page=2`);
        if (!res.ok) throw new Error('Network response was not ok');
        const json = await res.json();
        return json.data ?? [];
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return [];
    }
};

export const loginUser = async (username, password) => {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "x-api-key": "reqres-free-v1", },
        body: JSON.stringify({ email: username, password }),
    });

    if (!response.ok) throw new Error('Помилка авторизації');
    return await response.json();
};
