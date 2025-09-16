import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base jewelry designs table
export const jewelryDesigns = pgTable("jewelry_designs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'necklace', 'earrings', 'ring'
  description: text("description"),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  defaultParameters: jsonb("default_parameters").notNull(), // JSON object with parameter defaults
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Sacred geometry patterns
export const geometryPatterns = pgTable("geometry_patterns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'mandala', 'fibonacci', 'islamic', 'celtic', etc.
  mathFunction: text("math_function").notNull(), // Mathematical formula or algorithm identifier
  parameters: jsonb("parameters").notNull(), // Pattern-specific parameters
  complexity: decimal("complexity", { precision: 3, scale: 2 }).notNull(), // 0.0 to 1.0
});

// User jewelry customizations
export const jewelryCustomizations = pgTable("jewelry_customizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(), // For anonymous users
  designId: varchar("design_id").references(() => jewelryDesigns.id).notNull(),
  patternId: varchar("pattern_id").references(() => geometryPatterns.id),
  customParameters: jsonb("custom_parameters").notNull(), // User's parameter overrides
  customText: text("custom_text"),
  customImageUrl: text("custom_image_url"),
  material: text("material").default('gold'),
  fingerSize: decimal("finger_size", { precision: 3, scale: 1 }), // For rings only
  finalPrice: decimal("final_price", { precision: 10, scale: 2 }).notNull(),
  stlGenerated: boolean("stl_generated").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders for purchased jewelry
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customizationId: varchar("customization_id").references(() => jewelryCustomizations.id).notNull(),
  stripePaymentId: text("stripe_payment_id"),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name"),
  shippingAddress: jsonb("shipping_address"),
  status: text("status").default('pending'), // 'pending', 'paid', 'printing', 'shipped', 'delivered'
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Create insert schemas
export const insertJewelryDesignSchema = createInsertSchema(jewelryDesigns).omit({
  id: true,
  createdAt: true,
});

export const insertGeometryPatternSchema = createInsertSchema(geometryPatterns).omit({
  id: true,
});

export const insertJewelryCustomizationSchema = createInsertSchema(jewelryCustomizations).omit({
  id: true,
  createdAt: true,
  stlGenerated: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

// Parameter validation schemas
export const customizationParametersSchema = z.object({
  size: z.number().min(0.5).max(2.0).default(1.0),
  thickness: z.number().min(0.1).max(0.5).default(0.2),
  complexity: z.number().min(0.1).max(1.0).default(0.7),
  spiralTurns: z.number().int().min(1).max(8).default(3),
  symmetry: z.number().int().min(3).max(12).default(8),
  fingerSize: z.number().min(4).max(12).optional(), // For rings only
});

export const shippingAddressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
  country: z.string().min(1),
});

// Type exports
export type JewelryDesign = typeof jewelryDesigns.$inferSelect;
export type InsertJewelryDesign = z.infer<typeof insertJewelryDesignSchema>;

export type GeometryPattern = typeof geometryPatterns.$inferSelect;
export type InsertGeometryPattern = z.infer<typeof insertGeometryPatternSchema>;

export type JewelryCustomization = typeof jewelryCustomizations.$inferSelect;
export type InsertJewelryCustomization = z.infer<typeof insertJewelryCustomizationSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type CustomizationParameters = z.infer<typeof customizationParametersSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

// Remove the old user-related schemas since we're focusing on jewelry
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;