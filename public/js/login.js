document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const passwordInput = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: passwordInput })
        });

        const data = await response.json();

        if (response.ok) {
            if (data.message === 'Login successful') {
                window.location.href = '/'; 
            } else {
                alert('Login unsuccessful. Please try again'); 
            }
        } else {
            alert(data.error); 
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Error during login. Please try again.'); 
    }
});
