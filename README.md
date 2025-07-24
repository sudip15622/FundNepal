# 🇳🇵 FundNepal - Nepal's Leading Crowdfunding Platform

**FundNepal** is a powerful, trusted, and easy-to-use crowdfunding platform designed specifically for Nepal and the Nepali community. Whether you're raising funds for medical emergencies, education, community projects, or personal causes, FundNepal provides the tools and security you need to reach your fundraising goals.

## 🌟 Features

### 🚀 **Easy Fundraising**
- **No startup fees** - Start fundraising for free
- **Multiple fundraising categories** - Medical, Education, Community, Emergency, Family, and more
- **User-friendly interface** - Create and manage fundraisers effortlessly
- **Progress tracking** - Real-time donation tracking and goal monitoring

### 💳 **Secure Payment Integration**
- **Khalti** - Popular Nepali digital wallet integration
- **eSewa** - Trusted electronic payment system
- **Secure transactions** - Full fraud protection and refund guarantee
- **Instant fund transfers** - Direct bank account integration

### 👥 **Community-Driven**
- **User authentication** - Secure NextAuth.js integration
- **Admin dashboard** - Comprehensive management tools
- **Donation tracking** - View donation history and analytics
- **Report system** - Community moderation and safety

### 🔐 **Security & Trust**
- **Fraud protection** - Up to 1-year refund guarantee
- **User verification** - Secure registration and login system
- **Content moderation** - Report inappropriate fundraisers
- **Data protection** - Secure MongoDB database with Prisma ORM

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, CSS Modules
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Payment**: Khalti API, eSewa API
- **UI Components**: React Icons, React Spinners
- **Email**: Resend API

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Environment variables for payment gateways

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/sudip15622/FundNepal.git
cd FundNepal
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
# Database
DATABASE_URL="your_mongodb_connection_string"

# NextAuth
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"

# Payment Gateways
KHALTI_SECRET_KEY="your_khalti_secret_key"
NEXT_PUBLIC_ESEWA_MERCHANT_CODE="your_esewa_merchant_code"
NEXT_PUBLIC_ESEWA_SECRET_KEY="your_esewa_secret_key"

# Base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. **Open your browser**
Visit [http://localhost:3000](http://localhost:3000) to see FundNepal in action!

## 📁 Project Structure

```
FundNepal/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── categories/        # Category pages
│   ├── dashboard/         # User dashboard
│   ├── donation/          # Payment success/failure pages
│   └── ...
├── components/            # React components
│   ├── HomePage/          # Landing page
│   ├── Dashboard/         # User dashboard
│   ├── Adminpage/         # Admin panel
│   ├── Fundraiser/        # Fundraiser details & donation
│   └── ...
├── actions/               # Server actions
├── config/                # Configuration files
├── hooks/                 # Custom React hooks
├── prisma/                # Database schema
├── public/                # Static assets
└── utils/                 # Utility functions
```

## 🎯 Key Functionalities

### For Fundraisers
- **Create Fundraisers** - Set goals, add descriptions, photos, and beneficiary details
- **Manage Campaigns** - Edit details, track progress, and manage donations
- **Withdraw Funds** - Direct bank transfer integration
- **Analytics** - View donation patterns and supporter information

### For Donors
- **Browse Campaigns** - Discover fundraisers by category or search
- **Secure Donations** - Multiple payment options with fraud protection
- **Track Impact** - See how donations are making a difference
- **Share Campaigns** - Help spread awareness

### For Administrators
- **User Management** - Monitor and manage user accounts
- **Campaign Oversight** - Review and moderate fundraising campaigns
- **Transaction Monitoring** - Track all donations and payments
- **Analytics Dashboard** - Platform-wide statistics and insights

## 💰 Supported Categories

- 🏥 **Medical** - Healthcare and emergency medical expenses
- 🎓 **Education** - Scholarships, school fees, and educational support
- 🏘️ **Community** - Local development and community projects
- 🆘 **Emergency** - Disaster relief and urgent assistance
- 👨‍👩‍👧‍👦 **Family** - Family support and personal causes
- ❤️ **Charity** - Nonprofit and charitable causes

## 🔒 Security Features

- **Fraud Detection** - Automated suspicious activity monitoring
- **Secure Payments** - PCI-compliant payment processing
- **Data Encryption** - End-to-end data protection
- **Content Moderation** - Community reporting system
- **Account Verification** - Email and phone verification

## 📱 Platform Benefits

### ✅ **No Hidden Fees**
- Free to start fundraising
- Transparent transaction fees
- No platform charges for creating campaigns

### ✅ **Local Payment Methods**
- Khalti integration for digital payments
- eSewa support for electronic transactions
- Bank transfer capabilities

### ✅ **Nepal-Focused**
- Designed for Nepali users
- Local language support
- Understanding of local payment preferences
- Community-driven approach

## 🤝 Contributing

We welcome contributions to make FundNepal even better! Please feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions:

- 📧 Email: support@fundnepal.com
- 🐛 Issues: [GitHub Issues](https://github.com/sudip15622/FundNepal/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/sudip15622/FundNepal/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for the Nepali community
- Powered by modern web technologies
- Secured by trusted payment partners
- Designed for social impact

---

**Start your fundraising journey today with FundNepal - where every donation makes a difference! 🇳🇵**
