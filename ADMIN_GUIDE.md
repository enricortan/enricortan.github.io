# Portfolio Website with Admin CMS

A beautiful, animated UI/UX portfolio website with a complete admin system for managing content.

## 🎨 Features

- **Beautiful Design**: Gradient backgrounds, smooth animations, glass-morphism effects
- **Responsive**: Works perfectly on all devices
- **Animated**: Parallax scrolling, hover effects, micro-interactions throughout
- **Case Studies**: 4 pre-loaded detailed case study templates
- **Admin System**: Complete CMS to manage all content
- **Database-Backed**: All content stored in Supabase

## 🔐 Admin Access

### Login Credentials
- **URL**: Go to `/admin/login` or click "Admin" link in the footer
- **Password**: `enricoadminpass`

### Admin Features

1. **Dashboard**: View all your case studies at a glance
2. **Create**: Add new case studies with full details
3. **Edit**: Modify existing case studies
4. **Delete**: Remove case studies you no longer need
5. **Tabbed Editor**: Organized interface for editing:
   - **Basic Info**: Title, subtitle, category, hero image
   - **Details**: Role, duration, tools, problem, solution
   - **Process**: Add multiple design process steps
   - **Results**: Add metrics and testimonials

## 📝 How to Use the Admin System

### First Time Setup

1. Go to `/admin/login`
2. Enter password: `enricoadminpass`
3. The system will automatically initialize with 4 sample case studies
4. You're now in the admin dashboard!

### Managing Case Studies

#### Edit an Existing Case Study
1. Click "Edit" on any case study card
2. Navigate through the tabs (Basic Info, Details, Process, Results)
3. Update the content as needed
4. Click "Save Case Study"

#### Create a New Case Study
1. Click "New Case Study" button
2. Fill in all required fields (marked with *)
3. Add process steps and results using the "Add" buttons
4. Save when complete

#### Delete a Case Study
1. Click the trash icon on any case study card
2. Confirm deletion

### Content Structure

Each case study includes:
- **Basic Info**: Title, subtitle, category, year, hero image
- **Overview**: Role, duration, tools, description
- **Problem & Solution**: Detailed descriptions
- **Design Process**: Multiple steps with titles and descriptions
- **Images**: Multiple image URLs for the gallery
- **Results**: Metrics with values (e.g., "+42%", "Task Completion")
- **Testimonial**: Optional client quote with author info

## 🖼️ Adding Images

Use Unsplash URLs or any publicly accessible image URLs:
```
https://images.unsplash.com/photo-...
```

## 🎯 Customization

### Change Site Name
Edit the Navigation component in `/src/app/components/Navigation.tsx`

### Change Colors
The site uses a purple-to-blue gradient theme. To customize:
1. Update gradient classes throughout the components
2. Main gradient: `from-purple-600 to-blue-600`

### Change Password
Edit `/supabase/functions/server/index.tsx`:
```typescript
const ADMIN_PASSWORD = "your-new-password";
```

## 📱 Pages

- **Home** (`/`): Hero section, stats, featured projects, CTA
- **Case Study** (`/work/:id`): Full case study with all details
- **About** (`/about`): Experience, values, skills
- **Contact** (`/contact`): Social links, availability
- **Admin Login** (`/admin/login`): Secure login page
- **Admin Dashboard** (`/admin/dashboard`): Content management

## 🚀 Tech Stack

- **React** with React Router for navigation
- **Motion** (Framer Motion) for animations
- **Tailwind CSS** for styling
- **Supabase** for database and backend
- **TypeScript** for type safety

## 📦 Database

All data is stored in Supabase key-value store:
- Case studies: `case_study:{id}`
- Site settings: `site_settings`

Data persists across sessions and is fetched dynamically on page load.
