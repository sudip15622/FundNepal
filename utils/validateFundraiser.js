const isValidTitle = (title) => {
    if (title == '') {
        return { success: false, error: 'Invalid title on page - 3/5.!' };
    }

    const allowedCharactersRegex = /^[a-zA-Z\s.,!?'"()-]+$/;

    if (title.length < 10 || title.length > 80) {
        return { success: false, error: 'Invalid title on page - 3/5.!' };
    }
    if (!allowedCharactersRegex.test(title)) {
        return { success: false, error: 'Invalid title on page - 3/5.!' };
    }

    return { success: true };
}

const isValidDesc = (desc) => {
    if (desc == '') {
        return { success: false, error: 'Invalid description on page - 3/5.!' };
    }

    if (desc.length < 200 || desc.length > 2000) {
        return { success: false, error: 'Invalid description on page - 3/5.!' };
    }
    return { success: true };
}

const isValidCategory = (category) => {
    if (category != '') {
        return { success: true };
    }
    return { success: false, error: 'Fundraiser category was not selected on page - 1/5.!' };
}

const isValidType = (type) => {
    if (type != '') {
        return { success: true };
    }
    return { success: false, error: 'Fundraiser type was not selected on page - 1/5.!' };
}

const isValidGoal = (goal) => {
    if (goal == '') {
        return { success: false, error: 'Invalid starting goal on page - 2/5.!' };
    }
    const regex = /^\d+$/;
    if (regex.test(goal) && (parseInt(goal, 10) >= 1000) && (parseInt(goal, 10) <= 1000000)) {
        return { success: true };
    }
    return { success: false, error: 'Invalid starting goal on page - 2/5.!' };
}

const isValidPhoto = (photo) => {
    const sizeInKB = photo.fileSize / (1024);
    const validType = ["image/png", "image/jpeg", "image/jpg"];
    if (sizeInKB <= 600 && validType.includes(photo.fileContentType)) {
        return { success: true };
    }
    return { success: false, error: 'Invalid photo on page - 2/5.! ' };
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

const isValidAddress = (name, str) => {
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
        return { success: false, error: `Invalid ${name}!` };
    }
};

const isValidPhone = (phoneNumber) => {
    const isValid = /^(97|98)\d{8}$/.test(phoneNumber);
    if (isValid) {
        return { success: true };
    } else {
        return { success: false, error: 'Invalid phone no.!' };
    }
}
const isValidWardNo = (wardNo) => {
    const isValid = /^\d{1,2}$/.test(wardNo);
    if (isValid) {
        return { success: true };
    } else {
        return { success: false, error: 'Invalid ward no.!' };
    }
}

const infoFunctions = {
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

            if (key !== 'email') {
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