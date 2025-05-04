Neural Impulse
A modern blog application built with Next.js 15.2.3, featuring user authentication, blog post management, commenting, liking, and a weather integration. The app uses MongoDB for data storage, Cloudinary for image uploads, and NextAuth.js for authentication. This project was bootstrapped with create-next-app.
Features

User authentication (signup, login, profile editing)
Blog post creation, editing, and deletion
Commenting and liking blog posts
Weather information integration
Dark/light theme support with next-themes
Responsive design with Tailwind CSS

Tech Stack

Frontend: Next.js 15.2.3, React 19, Tailwind CSS
Backend: Next.js API Routes, MongoDB, Mongoose
Authentication: NextAuth.js
Image Storage: Cloudinary
Other: TypeScript, ESLint, bcrypt, jsonwebtoken
Fonts: Optimized with next/font using Geist

Prerequisites

Node.js 20.x or later
MongoDB (local or Atlas)
Cloudinary account
Git

Installation

Clone the repository:git clone https://github.com/a leyenda/neural-impulse.git
cd neural-impulse

Install dependencies:npm install

Create a .env.local file in the root directory and add the following variables:MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
CLOUDINARY_URL=your_cloudinary_url
JWT_SECRET=your_jwt_secret

Run the development server:npm run dev

# or

yarn dev

# or

pnpm dev

# or

bun dev

Open http://localhost:3000 in your browser to see the result.

Available Scripts

npm run dev: Starts the development server with Turbopack.
npm run build: Creates an optimized production build.
npm run start: Runs the production server.
npm run lint: Runs ESLint for code linting.

Project Structure
neural-impulse/
├── app/ # App Router routes and components
│ ├── api/ # API routes
│ ├── blog/ # Blog-related pages
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Home page
├── public/ # Static assets
├── .env.local # Environment variables
├── package.json # Dependencies and scripts
├── next.config.js # Next.js configuration
├── tailwind.config.js # Tailwind CSS configuration
├── tsconfig.json # TypeScript configuration

Screenshots
Home Page

Blog Post

Learn More
To learn more about Next.js, check out these resources:

Next.js Documentation - Learn about Next.js features and API.
Learn Next.js - An interactive Next.js tutorial.
Next.js GitHub Repository - Your feedback and contributions are welcome!

Deploy on Vercel
The easiest way to deploy this app is to use the Vercel Platform. Check out the Next.js deployment documentation for more details.
Contributing

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Commit your changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a Pull Request.

License
This project is licensed under the MIT License.
Contact
For questions or feedback, reach out to your-email@example.com.
