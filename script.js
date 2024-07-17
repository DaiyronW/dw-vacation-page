document.querySelector("#destination_form").addEventListener("submit", handleFormSubmit);
document.querySelector("#reset_btn").addEventListener("click", resetCards);

function handleFormSubmit(event) {
    event.preventDefault();

    const destinationName = event.target.elements["destination_name"].value;
    const destinationLocation = event.target.elements["location_name"].value;
    const destinationPhoto = event.target.elements["photo_url"].value;
    const destinationDesc = event.target.elements["location_description"].value;

    resetFormValues(event.target);

    const destinationCard = createDestinationCard(destinationName, destinationLocation, destinationPhoto, destinationDesc);

    const cardsContainer = document.querySelector("#cards_container");
    cardsContainer.appendChild(destinationCard);
}

function resetFormValues(form) {
    form.reset();
}

function createDestinationCard(name, location, photoUrl, description) {
    const card = document.createElement("div");
    card.setAttribute("class", "card col-md-4");
    card.style.margin = "10px 0";

    const img = document.createElement("img");
    img.setAttribute("class", "card-img-top");
    img.setAttribute("alt", name);
    const constantPhotoUrl = "https://cavchronicle.org/wp-content/uploads/2018/03/top-travel-destination-for-visas-900x504.jpg";
    img.setAttribute("src", photoUrl.length === 0 ? constantPhotoUrl : photoUrl);
    card.appendChild(img);

    const cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");

    const cardTitle = document.createElement("h5");
    cardTitle.setAttribute("class", "card-title");
    cardTitle.innerText = name;
    cardBody.appendChild(cardTitle);

    const cardSubtitle = document.createElement("h6");
    cardSubtitle.setAttribute("class", "card-subtitle mb-2 text-muted");
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

function editDestination(event) {
    const cardBody = event.target.parentElement.parentElement;
    const title = cardBody.children[0];
    const subTitle = cardBody.children[1];
    const card = cardBody.parentElement;
    const photoUrl = card.children[0];

    const newTitle = window.prompt("Enter new name");
    const newSubtitle = window.prompt("Enter new location");
    const newPhotoUrl = window.prompt("Enter new photo url");

    if (newTitle.length > 0) {
        title.innerText = newTitle;
    }

    if (newSubtitle.length > 0) {
        subTitle.innerText = newSubtitle;
    }

    if (newPhotoUrl.length > 0) {
        photoUrl.setAttribute("src", newPhotoUrl);
    }
}

function removeDestination(event) {
    const cardBody = event.target.parentElement.parentElement;
    const card = cardBody.parentElement;
    card.remove();
}

function resetCards() {
    const cardsContainer = document.querySelector("#cards_container");
    cardsContainer.innerHTML = "";
    document.querySelector("#destination_form").reset();
}
