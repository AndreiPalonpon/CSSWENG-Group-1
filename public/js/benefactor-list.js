document.addEventListener('DOMContentLoaded', function() {
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

    const newBenefactorAddBtn = document.querySelector('.addBenefactorBtn button'),
        darkBg = document.querySelector('.dark_bg'),
        popupForm = document.querySelector('.popup'),
        crossBtn = document.querySelector('.btn-close'),
        submitBenefactorBtn = document.querySelector('.submitBenefactorBtn'),
        modalTitle = document.querySelector('.modal-title'),
        form = document.querySelector('#benefactorForm'),
        formInputFields = document.querySelectorAll('#benefactorForm input, #benefactorForm select'),
        resetFiltersButton = document.getElementById('resetFiltersButton');

    let originalData = localStorage.getItem('benefactors') ? JSON.parse(localStorage.getItem('benefactors')) : [];
    let getData = [...originalData];

    let isEdit = false,
        editId;

    newBenefactorAddBtn.addEventListener('click', () => {
        isEdit = false;
        submitBenefactorBtn.innerHTML = "Submit";
        modalTitle.innerHTML = "Fill the Form";
        form.reset();
        formInputFields.forEach(input => input.disabled = false);
        submitBenefactorBtn.style.display = "block";
        darkBg.classList.add('active');
        popupForm.classList.add('active');
    });

    crossBtn.addEventListener('click', () => {
        darkBg.classList.remove('active');
        popupForm.classList.remove('active');
        form.reset();
        submitBenefactorBtn.style.display = "block";
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

        darkBg.classList.remove('active');
        popupForm.classList.remove('active');
        form.reset();
    });


    function addEventListeners() {
        document.querySelectorAll('.editBenefactorBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.closest("tr").getAttribute('data-benefactor-id');
                editBenefactorInfo(id, e);
            });
        });
        document.querySelectorAll('.deleteBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                deleteInfo(id, e);
            });
        });
    }

    document.getElementById("editBenefactorForm").addEventListener('submit', (e) => {
        let benefactor_id = document.getElementById("editBenefactorId").value;
        let benefactor_name = document.getElementById("editBenefactorName").value;
        let benefactor_type = document.getElementById("editBenefactorType").value;

        let benefactor = {
            benefactor_id: benefactor_id,
            benefactor_name: benefactor_name,
            benefactor_type: benefactor_type
        };

        e.preventDefault();

        $.post("/benefactors/edit", benefactor, (data, status, xhr) => {
            if (status === "success" && xhr.status === 200) {
                let modalInstance = bootstrap.Modal.getInstance(document.getElementById("modal-benefactor-edit"));
                modalInstance.hide(); // Hide the modal
                alert("Update benefactor successfully.");
            } else {
                alert("Error updating benefactor");
            }
        }).fail(() => {
            alert("Error updating benefactor");
        });
    });

    function onBtnEditClick(e) {
        let benefactor_id = e.currentTarget.closest("tr").getAttribute("data-benefactor-id");
        let benefactor_name = e.currentTarget.closest("tr").querySelector(".benefactor-name").textContent;
        let benefactor_type = e.currentTarget.closest("tr").querySelector(".benefactor-type").textContent;

        let modal_edit = document.getElementById("modal-benefactor-edit");
        let modal_edit_id = modal_edit.querySelector("#editBenefactorId");
        let modal_edit_name = modal_edit.querySelector("#editBenefactorName");
        let modal_edit_type = modal_edit.querySelector("#editBenefactorType");

        modal_edit_id.value = benefactor_id;
        modal_edit_name.value = benefactor_name;
        modal_edit_type.value = benefactor_type;
    }

    function editBenefactorInfo(id, e) {
        onBtnEditClick(e);
        isEdit = true;
        editId = getData.findIndex(item => item.id === id);
        const benefactor = getData[editId];
        if (benefactor) {
            form.benefactorName.value = benefactor.benefactorName;
            form.benefactorType.value = benefactor.benefactorType;
            modalTitle.innerHTML = "Edit Benefactor";
            formInputFields.forEach(input => input.disabled = false);
            submitBenefactorBtn.style.display = "block";
            submitBenefactorBtn.innerHTML = "Update";
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
                        alert("Benefactor has been deleted.");
                        location.reload();
                    } else {
                        alert("Failed to delete benefactor. Please try again.");
                    }
                }).fail((xhr, status, error) => {
                    alert("Error deleting benefactor. Please try again later.");
                    console.error(error);
                });
        }
    }

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

