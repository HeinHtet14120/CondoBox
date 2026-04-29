interface LogoProps {
  size?: "md" | "lg";
}

export default function Logo({ size = "md" }: LogoProps) {
  const isLg = size === "lg";
  return (
    <div className="inline-flex items-center gap-2.5">
      <span className={`logo-mark ${isLg ? "logo-mark-lg" : ""}`}>
        <svg
          width={isLg ? 22 : 16}
          height={isLg ? 22 : 16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="M3.3 7 12 12l8.7-5" />
          <path d="M12 22V12" />
        </svg>
      </span>
      <span
        style={{
          fontWeight: 800,
          fontSize: isLg ? 20 : 17,
          letterSpacing: "-0.02em",
          color: "var(--text)",
        }}
      >
        Condo<span style={{ color: "var(--accent)" }}>Box</span>
      </span>
    </div>
  );
}
