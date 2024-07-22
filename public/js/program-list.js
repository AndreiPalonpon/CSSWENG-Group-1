document.addEventListener('DOMContentLoaded', function() {
    const newMemberAddBtn = document.querySelector('.createBtn button'),
        darkBg = document.querySelector('.dark_bg'),
        popupForm = document.querySelector('.popup'),
        crossBtn = document.querySelector('.btn-close'),
        submitBtn = document.querySelector('.submitBtn'),
        modalTitle = document.querySelector('.modal-title'),
        form = document.querySelector('#createProgramForm'),
        formInputFields = document.querySelectorAll('#createProgramForm input, #createProgramForm select');

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
    document.querySelectorAll('input[name="nameSort"]').forEach(input => {
        input.addEventListener('change', applyFiltersAndSort);
    });
    document.querySelectorAll('input[name="typeFilter"]').forEach(input => {
        input.addEventListener('change', applyFiltersAndSort);
    });
    document.querySelectorAll('input[name="frequencyFilter"]').forEach(input => {
        input.addEventListener('change', applyFiltersAndSort);
    });
    document.querySelectorAll('input[name="assistanceTypeFilter"]').forEach(input => {
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
        const program = {
            id: Date.now(),
            programName: form.programName.value,
            programType: form.programType.value,
            programFrequency: form.programFrequency.value,
            assistanceType: form.assistanceType.value,
            dateCreated: now.toLocaleDateString(),
            lastUpdated: now.toLocaleDateString() + ' ' + now.toLocaleTimeString()
        };

        if (!isEdit) {
            originalData.push(program);
        } else {
            originalData[editId] = program;
        }

        $.post("/programs/create", program, (data, status, xhr) => {
            if (status === "success" && xhr.status === 201) {
                alert("Program has been created.");
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

    document.getElementById("editProgramForm").addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission
        let program_id = document.getElementById("editProgramId").value;
        let program_name = document.getElementById("editProgramName").value;
        let program_type = document.getElementById("editProgramType").value;
        let program_frequency = document.getElementById("editFrequency").value;
        let program_assistance_type = document.getElementById("editAssistanceType").value;

        let program = {
            id: program_id,
            name: program_name,
            program_type: program_type,
            frequency: program_frequency,
            assistance_type: program_assistance_type
        };

        $.post("/programs/edit", program, (data, status, xhr) => {
            if (status === "success" && xhr.status === 200) {
                let modalInstance = bootstrap.Modal.getInstance(document.getElementById("modal-program-edit"));
                modalInstance.hide(); // Hide the modal
                alert("Update program successfully.");
                location.reload();
            } else {
                alert("Error updating program");
            }
        }).fail(() => {
            alert("Error updating program");
        });
    });

    // Edit and delete event handlers
    function addEventListeners() {
        document.querySelectorAll('.editBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.closest("tr").getAttribute('data-program-id');
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
        let program_id = e.currentTarget.closest("tr").getAttribute("data-program-id");
        let program_name = e.currentTarget.closest("tr").querySelector("td:nth-child(2)").textContent;
        let program_type = e.currentTarget.closest("tr").querySelector(".program-type").textContent;
        let program_frequency = e.currentTarget.closest("tr").querySelector(".program-frequency").textContent;
        let program_assistance_type = e.currentTarget.closest("tr").querySelector(".program-assistance-type").textContent;

        let modal_edit = document.getElementById("modal-program-edit");
        let modal_edit_id = modal_edit.querySelector("#editProgramId");
        let modal_edit_name = modal_edit.querySelector("#editProgramName");
        let modal_edit_type = modal_edit.querySelector("#editProgramType");
        let modal_edit_frequency = modal_edit.querySelector("#editFrequency");
        let modal_edit_assistance_type = modal_edit.querySelector("#editAssistanceType");

        modal_edit_id.value = program_id;
        modal_edit_name.value = program_name;
        modal_edit_type.value = program_type;
        modal_edit_frequency.value = program_frequency;
        modal_edit_assistance_type.value = program_assistance_type;
    }

    function editInfo(id, e) {
        onBtnEditClick(e);
        isEdit = true;
        editId = getData.findIndex(item => item.id === id);
        const program = getData[editId];
        if (program) {
            form.programName.value = program.programName;
            form.programType.value = program.programType;
            form.frequency.value = program.frequency;
            form.assistanceType.value = program.assistanceType;
            modalTitle.innerHTML = "Edit Program";
            formInputFields.forEach(input => input.disabled = false);
            submitBtn.style.display = "block";
            submitBtn.innerHTML = "Update";
            darkBg.classList.add('active');
            popupForm.classList.add('active');
        }
    }

    function deleteInfo(id, e) {
        if (confirm("Are you sure you want to delete this program?")) {
            originalData = originalData.filter(item => item.id !== id);
            localStorage.setItem('programs', JSON.stringify(originalData));

            $.post(`/programs/delete`, { program_id: id })
                .done((data, status, xhr) => {
                    if (status === "success" && xhr.status === 200) {
                        alert("Program has been deleted.");
                        location.reload();
                    } else {
                        alert("Failed to delete program. Please try again.");
                    }
                })
                .fail((xhr, status, error) => {
                    alert("Error deleting program. Please try again later.");
                    console.error(error);
                });
        }
    }

    // Filter and sort function
    function applyFiltersAndSort() {
        const nameSort = $('input[name="nameSort"]:checked').val();
        const typeFilter = $('input[name="typeFilter"]:checked').map(function() { return this.value; }).get();
        const frequencyFilter = $('input[name="frequencyFilter"]:checked').map(function() { return this.value; }).get();
        const assistanceTypeFilter = $('input[name="assistanceTypeFilter"]:checked').map(function() { return this.value; }).get();

        let query = [];

        if (nameSort) query.push(`nameSort=${nameSort}`);
        if (typeFilter.length) query.push(`typeFilter=${typeFilter.join(',')}`);
        if (frequencyFilter.length) query.push(`frequencyFilter=${frequencyFilter.join(',')}`);
        if (assistanceTypeFilter.length) query.push(`assistanceTypeFilter=${assistanceTypeFilter.join(',')}`);

        const queryString = query.length > 0 ? `?${query.join('&')}` : '';

        console.log('Query String:', queryString);

        fetch(`/programs${queryString}`)
            .then(response => response.text())
            .then(html => {
                console.log('Received HTML:', html);
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

// CSV export functions
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