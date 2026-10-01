import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  className: string;
  sizes: string;
  priority?: boolean;
};

export default function Plate({ src, alt, className, sizes, priority }: Props) {
  return (
    <div className={`plate ${className}`} data-reveal={priority ? undefined : "plate"}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={85}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
      />
    </div>
  );
}
