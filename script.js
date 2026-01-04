class TicketNode {
    constructor(data) {
        this.data = data;
        this.next = null;
        this.prev = null;
        this.element = null;
    }
}

const generateSeats = () => Array.from({length: 50}, () => Math.random() > 0.4 ? 1 : 0);

const tickets = [
    { name: "NEON RIOT FEST", cat: "VIP", price: "$299", color: "#f59e0b", img: "https://picsum.photos/id/453/400/300", rating: "4.9", review: "Incredible visuals!", seats: generateSeats() },
    { name: "TECH SUMMIT", cat: "GENERAL", price: "$85", color: "#10b981", img: "https://picsum.photos/id/1067/400/300", rating: "4.5", review: "Very educational.", seats: generateSeats() },
    { name: "MIDNIGHT JAZZ", cat: "LOUNGE", price: "$120", color: "#ec4899", img: "https://picsum.photos/id/1082/400/300", rating: "4.7", review: "Smooth vibes.", seats: generateSeats() },
    { name: "SOLAR EXPO", cat: "PREMIUM", price: "$45", color: "#00f2ff", img: "https://picsum.photos/id/1021/400/300", rating: "4.2", review: "Well organized.", seats: generateSeats() }
];

let nodes = tickets.map(t => new TicketNode(t));
nodes.forEach((n, i) => {
    n.next = nodes[(i + 1) % nodes.length];
    n.prev = nodes[(i - 1 + nodes.length) % nodes.length];
});

let current = nodes[0];

// Navigation Pointers
const homePage = document.getElementById('homePage');
const dashboardPage = document.getElementById('dashboardPage');
const buyBtn = document.getElementById('buyTicketsBtn');
const backBtn = document.getElementById('backHomeBtn');

// Page Transition Logic
buyBtn.addEventListener('click', () => {
    homePage.classList.add('slide-up');
    setTimeout(() => {
        homePage.classList.add('hidden');
        dashboardPage.classList.remove('hidden');
        initCarousel();
    }, 800);
});

backBtn.addEventListener('click', () => {
    location.reload(); 
});

function initCarousel() {
    const stack = document.getElementById('ticketStack');
    if (stack.children.length > 0) return; 

    nodes.forEach(node => {
        const el = document.createElement('div');
        el.className = 'ticket hidden';
        const seatHTML = node.data.seats.map(s => `<div class="seat ${s ? 'available' : ''}"></div>`).join('');

        el.innerHTML = `
            <div class="ticket-inner">
                <div class="ticket-front">
                    <div class="ticket-image-container"><img class="ticket-image" src="${node.data.img}"></div>
                    <div class="ticket-body">
                        <div>
                            <span class="category-tag" style="background:${node.data.color}">${node.data.cat}</span>
                            <h2 style="font-size:22px; margin:10px 0;">${node.data.name}</h2>
                            <div style="font-size:22px; font-weight:800; color:var(--accent);">${node.data.price}</div>
                        </div>
                        <button class="flip-trigger" style="background:none; border:none; color:var(--accent); cursor:pointer; font-weight:bold; text-align:left; padding:0; margin-top:10px;">Check Availability →</button>
                    </div>
                </div>
                <div class="ticket-back">
                    <p style="font-size:11px; font-weight:bold; margin-bottom:10px; opacity:0.5;">SEATING CHART (50 SEATS)</p>
                    <div class="seat-grid">${seatHTML}</div>
                    <button class="flip-back" style="margin-top:auto; background:rgba(255,255,255,0.1); border:none; color:white; padding:10px; border-radius:10px; cursor:pointer;">Back</button>
                </div>
            </div>
        `;
        el.querySelector('.flip-trigger').addEventListener('click', () => el.classList.add('is-flipped'));
        el.querySelector('.flip-back').addEventListener('click', () => el.classList.remove('is-flipped'));
        node.element = el;
        stack.appendChild(el);
    });
    updateUI();
}

function updateUI() {
    nodes.forEach(n => {
        n.element.className = 'ticket hidden';
        n.element.classList.remove('is-flipped');
    });
    current.element.className = 'ticket active';
    current.next.element.className = 'ticket next';
    current.prev.element.className = 'ticket prev';
}

document.getElementById('nextBtn').addEventListener('click', () => { current = current.next; updateUI(); });
document.getElementById('prevBtn').addEventListener('click', () => { current = current.prev; updateUI(); });