// API Configuration - UPDATE THESE FOR YOUR BACKEND
const BACKEND_CONFIG = {
    BASE_URL: 'http://localhost:3000', // Change to your backend URL and port
    API_PREFIX: '/api',
    AUTH_PREFIX: '/auth'
};

const API_BASE_URL = `${BACKEND_CONFIG.BASE_URL}${BACKEND_CONFIG.API_PREFIX}${BACKEND_CONFIG.AUTH_PREFIX}`;

// Debug mode - set to true to see what's happening
const DEBUG_MODE = true;

function debugLog(message, data = null) {
    if (DEBUG_MODE) {
        console.log(`[DEBUG] ${message}`, data || '');
    }
}

// DOM Elements
const loginSection = document.getElementById('login-section');
const signupSection = document.getElementById('signup-section');
const dashboardSection = document.getElementById('dashboard');
const accountSection = document.getElementById('account-section');

// Check if elements exist
if (!loginSection || !signupSection || !dashboardSection || !accountSection) {
    console.error('CRITICAL: One or more page sections not found!');
    console.log('Available sections:', {
        login: !!loginSection,
        signup: !!signupSection,
        dashboard: !!dashboardSection,
        account: !!accountSection
    });
}

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignupLink = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');
const navLinks = document.querySelectorAll('.nav-link');
const logoutLink = document.getElementById('logout-link');
const loginLink = document.getElementById('login-link');
const accountLogoutBtn = document.getElementById('account-logout');

// Fallback to localStorage if backend is not available
const USE_BACKEND = false; // Set to false to use localStorage for testing

// Check authentication status
async function checkAuthStatus() {
    debugLog('Checking auth status...');
    
    if (USE_BACKEND) {
        const token = localStorage.getItem('auth_token');
        
        if (token) {
            try {
                debugLog('Checking token with backend...');
                const response = await fetch(`${API_BASE_URL}/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const userData = await response.json();
                    showDashboard();
                    updateAccountInfo(userData);
                } else {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user_data');
                    showLogin();
                }
            } catch (error) {
                debugLog('Backend auth check failed, falling back to localStorage', error);
                checkLocalStorageAuth();
            }
        } else {
            showLogin();
        }
    } else {
        checkLocalStorageAuth();
    }
}

function checkLocalStorageAuth() {
    const user = JSON.parse(localStorage.getItem('agriprice_user'));
    debugLog('LocalStorage user:', user);
    
    if (user) {
        showDashboard();
        updateAccountInfo(user);
    } else {
        showLogin();
    }
}

// Show login form
function showLogin() {
    debugLog('Showing login page');
    loginSection.style.display = 'flex';
    signupSection.style.display = 'none';
    dashboardSection.style.display = 'none';
    accountSection.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'none';
    if (loginLink) loginLink.style.display = 'block';
}

// Show signup form
function showSignup() {
    debugLog('Showing signup page');
    loginSection.style.display = 'none';
    signupSection.style.display = 'flex';
    dashboardSection.style.display = 'none';
    accountSection.style.display = 'none';
}

// Show dashboard
function showDashboard() {
    debugLog('Showing dashboard');
    loginSection.style.display = 'none';
    signupSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    accountSection.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'block';
    if (loginLink) loginLink.style.display = 'none';
}

// Show account section
function showAccount() {
    debugLog('Showing account page');
    loginSection.style.display = 'none';
    signupSection.style.display = 'none';
    dashboardSection.style.display = 'none';
    accountSection.style.display = 'block';
    if (logoutLink) logoutLink.style.display = 'block';
    if (loginLink) loginLink.style.display = 'none';
    
    if (USE_BACKEND) {
        const user = JSON.parse(localStorage.getItem('user_data'));
        if (user) {
            updateAccountInfo(user);
        }
    } else {
        const user = JSON.parse(localStorage.getItem('agriprice_user'));
        if (user) {
            updateAccountInfo(user);
        }
    }
}

// Update account information
function updateAccountInfo(user) {
    debugLog('Updating account info:', user);
    if (document.getElementById('account-name')) {
        document.getElementById('account-name').textContent = user.name || user.fullName || 'N/A';
    }
    if (document.getElementById('account-email')) {
        document.getElementById('account-email').textContent = user.email || 'N/A';
    }
    if (document.getElementById('account-joined')) {
        document.getElementById('account-joined').textContent = user.joined ? new Date(user.joined).toLocaleDateString() : 'N/A';
    }
    if (document.getElementById('account-last-login')) {
        document.getElementById('account-last-login').textContent = user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A';
    }
    if (document.getElementById('account-fav-commodity')) {
        document.getElementById('account-fav-commodity').textContent = user.favCommodity || 'Not set';
    }
}

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Handle login
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    debugLog('Login form submitted');
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    let isValid = true;
    
    if (!validateEmail(email)) {
        document.getElementById('login-email-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('login-email-error').style.display = 'none';
    }
    
    if (!validatePassword(password)) {
        document.getElementById('login-password-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('login-password-error').style.display = 'none';
    }
    
    if (isValid) {
        if (USE_BACKEND) {
            // Backend login
            try {
                debugLog('Attempting backend login...');
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('auth_token', data.token || data.access_token);
                    localStorage.setItem('user_data', JSON.stringify(data.user || data.userData));
                    document.getElementById('login-success').style.display = 'block';
                    
                    setTimeout(() => {
                        showDashboard();
                    }, 1500);
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || 'Login failed. Please try again.');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Backend connection failed. Using demo mode.');
                // Fallback to localStorage
                demoLogin(email, password);
            }
        } else {
            // LocalStorage login
            demoLogin(email, password);
        }
    }
});

// Demo login using localStorage
function demoLogin(email, password) {
    debugLog('Using demo login');
    const users = JSON.parse(localStorage.getItem('agriprice_users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        user.lastLogin = new Date().toISOString();
        localStorage.setItem('agriprice_users', JSON.stringify(users));
        localStorage.setItem('agriprice_user', JSON.stringify(user));
        
        document.getElementById('login-success').style.display = 'block';
        
        setTimeout(() => {
            showDashboard();
        }, 1500);
    } else {
        alert('Invalid email or password. Try: demo@agriprice.com / password123');
    }
}

// Handle signup
signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    debugLog('Signup form submitted');
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    let isValid = true;
    
    if (name.trim() === '') {
        document.getElementById('signup-name-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('signup-name-error').style.display = 'none';
    }
    
    if (!validateEmail(email)) {
        document.getElementById('signup-email-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('signup-email-error').style.display = 'none';
    }
    
    if (!validatePassword(password)) {
        document.getElementById('signup-password-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('signup-password-error').style.display = 'none';
    }
    
    if (password !== confirmPassword) {
        document.getElementById('signup-confirm-password-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('signup-confirm-password-error').style.display = 'none';
    }
    
    if (isValid) {
        if (USE_BACKEND) {
            // Backend signup
            try {
                debugLog('Attempting backend signup...');
                const response = await fetch(`${API_BASE_URL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, password })
                });
                
                if (response.ok) {
                    document.getElementById('signup-success').style.display = 'block';
                    
                    setTimeout(() => {
                        showLogin();
                        signupForm.reset();
                    }, 2000);
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || 'Registration failed. Please try again.');
                }
            } catch (error) {
                console.error('Signup error:', error);
                alert('Backend connection failed. Using demo mode.');
                // Fallback to localStorage
                demoSignup(name, email, password);
            }
        } else {
            // LocalStorage signup
            demoSignup(name, email, password);
        }
    }
});

