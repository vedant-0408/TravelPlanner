export const startLocationScraping=async(page)=>{
    return await page.evaluate(()=>{
        const packageElements=document.querySelectorAll(".packages-container");
        const packages=[];
        packageElements.forEach((packageElement)=>{
            const packageInfo={
                id:null,
                name:"",
                nights:0,
                days:0,
                inclusions:[],
                price:0,
            };
            const nameElement= packageElement.querySelector(".package-name a");
            const href=nameElement.getAttribute("href");
            const packageIdMatch= href?.match(/packageId=([^&]+)/);
            packageInfo.id=packageIdMatch? packageIdMatch[1]:null;

            packageInfo.name=packageElement.querySelector(".package-name a").textContent || "";

            const durationElement=packageElement.querySelector(".package-duration");
            packageInfo.nights=parseInt(durationElement?.querySelector(".nights span").textContent || "0");
            packageInfo.days=parseInt(durationElement?.querySelector(".days span").textContent || "0");

            const inclusionsElement=packageElement.querySelector(".package-inclusions");
            const inclusionItems=Array.from(inclusionsElement?.querySelectorAll("li") || []).map(item=>item.querySelector(".icon-name")?.textContent || "");
            packageInfo.inclusions=inclusionItems;

            const priceElement=packageElement.querySelector(".final-price .amount");
            packageInfo.price=parseInt(priceElement?.textContent?.replace(/,/g,"")|| "0");

            packages.push(packageInfo);
        })
        return packages;
    })
}