/**
 * Replaceable data ports for SOS Realty Group.
 *
 * Two sources, on purpose:
 *   1. Trestle — listing facts (price, beds, photos, address, status).
 *      Swap fetchTrestleProperties, fetchTrestleMedia, and fetchTrestleOpenHouses
 *      for the live key. They already return Promises of RESO-shaped records.
 *      Do not copy those records into our database.
 *   2. Our database — Assumable Data, custom categories, fields, and values.
 *      Swap SiteDatabase for the Cloudflare Worker. Same method names.
 *      A home is assumable only when it has a row here, joined on listing_key.
 *
 * SAMPLE_PRESENTATION is demo labeling (concept names, tags). The adapter
 * falls back to the street address and the Media URLs when it is absent.
 */
(function () {
  'use strict';

  const DB_KEY = 'sos_janardhan_demo_db';

  // Compact sample rows. Expanded below into RESO Property resources.
  // [key, name, city, zip, price, beds, baths, sqft, subType, status, dom, garage, stories, hoa, views, subdivision, features, lat, lng, year, lot, tag, featured, fresh, tour, categories, closeDate]
  const ROWS = [
    ['GLVAR24001','The Desert Horizon','Las Vegas','89138',775000,4,3,2670,'Single Family Residence','Active',2,3,2,95,'Mountain','Summerlin West','Private Pool|Pool|Garage|Fireplace|Gated Community',36.1655,-115.3352,2009,0.12,'WARM DESERT MODERN',1,1,1,'family|modern',''],
    ['GLVAR24002','The Silver Palm','Las Vegas','89138',995000,4,4,3240,'Single Family Residence','Active',9,3,2,180,'Strip|Mountain','The Ridges','Private Pool|Pool|Garage|Gated Community|Golf Course|Primary Bedroom Downstairs',36.1421,-115.3068,2012,0.19,'DESIGN-LED LIVING',1,0,1,'luxury|modern',''],
    ['GLVAR24003','The Sunrise Courtyard','Las Vegas','89143',545000,3,2,1890,'Townhouse','Active',1,2,2,140,'','Centennial Hills','Garage|No Pool|Price Decrease',36.2793,-115.2705,2015,0.26,'LIVABLE LUXURY',0,1,0,'family',''],
    ['GLVAR24004','The Green Valley Residence','Henderson','89012',859000,4,3,2850,'Single Family Residence','Active',4,2,1,60,'Mountain','Green Valley Ranch','Garage|One Story|Pool|Primary Bedroom Downstairs|Fireplace',36.0213,-115.0846,2018,0.33,'OPEN SPACES',1,1,0,'family|modern',''],
    ['GLVAR24005','The Mountain View House','Henderson','89012',1395000,5,4,4250,'Single Family Residence','Active',21,4,2,250,'Strip|Mountain|City','MacDonald Highlands','Private Pool|Pool|Garage|Gated Community|Golf Course|Has Elevator|Has RV Parking',35.9952,-115.0108,2006,0.40,'MOUNTAIN BACKDROP',1,0,1,'luxury|family',''],
    ['GLVAR24006','The Quiet Retreat','Henderson','89052',645000,3,2,2040,'Condominium','Pending',3,1,1,310,'Mountain','Anthem','Age Restricted|One Story|Accessibility|No Pool',35.9655,-115.0902,2009,0.12,'EVERYDAY COMFORT',0,1,0,'family',''],
    ['GLVAR24007','The North Star','North Las Vegas','89084',499000,3,2,1820,'Single Family Residence','Active',6,2,1,45,'','Aliante','Garage|One Story|Has RV Parking|New Construction',36.2951,-115.1652,2012,0.19,'A PLACE TO GROW',0,1,0,'family',''],
    ['GLVAR24008','The Mesa Collection','North Las Vegas','89084',635000,4,3,2460,'Single Family Residence','Active',14,3,2,70,'Mountain','Valley Vista','Garage|Pool|Private Pool|Price Decrease',36.3052,-115.2051,2015,0.26,'MODERN FAMILY HOME',1,0,1,'modern|family',''],
    ['GLVAR24009','The Cielo House','North Las Vegas','89031',725000,4,3,2820,'Townhouse','Pending',2,2,2,120,'City','Eldorado','Garage|New Construction|Active Under Contract',36.2897,-115.1248,2018,0.33,'DESERT LIGHT',0,1,0,'modern',''],
    ['GLVAR24010','The Boulder Vista','Boulder City','89005',685000,3,2,2230,'Single Family Residence','Active',5,2,1,0,'Lake|Mountain','Old Town Boulder City','Garage|One Story|Fireplace|Basement|Horse Property',35.9771,-114.8352,2006,0.40,'HISTORIC CHARM',0,1,0,'family',''],
    ['GLVAR24011','The Lake Mead Retreat','Boulder City','89005',1125000,4,3,3170,'Single Family Residence','Active',30,3,2,0,'Lake|Mountain','Boulder Creek Golf','Private Pool|Pool|Garage|Golf Course|Has RV Parking',35.9583,-114.8601,2009,0.12,'LAKESIDE INSPIRATION',1,0,1,'luxury|modern',''],
    ['GLVAR24012','The Heritage House','Boulder City','89005',589000,3,2,1920,'Single Family Residence','Active',8,1,1,0,'Mountain','Historic District','One Story|No Pool|Distressed|Fireplace',35.9732,-114.8421,2012,0.19,'SMALL-TOWN SOUL',0,1,0,'family',''],
    ['GLVAR23101','The Valley View','Las Vegas','89145',659000,4,3,2600,'Single Family Residence','Closed',40,2,1,0,'','Summerlin','Garage',36.1836,-115.3093,2012,0.18,'SAMPLE PAST SALE',0,0,0,'family','2026-10-18'],
    ['GLVAR23102','The Parkside House','Henderson','89044',865000,4,3,2800,'Single Family Residence','Closed',61,2,1,0,'','Inspirada','Garage',35.9562,-115.1205,2012,0.18,'SAMPLE PAST SALE',0,0,0,'family','2026-09-27'],
    ['GLVAR23103','The Canyon Residence','Boulder City','89005',739000,3,2,2300,'Single Family Residence','Closed',89,2,1,0,'','Boulder Hills','Garage',35.9688,-114.8512,2012,0.18,'SAMPLE PAST SALE',0,0,0,'family','2026-08-30']
  ];
  const PHOTOS = ['assets/home-01.jpg','assets/home-03.jpg','assets/home-04.jpg','assets/home-02.jpg','assets/home-05.jpg','assets/home-06.jpg','assets/home-04.jpg','assets/home-01.jpg','assets/home-03.jpg','assets/home-06.jpg','assets/home-05.jpg','assets/home-02.jpg','assets/home-02.jpg','assets/home-04.jpg','assets/home-06.jpg'];
  const UI_IDS = {GLVAR24001:1,GLVAR24002:2,GLVAR24003:3,GLVAR24004:4,GLVAR24005:5,GLVAR24006:6,GLVAR24007:7,GLVAR24008:8,GLVAR24009:9,GLVAR24010:10,GLVAR24011:11,GLVAR24012:12,GLVAR23101:101,GLVAR23102:102,GLVAR23103:103};
  const OPEN = {
    GLVAR24001:['2026-11-14','11:00:00','13:00:00','Saturday · 11 AM–1 PM'],
    GLVAR24004:['2026-11-15','13:00:00','15:00:00','Sunday · 1–3 PM'],
    GLVAR24007:['2026-11-14','12:00:00','14:00:00','Saturday · 12–2 PM'],
    GLVAR24010:['2026-11-15','12:00:00','14:00:00','Sunday · 12–2 PM']
  };

  const split = s => String(s||'').split('|').filter(Boolean);
  const clone = v => JSON.parse(JSON.stringify(v));

  const PROPERTIES = ROWS.map((r,i) => ({
    ListingKey: r[0],
    ListingId: r[0].replace('GLVAR',''),
    StandardStatus: r[9],
    MlsStatus: r[9],
    PropertyType: 'Residential',
    PropertySubType: r[8],
    ListPrice: r[4],
    ClosePrice: r[9]==='Closed' ? r[4] : null,
    CloseDate: r[16] || null,
    BedroomsTotal: r[5],
    BathroomsTotalInteger: r[6],
    LivingArea: r[7],
    LotSizeAcres: r[20],
    YearBuilt: r[19],
    GarageSpaces: r[11],
    Stories: r[12],
    AssociationFee: r[13],
    AssociationFeeFrequency: 'Monthly',
    City: r[2],
    StateOrProvince: 'NV',
    PostalCode: r[3],
    UnparsedAddress: 'Illustrative location, '+r[2]+', NV '+r[3],
    SubdivisionName: r[15],
    Latitude: r[17],
    Longitude: r[18],
    PublicRemarks: 'A fictional concept residence designed to illustrate the '+r[2]+' property-search experience. Images, prices, features, and events are placeholders—not real properties or offers.',
    DaysOnMarket: r[10],
    ListingContractDate: '2026-11-01',
    ModificationTimestamp: '2026-11-11T18:00:00Z',
    OriginatingSystemName: 'GLVAR',
    ListOfficeName: 'SOS Realty Group LLC',
    ListAgentFullName: 'Janardhan Vangala',
    VirtualTourURLUnbranded: r[24] ? 'https://example.invalid/tour/'+r[0] : null,
    View: split(r[14]),
    PoolPrivateYN: split(r[16]).some(f => /pool/i.test(f) && f !== 'No Pool'),
    NewConstructionYN: split(r[16]).includes('New Construction'),
    SeniorCommunityYN: split(r[16]).includes('Age Restricted'),
    HighSchoolDistrict: 'Clark County School District',
    InteriorFeatures: split(r[16]),
    CountyOrParish: 'Clark'
  }));

  const MEDIA = ROWS.map((r,i) => ({
    MediaKey: 'M-'+r[0],
    ResourceRecordKey: r[0],
    MediaURL: PHOTOS[i],
    Order: 0,
    MediaCategory: 'Photo',
    MimeType: 'image/jpeg'
  }));

  const OPEN_HOUSES = Object.entries(OPEN).map(([key,o]) => ({
    OpenHouseKey: 'OH-'+key,
    ListingKey: key,
    OpenHouseDate: o[0],
    OpenHouseStartTime: o[1],
    OpenHouseEndTime: o[2],
    OpenHouseRemarks: o[3]
  }));

  const SAMPLE_PRESENTATION = Object.fromEntries(ROWS.map(r => [r[0], {
    name: r[1], tag: r[21], featured: !!r[22], newListing: !!r[23], category: split(r[25])
  }]));

  function typeLabel(sub){
    if (sub === 'Townhouse') return 'Townhome';
    if (sub === 'Condominium') return 'Condo';
    return 'House';
  }

  /** Live Trestle replaces these three functions. Same return shape. */
  async function fetchTrestleProperties(){ return clone(PROPERTIES); }
  async function fetchTrestleMedia(){ return clone(MEDIA); }
  async function fetchTrestleOpenHouses(){ return clone(OPEN_HOUSES); }

  const SEED_ASSUMABLE = [
    {unique_id:'AD-GLVAR24001',listing_key:'GLVAR24001',interest_rate:2.750,remaining_balance:598000,down_payment_required:177000,rental_restrictions:'Not known',balance_loan_term:312},
    {unique_id:'AD-GLVAR24002',listing_key:'GLVAR24002',interest_rate:2.875,remaining_balance:712000,down_payment_required:null,rental_restrictions:'No',balance_loan_term:300},
    {unique_id:'AD-GLVAR24004',listing_key:'GLVAR24004',interest_rate:3.125,remaining_balance:472000,down_payment_required:387000,rental_restrictions:'Yes',balance_loan_term:288},
    {unique_id:'AD-GLVAR24005',listing_key:'GLVAR24005',interest_rate:3.250,remaining_balance:905000,down_payment_required:null,rental_restrictions:'Not known',balance_loan_term:336},
    {unique_id:'AD-GLVAR24007',listing_key:'GLVAR24007',interest_rate:2.500,remaining_balance:402000,down_payment_required:97000,rental_restrictions:'No',balance_loan_term:324},
    {unique_id:'AD-GLVAR24008',listing_key:'GLVAR24008',interest_rate:2.990,remaining_balance:455000,down_payment_required:null,rental_restrictions:'Not known',balance_loan_term:312},
    {unique_id:'AD-GLVAR24010',listing_key:'GLVAR24010',interest_rate:2.625,remaining_balance:512000,down_payment_required:173000,rental_restrictions:'Yes',balance_loan_term:276},
    {unique_id:'AD-GLVAR24012',listing_key:'GLVAR24012',interest_rate:2.250,remaining_balance:468000,down_payment_required:null,rental_restrictions:'No',balance_loan_term:348}
  ];
  const SEED_CATEGORIES = [
    {id:'cat-verification',name:'Verification',icon:'check',badge:'Verified',note:'Shows on the public card when any field in this category is set.'}
  ];
  const SEED_FIELDS = [
    {id:'fld-loan-program',category_id:null,name:'Loan program',type:'text'},
    {id:'fld-loan-verified',category_id:'cat-verification',name:'Loan verified',type:'yes_no'},
    {id:'fld-servicer',category_id:'cat-verification',name:'Servicer confirmed',type:'yes_no'},
    {id:'fld-rate',category_id:'cat-verification',name:'Rate verified',type:'yes_no'},
    {id:'fld-balance',category_id:'cat-verification',name:'Balance verified',type:'yes_no'},
    {id:'fld-photos',category_id:'cat-verification',name:'Photos verified',type:'yes_no'}
  ];
  const yes = (key, field) => ({listing_key:key, field_id:field, value:'Yes'});
  const SEED_VALUES = [
    {listing_key:'GLVAR24001',field_id:'fld-loan-program',value:'VA'},
    {listing_key:'GLVAR24002',field_id:'fld-loan-program',value:'VA'},
    {listing_key:'GLVAR24004',field_id:'fld-loan-program',value:'FHA'},
    {listing_key:'GLVAR24005',field_id:'fld-loan-program',value:'VA'},
    {listing_key:'GLVAR24007',field_id:'fld-loan-program',value:'FHA'},
    {listing_key:'GLVAR24008',field_id:'fld-loan-program',value:'FHA'},
    {listing_key:'GLVAR24010',field_id:'fld-loan-program',value:'VA'},
    {listing_key:'GLVAR24012',field_id:'fld-loan-program',value:'VA'},
    yes('GLVAR24001','fld-loan-verified'), yes('GLVAR24001','fld-servicer'), yes('GLVAR24001','fld-photos'),
    yes('GLVAR24004','fld-loan-verified'), yes('GLVAR24004','fld-rate'),
    yes('GLVAR24007','fld-loan-verified'), yes('GLVAR24007','fld-servicer'), yes('GLVAR24007','fld-rate'), yes('GLVAR24007','fld-balance'),
    yes('GLVAR24012','fld-loan-verified')
  ];
  const SEED = {
    assumable_data: SEED_ASSUMABLE,
    custom_categories: SEED_CATEGORIES,
    custom_fields: SEED_FIELDS,
    custom_values: SEED_VALUES
  };

  function readDb(){
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (!raw) return clone(SEED);
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.assumable_data)) return clone(SEED);
      return parsed;
    } catch { return clone(SEED); }
  }
  function writeDb(db){
    try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch {}
  }

  const blankRow = key => ({
    unique_id: 'AD-'+key,
    listing_key: key,
    interest_rate: null,
    remaining_balance: null,
    down_payment_required: null,
    rental_restrictions: 'Not known',
    balance_loan_term: null
  });

  const SiteDatabase = {
    /** Full tables. The admin database screen reads this. */
    tables(){ return readDb(); },
    reset(){ try { localStorage.removeItem(DB_KEY); } catch {} },
    assumable: {
      list(){ return clone(readDb().assumable_data); },
      get(listingKey){ return clone(readDb().assumable_data.find(r => r.listing_key === listingKey) || null); },
      /** Writes only the keys you pass. Blank values are skipped, so other columns stay as they were. */
      save(listingKey, patch){
        const db = readDb();
        let row = db.assumable_data.find(r => r.listing_key === listingKey);
        if (!row) { row = blankRow(listingKey); db.assumable_data.push(row); }
        Object.entries(patch || {}).forEach(([k,v]) => {
          if (v === undefined || v === '' || v === null) return;
          if (k === 'interest_rate') row.interest_rate = Number(Number(v).toFixed(3));
          else if (k === 'remaining_balance' || k === 'down_payment_required' || k === 'balance_loan_term') row[k] = Number(v);
          else if (k === 'rental_restrictions') row.rental_restrictions = ['Yes','No','Not known'].includes(v) ? v : 'Not known';
        });
        if (!row.rental_restrictions) row.rental_restrictions = 'Not known';
        writeDb(db);
        return clone(row);
      },
      remove(listingKey){
        const db = readDb();
        db.assumable_data = db.assumable_data.filter(r => r.listing_key !== listingKey);
        writeDb(db);
      },
      reset(listingKey){
        const db = readDb();
        const seed = SEED.assumable_data.find(r => r.listing_key === listingKey) || null;
        db.assumable_data = db.assumable_data.filter(r => r.listing_key !== listingKey);
        if (seed) db.assumable_data.push(clone(seed));
        db.custom_values = db.custom_values.filter(v => v.listing_key !== listingKey);
        SEED.custom_values.filter(v => v.listing_key === listingKey).forEach(v => db.custom_values.push(clone(v)));
        writeDb(db);
      },
      isEdited(listingKey){
        const db = readDb();
        const row = db.assumable_data.find(r => r.listing_key === listingKey) || null;
        const seed = SEED.assumable_data.find(r => r.listing_key === listingKey) || null;
        const vals = db.custom_values.filter(v => v.listing_key === listingKey);
        const seedVals = SEED.custom_values.filter(v => v.listing_key === listingKey);
        return JSON.stringify(row) !== JSON.stringify(seed) || JSON.stringify(vals) !== JSON.stringify(seedVals);
      }
    },
    categories: {
      list(){ return clone(readDb().custom_categories); },
      create({name, icon, badge, note}){
        const label = String(name || '').trim();
        if (!label) return {ok:false, error:'A category needs a name.'};
        const db = readDb();
        const row = {id:'cat-'+Date.now(), name:label, icon:icon || '', badge:String(badge || '').trim(), note:String(note || '').trim()};
        db.custom_categories.push(row);
        writeDb(db);
        return {ok:true, row};
      }
    },
    fields: {
      list(){ return clone(readDb().custom_fields); },
      create({name, category_id, type}){
        const label = String(name || '').trim();
        if (!label) return {ok:false, error:'A field needs a name.'};
        const db = readDb();
        const kind = ['text','amount','yes_no'].includes(type) ? type : 'text';
        const row = {id:'fld-'+Date.now(), category_id: category_id || null, name:label, type:kind};
        db.custom_fields.push(row);
        writeDb(db);
        return {ok:true, row};
      }
    },
    values: {
      list(){ return clone(readDb().custom_values); },
      set(listingKey, fieldId, value){
        const db = readDb();
        db.custom_values = db.custom_values.filter(v => !(v.listing_key === listingKey && v.field_id === fieldId));
        if (value !== undefined && value !== null && String(value).trim() !== '') {
          db.custom_values.push({listing_key:listingKey, field_id:fieldId, value:String(value).trim()});
        }
        writeDb(db);
      }
    }
  };

  function join(properties, media, houses){
    const db = readDb();
    const byMedia = {};
    media.forEach(m => { (byMedia[m.ResourceRecordKey] = byMedia[m.ResourceRecordKey] || []).push(m); });
    const byOpen = {};
    houses.forEach(o => { byOpen[o.ListingKey] = o; });
    return properties.map(p => {
      const photos = (byMedia[p.ListingKey] || []).slice().sort((a,b) => a.Order - b.Order).map(m => m.MediaURL);
      const face = SAMPLE_PRESENTATION[p.ListingKey] || {};
      const row = db.assumable_data.find(r => r.listing_key === p.ListingKey) || null;
      const values = db.custom_values.filter(v => v.listing_key === p.ListingKey);
      const valueMap = {};
      values.forEach(v => { valueMap[v.field_id] = v.value; });
      const program = db.custom_fields.find(f => f.name === 'Loan program');
      const loanType = program ? (valueMap[program.id] || null) : null;
      const badges = db.custom_categories.filter(c => c.badge && db.custom_fields.some(f => f.category_id === c.id && valueMap[f.id])).map(c => ({
        icon: c.icon || 'check',
        label: c.badge,
        title: db.custom_fields.filter(f => f.category_id === c.id && valueMap[f.id]).map(f => f.name+': '+valueMap[f.id]).join(' · ')
      }));
      const open = byOpen[p.ListingKey];
      const status = p.StandardStatus === 'Closed' ? 'Sold' : p.StandardStatus;
      return {
        id: UI_IDS[p.ListingKey] || p.ListingKey,
        listingKey: p.ListingKey,
        name: face.name || p.UnparsedAddress,
        city: p.City,
        address: p.UnparsedAddress,
        price: status === 'Sold' ? (p.ClosePrice || p.ListPrice) : p.ListPrice,
        beds: p.BedroomsTotal,
        baths: p.BathroomsTotalInteger,
        sqft: p.LivingArea,
        category: face.category || ['family'],
        image: photos[0] || '',
        photos,
        tag: face.tag || p.PropertySubType,
        featured: !!face.featured,
        newListing: face.newListing != null ? !!face.newListing : p.DaysOnMarket <= 7,
        openHouse: open ? open.OpenHouseRemarks : null,
        description: p.PublicRemarks,
        type: typeLabel(p.PropertySubType),
        status,
        virtualTour: !!p.VirtualTourURLUnbranded,
        daysOnSite: p.DaysOnMarket,
        garage: p.GarageSpaces,
        stories: p.Stories,
        hoa: p.AssociationFee || 0,
        views: p.View || [],
        subdivision: p.SubdivisionName,
        features: p.InteriorFeatures || [],
        school: p.HighSchoolDistrict,
        year: p.YearBuilt,
        lot: p.LotSizeAcres,
        reference: p.ListingId,
        latlng: [p.Latitude, p.Longitude],
        coords: [23 + ((UI_IDS[p.ListingKey] || 1) * 11) % 65, 25 + ((UI_IDS[p.ListingKey] || 1) * 13) % 56],
        soldDate: p.CloseDate || '',
        assumable: !!row,
        assumableRate: row && row.interest_rate != null ? row.interest_rate : null,
        loanBalance: row && row.remaining_balance != null ? row.remaining_balance : null,
        downPayment: row ? row.down_payment_required : null,
        rentalRestrictions: row ? (row.rental_restrictions || 'Not known') : null,
        loanTermMonths: row && row.balance_loan_term != null ? row.balance_loan_term : null,
        yearsLeft: row && row.balance_loan_term != null ? row.balance_loan_term / 12 : null,
        loanType,
        badges,
        verified: db.custom_fields.filter(f => f.category_id === 'cat-verification' && valueMap[f.id] === 'Yes').map(f => f.name),
        customValues: valueMap
      };
    });
  }

  function catalog(){
    return join(PROPERTIES, MEDIA, OPEN_HOUSES);
  }

  async function loadCatalog(){
    const [properties, media, houses] = await Promise.all([
      fetchTrestleProperties(),
      fetchTrestleMedia(),
      fetchTrestleOpenHouses()
    ]);
    return join(properties, media, houses);
  }

  window.DataPorts = {
    mode: 'mock',
    fetchTrestleProperties,
    fetchTrestleMedia,
    fetchTrestleOpenHouses,
    db: SiteDatabase,
    catalog,
    loadCatalog
  };
})();
