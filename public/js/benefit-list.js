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
    document.getElementById("menu-toggle").addEventListener("click", function() {
        document.getElementById("wrapper").classList.toggle("toggled");
        document.querySelector(".main-content").classList.toggle("toggled");
        document.querySelector(".header-right").classList.toggle("toggled");
    });

    // Add event listeners to filter elements
    document.querySelectorAll('input[name="nameSort"]').forEach(input => {
        input.addEventListener('change', applyFiltersAndSort);
    });
    document.querySelectorAll('input[name="quantitySort"]').forEach(input => {
        input.addEventListener('change', applyFiltersAndSort);
    });
    document.querySelectorAll('input[name="dateSort"]').forEach(input => {
        input.addEventListener('change', applyFiltersAndSort);
    });
    document.querySelectorAll('input[name="benefactorFilter"]').forEach(input => {
        input.addEventListener('change', applyFiltersAndSort);
    });

    $('#resetFiltersButton').on('click', function() {
        $('#filter-form')[0].reset();
        applyFiltersAndSort();
    });

    $(document).ready(function() {
        $("#myInput").on("keyup", function() {
            let value = $(this).val().toLowerCase();
            $(".dropdown-menu li").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            });
        });
    });

    let newMemberAddBtn = document.querySelector('.addBenefitBtn button'),
        darkBg = document.querySelector('.dark_bg'),
        popupForm = document.querySelector('.popup'),
        crossBtn = document.querySelector('.closeBtn'),
        submitBtn = document.querySelector('.submitBtn'),
        modalTitle = document.querySelector('.modalTitle'),
        form = document.querySelector('#createBenefitForm'),
        formInputFields = document.querySelectorAll('#createBenefitForm input, #createBenefitForm select'),
        benefitInfo = document.querySelector('.benefitInfo'),
        resetFiltersButton = document.getElementById('resetFiltersButton');

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
                alert("Benefits has been created.");
                bootstrap.Modal.getInstance(document.getElementById("modal-benefit-create")).hide();
                location.reload();
            }
        });

        localStorage.setItem('benefits', JSON.stringify(originalData));
        getData = [...originalData];

        location.reload();
        darkBg.classList.remove('active');
        popupForm.classList.remove('active');
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
                modalInstance.hide();
                alert("Benefit updated successfully.");
                location.reload();
            } else {
                console.log(benefit);
            }
        }).fail(() => {
            alert("Error updating benefit");
            console.log(benefit);
        });
    });

    function addEventListeners() {
        document.querySelectorAll('.editBtn').forEach(button => {
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
        setSelectedValue(modal_edit_benefactor, benefit_benefactor);
    }

    function editBenefitInfo(id, e) {
        onBtnEditClick(e);
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
            originalData = originalData.filter(item => item.id !== id);
            localStorage.setItem('benefits', JSON.stringify(originalData));
            getData = [...originalData];

            $.post(`/benefits/delete`, { benefit_id: id })
                .done((data, status, xhr) => {
                    if (status === "success" && xhr.status === 200) {
                        let index = e?.currentTarget?.closest("tr")?.querySelector("td:first-child")?.textContent;
                        if (index) {
                            alert("Benefit with ID " + index + " has been deleted");
                            location.reload();
                        }
                    } else {
                        alert("Failed to delete benefit. Please try again.");
                    }
                })
                .fail((xhr, status, error) => {
                    alert("Error deleting benefit. Please try again later.");
                    console.error(error);
                });

            if (e?.currentTarget) {
                e.currentTarget.closest("tr").remove();
            }
        }
    }

    function applyFiltersAndSort() {
        const nameSort = $('input[name="nameSort"]:checked').val();
        const quantitySort = $('input[name="quantitySort"]:checked').val();
        const dateSort = $('input[name="dateSort"]:checked').val();
        const benefactorFilter = $('input[name="benefactorFilter"]:checked').map(function() { return this.value; }).get();

        let query = [];

        if (nameSort) query.push(`nameSort=${nameSort}`);
        if (quantitySort) query.push(`quantitySort=${quantitySort}`);
        if (dateSort) query.push(`dateSort=${dateSort}`);
        if (benefactorFilter.length) query.push(`benefactorFilter=${benefactorFilter.join(',')}`);

        const queryString = query.length > 0 ? `?${query.join('&')}` : '';

        fetch(`/benefits${queryString}`)
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
        const row = [];
        const cols = rows[i].querySelectorAll('td, th');
        for (let j = 0; j < cols.length; j++) {
            const data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ');
            row.push('"' + data + '"');
        }
        csv.push(row.join(','));
    }
    downloadCSV(csv.join('\n'), filename);
}