import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, ShoppingCart, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import customizationInterface from "@assets/generated_images/3D_jewelry_customization_interface_446cd61a.png";

export default function JewelryCustomizer() {
  // todo: remove mock functionality
  const [selectedJewelry, setSelectedJewelry] = useState("mandala-necklace");
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

  const handleParameterChange = (param: string, value: number[]) => {
    setParameters(prev => ({ ...prev, [param]: value }));
    console.log(`Parameter ${param} changed to:`, value[0]);
  };

  const handleDownloadSTL = () => {
    console.log('Downloading STL with parameters:', parameters);
  };

  const handleAddToCart = () => {
    console.log('Adding customized jewelry to cart:', { selectedJewelry, parameters, customText });
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
                <img 
                  src={customizationInterface} 
                  alt="3D Jewelry Customization Interface"
                  className="w-full h-full object-cover"
                  data-testid="img-3d-preview"
                />
                <div className="absolute bottom-4 left-4">
                  <Badge variant="secondary" data-testid="badge-render-quality">High Quality Render</Badge>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <Button className="flex-1" onClick={handleAddToCart} data-testid="button-add-to-cart">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart - $89
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleDownloadSTL} data-testid="button-download-stl">
                  <Download className="w-4 h-4 mr-2" />
                  Download STL
                </Button>
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
                  <SelectItem value="mandala-necklace">Mandala Harmony Necklace</SelectItem>
                  <SelectItem value="fibonacci-necklace">Fibonacci Spiral Necklace</SelectItem>
                  <SelectItem value="lotus-earrings">Sacred Lotus Earrings</SelectItem>
                  <SelectItem value="merkaba-ring">Merkaba Ring</SelectItem>
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

                  {selectedJewelry.includes('ring') && (
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
                        <SelectItem value="mandala">Mandala</SelectItem>
                        <SelectItem value="flower-of-life">Flower of Life</SelectItem>
                        <SelectItem value="fibonacci">Fibonacci Spiral</SelectItem>
                        <SelectItem value="islamic">Islamic Geometry</SelectItem>
                        <SelectItem value="celtic">Celtic Knots</SelectItem>
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