document.addEventListener('DOMContentLoaded', () => {
    // Fallback smooth transition for browsers not supporting View Transitions API
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && link.href.endsWith('.html') && link.target !== '_blank') {
            if (!document.startViewTransition) { 
                e.preventDefault();
                document.body.classList.add('page-transitioning');
                setTimeout(() => {
                    window.location.href = link.href;
                }, 200);
            }
        }
    });

    // Welcome Modal Logic
    const hasSeenModal = localStorage.getItem('cspc_seen_welcome');
    const modal = document.getElementById('welcomeModalOverlay');
    const btnGetStarted = document.getElementById('btnGetStarted');
    const btnEnter = document.getElementById('btnEnterPortal');
    const step1 = document.getElementById('modalStep1');
    const step2 = document.getElementById('modalStep2');

    if (!hasSeenModal && modal) {
        // Show modal with a slight delay for smooth entrance
        setTimeout(() => {
            modal.classList.add('active');
        }, 300);
    }

    if (btnGetStarted) {
        btnGetStarted.addEventListener('click', () => {
            step1.style.display = 'none';
            step2.style.display = 'flex';
        });
    }

    if (btnEnter && modal) {
        btnEnter.addEventListener('click', () => {
            const username = document.getElementById('setupUsername').value.trim();
            const email = document.getElementById('setupEmail').value.trim();
            
            // Basic email regex + force CSPC student domain
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isProperEmail = emailRegex.test(email) && email.toLowerCase().endsWith('@my.cspc.edu.ph');
            
            if (!username) {
                alert("Please enter a valid username.");
                return;
            }
            if (!isProperEmail) {
                alert("Please enter a valid CSPC email address (e.g., name@my.cspc.edu.ph).");
                return;
            }

            localStorage.setItem('cspc_user_name', username);
            localStorage.setItem('cspc_user_email', email);
            localStorage.setItem('cspc_seen_welcome', 'true');
            modal.classList.remove('active');
            if (window.updateUserProfile) window.updateUserProfile();
        });
    }
    // 1. Event Attendance Trends (Bar Chart)
    const ctxBar = document.getElementById('attendanceChart').getContext('2d');
    
    // Gradient for bars
    const barGradient = ctxBar.createLinearGradient(0, 0, 0, 400);
    barGradient.addColorStop(0, '#0b1c30'); // Navy Blue
    barGradient.addColorStop(1, '#565e74'); // Slate Gray

    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{
                label: 'Attendance',
                data: [1820, 2110, 1640, 1310, 1980, 1840, 2320, 1790, 1450],
                backgroundColor: barGradient,
                borderRadius: 4,
                barPercentage: 0.6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#0b1c30',
                    bodyColor: '#565e74',
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                    boxPadding: 4,
                    usePointStyle: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.04)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#565e74',
                        font: {
                            family: "'Plus Jakarta Sans', sans-serif"
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#565e74',
                        font: {
                            family: "'Plus Jakarta Sans', sans-serif"
                        }
                    }
                }
            },
            animation: {
                y: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        }
    });

    // 2. Engagement by Department (Donut Chart)
    const ctxDonut = document.getElementById('engagementChart').getContext('2d');
    
    new Chart(ctxDonut, {
        type: 'doughnut',
        data: {
            labels: ['Engineering', 'Business', 'Arts & Sciences', 'Nursing'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: [
                    '#0b1c30', // Deep Navy Blue
                    '#ad2c00', // Flame Orange
                    '#069669', // Deep Green
                    '#d97706'  // Golden Yellow
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#565e74',
                        font: {
                            family: "'Plus Jakarta Sans', sans-serif",
                            size: 11
                        },
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
});
