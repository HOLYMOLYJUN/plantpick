"use client";

import { QRCodeSVG } from "qrcode.react";

interface QRCodeProps {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  className?: string;
}

export function QRCode({
  value,
  size = 256,
  level = "M",
  className = "",
}: QRCodeProps) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <QRCodeSVG
        value={value}
        size={size}
        level={level}
        includeMargin={true}
      />
    </div>
  );
}

