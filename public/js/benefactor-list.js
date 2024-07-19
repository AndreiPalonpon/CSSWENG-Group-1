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

    var newMemberAddBtn = document.querySelector('.createBtn button'),
        darkBg = document.querySelector('.dark_bg'),
        popupForm = document.querySelector('.popup'),
        crossBtn = document.querySelector('.closeBtn'),
        submitBtn = document.querySelector('.submitBtn'),
        modalTitle = document.querySelector('.modalTitle'),
        form = document.querySelector('#createBenefactorForm'),
        formInputFields = document.querySelectorAll('#createBenefactorForm input, #createBenefactorForm select'),
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
                alert("Benefactor has been added.");
                bootstrap.Modal.getInstance(document.getElementById("modal-benefactor-create")).hide();
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
                alert("Updated benefactor successfully.");
                location.reload();
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
                            alert("Benefactor has been deleted");
                            location.reload();
                        }
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
