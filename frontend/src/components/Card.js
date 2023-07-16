import React from 'react'
import { CurrentUserContext } from '../contexts/CurrentUserContext'

function Card(props) {

    const currentUser = React.useContext(CurrentUserContext)
    const isOwn = props.card.owner === currentUser._id
    const isLiked = currentUser && currentUser._id && Array.isArray(props.card.likes) && props.card.likes.some(i => i === currentUser._id);

    const cardDeleteButtonClassName = (
        `element__delete-button ${isOwn ? '' : 'element__delete-button_hidden'}`
    )
    const cardLikeButtonClassName  = (
        `element__like ${isLiked && 'element__like_active'}`
    )

    function handleClick() {
        props.onCardClick(props.card)
    }

    function handleLikeClick() {
        props.onCardLike(props.card)
    }

    function handleDeleteClick() {
        props.onCardDelete(props.card)
    }

    return (
        <div className="element">
            {props.card.link && props.card.name ? (
                <>
                    <button className={cardDeleteButtonClassName} type="button" onClick={handleDeleteClick}></button>
                    <img className="element__image" src={props.card.link} alt={props.card.name} onClick={handleClick}/>
                    <div className="element__description">
                        <h2 className="element__name">{props.card.name}</h2>
                        <div className="element__like-area">
                            <button className={cardLikeButtonClassName} type="button" onClick={handleLikeClick}></button>
                            <p className="element__like-counter">{Array.isArray(props.card.likes) && props.card.likes.length}</p>
                        </div>
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default Card
