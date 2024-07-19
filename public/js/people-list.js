document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("menu-toggle").addEventListener("click", function() {
        document.getElementById("wrapper").classList.toggle("toggled");
        document.querySelector(".main-content").classList.toggle("toggled");
        document.querySelector(".header-right").classList.toggle("toggled");
    });

    // Add event listeners to filter elements
    document.querySelectorAll('input[name="firstNameSort"]').forEach(input => {
        input.addEventListener('change', applyFiltersAndSort);
    });
    document.querySelectorAll('input[name="lastNameSort"]').forEach(input => {
        input.addEventListener('change', applyFiltersAndSort);
    });
    document.querySelectorAll('input[name="genderFilter"]').forEach(input => {
        input.addEventListener('change', applyFiltersAndSort);
    });
    document.querySelectorAll('input[name="birthdateSort"]').forEach(input => {
        input.addEventListener('change', applyFiltersAndSort);
    });
    document.querySelectorAll('input[name="barangayFilter"]').forEach(input => {
        input.addEventListener('change', applyFiltersAndSort);
    });
    document.querySelectorAll('input[name="disabilityTypeFilter"]').forEach(input => {
        input.addEventListener('change', applyFiltersAndSort);
    });

    $('#resetFiltersButton').on('click', function() {
        $('#filter-form')[0].reset();
        applyFiltersAndSort();
    });

    const newMemberAddBtn = document.querySelector('.createBtn button'),
        darkBg = document.querySelector('.dark_bg'),
        popupForm = document.querySelector('.popup'),
        crossBtn = document.querySelector('.btn-close'),
        submitBtn = document.querySelector('.submitBtn'),
        modalTitle = document.querySelector('.modal-title'),
        form = document.querySelector('#createPeopleForm'),
        formInputFields = document.querySelectorAll('#createPeopleForm input, #createPeopleForm select'),
        resetFiltersButton = document.getElementById('resetFiltersButton');

    let originalData = localStorage.getItem('programs') ? JSON.parse(localStorage.getItem('programs')) : [];
    let getData = [...originalData];

    let isEdit = false,
        editId;

    newMemberAddBtn.addEventListener('click', () => {
        isEdit = false;
        submitBtn.innerHTML = "Submit";
        modalTitle.innerHTML = "Fill the Form";
        form.reset();
        formInputFields.forEach(input => input.disabled = false);
        submitBtn.style.display = "block";
    });

    crossBtn.addEventListener('click', () => {
        form.reset();
        submitBtn.style.display = "block";
        formInputFields.forEach(input => input.disabled = false);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const now = new Date();
        const person = {
            id: Date.now(),
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            gender: form.gender.value,
            birthdate: form.birthdate.value,
            address: form.address.value,
            barangay: form.barangay.value,
            contactNumber: form.contactNumber.value,
            disabilityType: form.disabilityType.value,
            disability: form.disability.value,
            pwd_card_id_no: form.pwd_card_id_no.value,
            recent_pwd_id_update_date: form.recent_pwd_id_update_date.value,
        };

        if (!isEdit) {
            originalData.push(person);
        } else {
            originalData[editId] = person;
        }

        $.post("/people/create", person, (data, status, xhr) => {
            if (status === "success" && xhr.status === 201) {
                alert("Person has been created.");
                location.reload();
            }
        });

        localStorage.setItem('person', JSON.stringify(originalData));
        getData = [...originalData];

        location.reload();
        darkBg.classList.remove('active');
        popupForm.classList.remove('active');
        form.reset();
    });

    function addEventListeners() {
        document.querySelectorAll('.deleteBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                deleteInfo(id, e);
            });
        });
    }

    function deleteInfo(id, e) {
        if (confirm("Are you sure you want to delete this person?")) {
            originalData = originalData.filter(item => item.id !== id);
            localStorage.setItem('people', JSON.stringify(originalData));

            $.post(`/people/delete`, { person_id: id })
                .done((data, status, xhr) => {
                    if (status === "success" && xhr.status === 200) {
                        alert("Person has been deleted.");
                        location.reload();
                    } else {
                        alert("Failed to delete person. Please try again.");
                    }
                }).fail((xhr, status, error) => {
                    alert("Error deleting person. Please try again later.");
                    console.error(error);
                });
        }
    }

    function applyFiltersAndSort() {
        const firstNameSort = $('input[name="firstNameSort"]:checked').val();
        const lastNameSort = $('input[name="lastNameSort"]:checked').val();
        const genderFilter = $('input[name="genderFilter"]:checked').val();
        const birthdateSort = $('input[name="birthdateSort"]:checked').val();
        const barangayFilter = $('input[name="barangayFilter"]:checked').map(function() { return this.value; }).get();
        const disabilityTypeFilter = $('input[name="disabilityTypeFilter"]:checked').map(function() { return this.value; }).get();

        let query = [];

        if (firstNameSort) query.push(`firstNameSort=${firstNameSort}`);
        if (lastNameSort) query.push(`lastNameSort=${lastNameSort}`);
        if (genderFilter) query.push(`genderFilter=${genderFilter}`);
        if (birthdateSort) query.push(`birthdateSort=${birthdateSort}`);
        if (barangayFilter.length) query.push(`barangayFilter=${barangayFilter.join(',')}`);
        if (disabilityTypeFilter.length) query.push(`disabilityTypeFilter=${disabilityTypeFilter.join(',')}`);

        const queryString = query.length > 0 ? `?${query.join('&')}` : '';

        fetch(`/people${queryString}`)
            .then(response => response.text())
            .then(html => {
                const newDoc = new DOMParser().parseFromString(html, 'text/html');
                const newTableBody = newDoc.querySelector('tbody').innerHTML;
                document.querySelector('tbody').innerHTML = newTableBody;
                addEventListeners();
            })
            .catch(error => console.error('Error fetching filtered data:', error));
    }

    addEventListeners();
});

function downloadCSV(csv, filename) {
    let csvFile;
    let downloadLink;
    csvFile = new Blob([csv], { type: 'text/csv' });

    downloadLink = document.createElement('a');
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

function exportTableToCSV(filename) {
    const rows = document.querySelectorAll('.table-container table tr');
    let csv = [];
    for (let i = 0; i < rows.length; i++) {
        const row = [],
            cols = rows[i].querySelectorAll('td, th');
        for (let j = 0; j < cols.length; j++) {
            const data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ');
            row.push('"' + data + '"');
        }
        csv.push(row.join(','));
    }
    downloadCSV(csv.join('\n'), filename);
}
