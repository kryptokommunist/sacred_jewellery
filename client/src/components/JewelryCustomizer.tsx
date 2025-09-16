import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, ShoppingCart, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { jewelryAPI, jewelryQueries } from "@/lib/api";
import ThreeJS3DViewer from "./ThreeJS3DViewer";
import customizationInterface from "@assets/generated_images/3D_jewelry_customization_interface_446cd61a.png";

export default function JewelryCustomizer() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedJewelry, setSelectedJewelry] = useState("");
  const [parameters, setParameters] = useState({
    size: [1.0],
    thickness: [0.2],
    complexity: [0.7],
    spiralTurns: [3],
    symmetry: [8],
    fingerSize: [7] // for rings only
  });
  const [customText, setCustomText] = useState("");
  const [selectedPattern, setSelectedPattern] = useState("mandala");
  const [material, setMaterial] = useState("gold");
  const [currentGeometry, setCurrentGeometry] = useState<any>(null);
  const [currentCustomizationId, setCurrentCustomizationId] = useState<string | null>(null);

  // Fetch jewelry designs
  const { data: allDesigns = [] } = useQuery(jewelryQueries.allDesigns());
  
  // Fetch geometry patterns
  const { data: allPatterns = [] } = useQuery(jewelryQueries.allPatterns());

  // Get current design
  const currentDesign = allDesigns.find(d => d.id === selectedJewelry);

  // Set default selection when designs load
  useEffect(() => {
    if (allDesigns.length > 0 && !selectedJewelry) {
      setSelectedJewelry(allDesigns[0].id);
    }
  }, [allDesigns, selectedJewelry]);

  // Create customization mutation
  const createCustomizationMutation = useMutation({
    mutationFn: (data: any) => jewelryAPI.createCustomization(data),
    onSuccess: (customization) => {
      setCurrentCustomizationId(customization.id);
      queryClient.invalidateQueries({ queryKey: ['/api/jewelry/customizations'] });
      toast({
        title: "Customization Created",
        description: "Your jewelry design has been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create customization",
        variant: "destructive",
      });
    },
  });

  // Generate 3D model mutation
  const generate3DMutation = useMutation({
    mutationFn: (id: string) => jewelryAPI.generate3D(id),
    onSuccess: (result) => {
      setCurrentGeometry(result.geometry);
      toast({
        title: "3D Model Generated",
        description: "Your jewelry model is ready for download!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate 3D model",
        variant: "destructive",
      });
    },
  });

  // Parameter validation mutation
  const validateParametersMutation = useMutation({
    mutationFn: (params: any) => jewelryAPI.validateParameters(params),
    onError: (error: any) => {
      toast({
        title: "Invalid Parameters",
        description: error.message || "Some parameters are out of range",
        variant: "destructive",
      });
    },
  });

  const handleParameterChange = (param: string, value: number[]) => {
    const newParameters = { ...parameters, [param]: value };
    setParameters(newParameters);
    
    // Validate parameters in real-time
    const flatParams = Object.entries(newParameters).reduce((acc, [key, val]) => {
      acc[key] = Array.isArray(val) ? val[0] : val;
      return acc;
    }, {} as any);
    
    validateParametersMutation.mutate(flatParams);
    console.log(`Parameter ${param} changed to:`, value[0]);
  };

  const handleDownloadSTL = async () => {
    if (!currentCustomizationId) {
      toast({
        title: "No Customization",
        description: "Please save your design first",
        variant: "destructive",
      });
      return;
    }

    try {
      const blob = await jewelryAPI.downloadSTL(currentCustomizationId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sacred-geometry-jewelry-${currentCustomizationId}.stl`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "STL Downloaded",
        description: "Your 3D print file has been downloaded successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download STL file",
        variant: "destructive",
      });
    }
  };

  const handleSaveCustomization = async () => {
    if (!currentDesign) return;

    const flatParams = Object.entries(parameters).reduce((acc, [key, val]) => {
      acc[key] = Array.isArray(val) ? val[0] : val;
      return acc;
    }, {} as any);

    const basePrice = parseFloat(currentDesign.basePrice);
    const priceMultiplier = validateParametersMutation.data?.priceMultiplier || 1;
    const finalPrice = basePrice * priceMultiplier;

    const customizationData = {
      designId: selectedJewelry,
      patternId: allPatterns.find(p => p.type === selectedPattern)?.id,
      customParameters: flatParams,
      customText: customText || undefined,
      material,
      fingerSize: flatParams.fingerSize,
      finalPrice,
    };

    createCustomizationMutation.mutate(customizationData);
  };

  const handleGenerate3D = () => {
    if (currentCustomizationId) {
      generate3DMutation.mutate(currentCustomizationId);
    } else {
      toast({
        title: "Save First",
        description: "Please save your customization before generating 3D model",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = () => {
    handleSaveCustomization();
  };

  const handleRotate = () => {
    console.log('Rotating 3D model');
  };

  const handleZoomIn = () => {
    console.log('Zooming in on 3D model');
  };

  const handleZoomOut = () => {
    console.log('Zooming out on 3D model');
  };

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto" id="customizer">
      <div className="text-center mb-12">
        <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
          3D Jewelry Designer
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Customize every aspect of your jewelry using our parametric design tools. 
          Watch your changes in real-time and download print-ready STL files.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3D Viewer */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl" data-testid="text-3d-viewer-title">3D Preview</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleRotate} data-testid="button-rotate">
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleZoomIn} data-testid="button-zoom-in">
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleZoomOut} data-testid="button-zoom-out">
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg overflow-hidden relative">
                <ThreeJS3DViewer
                  jewelryType={currentDesign?.type || 'necklace'}
                  patternType={selectedPattern}
                  parameters={Object.entries(parameters).reduce((acc, [key, val]) => {
                    acc[key] = Array.isArray(val) ? val[0] : val;
                    return acc;
                  }, {} as any)}
                  onGeometryUpdate={setCurrentGeometry}
                />
                <div className="absolute bottom-4 left-4">
                  <Badge variant="secondary" data-testid="badge-render-quality">
                    {currentGeometry ? 
                      `${currentGeometry.vertexCount} vertices` : 
                      'Real-time Preview'
                    }
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <Button 
                  className="flex-1" 
                  onClick={handleAddToCart}
                  disabled={createCustomizationMutation.isPending}
                  data-testid="button-add-to-cart"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {createCustomizationMutation.isPending ? 'Saving...' : 
                    `Add to Cart - $${currentDesign ? 
                      (parseFloat(currentDesign.basePrice) * (validateParametersMutation.data?.priceMultiplier || 1)).toFixed(2) : 
                      '0.00'}`
                  }
                </Button>
                <div className="flex gap-2 flex-1">
                  <Button 
                    variant="outline" 
                    onClick={handleGenerate3D}
                    disabled={!currentCustomizationId || generate3DMutation.isPending}
                    data-testid="button-generate-3d"
                  >
                    {generate3DMutation.isPending ? 'Generating...' : 'Generate 3D'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleDownloadSTL}
                    disabled={!currentGeometry}
                    data-testid="button-download-stl"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    STL
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customization Panel */}
        <div className="space-y-6">
          {/* Base Design Selection */}
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-base-design-title">Base Design</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedJewelry} onValueChange={setSelectedJewelry}>
                <SelectTrigger data-testid="select-base-design">
                  <SelectValue placeholder="Choose base design" />
                </SelectTrigger>
                <SelectContent>
                  {allDesigns.map((design) => (
                    <SelectItem key={design.id} value={design.id}>
                      {design.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Parameters */}
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-parameters-title">Sacred Geometry Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="geometry" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="geometry" data-testid="tab-geometry">Geometry</TabsTrigger>
                  <TabsTrigger value="style" data-testid="tab-style">Style</TabsTrigger>
                </TabsList>

                <TabsContent value="geometry" className="space-y-6 mt-4">
                  <div>
                    <Label htmlFor="size-slider" data-testid="label-size">Size: {parameters.size[0].toFixed(1)}x</Label>
                    <Slider
                      id="size-slider"
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      value={parameters.size}
                      onValueChange={(value) => handleParameterChange('size', value)}
                      className="mt-2"
                      data-testid="slider-size"
                    />
                  </div>

                  <div>
                    <Label htmlFor="thickness-slider" data-testid="label-thickness">Thickness: {parameters.thickness[0].toFixed(1)}mm</Label>
                    <Slider
                      id="thickness-slider"
                      min={0.1}
                      max={0.5}
                      step={0.05}
                      value={parameters.thickness}
                      onValueChange={(value) => handleParameterChange('thickness', value)}
                      className="mt-2"
                      data-testid="slider-thickness"
                    />
                  </div>

                  <div>
                    <Label htmlFor="complexity-slider" data-testid="label-complexity">Pattern Complexity: {(parameters.complexity[0] * 100).toFixed(0)}%</Label>
                    <Slider
                      id="complexity-slider"
                      min={0.1}
                      max={1.0}
                      step={0.1}
                      value={parameters.complexity}
                      onValueChange={(value) => handleParameterChange('complexity', value)}
                      className="mt-2"
                      data-testid="slider-complexity"
                    />
                  </div>

                  <div>
                    <Label htmlFor="symmetry-slider" data-testid="label-symmetry">Symmetry Points: {parameters.symmetry[0]}</Label>
                    <Slider
                      id="symmetry-slider"
                      min={3}
                      max={12}
                      step={1}
                      value={parameters.symmetry}
                      onValueChange={(value) => handleParameterChange('symmetry', value)}
                      className="mt-2"
                      data-testid="slider-symmetry"
                    />
                  </div>

                  {currentDesign?.type === 'ring' && (
                    <div>
                      <Label htmlFor="finger-size-slider" data-testid="label-finger-size">Ring Size: {parameters.fingerSize[0]}</Label>
                      <Slider
                        id="finger-size-slider"
                        min={4}
                        max={12}
                        step={0.5}
                        value={parameters.fingerSize}
                        onValueChange={(value) => handleParameterChange('fingerSize', value)}
                        className="mt-2"
                        data-testid="slider-finger-size"
                      />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="style" className="space-y-6 mt-4">
                  <div>
                    <Label htmlFor="pattern-select" data-testid="label-pattern">Sacred Pattern</Label>
                    <Select value={selectedPattern} onValueChange={setSelectedPattern}>
                      <SelectTrigger className="mt-2" data-testid="select-pattern">
                        <SelectValue placeholder="Choose pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        {allPatterns.map((pattern) => (
                          <SelectItem key={pattern.id} value={pattern.type}>
                            {pattern.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="material-select" data-testid="label-material">Material Finish</Label>
                    <Select value={material} onValueChange={setMaterial}>
                      <SelectTrigger className="mt-2" data-testid="select-material">
                        <SelectValue placeholder="Choose material" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gold">Gold Plated</SelectItem>
                        <SelectItem value="silver">Silver Plated</SelectItem>
                        <SelectItem value="copper">Copper Finish</SelectItem>
                        <SelectItem value="natural">Natural PLA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="custom-text" data-testid="label-custom-text">Custom Text/Symbol</Label>
                    <Input
                      id="custom-text"
                      placeholder="Enter custom text or symbol"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className="mt-2"
                      data-testid="input-custom-text"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}