import {useEffect, useState} from 'react';
import {Route, Routes, Navigate, useNavigate} from 'react-router-dom';
import {api} from '../utils/Api'
import {apiAuth} from '../utils/auth'
import {CurrentUserContext} from '../contexts/CurrentUserContext'
import ProtectedRoute from "./ProtectedRoute";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from './EditProfilePopup'
import EditAvatarPopup from './EditAvatarPopup'
import AddPlacePopup from './AddPlacePopup'
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from './InfoTooltip'
import success from '../images/success.svg'
import unSuccess from '../images/unsuccess.svg'

function App() {
    const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false)
    const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false)
    const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false)
    const [selectedCard, handleCardClick] = useState(null)
    const [cards, setCards] = useState([])
    const [currentUser, setCurrentUser] = useState({})
    const [loggedIn, setLoggedIn] = useState(false)
    const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false)
    const [message, setMessage] = useState({imgPath: '', text: ''})
    const [email, setEmail] = useState('')

    const navigate = useNavigate();

    useEffect( () => {
        const token = localStorage.getItem('token');
        if (token) { Promise.all([ api.getUserInfo(), api.getInitialCards() ])
            .then(( [ userItem, initialCards] ) => {
                setCurrentUser(userItem);
                setCards(initialCards);
            })
            .catch( (err) => { console.log(`Возникла глобальная ошибка, ${err}`) })
        }
    }, [loggedIn])

    useEffect( () => {
        const token = localStorage.getItem('userToken');
        if (token) { apiAuth.getContent(token)
            .then( (res) => { setLoggedIn(true); setEmail(res.email); navigate('/') })
            .catch( (err) => { localStorage.removeItem('userToken'); console.log(`Возникла ошибка верификации токена, ${err}`) })
        }
    }, [navigate("/"), loggedIn])

    function handleRegistration(password, email) {
        apiAuth.register(password, email)
            .then((result) => {
                setEmail(result.data.email)
                setMessage({imgPath: success, text: 'Вы успешно зарегистрировались!'})
            })
            .catch(() => setMessage({imgPath: unSuccess, text: 'Что-то пошло не так! Попробуйте ещё раз.'}))
            .finally(() => setIsInfoTooltipOpen(true))
    }

    function handleAuth(password, email) {
        apiAuth.authorize(password, email)
            .then((token) => {
                apiAuth.getContent(token)
                    .then((res) => {
                        setEmail(email)
                        setLoggedIn(true)
                        navigate("/")
                    })
            })
            .catch((err) => console.log(err))
    }

    function onSignOut() {
        localStorage.removeItem('jwt')
        setLoggedIn(false)
        setCards([])
        setCurrentUser({})
        navigate("/")
    }

    function handleEditAvatarClick() {
        setEditAvatarPopupOpen(true)
    }

    function handleEditProfileClick() {
        setEditProfilePopupOpen(true)
    }

    function handleAddPlaceClick() {
        setAddPlacePopupOpen(true)
    }

    function closeAllPopups() {
        setEditAvatarPopupOpen(false)
        setEditProfilePopupOpen(false)
        setAddPlacePopupOpen(false)
        setIsInfoTooltipOpen(false)
        handleCardClick(null)
    }

    function onCardClick(card) {
        handleCardClick(card)
    }

    function handleUpdateUser(userItem) {
        api.setUserInfoApi(userItem.name, userItem.about)
            .then((data) => {
                setCurrentUser(data)
                closeAllPopups()
            })
            .catch((err) => console.log(err))
    }

    function handleUpdateAvatar(userData) {
        api.setUserAvatar(userData)
            .then((data) => {
                setCurrentUser(data)
                closeAllPopups()
            })
            .catch((err) => console.log(err))
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some((like) => like === currentUser._id );
        api.changeLikeCardStatus(card._id, !isLiked)
            .then( (cardItem) => {
                setCards( (listCards) => listCards.map( (item) => (item._id === card._id ? cardItem : item) ) );
            })
            .catch((err) => console.log(err))
    }

    function handleCardDelete(card) {
        api.deleteCard(card._id)
            .then( () => {
                setCards( (listCards) => listCards.filter((cardItem) => cardItem._id !== card._id));
            })
            .catch((err) => console.log(err))
    }

    function handleAddPlaceSubmit(cardData) {
        api.addNewUserCard(cardData)
            .then((newCard) => {
                setCards([newCard, ...cards])
                closeAllPopups()
            })
            .catch((err) => console.log(err))
    }

    return (
        <div>
            <CurrentUserContext.Provider value={currentUser}>

                <Header
                    loggedIn={loggedIn}
                    email={email}
                    onSignOut={onSignOut}
                />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute
                                element={Main}
                                loggedIn={loggedIn}
                                onEditAvatar={handleEditAvatarClick}
                                onEditProfile={handleEditProfileClick}
                                onAddPlace={handleAddPlaceClick}
                                onCardClick={onCardClick}
                                onCardLike={handleCardLike}
                                onCardDelete={handleCardDelete}
                                cards={cards}
                            />
                        }
                    />
                    <Route
                        path="/sign-up"
                        element={<Register
                            isOpen={isEditProfilePopupOpen}
                            onRegister={handleRegistration}
                            isInfoTooltipOpen={isInfoTooltipOpen}
                        />}
                    />
                    <Route
                        path="/sign-in"
                        element={
                            <Login
                                isOpen={isEditProfilePopupOpen}
                                onAuth={handleAuth}
                            />
                        }
                    />
                    <Route path="*" element={<Navigate to="/"/>}/>
                </Routes>
                < Footer/>
                <InfoTooltip
                    name='tooltip'
                    isOpen={isInfoTooltipOpen}
                    onClose={closeAllPopups}
                    title={message.text}
                    imgPath={message.imgPath}
                />
                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}
                    onUpdateUser={handleUpdateUser}
                />
                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}
                    onAddPlace={handleAddPlaceSubmit}
                />
                <EditAvatarPopup
                    isOpen={isEditAvatarPopupOpen}
                    onClose={closeAllPopups}
                    onUpdateAvatar={handleUpdateAvatar}
                />
                <PopupWithForm
                    name='confirm-delete'
                    title='Вы уверены?'
                    buttonText='Да'
                />
                < ImagePopup
                    card={selectedCard}
                    onClose={closeAllPopups}
                />

            </CurrentUserContext.Provider>
        </div>
    );
}

export default App;

