// ============================================
// PASSWORD PROTECTION
// ============================================
const CORRECT_PASSWORD = "hire-atiqur-2025";

function checkPassword() {
    const input = document.getElementById('password-input');
    const errorMsg = document.getElementById('error-msg');
    const password = input.value.trim();

    if (!password) {
        errorMsg.textContent = '⚠️ Please enter a password';
        shakeBox();
        return;
    }

    if (password === CORRECT_PASSWORD) {
        // ✅ Correct - Show CV
        document.getElementById('password-screen').style.display = 'none';
        document.getElementById('cv-content').style.display = 'block';
        sessionStorage.setItem('cv_unlocked', 'true');
        window.scrollTo(0, 0);
    } else {
        // ❌ Wrong
        errorMsg.textContent = '❌ Incorrect password. Try again.';
        input.value = '';
        input.focus();
        shakeBox();
    }
}

function shakeBox() {
    const box = document.querySelector('.password-box');
    box.style.animation = 'shake 0.5s ease';
    setTimeout(() => { box.style.animation = ''; }, 500);
}

const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

// Check session on load
window.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('cv_unlocked') === 'true') {
        document.getElementById('password-screen').style.display = 'none';
        document.getElementById('cv-content').style.display = 'block';
    }
    const input = document.getElementById('password-input');
    if (input) input.focus();
});

// ============================================
// PRINT FUNCTION
// ============================================
function handlePrint() {
    closeFAB();
    showToast('🖨️', 'Opening print dialog...');
    setTimeout(() => { window.print(); }, 500);
}

// ============================================
// PDF DOWNLOAD
// ============================================
function handleDownloadPDF() {
    closeFAB();
    showToast('⏳', 'Generating PDF... Please wait');

    const element = document.getElementById('printable-cv');
    const options = {
        margin: [10, 10, 10, 10],
        filename: 'Atiqur_Rahman_CV_QA_Automation_Engineer.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            backgroundColor: '#ffffff'
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        },
        pagebreak: {
            mode: ['avoid-all', 'css', 'legacy']
        }
    };

    element.classList.add('generating-pdf');

    html2pdf()
        .set(options)
        .from(element)
        .save()
        .then(() => {
            element.classList.remove('generating-pdf');
            showToast('✅', 'PDF downloaded successfully!');
        })
        .catch((error) => {
            element.classList.remove('generating-pdf');
            showToast('❌', 'PDF generation failed. Try Print instead.');
            console.error('PDF Error:', error);
        });
}

// ============================================
// COPY LINK
// ============================================
function handleCopyLink() {
    closeFAB();
    const url = window.location.href;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
            .then(() => { showToast('✅', 'Link copied to clipboard!'); })
            .catch(() => { fallbackCopy(url); });
    } else {
        fallbackCopy(url);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showToast('✅', 'Link copied to clipboard!');
    } catch (err) {
        showToast('❌', 'Failed to copy. Please copy manually.');
    }
    document.body.removeChild(textarea);
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(icon, message) {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toast-icon');
    const toastMessage = document.getElementById('toast-message');
    toastIcon.textContent = icon;
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// ============================================
// FAB MENU
// ============================================
function toggleFAB() {
    const fabMain = document.getElementById('fab-main');
    const fabMenu = document.getElementById('fab-menu');
    fabMain.classList.toggle('active');
    fabMenu.classList.toggle('show');
    fabMain.textContent = fabMain.classList.contains('active') ? '✕' : '📥';
}

function closeFAB() {
    const fabMain = document.getElementById('fab-main');
    const fabMenu = document.getElementById('fab-menu');
    if (fabMain && fabMenu) {
        fabMain.classList.remove('active');
        fabMenu.classList.remove('show');
        fabMain.textContent = '📥';
    }
}

document.addEventListener('click', (e) => {
    const fabContainer = document.getElementById('fab-container');
    if (fabContainer && !fabContainer.contains(e.target)) {
        closeFAB();
    }
});
