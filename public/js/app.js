document.addEventListener('DOMContentLoaded', () => {
    
    // Booking Form Submission
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const msgEl = document.getElementById('booking-msg');
            msgEl.className = 'form-message';
            msgEl.style.display = 'none';

            const formData = new FormData(bookingForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/appointments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (!response.ok) {
                    throw new Error(result.error || 'Something went wrong');
                }

                msgEl.textContent = "Appointment booked successfully! We will see you soon.";
                msgEl.classList.add('success');
                msgEl.style.display = 'block';
                bookingForm.reset();

            } catch (error) {
                msgEl.textContent = error.message;
                msgEl.classList.add('error');
                msgEl.style.display = 'block';
            }
        });
    }

    // Check Status Submission
    const statusForm = document.getElementById('status-form');
    if (statusForm) {
        statusForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const phone = document.getElementById('checkPhone').value;
            const resultsContainer = document.getElementById('status-results');
            resultsContainer.innerHTML = '<p class="text-center">Loading...</p>';

            try {
                const response = await fetch(`/api/appointments/${phone}`);
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to fetch appointments');
                }

                if (result.appointments.length === 0) {
                    resultsContainer.innerHTML = '<p class="text-center text-muted" style="margin-top:1rem;">No appointments found for this phone number.</p>';
                    return;
                }

                let html = '';
                result.appointments.forEach(app => {
                    const statusClass = `badge-${app.status.toLowerCase()}`;
                    html += `
                        <div class="result-item">
                            <div class="result-info">
                                <h4>Dr. Consultation - ${app.patientName}</h4>
                                <p>📅 ${app.date} | ⏰ ${app.time}</p>
                            </div>
                            <div>
                                <span class="status-badge ${statusClass}">${app.status}</span>
                            </div>
                        </div>
                    `;
                });
                resultsContainer.innerHTML = html;

            } catch (error) {
                resultsContainer.innerHTML = `<p class="text-center text-muted" style="color:var(--status-cancelled)!important; margin-top:1rem;">${error.message}</p>`;
            }
        });
    }
});
