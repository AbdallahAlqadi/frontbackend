document.getElementById('videoForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const videoTitle = document.getElementById('videoTitle').value.trim(); // Remove spaces
    const videoFile = document.getElementById('videoFile').files[0];

    if (!videoFile) {
        document.getElementById('message').innerText = 'يرجى اختيار فيديو.'; // Please select a video
        return;
    }

    console.log('Video Title:', videoTitle);
    console.log('Video File:', videoFile);

    const formData = new FormData();
    formData.append('videoTitle', videoTitle);
    formData.append('videoFile', videoFile);

    fetch('http://127.0.0.1:5005/api/data', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        // Check if the response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Received an unexpected response from the server');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('message').innerText = 'تم تحميل الفيديو بنجاح!'; // Video uploaded successfully
    })
    .catch(error => {
        console.error('Error:', error); // Log the error to console for debugging
        document.getElementById('message').innerText = error.message; // Show error message to user
    });
});
