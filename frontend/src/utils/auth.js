export const BASE_URL = 'https://api.antonsuslenkov.nomoredomains.work'

const handleResponse = response => response.ok ? response.json() : Promise.reject(`Ошибка ${response.status}`)

export const register = (password, email) => {
    return fetch(`${BASE_URL}/signup`, {
        credentials: 'include',
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({password, email})
    })
        .then(handleResponse)
}

export const authorize = (password, email) => {
    return fetch(`${BASE_URL}/signin`, {
        credentials: 'include',
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({password, email})
    })
        .then(handleResponse)
        .then((data) => {
            if (data.token) {
                localStorage.setItem('jwt', data.token)
                return data.token
            }
        })
}

export const logout = () => {
    return fetch(`${BASE_URL}/logout`, {
        credentials: 'include',
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export const getContent = token => {
    return fetch(`${BASE_URL}/users/me`, {
        credentials: 'include',
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`
        }
    })
        .then(handleResponse)
}
