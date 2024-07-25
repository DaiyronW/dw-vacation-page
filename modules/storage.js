import { createDestinationCard } from './main.js';

// Save a card to local storage
export function saveCardToLocalStorage(name, location, photoUrl, description) {
    const destinations = JSON.parse(localStorage.getItem("destinations")) || [];
    destinations.push({ name, location, photoUrl, description });
    localStorage.setItem("destinations", JSON.stringify(destinations));
}

// Load cards from local storage
export function loadCardsFromLocalStorage() {
    const destinations = JSON.parse(localStorage.getItem("destinations")) || [];
    destinations.forEach(({ name, location, photoUrl, description }) => {
        const destinationCard = createDestinationCard(name, location, photoUrl, description);
        document.querySelector("#cards_container").appendChild(destinationCard);
    });
}

// Update local storage with current cards
export function updateLocalStorage() {
    const cardsContainer = document.querySelector("#cards_container");
    const cards = cardsContainer.querySelectorAll(".card");
    const destinations = [];

    cards.forEach(card => {
        const name = card.querySelector(".card-title").innerText;
        const location = card.querySelector(".card-subtitle").innerText;
        const photoUrl = card.querySelector(".card-img-top").src;
        const description = card.querySelector(".card-text") ? card.querySelector(".card-text").innerText : "";

        destinations.push({ name, location, photoUrl, description });
    });

    localStorage.setItem("destinations", JSON.stringify(destinations));
}
