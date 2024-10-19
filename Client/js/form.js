document.getElementById('fileForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileTitle = document.getElementById('fileTitle').value.trim();
    const uploadedFile = document.getElementById('fileInput').files[0];

    // تحقق من وجود عنوان الملف
    if (!fileTitle) {
        document.getElementById('message').innerText = 'يرجى إدخال عنوان الملف.'; // Please enter a file title
        return;
    }

    // تحقق من وجود الملف المرفوع
    if (!uploadedFile) {
        document.getElementById('message').innerText = 'يرجى اختيار ملف.'; // Please select a file
        return;
    }

    // التحقق من حجم الملف (5 ميغابايت كحد أقصى)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (uploadedFile.size > maxSize) {
        document.getElementById('message').innerText = 'حجم الملف كبير جدًا. الحد الأقصى هو 5 ميغابايت.'; // The file is too large. Maximum size is 5MB
        return;
    }

    // يمكنك إضافة التحقق من نوع الملف هنا إذا لزم الأمر
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']; // أمثلة على أنواع الملفات المسموح بها
    if (!allowedTypes.includes(uploadedFile.type)) {
        document.getElementById('message').innerText = 'نوع الملف غير مدعوم. يرجى اختيار ملف JPEG أو PNG أو PDF.'; // Unsupported file type. Please select a JPEG, PNG, or PDF file.
        return;
    }

    // إذا كانت كل الفحوصات ناجحة
    const formData = new FormData();
    formData.append('fileTitle', fileTitle);
    formData.append('file', uploadedFile);

    document.getElementById('message').innerText = 'جاري تحميل الملف...'; // Uploading file...

    fetch('http://127.0.0.1:5005/api/data', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        // تحقق من حالة الاستجابة
        if (!response.ok) {
            throw new Error('استجابة غير متوقعة من الخادم'); // Unexpected response from the server
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('استجابة غير متوقعة من الخادم'); // Unexpected response from the server
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('message').innerText = 'تم تحميل الملف بنجاح!';
        
        console.log(formData)
        // File uploaded successfully
    })
    .catch(error => {
        console.error('خطأ:', error);
        document.getElementById('message').innerText = 'حدث خطأ أثناء تحميل الملف. حاول مرة أخرى.'; // An error occurred while uploading the file. Try again.
    });
});
