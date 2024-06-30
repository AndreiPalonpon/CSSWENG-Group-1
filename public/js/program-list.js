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

    var newMemberAddBtn = document.querySelector('.addPeopleBtn button'),
        darkBg = document.querySelector('.dark_bg'),
        popupForm = document.querySelector('.popup'),
        crossBtn = document.querySelector('.closeBtn'),
        submitBtn = document.querySelector('.submitBtn'),
        modalTitle = document.querySelector('.modalTitle'),
        form = document.querySelector('#peopleForm'),
        formInputFields = document.querySelectorAll('#peopleForm input, #peopleForm select'),
        peopleInfo = document.querySelector('.peopleInfo'),
        resetFiltersButton = document.getElementById('resetFiltersButton');

    let originalData = localStorage.getItem('people') ? JSON.parse(localStorage.getItem('people')) : [];
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

     form.addEventListener('submit', (e) => {
        e.preventDefault();
        const now = new Date();
        const person = {
            id: Date.now(),
            name: form.name.value,
            dateJoined: form.dateJoined.value,
            beneficiaryStatus: form.beneficiaryStatus.value,
            benefitRequested: form.benefitRequested.value,
            benefitReceived: form.benefitReceived.value,
            dateReceived: form.dateReceived.value,
            status: form.status.value
        };

        if (!isEdit) {
            originalData.push(person);
        } else {
            originalData[editId] = person;
        }

        localStorage.setItem('people', JSON.stringify(originalData));
        getData = [...originalData];
        showInfo();
        darkBg.classList.remove('active');
        popupForm.classList.remove('active');
        form.reset();
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
        const peopleInfo = document.querySelector('.peopleInfo');
        peopleInfo.innerHTML = '';
        paginatedRows.forEach((people, index) => {
            const row = `
                <tr>
                    <td>${start + index + 1}</td>
                    <td>${capitalizeFirstLetter(people.name)}</td>
                    <td>${people.dateJoined}</td>
                    <td>${people.beneficiaryStatus}</td>
                    <td>${people.benefitRequested}</td>
                    <td>${people.benefitReceived}</td>
                    <td>${people.dateReceived}</td>
                    <td>${people.status}</td>
                </tr>
                `;
            peopleInfo.innerHTML += row;
        });

        function capitalizeFirstLetter(string) {
            return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        }
    }



    function addEventListeners() {

        // Event listeners for sorting and filtering
        document.querySelectorAll('input[name="nameSort"], input[name="dateJoinedSort"], input[name="dateReceivedSort"]').forEach(radio => {
            radio.addEventListener('change', () => {
                sortData();
                displayRows(getData, currentPage);
                displayPagination(getData.length);
            });
        });
        document.querySelectorAll('input[name="beneficiaryStatusFilter"], input[name="benefitRequestedFilter"], input[name="benefitReceivedFilter"],  input[name="statusFilter"]').forEach(checkbox => {
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

    function sortData() {
        const selectedNameSort = document.querySelector('input[name="nameSort"]:checked') ? document.querySelector('input[name="nameSort"]:checked').value : null;
        const selectedDateJoinedSort = document.querySelector('input[name="dateJoinedSort"]:checked') ? document.querySelector('input[name="dateJoinedSort"]:checked').value : null;
        const selectedDateReceivedSort = document.querySelector('input[name="dateReceivedSort"]:checked') ? document.querySelector('input[name="dateReceivedSort"]:checked').value : null;

        getData.sort((a, b) => {
            // Sort by Name 
            if (selectedNameSort === 'az') {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            } 
            
            //Sort by dateJoined
            if (selectedDateJoinedSort === 'new') {
                return new Date(b.dateJoined) - new Date(a.dateJoined);
            } else if (selectedDateJoinedSort === 'old') {
                return new Date(a.dateJoined) - new Date(b.dateJoined);
            }

            // Sort by dateReceived
            if (selectedDateReceivedSort === 'new') {
                return new Date(b.dateReceived) - new Date(a.dateReceived);
            } else if (selectedDateReceivedSort === 'old') {
                return new Date(a.dateReceived) - new Date(b.dateReceived);
            }

        });
        showInfo();
    } 

    function filterData() {
        let filteredData = [...originalData];
        const selectedBeneficiaryStatus = Array.from(document.querySelectorAll('input[name="beneficiaryStatusFilter"]:checked')).map(check => check.value);
        if (selectedBeneficiaryStatus.length > 0) {
            filteredData = filteredData.filter(people => selectedBeneficiaryStatus.includes(people.beneficiaryStatus));
        }

        const selectedBenefitRequested= Array.from(document.querySelectorAll('input[name="benefitRequestedFilter"]:checked')).map(check => check.value);
        if (selectedBenefitRequested.length > 0) {
            filteredData = filteredData.filter(people => selectedBenefitRequested.includes(people.benefitRequested));
        }

        const selectedBenefitReceived = Array.from(document.querySelectorAll('input[name="benefitReceivedFilter"]:checked')).map(check => check.value);
        if (selectedBenefitReceived.length > 0) {
            filteredData = filteredData.filter(people => selectedBenefitReceived.includes(people.benefitReceived));
        }

        const selectedStatus = Array.from(document.querySelectorAll('input[name="statusFilter"]:checked')).map(check => check.value);
        if (selectedStatus.length > 0) {
            filteredData = filteredData.filter(people => selectedStatus.includes(people.status));
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

    displayRows(getData, currentPage);
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