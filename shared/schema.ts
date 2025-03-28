import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  role: text("role").notNull().default("user"),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  action: text("action").notNull(),
  category: text("category").notNull(),
  timestamp: text("timestamp").notNull(),
  status: text("status").notNull(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull(),
  lastUpdated: text("last_updated").notNull(),
  status: text("status").notNull().default("public"),
});

export const contents = pgTable("contents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  publishedDate: text("published_date").notNull(),
  status: text("status").notNull().default("public"),
  summary: text("summary").notNull(),
  views: integer("views").notNull().default(0),
  author: text("author").notNull(),
});

// Train routes and schedules
export const trainRoutes = pgTable("train_routes", {
  id: serial("id").primaryKey(),
  routeName: text("route_name").notNull(),
  sourceStation: text("source_station").notNull(),
  destinationStation: text("destination_station").notNull(),
  departureTime: text("departure_time").notNull(),
  arrivalTime: text("arrival_time").notNull(),
  status: text("status").notNull().default("on-time"),
  trainNumber: text("train_number").notNull(),
  trainType: text("train_type").notNull().default("local"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// Bus routes and schedules
export const busRoutes = pgTable("bus_routes", {
  id: serial("id").primaryKey(),
  routeName: text("route_name").notNull(),
  routeNumber: text("route_number").notNull().unique(),
  sourceStop: text("source_stop").notNull(),
  destinationStop: text("destination_stop").notNull(),
  departureTime: text("departure_time").notNull(),
  arrivalTime: text("arrival_time").notNull(),
  frequency: text("frequency").notNull(), // like "every 15 min", "hourly" etc.
  busType: text("bus_type").notNull().default("regular"),
  fare: text("fare").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// Crowd reports by users
export const crowdReports = pgTable("crowd_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  stationName: text("station_name").notNull(),
  crowdLevel: text("crowd_level").notNull(), // "low", "medium", "high"
  timestamp: text("timestamp").notNull(),
  isApproved: boolean("is_approved").notNull().default(false),
  transportType: text("transport_type").notNull(), // "train", "bus", "metro"
  routeId: integer("route_id"),
});

// Ad management for the admin panel
export const adSettings = pgTable("ad_settings", {
  id: serial("id").primaryKey(),
  adType: text("ad_type").notNull(), // "banner", "interstitial", "rewarded"
  isActive: boolean("is_active").notNull().default(true),
  frequency: integer("frequency").notNull().default(5), // Show every X screens
  position: text("position").notNull().default("bottom"),
  lastUpdated: text("last_updated").notNull(),
  updatedBy: integer("updated_by").notNull(),
});

// Schema for insert operations
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  role: true,
});

export const insertActivitySchema = createInsertSchema(activities);
export const insertDocumentSchema = createInsertSchema(documents);
export const insertContentSchema = createInsertSchema(contents);
export const insertTrainRouteSchema = createInsertSchema(trainRoutes);
export const insertBusRouteSchema = createInsertSchema(busRoutes);
export const insertCrowdReportSchema = createInsertSchema(crowdReports);
export const insertAdSettingSchema = createInsertSchema(adSettings);

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type Content = typeof contents.$inferSelect;
export type TrainRoute = typeof trainRoutes.$inferSelect;
export type BusRoute = typeof busRoutes.$inferSelect;
export type CrowdReport = typeof crowdReports.$inferSelect;
export type AdSetting = typeof adSettings.$inferSelect;
export type InsertTrainRoute = z.infer<typeof insertTrainRouteSchema>;
export type InsertBusRoute = z.infer<typeof insertBusRouteSchema>;
export type InsertCrowdReport = z.infer<typeof insertCrowdReportSchema>;
export type InsertAdSetting = z.infer<typeof insertAdSettingSchema>;

// App settings schemas
export const appSettings = pgTable("app_settings", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  key: text("key").notNull(),
  value: text("value").notNull(),
  updatedBy: integer("updated_by"),
  updatedAt: text("updated_at").notNull().default(new Date().toISOString()),
});

export const insertAppSettingSchema = createInsertSchema(appSettings).pick({
  category: true,
  key: true,
  value: true,
  updatedBy: true
});

export type AppSetting = typeof appSettings.$inferSelect;
export type InsertAppSetting = z.infer<typeof insertAppSettingSchema>;
