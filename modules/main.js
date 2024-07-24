import { updateLocalStorage, loadCardsFromLocalStorage } from './storage.js';
import { searchPhotos } from './photoSearch.js';
import { handleFormSubmit } from './formHandler.js';

// Add event listeners to form submission and buttons
document.querySelector("#destination_form").addEventListener("submit", handleFormSubmit);
document.querySelector("#reset_btn").addEventListener("click", resetCards);
document.querySelector("#search_photo_btn").addEventListener("click", searchPhotos);

// Load cards from local storage when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", loadCardsFromLocalStorage);

// Create a new destination card element
export function createDestinationCard(name, location, photoUrl, description) {
    const card = document.createElement("div");
    card.setAttribute("class", "card col-md-4");
    card.style.margin = "10px 0";
    card.id = `card-${Date.now()}`; // Assign a unique ID to the card

    const img = document.createElement("img");
    img.setAttribute("class", "card-img-top card-image"); // Add a class for styling
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
    cardEditBtn.setAttribute("class", "btn btn-warning");
    cardEditBtn.innerText = "Edit";
    cardEditBtn.addEventListener("click", editDestination);

    const cardDeleteBtn = document.createElement("button");
    cardDeleteBtn.setAttribute("class", "btn btn-danger");
    cardDeleteBtn.innerText = "Remove";
    cardDeleteBtn.addEventListener("click", removeDestination);

    buttonsContainer.appendChild(cardEditBtn);
    buttonsContainer.appendChild(cardDeleteBtn);

    cardBody.appendChild(buttonsContainer);
    card.appendChild(cardBody);

    return card;
}

// Edit a destination card
function editDestination(event) {
    const card = event.target.closest(".card"); // Get the card element
    const cardBody = card.querySelector(".card-body"); // Get the card body
    const title = cardBody.querySelector(".card-title"); // Get the title element
    const subTitle = cardBody.querySelector(".card-subtitle"); // Get the subtitle element
    const photoUrl = card.querySelector(".card-img-top"); // Get the image element

    // Populate form with current values
    document.querySelector("#destination_name").value = title.innerText;
    document.querySelector("#location_name").value = subTitle.innerText;
    document.querySelector("#photo_url").value = photoUrl.src;
    document.querySelector("#location_description").value = cardBody.querySelector(".card-text") ? cardBody.querySelector(".card-text").innerText : "";

    // Change form submission to update card
    document.querySelector("#destination_form").addEventListener("submit", function updateCard(event) {
        event.preventDefault();

        // Extract form values
        const newName = event.target.elements["destination_name"].value;
        const newLocation = event.target.elements["location_name"].value;
        const newPhotoUrl = event.target.elements["photo_url"].value;
        const newDesc = event.target.elements["location_description"].value;

        // Update card content
        title.innerText = newName;
        subTitle.innerText = newLocation;
        photoUrl.setAttribute("src", newPhotoUrl);
        if (cardBody.querySelector(".card-text")) {
            cardBody.querySelector(".card-text").innerText = newDesc;
        } else {
            const cardText = document.createElement("p");
            cardText.setAttribute("class", "card-text");
            cardText.innerText = newDesc;
            cardBody.appendChild(cardText);
        }

        // Remove form listener to prevent multiple bindings
        document.querySelector("#destination_form").removeEventListener("submit", updateCard);

        // Update local storage
        updateLocalStorage();
    });
}

// Remove a destination card
function removeDestination(event) {
    const card = event.target.closest(".card"); // Get the card element
    card.remove(); // Remove the card element
    updateLocalStorage(); // Update local storage
}

// Reset all cards and form
function resetCards() {
    const cardsContainer = document.querySelector("#cards_container");
    cardsContainer.innerHTML = ""; // Clear the cards container
    document.querySelector("#destination_form").reset(); // Reset the form fields
    document.querySelector("#photo_results").innerHTML = ''; // Clear photo search results
    localStorage.removeItem("destinations"); // Remove destinations from local storage
}
