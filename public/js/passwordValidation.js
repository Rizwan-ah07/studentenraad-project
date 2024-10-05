// Password Strength Meter for Reset Password Form
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('newPassword');
    const passwordConfirmInput = document.getElementById('confirmPassword');
    const passwordError = document.getElementById('passwordError');
    const passwordRequirements = document.getElementById('passwordHelp');

    // Ensure that elements exist before proceeding
    if (!passwordInput || !passwordConfirmInput || !passwordError || !passwordRequirements) {
        return; // Exit if any element is missing
    }

    const requirements = {
        length: {
            regex: /.{8,}/,
            element: document.getElementById('length')
        },
        uppercase: {
            regex: /[A-Z]/,
            element: document.getElementById('uppercase')
        },
        number: {
            regex: /[0-9]/,
            element: document.getElementById('number')
        },
        symbol: {
            regex: /[!@#$%^&*(),.?":{}|<>]/,
            element: document.getElementById('symbol')
        }
    };

    // Show password requirements on focus
    passwordInput.addEventListener('focus', () => {
        passwordRequirements.style.display = 'block';
    });

    // Hide password requirements on blur
    passwordInput.addEventListener('blur', () => {
        setTimeout(() => {
            passwordRequirements.style.display = 'none';
        }, 200);
    });

    // Validate password on input
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        // Check each requirement
        Object.keys(requirements).forEach(key => {
            if (requirements[key].regex.test(password)) {
                requirements[key].element.classList.remove('invalid');
                requirements[key].element.classList.add('valid');
            } else {
                requirements[key].element.classList.remove('valid');
                requirements[key].element.classList.add('invalid');
            }
        });
        // Check if all requirements are met
        const allValid = Object.keys(requirements).every(key => requirements[key].regex.test(password));
        if (allValid) {
            passwordRequirements.style.display = 'none';
        } else {
            passwordRequirements.style.display = 'block';
        }

        if (passwordConfirmInput.value.length > 0) {
            validatePasswordMatch();
        }
    });

    // Validate password match on input
    passwordConfirmInput.addEventListener('input', () => {
        validatePasswordMatch();
    });

    // Validate password match
    function validatePasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = passwordConfirmInput.value;

        if (password && confirmPassword && password !== confirmPassword) {
            passwordError.style.display = 'block';
            passwordConfirmInput.classList.add('is-invalid');
        } else {
            passwordError.style.display = 'none';
            passwordConfirmInput.classList.remove('is-invalid');
        }
    }

    // Reset password form submit
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', (event) => {

            const allValid = Object.keys(requirements).every(key => requirements[key].regex.test(passwordInput.value));

            if (!allValid) {
                event.preventDefault();
                alert('Please ensure your password meets all requirements.');
                passwordRequirements.style.display = 'block';
            }

            // Check password match
            if (passwordInput.value !== passwordConfirmInput.value) {
                event.preventDefault();
                passwordError.style.display = 'block';
                passwordConfirmInput.classList.add('is-invalid');
            }
        });
    }
});