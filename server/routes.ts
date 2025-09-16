import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertJewelryCustomizationSchema,
  insertOrderSchema,
  customizationParametersSchema,
  shippingAddressSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Jewelry Designs API
  app.get("/api/jewelry/designs", async (req, res) => {
    try {
      const designs = await storage.getAllJewelryDesigns();
      res.json(designs);
    } catch (error) {
      console.error("Error fetching jewelry designs:", error);
      res.status(500).json({ error: "Failed to fetch designs" });
    }
  });

  app.get("/api/jewelry/designs/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const designs = await storage.getJewelryDesignsByType(type);
      res.json(designs);
    } catch (error) {
      console.error("Error fetching jewelry designs by type:", error);
      res.status(500).json({ error: "Failed to fetch designs" });
    }
  });

  app.get("/api/jewelry/design/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const design = await storage.getJewelryDesign(id);
      if (!design) {
        return res.status(404).json({ error: "Design not found" });
      }
      res.json(design);
    } catch (error) {
      console.error("Error fetching jewelry design:", error);
      res.status(500).json({ error: "Failed to fetch design" });
    }
  });

  // Sacred Geometry Patterns API
  app.get("/api/geometry/patterns", async (req, res) => {
    try {
      const patterns = await storage.getAllGeometryPatterns();
      res.json(patterns);
    } catch (error) {
      console.error("Error fetching geometry patterns:", error);
      res.status(500).json({ error: "Failed to fetch patterns" });
    }
  });

  app.get("/api/geometry/patterns/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const patterns = await storage.getGeometryPatternsByType(type);
      res.json(patterns);
    } catch (error) {
      console.error("Error fetching geometry patterns by type:", error);
      res.status(500).json({ error: "Failed to fetch patterns" });
    }
  });

  // Jewelry Customization API
  app.post("/api/jewelry/customize", async (req, res) => {
    try {
      const validatedData = insertJewelryCustomizationSchema.parse(req.body);
      
      // Validate parameters against schema
      customizationParametersSchema.parse(validatedData.customParameters);
      
      const customization = await storage.createCustomization(validatedData);
      res.json(customization);
    } catch (error) {
      console.error("Error creating customization:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid customization data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create customization" });
    }
  });

  app.get("/api/jewelry/customization/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const customization = await storage.getCustomization(id);
      if (!customization) {
        return res.status(404).json({ error: "Customization not found" });
      }
      res.json(customization);
    } catch (error) {
      console.error("Error fetching customization:", error);
      res.status(500).json({ error: "Failed to fetch customization" });
    }
  });

  app.get("/api/jewelry/customizations/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const customizations = await storage.getCustomizationsBySession(sessionId);
      res.json(customizations);
    } catch (error) {
      console.error("Error fetching customizations by session:", error);
      res.status(500).json({ error: "Failed to fetch customizations" });
    }
  });

  // 3D Model Generation and STL Download
  app.post("/api/jewelry/generate-3d/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const customization = await storage.getCustomization(id);
      
      if (!customization) {
        return res.status(404).json({ error: "Customization not found" });
      }

      // Get the jewelry design
      const design = await storage.getJewelryDesign(customization.designId);
      if (!design) {
        return res.status(404).json({ error: "Design not found" });
      }

      // Import jewelry generation functions
      const { generateJewelry } = await import("./geometry/jewelry-generator");
      
      // Get pattern type from customization or design
      const patternType = customization.patternId ? 
        (await storage.getGeometryPattern(customization.patternId))?.type || 'mandala' : 
        'mandala';
      
      // Generate 3D jewelry geometry
      const jewelryGeometry = generateJewelry(
        design.type as 'necklace' | 'earrings' | 'ring',
        patternType,
        customization.customParameters as any,
        {
          fingerSize: customization.fingerSize ? parseFloat(customization.fingerSize) : undefined
        }
      );
      
      console.log("Generated 3D geometry for customization:", id);
      console.log("Vertices:", jewelryGeometry.pattern.vertices.length);
      console.log("Faces:", jewelryGeometry.pattern.faces.length);
      
      // Mark as generated
      await storage.updateCustomizationSTL(id, true);
      
      res.json({ 
        success: true, 
        message: "3D model generated successfully",
        downloadUrl: `/api/jewelry/download-stl/${id}`,
        geometry: {
          vertexCount: jewelryGeometry.pattern.vertices.length,
          faceCount: jewelryGeometry.pattern.faces.length,
          boundingBox: jewelryGeometry.boundingBox
        }
      });
    } catch (error) {
      console.error("Error generating 3D model:", error);
      res.status(500).json({ error: "Failed to generate 3D model" });
    }
  });

  app.get("/api/jewelry/download-stl/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const customization = await storage.getCustomization(id);
      
      if (!customization) {
        return res.status(404).json({ error: "Customization not found" });
      }

      if (!customization.stlGenerated) {
        return res.status(400).json({ error: "STL file not generated yet" });
      }

      // Get the jewelry design
      const design = await storage.getJewelryDesign(customization.designId);
      if (!design) {
        return res.status(404).json({ error: "Design not found" });
      }

      // Import jewelry generation functions
      const { generateJewelry } = await import("./geometry/jewelry-generator");
      
      // Get pattern type
      const patternType = customization.patternId ? 
        (await storage.getGeometryPattern(customization.patternId))?.type || 'mandala' : 
        'mandala';
      
      // Regenerate 3D jewelry geometry for STL export
      const jewelryGeometry = generateJewelry(
        design.type as 'necklace' | 'earrings' | 'ring',
        patternType,
        customization.customParameters as any,
        {
          fingerSize: customization.fingerSize ? parseFloat(customization.fingerSize) : undefined
        }
      );
      
      // Generate STL content
      const stlContent = generateSTLFromGeometry(jewelryGeometry.pattern);
      
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="sacred-geometry-jewelry-${id}.stl"`);
      res.send(stlContent);
    } catch (error) {
      console.error("Error downloading STL:", error);
      res.status(500).json({ error: "Failed to download STL" });
    }
  });

  // Orders and Payment API
  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      
      // Validate shipping address if provided
      if (validatedData.shippingAddress) {
        shippingAddressSchema.parse(validatedData.shippingAddress);
      }
      
      const order = await storage.createOrder(validatedData);
      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid order data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  // Stripe webhook for payment processing
  app.post("/api/stripe/webhook", async (req, res) => {
    try {
      // TODO: Implement Stripe webhook validation and processing
      const { orderId, paymentIntentId } = req.body;
      
      if (orderId && paymentIntentId) {
        await storage.updateOrderPayment(orderId, paymentIntentId);
        await storage.updateOrderStatus(orderId, 'paid');
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error processing Stripe webhook:", error);
      res.status(500).json({ error: "Failed to process payment" });
    }
  });

  // Parameter validation endpoint for real-time feedback
  app.post("/api/jewelry/validate-parameters", async (req, res) => {
    try {
      const validatedParams = customizationParametersSchema.parse(req.body);
      
      // Calculate price adjustments based on parameters
      const priceMultiplier = calculatePriceMultiplier(validatedParams);
      
      res.json({ 
        valid: true, 
        parameters: validatedParams,
        priceMultiplier 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          valid: false, 
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      res.status(500).json({ error: "Failed to validate parameters" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to generate STL content from geometry
function generateSTLFromGeometry(pattern: { vertices: any[]; faces: number[][] }): string {
  let stl = "solid Sacred_Geometry_Jewelry\n";
  
  // Generate each triangle face
  pattern.faces.forEach(face => {
    if (face.length >= 3) {
      const v1 = pattern.vertices[face[0]];
      const v2 = pattern.vertices[face[1]];
      const v3 = pattern.vertices[face[2]];
      
      if (v1 && v2 && v3) {
        // Calculate normal vector (simplified - assuming counter-clockwise winding)
        const normal = calculateNormal(v1, v2, v3);
        
        stl += `facet normal ${normal.x.toFixed(6)} ${normal.y.toFixed(6)} ${normal.z.toFixed(6)}\n`;
        stl += "  outer loop\n";
        stl += `    vertex ${v1.x.toFixed(6)} ${v1.y.toFixed(6)} ${v1.z.toFixed(6)}\n`;
        stl += `    vertex ${v2.x.toFixed(6)} ${v2.y.toFixed(6)} ${v2.z.toFixed(6)}\n`;
        stl += `    vertex ${v3.x.toFixed(6)} ${v3.y.toFixed(6)} ${v3.z.toFixed(6)}\n`;
        stl += "  endloop\n";
        stl += "endfacet\n";
      }
    }
  });
  
  stl += "endsolid Sacred_Geometry_Jewelry\n";
  return stl;
}

// Calculate normal vector for a triangle
function calculateNormal(v1: any, v2: any, v3: any): { x: number; y: number; z: number } {
  // Vectors from v1 to v2 and v1 to v3
  const u = { x: v2.x - v1.x, y: v2.y - v1.y, z: v2.z - v1.z };
  const v = { x: v3.x - v1.x, y: v3.y - v1.y, z: v3.z - v1.z };
  
  // Cross product u × v
  const normal = {
    x: u.y * v.z - u.z * v.y,
    y: u.z * v.x - u.x * v.z,
    z: u.x * v.y - u.y * v.x
  };
  
  // Normalize
  const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);
  if (length > 0) {
    normal.x /= length;
    normal.y /= length;
    normal.z /= length;
  }
  
  return normal;
}

// Helper function to calculate price multiplier based on parameters
function calculatePriceMultiplier(params: any): number {
  let multiplier = 1.0;
  
  // Size affects material usage
  multiplier *= Math.pow(params.size || 1.0, 1.5);
  
  // Thickness affects material usage
  multiplier *= (params.thickness || 0.2) / 0.2;
  
  // Complexity affects printing time
  multiplier *= 1 + ((params.complexity || 0.7) - 0.5) * 0.3;
  
  // Symmetry affects complexity
  multiplier *= 1 + ((params.symmetry || 8) - 6) * 0.02;
  
  return Math.round(multiplier * 100) / 100;
}