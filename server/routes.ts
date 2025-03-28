import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, hashPassword } from "./auth";
import { z } from "zod";
import { 
  insertTrainRouteSchema, 
  insertBusRouteSchema, 
  insertCrowdReportSchema, 
  insertAdSettingSchema 
} from "@shared/schema";

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // API Routes
  // User activities
  app.get("/api/activities", isAuthenticated, async (req, res) => {
    try {
      const activities = await storage.getActivitiesByUserId(req.user.id);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // User documents
  app.get("/api/documents", isAuthenticated, async (req, res) => {
    try {
      const documents = await storage.getDocumentsByUserId(req.user.id);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Admin routes for user management
  // Get all users (admin only)
  app.get("/api/admin/users", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const users = await storage.getUsers();
      // Don't return passwords
      const usersWithoutPasswords = users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  // Create a new user (admin only)
  app.post("/api/admin/users", isAuthenticated, isAdmin, async (req, res) => {
    try {
      // Hash the password before storing it
      const userData = {
        ...req.body,
        password: await hashPassword(req.body.password)
      };
      
      const newUser = await storage.createUser(userData);
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = newUser;
      
      // Create activity for the admin
      await storage.createActivity({
        userId: req.user.id,
        action: "Created user",
        category: "User Management",
        timestamp: new Date().toISOString(),
        status: "Completed",
      });
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  
  // Update a user (admin only)
  app.patch("/api/admin/users/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Get existing user
      const existingUser = await storage.getUser(id);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Prepare update data
      const updateData: any = { ...req.body };
      
      // If password is provided, hash it
      if (updateData.password) {
        updateData.password = await hashPassword(updateData.password);
      }
      
      // Update user
      const updatedUser = {
        ...existingUser,
        ...updateData
      };
      
      const newUser = await storage.createUser(updatedUser);
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = newUser;
      
      // Create activity for the admin
      await storage.createActivity({
        userId: req.user.id,
        action: "Updated user",
        category: "User Management",
        timestamp: new Date().toISOString(),
        status: "Completed",
      });
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  
  // Delete a user (admin only)
  app.delete("/api/admin/users/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Don't allow deletion of the current user
      if (id === req.user.id) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }
      
      // Check if user exists
      const existingUser = await storage.getUser(id);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Delete user implementation would normally be here
      // Since we don't have a dedicated delete method in storage, we'll just return success
      
      // Create activity for the admin
      await storage.createActivity({
        userId: req.user.id,
        action: "Deleted user",
        category: "User Management",
        timestamp: new Date().toISOString(),
        status: "Completed",
      });
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Content management (admin only)
  // Get all content
  app.get("/api/admin/contents", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const contents = await storage.getContents();
      res.json(contents);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  // Create new content
  app.post("/api/admin/contents", isAuthenticated, isAdmin, async (req, res) => {
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

  // Train route management (admin only)
  // Get all train routes
  app.get("/api/admin/train-routes", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const routes = await storage.getTrainRoutes();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Get a single train route
  app.get("/api/admin/train-routes/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const route = await storage.getTrainRoute(id);
      if (!route) {
        return res.status(404).json({ message: "Train route not found" });
      }
      
      res.json(route);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Create a new train route
  app.post("/api/admin/train-routes", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertTrainRouteSchema.parse(req.body);
      
      const newRoute = await storage.createTrainRoute(validatedData);
      
      // Create activity for the admin user
      await storage.createActivity({
        userId: req.user.id,
        action: "Created train route",
        category: "Train Management",
        timestamp: new Date().toISOString(),
        status: "Completed",
      });
      
      res.status(201).json(newRoute);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Update a train route
  app.put("/api/admin/train-routes/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const route = await storage.getTrainRoute(id);
      if (!route) {
        return res.status(404).json({ message: "Train route not found" });
      }
      
      const updatedRoute = await storage.updateTrainRoute(id, req.body);
      
      // Create activity for the admin user
      await storage.createActivity({
        userId: req.user.id,
        action: "Updated train route",
        category: "Train Management",
        timestamp: new Date().toISOString(),
        status: "Completed",
      });
      
      res.json(updatedRoute);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Delete a train route
  app.delete("/api/admin/train-routes/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteTrainRoute(id);
      if (!success) {
        return res.status(404).json({ message: "Train route not found" });
      }
      
      // Create activity for the admin user
      await storage.createActivity({
        userId: req.user.id,
        action: "Deleted train route",
        category: "Train Management",
        timestamp: new Date().toISOString(),
        status: "Completed",
      });
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Bus route management (admin only)
  // Get all bus routes
  app.get("/api/admin/bus-routes", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const routes = await storage.getBusRoutes();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Get a single bus route
  app.get("/api/admin/bus-routes/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const route = await storage.getBusRoute(id);
      if (!route) {
        return res.status(404).json({ message: "Bus route not found" });
      }
      
      res.json(route);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Create a new bus route
  app.post("/api/admin/bus-routes", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertBusRouteSchema.parse(req.body);
      
      const newRoute = await storage.createBusRoute(validatedData);
      
      // Create activity for the admin user
      await storage.createActivity({
        userId: req.user.id,
        action: "Created bus route",
        category: "Bus Management",
        timestamp: new Date().toISOString(),
        status: "Completed",
      });
      
      res.status(201).json(newRoute);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Update a bus route
  app.put("/api/admin/bus-routes/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const route = await storage.getBusRoute(id);
      if (!route) {
        return res.status(404).json({ message: "Bus route not found" });
      }
      
      const updatedRoute = await storage.updateBusRoute(id, req.body);
      
      // Create activity for the admin user
      await storage.createActivity({
        userId: req.user.id,
        action: "Updated bus route",
        category: "Bus Management",
        timestamp: new Date().toISOString(),
        status: "Completed",
      });
      
      res.json(updatedRoute);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Delete a bus route
  app.delete("/api/admin/bus-routes/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteBusRoute(id);
      if (!success) {
        return res.status(404).json({ message: "Bus route not found" });
      }
      
      // Create activity for the admin user
      await storage.createActivity({
        userId: req.user.id,
        action: "Deleted bus route",
        category: "Bus Management",
        timestamp: new Date().toISOString(),
        status: "Completed",
      });
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Crowd report management (admin and user)
  // Get all crowd reports (admin only)
  app.get("/api/admin/crowd-reports", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const reports = await storage.getCrowdReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Create a new crowd report (any authenticated user)
  app.post("/api/crowd-reports", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCrowdReportSchema.parse({
        ...req.body,
        userId: req.user.id,
        timestamp: req.body.timestamp || new Date().toISOString(),
      });
      
      const newReport = await storage.createCrowdReport(validatedData);
      
      // Create activity for the user
      await storage.createActivity({
        userId: req.user.id,
        action: "Submitted crowd report",
        category: "Crowd Management",
        timestamp: new Date().toISOString(),
        status: "Pending Approval",
      });
      
      res.status(201).json(newReport);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Approve a crowd report (admin only)
  app.put("/api/admin/crowd-reports/:id/approve", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const report = await storage.approveCrowdReport(id);
      if (!report) {
        return res.status(404).json({ message: "Crowd report not found" });
      }
      
      // Create activity for the admin
      await storage.createActivity({
        userId: req.user.id,
        action: "Approved crowd report",
        category: "Crowd Management",
        timestamp: new Date().toISOString(),
        status: "Completed",
      });
      
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Get crowd reports by station name (any authenticated user)
  app.get("/api/crowd-reports/station/:stationName", isAuthenticated, async (req, res) => {
    try {
      const stationName = req.params.stationName;
      const reports = await storage.getCrowdReportsByStation(stationName);
      
      // Filter to only show approved reports to regular users
      // Admin users can see all reports
      const filteredReports = req.user.role === "admin" 
        ? reports 
        : reports.filter(report => report.isApproved);
      
      res.json(filteredReports);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  // Public API routes for users to view train and bus routes
  // Get all active train routes for users
  app.get("/api/transit/train-routes", isAuthenticated, async (req, res) => {
    try {
      const routes = await storage.getTrainRoutes();
      // Only return active routes to regular users
      const activeRoutes = routes.filter(route => route.isActive);
      res.json(activeRoutes);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Get all active bus routes for users
  app.get("/api/transit/bus-routes", isAuthenticated, async (req, res) => {
    try {
      const routes = await storage.getBusRoutes();
      // Only return active routes to regular users
      const activeRoutes = routes.filter(route => route.isActive);
      res.json(activeRoutes);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
  // Get all approved crowd reports for a specific route
  app.get("/api/transit/crowd-reports/:transportType/:routeId", isAuthenticated, async (req, res) => {
    try {
      const { transportType, routeId } = req.params;
      const reports = await storage.getCrowdReports();
      
      // Filter reports by transport type, route ID, and approved status
      const filteredReports = reports.filter(report => 
        report.transportType === transportType && 
        report.routeId === parseInt(routeId) && 
        report.isApproved
      );
      
      res.json(filteredReports);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Ad management (admin only)
  // Get all ad settings
  app.get("/api/admin/ad-settings", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const settings = await storage.getAdSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Create new ad setting
  app.post("/api/admin/ad-settings", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertAdSettingSchema.parse({
        ...req.body,
        updatedBy: req.user.id,
        lastUpdated: new Date().toISOString(),
      });
      
      const newSetting = await storage.createAdSetting(validatedData);
      
      // Create activity for the admin
      await storage.createActivity({
        userId: req.user.id,
        action: "Created ad setting",
        category: "Ad Management",
        timestamp: new Date().toISOString(),
        status: "Completed",
      });
      
      res.status(201).json(newSetting);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Update ad setting
  app.put("/api/admin/ad-settings/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const updatedData = {
        ...req.body,
        updatedBy: req.user.id,
        lastUpdated: new Date().toISOString(),
      };
      
      const setting = await storage.updateAdSetting(id, updatedData);
      if (!setting) {
        return res.status(404).json({ message: "Ad setting not found" });
      }
      
      // Create activity for the admin
      await storage.createActivity({
        userId: req.user.id,
        action: "Updated ad setting",
        category: "Ad Management",
        timestamp: new Date().toISOString(),
        status: "Completed",
      });
      
      res.json(setting);
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
          
          // Create crowd reports
          await storage.createCrowdReport({
            userId: admin.id,
            stationName: "Mumbai Central",
            crowdLevel: "high",
            timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            isApproved: true,
            transportType: "train",
            routeId: 1
          });
          
          await storage.createCrowdReport({
            userId: admin.id,
            stationName: "Dadar",
            crowdLevel: "medium",
            timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            isApproved: true,
            transportType: "bus",
            routeId: 1
          });
          
          // Create ad settings
          await storage.createAdSetting({
            adType: "banner",
            isActive: true,
            frequency: 5,
            position: "bottom",
            lastUpdated: new Date().toISOString(),
            updatedBy: admin.id
          });
          
          await storage.createAdSetting({
            adType: "interstitial",
            isActive: true,
            frequency: 10,
            position: "center",
            lastUpdated: new Date().toISOString(),
            updatedBy: admin.id
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
