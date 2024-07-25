import { saveCardToLocalStorage, loadCardsFromLocalStorage, updateLocalStorage } from './storage.js';
import { searchCreatePhotos, searchEditPhotos } from './photoSearch.js';

document.querySelector("#destination_form").addEventListener("submit", handleFormSubmit);
document.querySelector("#reset_btn").addEventListener("click", resetCards);
document.querySelector("#search_photo_btn").addEventListener("click", searchCreatePhotos);
document.querySelector("#edit_search_photo_btn").addEventListener("click", searchEditPhotos);

document.addEventListener("DOMContentLoaded", loadCardsFromLocalStorage);

function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const destinationName = form.elements["destination_name"].value;
    const destinationLocation = form.elements["location_name"].value;
    const destinationPhoto = form.elements["photo_url"].value;
    const destinationDesc = form.elements["location_description"].value;

    if (form.dataset.editing) {
        const cardToUpdate = document.querySelector(`.card[data-id="${form.dataset.cardId}"]`);
        updateDestinationCard(cardToUpdate, destinationName, destinationLocation, destinationPhoto, destinationDesc);
    } else {
        const destinationCard = createDestinationCard(destinationName, destinationLocation, destinationPhoto, destinationDesc);
        document.querySelector("#cards_container").appendChild(destinationCard);
        saveCardToLocalStorage(destinationName, destinationLocation, destinationPhoto, destinationDesc);
    }

    resetFormValues(form);
}

function resetFormValues(form) {
    form.reset();
    document.querySelector("#photo_results").innerHTML = '';
    delete form.dataset.editing;
    delete form.dataset.cardId;
}

export function createDestinationCard(name, location, photoUrl, description) {
    const card = document.createElement("div");
    card.setAttribute("class", "card col-md-4");
    card.setAttribute("data-id", Date.now());
    card.style.margin = "10px 0";

    const img = document.createElement("img");
    img.setAttribute("class", "card-img-top");
    img.setAttribute("alt", name);
    img.setAttribute("src", photoUrl);
    card.appendChild(img);

    const cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");

    const cardTitle = document.createElement("h5");
    cardTitle.setAttribute("class", "card-title");
    cardTitle.innerText = name;
    cardBody.appendChild(cardTitle);

    const cardSubtitle = document.createElement("h6");
    cardSubtitle.setAttribute("class", "card-subtitle");
    cardSubtitle.innerText = location;
    cardBody.appendChild(cardSubtitle);

    if (description.length !== 0) {
        const cardText = document.createElement("p");
        cardText.setAttribute("class", "card-text");
        cardText.innerText = description;
        cardBody.appendChild(cardText);
    }

    const buttonsContainer = document.createElement("div");
    buttonsContainer.setAttribute("class", "buttons_container");

    const cardEditBtn = document.createElement("button");
    cardEditBtn.setAttribute("class", "btn btn-warning edit-btn");
    cardEditBtn.innerText = "Edit";
    cardEditBtn.addEventListener("click", () => openEditModal(card));

    const cardDeleteBtn = document.createElement("button");
    cardDeleteBtn.setAttribute("class", "btn btn-danger delete-btn");
    cardDeleteBtn.innerText = "Remove";
    cardDeleteBtn.addEventListener("click", () => removeDestination(card));

    buttonsContainer.appendChild(cardEditBtn);
    buttonsContainer.appendChild(cardDeleteBtn);

    cardBody.appendChild(buttonsContainer);
    card.appendChild(cardBody);

    return card;
}

function updateDestinationCard(card, name, location, photoUrl, description) {
    card.querySelector(".card-title").innerText = name;
    card.querySelector(".card-subtitle").innerText = location;
    card.querySelector(".card-img-top").src = photoUrl;
    if (description.length !== 0) {
        if (!card.querySelector(".card-text")) {
            const cardText = document.createElement("p");
            cardText.setAttribute("class", "card-text");
            cardText.innerText = description;
            card.querySelector(".card-body").appendChild(cardText);
        } else {
            card.querySelector(".card-text").innerText = description;
        }
    } else if (card.querySelector(".card-text")) {
        card.querySelector(".card-text").remove();
    }
    updateLocalStorage();
}

function openEditModal(card) {
    const editForm = document.querySelector("#edit_form");
    const cardId = card.dataset.id;
    editForm.elements["edit_destination_name"].value = card.querySelector(".card-title").innerText;
    editForm.elements["edit_location_name"].value = card.querySelector(".card-subtitle").innerText;
    editForm.elements["edit_photo_url"].value = card.querySelector(".card-img-top").src;
    editForm.elements["edit_location_description"].value = card.querySelector(".card-text") ? card.querySelector(".card-text").innerText : "";
    editForm.dataset.cardId = cardId;
    const editModal = new bootstrap.Modal(document.getElementById("editCardModal"));
    editModal.show();
}

document.querySelector("#edit_form").addEventListener("submit", function(event) {
    event.preventDefault();
    const form = event.target;
    const cardId = form.dataset.cardId;
    const cardToUpdate = document.querySelector(`.card[data-id="${cardId}"]`);

    const updatedName = form.elements["edit_destination_name"].value;
    const updatedLocation = form.elements["edit_location_name"].value;
    const updatedPhotoUrl = form.elements["edit_photo_url"].value;
    const updatedDescription = form.elements["edit_location_description"].value;

    updateDestinationCard(cardToUpdate, updatedName, updatedLocation, updatedPhotoUrl, updatedDescription);

    const editModal = bootstrap.Modal.getInstance(document.getElementById("editCardModal"));
    editModal.hide();
});

function removeDestination(card) {
    card.remove();
    updateLocalStorage();
}

function resetCards() {
    document.querySelector("#cards_container").innerHTML = '';
    document.querySelector("#destination_form").reset();
    document.querySelector("#photo_results").innerHTML = '';
    localStorage.removeItem("destinations");
}
