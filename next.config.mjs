/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn-icons-png.flaticon.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'img.freepik.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'feelaphil.wordpress.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: '*',
                port: '',
            },
        ],
    },
};

export default nextConfig;
