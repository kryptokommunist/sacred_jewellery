import JewelryCard from '../JewelryCard'
import collectionImage from "@assets/generated_images/Sacred_geometry_jewelry_collection_682cb4a2.png";

export default function JewelryCardExample() {
  return (
    <div className="max-w-sm">
      <JewelryCard
        id="mandala-necklace"
        name="Mandala Harmony Necklace"
        type="necklace"
        price={89}
        description="Intricate sacred geometry pattern inspired by Buddhist mandalas, featuring golden ratio proportions and fractal details."
        image={collectionImage}
        featured={true}
      />
    </div>
  );
}