/*
document.addEventListener('DOMContentLoaded', function() {
    // Toggle Menu
    document.getElementById("menu-toggle").addEventListener("click", function() {
        document.getElementById("wrapper").classList.toggle("toggled");
        document.querySelector(".main-content").classList.toggle("toggled");
        document.querySelector(".header-right").classList.toggle("toggled");
    });

    // jQuery function for filtering dropdown menu
    $(document).ready(function() {
        $("#myInput").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $(".dropdown-menu li").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            });
        });
    });

    // Selectors for form elements and filters
    const nameSortAZ = document.getElementById('benefactorNameSortAZ');
    const nameSortZA = document.getElementById('benefactorNameSortZA');
    const typeFilters = document.querySelectorAll('input[name="typeFilter"]');
    const form = document.querySelector('#benefactorForm');
    const submitBtn = document.querySelector('.submitBtn');
    const formInputFields = document.querySelectorAll('#benefactorForm input, #benefactorForm select');

    // Initialize data from localStorage
    let originalData = localStorage.getItem('benefactors') ? JSON.parse(localStorage.getItem('benefactors')) : [];
    let getData = [...originalData];

    let isEdit = false,
        editId;

    // Event listener for benefactor form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const now = new Date();
        const benefactor = {
            id: Date.now(),
            benefactorName: form.benefactorName.value,
            benefactorType: form.benefactorType.value,
            dateCreated: now.toLocaleDateString(),
            lastUpdated: now.toLocaleDateString() + ' ' + now.toLocaleTimeString()
        };

        if (!isEdit) {
            originalData.push(benefactor);
        } else {
            originalData[editId] = benefactor;
        }

        // Simulated POST request
        $.post("/benefactors/create", benefactor, (data, status, xhr) => {
            if (status === "success" && xhr.status === 201) {
                alert("Benefactor \"" + benefactor.benefactorName + "\" has been created.");
            }
        }).fail(() => {
            alert("Error creating benefactor");
        });

        localStorage.setItem('benefactors', JSON.stringify(originalData));
        getData = [...originalData];
        let modal_benefactor_create = document.querySelector("#modal-benefactor-create");
        bootstrap.Modal.getInstance(modal_benefactor_create).hide();
        form.reset();

        // Update and re-render benefactor list
        updateHandlebarsTemplate(originalData);
    });

    document.getElementById("editBenefactorForm").addEventListener('submit', (e) => {
        e.preventDefault();
        const benefactor_id = parseInt(document.getElementById("editBenefactorId").value);
        const benefactor_name = document.getElementById("editBenefactorName").value;
        const benefactor_type = document.getElementById("editBenefactorType").value;

        const originalBenefactor = originalData.find(benef => benef.id === benefactor_id);

        const benefactor = {
            id: benefactor_id,
            benefactorName: benefactor_name,
            benefactorType: benefactor_type,
            dateCreated: originalBenefactor.dateCreated,
            lastUpdated: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
        };

        const index = originalData.findIndex(benef => benef.id === benefactor.id);
        originalData[index] = benefactor;

        localStorage.setItem('benefactors', JSON.stringify(originalData));
        getData = [...originalData];

        $.post("/benefactors/edit", benefactor, (data, status, xhr) => {
            if (status === "success" && xhr.status === 200) {
                alert("Update benefactor successfully.");
                bootstrap.Modal.getInstance(document.getElementById("modal-benefactor-edit")).hide();
                renderBenefactors(getData);
            } else {
                alert("Error updating benefactor");
            }
        }).fail(() => {
            alert("Error updating benefactor in server");
        });

        let modal_benefactor_edit = document.querySelector("#modal-benefactor-edit");
        bootstrap.Modal.getInstance(modal_benefactor_edit).hide();
        form.reset();

        updateHandlebarsTemplate(originalData);
    });

    function addEventListeners() {
        document.querySelectorAll('.editBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.closest("tr").getAttribute('data-benefactor-id');
                editInfo(id, e);
            });
        });
        document.querySelectorAll('.deleteBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.closest("tr").getAttribute('data-benefactor-id');
                deleteInfo(id, e);
            });
        });
    }

    function onBtnEditClick(e) {
        let benefactor_id = e.currentTarget.closest("tr").getAttribute("data-benefactor-id");
        let benefactor_name = e.currentTarget.closest("tr").querySelector(".benefactor-name > a").textContent;
        let benefactor_type = e.currentTarget.closest("tr").querySelector(".benefactor-type").textContent;

        let modal_edit = document.getElementById("modal-benefactor-edit");
        let modal_edit_id = modal_edit.querySelector("#editBenefactorId");
        let modal_edit_name = modal_edit.querySelector("#editBenefactorName");
        let modal_edit_type = modal_edit.querySelector("#editBenefactorType");

        modal_edit_id.value = benefactor_id;
        modal_edit_name.value = benefactor_name;
        modal_edit_type.value = benefactor_type;
    }

    // Function to populate form with benefactor details for editing
    function editInfo(id, e) {
        onBtnEditClick(e);
        isEdit = true;
        editId = getData.findIndex(item => item.id === id);
        const benefactor = getData[editId];
        if (benefactor) {
            form.benefactorName.value = benefactor.benefactorName;
            form.benefactorType.value = benefactor.benefactorType;
            formInputFields.forEach(input => input.disabled = false);
            submitBtn.style.display = "block";
            submitBtn.innerHTML = "Update";
            darkBg.classList.add('active');
            popupForm.classList.add('active');
        }
    }

    function deleteInfo(id, e) {
        if (confirm("Are you sure you want to delete this benefactor?")) {
            id = parseInt(id);
            originalData = originalData.filter(item => item.id !== id);
            localStorage.setItem('benefactors', JSON.stringify(originalData));
            getData = [...originalData];
            e.currentTarget.closest("tr").remove();
            $.post("/benefactors/delete", { benefactor_id: id }, (data, status, xhr) => {
                if (status === "success" && xhr.status === 200) {
                    alert("Benefactor has been deleted");
                }
            });
            e.currentTarget.closest("tr").remove();
            updateHandlebarsTemplate(originalData);
        }
    }

    const getSelectedValues = (inputs) => {
        return Array.from(inputs).filter(input => input.checked).map(input => input.value);
    };

    // Function to filter and sort benefactors based on filters and sort options
    const filterAndSortBenefactors = () => {
        let filteredBenefactors = [...originalData];

        const typeValues = getSelectedValues(typeFilters);
        if (typeValues.length > 0) {
            filteredBenefactors = filteredBenefactors.filter(benefactor => typeValues.includes(benefactor.benefactorType));
        }

        if (nameSortAZ.checked) {
            filteredBenefactors.sort((a, b) => a.benefactorName.localeCompare(b.benefactorName));
        } else if (nameSortZA.checked) {
            filteredBenefactors.sort((a, b) => b.benefactorName.localeCompare(a.benefactorName));
        }

        // Update and re-render benefactor list
        updateHandlebarsTemplate(filteredBenefactors);
    };

    // Function to update Handlebars template with benefactors data
    function updateHandlebarsTemplate(benefactors) {
        const tableBody = document.querySelector('tbody');

        // Clear existing content
        tableBody.innerHTML = '';

        // Iterate over benefactors and append rows to the tbody
        benefactors.forEach((benefactor, index) => {
            const row = document.createElement('tr');
            row.setAttribute('data-benefactor-id', benefactor.id);

            row.innerHTML = `
                <td class="benefactor-index">${index + 1}</td>
                <td class="benefactor-name"><a href="/benefactors">${benefactor.benefactorName}<a></td>
                <td class="benefactor-type">${benefactor.benefactorType}</td>
                <td class="benefactor-controls">
                    <button class="editBtn" data-bs-toggle="modal" data-bs-target="#modal-benefactor-edit"><i class="bi bi-pencil"></i></button>
                    <button class="deleteBtn"><i class="bi bi-trash"></i></button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        addEventListeners(); // Re-add event listeners after updating the content
    }

    const resetFilters = () => {
        nameSortAZ.checked = false;
        nameSortZA.checked = false;
        typeFilters.forEach(filter => filter.checked = false);
        updateHandlebarsTemplate(originalData);
    };

    // Event listeners for sorting and filtering options
    nameSortAZ.addEventListener('change', filterAndSortBenefactors);
    nameSortZA.addEventListener('change', filterAndSortBenefactors);
    typeFilters.forEach(filter => filter.addEventListener('change', filterAndSortBenefactors));
    resetFiltersButton.addEventListener('click', resetFilters);

    // Initial rendering of benefactors on page load
    updateHandlebarsTemplate(originalData);
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
*/


