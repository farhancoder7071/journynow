import { 
  users, activities, documents, contents, 
  trainRoutes, busRoutes, crowdReports, adSettings, appSettings
} from "@shared/schema";
import type { 
  User, InsertUser, Activity, Document, Content, 
  TrainRoute, BusRoute, CrowdReport, AdSetting, AppSetting,
  InsertTrainRoute, InsertBusRoute, InsertCrowdReport, InsertAdSetting, InsertAppSetting
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;
  
  // Activity operations
  getActivitiesByUserId(userId: number): Promise<Activity[]>;
  createActivity(activity: Omit<Activity, 'id'>): Promise<Activity>;
  
  // Document operations
  getDocumentsByUserId(userId: number): Promise<Document[]>;
  createDocument(document: Omit<Document, 'id'>): Promise<Document>;
  
  // Content operations
  getContents(): Promise<Content[]>;
  createContent(content: Omit<Content, 'id'>): Promise<Content>;
  
  // Train route operations
  getTrainRoutes(): Promise<TrainRoute[]>;
  getTrainRoute(id: number): Promise<TrainRoute | undefined>;
  createTrainRoute(route: Omit<InsertTrainRoute, 'id'>): Promise<TrainRoute>;
  updateTrainRoute(id: number, route: Partial<Omit<TrainRoute, 'id'>>): Promise<TrainRoute | undefined>;
  deleteTrainRoute(id: number): Promise<boolean>;
  
  // Bus route operations
  getBusRoutes(): Promise<BusRoute[]>;
  getBusRoute(id: number): Promise<BusRoute | undefined>;
  createBusRoute(route: Omit<InsertBusRoute, 'id'>): Promise<BusRoute>;
  updateBusRoute(id: number, route: Partial<Omit<BusRoute, 'id'>>): Promise<BusRoute | undefined>;
  deleteBusRoute(id: number): Promise<boolean>;
  
  // Crowd report operations
  getCrowdReports(): Promise<CrowdReport[]>;
  getCrowdReportsByUserId(userId: number): Promise<CrowdReport[]>;
  getCrowdReportsByStation(stationName: string): Promise<CrowdReport[]>;
  createCrowdReport(report: Omit<InsertCrowdReport, 'id'>): Promise<CrowdReport>;
  approveCrowdReport(id: number): Promise<CrowdReport | undefined>;
  
  // Ad settings operations
  getAdSettings(): Promise<AdSetting[]>;
  getAdSetting(id: number): Promise<AdSetting | undefined>;
  createAdSetting(setting: Omit<InsertAdSetting, 'id'>): Promise<AdSetting>;
  updateAdSetting(id: number, setting: Partial<Omit<AdSetting, 'id'>>): Promise<AdSetting | undefined>;
  
  // App settings operations
  getAppSettingsByCategory(category: string): Promise<AppSetting[]>;
  getAppSetting(category: string, key: string): Promise<AppSetting | undefined>;
  upsertAppSetting(setting: InsertAppSetting): Promise<AppSetting>;
  deleteAppSetting(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: any;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private activities: Map<number, Activity>;
  private documents: Map<number, Document>;
  private contents: Map<number, Content>;
  private trainRoutes: Map<number, TrainRoute>;
  private busRoutes: Map<number, BusRoute>;
  private crowdReports: Map<number, CrowdReport>;
  private adSettings: Map<number, AdSetting>;
  private appSettings: Map<number, AppSetting>;
  
  private userIdCounter: number;
  private activityIdCounter: number;
  private documentIdCounter: number;
  private contentIdCounter: number;
  private trainRouteIdCounter: number;
  private busRouteIdCounter: number;
  private crowdReportIdCounter: number;
  private adSettingIdCounter: number;
  private appSettingIdCounter: number;
  
  sessionStore: any;

  constructor() {
    this.users = new Map();
    this.activities = new Map();
    this.documents = new Map();
    this.contents = new Map();
    this.trainRoutes = new Map();
    this.busRoutes = new Map();
    this.crowdReports = new Map();
    this.adSettings = new Map();
    this.appSettings = new Map();
    
    this.userIdCounter = 1;
    this.activityIdCounter = 1;
    this.documentIdCounter = 1;
    this.contentIdCounter = 1;
    this.trainRouteIdCounter = 1;
    this.busRouteIdCounter = 1;
    this.crowdReportIdCounter = 1;
    this.adSettingIdCounter = 1;
    this.appSettingIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Initialize with some seed data for admin
    this.users.set(1, {
      id: 1,
      username: "admin",
      password: "25eb0c0f6784b8c8ea92353713c7ea738111afaf4d950ddc12cb63941ec20572c9bb4bee6429a3856f6978172adc7e8d1e579f21c88559424ce56a02b8db578f.c85d00a12ce1c57fe08e8b227de2f461", // 'admin123' hashed
      fullName: "Admin User",
      role: "admin"
    });
    this.userIdCounter = 2;
    
    // Initialize with some sample train route data
    this.trainRoutes.set(1, {
      id: 1,
      routeName: "Central Line Express",
      sourceStation: "Mumbai Central",
      destinationStation: "Thane",
      departureTime: "06:00",
      arrivalTime: "07:15",
      status: "on-time",
      trainNumber: "MUM-001",
      trainType: "express",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    this.trainRoutes.set(2, {
      id: 2,
      routeName: "Western Line",
      sourceStation: "Churchgate",
      destinationStation: "Borivali",
      departureTime: "07:30",
      arrivalTime: "08:45",
      status: "on-time",
      trainNumber: "MUM-002",
      trainType: "local",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    this.trainRoutes.set(3, {
      id: 3,
      routeName: "Harbour Line",
      sourceStation: "CSMT",
      destinationStation: "Panvel",
      departureTime: "08:15",
      arrivalTime: "09:30",
      status: "delayed",
      trainNumber: "MUM-003",
      trainType: "local",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    this.trainRoutes.set(4, {
      id: 4,
      routeName: "Mumbai-Delhi Rajdhani",
      sourceStation: "Mumbai Central",
      destinationStation: "New Delhi",
      departureTime: "16:35",
      arrivalTime: "08:35",
      status: "on-time",
      trainNumber: "12951",
      trainType: "rajdhani",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    this.trainRoutes.set(5, {
      id: 5,
      routeName: "Mumbai-Pune Intercity",
      sourceStation: "Mumbai CSMT",
      destinationStation: "Pune",
      departureTime: "07:15",
      arrivalTime: "10:25",
      status: "on-time",
      trainNumber: "12123",
      trainType: "intercity",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    this.trainRouteIdCounter = 6;
    
    // Initialize with some sample bus route data
    this.busRoutes.set(1, {
      id: 1,
      routeName: "Mumbai Express",
      routeNumber: "BUS-123",
      sourceStop: "Dadar",
      destinationStop: "Sion",
      departureTime: "07:30",
      arrivalTime: "08:45",
      frequency: "every 15 min",
      busType: "express",
      fare: "₹35",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    this.busRoutes.set(2, {
      id: 2,
      routeName: "Bandra Local",
      routeNumber: "BUS-211",
      sourceStop: "Bandra",
      destinationStop: "Kurla",
      departureTime: "08:00",
      arrivalTime: "09:15",
      frequency: "every 10 min",
      busType: "local",
      fare: "₹25",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    this.busRoutes.set(3, {
      id: 3,
      routeName: "Worli Connector",
      routeNumber: "BUS-307",
      sourceStop: "Worli",
      destinationStop: "BKC",
      departureTime: "09:00",
      arrivalTime: "10:15",
      frequency: "every 20 min",
      busType: "air-conditioned",
      fare: "₹45",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    this.busRoutes.set(4, {
      id: 4,
      routeName: "South Mumbai Loop",
      routeNumber: "BUS-500",
      sourceStop: "CSMT",
      destinationStop: "Nariman Point",
      departureTime: "06:30",
      arrivalTime: "07:15",
      frequency: "every 30 min",
      busType: "mini",
      fare: "₹20",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    this.busRoutes.set(5, {
      id: 5,
      routeName: "Airport Express",
      routeNumber: "BUS-A1",
      sourceStop: "Andheri",
      destinationStop: "T2 Airport",
      departureTime: "05:00",
      arrivalTime: "05:45",
      frequency: "every 60 min",
      busType: "premium",
      fare: "₹100",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    this.busRouteIdCounter = 6;
    
    // Initialize with some sample app settings
    const initialSettings = [
      { id: 1, category: 'general', key: 'siteName', value: 'Transit App', updatedBy: 1, updatedAt: new Date().toISOString() },
      { id: 2, category: 'general', key: 'siteDescription', value: 'Real-time transit information and crowd reporting platform', updatedBy: 1, updatedAt: new Date().toISOString() },
      { id: 3, category: 'general', key: 'primaryColor', value: '#1976D2', updatedBy: 1, updatedAt: new Date().toISOString() },
      { id: 4, category: 'email', key: 'smtpServer', value: 'smtp.example.com', updatedBy: 1, updatedAt: new Date().toISOString() },
      { id: 5, category: 'email', key: 'smtpPort', value: '587', updatedBy: 1, updatedAt: new Date().toISOString() },
      { id: 6, category: 'security', key: 'passwordMinLength', value: '8', updatedBy: 1, updatedAt: new Date().toISOString() }
    ];
    
    initialSettings.forEach(setting => {
      this.appSettings.set(setting.id, setting as AppSetting);
    });
    
    this.appSettingIdCounter = initialSettings.length + 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Convert values iterator to array to avoid iteration issues
    const userArray = Array.from(this.users.values());
    for (const user of userArray) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    
    // Create a valid User object
    const user = {
      id,
      username: userData.username,
      password: userData.password,
      fullName: userData.fullName ?? null,  // Can be null in the schema
      role: userData.role ?? "user"         // Defaults to "user" if not provided
    } as User;
    
    this.users.set(id, user);
    return user;
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Activity operations
  async getActivitiesByUserId(userId: number): Promise<Activity[]> {
    const userActivities: Activity[] = [];
    const activitiesArray = Array.from(this.activities.values());
    for (const activity of activitiesArray) {
      if (activity.userId === userId) {
        userActivities.push(activity);
      }
    }
    return userActivities;
  }

  async createActivity(activityData: Omit<Activity, 'id'>): Promise<Activity> {
    const id = this.activityIdCounter++;
    const activity: Activity = { ...activityData, id };
    this.activities.set(id, activity);
    return activity;
  }

  // Document operations
  async getDocumentsByUserId(userId: number): Promise<Document[]> {
    const userDocuments: Document[] = [];
    const documentsArray = Array.from(this.documents.values());
    for (const document of documentsArray) {
      if (document.userId === userId) {
        userDocuments.push(document);
      }
    }
    return userDocuments;
  }

  async createDocument(documentData: Omit<Document, 'id'>): Promise<Document> {
    const id = this.documentIdCounter++;
    const document: Document = { ...documentData, id };
    this.documents.set(id, document);
    return document;
  }

  // Content operations
  async getContents(): Promise<Content[]> {
    return Array.from(this.contents.values());
  }

  async createContent(contentData: Omit<Content, 'id'>): Promise<Content> {
    const id = this.contentIdCounter++;
    const content: Content = { ...contentData, id };
    this.contents.set(id, content);
    return content;
  }
  
  // Train route operations
  async getTrainRoutes(): Promise<TrainRoute[]> {
    return Array.from(this.trainRoutes.values());
  }
  
  async getTrainRoute(id: number): Promise<TrainRoute | undefined> {
    return this.trainRoutes.get(id);
  }
  
  async createTrainRoute(routeData: Omit<InsertTrainRoute, 'id'>): Promise<TrainRoute> {
    const id = this.trainRouteIdCounter++;
    const currentTime = new Date().toISOString();
    
    const trainRoute: TrainRoute = {
      ...routeData,
      id,
      createdAt: currentTime,
      updatedAt: currentTime,
      isActive: routeData.isActive !== undefined ? routeData.isActive : true,
      status: routeData.status || "on-time"
    } as TrainRoute;
    
    this.trainRoutes.set(id, trainRoute);
    return trainRoute;
  }
  
  async updateTrainRoute(id: number, routeData: Partial<Omit<TrainRoute, 'id'>>): Promise<TrainRoute | undefined> {
    const route = this.trainRoutes.get(id);
    
    if (!route) {
      return undefined;
    }
    
    const updatedRoute: TrainRoute = {
      ...route,
      ...routeData,
      updatedAt: new Date().toISOString()
    };
    
    this.trainRoutes.set(id, updatedRoute);
    return updatedRoute;
  }
  
  async deleteTrainRoute(id: number): Promise<boolean> {
    return this.trainRoutes.delete(id);
  }
  
  // Bus route operations
  async getBusRoutes(): Promise<BusRoute[]> {
    return Array.from(this.busRoutes.values());
  }
  
  async getBusRoute(id: number): Promise<BusRoute | undefined> {
    return this.busRoutes.get(id);
  }
  
  async createBusRoute(routeData: Omit<InsertBusRoute, 'id'>): Promise<BusRoute> {
    const id = this.busRouteIdCounter++;
    const currentTime = new Date().toISOString();
    
    const busRoute: BusRoute = {
      ...routeData,
      id,
      createdAt: currentTime,
      updatedAt: currentTime,
      isActive: routeData.isActive !== undefined ? routeData.isActive : true
    } as BusRoute;
    
    this.busRoutes.set(id, busRoute);
    return busRoute;
  }
  
  async updateBusRoute(id: number, routeData: Partial<Omit<BusRoute, 'id'>>): Promise<BusRoute | undefined> {
    const route = this.busRoutes.get(id);
    
    if (!route) {
      return undefined;
    }
    
    const updatedRoute: BusRoute = {
      ...route,
      ...routeData,
      updatedAt: new Date().toISOString()
    };
    
    this.busRoutes.set(id, updatedRoute);
    return updatedRoute;
  }
  
  async deleteBusRoute(id: number): Promise<boolean> {
    return this.busRoutes.delete(id);
  }
  
  // Crowd report operations
  async getCrowdReports(): Promise<CrowdReport[]> {
    return Array.from(this.crowdReports.values());
  }
  
  async getCrowdReportsByUserId(userId: number): Promise<CrowdReport[]> {
    const userReports: CrowdReport[] = [];
    const reportsArray = Array.from(this.crowdReports.values());
    
    for (const report of reportsArray) {
      if (report.userId === userId) {
        userReports.push(report);
      }
    }
    
    return userReports;
  }
  
  async getCrowdReportsByStation(stationName: string): Promise<CrowdReport[]> {
    const stationReports: CrowdReport[] = [];
    const reportsArray = Array.from(this.crowdReports.values());
    
    for (const report of reportsArray) {
      if (report.stationName === stationName) {
        stationReports.push(report);
      }
    }
    
    return stationReports;
  }
  
  async createCrowdReport(reportData: Omit<InsertCrowdReport, 'id'>): Promise<CrowdReport> {
    const id = this.crowdReportIdCounter++;
    
    const crowdReport: CrowdReport = {
      ...reportData,
      id,
      isApproved: false // Crowd reports need admin approval by default
    } as CrowdReport;
    
    this.crowdReports.set(id, crowdReport);
    return crowdReport;
  }
  
  async approveCrowdReport(id: number): Promise<CrowdReport | undefined> {
    const report = this.crowdReports.get(id);
    
    if (!report) {
      return undefined;
    }
    
    const approvedReport: CrowdReport = {
      ...report,
      isApproved: true
    };
    
    this.crowdReports.set(id, approvedReport);
    return approvedReport;
  }
  
  // Ad settings operations
  async getAdSettings(): Promise<AdSetting[]> {
    return Array.from(this.adSettings.values());
  }
  
  async getAdSetting(id: number): Promise<AdSetting | undefined> {
    return this.adSettings.get(id);
  }
  
  async createAdSetting(settingData: Omit<InsertAdSetting, 'id'>): Promise<AdSetting> {
    const id = this.adSettingIdCounter++;
    
    const adSetting: AdSetting = {
      ...settingData,
      id,
      lastUpdated: new Date().toISOString()
    } as AdSetting;
    
    this.adSettings.set(id, adSetting);
    return adSetting;
  }
  
  async updateAdSetting(id: number, settingData: Partial<Omit<AdSetting, 'id'>>): Promise<AdSetting | undefined> {
    const setting = this.adSettings.get(id);
    
    if (!setting) {
      return undefined;
    }
    
    const updatedSetting: AdSetting = {
      ...setting,
      ...settingData,
      lastUpdated: new Date().toISOString()
    };
    
    this.adSettings.set(id, updatedSetting);
    return updatedSetting;
  }
  
  // App settings operations
  async getAppSettingsByCategory(category: string): Promise<AppSetting[]> {
    const settingsArray = Array.from(this.appSettings.values());
    return settingsArray.filter(setting => setting.category === category);
  }
  
  async getAppSetting(category: string, key: string): Promise<AppSetting | undefined> {
    const settingsArray = Array.from(this.appSettings.values());
    return settingsArray.find(setting => setting.category === category && setting.key === key);
  }
  
  async upsertAppSetting(settingData: InsertAppSetting): Promise<AppSetting> {
    // Check if a setting with this category and key already exists
    const existingSetting = await this.getAppSetting(settingData.category, settingData.key);
    
    if (existingSetting) {
      // Update existing setting
      const updatedSetting: AppSetting = {
        ...existingSetting,
        value: settingData.value,
        updatedBy: settingData.updatedBy || null,
        updatedAt: new Date().toISOString()
      };
      
      this.appSettings.set(existingSetting.id, updatedSetting);
      return updatedSetting;
    } else {
      // Create new setting
      const id = this.appSettingIdCounter++;
      
      const appSetting: AppSetting = {
        id,
        category: settingData.category,
        key: settingData.key,
        value: settingData.value,
        updatedBy: settingData.updatedBy || null,
        updatedAt: new Date().toISOString()
      };
      
      this.appSettings.set(id, appSetting);
      return appSetting;
    }
  }
  
  async deleteAppSetting(id: number): Promise<boolean> {
    return this.appSettings.delete(id);
  }
}

// Use just the memory storage for simplicity
export const storage = new MemStorage();
