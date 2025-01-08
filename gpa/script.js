// تحديد نوع التقدير لتطبيق التنسيق المناسب
function getGradeClass(grade) {
    if (grade.startsWith('A')) return 'grade-a';
    if (grade.startsWith('B')) return 'grade-b';
    if (grade.startsWith('C')) return 'grade-c';
    if (grade.startsWith('D')) return 'grade-d';
    if (grade === 'F') return 'grade-f'; // إضافة حالة للتقدير F
    return '';
}

// إنشاء عنصر الطالب
function createStudentElement(student, rank) {
    const container = document.createElement('div');
    container.id = `student-${student['رقم الجلوس']}`;

    // معلومات الطالب
    const studentInfo = `
        <div class="student-info">
            <div class="info-item">
                <span class="info-label">الترتيب</span>
                <span class="info-value rank">${rank}</span>
            </div>
            <div class="info-item">
                <span class="info-label">اسم الطالب</span>
                <span class="info-value">${student['اسم الطالب']}</span>
            </div>
            <div class="info-item">
                <span class="info-label">رقم الجلوس</span>
                <span class="info-value">${student['رقم الجلوس']}</span>
            </div>
            <div class="info-item">
                <span class="info-label">CGPA</span>
                <span class="info-value">${student['CGPA']}</span>
            </div>
            <div class="info-item">
                <button class="print-button" onclick="printStudentResult('${student['رقم الجلوس']}')">طباعة النتيجة</button>
            </div>
        </div>
    `;

    // الفصل الأول
    const firstSemester = `
        <div class="semester">
            <div class="semester-header">
                <span>الفصل الأول</span>
                <span class="semester-gpa">GPA: ${student['First Semester GPA']}</span>
            </div>
            <div class="courses-list">
                ${student['First Semester Courses'].map(course => `
                    <div class="course-item">
                        <div class="course-code">${course['Course Code']}</div>
                        <div class="course-name">${course['Course Name']}</div>
                        <div class="point">Points: ${course['Point']}</div>
                        <div class="course-details">
                            <div class="score">${course['Degree']} درجة</div>
                            <div class="grade ${getGradeClass(course['Grade'])}">${course['Grade'] === 'F' ? 'راسب' : course['Grade']}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // الفصل الثاني
    const secondSemester = `
        <div class="semester">
            <div class="semester-header">
                <span>الفصل الثاني</span>
                <span class="semester-gpa">GPA: ${student['Second Semester GPA']}</span>
            </div>
            <div class="courses-list">
                ${student['Second Semester Courses'].map(course => `
                    <div class="course-item">
                        <div class="course-code">${course['Course Code']}</div>
                        <div class="course-name">${course['Course Name']}</div>
                        <div class="point">Points: ${course['Point']}</div>
                        <div class="course-details">
                            <div class="score">${course['Degree']} درجة</div>
                            <div class="grade ${getGradeClass(course['Grade'])}">${course['Grade'] === 'F' ? 'راسب' : course['Grade']}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    container.innerHTML = studentInfo + firstSemester + secondSemester;
    return container;
}

// ترتيب الطلاب بناءً على الـ CGPA
function calculateRanks(students) {
    students.sort((a, b) => b['CGPA'] - a['CGPA']);

    let rank = 1;
    let previousCGPA = null;

    students.forEach((student, index) => {
        if (student['CGPA'] !== previousCGPA) {
            rank = index + 1;
        }
        student.rank = rank;
        previousCGPA = student['CGPA'];
    });

    return students;
}

// طباعة نتيجة الطالب
function printStudentResult(studentId) {
    const studentElement = document.getElementById(`student-${studentId}`);

    if (!studentElement) {
        console.error('لم يتم العثور على نتيجة الطالب.');
        alert('حدث خطأ: لم يتم العثور على نتيجة الطالب.');
        return;
    }

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
        alert('لا يمكن فتح نافذة الطباعة. الرجاء التحقق من إعدادات المتصفح.');
        return;
    }

    const printContent = `
        <html>
        <head>
            <title>نتيجة الطالب</title>
            <style>
                body { font-family: Arial, sans-serif; direction: rtl; text-align: right; margin: 20px; }
                .student-info, .semester { border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; }
                .student-info { background-color: #f9f9f9; }
                .semester-header { font-weight: bold; margin-bottom: 10px; }
                .course-item { margin-bottom: 10px; }
                .grade-a { color: green; }
                .grade-b { color: blue; }
                .grade-c { color: orange; }
                .grade-d { color: red; }
                .grade-f { color: darkred; }
            </style>
        </head>
        <body>
            ${studentElement.outerHTML}
        </body>
        </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
    };
}

// تحميل البيانات
fetch('data.json')
    .then(response => response.json())
    .then(studentsData => {
        const container = document.getElementById('studentResults');

        const rankedStudents = calculateRanks(studentsData);

        rankedStudents.forEach(student => {
            const studentElement = createStudentElement(student, student.rank);
            container.appendChild(studentElement);
        });

        // تفعيل/إلغاء تفعيل الفصل الدراسي عند النقر على رأس الفصل
        const semesterHeaders = document.querySelectorAll('.semester-header');
        semesterHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const semester = this.parentElement;
                semester.classList.toggle('active');
            });
        });
    })
    .catch(error => console.error('حدث خطأ أثناء جلب البيانات:', error));