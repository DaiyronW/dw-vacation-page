// Your Unsplash API access key
const accessKey = 'otqPnZBr0OmO5x6vgGuPZKCpEshS3Ezt9Iz-HUbR9zs';

// Add event listeners to form submission and buttons
document.querySelector("#destination_form").addEventListener("submit", handleFormSubmit);
document.querySelector("#reset_btn").addEventListener("click", resetCards);
document.querySelector("#search_photo_btn").addEventListener("click", searchPhotos);

// Load cards from local storage when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", loadCardsFromLocalStorage);

// Handle the form submission
function handleFormSubmit(event) {
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

// Reset form fields and photo search results
function resetFormValues(form) {
    form.reset(); // Reset the form fields
    document.querySelector("#photo_results").innerHTML = ''; // Clear photo search results
}

// Create a new destination card element
function createDestinationCard(name, location, photoUrl, description) {
    // Create card container
    const card = document.createElement("div");
    card.setAttribute("class", "card col-md-4");
    card.style.margin = "10px 0";

    // Create and set card image
    const img = document.createElement("img");
    img.setAttribute("class", "card-img-top");
    img.setAttribute("alt", name);
    img.setAttribute("src", photoUrl); // Set image source
    card.appendChild(img);

    // Create card body
    const cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");

    // Create and set card title
    const cardTitle = document.createElement("h5");
    cardTitle.setAttribute("class", "card-title");
    cardTitle.innerText = name;
    cardBody.appendChild(cardTitle);

    // Create and set card subtitle
    const cardSubtitle = document.createElement("h6");
    cardSubtitle.setAttribute("class", "card-subtitle mb-2 text-muted");
    cardSubtitle.innerText = location;
    cardBody.appendChild(cardSubtitle);

    // Create and set card description (if provided)
    if (description.length !== 0) {
        const cardText = document.createElement("p");
        cardText.setAttribute("class", "card-text");
        cardText.innerText = description;
        cardBody.appendChild(cardText);
    }

    // Create buttons container
    const buttonsContainer = document.createElement("div");
    buttonsContainer.setAttribute("class", "buttons_container");

    // Create and set edit button
    const cardEditBtn = document.createElement("button");
    cardEditBtn.setAttribute("class", "btn btn-warning");
    cardEditBtn.innerText = "Edit";
    cardEditBtn.addEventListener("click", editDestination); // Add click event listener for editing

    // Create and set remove button
    const cardDeleteBtn = document.createElement("button");
    cardDeleteBtn.setAttribute("class", "btn btn-danger");
    cardDeleteBtn.innerText = "Remove";
    cardDeleteBtn.addEventListener("click", removeDestination); // Add click event listener for removing

    // Append buttons to buttons container
    buttonsContainer.appendChild(cardEditBtn);
    buttonsContainer.appendChild(cardDeleteBtn);

    // Append buttons container and card body to the card
    cardBody.appendChild(buttonsContainer);
    card.appendChild(cardBody);

    return card; // Return the created card element
}

// Search for photos using the Unsplash API
function searchPhotos() {
    const query = document.querySelector("#photo_search").value; // Get the search query
    const photoResults = document.querySelector("#photo_results");
    photoResults.innerHTML = ''; // Clear previous search results

    // Fetch photos from Unsplash API
    fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}`)
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            const photos = data.results; // Get the results array
            photos.forEach(photo => {
                // Create an image element for each photo
                const img = document.createElement("img");
                img.src = photo.urls.small; // Set image URL
                img.alt = photo.alt_description; // Set alt text
                img.classList.add("photo-result");
                img.style.width = "100px"; // Set image width
                img.style.height = "auto"; // Set image height
                img.style.margin = "5px"; // Add margin

                // Add click event listener to select the photo
                img.addEventListener("click", () => {
                    document.querySelector("#photo_url").value = photo.urls.regular; // Set selected photo URL
                    photoResults.innerHTML = ''; // Clear search results after selection
                });

                // Append image to the photo results container
                photoResults.appendChild(img);
            });
        })
        .catch(error => {
            console.error('Error fetching photos from Unsplash:', error); // Log any errors
        });
}

// Edit a destination card
function editDestination(event) {
    const cardBody = event.target.parentElement.parentElement; // Get the card body
    const title = cardBody.children[0]; // Get the title element
    const subTitle = cardBody.children[1]; // Get the subtitle element
    const card = cardBody.parentElement; // Get the card container
    const photoUrl = card.children[0]; // Get the image element

    // Prompt user for new values
    const newTitle = window.prompt("Enter new name");
    const newSubtitle = window.prompt("Enter new location");
    const newPhotoUrl = window.prompt("Enter new photo URL");

    // Update values if provided
    if (newTitle.length > 0) {
        title.innerText = newTitle;
    }

    if (newSubtitle.length > 0) {
        subTitle.innerText = newSubtitle;
    }

    if (newPhotoUrl.length > 0) {
        photoUrl.setAttribute("src", newPhotoUrl);
    }

    updateLocalStorage(); // Update local storage with new values
}

// Remove a destination card
function removeDestination(event) {
    const cardBody = event.target.parentElement.parentElement; // Get the card body
    const card = cardBody.parentElement; // Get the card container
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

// Save a card to local storage
function saveCardToLocalStorage(name, location, photoUrl, description) {
    const destinations = JSON.parse(localStorage.getItem("destinations")) || []; // Get existing destinations
    destinations.push({ name, location, photoUrl, description }); // Add new destination
    localStorage.setItem("destinations", JSON.stringify(destinations)); // Save updated destinations
}

// Load cards from local storage
function loadCardsFromLocalStorage() {
    const destinations = JSON.parse(localStorage.getItem("destinations")) || []; // Get existing destinations
    destinations.forEach(({ name, location, photoUrl, description }) => {
        const destinationCard = createDestinationCard(name, location, photoUrl, description); // Create a card for each destination
        const cardsContainer = document.querySelector("#cards_container");
        cardsContainer.appendChild(destinationCard); // Append the card to the container
    });
}

// Update local storage after changes
function updateLocalStorage() {
    const cardsContainer = document.querySelector("#cards_container");
    const cards = cardsContainer.querySelectorAll(".card"); // Get all card elements
    const destinations = [];

    cards.forEach(card => {
        const name = card.querySelector(".card-title").innerText; // Get card name
        const location = card.querySelector(".card-subtitle").innerText; // Get card location
        const photoUrl = card.querySelector(".card-img-top").src; // Get card photo URL
        const description = card.querySelector(".card-text") ? card.querySelector(".card-text").innerText : ""; // Get card description

        destinations.push({ name, location, photoUrl, description }); // Add card data to destinations array
    });

    localStorage.setItem("destinations", JSON.stringify(destinations)); // Save updated destinations to local storage
}
