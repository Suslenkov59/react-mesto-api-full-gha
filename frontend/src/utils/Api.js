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
        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            }
        }).then(this._checkResponse)
    }

    /*инициализация карточек с сервера*/
    getInitialCards() {
        return this._request(`${this._url}cards`, {
            headers: this._headers,
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            "Content-Type": "application/json",
        })
    }

    /*добавление новой карочки*/
    addNewUserCard({ name, link }) {
        return this._request(`${this._url}cards`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({ name, link }),
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            "Content-Type": "application/json",
        })
    }

    /*удаление карточки*/
    deleteCard(cardId) {
        return this._request(`${this._url}cards/${cardId}`, {
            method: 'DELETE',
            headers: this._headers,
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            "Content-Type": "application/json",
        })
    }

    /*получение данных пользователя*/
    getUserInfo() {
        return this._request(`${this._url}users/me`, {
            headers: this._headers,
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            "Content-Type": "application/json",
        })
    }

    /*отправка данных пользователя*/
    setUserInfoApi(userName, userAbout) {
        return this._request(`${this._url}users/me`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                name: userName,
                about: userAbout

            }),
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            "Content-Type": "application/json",
        })
    }

    /*обновление аватара*/
    setUserAvatar(data) {
        return this._request(`${this._url}users/me/avatar`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                avatar: data.avatar,
            }),
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            "Content-Type": "application/json",
        })
    }

    /*лайк*/
    changeLikeCardStatus(cardId, isLiked) {
        return this._request(`${this._url}cards/${cardId}/likes`, {
            method: `${isLiked ? 'PUT' : 'DELETE'}`,
            headers: this._headers,
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            "Content-Type": "application/json",
        })
    }
}

/*Api*/
export const api = new Api({
    url: 'https://api.antonsuslenkov.nomoredomains.work/',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json",
    },
})

