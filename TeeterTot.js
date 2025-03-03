// @name         Harris Teeter Auto Coupon Clipper
// @namespace    https://pomsaddons.xyz
// @description  Automatically fetch and clip Harris Teeter coupons
// @author       pompompur.in on discord
// @match        https://www.harristeeter.com/savings/cl/coupons/*

(function() {
    'use strict';

    const COUPONS_URL = "https://www.harristeeter.com/atlas/v1/savings-coupons/v1/coupons?filter.sort=relevance&filter.onlyNewCoupons=false&page.size=72&filter.status=unclipped&filter.status=active&page.offset=96&projections=coupons.compact";
    const CLIP_URL = "https://www.harristeeter.com/atlas/v1/savings-coupons/v1/clip-unclip";

    const HEADERS = {
        "User-Agent": navigator.userAgent,
        "Accept": "application/json, text/plain, */*",
        "X-Kroger-Channel": "WEB",
        "Content-Type": "application/json"
    };

    function fetchCoupons() {
        GM.xmlHttpRequest({
            method: "GET",
            url: COUPONS_URL,
            headers: HEADERS,
            onload: function(response) {
                if (response.status === 200) {
                    let coupons = JSON.parse(response.responseText).data.coupons;
                    clipCoupons(coupons);
                } else {
                    console.error("Failed to fetch coupons.", response);
                }
            }
        });
    }

    function clipCoupons(coupons) {
        coupons.forEach(coupon => {
            if (coupon.canBeAddedToCard) {
                GM.xmlHttpRequest({
                    method: "POST",
                    url: CLIP_URL,
                    headers: HEADERS,
                    data: JSON.stringify({ action: "CLIP", couponId: coupon.id }),
                    onload: function(response) {
                        if (response.status === 200) {
                            console.log(`Clipped coupon: ${coupon.shortDescription}`);
                        } else {
                            console.error(`Failed to clip coupon: ${coupon.id}`, response);
                        }
                    }
                });
            }
        });
    }

    fetchCoupons();
})();
