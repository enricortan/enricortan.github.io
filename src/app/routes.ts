import { createBrowserRouter, redirect } from "react-router";
import { HomePage } from "@/app/pages/HomePage";
import { WorkPage } from "@/app/pages/WorkPage";
import { AboutPage } from "@/app/pages/AboutPage";
import { ContactPage } from "@/app/pages/ContactPage";
import { CaseStudyPage } from "@/app/pages/CaseStudyPage";
import { ThoughtsPage } from "@/app/pages/ThoughtsPage";
import { BlogPostPage } from "@/app/pages/BlogPostPage";
import { AdminLoginPage } from "@/app/pages/AdminLoginPage";
import { AdminOverviewPage } from "@/app/pages/AdminOverviewPage";
import { AdminCaseStudiesPage } from "@/app/pages/AdminCaseStudiesPage";
import { AdminCaseStudyEditorPage } from "@/app/pages/AdminCaseStudyEditorPage";
import { AdminBlogPage } from "@/app/pages/AdminBlogPage";
import { AdminBlogEditorPage } from "@/app/pages/AdminBlogEditorPage";
import { AdminSettingsPage } from "@/app/pages/AdminSettingsPage";
import { AdminHomepagePage } from "@/app/pages/AdminHomepagePage";
import { AdminContactPage } from "@/app/pages/AdminContactPage";
import { AdminResetPasswordPage } from "@/app/pages/AdminResetPasswordPage";
import { RootLayout } from "@/app/components/RootLayout";
import { AdminAuthGuard } from "@/app/components/AdminAuthGuard";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: RootLayout,
      children: [
        { index: true, Component: HomePage },
        { path: "work", Component: WorkPage },
        { path: "about", Component: AboutPage },
        { path: "contact", Component: ContactPage },
        { path: "work/:id", Component: CaseStudyPage },
        { path: "thoughts", Component: ThoughtsPage },
        { path: "thoughts/:slug", Component: BlogPostPage },
      ],
    },
    {
      path: "/admin",
      children: [
        // Public admin routes — no auth required
        { path: "login",          Component: AdminLoginPage },
        { path: "reset-password", Component: AdminResetPasswordPage },

        // All other admin routes are protected by the auth guard
        {
          Component: AdminAuthGuard,
          children: [
            { path: "dashboard",        Component: AdminOverviewPage },
            { path: "homepage",         Component: AdminHomepagePage },
            { path: "case-studies",     Component: AdminCaseStudiesPage },
            { path: "case-studies/:id", Component: AdminCaseStudyEditorPage },
            { path: "blog",             Component: AdminBlogPage },
            { path: "blog/:id",         Component: AdminBlogEditorPage },
            { path: "settings",         Component: AdminSettingsPage },
            { path: "contact",          Component: AdminContactPage },
          ],
        },
      ],
    },

    // Redirect common mis-typed paths to their correct admin counterparts
    { path: "/settings",    loader: () => redirect("/admin/settings") },
    { path: "/dashboard",   loader: () => redirect("/admin/dashboard") },
    { path: "/login",       loader: () => redirect("/admin/login") },

    // /auction — served as a static file from public/auction/index.html
    // This entry prevents the wildcard catch-all from redirecting it to /
    { path: "/auction",     loader: () => { window.location.href = "/auction/"; return null; } },
    { path: "/auction/*",   loader: () => null },

    // Catch-all — redirect any unknown URL back to the homepage
    { path: "*", loader: () => redirect("/") },
  ],
  {
    basename: "/",
  },
);
