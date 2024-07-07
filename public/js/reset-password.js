document.getElementById('resetPasswordForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
    }

    const response = await fetch('/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword, confirmPassword })
    });

    const result = await response.json();

    if (response.ok) {
        alert(result.message);
        window.location.href = '/login';
    } else {
        alert(result.message);
    }
});
