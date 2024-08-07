document.getElementById('changePasswordForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
    }

    const response = await fetch('/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword })
    });

    const result = await response.json();

    if (response.ok) {
        alert(result.message);
        window.location.href = '/settings';
    } else {
        alert(result.message);
    }
});
