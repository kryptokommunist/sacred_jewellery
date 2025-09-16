// API client for jewelry customization
import { z } from 'zod';

// Base API configuration
const API_BASE = '/api';

// API response types
export interface JewelryDesign {
  id: string;
  name: string;
  type: 'necklace' | 'earrings' | 'ring';
  description: string | null;
  basePrice: string;
  defaultParameters: any;
  imageUrl: string | null;
  featured: boolean | null;
  createdAt: Date | null;
}

export interface GeometryPattern {
  id: string;
  name: string;
  type: string;
  mathFunction: string;
  parameters: any;
  complexity: string;
}

export interface JewelryCustomization {
  id: string;
  sessionId: string;
  designId: string;
  patternId: string | null;
  customParameters: any;
  customText: string | null;
  customImageUrl: string | null;
  material: string | null;
  fingerSize: string | null;
  finalPrice: string;
  stlGenerated: boolean | null;
  createdAt: Date | null;
}

export interface Order {
  id: string;
  customizationId: string;
  stripePaymentId: string | null;
  customerEmail: string;
  customerName: string | null;
  shippingAddress: any;
  status: string | null;
  totalAmount: string;
  createdAt: Date | null;
}

// API client class
export class JewelryAPI {
  private sessionId: string;

  constructor() {
    // Generate or retrieve session ID for anonymous users
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('jewelry_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('jewelry_session_id', sessionId);
    }
    return sessionId;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Jewelry Designs API
  async getAllDesigns(): Promise<JewelryDesign[]> {
    return this.request('/jewelry/designs');
  }

  async getDesignsByType(type: string): Promise<JewelryDesign[]> {
    return this.request(`/jewelry/designs/${type}`);
  }

  async getDesign(id: string): Promise<JewelryDesign> {
    return this.request(`/jewelry/design/${id}`);
  }

  // Geometry Patterns API
  async getAllPatterns(): Promise<GeometryPattern[]> {
    return this.request('/geometry/patterns');
  }

  async getPatternsByType(type: string): Promise<GeometryPattern[]> {
    return this.request(`/geometry/patterns/${type}`);
  }

  // Customization API
  async createCustomization(data: {
    designId: string;
    patternId?: string;
    customParameters: any;
    customText?: string;
    customImageUrl?: string;
    material?: string;
    fingerSize?: number;
    finalPrice: number;
  }): Promise<JewelryCustomization> {
    return this.request('/jewelry/customize', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        sessionId: this.sessionId,
      }),
    });
  }

  async getCustomization(id: string): Promise<JewelryCustomization> {
    return this.request(`/jewelry/customization/${id}`);
  }

  async getSessionCustomizations(): Promise<JewelryCustomization[]> {
    return this.request(`/jewelry/customizations/session/${this.sessionId}`);
  }

  // 3D Generation API
  async generate3D(customizationId: string): Promise<{
    success: boolean;
    message: string;
    downloadUrl: string;
    geometry: {
      vertexCount: number;
      faceCount: number;
      boundingBox: any;
    };
  }> {
    return this.request(`/jewelry/generate-3d/${customizationId}`, {
      method: 'POST',
    });
  }

  async downloadSTL(customizationId: string): Promise<Blob> {
    const response = await fetch(`${API_BASE}/jewelry/download-stl/${customizationId}`);
    if (!response.ok) {
      throw new Error('Failed to download STL file');
    }
    return response.blob();
  }

  // Parameter validation
  async validateParameters(parameters: any): Promise<{
    valid: boolean;
    parameters?: any;
    priceMultiplier?: number;
    errors?: Array<{ field: string; message: string }>;
  }> {
    return this.request('/jewelry/validate-parameters', {
      method: 'POST',
      body: JSON.stringify(parameters),
    });
  }

  // Orders API
  async createOrder(data: {
    customizationId: string;
    customerEmail: string;
    customerName?: string;
    shippingAddress?: any;
    totalAmount: number;
  }): Promise<Order> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOrder(id: string): Promise<Order> {
    return this.request(`/orders/${id}`);
  }

  // Utility methods
  getSessionId(): string {
    return this.sessionId;
  }

  clearSession(): void {
    localStorage.removeItem('jewelry_session_id');
    this.sessionId = this.getOrCreateSessionId();
  }
}

// Create singleton instance
export const jewelryAPI = new JewelryAPI();

// Custom hooks for React Query
export const jewelryQueries = {
  // Designs
  allDesigns: () => ({
    queryKey: ['/api/jewelry/designs'],
    queryFn: () => jewelryAPI.getAllDesigns(),
  }),

  designsByType: (type: string) => ({
    queryKey: ['/api/jewelry/designs', type],
    queryFn: () => jewelryAPI.getDesignsByType(type),
  }),

  design: (id: string) => ({
    queryKey: ['/api/jewelry/design', id],
    queryFn: () => jewelryAPI.getDesign(id),
    enabled: !!id,
  }),

  // Patterns
  allPatterns: () => ({
    queryKey: ['/api/geometry/patterns'],
    queryFn: () => jewelryAPI.getAllPatterns(),
  }),

  patternsByType: (type: string) => ({
    queryKey: ['/api/geometry/patterns', type],
    queryFn: () => jewelryAPI.getPatternsByType(type),
  }),

  // Customizations
  customization: (id: string) => ({
    queryKey: ['/api/jewelry/customization', id],
    queryFn: () => jewelryAPI.getCustomization(id),
    enabled: !!id,
  }),

  sessionCustomizations: () => ({
    queryKey: ['/api/jewelry/customizations/session', jewelryAPI.getSessionId()],
    queryFn: () => jewelryAPI.getSessionCustomizations(),
  }),

  // Orders
  order: (id: string) => ({
    queryKey: ['/api/orders', id],
    queryFn: () => jewelryAPI.getOrder(id),
    enabled: !!id,
  }),
};