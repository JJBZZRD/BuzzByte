# JB Portfolio

A modern portfolio website built with Next.js, Tailwind CSS, and TypeScript. This portfolio showcases projects and skills with a clean, responsive design.

## Features

- Clean, modern UI with responsive design
- Dark/light mode support based on system preferences
- Animated page transitions and UI elements
- Project showcase with filtering options
- Contact form for inquiries
- Optimized performance with Next.js

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Fonts**: Geist Sans and Geist Mono
- **Deployment**: Docker, Nginx (planned)
- **Database**: PostgreSQL with Prisma (planned)

## Project Structure

```
nextjs/
├── app/
│   ├── components/     # Reusable UI components
│   ├── about/          # About page
│   ├── projects/       # Projects listing and details
│   ├── contact/        # Contact form and information
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout with common elements
│   ├── page.tsx        # Home page
│   └── ...
├── public/             # Static files
├── package.json        # Dependencies and scripts
└── ...
```

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory
   ```
   cd JBPortfolio/nextjs
   ```

3. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

4. Start the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Future Plans

- Integration with PostgreSQL database using Prisma
- Adding detailed project pages with case studies
- Implementing an analytics dashboard
- Setting up Docker containers for easy deployment
- Configuring Nginx for production serving

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Database Setup

This project uses PostgreSQL with Prisma ORM for data management. Follow these steps to set up the database:

1. **Set up PostgreSQL**:
   - Install PostgreSQL on your local machine or use a cloud provider.
   - Create a new database for the project.

2. **Configure Database Connection**:
   - Update the `.env` file with your PostgreSQL connection string:
     ```
     DATABASE_URL="postgresql://username:password@localhost:5432/jbportfolio?schema=public"
     ```
   - Replace `username`, `password`, and other parameters with your actual database credentials.

3. **Push Schema to Database**:
   ```
   npm run db:push
   ```

4. **Seed the Database with Project Data**:
   ```
   npm run db:seed
   ```

## Database Models

The database includes the following models:

- **Project**: Main project information
- **ProjectTag**: Tags associated with projects
- **Highlight**: Key highlights for each project
- **ProjectLink**: External links for projects
- **Technology**: Technologies used in each project
- **Challenge**: Challenges and solutions for projects
- **Outcome**: Project outcomes and impact
- **ProjectImage**: Images associated with projects
- **Admin**: Admin user accounts for website management

## Admin Account Management

The portfolio includes an admin area for content management. You can create or update admin accounts using the provided scripts:

### Creating/Updating an Admin User

To create a new admin user or update an existing one:

```bash
# Create or update the admin user with a specified password
node scripts/admin-seed.js your_password_here

# Example:
node scripts/admin-seed.js secure_password_123
```

This script will:
1. Create a user with the username 'admin' (or use the one defined in `.env.local`)
2. Hash the provided password securely
3. Store the admin credentials in the database
4. Display the username and confirmation message

### Admin Authentication

Once set up, you can:
1. Log in at `/admin` using your credentials
2. Access the admin dashboard
3. Manage portfolio content through the admin interface
4. View analytics data about your portfolio visitors

For security reasons, the admin authentication uses:
- HTTP-only cookies for token storage
- CSRF protection for all admin actions
- Server-side token verification
- Database-backed credentials instead of environment variables

### Security Considerations

- Your admin password is never stored in plain text, only as a secure hash
- JWT tokens are automatically refreshed to maintain secure sessions
- Admin routes are protected by middleware that redirects unauthorized users
