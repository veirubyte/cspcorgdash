document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('.data-table tbody');
    const searchInput = document.querySelector('.search-input');
    const filterSelect = document.querySelector('.filter-select');

    function renderTable(members) {
        tbody.innerHTML = '';
        members.forEach(m => {
            const tr = document.createElement('tr');
            
            // Payment badge HTML
            let paymentHtml = '';
            if (m.payment === 'Paid') {
                paymentHtml = `<span class="badge badge-success"><span class="material-symbols-outlined text-sm" style="font-size:16px;">check_circle</span> Paid</span>`;
            } else {
                paymentHtml = `<span class="badge badge-warning"><span class="status-dot"></span> Pending</span>`;
            }

            tr.innerHTML = `
                <td><strong>${m.name}</strong><br><span style="font-size:0.8rem; color:var(--slate-gray)">${m.id}</span></td>
                <td><strong>${m.course}</strong></td>
                <td>${m.standing}</td>
                <td>${paymentHtml}</td>
                <td>
                    <button class="action-btn" title="View Digital ID" onclick="alert('Digital ID for ${m.name}')">
                        <span class="material-symbols-outlined">qr_code_2</span>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function filterData() {
        const query = searchInput.value.toLowerCase();
        const course = filterSelect.value;
        const allMembers = DB.get('members');

        const filtered = allMembers.filter(m => {
            const matchesSearch = m.name.toLowerCase().includes(query) || m.id.toLowerCase().includes(query);
            const matchesCourse = course === 'Filter by Course' || m.course === course;
            return matchesSearch && matchesCourse;
        });

        renderTable(filtered);
    }

    // Initial render
    renderTable(DB.get('members'));

    // Event listeners
    searchInput.addEventListener('input', filterData);
    filterSelect.addEventListener('change', filterData);

    // Export to CSV functionality
    const exportBtn = document.querySelector('.btn-primary');
    exportBtn.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase();
        const course = filterSelect.value;
        const allMembers = DB.get('members');

        const filtered = allMembers.filter(m => {
            const matchesSearch = m.name.toLowerCase().includes(query) || m.id.toLowerCase().includes(query);
            const matchesCourse = course === 'Filter by Course' || m.course === course;
            return matchesSearch && matchesCourse;
        });

        if (filtered.length === 0) {
            alert('No data to export.');
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Student Name,ID,Course & Section,Academic Standing,Payment Status\n";

        filtered.forEach(m => {
            const row = `"${m.name}","${m.id}","${m.course}","${m.standing}","${m.payment}"`;
            csvContent += row + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "members_roster.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
