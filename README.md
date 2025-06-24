# MediMeet - Full Stack Doctor Appointment Platform

A comprehensive healthcare platform built with Next.js that connects patients with verified doctors through secure video consultations. Features include appointment booking, credit-based payment system, admin dashboard, and real-time video calls.

![MediMeet Platform](https://github.com/user-attachments/assets/a0d3d443-f5e1-433a-85a7-a76a3866858d)

## 🚀 Features

### For Patients

- **User Registration & Authentication** - Secure signup/login with Clerk
- **Doctor Discovery** - Browse doctors by specialty with detailed profiles
- **Appointment Booking** - Schedule consultations with available time slots
- **Video Consultations** - High-quality video calls powered by Vonage
- **Credit System** - Flexible subscription-based payment model
- **Appointment Management** - View, reschedule, and cancel appointments

### For Doctors

- **Professional Profiles** - Showcase expertise and credentials
- **Availability Management** - Set and update consultation hours
- **Patient Consultations** - Conduct video appointments with patients
- **Earnings Dashboard** - Track income and request payouts
- **Medical Notes** - Add consultation notes and patient records
- **Verification System** - Admin-approved doctor verification

### For Administrators

- **Doctor Verification** - Review and approve doctor applications
- **User Management** - Manage patients and doctors
- **Payout Processing** - Handle doctor payment requests
- **Platform Analytics** - Monitor platform usage and performance

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Payments**: Clerk Billing (Stripe integration)
- **Video Calls**: Vonage Video API
- **UI Components**: Shadcn/ui, Radix UI
- **Styling**: Tailwind CSS with custom design system
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+
- npm or yarn
- Git
- PostgreSQL database (or Neon account)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/medimeet.git
cd medimeet
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables Setup

Create a `.env.local` file in the root directory and add the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/medimeet"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Vonage Video API
NEXT_PUBLIC_VONAGE_APPLICATION_ID=your_vonage_app_id
VONAGE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
your_vonage_private_key_here
-----END PRIVATE KEY-----"
```

### 4. Database Setup

#### Option A: Using Neon (Recommended)

1. Create a free account at [Neon](https://neon.tech)
2. Create a new project and database
3. Copy the connection string to your `.env.local`

#### Option B: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a new database named `medimeet`
3. Update the `DATABASE_URL` with your local credentials

### 5. Run Database Migrations

```bash
npx prisma migrate dev
```

### 6. Generate Prisma Client

```bash
npx prisma generate
```

### 7. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application running.

## 🔑 Third-Party Service Setup

### Clerk Authentication Setup

1. Create a free account at [Clerk](https://clerk.com)
2. Create a new application
3. Configure the following settings:
   - **Sign-in options**: Email and password
   - **Social providers**: Optional (Google, GitHub, etc.)
   - **User profile**: Enable name and profile image
4. Copy the API keys to your `.env.local`

### Vonage Video API Setup

1. Create an account at [Vonage](https://www.vonage.com/communications-apis/)
2. Create a new Video API application
3. Download the private key file
4. Copy the Application ID and private key to your `.env.local`

### Clerk Billing Setup (Optional)

1. In your Clerk dashboard, navigate to Billing
2. Create subscription plans:
   - **Free Plan**: 0 credits, $0/month
   - **Standard Plan**: 10 credits, $19/month
   - **Premium Plan**: 24 credits, $39/month
3. Configure webhooks for subscription events

## 👤 User Roles & Access

### Creating an Admin User

Since there's no built-in admin registration, you need to manually create an admin user:

1. Register a normal account through the application
2. Access your database using Prisma Studio:
   ```bash
   npx prisma studio
   ```
3. Navigate to the `User` model
4. Find your user record and change the `role` field to `ADMIN`

Alternatively, use SQL:

```sql
UPDATE "User"
SET role = 'ADMIN'
WHERE email = 'your-admin-email@example.com';
```

### Access Levels

- **Patients**: Can book appointments, manage consultations
- **Doctors**: Can set availability, conduct consultations, manage earnings
- **Admins**: Can verify doctors, manage users, process payouts

## 🏥 Application Workflow

### Patient Journey

1. **Registration** → Sign up and complete patient profile
2. **Browse Doctors** → Search by specialty and view profiles
3. **Book Appointment** → Select time slot and provide consultation details
4. **Video Consultation** → Join secure video call at scheduled time
5. **Follow-up** → Access consultation notes and history

### Doctor Journey

1. **Registration** → Sign up and submit professional credentials
2. **Verification** → Wait for admin approval (1-2 business days)
3. **Set Availability** → Configure consultation hours
4. **Conduct Consultations** → Meet with patients via video
5. **Manage Earnings** → Track income and request payouts

### Admin Workflow

1. **Doctor Verification** → Review credentials and approve/reject applications
2. **User Management** → Monitor platform activity and manage users
3. **Payout Processing** → Approve doctor payment requests

## 💳 Credit System

### How Credits Work

- Each consultation costs **2 credits**
- Credits are purchased through subscription plans
- Credits never expire
- Unused credits roll over monthly

### Pricing Structure

- **Patient pays**: $10 per credit ($20 per consultation)
- **Doctor earns**: $8 per credit ($16 per consultation)
- **Platform fee**: $2 per credit ($4 per consultation)

## 🎥 Video Consultation Features

- **HD Video Quality** - Powered by Vonage Video API
- **Screen Sharing** - Share documents during consultations
- **Recording** - Optional session recording (with consent)
- **Mobile Support** - Works on all devices
- **Security** - End-to-end encrypted communications

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:

- **Desktop** - Full-featured experience
- **Tablet** - Optimized touch interface
- **Mobile** - Native app-like experience

## 🔒 Security Features

- **Authentication** - Secure login with Clerk
- **Data Encryption** - All sensitive data encrypted
- **HIPAA Compliance** - Healthcare data protection
- **Video Security** - Encrypted video communications
- **Role-based Access** - Granular permission system

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Deploy to Other Platforms

The application can be deployed to any platform that supports Next.js:

- **Netlify**
- **Railway**
- **DigitalOcean App Platform**
- **AWS Amplify**

## 📊 Database Schema

### Key Models

```prisma
model User {
  id                String    @id @default(uuid())
  clerkUserId       String    @unique
  email             String    @unique
  name              String?
  role              UserRole  @default(UNASSIGNED)
  credits           Int       @default(2)
  // ... other fields
}

model Appointment {
  id                String   @id @default(uuid())
  patientId         String
  doctorId          String
  startTime         DateTime
  endTime           DateTime
  status            AppointmentStatus @default(SCHEDULED)
  // ... other fields
}

model Availability {
  id        String   @id @default(uuid())
  doctorId  String
  startTime DateTime
  endTime   DateTime
  status    SlotStatus @default(AVAILABLE)
}
```

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Database commands
npx prisma studio          # Open database browser
npx prisma migrate dev      # Run migrations
npx prisma generate         # Generate Prisma client
npx prisma db push          # Push schema changes
```

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues**

```bash
# Reset database
npx prisma migrate reset
npx prisma db push
```

**Clerk Authentication Issues**

- Verify API keys in `.env.local`
- Check Clerk dashboard configuration
- Ensure redirect URLs are correct

**Video Call Issues**

- Verify Vonage credentials
- Check browser permissions for camera/microphone
- Ensure HTTPS in production

**Build Errors**

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## 📚 API Documentation

### Key Endpoints

- `POST /api/appointments` - Create appointment
- `GET /api/doctors` - List doctors
- `POST /api/video/token` - Generate video token
- `GET /api/admin/users` - Admin user management

### Server Actions

- `bookAppointment()` - Book new appointment
- `cancelAppointment()` - Cancel appointment
- `setAvailabilitySlots()` - Set doctor availability
- `updateDoctorStatus()` - Admin doctor verification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Clerk](https://clerk.com/) - Authentication platform
- [Vonage](https://www.vonage.com/) - Video API
- [Prisma](https://www.prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - UI components

## 📞 Support

For support and questions:

- Create an issue on GitHub
- Email: support@medimeet.com
- Documentation: [README.md](https://github.com/iCoderabhishek/MediMeet)

---

**Made with ❤️ by [iCoderabhishek](https://github.com/iCoderabhishek)**

⭐ Star this repository if you found it helpful!
