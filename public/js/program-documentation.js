document.addEventListener('DOMContentLoaded', function () {
    const cardsContainer = document.getElementById('cards-documentation'); // Updated selector
    const showFormButton = document.getElementById('showFormButton');
    const addCardForm = document.getElementById('addCardForm');
    const addCardButton = document.getElementById('addCardButton');
    const cancelButton = document.getElementById('cancelButton');
    const imageInput = document.getElementById('imageInput');
    const descriptionInput = document.getElementById('descriptionInput');

    let isEditing = false;
    let currentEditingCard = null;

    
    showFormButton.addEventListener('click', () => {
        addCardForm.style.display = 'flex';
        showFormButton.style.display = 'none';
    });

    
    addCardButton.addEventListener('click', () => {
        const file = imageInput.files[0];
        const description = descriptionInput.value;

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                if (isEditing && currentEditingCard) {
                    
                    updateCard(currentEditingCard, e.target.result, description);
                } else {
                    
                    const card = document.createElement('div');
                    card.className = 'cardDocumentation'; 
                    card.innerHTML = `
                        <img src="${e.target.result}" alt="Card Image">
                        ${description ? `<p>${description}</p>` : ''}
                        <div class="cardDocumentation-buttons"> <!-- Updated class name -->
                            <button class="edit-button">Edit</button>
                            <button class="delete-button">Delete</button>
                        </div>
                    `;
                    cardsContainer.appendChild(card);
                    addCardEventListeners(card);
                }

                
                resetForm();
            };
            reader.readAsDataURL(file);
        } else if (isEditing && currentEditingCard) {
            
            updateCard(currentEditingCard, null, description);
            resetForm();
        } else {
            alert('Please select an image.');
        }
    });

    
    cancelButton.addEventListener('click', resetForm);

    function resetForm() {
        imageInput.value = '';
        descriptionInput.value = '';
        addCardForm.style.display = 'none';
        showFormButton.style.display = 'block';
        isEditing = false;
        currentEditingCard = null;
    }

    
    function addCardEventListeners(card) {
        const editButton = card.querySelector('.edit-button');
        const deleteButton = card.querySelector('.delete-button');

        editButton.addEventListener('click', () => {
            const img = card.querySelector('img');
            const p = card.querySelector('p');

            
            if (img) imageInput.files[0] = null;
            if (p) descriptionInput.value = p.innerText;

            isEditing = true;
            currentEditingCard = card;
            addCardForm.style.display = 'flex';
            showFormButton.style.display = 'none';
        });

        deleteButton.addEventListener('click', () => {
            const confirmDelete = confirm('Are you sure you want to delete this card?');
            if (confirmDelete) {
                card.remove();
            }
        });
    }

    
    function updateCard(card, imageSrc, description) {
        if (imageSrc) {
            const img = card.querySelector('img');
            if (img) {
                img.src = imageSrc;
            } else {
                const newImg = document.createElement('img');
                newImg.src = imageSrc;
                card.insertBefore(newImg, card.firstChild);
            }
        }

        const p = card.querySelector('p');
        if (description) {
            if (p) {
                p.innerText = description;
            } else {
                const newP = document.createElement('p');
                newP.innerText = description;
                card.appendChild(newP);
            }
        } else if (p) {
            p.remove();
        }
    }

   
    let isDown = false;
    let startX;
    let scrollLeft;

    
    cardsContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        cardsContainer.classList.add('active');
        startX = e.pageX - cardsContainer.offsetLeft;
        scrollLeft = cardsContainer.scrollLeft;
    });

    
    cardsContainer.addEventListener('mouseleave', () => {
        isDown = false;
        cardsContainer.classList.remove('active');
    });

    
    cardsContainer.addEventListener('mouseup', () => {
        isDown = false;
        cardsContainer.classList.remove('active');
    });

    
    cardsContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - cardsContainer.offsetLeft;
        const walk = (x - startX) * 3; // Scroll faster
        cardsContainer.scrollLeft = scrollLeft - walk;
    });
});
