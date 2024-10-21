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
    const maxSize = 30 * 1024 * 1024; // 5MB
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




async function getData() {
    const v = document.getElementById('v');
    try {
        const response = await fetch('http://127.0.0.1:5005/api/data');

        // Check for a valid response
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        // Parse the JSON response
        const data = await response.json();

        console.log('Response data:', data);

        // Clear previous content
        v.innerHTML = '';

        // Check if the data structure is correct
        if (data.success && Array.isArray(data.data)) {
            const fragment = document.createDocumentFragment();

            data.data.forEach(file => {
                const fileType = file.uploadedFile.split('.').pop().toLowerCase();
                let fileCardContent = '';

                if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType)) {
                    fileCardContent = `
                        <h1>Title: ${file.fileTitle}</h1>
                        <img src="${file.uploadedFile}" alt="${file.fileTitle}" onerror="this.src='fallback-image.jpg';">
                    `;
                } else if (['txt', 'doc', 'docx', 'pdf'].includes(fileType)) {
                    fileCardContent = `
                        <h1>Title: ${file.fileTitle}</h1>
                        <a href="${file.uploadedFile}" download>Download ${file.fileTitle}</a>
                    `;
                    if (fileType === 'pdf') {
                        fileCardContent += `
                            <iframe src="${file.uploadedFile}" style="width: 100%; height: 300px;"></iframe>
                        `;
                    }
                } else {
                    fileCardContent = `
                        <h1>Title: ${file.fileTitle}</h1>
                        <p>Cannot display this file type: ${fileType}</p>
                    `;
                }

                const fileCard = document.createElement('div');
                fileCard.classList.add('file-card');
                fileCard.innerHTML = fileCardContent;

                fragment.appendChild(fileCard);
            });

            v.appendChild(fragment);
        } else {
            v.innerHTML = '<p>Data received is not an array or is missing expected fields.</p>';
        }

    } catch (error) {
        console.error('Error:', error);
        v.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    }
}

getData();
