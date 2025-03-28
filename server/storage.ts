import { users, activities, documents, contents } from "@shared/schema";
import type { User, InsertUser, Activity, Document, Content } from "@shared/schema";
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
  
  // Session store
  sessionStore: any;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private activities: Map<number, Activity>;
  private documents: Map<number, Document>;
  private contents: Map<number, Content>;
  private userIdCounter: number;
  private activityIdCounter: number;
  private documentIdCounter: number;
  private contentIdCounter: number;
  sessionStore: any;

  constructor() {
    this.users = new Map();
    this.activities = new Map();
    this.documents = new Map();
    this.contents = new Map();
    
    this.userIdCounter = 1;
    this.activityIdCounter = 1;
    this.documentIdCounter = 1;
    this.contentIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Initialize with some seed data for admin
    this.users.set(1, {
      id: 1,
      username: "admin",
      password: "7f3f37fa7fb8ce4df11a0ad85b5ec7edf9e08fba4b8bea97bf3ca967b097b3c5c2e02f46f6f7c14cd3f16783ffc6b3a92aa1eebc15ed3eb6e4b8cdb6091a51db.55c1956e7b29b04b", // 'admin123' hashed
      fullName: "Admin User",
      role: "admin"
    });
    this.userIdCounter = 2;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...userData, id };
    this.users.set(id, user);
    return user;
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getActivitiesByUserId(userId: number): Promise<Activity[]> {
    const userActivities: Activity[] = [];
    for (const activity of this.activities.values()) {
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

  async getDocumentsByUserId(userId: number): Promise<Document[]> {
    const userDocuments: Document[] = [];
    for (const document of this.documents.values()) {
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

  async getContents(): Promise<Content[]> {
    return Array.from(this.contents.values());
  }

  async createContent(contentData: Omit<Content, 'id'>): Promise<Content> {
    const id = this.contentIdCounter++;
    const content: Content = { ...contentData, id };
    this.contents.set(id, content);
    return content;
  }
}

// Use just the memory storage for simplicity
export const storage = new MemStorage();
