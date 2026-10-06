// Shared validation helpers for frontend forms (register, login, contact, profile edit).
// Each function returns an error message string, or "" if the field is valid.

export function validateName(name: string): string {
    const trimmed = name.trim();
    if (!trimmed) return "Name is required";
    if (trimmed.length < 2) return "Name must be at least 2 characters";
    if (trimmed.length > 50) return "Name must be under 50 characters";
    if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) return "Name contains invalid characters";
    return "";
}

export function validatePhone(phone: string): string {
    const trimmed = phone.trim();
    if (!trimmed) return "Phone number is required";
    // Nepali mobile numbers: 98XXXXXXXX or 97XXXXXXXX, 10 digits total
    if (!/^(97|98)\d{8}$/.test(trimmed)) {
        return "Enter a valid 10-digit Nepali phone number (starting with 97 or 98)";
    }
    return "";
}

export function validateEmail(email: string): string {
    const trimmed = email.trim();
    if (!trimmed) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Enter a valid email address";
    return "";
}

export function validatePassword(password: string): string {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    return "";
}

export function validateConfirmPassword(password: string, confirmPassword: string): string {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return "";
}

// Convenience: validate a register-style {name, phone, password} payload at once.
// Returns an object of field -> error message (only for fields that failed).
export function validateRegisterForm(fields: {
    name: string;
    phone: string;
    password: string;
}): Record<string, string> {
    const errors: Record<string, string> = {};

    const nameErr = validateName(fields.name);
    if (nameErr) errors.name = nameErr;

    const phoneErr = validatePhone(fields.phone);
    if (phoneErr) errors.phone = phoneErr;

    const passwordErr = validatePassword(fields.password);
    if (passwordErr) errors.password = passwordErr;

    return errors;
}