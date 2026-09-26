document.addEventListener('DOMContentLoaded', () => {
    const feedPanel = document.querySelector('.feed-panel');
    const pulsingText = document.querySelector('.pulsing-text');
    
    function renderFeed() {
        // Clear all existing feed items (except h2)
        const items = feedPanel.querySelectorAll('.feed-item');
        items.forEach(item => item.remove());
        
        const attendance = DB.get('attendance') || [];
        attendance.forEach(record => {
            const feedItem = document.createElement('div');
            feedItem.className = 'feed-item';
            
            // Add a brief highlight animation for new items
            feedItem.style.animation = 'pulse-text 0.5s ease-out';
            
            feedItem.innerHTML = `
                <div class="feed-user">
                    <div class="avatar" style="background:${record.avatarColor};">${record.initials}</div>
                    <div class="feed-user-info">
                        <span class="feed-user-name">${record.name}</span>
                        <span class="feed-time">${record.time}</span>
                    </div>
                </div>
                <span class="badge badge-success">
                    <span class="material-symbols-outlined text-sm" style="font-size:16px;">check_circle</span>
                </span>
            `;
            feedPanel.appendChild(feedItem);
        });
    }

    // Initial render from DB
    renderFeed();

    // --- HTML5 QR CODE SCANNER SETUP ---
    let lastScanTime = 0;
    
    function onScanSuccess(decodedText, decodedResult) {
        const now = Date.now();
        // Prevent multiple rapid scans of the same code within 3 seconds
        if (now - lastScanTime < 3000) return;
        lastScanTime = now;
        
        // Visual feedback
        pulsingText.textContent = 'Delegate QR Verified!';
        pulsingText.style.color = 'var(--deep-green)';
        pulsingText.style.fontWeight = '700';
        
        setTimeout(() => {
            pulsingText.textContent = 'Scanning for Delegate QR...';
            pulsingText.style.color = 'var(--navy-blue)';
            pulsingText.style.fontWeight = 'normal';
        }, 2000);

        // Process the scanned text
        let name = decodedText;
        // Basic fallback initials if the QR is just a string
        let initials = name.substring(0, 2).toUpperCase();
        
        // Color randomization for avatars
        const colors = ['var(--flame-orange-2)', 'var(--navy-blue)', 'var(--deep-green)', 'var(--golden-yellow)'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        // Get current time
        const dateObj = new Date();
        let hours = dateObj.getHours();
        let minutes = dateObj.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        minutes = minutes < 10 ? '0'+minutes : minutes;
        const timeStr = hours + ':' + minutes + ' ' + ampm;

        // Insert to DB
        const newRecord = {
            id: 'scan_' + Date.now(),
            initials: initials,
            name: name,
            time: timeStr,
            avatarColor: randomColor
        };

        DB.insert('attendance', newRecord);
        
        // Re-render the feed
        renderFeed();
    }

    function onScanFailure(error) {
        // handle scan failure, usually better to ignore and keep scanning.
    }

    // Initialize the scanner if the library is loaded
    if (typeof Html5QrcodeScanner !== 'undefined') {
        let html5QrcodeScanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: {width: 250, height: 250} },
            /* verbose= */ false
        );
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    } else {
        pulsingText.textContent = 'Error: QR Library failed to load.';
        pulsingText.style.color = 'red';
    }
});
