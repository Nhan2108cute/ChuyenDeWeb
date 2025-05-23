import React, { useState } from "react";

interface AdBannerProps {
    adUrl: string;
    imageUrl: string;
    altText?: string;
    height?: string;
    width?: string;
}

function AdBanner({
                      adUrl,
                      imageUrl,
                      altText = "Banner quảng cáo",
                      height = "100px",
                      width = "100%"
                  }: AdBannerProps) {
    const [visible, setVisible] = useState(true);

    if (!visible) return null; // Nếu banner bị ẩn thì không render gì

    return (
        <div
            style={{
                position: "relative",
                width,
                height,
                borderRadius: "8px",
                border: "1px solid #ccc",
                overflow: "hidden",
                display: "inline-block",
            }}
        >
            <button
                onClick={() => setVisible(false)}
                style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    background: "rgba(0,0,0,0.5)",
                    border: "none",
                    color: "white",
                    borderRadius: "50%",
                    width: 24,
                    height: 24,
                    cursor: "pointer",
                    fontWeight: "bold",
                    lineHeight: "24px",
                    textAlign: "center",
                    padding: 0,
                    zIndex: 10,
                }}
                aria-label="Đóng banner"
            >
                ×
            </button>
            <a
                href={adUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', width: "100%", height: "100%" }}
            >
                <img
                    src={imageUrl}
                    alt={altText}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </a>
        </div>
    );
}

export default AdBanner;
