class AuthApi {
    constructor(apiAddress) {
        this._authUrl = apiAddress;
    }

    _checkResponse(res) {
        if (res.ok) {
            return res.json()
        }
        return Promise.reject(`Ошибка: ${res.status}`)
    }

    register(password, email) {
        return fetch(`${this._authUrl}/signup`, {
            credentials: 'include',
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({password, email})
        })
            .then(this._checkResponse)
    }

    authorize(password, email) {
        return fetch(`${this._authUrl}/signin`, {
            credentials: 'include',
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({password, email})
        })
            .then(this._checkResponse)
            .then((data) => {
                if (data.userToken) {
                    localStorage.setItem('userToken', data.token)
                }
            })
    }

    getContent(token) {
        return fetch(`${this._authUrl}/users/me`, {
            credentials: 'include',
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then(this._checkResponse)
    }
}

export const apiAuth = new AuthApi('https://api.antonsuslenkov.nomoredomains.work');
