document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const userEmail = document.getElementById('email').value;
    const userPassword = document.getElementById('password').value;

    const loginResponse = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password: userPassword })
    });

    if (loginResponse.ok) {
        const { accessToken, refreshToken } = await loginResponse.json();
        localStorage.setItem('accessToken', accessToken);
        window.location.href = '/profile'; // Redirect to the profile page
    } else {
        alert('Login failed: ' + loginResponse.statusText);
    }
});