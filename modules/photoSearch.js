// Your Unsplash API access key
const accessKey = 'otqPnZBr0OmO5x6vgGuPZKCpEshS3Ezt9Iz-HUbR9zs';

// Search for photos using the Unsplash API
export function searchPhotos() {
    const query = document.querySelector("#photo_search").value;
    const photoResults = document.querySelector("#photo_results");

    // Fetch photos from Unsplash API
    fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}`)
        .then(response => response.json())
        .then(data => {
            const photos = data.results;
            photoResults.innerHTML = ''; // Clear previous search results

            photos.forEach(photo => {
                // Create an image element for each photo
                const img = document.createElement("img");
                img.src = photo.urls.small;
                img.alt = photo.alt_description;
                img.classList.add("photo-result");
                img.style.width = "100px";
                img.style.height = "auto";
                img.style.margin = "5px";

                // Add click event listener to select the photo
                img.addEventListener("click", () => {
                    // Remove 'selected' class from all photos
                    document.querySelectorAll(".photo-result").forEach(p => p.classList.remove("selected"));

                    // Add 'selected' class to the clicked photo
                    img.classList.add("selected");
                    
                    // Set selected photo URL
                    document.querySelector("#photo_url").value = photo.urls.regular;

                    // Keep the selected photo visible in the results
                    photoResults.innerHTML = '';
                    photoResults.appendChild(img);
                });

                // Append image to the photo results container
                photoResults.appendChild(img);
            });
        })
        .catch(error => {
            console.error('Error fetching photos from Unsplash:', error);
        });
}

// Reset form fields and photo search results
export function resetFormValues(form) {
    form.reset(); // Reset the form fields
    document.querySelector("#photo_results").innerHTML = ''; // Clear photo search results
}
