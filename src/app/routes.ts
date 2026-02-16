import { createBrowserRouter } from "react-router";
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
import { RootLayout } from "@/app/components/RootLayout";

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
        { path: "login", Component: AdminLoginPage },
        { path: "dashboard", Component: AdminOverviewPage },
        {
          path: "case-studies",
          Component: AdminCaseStudiesPage,
        },
        {
          path: "case-studies/:id",
          Component: AdminCaseStudyEditorPage,
        },
        { path: "blog", Component: AdminBlogPage },
        { path: "blog/:id", Component: AdminBlogEditorPage },
        { path: "settings", Component: AdminSettingsPage },
        { path: "homepage", Component: AdminHomepagePage },
      ],
    },
  ],
  {
    // For enricortan.com, the basename must be the root slash
    basename: "/",
  },
);