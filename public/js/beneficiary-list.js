document.addEventListener('DOMContentLoaded', function() {
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

    var newMemberAddBtn = document.querySelector('.createBtn button'),
        darkBg = document.querySelector('.dark_bg'),
        popupForm = document.querySelector('.popup'),
        crossBtn = document.querySelector('.closeBtn'),
        submitBtn = document.querySelector('.submitBtn'),
        modalTitle = document.querySelector('.modalTitle'),
        form = document.querySelector('#createBeneficiaryForm'),
        formInputFields = document.querySelectorAll('#createBeneficiaryForm input, #createBeneficiaryForm select'),
        programInfo = document.querySelector('.programInfo'),
        resetFiltersButton = document.getElementById('resetFiltersButton');

    let originalData = localStorage.getItem('beneficiaries') ? JSON.parse(localStorage.getItem('beneficiaries')) : [];
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
        darkBg.classList.add('active');
        popupForm.classList.add('active');
    });

    crossBtn.addEventListener('click', () => {
        darkBg.classList.remove('active');
        popupForm.classList.remove('active');
        form.reset();
        submitBtn.style.display = "block";
        formInputFields.forEach(input => input.disabled = false);
    });

    function addEventListeners() {
        document.querySelectorAll('.editBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                editInfo(id);
            });
        });

        document.querySelectorAll('.deleteBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                deleteInfo(id, e);
            });
        });
    }

    function editInfo(id) {
        isEdit = true;
        editId = getData.findIndex(item => item.id === id);
        const beneficiary = getData[editId];
        if (beneficiary) {
            form.firstName.value = beneficiary.firstName;
            form.lastName.value = beneficiary.lastName;
            form.dob.value = beneficiary.dob;
            form.gen.value = beneficiary.gen;
            form.contactNo.value = beneficiary.contactNo;
            form.brgy.value = beneficiary.brgy;
            form.disability.value = beneficiary.disability;
            form.comor.value = beneficiary.comor;
            form.pwdIdCardNo.value = beneficiary.pwdIdCardNo;
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
            console.log(id);
            // Remove item from localStorage
            originalData = originalData.filter(item => item.id !== id);
            localStorage.setItem('beneficiaries', JSON.stringify(originalData));

            // Make a copy of originalData if needed
            let getData = [...originalData];

            // Handle deletion via AJAX request
            $.post(`/beneficiaries/delete`, {beneficiary_id: id})
                .done((data, status, xhr) => {
                    // Check if deletion was successful
                    if (status === "success" && xhr.status === 200) {
                        // Display success message
                        let index = e?.currentTarget?.closest("tr")?.querySelector("td:first-child")?.textContent;
                        if (index) {
                            alert("Beneficiary has been deleted");
                            location.reload();
                        }
                    } else {
                        // Handle deletion failure
                        alert("Failed to delete beneficiary. Please try again.");
                    }
                })
                .fail((xhr, status, error) => {
                    // Handle AJAX request failure
                    alert("Error deleting beneficiary. Please try again later.");
                    console.error(error);
                });
            // Remove the table row from the UI
            if (e?.currentTarget) {
                e.currentTarget.closest("tr").remove();
            }
        }
    }

    function applyFiltersAndSort() {
        const recipientSort = $('input[name="recipientSort"]:checked').val();
        const statusFilter = $('input[name="statusFilter"]:checked').map(function() { return this.value; }).get();
        const dateSort = $('input[name="dateSort"]:checked').val();
        const programId = '{{program._id}}'; // Adjust this as necessary

        let query = [];

        if (recipientSort) query.push(`recipientSort=${recipientSort}`);
        if (statusFilter.length) query.push(`statusFilter=${statusFilter.join(',')}`);
        if (dateSort) query.push(`dateSort=${dateSort}`);
        if (programId) query.push(`programId=${programId}`);

        const queryString = query.length > 0 ? `?${query.join('&')}` : '';

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
