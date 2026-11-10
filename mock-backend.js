/**
 * SOS Realty Group / Janardhan Vangala — LOCAL-ONLY FRONTEND DEMO.
 * Fictional properties, invented prices, and example events are explicitly sample content,
 * not actual inventory, agent sales records, available assumable loans, or MLS data.
 * No backend, authentication, CRM or email provider is connected.
 */
(function () {
  'use strict';
  const samples = [
    ['The Desert Horizon','Las Vegas',775000,4,3,2670,['family','modern'],'assets/home-01.jpg','WARM DESERT MODERN',true,true,'Saturday · Demo 11 AM–1 PM',false],
    ['The Silver Palm','Las Vegas',995000,4,4,3240,['luxury','modern'],'assets/home-03.jpg','DESIGN-LED LIVING',true,false,null,true],
    ['The Sunrise Courtyard','Las Vegas',545000,3,2,1890,['family'],'assets/home-04.jpg','LIVABLE LUXURY',false,true,null,false],
    ['The Green Valley Residence','Henderson',859000,4,3,2850,['family','modern'],'assets/home-02.jpg','OPEN SPACES',true,true,'Sunday · Demo 1–3 PM',false],
    ['The Mountain View House','Henderson',1395000,5,4,4250,['luxury','family'],'assets/home-05.jpg','MOUNTAIN BACKDROP',true,false,null,true],
    ['The Quiet Retreat','Henderson',645000,3,2,2040,['family'],'assets/home-06.jpg','EVERYDAY COMFORT',false,true,null,false],
    ['The North Star','North Las Vegas',499000,3,2,1820,['family'],'assets/home-04.jpg','A PLACE TO GROW',false,true,'Saturday · Demo 12–2 PM',true],
    ['The Mesa Collection','North Las Vegas',635000,4,3,2460,['modern','family'],'assets/home-01.jpg','MODERN FAMILY HOME',true,false,null,false],
    ['The Cielo House','North Las Vegas',725000,4,3,2820,['modern'],'assets/home-03.jpg','DESERT LIGHT',false,true,null,false],
    ['The Boulder Vista','Boulder City',685000,3,2,2230,['family'],'assets/home-06.jpg','HISTORIC CHARM',false,true,'Sunday · Demo 12–2 PM',true],
    ['The Lake Mead Retreat','Boulder City',1125000,4,3,3170,['luxury','modern'],'assets/home-05.jpg','LAKESIDE INSPIRATION',true,false,null,false],
    ['The Heritage House','Boulder City',589000,3,2,1920,['family'],'assets/home-02.jpg','SMALL-TOWN SOUL',false,true,null,false]
  ];
  const details = [
    {type:'House',status:'Active',tour:true,days:2,garage:3,stories:2,hoa:95,views:['Mountain'],sub:'Summerlin West',features:['Private Pool','Pool','Garage','Fireplace','Gated Community']},
    {type:'House',status:'Active',tour:true,days:9,garage:3,stories:2,hoa:180,views:['Strip','Mountain'],sub:'The Ridges',features:['Private Pool','Pool','Garage','Gated Community','Golf Course','Primary Bedroom Downstairs']},
    {type:'Townhome',status:'Active',tour:false,days:1,garage:2,stories:2,hoa:140,views:[],sub:'Centennial Hills',features:['Garage','No Pool','Price Decrease']},
    {type:'House',status:'Active',tour:false,days:4,garage:2,stories:1,hoa:60,views:['Mountain'],sub:'Green Valley Ranch',features:['Garage','One Story','Pool','Primary Bedroom Downstairs','Fireplace']},
    {type:'House',status:'Active',tour:true,days:21,garage:4,stories:2,hoa:250,views:['Strip','Mountain','City'],sub:'MacDonald Highlands',features:['Private Pool','Pool','Garage','Gated Community','Golf Course','Has Elevator','Has RV Parking']},
    {type:'Condo',status:'Pending',tour:false,days:3,garage:1,stories:1,hoa:310,views:['Mountain'],sub:'Anthem',features:['Age Restricted','One Story','Accessibility','No Pool']},
    {type:'House',status:'Active',tour:false,days:6,garage:2,stories:1,hoa:45,views:[],sub:'Aliante',features:['Garage','One Story','Has RV Parking','New Construction']},
    {type:'House',status:'Active',tour:true,days:14,garage:3,stories:2,hoa:70,views:['Mountain'],sub:'Valley Vista',features:['Garage','Pool','Private Pool','Price Decrease']},
    {type:'Townhome',status:'Pending',tour:false,days:2,garage:2,stories:2,hoa:120,views:['City'],sub:'Eldorado',features:['Garage','New Construction','Active Under Contract']},
    {type:'House',status:'Active',tour:false,days:5,garage:2,stories:1,hoa:0,views:['Lake','Mountain'],sub:'Old Town Boulder City',features:['Garage','One Story','Fireplace','Basement','Horse Property']},
    {type:'House',status:'Active',tour:true,days:30,garage:3,stories:2,hoa:0,views:['Lake','Mountain'],sub:'Boulder Creek Golf',features:['Private Pool','Pool','Garage','Golf Course','Has RV Parking']},
    {type:'House',status:'Active',tour:false,days:8,garage:1,stories:1,hoa:0,views:['Mountain'],sub:'Historic District',features:['One Story','No Pool','Distressed','Fireplace']}
  ];
  // Illustrative assumable-loan terms and approximate neighborhood locations (not real addresses or loans).
  const loans = {0:['VA',2.75,598000],1:['VA',2.875,712000],3:['FHA',3.125,472000],4:['VA',3.25,905000],6:['FHA',2.5,402000],7:['FHA',2.99,455000],9:['VA',2.625,512000],11:['VA',2.25,468000]};
  const seedTags = {0:['Loan verified','Servicer confirmed','Photos verified'],3:['Loan verified','Rate verified'],6:['Loan verified','Servicer confirmed','Rate verified','Balance verified'],11:['Loan verified']};
  const spots = [[36.1655,-115.3352],[36.1421,-115.3068],[36.2793,-115.2705],[36.0213,-115.0846],[35.9952,-115.0108],[35.9655,-115.0902],[36.2951,-115.1652],[36.3052,-115.2051],[36.2897,-115.1248],[35.9771,-114.8352],[35.9583,-114.8601],[35.9732,-114.8421]];
  const listings = samples.map((a,i)=>{const d=details[i],ln=loans[i];return {
    assumable:Boolean(ln),verified:[...(seedTags[i]||[])],loanType:ln?ln[0]:null,assumableRate:ln?ln[1]:null,loanBalance:ln?ln[2]:null,yearsLeft:ln?26-(i%4):null,latlng:spots[i],
    id:i+1,name:a[0],city:a[1],address:a[1]+', NV · illustrative location',price:a[2],beds:a[3],baths:a[4],sqft:a[5],
    category:a[6],image:a[7],tag:a[8],featured:a[9],newListing:a[10],openHouse:a[11],
    description:`A fictional concept residence designed to illustrate the ${a[1]} property-search experience. Images, prices, features, and events are placeholders—not real properties or offers.`,
    type:d.type,status:d.status,virtualTour:d.tour,daysOnSite:d.days,garage:d.garage,stories:d.stories,hoa:d.hoa,views:d.views,subdivision:d.sub,features:d.features,
    school:'Clark County School District',year:2006+(i*3)%19,lot:+(0.12+(i%5)*0.07).toFixed(2),reference:'SAMPLE-'+String(24001+i),coords:[23+(i*11)%65,25+(i*13)%56]
  };});
  const soldBase={type:'House',virtualTour:false,garage:2,stories:1,hoa:0,views:[],features:['Garage'],school:'Clark County School District',year:2012,lot:0.18,featured:false,newListing:false,openHouse:null,assumable:false,category:['family']};
  const soldListings = [
    {...soldBase,id:101,name:'The Valley View',city:'Las Vegas',address:'Las Vegas, NV · example only',price:659000,beds:4,baths:3,sqft:2600,image:'assets/home-02.jpg',status:'Sold',soldDate:'2026-10-18',daysOnSite:40,subdivision:'Summerlin',reference:'SAMPLE-23101',tag:'SAMPLE PAST SALE',description:'Illustrative sale — not a transaction record.',coords:[30,44],latlng:[36.1836,-115.3093]},
    {...soldBase,id:102,name:'The Parkside House',city:'Henderson',address:'Henderson, NV · example only',price:865000,beds:4,baths:3,sqft:2800,image:'assets/home-04.jpg',status:'Sold',soldDate:'2026-09-27',daysOnSite:61,subdivision:'Inspirada',reference:'SAMPLE-23102',tag:'SAMPLE PAST SALE',description:'Illustrative sale — not a transaction record.',coords:[62,66],latlng:[35.9562,-115.1205]},
    {...soldBase,id:103,name:'The Canyon Residence',city:'Boulder City',address:'Boulder City, NV · example only',price:739000,beds:3,baths:2,sqft:2300,image:'assets/home-06.jpg',status:'Sold',soldDate:'2026-08-30',daysOnSite:89,subdivision:'Boulder Hills',reference:'SAMPLE-23103',tag:'SAMPLE PAST SALE',description:'Illustrative sale — not a transaction record.',coords:[80,78],latlng:[35.9688,-114.8512]}
  ];
  const guides = {
    'Las Vegas':{
      subtitle:'From the downtown Arts District to quiet west-side streets near Red Rock Canyon.',
      intro:['Searching for homes for sale in Las Vegas? Janardhan Vangala helps buyers and sellers across the city, from downtown condos to family homes with mountain views. Whether you are moving across town or across the country, you can start right here.','Below you will find listings, a market snapshot and answers to common questions. When you are ready, Janardhan can set up tours that fit your schedule.'],
      living:['Las Vegas is the county seat of Clark County and the heart of Southern Nevada. The City of Las Vegas handles services such as parks, permits and trash pickup. However, many homes with a Las Vegas mailing address sit in unincorporated Clark County, so the right office depends on the exact address.','Downtown has grown into a lively place to live. The Arts District, Fremont Street and Symphony Park draw residents who want dining and culture nearby, while the west side offers parks, golf and quick trips to Red Rock Canyon and the Spring Mountains.','Housing is broad, too: ranch homes on established streets, gated communities, golf-course properties, townhomes and high-rise condos. Part of Summerlin, one of the valley’s best-known master-planned communities, lies within the city.'],
      why:[['Mountains on the horizon','Red Rock Canyon and the Spring Mountains are a short drive from the west side.'],['A downtown with character','The Arts District, Fremont Street and Symphony Park keep the city center busy.'],['Every kind of home','Condos, townhomes, ranch homes and estates are all part of the mix.'],['No state income tax','Nevada does not tax personal income, which appeals to many movers.']],
      faqs:[['Is Las Vegas a good place to buy a home?','For many buyers, yes. Las Vegas offers a wide range of home styles, sunny weather and access to mountains and lakes. It also has no state income tax. Janardhan can compare neighborhoods with you before you tour.'],['What types of homes are for sale in Las Vegas?','You will see single-family homes, townhomes, condos and luxury estates. Some neighborhoods are gated, and many sit in master-planned communities.'],['Which school district serves Las Vegas?','The Clark County School District serves all of Clark County, including Las Vegas. Magnet and charter schools are options, too. School zones change, so always confirm the zoned school for a specific address.'],['Is the Las Vegas Strip inside the City of Las Vegas?','Mostly, no. Most of the Strip sits in unincorporated Clark County, south of the city limits. That is why your address may be Las Vegas while your services come from the county.'],['Does Nevada have a state income tax?','No. Nevada does not have a personal income tax. Property taxes still apply, and Nevada limits how fast the bill on an owner-occupied primary home can rise each year.'],['Do most Las Vegas homes have an HOA?','Many do, especially in gated and master-planned communities. Review the HOA dues, rules and reserves before you write an offer. Janardhan can help you request those documents early.'],['How do I get around Las Vegas?','Most residents drive. I-15, US-95 and the 215 Beltway connect the valley, and Harry Reid International Airport is close to the center. Public buses serve the main corridors.']]
    },
    'Henderson':{
      subtitle:'Master-planned neighborhoods, miles of trails and Lake Mead close by.',
      intro:['Looking for homes for sale in Henderson, NV? Henderson sits on the southeast side of the Las Vegas Valley and is known for master-planned neighborhoods, parks and trails, and quick access to Lake Mead.','Janardhan helps buyers compare Henderson’s many communities by home style, HOA, commute and lifestyle, then sets up tours of the homes that fit.'],
      living:['Henderson is its own city, with its own police, fire, parks and water services. Its downtown Water Street District hosts city hall, dining and community events.','Neighborhoods vary widely. Green Valley is one of the city’s established areas, while Anthem, Inspirada and Cadence are large master-planned communities with parks and community centers. MacDonald Highlands and Lake Las Vegas are known for view homes and luxury living.','Outdoor time is easy. Henderson has an extensive trail network, and the River Mountains Loop Trail links the city with Boulder City and Lake Mead National Recreation Area.'],
      why:[['Master-planned living','Anthem, Inspirada, Cadence and more pair homes with parks and community centers.'],['Parks and trails','Paths wind through neighborhoods and out toward the River Mountains.'],['Lake Mead nearby','Boating, paddling and lakeside trails are a short drive east.'],['A real downtown','The Water Street District brings dining and events to the city center.']],
      faqs:[['Is Henderson, NV a good place to buy a home?','For many buyers, yes. Henderson offers planned neighborhoods, parks and trails, and easy access to the rest of the valley. It suits families, retirees and commuters alike.'],['Is Henderson part of Las Vegas?','No. Henderson is a separate city with its own government and services. It sits in the same valley, so many residents work, shop and play across the area.'],['What types of homes are for sale in Henderson, NV?','Single-family homes, townhomes, condos, golf-course homes and luxury estates. Some neighborhoods are age-restricted, while others are gated.'],['Which schools serve Henderson?','Public schools are part of the Clark County School District. Charter and private schools are options as well, and Nevada State University has its campus in Henderson. Always confirm the zoned school for a specific address.'],['What should I know about HOAs in Henderson?','Most master-planned neighborhoods have an HOA, and some have more than one. A few areas carry special assessments in addition to dues, so review the HOA documents and title report before you commit.'],['Are there waterfront homes in Henderson?','Yes. Lake Las Vegas, a resort community within Henderson, has homes and condos along a private lake, and many hillside neighborhoods offer views across the valley.'],['How do I commute from Henderson?','The 215 Beltway and I-11 connect Henderson with the rest of the valley, so the airport and the Strip are a short drive from many neighborhoods.']]
    },
    'North Las Vegas':{
      subtitle:'Master-planned neighborhoods, big parks and room to grow on the north side of the valley.',
      intro:['Shopping for North Las Vegas homes? North Las Vegas is its own city on the north side of the valley, with neighborhoods ranging from established streets near downtown to large master-planned communities farther north.','Janardhan helps buyers compare North Las Vegas homes by layout, lot size, HOA and commute, so you can focus on the homes that truly fit.'],
      living:['The City of North Las Vegas runs its own police, fire and parks departments, plus its own library district and recreation centers.','Aliante is one of the city’s best-known master-planned communities, with a nature discovery park and golf. Craig Ranch Regional Park offers trails, sports fields, a dog park and an amphitheater for concerts.','To the northwest, Tule Springs Fossil Beds National Monument protects Ice Age fossils at the edge of the city, and Nellis Air Force Base sits just to the northeast, so many military families call the area home and VA financing comes up often.'],
      why:[['Master-planned communities','Aliante and other planned areas pair homes with parks and walking paths.'],['Regional parks','Craig Ranch Regional Park hosts concerts, sports and weekend outings.'],['Near Nellis Air Force Base','Many service members and their families live close by.'],['A growing job base','Employers in the Apex Industrial Park and along I-15 sit to the north.']],
      faqs:[['Is North Las Vegas a good place to buy a home?','For many buyers, yes. North Las Vegas offers a wide range of home styles, large parks and easy freeway access, and it appeals to first-time buyers, families and military households.'],['Is North Las Vegas a separate city from Las Vegas?','Yes. North Las Vegas has its own mayor, council and city services, though it shares the valley with Las Vegas and many residents commute across city lines.'],['What types of North Las Vegas homes are for sale?','Single-family homes, townhomes, condos and some multi-unit properties. Many homes sit in master-planned neighborhoods with an HOA.'],['Which schools serve North Las Vegas?','Public schools are part of the Clark County School District, and the College of Southern Nevada has a campus here. Always confirm the zoned school for a specific address.'],['Is North Las Vegas a good fit for military families?','It often is, because Nellis Air Force Base sits just to the northeast, and many VA loans can be assumed by a qualified buyer. Janardhan can walk you through VA-friendly listings and timelines.'],['How do I commute from North Las Vegas?','I-15 and the 215 Beltway run through the city, and US-95 is close by, so downtown Las Vegas and the airport are a straightforward drive.'],['What is there to do in North Las Vegas?','Craig Ranch Regional Park, the Aliante area and local golf, plus open desert hiking at Tule Springs Fossil Beds National Monument.']]
    },
    'Boulder City':{
      subtitle:'A historic small town beside Lake Mead, with no casinos and growth by design.',
      intro:['Interested in homes for sale in Boulder City? Boulder City is a small, historic town southeast of Las Vegas, close to Hoover Dam and Lake Mead. It feels a world away from the Strip, yet it is still part of the valley.','Because homes here come up less often, Janardhan helps buyers prepare early, so when the right home lists you are ready to move.'],
      living:['Boulder City was built in the early 1930s to house the workers who built Hoover Dam. Its historic district is listed on the National Register of Historic Places, and downtown still feels like a classic small town.','Two local rules shape life here: gaming is not allowed, which is rare in Nevada, and the controlled growth ordinance limits how many new homes can be built each year.','Recreation is the big draw. Lake Mead National Recreation Area sits next door, Hoover Dam is minutes away, Bootleg Canyon is known for mountain biking, and the River Mountains Loop Trail links the town with Henderson.'],
      why:[['Small-town history','A walkable historic downtown built in the Hoover Dam era.'],['No casinos','Gaming is not allowed here, so the pace stays quiet and local.'],['Lake Mead next door','Boating, beaches and trails sit just outside town.'],['Growth by design','Limits on new building help keep the town’s character.']],
      faqs:[['Is Boulder City a good place to buy a home?','For buyers who want a quiet, historic town near the lake, yes. Supply is limited, so it helps to plan ahead.'],['Why are there no casinos in Boulder City?','Gaming has never been allowed in Boulder City. The rule dates back to the town’s federal origins and remains in place today.'],['What is Boulder City’s controlled growth ordinance?','A local law that caps how many new residential building permits the city issues each year. New construction is limited, and existing homes make up most of the market.'],['What types of homes are for sale in Boulder City?','Historic cottages near downtown, ranch homes, golf-course homes and view homes on the hillsides, some looking out toward Lake Mead.'],['Which schools serve Boulder City?','Boulder City’s public schools are part of the Clark County School District, and the town has its own elementary, middle and high schools. Always confirm school zoning for a specific address.'],['How far is Boulder City from Las Vegas?','Roughly a half-hour drive from the Strip, depending on traffic. I-11 links the town with Henderson and the rest of the valley.'],['What is there to do in Boulder City?','Lake Mead, Hoover Dam tours, mountain biking at Bootleg Canyon, two golf courses and a historic downtown with shops, dining and events.']]
    }
  };
  const sharedFaqs = city=>[[`Can I buy a ${city} home with an assumable loan?`,'Sometimes, yes. Many FHA and VA loans can be taken over by a qualified buyer, so you may keep the seller’s rate. The loan servicer must approve you, and you cover the gap between the price and the loan balance. See the assumable homes guide for listings and a payment estimator.'],[`How do I find out what my ${city} home is worth?`,'Request a free home valuation. Janardhan reviews recent nearby sales, your home’s features and current buyer demand, then sends you a clear price range. No cost and no obligation.']];
  Object.keys(guides).forEach(k=>{guides[k].faqs=[...guides[k].faqs,...sharedFaqs(k)];});
  const communities = [
    {name:'Las Vegas',tag:'CITY ENERGY & DESERT VIEWS',description:'Downtown energy, vibrant neighborhoods, celebrated entertainment and a striking desert setting.',region:'Nevada',scene:'vegas',accent:'#bf92f1',highlight:'The Strip · neighborhoods · city life'},
    {name:'Henderson',tag:'PARKS & LAKE MEAD ACCESS',description:'Master-planned neighborhoods, parks and mountain views with convenient access to Lake Mead.',region:'Nevada',scene:'henderson',accent:'#aac8a4',highlight:'Parks · trails · master-planned living'},
    {name:'North Las Vegas',tag:'ROOM TO GROW',description:'Growing residential neighborhoods, open skies and community parks throughout the northern valley.',region:'Nevada',scene:'north',accent:'#c1bbf7',highlight:'New neighborhoods · parks · big skies'},
    {name:'Boulder City',tag:'HISTORY BY THE LAKE',description:'Historic small-town character, outdoor adventures and scenic access to Lake Mead and Hoover Dam.',region:'Nevada',scene:'boulder',accent:'#e7b37c',highlight:'Lake Mead · heritage · desert landscape'}
  ];
  communities.forEach(c=>Object.assign(c,guides[c.name]));
  const testimonials = [
    {name:'Listening first',role:'THE APPROACH',quote:'Janardhan begins with your goals and helps you weigh your options before taking the next step.'},
    {name:'Options explained',role:'BUYER GUIDANCE',quote:'From financing choices to neighborhood fit, the goal is to make each decision clearer.'},
    {name:'Thoughtful planning',role:'SELLER GUIDANCE',quote:'Pricing, preparation and timing are discussed in plain language, with your plans at the center.'}
  ];
  const cache={};
  const get=k=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch{return cache[k]||[]}};
  const set=(k,v)=>{cache[k]=v;try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
  const KEY='sos_janardhan_demo_';
  const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  window.MockAPI={
    listings,communities,soldListings,testimonials,
    async getListings(filters={}){await pause(50);return listings.filter(h=>(!filters.category||filters.category==='all'||h.category.includes(filters.category))&&(!filters.city||h.city.toLowerCase().includes(filters.city.toLowerCase())));},
    async getListing(id){await pause(45);return listings.find(h=>h.id===Number(id))||null;},
    async getTestimonials(){return testimonials;},
    async saveInquiry(data){await pause(150);const list=get(KEY+'inquiries');list.push({...data,id:Date.now(),submittedAt:new Date().toISOString()});set(KEY+'inquiries',list);return{success:true,demo:true};},
    getInquiries(){return get(KEY+'inquiries');},
    getFavorites(){return get(KEY+'favorites');},
    toggleFavorite(id){const a=get(KEY+'favorites');const updated=a.includes(id)?a.filter(x=>x!==id):[...a,id];set(KEY+'favorites',updated);return updated;},
    async getAdvancedListings(filters={}){await pause(50);return listings.filter(h=>
      (!filters.city||h.city.toLowerCase().includes(String(filters.city).toLowerCase()))&&
      (!filters.keyword||(h.name+' '+h.city+' '+h.description).toLowerCase().includes(String(filters.keyword).toLowerCase()))&&
      (!filters.minPrice||h.price>=Number(filters.minPrice))&&(!filters.maxPrice||h.price<=Number(filters.maxPrice))&&
      (!filters.minBeds||h.beds>=Number(filters.minBeds))&&(!filters.minBaths||h.baths>=Number(filters.minBaths))&&
      (!filters.minSqft||h.sqft>=Number(filters.minSqft))&&(!filters.type||h.type===filters.type)&&
      (!filters.openOnly||Boolean(h.openHouse))&&(!filters.featuredOnly||h.featured)&&
      (!filters.newOnly||h.newListing)&&(!filters.assumableOnly||h.assumable)
    ).sort((a,b)=>filters.sort==='price-asc'?a.price-b.price:filters.sort==='price-desc'?b.price-a.price:a.id-b.id);},
    getSavedSearches(){return get(KEY+'saved_searches');},
    async saveSearch(data){const a=get(KEY+'saved_searches'),v={...data,id:Date.now()+Math.round(Math.random()*100),createdAt:new Date().toISOString()};a.unshift(v);set(KEY+'saved_searches',a);return v;},
    removeSavedSearch(id){set(KEY+'saved_searches',get(KEY+'saved_searches').filter(x=>String(x.id)!==String(id)));},
    getAlerts(){return get(KEY+'alerts');},
    async subscribeAlerts(data){const a=get(KEY+'alerts'),v={...data,id:Date.now(),active:true,createdAt:new Date().toISOString()};a.unshift(v);set(KEY+'alerts',a);return v;},
    toggleAlert(id){const a=get(KEY+'alerts');a.forEach(x=>{if(String(x.id)===String(id))x.active=!x.active});set(KEY+'alerts',a);return a;},
    getDemoAccount(){return get(KEY+'account')[0]||null;},
    setDemoAccount(email){set(KEY+'account',[{email,signedInAt:new Date().toISOString()}]);},
    clearDemoAccount(){set(KEY+'account',[]);}
  };

  /* ---- Mock auth, admin data and analytics (browser storage only, plaintext demo passwords) ---- */
  const DEMO_USERS=[
    {id:1,name:'Janardhan Vangala',email:'admin@sosrealty.demo',password:'Admin@2026',role:'admin',phone:'(702) 215-1838',createdAt:'2026-09-01T16:00:00Z',seed:true},
    {id:2,name:'Alex Morgan',email:'buyer@sosrealty.demo',password:'Buyer@2026',role:'user',phone:'(702) 555-0142',createdAt:'2026-10-04T18:20:00Z',seed:true},
    {id:3,name:'Priya Natarajan',email:'priya.n@example.com',password:null,role:'user',phone:'(702) 555-0175',createdAt:'2026-10-12T15:05:00Z',seed:true},
    {id:4,name:'Marcus Reed',email:'marcus.reed@example.com',password:null,role:'user',phone:'(725) 555-0110',createdAt:'2026-10-19T21:40:00Z',seed:true},
    {id:5,name:'Dana Whitfield',email:'dana.w@example.com',password:null,role:'user',phone:'',createdAt:'2026-10-28T17:12:00Z',seed:true},
    {id:6,name:'Luis Ortega',email:'l.ortega@example.com',password:null,role:'user',phone:'(702) 555-0193',createdAt:'2026-11-03T14:30:00Z',seed:true}
  ];
  const SAMPLE_LEADS=[
    {id:'L-1001',name:'Priya Natarajan',email:'priya.n@example.com',phone:'(702) 555-0175',intent:'tour',source:'property-detail',home:'The North Star',message:'Can we see it Saturday? We have a VA certificate.',submittedAt:'2026-11-08T16:22:00Z',sample:true},
    {id:'L-1002',name:'Marcus Reed',email:'marcus.reed@example.com',phone:'(725) 555-0110',intent:'buy',source:'assumable',home:'The Heritage House',message:'Interested in assuming the 2.25% VA loan.',submittedAt:'2026-11-07T19:03:00Z',sample:true},
    {id:'L-1003',name:'Grace Kim',email:'grace.kim@example.com',phone:'',intent:'sell',source:'valuation',home:'—',message:'Henderson 4 bed, thinking of listing in spring.',submittedAt:'2026-11-06T13:47:00Z',sample:true},
    {id:'L-1004',name:'Dana Whitfield',email:'dana.w@example.com',phone:'',intent:'info',source:'search',home:'The Desert Horizon',message:'What is the equity gap on this one?',submittedAt:'2026-11-04T22:15:00Z',sample:true},
    {id:'L-1005',name:'Tom Becker',email:'tbecker@example.com',phone:'(702) 555-0128',intent:'buy',source:'community-detail',home:'—',message:'Relocating from Denver, Boulder City only.',submittedAt:'2026-11-02T17:30:00Z',sample:true},
    {id:'L-1006',name:'Luis Ortega',email:'l.ortega@example.com',phone:'(702) 555-0193',intent:'tour',source:'map',home:'The Mesa Collection',message:'FHA assumption — what credit score is needed?',submittedAt:'2026-10-30T15:58:00Z',sample:true}
  ];
  const LEAD_STATUSES=['New','Contacted','Touring','Under contract','Closed','Lost'];
  const VERIFY_TAGS=['Loan verified','Servicer confirmed','Rate verified','Balance verified','Assumption approved','Seller confirmed','Photos verified','Inspection done'];
  const baseline={};listings.forEach(h=>{baseline[h.id]={assumable:h.assumable,loanType:h.loanType,assumableRate:h.assumableRate,loanBalance:h.loanBalance,yearsLeft:h.yearsLeft,status:h.status,verified:[...h.verified],adminNote:''};});
  const applyOverrides=()=>{const ov=get(KEY+'listing_overrides')[0]||{};listings.forEach(h=>Object.assign(h,JSON.parse(JSON.stringify(baseline[h.id])),ov[h.id]||{}));};
  applyOverrides();
  const users=()=>{const stored=get(KEY+'users');return stored.length?stored:DEMO_USERS.map(u=>({...u}));};
  const publicUser=u=>u?(({password,...rest})=>rest)(u):null;
  const seeded=seed=>()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
  const dayKey=d=>d.toISOString().slice(0,10);
  Object.assign(window.MockAPI,{
    VERIFY_TAGS,LEAD_STATUSES,DEMO_USERS:DEMO_USERS.filter(u=>u.password).map(u=>({email:u.email,password:u.password,role:u.role,name:u.name})),
    currentUser(){const s=get(KEY+'session')[0];if(!s)return null;return publicUser(users().find(u=>u.id===s.userId));},
    signIn(email,password){const u=users().find(x=>x.email.toLowerCase()===String(email).trim().toLowerCase());
      if(!u)return{ok:false,error:'No account uses that email. Create one, or use a demo account below.'};
      if(!u.password||u.password!==password)return{ok:false,error:'That password does not match. Check it and try again.'};
      set(KEY+'session',[{userId:u.id,at:new Date().toISOString()}]);this.track('sign-in',{role:u.role});return{ok:true,user:publicUser(u)};},
    signUp({name,email,phone,password}){const all=users(),e=String(email).trim().toLowerCase();
      if(all.some(u=>u.email.toLowerCase()===e))return{ok:false,error:'An account with that email already exists. Sign in instead.'};
      if(String(password).length<8)return{ok:false,error:'Use a password with at least 8 characters.'};
      const u={id:Math.max(...all.map(x=>x.id))+1,name:String(name).trim(),email:e,phone:phone||'',password,role:'user',createdAt:new Date().toISOString()};
      set(KEY+'users',[...all,u]);set(KEY+'session',[{userId:u.id,at:u.createdAt}]);this.track('sign-up',{});return{ok:true,user:publicUser(u)};},
    signOut(){set(KEY+'session',[]);},
    getUsers(){return users().map(publicUser);},
    updateUser(id,patch){const all=users();const u=all.find(x=>x.id===Number(id));if(u)Object.assign(u,patch);set(KEY+'users',all);},
    deleteUser(id){set(KEY+'users',users().filter(u=>u.id!==Number(id)));},
    updateListing(id,patch){const ov=get(KEY+'listing_overrides')[0]||{};ov[id]={...(ov[id]||{}),...patch};set(KEY+'listing_overrides',[ov]);applyOverrides();},
    resetListing(id){const ov=get(KEY+'listing_overrides')[0]||{};delete ov[id];set(KEY+'listing_overrides',[ov]);applyOverrides();},
    isEdited(id){return Boolean((get(KEY+'listing_overrides')[0]||{})[id]);},
    getLeads(){const st=get(KEY+'lead_status')[0]||{};return [...this.getInquiries().map(x=>({...x,id:String(x.id),home:x.property||x.home||'—'})),...SAMPLE_LEADS].map(l=>({...l,status:st[l.id]||'New'})).sort((a,b)=>String(b.submittedAt).localeCompare(String(a.submittedAt)));},
    setLeadStatus(id,status){const st=get(KEY+'lead_status')[0]||{};st[id]=status;set(KEY+'lead_status',[st]);},
    track(type,data={}){const ev=get(KEY+'events');ev.push({type,...data,at:new Date().toISOString()});set(KEY+'events',ev.slice(-3000));},
    getEvents(){return get(KEY+'events');},
    getAnalytics(days=30){const rnd=seeded(2026),today=new Date(),out=[],real=this.getEvents();
      const realBy={};real.forEach(e=>{const k=String(e.at).slice(0,10);(realBy[k]=realBy[k]||{views:0,searches:0,saves:0});if(e.type==='view')realBy[k].views++;if(e.type==='search')realBy[k].searches++;if(e.type==='favorite')realBy[k].saves++;});
      const leadsBy={};this.getLeads().forEach(l=>{const k=String(l.submittedAt).slice(0,10);leadsBy[k]=(leadsBy[k]||0)+1;});
      for(let i=179;i>=0;i--){const d=new Date(today.getFullYear(),today.getMonth(),today.getDate()-i),wk=[.82,1,.95,.97,1.04,1.22,1.18][d.getDay()],trend=1+(179-i)/420;
        const visitors=Math.round((118+rnd()*46)*wk*trend),r=realBy[dayKey(d)]||{views:0,searches:0,saves:0},k=[rnd(),rnd(),rnd(),rnd()];
        if(i<days*2)out.push({date:dayKey(d),visitors:visitors+(r.views?1:0),views:Math.round(visitors*(2.4+k[0]*.7))+r.views,searches:Math.round(visitors*(.55+k[1]*.2))+r.searches,saves:Math.round(visitors*(.06+k[2]*.04))+r.saves,leads:Math.round(visitors*(.012+k[3]*.012))+(leadsBy[dayKey(d)]||0)});}
      return out;},
    exportAll(){return {listings:listings.map(h=>({...h})),users:this.getUsers(),leads:this.getLeads(),savedSearches:this.getSavedSearches(),alerts:this.getAlerts(),favorites:this.getFavorites(),events:this.getEvents()};},
    resetDemoData(){try{Object.keys(localStorage).filter(k=>k.startsWith(KEY)).forEach(k=>localStorage.removeItem(k));}catch{}Object.keys(cache).forEach(k=>delete cache[k]);applyOverrides();}
  });
})();
