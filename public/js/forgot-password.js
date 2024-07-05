function sendResetLink() {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the email input value
    const email = document.getElementById('email').value;

    // Simple email validation (you can enhance this with more robust validation if needed)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    // Simulate sending a reset link (you would replace this with actual logic to send an email)
    alert(`A password reset link has been sent to ${email}.`);

    // Optionally, you can clear the input field after submission
    document.getElementById('email').value = '';

    return false; // Prevent form from being submitted normally
}
