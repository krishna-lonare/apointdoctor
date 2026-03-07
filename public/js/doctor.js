document.addEventListener('DOMContentLoaded', () => {
    let allAppointments = [];
    const tbody = document.getElementById('appointmentsBody');
    const filterSelect = document.getElementById('statusFilter');
    const refreshBtn = document.getElementById('refreshBtn');

    // Fetch appointments
    async function fetchAppointments() {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Loading appointments...</td></tr>';
        try {
            const res = await fetch('/api/appointments');
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || 'Failed to fetch appointments');
            
            allAppointments = data.appointments;
            renderTable();
        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="color:var(--status-cancelled)">${error.message}</td></tr>`;
        }
    }

    // Render table
    function renderTable() {
        const filterVal = filterSelect.value;
        const filtered = filterVal === 'All' 
            ? allAppointments 
            : allAppointments.filter(app => app.status === filterVal);

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No appointments found.</td></tr>';
            return;
        }

        let html = '';
        filtered.forEach(app => {
            const statusClass = `badge-${app.status.toLowerCase()}`;
            
            // Action buttons logic
            let actionBtns = '';
            if (app.status === 'Pending') {
                actionBtns = `
                    <button class="btn btn-sm btn-success action-btn" data-id="${app.id}" data-action="Confirmed">Confirm</button>
                    <button class="btn btn-sm btn-danger action-btn" data-id="${app.id}" data-action="Cancelled">Cancel</button>
                `;
            } else if (app.status === 'Confirmed') {
                actionBtns = `
                    <button class="btn btn-sm btn-danger action-btn" data-id="${app.id}" data-action="Cancelled">Cancel</button>
                `;
            } else {
                actionBtns = `<span class="text-muted" style="font-size:0.85rem;">None</span>`;
            }

            html += `
                <tr>
                    <td><strong>${app.patientName}</strong></td>
                    <td>${app.patientPhone}</td>
                    <td><span style="white-space:nowrap">${app.date}</span><br><span class="text-muted" style="font-size:0.85rem">${app.time}</span></td>
                    <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${app.symptoms}">${app.symptoms || '-'}</td>
                    <td><span class="status-badge ${statusClass}">${app.status}</span></td>
                    <td>
                        <div class="action-btns">
                            ${actionBtns}
                        </div>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
        attachActionListeners();
    }

    // Attach listeners to dynamic buttons
    function attachActionListeners() {
        const buttons = document.querySelectorAll('.action-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                const newStatus = e.target.dataset.action;
                
                if (!confirm(`Are you sure you want to mark this appointment as ${newStatus}?`)) return;

                e.target.disabled = true;
                e.target.innerText = 'Wait...';

                try {
                    const res = await fetch(`/api/appointments/${id}/status`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: newStatus })
                    });
                    
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error || 'Failed to update status');

                    // Refresh data
                    await fetchAppointments();
                } catch (error) {
                    alert(error.message);
                    await fetchAppointments();
                }
            });
        });
    }

    // Event Listeners
    filterSelect.addEventListener('change', renderTable);
    refreshBtn.addEventListener('click', fetchAppointments);

    // Initial load
    fetchAppointments();
});
