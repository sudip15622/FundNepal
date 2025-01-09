export const isValidMobileNumber = (number) => {
    const isValid = /^(97|98)\d{8}$/.test(number);
    if(!number) {
        return { success: false, error: 'Mobile no. is required!' };
    }
    if (isValid) {
        return { success: true };
    } else {
        return { success: false, error: 'Invalid mobile no.!' };
    }
}

export const isValidHolderName = (name) => {
    const isValid = /^[A-Za-z\s]+$/.test(name);
    if(!name) {
        return { success: false, error: 'Name is required!' };
    }
    if (isValid) {
        return { success: true };
    } else {
        return { success: false, error: 'Name can only contain alphabets!' };
    }
}

export const isValidAccountNumber = (number) => {
    if (!/^\d+$/.test(number)) {
        return { success: false, error: 'Account number must contain only digits.' };
    }

    // Check the length of the account number (between 5 and 18 digits)
    const length = number.length;
    if (length < 5 || length > 18) {
        return { success: false, error: 'Account number must be between 5 and 18 digits.' };
    }

    return { success: true };
}
