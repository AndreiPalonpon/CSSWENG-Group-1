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

    const newPeopleAddBtn = document.querySelector('.addPeopleBtn button'),
        darkBg = document.querySelector('.dark_bg'),
        popupForm = document.querySelector('.popup'),
        crossBtn = document.querySelector('.btn-close'),
        submitBtn = document.querySelector('.submitPeopleBtn'),
        modalTitle = document.querySelector('.modal-title'),
        form = document.querySelector('#peopleForm'),
        formInputFields = document.querySelectorAll('#peopleForm input, #peopleForm select'),
        resetFiltersButton = document.getElementById('resetFiltersButton');

    let originalData = localStorage.getItem('people') ? JSON.parse(localStorage.getItem('people')) : [];
    let getData = [...originalData];

    let isEdit = false,
        editId;

    newPeopleAddBtn.addEventListener('click', () => {
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

        localStorage.setItem('people', JSON.stringify(originalData));
        getData = [...originalData];

        location.reload();
        darkBg.classList.remove('active');
        popupForm.classList.remove('active');
        form.reset();
    });

    function addEventListeners() {
        document.querySelectorAll('.editBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
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

    document.getElementById("editPeopleForm").addEventListener('submit', (e) => {
        let person_id = document.getElementById("editPersonId").value;
        let first_name = document.getElementById("editFirstName").value;
        let last_name = document.getElementById("editLastName").value;
        let gender = document.getElementById("editGender").value;
        let birthdate = document.getElementById("editBirthdate").value;
        let address = document.getElementById("editAddress").value;
        let barangay = document.getElementById("editBarangay").value;
        let contact_number = document.getElementById("editContactNumber").value;
        let disability_type = document.getElementById("editDisabilityType").value;
        let disability = document.getElementById("editDisability").value;
        let pwd_card_id_no = document.getElementById("editPwdCardIdNo").value;
        let recent_pwd_id_update_date = document.getElementById("editRecentPwdIdUpdateDate").value;

        let person = {
            person_id: person_id,
            first_name: first_name,
            last_name: last_name,
            gender: gender,
            birthdate: birthdate,
            address: address,
            barangay: barangay,
            contact_number: contact_number,
            disability_type: disability_type,
            disability: disability,
            pwd_card_id_no: pwd_card_id_no,
            recent_pwd_id_update_date: recent_pwd_id_update_date,
        };

        e.preventDefault();

        $.post("/people/edit", person, (data, status, xhr) => {
            if (status === "success" && xhr.status === 200) {
                let modalInstance = bootstrap.Modal.getInstance(document.getElementById("modal-people-edit"));
                modalInstance.hide(); // Hide the modal
                alert("Update person successfully.");
            } else {
                alert("Error updating person");
            }
        }).fail(() => {
            alert("Error updating person");
        });
    });

    function onBtnEditClick(e) {
        let person_id = e.currentTarget.closest("tr").getAttribute("data-id");
        let first_name = e.currentTarget.closest("tr").querySelector(".person-firstname").textContent;
        let last_name = e.currentTarget.closest("tr").querySelector(".person-lastname").textContent;
        let gender = e.currentTarget.closest("tr").querySelector(".person-gender").textContent;
        let birthdate = e.currentTarget.closest("tr").querySelector(".person-birthdate").textContent;
        let address = e.currentTarget.closest("tr").querySelector(".person-address").textContent;
        let barangay = e.currentTarget.closest("tr").querySelector(".person-barangay").textContent;
        let contact_number = e.currentTarget.closest("tr").querySelector(".person-contactnumber").textContent;
        let disability_type = e.currentTarget.closest("tr").querySelector(".person-disabilitytype").textContent;
        let disability = e.currentTarget.closest("tr").querySelector(".person-disability").textContent;
        let pwd_card_id_no = e.currentTarget.closest("tr").querySelector(".person-pwdcardidno").textContent;
        let recent_pwd_id_update_date = e.currentTarget.closest("tr").querySelector(".person-recentpwdidupdatedate").textContent;

        let modal_edit = document.getElementById("modal-people-edit");
        let modal_edit_id = modal_edit.querySelector("#editPersonId");
        let modal_edit_first_name = modal_edit.querySelector("#editFirstName");
        let modal_edit_last_name = modal_edit.querySelector("#editLastName");
        let modal_edit_gender = modal_edit.querySelector("#editGender");
        let modal_edit_birthdate = modal_edit.querySelector("#editBirthdate");
        let modal_edit_address = modal_edit.querySelector("#editAddress");
        let modal_edit_barangay = modal_edit.querySelector("#editBarangay");
        let modal_edit_contact_number = modal_edit.querySelector("#editContactNumber");
        let modal_edit_disability_type = modal_edit.querySelector("#editDisabilityType");
        let modal_edit_disability = modal_edit.querySelector("#editDisability");
        let modal_edit_pwd_card_id_no = modal_edit.querySelector("#editPwdCardIdNo");
        let modal_edit_recent_pwd_id_update_date = modal_edit.querySelector("#editRecentPwdIdUpdateDate");

        modal_edit_id.value = person_id;
        modal_edit_first_name.value = first_name;
        modal_edit_last_name.value = last_name;
        modal_edit_gender.value = gender;
        modal_edit_birthdate.value = birthdate;
        modal_edit_address.value = address;
        modal_edit_barangay.value = barangay;
        modal_edit_contact_number.value = contact_number;
        modal_edit_disability_type.value = disability_type;
        modal_edit_disability.value = disability;
        modal_edit_pwd_card_id_no.value = pwd_card_id_no;
        modal_edit_recent_pwd_id_update_date.value = recent_pwd_id_update_date;
    }

    function editInfo(id, e) {
        onBtnEditClick(e);
        isEdit = true;
        editId = getData.findIndex(item => item.id === id);
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
            submitBtn.style.display = "block";
            submitBtn.innerHTML = "Update";
            darkBg.classList.add('active');
            popupForm.classList.add('active');
        }
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
