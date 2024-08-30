import prisma from '@/config/prisma';

// Function to generate a unique username from the name
export const generateUsername = async (name) => {
    let username = name.toLowerCase().replace(/\s/g, ''); // Convert name to lowercase and remove spaces

    let user = await prisma.user.findUnique({ where: { userName: username } });

    // If userName already exists, append a number until it becomes unique
    let count = 1;
    while (user) {
        username = `${name.toLowerCase().replace(/\s/g, '')}${count}`;
        user = await prisma.user.findUnique({ where: { userName: username } });
        count++;
    }

    return username;
};
