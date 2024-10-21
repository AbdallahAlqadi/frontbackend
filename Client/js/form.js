document.getElementById('fileForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileTitle = document.getElementById('fileTitle').value.trim();
    const uploadedFile = document.getElementById('fileInput').files[0];
    const messageElement = document.getElementById('message');

    // تحقق من وجود عنوان الملف
    if (!fileTitle) {
        messageElement.innerText = 'يرجى إدخال عنوان الملف.';
        return;
    }

    // تحقق من وجود ملف مرفوع
    if (!uploadedFile) {
        messageElement.innerText = 'يرجى اختيار ملف.';
        return;
    }

    // إعداد FormData لرفع البيانات
    const formData = new FormData();
    formData.append('fileTitle', fileTitle);
    formData.append('file', uploadedFile);

    messageElement.innerText = 'جاري تحميل الملف...';

    fetch('http://127.0.0.1:5005/api/data', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('خطأ في رفع الملف.');
        }
        return response.json();
    })
    .then(data => {
        messageElement.innerText = 'تم تحميل الملف بنجاح!';
        // يمكنك هنا تحديث واجهة المستخدم لإظهار اسم الملف والمعلومات الأخرى
        console.log(data);
    })
    .catch(error => {
        console.error('خطأ:', error);
        messageElement.innerText = 'حدث خطأ أثناء تحميل الملف. حاول مرة أخرى.';
    });
});


async function getData() {
    const response = await fetch('http://127.0.0.1:5005/api/data');
    if (!response.ok) {
        throw new Error('خطأ في استرجاع البيانات.');
    }
    const data = await response.json();
    return data;
}

getData()
    .then(data => {
        const v = document.getElementById('v');
        v.innerHTML = ''; // Clear previous content
        data.data.forEach(file => {
            const fileCard = document.createElement('div');
            fileCard.classList.add('file-card'); // Add class for styling
            fileCard.innerHTML = `
                <h1>Title: ${file.fileTitle}</h1>
                <a href="${file.uploadedFile}" download>Download ${file.fileTitle}</a>
            `;
            v.appendChild(fileCard);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });


    getData()
