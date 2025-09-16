import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, ShoppingCart } from "lucide-react";

interface JewelryCardProps {
  id: string;
  name: string;
  type: "necklace" | "earrings" | "ring";
  price: number;
  description: string;
  image: string;
  featured?: boolean;
}

export default function JewelryCard({ 
  id, 
  name, 
  type, 
  price, 
  description, 
  image, 
  featured = false 
}: JewelryCardProps) {
  
  const handleCustomize = () => {
    console.log('Customize jewelry:', id);
  };

  const handleAddToCart = () => {
    console.log('Add to cart:', id);
  };

  const handlePreview = () => {
    console.log('Preview jewelry:', id);
  };

  return (
    <Card className="group hover-elevate transition-all duration-300 overflow-hidden">
      <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          data-testid={`img-jewelry-${id}`}
        />
        
        {featured && (
          <Badge className="absolute top-3 left-3 bg-primary" data-testid={`badge-featured-${id}`}>
            Featured
          </Badge>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            size="icon" 
            variant="secondary" 
            className="bg-background/90 backdrop-blur-sm"
            onClick={handlePreview}
            data-testid={`button-preview-${id}`}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            size="icon" 
            variant="secondary" 
            className="bg-background/90 backdrop-blur-sm"
            data-testid={`button-download-${id}`}
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-1" data-testid={`text-name-${id}`}>
              {name}
            </h3>
            <Badge variant="secondary" className="text-xs" data-testid={`badge-type-${id}`}>
              {type}
            </Badge>
          </div>
          <span className="font-bold text-lg text-primary" data-testid={`text-price-${id}`}>
            ${price}
          </span>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2" data-testid={`text-description-${id}`}>
          {description}
        </p>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleCustomize}
            data-testid={`button-customize-${id}`}
          >
            Customize
          </Button>
          <Button 
            className="flex-1"
            onClick={handleAddToCart}
            data-testid={`button-add-cart-${id}`}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}