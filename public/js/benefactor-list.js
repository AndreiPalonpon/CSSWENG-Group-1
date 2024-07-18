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

    // Retrieve data from local storage or initialize empty array
    let originalData = localStorage.getItem('benefactors') ? JSON.parse(localStorage.getItem('benefactors')) : [];
    let getData = [...originalData];

    let isEdit = false,
        editId;

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
                alert("Program \"" + benefactor.benefactorName + "\" has been created.");
                bootstrap.Modal.getInstance(document.getElementById("modal-benefactor-create")).hide();
            }
        });

        localStorage.setItem('benefactors', JSON.stringify(originalData));
        getData = [...originalData];
        //showInfo();
        //darkBg.classList.remove('active');
        //popupForm.classList.remove('active');
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
                modalInstance.hide();  // Hide the modal
                alert("Update benefactor successfully.");
                window.location.href = "/benefactors";
            } else {
                alert("Error updating benefactor");
            }
        }).fail(() => {
            alert("Error updating benefactor");
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
        const benefactorInfo = document.querySelector('.benefactorInfo');
        benefactorInfo.innerHTML = '';
        paginatedRows.forEach((benefactor, index) => {
            const row = `
                <tr>
                    <td>${start + index + 1}</td>
                    <td class="benefactor-name">${benefactor.benefactorName}</td>
                    <td class="benefactor-type">${benefactor.benefactorType}</td>
                    <td>
                        <button class="viewBtn" data-id="${benefactor.id}"><i class="bi bi-eye"></i></button>
                        <button class="editBtn" data-id="${benefactor.id}"><i class="bi bi-pencil"></i></button>
                        <button class="deleteBtn" data-id="${benefactor.id}"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
                `;
            benefactorInfo.innerHTML += row;
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
        const benefactor = getData.find(item => item.id === id);
        if (benefactor) {
            form.benefactorName.value = benefactor.benefactorName;
            form.benefactorType.value = benefactor.benefactorType;
            modalTitle.innerHTML = "View Benefactor";
            formInputFields.forEach(input => input.disabled = true);
            submitBtn.style.display = "none";
            darkBg.classList.add('active');
            popupForm.classList.add('active');
        }
    }

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
        onBtnEditClick(e)
        isEdit = true;
        editId = getData.findIndex(item => item.id === id);
        const benefactor = getData[editId];
        if (benefactor) {
            form.benefactorName.value = benefactor.benefactorName;
            form.benefactorType.value = benefactor.benefactorType;
            modalTitle.innerHTML = "Edit Benefactor";
            formInputFields.forEach(input => input.disabled = false);
            //submitBtn.style.display = "block";
            //submitBtn.innerHTML = "Update";
            darkBg.classList.add('active');
            popupForm.classList.add('active');
        }
    }

    function deleteInfo(id, e) {
        if (confirm("Are you sure you want to delete this benefactor?")) {
            console.log(id);
            // Remove item from localStorage
            originalData = originalData.filter(item => item.id !== id);
            localStorage.setItem('benefactors', JSON.stringify(originalData));

            // Make a copy of originalData if needed
            let getData = [...originalData];

            // Handle deletion via AJAX request
            $.post(`/benefactors/delete`, {benefactor_id: id})
                .done((data, status, xhr) => {
                    // Check if deletion was successful
                    if (status === "success" && xhr.status === 200) {
                        // Display success message
                        let index = e?.currentTarget?.closest("tr")?.querySelector("td:first-child")?.textContent;
                        if (index) {
                            alert("Benefactor with ID " + index + " has been deleted");
                        }
                        // Reload the page after deletion
                        location.reload();
                    } else {
                        // Handle deletion failure
                        alert("Failed to delete benefactor. Please try again.");
                    }
                })
                .fail((xhr, status, error) => {
                    // Handle AJAX request failure
                    alert("Error deleting benefactor. Please try again later.");
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
                return a.benefactorName.localeCompare(b.benefactorName);
            } else {
                return b.benefactorName.localeCompare(a.benefactorName);
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
