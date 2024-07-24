import { createDestinationCard } from './main.js';
import { saveCardToLocalStorage } from './storage.js';
import { resetFormValues } from './photoSearch.js';

// Handle the form submission
export function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Extract form values
    const destinationName = event.target.elements["destination_name"].value;
    const destinationLocation = event.target.elements["location_name"].value;
    const destinationPhoto = event.target.elements["photo_url"].value;
    const destinationDesc = event.target.elements["location_description"].value;

    resetFormValues(event.target); // Reset the form fields

    // Create a new destination card
    const destinationCard = createDestinationCard(destinationName, destinationLocation, destinationPhoto, destinationDesc);

    // Append the card to the cards container
    const cardsContainer = document.querySelector("#cards_container");
    cardsContainer.appendChild(destinationCard);

    // Save the card to local storage
    saveCardToLocalStorage(destinationName, destinationLocation, destinationPhoto, destinationDesc);
}
