import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, hashPassword } from "./auth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // API Routes
  // User activities
  app.get("/api/activities", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const activities = await storage.getActivitiesByUserId(req.user.id);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // User documents
  app.get("/api/documents", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const documents = await storage.getDocumentsByUserId(req.user.id);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Admin routes
  // Get all users (admin only)
  app.get("/api/admin/users", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    try {
      const users = await storage.getUsers();
      // Don't return passwords
      const usersWithoutPasswords = users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Get all content (admin only)
  app.get("/api/admin/contents", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    try {
      const contents = await storage.getContents();
      res.json(contents);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  // Create new content (admin only)
  app.post("/api/admin/contents", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    try {
      const contentData = {
        ...req.body,
        publishedDate: req.body.publishedDate || new Date().toISOString(),
        author: req.body.author || req.user.fullName || req.user.username,
      };
      
      const content = await storage.createContent(contentData);
      res.status(201).json(content);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Demo data for development
  if (process.env.NODE_ENV !== "production") {
    // Create demo activity data for the admin user
    app.get("/api/seed-demo-data", async (req, res) => {
      try {
        const admin = await storage.getUserByUsername("admin");
        
        if (admin) {
          // Create activities for admin
          await storage.createActivity({
            userId: admin.id,
            action: "Updated profile information",
            category: "Account settings",
            timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            status: "Completed",
          });
          
          await storage.createActivity({
            userId: admin.id,
            action: "Viewed document",
            category: "Annual Report",
            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            status: "Info",
          });
          
          await storage.createActivity({
            userId: admin.id,
            action: "Changed password",
            category: "Security",
            timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            status: "Completed",
          });
          
          // Create documents for admin
          await storage.createDocument({
            userId: admin.id,
            title: "Annual Report 2023",
            category: "Reports",
            type: "PDF",
            lastUpdated: new Date(Date.now() - 1209600000).toISOString(), // 2 weeks ago
            status: "public",
          });
          
          await storage.createDocument({
            userId: admin.id,
            title: "User Guide",
            category: "Guides",
            type: "DOC",
            lastUpdated: new Date(Date.now() - 2592000000).toISOString(), // 1 month ago
            status: "public",
          });
          
          // Create content items
          await storage.createContent({
            title: "2023 Annual Report",
            publishedDate: new Date(Date.now() - 1296000000).toISOString(), // 15 days ago
            status: "public",
            summary: "Annual financial report with all the highlights from fiscal year 2023...",
            views: 428,
            author: "Admin User",
          });
          
          await storage.createContent({
            title: "New Feature Announcement",
            publishedDate: new Date(Date.now() - 1728000000).toISOString(), // 20 days ago
            status: "public",
            summary: "Announcing our latest platform features launching next month...",
            views: 1024,
            author: "Admin User",
          });
          
          await storage.createContent({
            title: "Employee Handbook",
            publishedDate: new Date(Date.now() - 2160000000).toISOString(), // 25 days ago
            status: "internal",
            summary: "Updated employee handbook with new policies and guidelines...",
            views: 76,
            author: "Admin User",
          });
          
          res.json({ message: "Demo data created successfully" });
        } else {
          res.status(404).json({ message: "Admin user not found" });
        }
      } catch (error) {
        res.status(500).json({ message: (error as Error).message });
      }
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}
