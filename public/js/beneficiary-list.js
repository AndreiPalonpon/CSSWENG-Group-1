function formatDate(date) {
    let d = new Date(date);
    let fullMonth = d.getMonth() < 10 ? "0" + d.getMonth() : d.getMonth();
    let fullDate = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
    return d.getFullYear() + '-' + fullMonth + '-' + fullDate;
}

function setSelectedValue(selectObj, valueToSet) {
    for (let i = 0; i < selectObj.options.length; i++) {
        if (selectObj.options[i].text === valueToSet) {
            selectObj.options[i].selected = true;
            return;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const newMemberAddBtn = document.querySelector('.createBtn button'),
        darkBg = document.querySelector('.dark_bg'),
        popupForm = document.querySelector('.popup'),
        crossBtn = document.querySelector('.closeBtn'),
        submitBtn = document.querySelector('.submitBtn'),
        modalTitle = document.querySelector('.modal-title'),
        form = document.querySelector('#createBeneficiaryForm'),
        formInputFields = document.querySelectorAll('#createBeneficiaryForm input, #createBeneficiaryForm select');

    let originalData = localStorage.getItem('beneficiaries') ? JSON.parse(localStorage.getItem('beneficiaries')) : [];
    let getData = [...originalData];

    let isEdit = false,
        editId;

    document.getElementById("menu-toggle").addEventListener("click", function() {
        document.getElementById("wrapper").classList.toggle("toggled");
        document.querySelector(".main-content").classList.toggle("toggled");
        document.querySelector(".header-right").classList.toggle("toggled");
    });

    // Add event listeners to filter elements
    document.querySelectorAll('input[name="recipientSort"]').forEach(input => {
        input.addEventListener('change', applyFiltersAndSort);
    });
    document.querySelectorAll('input[name="statusFilter"]').forEach(input => {
        input.addEventListener('change', applyFiltersAndSort);
    });
    document.querySelectorAll('input[name="dateSort"]').forEach(input => {
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
        const beneficiary = {
            id: Date.now(),
            personRegistered: form.personRegistered.value,
            programEnrolled: form.programEnrolled.value,
            status: form.status.value,
            benefitDelivered: form.benefitDelivered.value,
            dateReceived: form.dateReceived.value
        };

        if (!isEdit) {
            originalData.push(beneficiary);
        } else {
            originalData[editId] = beneficiary;
        }

        $.post("/beneficiaries/create", beneficiary, (data, status, xhr) => {
            if (status === "success" && xhr.status === 201) {
                alert("Beneficiary has been created.");
                location.reload();
            }
        });

        localStorage.setItem('programs', JSON.stringify(originalData));
        getData = [...originalData];

        location.reload();
        darkBg.classList.remove('active');
        popupForm.classList.remove('active');
        form.reset();
    });

    document.getElementById("editBeneficiaryForm").addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission
        let beneficiary_id = document.getElementById("editBeneficiaryId").value;
        let person_registered = document.getElementById("editPersonRegistered").value;
        let program_enrolled = document.getElementById("editProgramEnrolled").value;
        let status = document.getElementById("editStatus").value;
        let benefit_delivered = document.getElementById("editBenefitDelivered").value;
        let date_received = document.getElementById("editDateReceived").value;

        let beneficiary = {
            id: beneficiary_id,
            person_registered: person_registered,
            program_enrolled: program_enrolled,
            status: status,
            benefit_delivered: benefit_delivered,
            date_received: date_received
        };

        $.post("/beneficiaries/edit", beneficiary, (data, status, xhr) => {
            if (status === "success" && xhr.status === 200) {
                let modalInstance = bootstrap.Modal.getInstance(document.getElementById("modal-beneficiary-edit"));
                if (modalInstance) {
                    modalInstance.hide();
                }
                alert("Beneficiary updated successfully.");
                location.reload();
            } else {
                alert("Error updating beneficiary");
            }
        }).fail(() => {
            alert("Error updating beneficiary");
        });
    });

    // Edit and delete event handlers
    function addEventListeners() {
        document.querySelectorAll('.editBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.closest("tr").getAttribute('data-beneficiary-id');
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
        e.preventDefault(); // Prevent default action
        let beneficiary_id = e.currentTarget.closest("tr").getAttribute("data-beneficiary-id");
        let person_registered = e.currentTarget.closest("tr").querySelector("td:nth-child(2)").textContent;
        let program_enrolled = e.currentTarget.closest("tr").querySelector("td:nth-child(3)").textContent;
        let status = e.currentTarget.closest("tr").querySelector("td:nth-child(4)").textContent;
        let benefit_delivered = e.currentTarget.closest("tr").querySelector("td:nth-child(5)").textContent;
        let date_received = e.currentTarget.closest("tr").querySelector("td:nth-child(6)").textContent;

        let modal_edit = document.getElementById("modal-beneficiary-edit");
        let modal_edit_id = modal_edit.querySelector("#editBeneficiaryId");
        let modal_edit_person_registered = modal_edit.querySelector("#editPersonRegistered");
        let modal_edit_program_enrolled = modal_edit.querySelector("#editProgramEnrolled");
        let modal_edit_status = modal_edit.querySelector("#editStatus");
        let modal_edit_benefit_delivered = modal_edit.querySelector("#editBenefitDelivered");
        let modal_edit_date_received = modal_edit.querySelector("#editDateReceived");

        modal_edit_id.value = beneficiary_id;
        modal_edit_person_registered.value = person_registered;
        modal_edit_program_enrolled.value = program_enrolled;
        modal_edit_status.value = status;
        modal_edit_benefit_delivered.value = benefit_delivered;
        modal_edit_date_received.value = formatDate(date_received);

        setSelectedValue(modal_edit_person_registered, person_registered);
        setSelectedValue(modal_edit_benefit_delivered, benefit_delivered);
        setSelectedValue(modal_edit_program_enrolled, program_enrolled);
    }



    function editInfo(id, e) {
        onBtnEditClick(e); // Populate form fields
        isEdit = true;
        editId = getData.findIndex(item => item.id === id);
        const beneficiary = getData[editId];
        if (beneficiary) {
            form.personRegistered.value = beneficiary.personRegistered;
            form.programEnrolled.value = beneficiary.programEnrolled;
            form.status.value = beneficiary.status;
            form.benefitDelivered.value = beneficiary.benefitDelivered;
            form.dateReceived.value = beneficiary.dateReceived;
            modalTitle.innerHTML = "Edit Beneficiary";
            formInputFields.forEach(input => input.disabled = false);
            submitBtn.style.display = "block";
            submitBtn.innerHTML = "Update";
            darkBg.classList.add('active');
            popupForm.classList.add('active');
        }
    }


    function deleteInfo(id, e) {
        if (confirm("Are you sure you want to delete this beneficiary?")) {
            originalData = originalData.filter(item => item.id !== id);
            localStorage.setItem('beneficiaries', JSON.stringify(originalData));

            $.post(`/beneficiaries/delete`, { beneficiary_id: id })
                .done((data, status, xhr) => {
                    if (status === "success" && xhr.status === 200) {
                        alert("Beneficiary has been deleted");
                        location.reload();
                    } else {
                        alert("Failed to delete beneficiary. Please try again.");
                    }
                })
                .fail((xhr, status, error) => {
                    alert("Error deleting beneficiary. Please try again later.");
                    console.error(error);
                });
        }
    }

    function applyFiltersAndSort() {
        const recipientSort = $('input[name="recipientSort"]:checked').val() || '';
        const statusFilter = $('input[name="statusFilter"]:checked').map(function() { return this.value; }).get().join(',');
        const dateSort = $('input[name="dateSort"]:checked').val() || '';
        const programId = '{{program._id}}'; // Adjust this as necessary

        let queryString = `?recipientSort=${recipientSort}&statusFilter=${statusFilter}&dateSort=${dateSort}&programId=${programId}`;

        console.log('Query String:', queryString);

        fetch(`/beneficiaries${queryString}`)
            .then(response => response.text())
            .then(html => {
                console.log('Received HTML:', html);
                const newDoc = new DOMParser().parseFromString(html, 'text/html');
                const newTableBody = newDoc.querySelector('.programInfo').innerHTML;
                document.querySelector('.programInfo').innerHTML = newTableBody;
                addEventListeners();
            })
            .catch(error => console.error('Error fetching filtered data:', error));
    }

    // Initialize event listeners
    addEventListeners();
});

/* Exporting to CSV function */
function downloadCSV(csv, filename) {
    let csvFile;
    let downloadLink;

    csvFile = new Blob([csv], {
        type: 'text/csv'
    });

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
        const row = [];
        const cols = rows[i].querySelectorAll('td, th');
        for (let j = 0; j < cols.length - 1; j++) { // Skip the last column
            const data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ');
            row.push('"' + data + '"');
        }
        csv.push(row.join(','));
    }
    downloadCSV(csv.join('\n'), filename);
}