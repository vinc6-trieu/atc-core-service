function addMoreImages() {
    const galleryContainer = document.querySelector('.row.col-12.form-group.d-block');

    // Clone the template for the image input field
    const imageTemplate = document.querySelector('.col-4.form-group');
    const newImage = imageTemplate.cloneNode(true);

    // Clear the previous image selection if needed
    const imgElement = newImage.querySelector('.gallery-image');
    imgElement.src = '/noimage.jpg'; // Reset image source

    // Clear the hidden input field value
    const hiddenInput = newImage.querySelector('input[type="hidden"]');
    hiddenInput.value = '';

    // Update IDs and onclick attribute
    const newIndex = galleryContainer.querySelectorAll('.col-4.form-group').length;
    const newInputId = `input-thumbnail${newIndex}`;
    const newImgOnclick = `openGallery(this, '#${newInputId}')`;

    imgElement.setAttribute('onclick', newImgOnclick);
    imgElement.setAttribute('id', `gallery-image${newIndex}`);
    hiddenInput.setAttribute('id', newInputId);

    // Add the cloned image input field to the gallery container
    galleryContainer.appendChild(newImage);
}

function clearImage(button, index) {
    // Reset image source
    const imgElement = button.nextElementSibling;
    imgElement.src = "/noimage.jpg";

    // Clear the hidden input field value
    const hiddenInput = imgElement.nextElementSibling;
    hiddenInput.value = '';
}
