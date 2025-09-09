import { ImageComparison } from "@/components/image-comparison";
import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-1 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <ImageComparison
        before="https://picsum.photos/id/800/800?grayscale"
        after="https://picsum.photos/id/800/800"
        beforeAlt="Original design"
        afterAlt="Redesigned version"
        initialPosition={50}
      />
    </div>
  );
}