// Demo signup using localStorage
function demoSignup(name, email, password) {
    debugLog('Using demo signup');
    const users = JSON.parse(localStorage.getItem('agriprice_users')) || [];
    
    if (users.find(u => u.email === email)) {
        alert('A user with this email already exists.');
        return;
    }
    
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password,
        joined: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        favCommodity: 'Onion'
    };
    
    users.push(newUser);
    localStorage.setItem('agriprice_users', JSON.stringify(users));
    
    document.getElementById('signup-success').style.display = 'block';
    
    setTimeout(() => {
        showLogin();
        signupForm.reset();
    }, 2000);
}

// Handle navigation
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.getAttribute('data-page');
        debugLog('Navigation clicked:', page);
        
        if (page === 'login') {
            showLogin();
        } else if (page === 'dashboard') {
            if (USE_BACKEND) {
                const token = localStorage.getItem('auth_token');
                if (token) {
                    showDashboard();
                } else {
                    showLogin();
                }
            } else {
                const user = JSON.parse(localStorage.getItem('agriprice_user'));
                if (user) {
                    showDashboard();
                } else {
                    showLogin();
                }
            }
        } else if (page === 'account') {
            if (USE_BACKEND) {
                const token = localStorage.getItem('auth_token');
                if (token) {
                    showAccount();
                } else {
                    showLogin();
                }
            } else {
                const user = JSON.parse(localStorage.getItem('agriprice_user'));
                if (user) {
                    showAccount();
                } else {
                    showLogin();
                }
            }
        }
    });
});

// Handle logout
async function handleLogout() {
    debugLog('Logging out');
    try {
        if (USE_BACKEND) {
            const token = localStorage.getItem('auth_token');
            if (token) {
                await fetch(`${API_BASE_URL}/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
        }
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('agriprice_user');
        showLogin();
    }
}

if (logoutLink) {
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        handleLogout();
    });
}

if (accountLogoutBtn) {
    accountLogoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        handleLogout();
    });
}

// Toggle between login and signup
if (showSignupLink) {
    showSignupLink.addEventListener('click', function(e) {
        e.preventDefault();
        showSignup();
    });
}

if (showLoginLink) {
    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        showLogin();
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    debugLog('DOM loaded, initializing app...');
    console.log('=== AGRIPRICE DASHBOARD DEBUG ===');
    console.log('Backend mode:', USE_BACKEND ? 'ENABLED' : 'DISABLED (using localStorage)');
    console.log('Backend URL:', API_BASE_URL);
    console.log('==============================');
    
    checkAuthStatus();
});