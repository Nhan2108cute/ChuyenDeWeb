import React, { useEffect } from "react";

function GoogleAdsense() {
    useEffect(() => {
        try {
            (window as any).adsbygoogle = (window as any).adsbygoogle || [];
            (window as any).adsbygoogle.push({});
        } catch (e) {
            // có thể bỏ qua lỗi nếu có
            console.error("Adsense error:", e);
        }
    }, []);

    return (
        <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXX"  // Thay bằng mã client của bạn
            data-ad-slot="YYYYYYYYYYY"             // Thay bằng mã slot quảng cáo bạn tạo trên Adsense
            data-ad-format="auto"
            data-full-width-responsive="true"
        />
    );
}

export default GoogleAdsense;
