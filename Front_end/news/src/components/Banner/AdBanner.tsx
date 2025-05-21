// AdBanner.tsx
import React from "react";

function AdBanner() {
    return (
        <div style={{
            width: '100%',
            height: '100px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ccc',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '20px 0',
            fontSize: '18px',
            color: '#666',
            fontStyle: 'italic',
        }}>
            Đây là khu vực quảng cáo mẫu (Test Ads)
        </div>
    );
}

export default AdBanner;
