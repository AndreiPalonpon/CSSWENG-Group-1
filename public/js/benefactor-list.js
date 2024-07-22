document.addEventListener('DOMContentLoaded', function() {
    const newMemberAddBtn = document.querySelector('.createBtn button'),
        darkBg = document.querySelector('.dark_bg'),
        popupForm = document.querySelector('.popup'),
        crossBtn = document.querySelector('.closeBtn'),
        submitBtn = document.querySelector('.submitBtn'),
        modalTitle = document.querySelector('.modal-title'),
        form = document.querySelector('#createBenefactorForm'),
        formInputFields = document.querySelectorAll('#createBenefactorForm input, #createBenefactorForm select');

    const itemsDiv = document.getElementById('items');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const pageInfo = document.getElementById('page-info');
    let currentPage = 1;
    const limit = 20;

    let originalData = localStorage.getItem('benefactors') ? JSON.parse(localStorage.getItem('benefactors')) : [];
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
        const benefactor = {
            id: Date.now(),
            benefactorName: form.benefactorName.value,
            benefactorType: form.benefactorType.value
        };

        if (!isEdit) {
            originalData.push(benefactor);
        } else {
            originalData[editId] = benefactor;
        }

        $.post("/benefactors/create", benefactor, (data, status, xhr) => {
            if (status === "success" && xhr.status === 201) {
                alert("Benefactor has been created.");
                location.reload();
            }
        });

        localStorage.setItem('benefactors', JSON.stringify(originalData));
        getData = [...originalData];

        location.reload();
        darkBg.classList.remove('active');
        popupForm.classList.remove('active');
        form.reset();
    });

    document.getElementById("editBenefactorForm").addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission
        const benefactor = {
            benefactor_id: document.getElementById("editBenefactorId").value,
            benefactor_name: document.getElementById("editBenefactorName").value,
            benefactor_type: document.getElementById("editBenefactorType").value
        };

        $.post("/benefactors/edit", benefactor, (data, status, xhr) => {
            if (status === "success" && xhr.status === 200) {
                const modalInstance = bootstrap.Modal.getInstance(document.getElementById("modal-benefactor-edit"));
                modalInstance.hide(); // Hide the modal
                alert("Update benefactor successfully.");
                location.reload();
            } else {
                alert("Error updating benefactor");
            }
        }).fail(() => {
            alert("Error updating benefactor");
        });
    });

    // Edit and delete event handlers
    function addEventListeners() {
        document.querySelectorAll('.editBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.closest("tr").getAttribute('data-benefactor-id');
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
        const benefactor_id = e.currentTarget.closest("tr").getAttribute("data-benefactor-id");
        const benefactor_name = e.currentTarget.closest("tr").querySelector(".benefactor-name").textContent;
        const benefactor_type = e.currentTarget.closest("tr").querySelector(".benefactor-type").textContent;

        const modal_edit = document.getElementById("modal-benefactor-edit");
        const modal_edit_id = modal_edit.querySelector("#editBenefactorId");
        const modal_edit_name = modal_edit.querySelector("#editBenefactorName");
        const modal_edit_type = modal_edit.querySelector("#editBenefactorType");

        modal_edit_id.value = benefactor_id;
        modal_edit_name.value = benefactor_name;
        modal_edit_type.value = benefactor_type;
    }

    function editInfo(id, e) {
        onBtnEditClick(e);
        isEdit = true;
        editId = getData.findIndex(item => item.id === id);
        const benefactor = getData[editId];
        if (benefactor) {
            form.benefactorName.value = benefactor.benefactorName;
            form.benefactorType.value = benefactor.benefactorType;
            modalTitle.innerHTML = "Edit Benefactor";
            formInputFields.forEach(input => input.disabled = false);
            submitBtn.style.display = "block";
            submitBtn.innerHTML = "Update";
            darkBg.classList.add('active');
            popupForm.classList.add('active');
        }
    }

    function deleteInfo(id, e) {
        if (confirm("Are you sure you want to delete this benefactor?")) {
            originalData = originalData.filter(item => item.id !== id);
            localStorage.setItem('benefactors', JSON.stringify(originalData));

            $.post(`/benefactors/delete`, { benefactor_id: id })
                .done((data, status, xhr) => {
                    if (status === "success" && xhr.status === 200) {
                        alert("Benefactor has been deleted");
                        location.reload();
                    } else {
                        alert("Failed to delete benefactor. Please try again.");
                    }
                })
                .fail((xhr, status, error) => {
                    alert("Error deleting benefactor. Please try again later.");
                    console.error(error);
                });
        }
    }

    // Filter and sort function
    function applyFiltersAndSort() {
        const nameSort = $('input[name="nameSort"]:checked').val();
        const typeFilter = $('input[name="typeFilter"]:checked').map(function() { return this.value; }).get();

        let query = [];

        if (nameSort) query.push(`nameSort=${nameSort}`);
        if (typeFilter.length) query.push(`typeFilter=${typeFilter.join(',')}`);

        const queryString = query.length > 0 ? `?${query.join('&')}` : '';

        fetch(`/benefactors${queryString}`)
            .then(response => response.text())
            .then(html => {
                const newDoc = new DOMParser().parseFromString(html, 'text/html');
                const newTableBody = newDoc.querySelector('tbody').innerHTML;
                document.querySelector('tbody').innerHTML = newTableBody;
                addEventListeners();
            })
            .catch(error => console.error('Error fetching filtered data:', error));
    }

    function fetchItems(page = 1) {
        fetch(`/benefactors?page=${page}&limit=${limit}`)
            .then(response => response.text())
            .then(html => {
                const newDoc = new DOMParser().parseFromString(html, 'text/html');
                const newTableBody = newDoc.querySelector('tbody').innerHTML;
                document.querySelector('tbody').innerHTML = newTableBody;
                const totalBenefactors = parseInt(newDoc.querySelector('#totalBenefactors').value);
                const totalPages = Math.ceil(totalBenefactors / limit);
                updatePaginationControls(page, totalPages);
                updateRowNumbers(page, limit);
                addEventListeners();
            })
            .catch(error => console.error('Error fetching items:', error));
    }

    function updatePaginationControls(page, totalPages) {
        currentPage = page;
        pageInfo.textContent = `Page ${page} of ${totalPages}`;
        prevButton.disabled = page <= 1;
        nextButton.disabled = page >= totalPages;
    }

    function updateRowNumbers(page, limit) {
        const rows = document.querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
            row.querySelector('.benefactor-index').textContent = (page - 1) * limit + index + 1;
        });
    }

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            fetchItems(currentPage - 1);
        }
    });

    nextButton.addEventListener('click', () => {
        fetchItems(currentPage + 1);
    });

    // Initialize event listeners
    addEventListeners();
    fetchItems();
});

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