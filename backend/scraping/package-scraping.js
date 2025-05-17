export const startPackageScraping =async(page,pkg)=>{
    const packageDetails= await page.evaluate(()=>{
        const packageDetails={
            description:"",
            images:[],
            themes:[],
            detailedItinerary:[],
            destinationItinerary:[],
            destinationDetails:[],
            packageItinerary:[],
        }

        const packageElement=document.querySelector("#main-container");
        const descriptionSelector=packageElement?.querySelector("#pkgOverView");
        const regex= new RegExp("Yatra","gi");
        descriptionSelector?.querySelector(".readMore")?.click();
        packageDetails.description=packageElement?.querySelector("#pkgOverView p")?.innerHTML.replace(regex,"Arklyte");

        packageDetails.images=Array.from(
            packageElement?.querySelectorAll(".galleryThumbImg")
        ).map((imageElement)=>imageElement.getAttribute("src")?.replace("/t_holidays_responsivedetailsthumbimg",""));

        const themeSelector = packageElement?.querySelector("#packageThemes");
        packageDetails.themes=Array.from(themeSelector?.querySelectorAll("li")).map((li)=>li.innerText.trim());

        const dayElements=packageElement?.querySelectorAll(".itineraryOverlay .subtitle");
        const descriptions=[];
        dayElements?.forEach((dayElement)=>{
            const title=dayElement.textContent.trim();
            const value=[];

            let nextElement=dayElement.nextElementSibling;
            while(nextElement && !nextElement.classList.contains("subtitle")){
                const textContent= nextElement.textContent.trim();
                if(textContent){
                    value.push(textContent);
                }
                nextElement= nextElement.nextElementSibling;
            }
            descriptions.push({title,value});
        });
        packageDetails.detailedItinerary=descriptions;

        const destinationItinerary=[];
        const destinationItinerarySelector=packageElement?.querySelectorAll(".type-list li");
        destinationItinerarySelector?.forEach((element)=>{
            const placeElement= element.firstChild;
            const placeText=placeElement.textContent.trim().replace(/[\n\t]/g,"");
            const nightsElement=element.querySelector("span");
            let totalNights=0;
            if(nightsElement){
                const nightsText=nightsElement?.textContent?.trim();
                const nightsMatch=nightsText.match(/\d+/);
                totalNights=nightsMatch ? parseInt(nightsMatch[0]) : 0;
            }
            destinationItinerary.push({placeText,totalNights});
        });
        packageDetails.destinationItinerary=destinationItinerary;

        const cities=[];

        const readMoreButton= document.getElementById("readMore");
        if(readMoreButton){
            readMoreButton.click();
        }
        const cityElements=document.querySelectorAll(".tabbing a");
        cityElements.forEach((cityElement)=>{
            cityElement.click();
            const readMoreButtonCity=document.getElementById("readMore");
            if(readMoreButtonCity){
                readMoreButtonCity.click();
            }
            const cityName=cityElement?.textContent?.trim();
            const cityDescription=document.getElementById("aboutDestPara")?.textContent?.trim();
            const cityImage=document.querySelector(".info-block img")?.getAttribute("src");

            cities.push({name:cityName,description:cityDescription,image:cityImage});
        });
        packageDetails.destinationDetails=cities;

        const dataExtracted=[];
        const timeline=document.querySelector(".time-line .right-column");
        const articles=timeline?.querySelectorAll("article");

        articles?.forEach((article)=>{
            const cityNameElement=article.querySelector(".title.row.acc-title .first.ng-binding");
            const cityName=cityNameElement?cityNameElement?.textContent?.trim():"";
            const daysSelector=article.querySelectorAll(".days.acc-content");
            const daysActivity=[];

            daysSelector.forEach((daysSelector)=>{
                const activityElements=daysSelector.querySelectorAll(".items-content");
                const activities=[];

                if(activityElements.length>0){
                    activityElements.forEach((activityElement,index)=>{
                        const activityTypeElement=activityElement.querySelector(".content.left.ico");
                        const activityType=activityTypeElement?activityElement?.textContent?.trim().split(" ")[0].split(" ")[0].split("\n")[0] : `Activty ${index+1}`;

                        let activityDescription=null;
                        if(activityType==="MEAL" || activityType==="SIGHTSEEING"){
                            const listHolder=activityElement.querySelector(".list-holder");
                            if(!listHolder){
                                const liElements=listHolder.querySelectorAll("li.ng-scope");

                                if(liElements.length >0){
                                    const scrappedData=[];
                                    liElements.forEach((liElement,index)=>{
                                        const liText=liElement?.textContent?.trim();
                                        scrappedData.push({index:index+1,text:liText});
                                    });

                                    activityDescription=scrappedData;
                                }
                            }
                        }else if(activityType==="HOTEL"){
                            const activityDescriptionElement=activityElement.querySelector(".content.right .name a");
                            activityDescription=activityDescriptionElement? activityDescriptionElement?.textContent?.trim():null;
                        }else if(activityType==="FLIGHT"){
                            const places=activityElement.querySelectorAll(".place span.full");
                            const scrappedData=[];
                            places.forEach((place)=>{
                                scrappedData.push(place?.textContent?.trim());
                            });
                            activityDescription=scrappedData;
                        }
                        activities.push({activityType,activityDescription});
                    })
                }
                daysActivity.push(activities);
            });

            dataExtracted.push({
                city:cityName,
                daysActivity
            });

            packageDetails.packageItinerary=dataExtracted;
        })

        return packageDetails;
    });

    const details= {...pkg,...packageDetails};
    return details;
};