// Fetch profile data
async function loadProfile() {
  const token = localStorage.getItem('accessToken');
  const response = await fetch('/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
  });

  if (response.ok) {
      const data = await response.text();
      document.getElementById('profileInfo').textContent = data;
  } else if (response.status === 401 || response.status === 403) {
      // If access token is expired, try refreshing it
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
          alert('No refresh token available, please log in again');
          window.location.href = '/';
          return;
      }

      const refreshResponse = await fetch('/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: refreshToken })
      });

      if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          localStorage.setItem('accessToken', refreshData.accessToken);
          loadProfile(); // Retry loading the profile
      } else {
          alert('Session expired, please log in again');
          window.location.href = '/';
      }
  } else {
      alert('Error loading profile: ' + response.statusText);
  }
}

// Handle logout
document.getElementById('logoutButton').addEventListener('click', () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/';
});

// Initial profile load
loadProfile();