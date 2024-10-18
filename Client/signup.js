var form = document.getElementById('form');

// post
form.addEventListener('submit', async function (e) {
    e.preventDefault(); 

    
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confpassword: document.getElementById('confpassword').value
    };

    try {
        const response = await fetch('http://127.0.0.1:5005/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
            
        });
        alert("sucssfull")

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();
        console.log('Success:', data);
        getData(); 

        // Clear fields only on success
        form.reset();

    } catch (error) {
        console.error('Error:', error);

        // Optionally, clear the fields here as well
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        document.getElementById('confpassword').value = '';
    }
});
