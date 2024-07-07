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

// Adding a new program 
var newMemberAddBtn = document.querySelector('.addProgramBtn button'),
    //darkBg = document.querySelector('.dark_bg'),
    //popupForm = document.querySelector('.popup'),
    //crossBtn = document.querySelector('.closeBtn'),
    submitBtn = document.querySelector('.submitBtn'),
    modalTitle = document.querySelector('.modalTitle'),
    form = document.querySelector('#programForm'),
    formInputFields = document.querySelectorAll('#programForm input, #programForm select'),
    programInfo = document.querySelector('.programInfo'),
    resetFiltersButton = document.getElementById('resetFiltersButton');

let originalData = localStorage.getItem('programs') ? JSON.parse(localStorage.getItem('programs')) : [];
let getData = [...originalData];

let isEdit = false,
    editId;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const now = new Date();
    const program = {
        id: Date.now(),
        programName: form.programName.value,
        programType: form.programType.value,
        frequency: form.frequency.value,
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
            alert("Program \"" + program.programName + "\" has been created.");
        }
    });

    localStorage.setItem('programs', JSON.stringify(originalData));
    getData = [...originalData];
    //showInfo();
    darkBg.classList.remove('active');
    popupForm.classList.remove('active');
    let modal_program_create = document.querySelector("#modal-program-create");
    bootstrap.Modal.getInstance(modal_program_create).hide();
    form.reset();
});

document.getElementById("editProgramForm").addEventListener('submit', (e) => {
    let program_id = document.getElementById("editProgramId").value;
    let program_name = document.getElementById("editProgramName").value;
    let program_type = document.getElementById("editProgramType").value;
    let program_frequency = document.getElementById("editFrequency").value;
    let program_assistance_type = document.getElementById("editAssistanceType").value;

    let program = {
        program_id: program_id,
        program_name: program_name,
        program_type: program_type,
        program_frequency: program_frequency,
        program_assistance_type: program_assistance_type
    };

    e.preventDefault();

    $.post("/programs/edit", program, (data, status, xhr) => {
        if (status === "success" && xhr.status === 200) {
            alert("Update program successfully.");

            bootstrap.Modal.getInstance(document.getElementById("modal-program-edit"))
        } else {
            alert("Error updating program");
        }
    }).fail(() => {
        alert("Error updating program");
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
    const programInfo = document.querySelector('.programInfo');
    programInfo.innerHTML = '';
    paginatedRows.forEach((program, index) => {
        const row = `
<tr data-program-id="${program.id}>
    <td>${start + index + 1}</td>
    <td><a href="/people">${program.programName}<a></td>
    <td>${program.lastUpdated}</td>
    <td>${program.dateCreated}</td>
    <td>${capitalizeFirstLetter(program.programType)}</td>
    <td>${capitalizeFirstLetter(program.frequency)}</td>
    <td>${capitalizeFirstLetter(program.assistanceType)}</td>
    <td>
        <button class="editBtn"><i class="bi bi-pencil"></i></button>
        <button class="deleteBtn"><i class="bi bi-trash"></i></button>
    </td>
</tr>
`;
    programInfo.innerHTML += row;
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

    document.querySelectorAll('.editBtn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.currentTarget.closest("tr").getAttribute('data-program-id');
            editInfo(id, e);
        });
    });
    document.querySelectorAll('.deleteBtn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.currentTarget.closest("tr").getAttribute('data-program-id');
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
    const program = getData.find(item => item.id === id);
    if (program) {
        form.programName.value = program.programName;
        form.programType.value = program.programType;
        form.frequency.value = program.frequency;
        form.assistanceType.value = program.assistanceType;
        modalTitle.innerHTML = "View Program";
        formInputFields.forEach(input => input.disabled = true);
        submitBtn.style.display = "none";
        darkBg.classList.add('active');
        popupForm.classList.add('active');
    }
}

function onBtnEditClick(e) {
    let program_id = e.currentTarget.closest("tr").getAttribute("data-program-id");
    let program_name = e.currentTarget.closest("tr").querySelector(".program-name > a").textContent;
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
        console.log(id);
        originalData = originalData.filter(item => item.id !== id);
        localStorage.setItem('programs', JSON.stringify(originalData));
        getData = [...originalData];
        //showInfo();
        let index = e.currentTarget.closest("tr").querySelector("td:first-child").textContent;
        $.post("/programs/delete", {program_id: id}, (data, status, xhr) => {
            if (status === "success" && xhr.status === 200) {
                alert("Program with ID " + index + " has been deleted");
            }
        });
        e.currentTarget.closest("tr").remove();
    }
}


function sortData() {
    const selectedSort = document.querySelector('input[name="nameSort"]:checked').value;
    getData.sort((a, b) => {
        if (selectedSort === 'az') {
            return a.programName.localeCompare(b.programName);
        } else {
            return b.programName.localeCompare(a.programName);
        }
    });
    showInfo();
}

function filterData() {
    let filteredData = [...originalData];
    const selectedTypes = Array.from(document.querySelectorAll('input[name="typeFilter"]:checked')).map(check => check.value);

    if (selectedTypes.length > 0) {
        filteredData = filteredData.filter(program => selectedTypes.includes(program.programType));
    }

    const selectedFrequencies = Array.from(document.querySelectorAll('input[name="frequencyFilter"]:checked')).map(check => check.value);
    if (selectedFrequencies.length > 0) {
        filteredData = filteredData.filter(program => selectedFrequencies.includes(program.frequency));
    }

    const selectedAssistances = Array.from(document.querySelectorAll('input[name="assistanceFilter"]:checked')).map(check => check.value);
    if (selectedAssistances.length > 0) {
        filteredData = filteredData.filter(program => selectedAssistances.includes(program.assistanceType));
    }
    
    getData = filteredData;
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

