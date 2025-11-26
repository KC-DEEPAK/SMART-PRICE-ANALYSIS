// Agricultural Prices Dashboard - Frontend JavaScript
console.log("Agricultural Prices Dashboard loaded");

// Function to format numbers
function formatNumber(num) {
    if (num === undefined || num === null) return '0';
    return new Intl.NumberFormat().format(num);
}

// Function to format currency
function formatCurrency(amount) {
    if (amount === undefined || amount === null) return '₹0.00';
    return '₹' + parseFloat(amount).toFixed(2);
}

// Function to format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    } catch (e) {
        return dateString;
    }
}

// API Base URL
const API_BASE = 'http://localhost:5000';

// Load dashboard data
async function loadDashboardData() {
    try {
        console.log('Loading dashboard data...');
        
        const [statsResponse, recentPricesResponse, topCommoditiesResponse] = await Promise.all([
            fetch(`${API_BASE}/api/stats`),
            fetch(`${API_BASE}/api/recent-prices`),
            fetch(`${API_BASE}/api/top-commodities`)
        ]);
        
        const stats = await statsResponse.json();
        const recentPrices = await recentPricesResponse.json();
        const topCommodities = await topCommoditiesResponse.json();
        
        updateDashboard(stats, recentPrices, topCommodities);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('Failed to load dashboard data. Please check if backend is running.');
    }
}

// Update dashboard with real data
function updateDashboard(stats, recentPrices, topCommodities) {
    // Update stats cards
    updateElementText('total-records', formatNumber(stats.total_records));
    updateElementText('total-commodities', formatNumber(stats.commodities));
    updateElementText('total-states', formatNumber(stats.states));
    updateElementText('total-markets', formatNumber(stats.markets));
    
    // Update recent prices table
    updateRecentPricesTable(recentPrices);
    
    // Update top commodities
    updateTopCommodities(topCommodities);
}

function updateElementText(id, text) {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
}

// Update recent prices table
function updateRecentPricesTable(prices) {
    const tbody = document.getElementById('recent-prices-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!prices || prices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No price data available</td></tr>';
        return;
    }
    
    prices.forEach(price => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${price.commodity || 'N/A'}</td>
            <td>${price.market || 'N/A'}</td>
            <td>${price.district || 'N/A'}</td>
            <td>${price.price || 'N/A'}</td>
            <td>${formatDate(price.date)}</td>
        `;
        tbody.appendChild(row);
    });
}

// Update top commodities list
function updateTopCommodities(commodities) {
    const container = document.getElementById('top-commodities-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!commodities || commodities.length === 0) {
        container.innerHTML = '<div class="text-muted">No commodities data</div>';
        return;
    }
    
    commodities.forEach(commodity => {
        const item = document.createElement('div');
        item.className = 'd-flex justify-content-between align-items-center p-2 border-bottom';
        item.innerHTML = `
            <span>${commodity.name || commodity.commodity || 'Unknown'}</span>
            <span class="badge bg-primary">${commodity.count || 0}</span>
        `;
        container.appendChild(item);
    });
}

// Show error message
function showError(message) {
    console.error('Dashboard Error:', message);
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard initialized');
    
    // Load dashboard data
    loadDashboardData();
    
    // Auto-refresh data every 30 seconds
    setInterval(loadDashboardData, 30000);
});