export const isValidTitle = (title) => {
    if (title == '') {
        return { success: false, error: 'Title is required!' };
    }

    const allowedCharactersRegex = /^[a-zA-Z\s.,!?'"()-]+$/;

    if (title.length < 10 || title.length > 80) {
        return { success: false, error: 'Title must be of 10 - 80 character!' };
    }
    if (!allowedCharactersRegex.test(title)) {
        return { success: false, error: 'Title cannot container unnecessary characters or digits!' };
    }

    return { success: true };
}

export const isValidDesc = (desc) => {
    if (desc == '') {
        return { success: false, error: 'Description is required!' };
    }

    if (desc.length < 200 || desc.length > 2000) {
        return { success: false, error: 'Description must be of 200 - 2000 characters!' };
    }
    return { success: true };
}

export const isValidCategory = (category) => {
    if (category != '') {
        return { success: true };
    }
    return { success: false, error: 'Fundraiser category was not selected!' };
}

export const isValidType = (type) => {
    if (type != '') {
        return { success: true };
    }
    return { success: false, error: 'Fundraiser type was not selected!' };
}

export const isValidGoal = (goal) => {
    if (goal == '') {
        return { success: false, error: 'Goal is required!' };
    }
    const regex = /^\d+$/;
    if (!regex.test(goal)) {
        return { success: false, error: 'Goal can only contain digits!' };
    }
    if ((parseInt(goal, 10) < 1000)) {
        return { success: false, error: 'Goal must be greater than 1000!' };
    }
    if ((parseInt(goal, 10) > 1000000)) {
        return { success: false, error: 'Goal must be less than 1000000!' };
    }
    return { success: true };
}

export const isValidPhoto = (photo) => {
    const sizeInKB = photo.fileSize / (1024);
    const validType = ["image/png", "image/jpeg", "image/jpg"];
    if (sizeInKB <= 600 && validType.includes(photo.fileContentType)) {
        return { success: true };
    }
    return { success: false, error: 'Invalid photo!' };
}

const validateFunctions = {
    title: isValidTitle,
    description: isValidDesc,
    goal: isValidGoal,
    category: isValidCategory,
    type: isValidType,
    photo: isValidPhoto,
}

export function isValidDetails(details) {
    try {
        const newDetails = { ...details };

        for (let i = 0; i < newDetails.length; i++) {
            const key = newDetails[i];
            const fieldValue = newDetails[key];

            const validation = validateFunctions[key](fieldValue);

            if (!validation?.success) {
                return { success: false, error: validation?.error };
            }
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: error };
    }
}


const districts = [
    "Achham",
    "Arghakhanchi",
    "Baglung",
    "Baitadi",
    "Bajhang",
    "Bajura",
    "Banke",
    "Bara",
    "Bardiya",
    "Bhaktapur",
    "Bhojpur",
    "Chitwan",
    "Dailekh",
    "Dang",
    "Darchula",
    "Dadeldhura",
    "Dhading",
    "Dhanusha",
    "Dhankuta",
    "Dolakha",
    "Dolpa",
    "Doti",
    "Eastern Rukum",
    "Gorkha",
    "Gulmi",
    "Humla",
    "Ilam",
    "Jajarkot",
    "Jhapa",
    "Jumla",
    "Kailali",
    "Kalikot",
    "Kanchanpur",
    "Kapilavastu",
    "Kaski",
    "Kathmandu",
    "Kavrepalanchok",
    "Khotang",
    "Lalitpur",
    "Lamjung",
    "Mahottari",
    "Manang",
    "Makwanpur",
    "Mugu",
    "Morang",
    "Mustang",
    "Myagdi",
    "Nawalpur",
    "Nuwakot",
    "Okhaldhunga",
    "Panchthar",
    "Parasi",
    "Parbat",
    "Parsa",
    "Pyuthan",
    "Rajanpur",
    "Ramechhap",
    "Rasuwa",
    "Rautahat",
    "Rolpa",
    "Rupandehi",
    "Salyan",
    "Sankhuwasabha",
    "Saptari",
    "Sarlahi",
    "Siraha",
    "Solukhumbu",
    "Sindhuli",
    "Sindhupalchok",
    "Sunari",
    "Surkhet",
    "Syangja",
    "Tanahun",
    "Taplejung",
    "Tehrathum",
    "Udayapur",
    "Western Rukum"
];

export const isValidAddress = (name, str) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (nameRegex.test(str)) {
        if (name == 'district') {
            if (districts.includes(str)) {
                return { success: true };
            } else {
                return { success: false, error: 'Invalid district!' };
            }
        }
        return { success: true };
    } else {
        return { success: false, error: `${name} can only contains alphabets!` };
    }
};

export const isValidPhone = (phoneNumber) => {
    const isValid = /^(97|98)\d{8}$/.test(phoneNumber);
    if (isValid) {
        return { success: true };
    } else {
        return { success: false, error: 'Invalid phone no.!' };
    }
}
export const isValidWardNo = (wardNo) => {
    const isValid = /^\d{1,2}$/.test(wardNo);
    if (isValid) {
        return { success: true };
    } else {
        return { success: false, error: 'Ward no can contain only 2 digits!' };
    }
}
export const isValidName = (name) => {
    const isValid = /^[A-Za-z\s]+$/.test(name);
    if (isValid) {
        return { success: true };
    } else {
        return { success: false, error: 'Name can only contain alphabets!' };
    }
}

export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (regex.test(email)) {
        return { success: true };
    }
    return { success: false, error: "Invalid Email!" };
};

export const isValidUserName = (username) => {
    if (!username) {
        return { success: false, error: "Username cannot be empty" };
    }
    const validCharactersRegex = /^[a-z0-9_]+$/;
    if (!validCharactersRegex.test(username)) {
        return {
            success: false,
            error: "Username can only contain lowercase alphabets, digits, and underscores."
        };
    }
    const startsWithLetterRegex = /^[a-z]/;
    if (!startsWithLetterRegex.test(username)) {
        return {
            success: false,
            error: "Username must start with a lowercase alphabet."
        };
    }
    return { success: true };
};

const infoFunctions = {
    name: isValidName,
    phone: isValidPhone,
    street: (str) => isValidAddress('street', str),
    city: (str) => isValidAddress('city', str),
    district: (str) => isValidAddress('district', str),
    wardNo: isValidWardNo,
};

export function isValidPersonalInfo(personalInfo) {
    try {
        const newDetails = { ...personalInfo }

        for (let i = 0; i < newDetails.length; i++) {
            const key = newDetails[i];
            const fieldValue = newDetails[key];

            if (key !== 'organizerId') {
                const validation = infoFunctions[key](fieldValue);

                if (!validation?.success) {
                    return { success: false, error: validation?.error };
                }
            }
        }
        return { success: true };

    } catch (error) {
        return { success: false, error: error };
    }
}