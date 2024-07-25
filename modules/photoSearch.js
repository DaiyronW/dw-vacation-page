const accessKey = 'otqPnZBr0OmO5x6vgGuPZKCpEshS3Ezt9Iz-HUbR9zs';

// Search for photos using the Unsplash API for create form
export function searchCreatePhotos(event) {
    const form = document.querySelector('#destination_form');
    const query = form.querySelector("#photo_search").value.trim();
    const photoResults = form.querySelector("#photo_results");
    photoResults.innerHTML = '';

    console.log('Create search query:', query); // Log the search query to debug

    if (!query) {
        console.error('Search query cannot be empty');
        return;
    }

    fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.results && Array.isArray(data.results)) {
                const photos = data.results;
                photos.forEach(photo => {
                    const img = document.createElement("img");
                    img.src = photo.urls.small;
                    img.alt = photo.alt_description;
                    img.classList.add("photo-result");
                    img.style.width = "100px";
                    img.style.height = "auto";
                    img.style.margin = "5px";

                    img.addEventListener("click", () => {
                        form.querySelector("#photo_url").value = photo.urls.regular;
                        form.querySelectorAll(".photo-result").forEach(p => p.classList.remove("selected"));
                        img.classList.add("selected");
                    });

                    photoResults.appendChild(img);
                });
            } else {
                console.error('No results found or results is not an array:', data);
            }
        })
        .catch(error => console.error('Error fetching photos from Unsplash:', error));
}

// Search for photos using the Unsplash API for edit form
export function searchEditPhotos(event) {
    const form = document.querySelector('#edit_form');
    const query = form.querySelector("#edit_photo_search").value.trim();
    const photoResults = form.querySelector("#edit_photo_results");
    photoResults.innerHTML = '';

    console.log('Edit search query:', query); // Log the search query to debug

    if (!query) {
        console.error('Search query cannot be empty');
        return;
    }

    fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.results && Array.isArray(data.results)) {
                const photos = data.results;
                photos.forEach(photo => {
                    const img = document.createElement("img");
                    img.src = photo.urls.small;
                    img.alt = photo.alt_description;
                    img.classList.add("photo-result");
                    img.style.width = "100px";
                    img.style.height = "auto";
                    img.style.margin = "5px";

                    img.addEventListener("click", () => {
                        form.querySelector("#edit_photo_url").value = photo.urls.regular;
                        form.querySelectorAll(".photo-result").forEach(p => p.classList.remove("selected"));
                        img.classList.add("selected");
                    });

                    photoResults.appendChild(img);
                });
            } else {
                console.error('No results found or results is not an array:', data);
            }
        })
        .catch(error => console.error('Error fetching photos from Unsplash:', error));
}

// Reset form fields and photo search results
export function resetFormValues(form) {
    form.reset(); // Reset the form fields
    form.querySelector(".photo-results").innerHTML = ''; // Clear photo search results
}
