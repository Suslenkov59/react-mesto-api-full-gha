class Api {
    constructor(config) {
        this._url = config.url;
        this._headers = config.headers;
    }

    /*проверка ответа с сервера*/
    _checkResponse(res) {
        if (res.ok) {
            return res.json()
        }
        return Promise.reject(`Ошибка: ${res.status}`)
    }

    _request(url, options) {
        return fetch(url, options).then(this._checkResponse)
    }

    /*инициализация карточек с сервера*/
    getInitialCards() {
        return this._request(`${this._url}cards`, {
            credentials: 'include',
            headers: this._headers
        })
    }

    /*добавление новой карочки*/
    addNewUserCard({ name, link }) {
        return this._request(`${this._url}cards`, {
            credentials: 'include',
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({ name, link })
        })
    }

    /*удаление карточки*/
    deleteCard(cardId) {
        return this._request(`${this._url}cards/${cardId}`, {
            credentials: 'include',
            method: 'DELETE',
            headers: this._headers
        })
    }

    /*получение данных пользователя*/
    getUserInfo() {
        return this._request(`${this._url}users/me`, {
            credentials: 'include',
            headers: this._headers
        })
    }

    /*отправка данных пользователя*/
    setUserInfoApi(userName, userAbout) {
        return this._request(`${this._url}users/me`, {
            credentials: 'include',
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                name: userName,
                about: userAbout
            })
        })
    }

    /*обновление аватара*/
    setUserAvatar(data) {
        return this._request(`${this._url}users/me/avatar`, {
            credentials: 'include',
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                avatar: data.avatar,
            })
        })
    }

    /*лайк*/
    changeLikeCardStatus(cardId, isLiked) {
        return this._request(`${this._url}cards/${cardId}/likes`, {
            credentials: 'include',
            method: `${isLiked ? 'PUT' : 'DELETE'}`,
            headers: this._headers
        })
    }
}

/*Api*/
export const api = new Api({
    url: 'https://api.antonsuslenkov.nomoredomains.work',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    }
})

