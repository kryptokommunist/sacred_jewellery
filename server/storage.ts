import { 
  type User, 
  type InsertUser,
  type JewelryDesign,
  type InsertJewelryDesign,
  type GeometryPattern,
  type InsertGeometryPattern,
  type JewelryCustomization,
  type InsertJewelryCustomization,
  type Order,
  type InsertOrder,
  type CustomizationParameters
} from "@shared/schema";
import { randomUUID } from "crypto";

// Extended storage interface for jewelry functionality
export interface IStorage {
  // User methods (existing)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Jewelry design methods
  getAllJewelryDesigns(): Promise<JewelryDesign[]>;
  getJewelryDesignsByType(type: string): Promise<JewelryDesign[]>;
  getJewelryDesign(id: string): Promise<JewelryDesign | undefined>;
  createJewelryDesign(design: InsertJewelryDesign): Promise<JewelryDesign>;
  
  // Geometry pattern methods
  getAllGeometryPatterns(): Promise<GeometryPattern[]>;
  getGeometryPatternsByType(type: string): Promise<GeometryPattern[]>;
  getGeometryPattern(id: string): Promise<GeometryPattern | undefined>;
  createGeometryPattern(pattern: InsertGeometryPattern): Promise<GeometryPattern>;
  
  // Customization methods
  createCustomization(customization: InsertJewelryCustomization): Promise<JewelryCustomization>;
  getCustomization(id: string): Promise<JewelryCustomization | undefined>;
  getCustomizationsBySession(sessionId: string): Promise<JewelryCustomization[]>;
  updateCustomizationSTL(id: string, generated: boolean): Promise<void>;
  
