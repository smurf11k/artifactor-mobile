export const fetchUsers = async () => {
    const res = await fetch("https://reqres.in/api/users?per_page=12");
    const json = await res.json();
    return json.data;
};

export const loginUser = async (username, password) => {
    const response = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password }),
    });

    if (!response.ok) throw new Error('Помилка авторизації');
    return await response.json();
};