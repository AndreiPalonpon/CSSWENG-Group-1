function formatDate(date) {
    let d = new Date(date);
    let fullMonth = d.getMonth() < 10 ? "0" + d.getMonth() : d.getMonth();
    let fullDate = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
    return d.getFullYear() + '-' + fullMonth + '-' + fullDate;
}

function setSelectedValue(selectObj, valueToSet) {
    for (var i = 0; i < selectObj.options.length; i++) {
        if (selectObj.options[i].text === valueToSet) {
            selectObj.options[i].selected = true;
            return;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {

    document.getElementById("menu-toggle").addEventListener("click", function() {
        document.getElementById("wrapper").classList.toggle("toggled");
        document.querySelector(".main-content").classList.toggle("toggled");
        document.querySelector(".header-right").classList.toggle("toggled");
    });

    $(document).ready(function() {
        $("#myInput").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $(".dropdown-menu li").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    });

    var newMemberAddBtn = document.querySelector('.addBenefitBtn button'),
        darkBg = document.querySelector('.dark_bg'),
        popupForm = document.querySelector('.popup'),
        crossBtn = document.querySelector('.closeBtn'),
        submitBtn = document.querySelector('.submitBtn'),
        modalTitle = document.querySelector('.modalTitle'),
        form = document.querySelector('#benefitForm'),
        formInputFields = document.querySelectorAll('#benefitForm input, #benefitForm select'),
        benefitInfo = document.querySelector('.benefitInfo');
        resetFiltersButton = document.getElementById('resetFiltersButton');

    // Retrieve data from local storage or initialize empty array
    let originalData = localStorage.getItem('programs') ? JSON.parse(localStorage.getItem('programs')) : [];
    let getData = [...originalData];

    let isEdit = false,
        editId;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const now = new Date();
        const benefit = {
            id: Date.now(),
            benefitName: form.benefitName.value,
            benefitDesc: form.benefitDesc.value,
            quantity: form.quantity.value,
            dateReceived: form.dateReceived.value,
            benefactor: form.benefactor.value
        };

        if (!isEdit) {
            originalData.push(benefit);
        } else {
            originalData[editId] = benefit;
        }

        $.post("/benefits/create", benefit, (data, status, xhr) => {
            if (status === "success" && xhr.status === 201) {
                alert("Benefits \"" + benefit.benefitName + "\" has been created.");
                bootstrap.Modal.getInstance(document.getElementById("modal-benefit-create")).hide();
            }
        });

        localStorage.setItem('programs', JSON.stringify(originalData));
        getData = [...originalData];
        form.reset();
    });

    document.getElementById("editBenefitForm").addEventListener('submit', (e) => {
        let benefit_id = document.getElementById("editBenefitId").value;
        let benefit_name = document.getElementById("editBenefitName").value;
        let benefit_desc = document.getElementById("editBenefitDesc").value;
        let benefit_quantity = document.getElementById("editQuantity").value;
        let benefit_date_received = document.getElementById("editDateReceived").value;
        let benefit_benefactor = document.getElementById("editBenefactor").value;

        let benefit = {
            id: benefit_id,
            name: benefit_name,
            description: benefit_desc,
            quantity: benefit_quantity,
            date_received: benefit_date_received,
            benefactor: benefit_benefactor
        };
        e.preventDefault();

        $.post("/benefits/edit", benefit, (data, status, xhr) => {
            if (status === "success" && xhr.status === 200) {
                let modalInstance = bootstrap.Modal.getInstance(document.getElementById("modal-benefit-edit"));
                modalInstance.hide();  // Hide the modal
                alert("Benefit updated successfully.");
                window.location.href = "/benefits";
            } else {

                console.log(benefit);
            }
        }).fail(() => {
            alert("Error updating benefit");
            console.log(benefit);
        });
    });



    function showInfo() {
        displayRows(getData, currentPage);
        displayPagination(getData.length);
        addEventListeners();
    }

    let currentPage = 1;
    const rowsPerPage = 5;

    function displayPagination(totalRows) {
        const pagination = document.querySelector('.pagination');
        const totalPages = Math.ceil(totalRows / rowsPerPage);

        pagination.innerHTML = `
                        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                            <a class="page-link" href="#" aria-label="Previous" id="prevButton">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        `;

        for (let i = 1; i <= totalPages; i++) {
            pagination.innerHTML += `
                        <li class="page-item ${currentPage === i ? 'active' : ''}">
                            <a class="page-link paginationButton" href="#">${i}</a>
                        </li>
                        `;
        }

        pagination.innerHTML += `
                    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                        <a class="page-link" href="#" aria-label="Next" id="nextButton">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                    `;

        document.getElementById("prevButton").addEventListener("click", prevPage);
        document.getElementById("nextButton").addEventListener("click", nextPage);

        const paginationButtons = document.getElementsByClassName("paginationButton");
        for (let i = 0; i < paginationButtons.length; i++) {
            paginationButtons[i].addEventListener("click", function(event) {
                event.preventDefault();
                goToPage(parseInt(this.textContent));
            });
        }
    }

    function displayRows(rows, page = 1) {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedRows = rows.slice(start, end);
        const benefitInfo = document.querySelector('.benefitInfo');
        benefitInfo.innerHTML = '';
        paginatedRows.forEach((benefit, index) => {
            const row = `
                <tr>
                    <td>2
                        <button class="viewBtn" data-id="${benefit.id}"><i class="bi bi-eye"></i></button>
                        <button class="editBtn" data-id="${benefit.id}"><i class="bi bi-pencil"></i></button>
                        <button class="deleteBtn" data-id="${benefit.id}"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
                `;
            benefitInfo.innerHTML += row;
        });

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        }
    }

    function addEventListeners() {
        document.querySelectorAll('.viewBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                readInfo(id);
            });
        });

        document.querySelectorAll('.viewBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                readInfo(id);
            });
        });
        document.querySelectorAll('.editBenefitBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.closest("tr").getAttribute('data-benefit-id');
                editBenefitInfo(id, e);
            });
        });
        document.querySelectorAll('.deleteBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                deleteInfo(id, e);
            });
        });
        // Event listeners for sorting and filtering
        document.querySelectorAll('input[name="nameSort"]').forEach(radio => {
            radio.addEventListener('change', () => {
                sortData();
                displayRows(getData, currentPage);
                displayPagination(getData.length);
            });
        });
        document.querySelectorAll('input[name="typeFilter"], input[name="frequencyFilter"], input[name="assistanceFilter"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                filterData();
                displayRows(getData, currentPage);
                displayPagination(getData.length);
            });
        });
    }

    function prevPage(event) {
        event.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            displayRows(getData, currentPage);
            displayPagination(getData.length);
        }
    }

    function nextPage(event) {
        event.preventDefault();
        const totalPages = Math.ceil(getData.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayRows(getData, currentPage);
            displayPagination(getData.length);
        }
    }

    function goToPage(page) {
        currentPage = page;
        displayRows(getData, currentPage);
        displayPagination(getData.length);
    }

    function readInfo(id) {
        const benefit = getData.find(item => item.id === id);
        if (benefit) {
            form.benefitName.value = benefit.benefitName;
            form.benefitDesc.value = benefit.benefitDesc;
            form.quantity.value = benefit.quantity;
            form.dateReceived.value = benefit.dateReceived;
            form.benefactor.value = benefit.benefactor;
            modalTitle.innerHTML = "View Benefit";
            formInputFields.forEach(input => input.disabled = true);
            submitBtn.style.display = "none";
            darkBg.classList.add('active');
            popupForm.classList.add('active');
        }
    }

    function onBtnEditClick(e) {
        let benefit_id = e.currentTarget.closest("tr").getAttribute("data-benefit-id");
        let benefit_name = e.currentTarget.closest("tr").querySelector("td:nth-child(2)").textContent;
        let benefit_desc = e.currentTarget.closest("tr").querySelector("td:nth-child(3)").textContent;
        let benefit_quantity = e.currentTarget.closest("tr").querySelector("td:nth-child(4)").textContent;
        let benefit_date_received = e.currentTarget.closest("tr").querySelector("td:nth-child(5)").textContent;
        let benefit_benefactor = e.currentTarget.closest("tr").querySelector("td:nth-child(6)").textContent;

        let modal_edit = document.getElementById("modal-benefit-edit");
        let modal_edit_id = modal_edit.querySelector("#editBenefitId");
        let modal_edit_name = modal_edit.querySelector("#editBenefitName");
        let modal_edit_desc = modal_edit.querySelector("#editBenefitDesc");
        let modal_edit_quantity = modal_edit.querySelector("#editQuantity");
        let modal_edit_date_received = modal_edit.querySelector("#editDateReceived");
        let modal_edit_benefactor = modal_edit.querySelector("#editBenefactor");

        modal_edit_id.value = benefit_id;
        modal_edit_name.value = benefit_name;
        modal_edit_desc.value = benefit_desc;
        modal_edit_quantity.value = benefit_quantity;
        modal_edit_date_received.value = formatDate(benefit_date_received);
        //modal_edit_benefactor.value = benefit_benefactor;
        setSelectedValue(modal_edit_benefactor, benefit_benefactor)
    }

    function editBenefitInfo(id, e) {
        onBtnEditClick(e)
        isEdit = true;
        editId = getData.findIndex(item => item.id === id);
        const benefit = getData[editId];
        if (benefit) {
            form.benefitName.value = benefit.benefitName;
            form.benefitDesc.value = benefit.benefitDesc;
            form.quantity.value = benefit.quantity;
            form.dateReceived.value = benefit.dateReceived;
            form.benefactor.value = benefit.benefactor;
            modalTitle.innerHTML = "Edit Benefit";
            formInputFields.forEach(input => input.disabled = false);
            submitBtn.style.display = "block";
            submitBtn.innerHTML = "Update";
            darkBg.classList.add('active');
            popupForm.classList.add('active');
        }
    }


    function deleteInfo(id, e) {
        if (confirm("Are you sure you want to delete this benefit?")) {
            console.log(id);
            // Remove item from localStorage
            originalData = originalData.filter(item => item.id !== id);
            localStorage.setItem('benefits', JSON.stringify(originalData));

            // Make a copy of originalData if needed
            let getData = [...originalData];

            // Handle deletion via AJAX request
            $.post(`/benefits/delete`, {benefit_id: id})
                .done((data, status, xhr) => {
                    // Check if deletion was successful
                    if (status === "success" && xhr.status === 200) {
                        // Display success message
                        let index = e?.currentTarget?.closest("tr")?.querySelector("td:first-child")?.textContent;
                        if (index) {
                            alert("Benefit with ID " + index + " has been deleted");
                        }
                        // Reload the page after deletion
                        location.reload();
                    } else {
                        // Handle deletion failure
                        alert("Failed to delete benefit. Please try again.");
                    }
                })
                .fail((xhr, status, error) => {
                    // Handle AJAX request failure
                    alert("Error deleting benefit. Please try again later.");
                    console.error(error);
                });
            // Remove the table row from the UI
            if (e?.currentTarget) {
                e.currentTarget.closest("tr").remove();
            }
        }
    }

    function sortData() {
        const selectedSort = document.querySelector('input[name="nameSort"]:checked').value;
        getData.sort((a, b) => {
            if (selectedSort === 'az') {
                return a.benefitName.localeCompare(b.benefitName);
            } else {
                return b.benefitName.localeCompare(a.benefitName);
            }
        });
        showInfo();
    }


    resetFiltersButton.addEventListener('click', () => {
        document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
            input.checked = false;
        });
        getData = [...originalData];
        showInfo();
    });

    //displayRows(getData, currentPage);
    displayPagination(getData.length);
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