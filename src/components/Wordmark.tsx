import logo from "@/assets/celunor-logo.png.asset.json";

export function Wordmark({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const cls =
    size === "lg" ? "h-28 md:h-40" : size === "sm" ? "h-12" : "h-16 md:h-24";

  return (
    <img
      src={logo.url}
      alt="Célunor"
      className={`${cls} w-auto object-contain ${className}`}
      loading={size === "sm" ? "eager" : "lazy"}
    />
  );
}
