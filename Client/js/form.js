document.getElementById('fileForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileTitle = document.getElementById('fileTitle').value.trim();
    const uploadedFile = document.getElementById('fileInput').files[0];

    const messageElement = document.getElementById('message');

    // Check for file title
    if (!fileTitle) {
        messageElement.innerText = 'يرجى إدخال عنوان الملف.'; // Please enter a file title
        return;
    }

    // Check for uploaded file
    if (!uploadedFile) {
        messageElement.innerText = 'يرجى اختيار ملف.'; // Please select a file
        return;
    }

    // Check file size (max 5 MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (uploadedFile.size > maxSize) {
        messageElement.innerText = 'حجم الملف كبير جدًا. الحد الأقصى هو 5 ميغابايت.'; // The file is too large. Maximum size is 5MB
        return;
    }

    // Disable submit button during upload
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    // Prepare FormData for upload
    const formData = new FormData();
    formData.append('fileTitle', fileTitle);
    formData.append('file', uploadedFile);

    messageElement.innerText = 'جاري تحميل الملف...'; // Uploading file...

    fetch('http://127.0.0.1:5005/api/data', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message || 'استجابة غير متوقعة من الخادم'); // Handle server error response
            });
        }
        return response.json();
    })
    .then(data => {
        messageElement.innerText = 'تم تحميل الملف بنجاح!'; // File uploaded successfully

        // Clear input fields
        document.getElementById('fileTitle').value = '';
        document.getElementById('fileInput').value = '';
    })
    .catch(error => {
        console.error('خطأ:', error);
        messageElement.innerText = 'حدث خطأ أثناء تحميل الملف. حاول مرة أخرى.'; // An error occurred while uploading the file. Try again.
    })
    .finally(() => {
        // Re-enable the submit button
        submitButton.disabled = false;
    });
});




// Function to get data
async function getData() {
    try {
        // Corrected the URL to include the protocol
        const response = await fetch('http://127.0.0.1:5005/api/data');
        const data = await response.json();
        alert("sdasda");
        // Assuming data is an array of user objects
        data.forEach(user => {
            // Corrected to use user.fileTitle
            alert(user.fileTitle);
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

getData();

