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

// ترتيب الطلاب بناءً على الـ CGPA مع مراعاة القفز في الأرقام
function calculateRanks(students) {
    // ترتيب الطلاب تنازليًا بناءً على الـ CGPA
    students.sort((a, b) => b['CGPA'] - a['CGPA']);

    let rank = 1;
    let previousCGPA = null;

    students.forEach((student, index) => {
        if (student['CGPA'] !== previousCGPA) {
            rank = index + 1; // تحديث الترتيب في حالة اختلاف الـ CGPA
        }
        student.rank = rank; // إضافة الترتيب إلى بيانات الطالب
        previousCGPA = student['CGPA']; // تحديث الـ CGPA السابق
    });

    return students;
}

// تحميل البيانات من ملف JSON
fetch('data.json')
    .then(response => response.json())
    .then(studentsData => {
        const container = document.getElementById('studentResults');

        // حساب الترتيب
        const rankedStudents = calculateRanks(studentsData);

        // عرض بيانات الطلاب مع الترتيب
        rankedStudents.forEach(student => {
            const studentElement = createStudentElement(student, student.rank);
            container.appendChild(studentElement);

            // إضافة وظيفة التوسيع/طي لكل فصل دراسي
            const semesters = studentElement.querySelectorAll('.semester');
            semesters.forEach(semester => {
                const header = semester.querySelector('.semester-header');
                header.addEventListener('click', () => {
                    semester.classList.toggle('active'); // تفعيل/إلغاء تفعيل الفصل الدراسي
                });
            });
        });
    })
    .catch(error => console.error('حدث خطأ أثناء جلب البيانات:', error));