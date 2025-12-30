document.addEventListener('DOMContentLoaded', () => {

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Trigger Count Up Animation if it's a counter
                if (entry.target.querySelector('.counter')) {
                    const counters = entry.target.querySelectorAll('.counter');
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const speed = 200; // The lower the slower

                        const updateCount = () => {
                            const count = +counter.innerText;
                            const inc = target / speed;

                            if (count < target) {
                                counter.innerText = Math.ceil(count + inc);
                                setTimeout(updateCount, 20);
                            } else {
                                counter.innerText = target.toLocaleString(); // Add commas
                            }
                        };
                        updateCount();
                    });
                    // prevent re-running
                    entry.target.classList.remove('fade-in-up'); // Hack to prevent re-trigger logic if attached to generic fade
                }

            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .stats-container, .comparison-container, .process-steps, .calculator-container, .terminal-window');
    animatedElements.forEach(el => observer.observe(el));

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(5, 5, 16, 0.95)';
            navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        } else {
            navbar.style.background = 'rgba(5, 5, 16, 0.7)';
            navbar.style.boxShadow = 'none';
        }
    });

    // --- ROI Calculator Logic ---
    const investInput = document.getElementById('investment-input');
    const durationInput = document.getElementById('duration-input');
    const investDisplay = document.getElementById('investment-val');
    const durationDisplay = document.getElementById('duration-val');
    const resultDisplay = document.getElementById('result-display');

    if (investInput && durationInput) {
        function calculateROI() {
            const principal = parseInt(investInput.value);
            const months = parseInt(durationInput.value);

            // Displays
            investDisplay.innerText = '$' + principal.toLocaleString();
            durationDisplay.innerText = months + ' Months';

            // Simple Compounding Simulation: ~10% monthly for demo (simulating 3x over year)
            // formula: A = P(1 + r)^t
            // Using a simpler linear multiplier for visual clarity 
            // 2x minimum at 12 months, linear scale

            // Let's model: at 12 months -> 3x multiplier
            // Multiplier = 1 + (2 * (months/12))
            const multiplier = 1 + (2 * (months / 12));
            const result = principal * multiplier;

            resultDisplay.innerText = '$' + Math.floor(result).toLocaleString();
        }

        investInput.addEventListener('input', calculateROI);
        durationInput.addEventListener('input', calculateROI);
        calculateROI(); // init
    }

    // --- Terminal Simulator ---
    const terminalBody = document.getElementById('terminal-body');
    if (terminalBody) {
        const logs = [
            "Network Hashrate: Optimal",
            "New Block Mined: #839210",
            "SantrX Yield Distributed: 1420 USDC",
            "User 0x8a...2f staked 5.4 ETH",
            "Vote Proposal #42 Passed",
            "Bullguard Liquidity Pair: Added"
        ];

        let logIndex = 0;
        setInterval(() => {
            const p = document.createElement('p');
            const now = new Date();
            const time = now.toLocaleTimeString();
            p.innerText = `[${time}] > ${logs[Math.floor(Math.random() * logs.length)]}`;
            p.style.color = Math.random() > 0.8 ? '#bc13fe' : '#00ff88'; // Occasional purple log

            terminalBody.appendChild(p);

            // Scroll to bottom
            if (terminalBody.childElementCount > 6) {
                terminalBody.removeChild(terminalBody.firstChild);
            }
        }, 2000);
    }

    // --- Mobile Menu Logic (Safe Injection) ---
    // Use existing 'navbar' variable from outer scope
    const existingBtn = document.querySelector('.mobile-menu-btn');

    if (navbar && !existingBtn) {
        // Create Hamburger Icon
        const menuBtn = document.createElement('div');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.innerHTML = '☰'; // Three line burger
        menuBtn.style.cursor = 'pointer';

        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navbar.insertBefore(menuBtn, navLinks);
        } else {
            navbar.appendChild(menuBtn);
        }

        menuBtn.addEventListener('click', () => {
            navbar.classList.toggle('expanded');
            if (navbar.classList.contains('expanded')) {
                menuBtn.innerHTML = '✕';
            } else {
                menuBtn.innerHTML = '☰';
            }
        });

        // Close menu when clicking a link
        if (navLinks) {
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navbar.classList.remove('expanded');
                    menuBtn.innerHTML = '☰';
                });
            });
        }
    }
});
