import Link from "next/link";
import Button from "@/components/Buttons/Button/Button";

export default function ReturnButton({
  href = "/",
  label = "Retour",
  size = 16,
  color = "#902124",
}) {
  return (
    <Link href={href}>
      <Button className="return-button flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
        >
          <path
            fill={color}
            d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20z"
          />
        </svg>
        {label}
      </Button>
    </Link>
  );
}
