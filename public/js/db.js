// Global User Profile Updater
window.updateUserProfile = function() {
    const savedName = localStorage.getItem('cspc_user_name');
    const savedEmail = localStorage.getItem('cspc_user_email');
    
    if (savedName && savedEmail) {
        document.querySelectorAll('.user-name').forEach(el => el.textContent = savedName);
        document.querySelectorAll('.user-role').forEach(el => el.textContent = savedEmail);
    }
};
document.addEventListener('DOMContentLoaded', window.updateUserProfile);

// Simulated JSON Database using localStorage
const INITIAL_DATA = {
    events: [
        { id: 'e1', title: 'JPCS Web3 & Open Source Hackathon', category: 'Tech & Innovation', status: 'draft', date: 'Nov 12, 2026', location: 'CS Audio-Visual Hall', desc: '48-hour continuous student hackathon building decentralized solutions.' },
        { id: 'e2', title: 'Freshmen Algorithmic Coding BootCamp', category: 'Academic Training', status: 'draft', date: 'Dec 04, 2026', location: 'Computing Labs 3 & 4', desc: 'Preparatory weekend intensive for 1st-year enrollees.' },
        { id: 'e3', title: 'CSPC Inter-College Esports Masters 2026', category: 'Gaming & Athletics', status: 'pending', date: 'Sep 28-30, 2026', location: 'Student Activity Center', desc: 'Competitive inter-department tournament featuring Valorant, MLBB, and Tekken 8.' },
        { id: 'e4', title: 'Annual University Leadership & Civic Summit', category: 'Institutional Leadership', status: 'pending', date: 'Oct 05, 2026', location: 'Grand Amphitheater', desc: 'Mandatory governance & ethics workshop for recognized student organizations.' },
        { id: 'e5', title: '14th Bicol Youth Congress in IT', category: 'Tech & Innovation', status: 'live', date: 'Oct 18-20, 2026', location: 'CSPC Gymnasium & IT Complex', desc: 'Flagship regional technology assembly focusing on AI and cloud engineering.' },
        { id: 'e6', title: 'Student Organization General Assembly', category: 'Governance', status: 'live', date: 'Aug 24, 2026', location: 'University Gymnasium', desc: 'Official oath-taking ceremonies for incoming 2026-2027 club executives.' }
    ],
    members: [
        { id: '2024-0194-CSPC', name: 'Maria Katrina S. Velasco', course: 'BSIT-2A', standing: 'President\'s Lister', payment: 'Paid' },
        { id: '2023-0812-CSPC', name: 'Christian Dave M. Alcantara', course: 'BSCS-3A', standing: 'Dean\'s Lister', payment: 'Paid' },
        { id: '2024-0451-CSPC', name: 'Bea Angelica T. Ramos', course: 'BSIT-2A', standing: 'Regular Standing', payment: 'Pending' },
        { id: '2022-1109-CSPC', name: 'Joshua Mark L. Hernandez', course: 'BSCS-4B', standing: 'President\'s Lister', payment: 'Paid' },
        { id: '2025-0044-CSPC', name: 'Stephanie Joy P. Guinto', course: 'BSIS-1A', standing: 'Regular Standing', payment: 'Pending' }
    ],
    attendance: [
        { id: 'a1', initials: 'MR', name: 'Marc Danielle Reyes', time: '08:14 AM', avatarColor: 'var(--navy-blue)' },
        { id: 'a2', initials: 'SA', name: 'Sophia Marie Alcantara', time: '08:13 AM', avatarColor: 'var(--flame-orange-2)' },
        { id: 'a3', initials: 'JM', name: 'Joshua Kyle Mendoza', time: '08:12 AM', avatarColor: 'var(--deep-green)' },
        { id: 'a4', initials: 'PC', name: 'Patricia Nicole Cruz', time: '08:10 AM', avatarColor: 'var(--golden-yellow)' },
        { id: 'a5', initials: 'CR', name: 'Christian Dave Ramos', time: '08:08 AM', avatarColor: 'var(--slate-gray)' }
    ]
};

const DB = {
    init() {
        if (!localStorage.getItem('cspc_db')) {
            localStorage.setItem('cspc_db', JSON.stringify(INITIAL_DATA));
        }
    },
    get(collection) {
        const data = JSON.parse(localStorage.getItem('cspc_db'));
        return data[collection] || [];
    },
    set(collection, items) {
        const data = JSON.parse(localStorage.getItem('cspc_db'));
        data[collection] = items;
        localStorage.setItem('cspc_db', JSON.stringify(data));
    },
    insert(collection, item) {
        const items = this.get(collection);
        items.unshift(item); // Prepend so newest is first
        this.set(collection, items);
    },
    update(collection, id, updates) {
        const items = this.get(collection);
        const index = items.findIndex(i => i.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updates };
            this.set(collection, items);
        }
    },
    remove(collection, id) {
        const items = this.get(collection);
        const filtered = items.filter(i => i.id !== id);
        this.set(collection, filtered);
    },
    reset() {
        localStorage.setItem('cspc_db', JSON.stringify(INITIAL_DATA));
    }
};

// Initialize DB on load
DB.init();

// --- CUSTOM SELECT COMPONENT INIT ---
window.initializeCustomSelects = function() {
    const selects = document.querySelectorAll('select.glass-select');
    selects.forEach(select => {
        if (select.dataset.customized) return;
        select.dataset.customized = 'true';
        select.style.display = 'none';

        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select-wrapper';
        if (select.id) wrapper.id = select.id + '-wrapper';
        if (select.style.width) wrapper.style.width = select.style.width;

        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';
        
        const selectedText = document.createElement('span');
        selectedText.textContent = select.options[select.selectedIndex]?.text || '';
        
        const icon = document.createElement('span');
        icon.className = 'material-symbols-outlined';
        icon.textContent = 'expand_more';
        
        trigger.appendChild(selectedText);
        trigger.appendChild(icon);
        
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'custom-select-options glass-panel';
        
        Array.from(select.options).forEach((opt, index) => {
            const optDiv = document.createElement('div');
            optDiv.className = 'custom-option' + (index === select.selectedIndex ? ' selected' : '');
            optDiv.textContent = opt.text;
            optDiv.dataset.value = opt.value;
            
            optDiv.addEventListener('click', () => {
                select.value = opt.value;
                select.dispatchEvent(new Event('change'));
                
                selectedText.textContent = opt.text;
                Array.from(optionsContainer.children).forEach(c => c.classList.remove('selected'));
                optDiv.classList.add('selected');
                wrapper.classList.remove('open');
            });
            optionsContainer.appendChild(optDiv);
        });

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.custom-select-wrapper').forEach(w => {
                if (w !== wrapper) w.classList.remove('open');
            });
            wrapper.classList.toggle('open');
        });

        wrapper.appendChild(trigger);
        wrapper.appendChild(optionsContainer);
        select.parentNode.insertBefore(wrapper, select.nextSibling);
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('open'));
    });
};

document.addEventListener('DOMContentLoaded', () => {
    window.initializeCustomSelects();
});
