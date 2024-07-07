$(document).ready(function() {
    $('#editQuestionsForm').submit(function(event) {
        event.preventDefault(); // Prevent default form submission

        // Gather form data
        const formData = {
            question1: $('#question1').val(),
            answer1: $('#answer1').val(),
            question2: $('#question2').val(),
            answer2: $('#answer2').val(),
            question3: $('#question3').val(),
            answer3: $('#answer3').val()
        };

        // Send data to server using AJAX
        $.ajax({
            type: 'POST',
            url: '/save-security-questions',
            data: formData,
            success: function(response) {
                // Redirect or handle success response
                window.location.href = '/settings'; // Redirect to settings page
            },
            error: function(error) {
                console.error('Error:', error);
                // Handle error response
            }
        });
    });
});
