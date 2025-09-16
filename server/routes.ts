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

      // TODO: Implement actual 3D model generation with sacred geometry algorithms
      // For now, simulate the process
      console.log("Generating 3D model for customization:", id);
      console.log("Parameters:", customization.customParameters);
      
      // Mark as generated
      await storage.updateCustomizationSTL(id, true);
      
      res.json({ 
        success: true, 
        message: "3D model generated successfully",
        downloadUrl: `/api/jewelry/download-stl/${id}`
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

      // TODO: Generate and return actual STL file
      // For now, return a placeholder response
      const stlContent = generateMockSTL(customization);
      
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="jewelry-${id}.stl"`);
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

// Helper function to generate mock STL content
function generateMockSTL(customization: any): string {
  const params = customization.customParameters;
  
  // Simple STL header and basic triangle data
  return `solid Sacred_Geometry_Jewelry
facet normal 0.0 0.0 1.0
  outer loop
    vertex 0.0 0.0 0.0
    vertex ${params.size || 1.0} 0.0 0.0
    vertex 0.5 ${(params.size || 1.0) * 0.866} 0.0
  endloop
endfacet
facet normal 0.0 0.0 -1.0
  outer loop
    vertex 0.0 0.0 ${params.thickness || 0.2}
    vertex 0.5 ${(params.size || 1.0) * 0.866} ${params.thickness || 0.2}
    vertex ${params.size || 1.0} 0.0 ${params.thickness || 0.2}
  endloop
endfacet
endsolid Sacred_Geometry_Jewelry`;
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