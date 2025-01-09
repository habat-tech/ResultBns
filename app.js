// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, runTransaction, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBspquJBaQrSm1JnEqr1MuTd_8PUGgpbOw",
    authDomain: "numbervistor.firebaseapp.com",
    projectId: "numbervistor",
    storageBucket: "numbervistor.appspot.com",
    messagingSenderId: "46274792407",
    appId: "1:46274792407:web:596087e37d1e0798939992",
    measurementId: "G-ES4BS066E1",
    databaseURL: "https://numbervistor-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const visitorCountRef = ref(database, 'visitorCount');

// Check if the visitor is unique using localStorage
if (!localStorage.getItem('visited')) {
    // Increase visitor count only if the visitor is unique
    runTransaction(visitorCountRef, (count) => {
        return (count || 0) + 1;
    });

    // Mark the visitor as not unique
    localStorage.setItem('visited', 'true');
}

// Display visitor count
onValue(visitorCountRef, (snapshot) => {
    const count = snapshot.val();
    document.getElementById('visitorCount').textContent = `عدد الزوار: ${count}`;
}, (error) => {
    console.error("حدث خطأ في قراءة البيانات:", error);
    document.getElementById('visitorCount').textContent = "خطأ في التحميل!";
});
