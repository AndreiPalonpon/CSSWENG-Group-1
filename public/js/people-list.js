function formatDate(date) {
    let d = new Date(date);
    let fullMonth = d.getMonth() < 10 ? "0" + d.getMonth() : d.getMonth();
    let fullDate = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
    return d.getFullYear() + '-' + fullMonth + '-' + fullDate;
}

document.addEventListener('DOMContentLoaded', function() {
    const newMemberAddBtn = document.querySelector('.createBtn button'),
        darkBg = document.querySelector('.dark_bg'),
        popupForm = document.querySelector('.popup'),
        crossBtn = document.querySelector('.closeBtn'),
        submitBtn = document.querySelector('.submitBtn'),
        modalTitle = document.querySelector('.modal-title'),
        form = document.querySelector('#createPeopleForm'),
        formInputFields = document.querySelectorAll('#createPeopleForm input, #createPeopleForm select');

    let originalData = localStorage.getItem('programs') ? JSON.parse(localStorage.getItem('programs')) : [];
    let getData = [...originalData];
    
    let isEdit = false,
        editId;

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

        localStorage.setItem('programs', JSON.stringify(originalData));
        getData = [...originalData];

        darkBg.classList.remove('active');
        popupForm.classList.remove('active');
        form.reset();
    });

    document.getElementById("editPeopleForm").addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission
        let people_id = document.getElementById("editPeopleId").value;
        let people_firstName = document.getElementById("editFirstName").value;
        let people_lastName = document.getElementById("editLastName").value;
        let people_gender = document.getElementById("editGender").value;
        let people_birthdate = document.getElementById("editBirthdate").value;
        let people_address = document.getElementById("editAddress").value;
        let people_barangay = document.getElementById("editBarangay").value;
        let people_contactNumber = document.getElementById("editContactNumber").value;
        let people_disabilityType = document.getElementById("editDisabilityType").value;
        let people_disability = document.getElementById("editDisability").value;
        let people_pwd_card_id_no = document.getElementById("editPwdCardIdNo").value;
        let people_recent_pwd_id_update_date = document.getElementById("editRecentPwdIdUpdateDate").value;

        let people = {
            id: people_id,
            first_name: people_firstName,
            last_name: people_lastName,
            gender: people_gender,
            birthdate: people_birthdate,
            address: people_address,
            barangay: people_barangay,
            contact_number: people_contactNumber,
            disability_type: people_disabilityType,
            disability: people_disability,
            pwd_card_id_no: people_pwd_card_id_no,
            recent_pwd_id_update_date: people_recent_pwd_id_update_date,
        };

        $.post("/people/edit", people, (data, status, xhr) => {
            if (status === "success" && xhr.status === 200) {
                let modalInstance = bootstrap.Modal.getInstance(document.getElementById("modal-people-edit"));
                modalInstance.hide(); // Hide the modal
                alert("Update person successfully.");
                location.reload(); 
            } else {
                alert("Error updating person");
            }
        }).fail(() => {
            alert("Error updating person");
        });
    });

    function addEventListeners() {
        document.querySelectorAll('.editBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.closest("tr").getAttribute('data-person-id');
                editInfo(id, e);
            });
        });
        document.querySelectorAll('.deleteBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                deleteInfo(id, e);
            });
        });
    }

    function onBtnEditClick(e) {
        e.preventDefault(); // Prevent default form submission
        let people_id = e.currentTarget.closest("tr").getAttribute("data-person-id");
        let people_firstName = e.currentTarget.closest("tr").querySelector("td:nth-child(2)").textContent;
        let people_lastName = e.currentTarget.closest("tr").querySelector("td:nth-child(3)").textContent;
        let people_gender = e.currentTarget.closest("tr").querySelector("td:nth-child(4)").textContent;
        let people_birthdate = e.currentTarget.closest("tr").querySelector("td:nth-child(5)").textContent;
        let people_address = e.currentTarget.closest("tr").querySelector("td:nth-child(6)").textContent;
        let people_barangay = e.currentTarget.closest("tr").querySelector("td:nth-child(7)").textContent;
        let people_contactNumber = e.currentTarget.closest("tr").querySelector("td:nth-child(8)").textContent;
        let people_disabilityType = e.currentTarget.closest("tr").querySelector("td:nth-child(9)").textContent;
        let people_disability = e.currentTarget.closest("tr").querySelector("td:nth-child(10)").textContent;
        let people_pwd_card_id_no = e.currentTarget.closest("tr").querySelector("td:nth-child(11)").textContent;
        let people_recent_pwd_id_update_date = e.currentTarget.closest("tr").querySelector("td:nth-child(12)").textContent;

        let modal_edit = document.getElementById("modal-people-edit");
        let modal_edit_id = modal_edit.querySelector("#editPeopleId");
        let modal_edit_firstName = modal_edit.querySelector("#editFirstName");
        let modal_edit_lastName = modal_edit.querySelector("#editLastName");
        let modal_edit_gender = modal_edit.querySelector("#editGender");
        let modal_edit_birthdate = modal_edit.querySelector("#editBirthdate");
        let modal_edit_address = modal_edit.querySelector("#editAddress");
        let modal_edit_barangay = modal_edit.querySelector("#editBarangay");
        let modal_edit_contactNumber = modal_edit.querySelector("#editContactNumber");
        let modal_edit_disabilityType = modal_edit.querySelector("#editDisabilityType");
        let modal_edit_disability = modal_edit.querySelector("#editDisability");
        let modal_edit_pwd_card_id_no = modal_edit.querySelector("#editPwdCardIdNo");
        let modal_edit_recent_pwd_id_update_date = modal_edit.querySelector("#editRecentPwdIdUpdateDate");

        modal_edit_id.value = people_id;
        modal_edit_firstName.value = people_firstName;
        modal_edit_lastName.value = people_lastName;
        modal_edit_gender.value = people_gender;
        modal_edit_birthdate.value = formatDate(people_birthdate);
        modal_edit_address.value = people_address;
        modal_edit_barangay.value = people_barangay;
        modal_edit_contactNumber.value = people_contactNumber;
        modal_edit_disabilityType.value = people_disabilityType;
        modal_edit_disability.value = people_disability;
        modal_edit_pwd_card_id_no.value = people_pwd_card_id_no;
        modal_edit_recent_pwd_id_update_date.value = formatDate(people_recent_pwd_id_update_date);
    }

    function editInfo(id, e) {
        onBtnEditClick(e);
        isEdit = true;
        editId = getData.findIndex(item => item.id === parseInt(id, 10));
        const person = getData[editId];
        if (person) {
            form.firstName.value = person.firstName;
            form.lastName.value = person.lastName;
            form.gender.value = person.gender;
            form.birthdate.value = person.birthdate;
            form.address.value = person.address;
            form.barangay.value = person.barangay;
            form.contactNumber.value = person.contactNumber;
            form.disabilityType.value = person.disabilityType;
            form.disability.value = person.disability;
            form.pwd_card_id_no.value = person.pwd_card_id_no;
            form.recent_pwd_id_update_date.value = person.recent_pwd_id_update_date;
            modalTitle.innerHTML = "Edit Person";
            formInputFields.forEach(input => input.disabled = false);
            submitBtn.innerHTML = "Update";
            darkBg.classList.add('active');
            popupForm.classList.add('active');
        }
    }

    function deleteInfo(id, e) {
        if (confirm("Are you sure you want to delete this person?")) {
            originalData = originalData.filter(item => item.id !== parseInt(id, 10));
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
    // Initialize event listeners
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
