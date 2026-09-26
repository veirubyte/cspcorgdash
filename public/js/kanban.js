document.addEventListener('DOMContentLoaded', () => {
    // We will render cards from the DB instead of static HTML to make it persistent
    const columns = {
        'draft': document.getElementById('col-draft'),
        'pending': document.getElementById('col-pending'),
        'live': document.getElementById('col-live')
    };
    const counts = {
        'draft': document.getElementById('count-draft'),
        'pending': document.getElementById('count-pending'),
        'live': document.getElementById('count-live')
    };

    function getBadgeClass(status) {
        if (status === 'draft') return 'badge-outline';
        if (status === 'pending') return 'badge-warning';
        return 'badge-success';
    }

    function getStatusText(status) {
        if (status === 'draft') return 'Drafting';
        if (status === 'pending') return '<span class="status-dot"></span> Pending SASO';
        return '<span class="material-symbols-outlined text-sm" style="font-size:16px;">check_circle</span> Live';
    }

    function renderBoard() {
        // Clear columns
        Object.values(columns).forEach(col => col.innerHTML = '');

        const events = DB.get('events');
        
        // Update counts
        counts.draft.textContent = events.filter(e => e.status === 'draft').length;
        counts.pending.textContent = events.filter(e => e.status === 'pending').length;
        counts.live.textContent = events.filter(e => e.status === 'live').length;

        events.forEach(event => {
            const card = document.createElement('div');
            card.className = 'kanban-card';
            card.draggable = true;
            card.id = event.id;
            card.dataset.status = event.status;

            card.innerHTML = `
                <div class="card-header">
                    <span class="badge badge-outline card-category">${event.category}</span>
                    <span class="badge ${getBadgeClass(event.status)} status-badge">
                        ${getStatusText(event.status)}
                    </span>
                </div>
                <h3 class="card-title">${event.title}</h3>
                <p class="card-desc">${event.desc}</p>
                <div class="card-meta">
                    <div class="meta-item">
                        <span class="material-symbols-outlined">calendar_today</span>
                        <span>${event.date}</span>
                    </div>
                    <div class="meta-item">
                        <span class="material-symbols-outlined">location_on</span>
                        <span>${event.location}</span>
                    </div>
                </div>
            `;

            // Drag events
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', event.id);
                setTimeout(() => card.style.opacity = '0.4', 0);
            });

            card.addEventListener('dragend', () => {
                card.style.opacity = '1';
            });

            columns[event.status].appendChild(card);
        });
    }

    // Setup drop zones
    Object.keys(columns).forEach(statusKey => {
        const column = columns[statusKey];
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
            column.style.background = 'rgba(255, 255, 255, 0.5)';
        });
        
        column.addEventListener('dragleave', (e) => {
            column.style.background = 'transparent';
        });

        column.addEventListener('drop', (e) => {
            e.preventDefault();
            column.style.background = 'transparent';
            const cardId = e.dataTransfer.getData('text/plain');
            
            // Update DB
            DB.update('events', cardId, { status: statusKey });
            
            // Re-render
            renderBoard();
        });
    });

    renderBoard();

    // New Pitch Modal Simulation
    const newPitchBtn = document.querySelector('.btn-primary');
    newPitchBtn.addEventListener('click', () => {
        const title = prompt("Enter the title for the new event pitch:");
        if (title) {
            const newEvent = {
                id: 'e' + Date.now(),
                title: title,
                category: 'New Initiative',
                status: 'draft',
                date: 'TBD',
                location: 'TBD',
                desc: 'A newly proposed event awaiting details.'
            };
            DB.insert('events', newEvent);
            renderBoard();
        }
    });
});