  // Order methods
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  updateOrderStatus(id: string, status: string): Promise<void>;
  updateOrderPayment(id: string, stripePaymentId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private jewelryDesigns: Map<string, JewelryDesign>;
  private geometryPatterns: Map<string, GeometryPattern>;
  private jewelryCustomizations: Map<string, JewelryCustomization>;
  private orders: Map<string, Order>;

  constructor() {
    this.users = new Map();
    this.jewelryDesigns = new Map();
    this.geometryPatterns = new Map();
    this.jewelryCustomizations = new Map();
    this.orders = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // User methods (existing)
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Jewelry design methods
  async getAllJewelryDesigns(): Promise<JewelryDesign[]> {
    return Array.from(this.jewelryDesigns.values());
  }

  async getJewelryDesignsByType(type: string): Promise<JewelryDesign[]> {
    return Array.from(this.jewelryDesigns.values()).filter(design => design.type === type);
  }

  async getJewelryDesign(id: string): Promise<JewelryDesign | undefined> {
    return this.jewelryDesigns.get(id);
  }

  async createJewelryDesign(insertDesign: InsertJewelryDesign): Promise<JewelryDesign> {
    const id = randomUUID();
    const design: JewelryDesign = { 
      ...insertDesign,
      description: insertDesign.description || null,
      imageUrl: insertDesign.imageUrl || null,
      featured: insertDesign.featured || null,
      id,
      createdAt: new Date()
    };
    this.jewelryDesigns.set(id, design);
    return design;
  }

  // Geometry pattern methods
  async getAllGeometryPatterns(): Promise<GeometryPattern[]> {
    return Array.from(this.geometryPatterns.values());
  }

  async getGeometryPatternsByType(type: string): Promise<GeometryPattern[]> {
    return Array.from(this.geometryPatterns.values()).filter(pattern => pattern.type === type);
  }

  async getGeometryPattern(id: string): Promise<GeometryPattern | undefined> {
    return this.geometryPatterns.get(id);
  }

  async createGeometryPattern(insertPattern: InsertGeometryPattern): Promise<GeometryPattern> {
    const id = randomUUID();
    const pattern: GeometryPattern = { ...insertPattern, id };
    this.geometryPatterns.set(id, pattern);
    return pattern;
  }

  // Customization methods
  async createCustomization(insertCustomization: InsertJewelryCustomization): Promise<JewelryCustomization> {
    const id = randomUUID();
    const customization: JewelryCustomization = {
      ...insertCustomization,
      patternId: insertCustomization.patternId || null,
      customText: insertCustomization.customText || null,
      customImageUrl: insertCustomization.customImageUrl || null,
      material: insertCustomization.material || null,
      fingerSize: insertCustomization.fingerSize || null,
      id,
      stlGenerated: false,
      createdAt: new Date()
    };
    this.jewelryCustomizations.set(id, customization);
    return customization;
  }

  async getCustomization(id: string): Promise<JewelryCustomization | undefined> {
    return this.jewelryCustomizations.get(id);
  }

  async getCustomizationsBySession(sessionId: string): Promise<JewelryCustomization[]> {
    return Array.from(this.jewelryCustomizations.values()).filter(
      customization => customization.sessionId === sessionId
    );
  }

  async updateCustomizationSTL(id: string, generated: boolean): Promise<void> {
    const customization = this.jewelryCustomizations.get(id);
    if (customization) {
      customization.stlGenerated = generated;
      this.jewelryCustomizations.set(id, customization);
    }
  }

  // Order methods
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      status: insertOrder.status || null,
      stripePaymentId: insertOrder.stripePaymentId || null,
      customerName: insertOrder.customerName || null,
      shippingAddress: insertOrder.shippingAddress || null,
      id,
      createdAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async updateOrderStatus(id: string, status: string): Promise<void> {
    const order = this.orders.get(id);
    if (order) {
      order.status = status;
      this.orders.set(id, order);
    }
  }

  async updateOrderPayment(id: string, stripePaymentId: string): Promise<void> {
    const order = this.orders.get(id);
    if (order) {
      order.stripePaymentId = stripePaymentId;
      this.orders.set(id, order);
    }
  }

  // Initialize sample data
  private initializeSampleData(): void {
    // Sample sacred geometry patterns
    const patterns: InsertGeometryPattern[] = [
      {
        name: "Mandala",
        type: "mandala",
        mathFunction: "mandalaCircles",
        parameters: { layers: 3, petals: 8, rotation: 45 },
        complexity: "0.7"
      },
      {
        name: "Fibonacci Spiral",
        type: "fibonacci",
        mathFunction: "fibonacciSpiral",
        parameters: { turns: 3, ratio: 1.618 },
        complexity: "0.6"
      },
      {
        name: "Flower of Life",
        type: "sacred",
        mathFunction: "flowerOfLife",
        parameters: { circles: 19, overlap: 0.5 },
        complexity: "0.8"
      },
      {
        name: "Islamic Star",
        type: "islamic",
        mathFunction: "islamicStar",
        parameters: { points: 8, angles: [45, 67.5] },
        complexity: "0.75"
      },
      {
        name: "Celtic Knot",
        type: "celtic",
        mathFunction: "celticKnot",
        parameters: { loops: 4, thickness: 0.1 },
        complexity: "0.65"
      }
    ];

    patterns.forEach(async (pattern) => {
      await this.createGeometryPattern(pattern);
    });

    // Sample jewelry designs
    const designs: InsertJewelryDesign[] = [
      {
        name: "Mandala Harmony Necklace",
        type: "necklace",
        description: "Buddhist-inspired mandala pattern with golden ratio proportions",
        basePrice: "89.00",
        defaultParameters: {
          size: 1.0,
          thickness: 0.2,
          complexity: 0.7,
          symmetry: 8,
          chainLength: 18
        },
        imageUrl: "/api/designs/mandala-necklace.jpg",
        featured: true
      },
      {
        name: "Fibonacci Spiral Necklace",
        type: "necklace", 
        description: "Elegant spiral design following the divine golden sequence",
        basePrice: "95.00",
        defaultParameters: {
          size: 1.1,
          thickness: 0.25,
          complexity: 0.6,
          spiralTurns: 3,
          chainLength: 20
        },
        imageUrl: "/api/designs/fibonacci-necklace.jpg"
      },
      {
        name: "Sacred Lotus Earrings",
        type: "earrings",
        description: "Lotus pattern with sacred geometry elements and meditation symbols",
        basePrice: "45.00",
        defaultParameters: {
          size: 0.8,
          thickness: 0.15,
          complexity: 0.65,
          symmetry: 6,
          hookType: "standard"
        },
        imageUrl: "/api/designs/lotus-earrings.jpg"
      },
      {
        name: "Merkaba Ring",
        type: "ring",
        description: "Sacred 3D star tetrahedron geometry for spiritual protection",
        basePrice: "72.00",
        defaultParameters: {
          size: 0.9,
          thickness: 0.3,
          complexity: 0.8,
          fingerSize: 7,
          bandWidth: 6
        },
        imageUrl: "/api/designs/merkaba-ring.jpg"
      }
    ];

    designs.forEach(async (design) => {
      await this.createJewelryDesign(design);
    });
  }
}

export const storage = new MemStorage();