/*
document.addEventListener('DOMContentLoaded', function() {
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

    $(document).ready(function() {
        $("#myInput").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $(".dropdown-menu li").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    });

    var newMemberAddBtn = document.querySelector('.addBenefactorBtn button'),
        darkBg = document.querySelector('.dark_bg'),
        popupForm = document.querySelector('.popup'),
        crossBtn = document.querySelector('.closeBtn'),
        submitBenefactorBtn = document.querySelector('.submitBenefactorBtn'),
        modalTitle = document.querySelector('.modalTitle'),
        form = document.querySelector('#benefactorForm'),
        formInputFields = document.querySelectorAll('#benefactorForm input, #benefactorForm select'),
        benefactorInfo = document.querySelector('.benefactorInfo');
    resetFiltersButton = document.getElementById('resetFiltersButton');

    let originalData = localStorage.getItem('benefactors') ? JSON.parse(localStorage.getItem('benefactors')) : [];
    let getData = [...originalData];

    let isEdit = false,
        editId;

    newMemberAddBtn.addEventListener('click', () => {
        isEdit = false;
        submitBenefactorBtn.innerHTML = "Submit";
        modalTitle.innerHTML = "Fill the Form";
        form.reset();
        formInputFields.forEach(input => input.disabled = false);
        submitBenefactorBtn.style.display = "block";
        darkBg.classList.add('active');
        popupForm.classList.add('active');
    });

    crossBtn.addEventListener('click', () => {
        darkBg.classList.remove('active');
        popupForm.classList.remove('active');
        form.reset();
        submitBenefactorBtn.style.display = "block";
        formInputFields.forEach(input => input.disabled = false);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
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
                alert("Benefactor \"" + benefactor.benefactorName + "\" has been created.");
                bootstrap.Modal.getInstance(document.getElementById("modal-benefactor-create")).hide();
            }
        });

        localStorage.setItem('benefactors', JSON.stringify(originalData));
        getData = [...originalData];
        form.reset();
    });

    document.getElementById("editBenefactorForm").addEventListener('submit', (e) => {
        let benefactor_id = document.getElementById("editBenefactorId").value;
        let benefactor_name = document.getElementById("editBenefactorName").value;
        let benefactor_type = document.getElementById("editBenefactorType").value;

        let benefactor = {
            benefactor_id: benefactor_id,
            benefactor_name: benefactor_name,
            benefactor_type: benefactor_type
        };
        console.log(benefactor_id);
        e.preventDefault();

        $.post("/benefactors/edit", benefactor, (data, status, xhr) => {
            if (status === "success" && xhr.status === 200) {
                let modalInstance = bootstrap.Modal.getInstance(document.getElementById("modal-benefactor-edit"));
                modalInstance.hide(); // Hide the modal
                alert("Update benefactor successfully.");
                window.location.href = "/benefactors";
            } else {
                alert("Error updating benefactor");
            }
        }).fail(() => {
            alert("Error updating benefactor");
        });
    });

    function addEventListeners() {
        document.querySelectorAll('.editBenefactorBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.closest("tr").getAttribute('data-benefactor-id');
                console.log(id);
                editBenefactorInfo(id, e);
            });
        });
        document.querySelectorAll('.deleteBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                deleteInfo(id, e);
            });
        });
    }

    function editBenefactorInfo(id, e) {
        onBtnEditClick(e);
        isEdit = true;
        editId = getData.findIndex(item => item.id === id);
        const benefactor = getData[editId];
        if (benefactor) {
            form.benefactorName.value = benefactor.benefactorName;
            form.benefactorType.value = benefactor.benefactorType;
            modalTitle.innerHTML = "Edit Benefactor";
            formInputFields.forEach(input => input.disabled = false);
            darkBg.classList.add('active');
            popupForm.classList.add('active');
        }
    }

    function deleteInfo(id, e) {
        if (confirm("Are you sure you want to delete this benefactor?")) {
            originalData = originalData.filter(item => item.id !== id);
            localStorage.setItem('benefactors', JSON.stringify(originalData));
            getData = [...originalData];
            let index = e ? .currentTarget ? .closest("tr") ? .querySelector("td:first-child") ? .textContent;
            console.log("Deleting the selected benefactor...");
            $.post(`/benefactors/delete`, { benefactor_id: id }, (data, status, xhr) => {
                if (status === "success" && xhr.status === 200) {
                    alert("Benefactor with ID " + index + " has been deleted");
                } else {
                    alert("Error: Benefactor with ID " + index + " cannot be deleted");
                }
                location.reload();
            });
            e.currentTarget.closest("tr").remove();
        }
    }

    function applyFiltersAndSort() {
        const nameSort = $('input[name="nameSort"]:checked').val();
        const typeFilter = $('input[name="typeFilter"]:checked').map(function() { return this.value; }).get();

        let query = [];

        if (nameSort) query.push(`nameSort=${nameSort}`);
        if (typeFilter.length) query.push(`typeFilter=${typeFilter.join(',')}`);

        const queryString = query.length > 0 ? `?${query.join('&')}` : '';

        console.log('Query String:', queryString);

        fetch(`/benefactors${queryString}`)
            .then(response => response.text())
            .then(html => {
                console.log('Received HTML:', html);
                const newDoc = new DOMParser().parseFromString(html, 'text/html');
                const newTableBody = newDoc.querySelector('.benefactorInfo').innerHTML;
                document.querySelector('.benefactorInfo').innerHTML = newTableBody;
                addEventListeners();
            })
            .catch(error => console.error('Error fetching filtered data:', error));
    }

    addEventListeners();
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
*/
