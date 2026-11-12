/**
 * SOS Realty Group / Janardhan Vangala.
 * Listing facts come from the mock Trestle feed in data-source.js.
 * Users, leads, favorites, searches, alerts, events, and assumable rows
 * come from the database. This file does not keep a browser copy of them.
 */
(function () {
  'use strict';
  const listings = [];
  const soldListings = [];
  function rebuild(){
    const all = (window.DataPorts && DataPorts.catalog) ? DataPorts.catalog() : [];
    listings.splice(0, listings.length, ...all.filter(h => h.status !== 'Sold'));
    soldListings.splice(0, soldListings.length, ...all.filter(h => h.status === 'Sold'));
  }
  rebuild();
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
  const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  const offline={ok:false,success:false,error:'The database is not connected.'};
  window.MockAPI={
    listings,communities,soldListings,testimonials,
    async getListings(filters={}){await pause(50);return listings.filter(h=>(!filters.category||filters.category==='all'||h.category.includes(filters.category))&&(!filters.city||h.city.toLowerCase().includes(filters.city.toLowerCase())));},
    async getListing(id){await pause(45);return listings.find(h=>h.id===Number(id))||null;},
    async getTestimonials(){return testimonials;},
    async saveInquiry(data){await pause(150);if(!remote.on)return offline;const row={...data,id:'L-'+Date.now(),submittedAt:new Date().toISOString(),status:'New',home:data.home||data.property||'—',sample:false};remote.leads=[row,...remote.leads];mutate('lead.add',row);return{success:true};},
    getFavorites(){return remote.on?remote.favorites:[];},
    toggleFavorite(id){const homeId=Number(id);if(!remote.on)return [];remote.favorites=remote.favorites.includes(homeId)?remote.favorites.filter(x=>x!==homeId):[...remote.favorites,homeId];mutate('favorite.toggle',{homeId});return remote.favorites;},
    async getAdvancedListings(filters={}){await pause(50);return listings.filter(h=>
      (!filters.city||h.city.toLowerCase().includes(String(filters.city).toLowerCase()))&&
      (!filters.keyword||(h.name+' '+h.city+' '+h.description).toLowerCase().includes(String(filters.keyword).toLowerCase()))&&
      (!filters.minPrice||h.price>=Number(filters.minPrice))&&(!filters.maxPrice||h.price<=Number(filters.maxPrice))&&
      (!filters.minBeds||h.beds>=Number(filters.minBeds))&&(!filters.minBaths||h.baths>=Number(filters.minBaths))&&
      (!filters.minSqft||h.sqft>=Number(filters.minSqft))&&(!filters.type||h.type===filters.type)&&
      (!filters.openOnly||Boolean(h.openHouse))&&(!filters.featuredOnly||h.featured)&&
      (!filters.newOnly||h.newListing)&&(!filters.assumableOnly||h.assumable)
    ).sort((a,b)=>filters.sort==='price-asc'?a.price-b.price:filters.sort==='price-desc'?b.price-a.price:a.id-b.id);},
    getSavedSearches(){return remote.on?remote.searches:[];},
    async saveSearch(data){if(!remote.on)return offline;const v={...data,id:'S-'+Date.now(),createdAt:new Date().toISOString()};remote.searches=[v,...remote.searches];const {id,createdAt,...rest}=v;mutate('search.save',{id,createdAt,data:rest});return v;},
    removeSavedSearch(id){if(!remote.on)return;remote.searches=remote.searches.filter(x=>String(x.id)!==String(id));mutate('search.remove',{id});},
    getAlerts(){return remote.on?remote.alerts:[];},
    async subscribeAlerts(data){if(!remote.on)return offline;const v={...data,id:'A-'+Date.now(),active:true,createdAt:new Date().toISOString()};remote.alerts=[v,...remote.alerts];const {id,active,createdAt,...rest}=v;mutate('alert.save',{id,createdAt,data:rest});return v;},
    toggleAlert(id){if(!remote.on)return [];remote.alerts.forEach(x=>{if(String(x.id)===String(id))x.active=!x.active});mutate('alert.toggle',{id});return remote.alerts;}
  };

  /* Accounts below only pre-fill the sign-in form. The user rows live in the database. */
  const DEMO_USERS=[
    {email:'admin@sosrealty.demo',password:'Admin@2026',role:'admin',name:'Janardhan Vangala'},
    {email:'buyer@sosrealty.demo',password:'Buyer@2026',role:'user',name:'Alex Morgan'}
  ];
  const LEAD_STATUSES=['New','Contacted','Touring','Under contract','Closed','Lost'];
  const homeById=id=>listings.find(h=>h.id===Number(id));
  const users=()=>remote.users||[];
  const publicUser=u=>u?(({password,...rest})=>rest)(u):null;
  const remote={on:false,users:null,leads:null,favorites:null,searches:null,alerts:null,events:null,session:null};
  const mutate=(action,payload)=>fetch('/api/mutate',{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify({action,payload})}).catch(()=>{});
  const dayKey=d=>d.toISOString().slice(0,10);
  Object.assign(window.MockAPI,{
    LEAD_STATUSES,DEMO_USERS,
    customFields(){return DataPorts.db.fields.list();},
    customCategories(){return DataPorts.db.categories.list();},
    createCategory(input){const res=DataPorts.db.categories.create(input);rebuild();return res;},
    createField(input){const res=DataPorts.db.fields.create(input);rebuild();return res;},
    currentUser(){return remote.on?remote.session:null;},
    async signIn(email,password){if(!remote.on)return offline;const res=await fetch('/api/auth/sign-in',{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify({email,password})});const data=await res.json();if(!data.ok)return data;remote.session=data.user;const state=await (await fetch('/api/state',{credentials:'include'})).json();remote.favorites=state.favorites;remote.searches=state.savedSearches;remote.alerts=state.alerts;this.track('sign-in',{role:data.user.role});return data;},
    async signUp({name,email,phone,password}){if(!remote.on)return offline;const res=await fetch('/api/auth/sign-up',{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify({name,email,phone,password})});const data=await res.json();if(!data.ok)return data;remote.users=[...remote.users,data.user];remote.session=data.user;this.track('sign-up',{});return data;},
    signOut(){if(!remote.on)return;remote.session=null;fetch('/api/auth/sign-out',{method:'POST',credentials:'include'}).then(()=>fetch('/api/state',{credentials:'include'}).then(r=>r.json())).then(state=>{remote.favorites=state.favorites;remote.searches=state.savedSearches;remote.alerts=state.alerts;});},
    getUsers(){return users().map(publicUser);},
    updateUser(id,patch){if(!remote.on)return;const all=users();const u=all.find(x=>x.id===Number(id));if(u)Object.assign(u,patch);remote.users=all;mutate('user.update',{id:Number(id),role:patch.role});},
    deleteUser(id){if(!remote.on)return;remote.users=users().filter(u=>u.id!==Number(id));mutate('user.delete',{id:Number(id)});},
    updateListing(id,patch){
      const h=homeById(id);if(!h)return;
      const key=h.listingKey,db=DataPorts.db;
      if(patch.assumable===false)db.assumable.remove(key);
      else {
        const row={};
        if(patch.assumableRate!=null&&patch.assumableRate!=='')row.interest_rate=patch.assumableRate;
        if(patch.loanBalance!=null&&patch.loanBalance!=='')row.remaining_balance=patch.loanBalance;
        if(patch.downPayment!=null&&patch.downPayment!=='')row.down_payment_required=patch.downPayment;
        if(patch.rentalRestrictions)row.rental_restrictions=patch.rentalRestrictions;
        if(patch.loanTermMonths!=null&&patch.loanTermMonths!=='')row.balance_loan_term=patch.loanTermMonths;
        if(patch.assumable===true||Object.keys(row).length)db.assumable.save(key,row);
      }
      if(patch.loanType!=null){const f=db.fields.list().find(x=>x.name==='Loan program');if(f)db.values.set(key,f.id,patch.loanType);}
      if(Array.isArray(patch.verified)){
        db.fields.list().filter(f=>f.category_id==='cat-verification').forEach(f=>db.values.set(key,f.id,patch.verified.includes(f.name)?'Yes':''));
      }
      if(patch.customValues)Object.entries(patch.customValues).forEach(([fieldId,value])=>db.values.set(key,fieldId,value));
      rebuild();
    },
    resetListing(id){const h=homeById(id);if(h)DataPorts.db.assumable.reset(h.listingKey);rebuild();},
    isEdited(id){const h=homeById(id);return h?DataPorts.db.assumable.isEdited(h.listingKey):false;},
    getLeads(){return remote.on?remote.leads:[];},
    setLeadStatus(id,status){if(!remote.on)return;remote.leads.forEach(l=>{if(String(l.id)===String(id))l.status=status});mutate('lead.status',{id,status});},
    track(type,data={}){if(!remote.on)return;const row={type,...data,at:new Date().toISOString()};remote.events.push(row);mutate('event.add',{type,data,at:row.at});},
    getEvents(){return remote.on?remote.events:[];},
    getAnalytics(days=30){const today=new Date(),out=[],real=this.getEvents(),realBy={},leadsBy={};
      real.forEach(e=>{const k=String(e.at).slice(0,10);const bucket=realBy[k]=realBy[k]||{views:0,searches:0,saves:0,visitors:0};if(e.type==='view'){bucket.views++;bucket.visitors++;}if(e.type==='search')bucket.searches++;if(e.type==='favorite')bucket.saves++;});
      this.getLeads().forEach(l=>{const k=String(l.submittedAt).slice(0,10);leadsBy[k]=(leadsBy[k]||0)+1;});
      for(let i=days*2-1;i>=0;i--){const d=new Date(today.getFullYear(),today.getMonth(),today.getDate()-i),k=dayKey(d),r=realBy[k]||{views:0,searches:0,saves:0,visitors:0};out.push({date:k,visitors:r.visitors,views:r.views,searches:r.searches,saves:r.saves,leads:leadsBy[k]||0});}
      return out;},
    exportAll(){const tables=DataPorts.db.tables();return {trestle_properties:DataPorts.catalog().map(h=>({listingKey:h.listingKey,reference:h.reference,name:h.name,city:h.city,price:h.price,beds:h.beds,baths:h.baths,sqft:h.sqft,status:h.status,address:h.address})),assumable_data:tables.assumable_data,custom_categories:tables.custom_categories,custom_fields:tables.custom_fields,custom_values:tables.custom_values,listings:[...listings,...soldListings].map(h=>({id:h.id,listingKey:h.listingKey,name:h.name,city:h.city,price:h.price,status:h.status,assumable:h.assumable,assumableRate:h.assumableRate,loanBalance:h.loanBalance,downPayment:h.downPayment,rentalRestrictions:h.rentalRestrictions,loanTermMonths:h.loanTermMonths,loanType:h.loanType})),users:this.getUsers(),leads:this.getLeads(),savedSearches:this.getSavedSearches(),alerts:this.getAlerts(),favorites:this.getFavorites(),events:this.getEvents()};},
    resetDemoData(){if(remote.on)fetch('/api/reset',{method:'POST',credentials:'include'}).then(()=>location.reload());}
  });
  DataPorts.ready.then(connected=>{
    if(!connected||!DataPorts.remoteState)return;
    const s=DataPorts.remoteState;
    remote.on=true;remote.users=s.users;remote.leads=s.leads;remote.favorites=s.favorites||[];remote.searches=s.savedSearches||[];remote.alerts=s.alerts||[];remote.events=s.events||[];remote.session=s.user||null;
    rebuild();
  });
})();
