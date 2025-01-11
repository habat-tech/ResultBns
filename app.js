   // Import Firebase functions
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
        import { getDatabase, ref, runTransaction, onValue, onDisconnect, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

        // References
        const totalVisitorsRef = ref(database, 'totalVisitors');
        const activeVisitorsRef = ref(database, 'activeVisitors');
        const userRef = ref(database, `activeVisitors/${Date.now()}`);

        // Function to update the visitor display with animation
        function updateVisitorDisplay(totalCount, activeCount) {
            const visitorCountElement = document.getElementById('visitorCount');
            const newText = `الزوار الحاليين: ${activeCount} | إجمالي الزوار: ${totalCount}`;
            
            // Add fade-out effect
            visitorCountElement.style.opacity = '0';
            
            setTimeout(() => {
                visitorCountElement.textContent = newText;
                visitorCountElement.style.opacity = '1';
            }, 300);
        }

        // Track active visitors
        function trackPresence() {
            // Add this user to active visitors with timestamp
            set(userRef, {
                timestamp: serverTimestamp(),
                active: true
            });

            // Remove user when they disconnect
            onDisconnect(userRef).remove();

            // Update total visitors count if new visitor
            if (!localStorage.getItem('visited')) {
                runTransaction(totalVisitorsRef, (count) => {
                    return (count || 0) + 1;
                });
                localStorage.setItem('visited', 'true');
            }
        }

        // Start tracking
        trackPresence();

        // Listen for changes in visitor counts
        onValue(totalVisitorsRef, (snapshot) => {
            const totalCount = snapshot.val() || 0;
            
            // Get active visitors count
            onValue(activeVisitorsRef, (activeSnapshot) => {
                const activeCount = Object.keys(activeSnapshot.val() || {}).length;
                updateVisitorDisplay(totalCount, activeCount);
            });
        });

        // Cleanup on page unload
        window.addEventListener('unload', () => {
            set(userRef, null);
        });

        // Clean up old inactive visitors (older than 30 minutes)
        function cleanupInactiveVisitors() {
            const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
            
            onValue(activeVisitorsRef, (snapshot) => {
                const visitors = snapshot.val() || {};
                
                Object.entries(visitors).forEach(([key, value]) => {
                    if (value.timestamp < thirtyMinutesAgo) {
                        set(ref(database, `activeVisitors/${key}`), null);
                    }
                });
            }, { onlyOnce: true });
        }

        // Run cleanup every 5 minutes
        setInterval(cleanupInactiveVisitors, 5 * 60 * 1000);
        // Initial cleanup
        cleanupInactiveVisitors();
