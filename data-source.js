/**
 * Replaceable data ports for SOS Realty Group.
 *
 * Two sources, on purpose:
 *   1. Trestle — listing facts (price, beds, photos, address, status).
 *      Swap fetchTrestleProperties, fetchTrestleMembers, fetchTrestleMedia, and
 *      fetchTrestleOpenHouses for the live key. Mock Property and Member records
 *      carry every RESO Data Dictionary 2.0 field (see PROPERTY_SCHEMA / MEMBER_SCHEMA). They already return Promises of RESO-shaped records.
 *      Do not copy those records into our database.
 *   2. Our database — Assumable Data, custom categories, fields, and values.
 *      Loaded from the Worker. Nothing here is stored in the browser.
 *      A home is assumable only when it has a row here, joined on listing_key.
 *
 * SAMPLE_PRESENTATION is part of the mock Trestle feed (concept names, tags).
 * The adapter falls back to the street address and the Media URLs when it is absent.
 */
(function () {
  'use strict';

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

  const BASE_PROPERTIES = ROWS.map((r,i) => ({
    ListingKey: r[0],
    ListingId: r[0].replace('GLVAR',''),
    StandardStatus: r[9],
    MlsStatus: r[9],
    PropertyType: 'Residential',
    PropertySubType: r[8],
    ListPrice: r[4],
    ClosePrice: r[9]==='Closed' ? r[4] : null,
    CloseDate: r[26] || null,
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

  /* ------------------------------------------------------------------
   * Mock Trestle schema: every RESO Data Dictionary 2.0 field for the
   * Property and Member resources. Format is Name:Type, where
   *   S = String, SLS = single pick list, SLM = multi pick list,
   *   N = Number, B = Boolean, D = Date, T = Timestamp,
   *   R = expandable resource, C = expandable collection.
   * R and C fields are navigation properties. Like Trestle's OData API,
   * they only appear on a record when they are asked for with
   * options.expand, e.g. fetchTrestleProperties({ expand: ['ListAgent','Media'] }).
   * Your MLS (GLVAR) may add local fields or leave some of these out:
   * compare against Trestle's $metadata once the key is connected.
   * ------------------------------------------------------------------ */
  const PROPERTY_SCHEMA =
    'BusinessName:S BusinessType:SLM HoursDaysOfOperation:SLM HoursDaysOfOperationDescription:S '+
    'LaborInformation:SLM LeaseAmount:N LeaseAmountFrequency:SLS LeaseAssignableYN:B LeaseExpiration:D '+
    'LeaseRenewalOptionYN:B NumberOfFullTimeEmployees:N NumberOfPartTimeEmployees:N OwnershipType:SLS '+
    'SeatingCapacity:N SpecialLicenses:SLM YearEstablished:N YearsCurrentOwner:N AnchorsCoTenants:S '+
    'AvailableLeaseType:SLM CommunityFeatures:SLM CurrentUse:SLM DevelopmentStatus:SLM Fencing:SLM FrontageLength:S '+
    'FrontageType:SLM Furnished:SLS HorseAmenities:SLM HorseYN:B LandLeaseAmount:N LandLeaseAmountFrequency:SLS '+
    'LandLeaseExpirationDate:D LandLeaseYN:B LaundryFeatures:SLM LeaseTerm:SLS LotDimensionsSource:SLS '+
    'LotFeatures:SLM LotSizeAcres:N LotSizeArea:N LotSizeDimensions:S LotSizeSource:SLS LotSizeSquareFeet:N '+
    'LotSizeUnits:SLS MobileHomeRemainsYN:B NumberOfBuildings:N NumberOfLots:N NumberOfPads:N '+
    'NumberOfUnitsInCommunity:N NumberOfUnitsTotal:N ParkManagerName:S ParkManagerPhone:S ParkName:S '+
    'PetsAllowed:SLM PoolFeatures:SLM PoolPrivateYN:B PossibleUse:SLM RoadFrontageType:SLM RoadResponsibility:SLM '+
    'RoadSurfaceType:SLM SeniorCommunityYN:B SpaFeatures:SLM SpaYN:B Topography:S UnitsFurnished:SLS View:SLM '+
    'ViewYN:B WaterBodyName:S WaterfrontFeatures:SLM WaterfrontYN:B Appliances:SLM OtherEquipment:SLM '+
    'SecurityFeatures:SLM CropsIncludedYN:B CultivatedArea:N FarmCreditServiceInclYN:B FarmLandAreaSource:SLS '+
    'FarmLandAreaUnits:SLS GrazingPermitsBlmYN:B GrazingPermitsForestServiceYN:B GrazingPermitsPrivateYN:B '+
    'PastureArea:N RangeArea:N Vegetation:SLM WoodedArea:N CableTvExpense:N CapRate:N ElectricExpense:N '+
    'ExistingLeaseType:SLM FinancialDataSource:SLM FuelExpense:N FurnitureReplacementExpense:N GardenerExpense:N '+
    'GrossIncome:N GrossScheduledIncome:N IncomeIncludes:SLM InsuranceExpense:N LicensesExpense:N '+
    'MaintenanceExpense:N ManagerExpense:N NetOperatingIncome:N NewTaxesExpense:N NumberOfUnitsLeased:N '+
    'NumberOfUnitsMoMo:N NumberOfUnitsVacant:N OperatingExpense:N OperatingExpenseIncludes:SLM OtherExpense:N '+
    'OwnerPays:SLM PestControlExpense:N PoolExpense:N ProfessionalManagementExpense:N RentControlYN:B '+
    'RentIncludes:SLM SuppliesExpense:N TenantPays:SLM TotalActualRent:N TrashExpense:N VacancyAllowance:N '+
    'VacancyAllowanceRate:N WaterSewerExpense:N WorkmansCompensationExpense:N AssociationAmenities:SLM '+
    'AssociationFee:N AssociationFee2:N AssociationFee2Frequency:SLS AssociationFeeFrequency:SLS '+
    'AssociationFeeIncludes:SLM AssociationName:S AssociationName2:S AssociationPhone:S AssociationPhone2:S '+
    'AssociationYN:B CompSaleYN:B CopyrightNotice:S Disclaimer:S HistoryTransactional:C HomeWarrantyYN:B '+
    'LeaseConsideredYN:B ListAOR:SLS ListingAgreement:SLS ListingId:S ListingKey:S ListingService:SLS ListingURL:S '+
    'ListingURLDescription:SLS MlsStatus:SLS OpenHouseModificationTimestamp:T OpenHouses:C OriginatingSystem:R '+
    'OriginatingSystemID:S OriginatingSystemKey:S OriginatingSystemName:S SocialMedia:C SourceSystem:R '+
    'SourceSystemID:S SourceSystemKey:S SourceSystemName:S StandardStatus:SLS BuyerAgent:R BuyerAgentAOR:SLS '+
    'BuyerAgentDesignation:SLM BuyerAgentDirectPhone:S BuyerAgentEmail:S BuyerAgentFax:S BuyerAgentFirstName:S '+
    'BuyerAgentFullName:S BuyerAgentHomePhone:S BuyerAgentKey:S BuyerAgentLastName:S BuyerAgentMiddleName:S '+
    'BuyerAgentMlsId:S BuyerAgentMobilePhone:S BuyerAgentNamePrefix:S BuyerAgentNameSuffix:S '+
    'BuyerAgentNationalAssociationId:S BuyerAgentOfficePhone:S BuyerAgentOfficePhoneExt:S BuyerAgentPager:S '+
    'BuyerAgentPreferredPhone:S BuyerAgentPreferredPhoneExt:S BuyerAgentStateLicense:S BuyerAgentTollFreePhone:S '+
    'BuyerAgentURL:S BuyerAgentVoiceMail:S BuyerAgentVoiceMailExt:S BuyerOffice:R BuyerOfficeAOR:SLS '+
    'BuyerOfficeEmail:S BuyerOfficeFax:S BuyerOfficeKey:S BuyerOfficeMlsId:S BuyerOfficeName:S '+
    'BuyerOfficeNationalAssociationId:S BuyerOfficePhone:S BuyerOfficePhoneExt:S BuyerOfficeURL:S BuyerTeam:R '+
    'CoBuyerAgent:R CoBuyerAgentAOR:SLS CoBuyerAgentDesignation:SLM CoBuyerAgentDirectPhone:S CoBuyerAgentEmail:S '+
    'CoBuyerAgentFax:S CoBuyerAgentFirstName:S CoBuyerAgentFullName:S CoBuyerAgentHomePhone:S CoBuyerAgentKey:S '+
    'CoBuyerAgentLastName:S CoBuyerAgentMiddleName:S CoBuyerAgentMlsId:S CoBuyerAgentMobilePhone:S '+
    'CoBuyerAgentNamePrefix:S CoBuyerAgentNameSuffix:S CoBuyerAgentNationalAssociationId:S '+
    'CoBuyerAgentOfficePhone:S CoBuyerAgentOfficePhoneExt:S CoBuyerAgentPager:S CoBuyerAgentPreferredPhone:S '+
    'CoBuyerAgentPreferredPhoneExt:S CoBuyerAgentStateLicense:S CoBuyerAgentTollFreePhone:S CoBuyerAgentURL:S '+
    'CoBuyerAgentVoiceMail:S CoBuyerAgentVoiceMailExt:S CoBuyerOffice:R CoBuyerOfficeAOR:SLS CoBuyerOfficeEmail:S '+
    'CoBuyerOfficeFax:S CoBuyerOfficeKey:S CoBuyerOfficeMlsId:S CoBuyerOfficeName:S '+
    'CoBuyerOfficeNationalAssociationId:S CoBuyerOfficePhone:S CoBuyerOfficePhoneExt:S CoBuyerOfficeURL:S '+
    'CoListAgent:R CoListAgentAOR:SLS CoListAgentDesignation:SLM CoListAgentDirectPhone:S CoListAgentEmail:S '+
    'CoListAgentFax:S CoListAgentFirstName:S CoListAgentFullName:S CoListAgentHomePhone:S CoListAgentKey:S '+
    'CoListAgentLastName:S CoListAgentMiddleName:S CoListAgentMlsId:S CoListAgentMobilePhone:S '+
    'CoListAgentNamePrefix:S CoListAgentNameSuffix:S CoListAgentNationalAssociationId:S CoListAgentOfficePhone:S '+
    'CoListAgentOfficePhoneExt:S CoListAgentPager:S CoListAgentPreferredPhone:S CoListAgentPreferredPhoneExt:S '+
    'CoListAgentStateLicense:S CoListAgentTollFreePhone:S CoListAgentURL:S CoListAgentVoiceMail:S '+
    'CoListAgentVoiceMailExt:S CoListOffice:R CoListOfficeAOR:SLS CoListOfficeEmail:S CoListOfficeFax:S '+
    'CoListOfficeKey:S CoListOfficeMlsId:S CoListOfficeName:S CoListOfficeNationalAssociationId:S '+
    'CoListOfficePhone:S CoListOfficePhoneExt:S CoListOfficeURL:S ListAgent:R ListAgentAOR:SLS '+
    'ListAgentDesignation:SLM ListAgentDirectPhone:S ListAgentEmail:S ListAgentFax:S ListAgentFirstName:S '+
    'ListAgentFullName:S ListAgentHomePhone:S ListAgentKey:S ListAgentLastName:S ListAgentMiddleName:S '+
    'ListAgentMlsId:S ListAgentMobilePhone:S ListAgentNamePrefix:S ListAgentNameSuffix:S '+
    'ListAgentNationalAssociationId:S ListAgentOfficePhone:S ListAgentOfficePhoneExt:S ListAgentPager:S '+
    'ListAgentPreferredPhone:S ListAgentPreferredPhoneExt:S ListAgentStateLicense:S ListAgentTollFreePhone:S '+
    'ListAgentURL:S ListAgentVoiceMail:S ListAgentVoiceMailExt:S AttributionContact:S ListOffice:R '+
    'ListOfficeAOR:SLS ListOfficeEmail:S ListOfficeFax:S ListOfficeKey:S ListOfficeMlsId:S ListOfficeName:S '+
    'ListOfficeNationalAssociationId:S ListOfficePhone:S ListOfficePhoneExt:S ListOfficeURL:S ListTeam:R '+
    'BuyerTeamKey:S BuyerTeamName:S ListTeamKey:S ListTeamName:S AvailabilityDate:D BuyerFinancing:SLM '+
    'Concessions:SLS ConcessionsAmount:N ConcessionsComments:S Contingency:S FhaEligibility:SLS Possession:SLM '+
    'BuyerBrokerageCompensation:S BuyerBrokerageCompensationType:SLS CompensationComments:S '+
    'DualOrVariableRateCommissionYN:B LeaseRenewalCompensation:SLM SubAgencyCompensation:S '+
    'SubAgencyCompensationType:SLS TransactionBrokerCompensation:S TransactionBrokerCompensationType:SLS '+
    'CommonInterest:SLS CurrentFinancing:SLM Disclosures:SLM Exclusions:S Inclusions:S ListingTerms:SLM Ownership:S '+
    'SpecialListingConditions:SLM ActivationDate:D BackOnMarketDate:D CancellationDate:D CloseDate:D '+
    'ContingentDate:D ContractStatusChangeDate:D CumulativeDaysOnMarket:N DaysInMls:N DaysOnMarket:N DaysOnSite:N '+
    'ExpirationDate:D ListingContractDate:D MajorChangeTimestamp:T MajorChangeType:SLS ModificationTimestamp:T '+
    'OffMarketDate:D OffMarketTimestamp:T OnMarketDate:D OnMarketTimestamp:T OriginalEntryTimestamp:T '+
    'PendingTimestamp:T PriceChangeTimestamp:T PropertyTimeZoneName:SLS PropertyTimeZoneObservesDstYN:B '+
    'PropertyTimeZoneStandardOffset:N PurchaseContractDate:D SimpleDaysOnMarket:N StatusChangeTimestamp:T '+
    'WithdrawnDate:D InternetAddressDisplayYN:B InternetAutomatedValuationDisplayYN:B InternetConsumerCommentYN:B '+
    'InternetEntireListingDisplayYN:B SignOnPropertyYN:B SyndicateTo:SLM VirtualTourURLBranded:S '+
    'VirtualTourURLUnbranded:S DocumentStatus:SLS DocumentsAvailable:SLM DocumentsChangeTimestamp:T '+
    'DocumentsCount:N Media:C PhotosChangeTimestamp:T PhotosCount:N VideosChangeTimestamp:T VideosCount:N '+
    'ClosePrice:N ListPrice:N ListPriceLow:N OriginalListPrice:N PreviousListPrice:N PrivateOfficeRemarks:S '+
    'PrivateRemarks:S PublicRemarks:S SyndicationRemarks:S AccessCode:S LockBoxLocation:S LockBoxSerialNumber:S '+
    'LockBoxType:SLM ShowingAdvanceNotice:N ShowingAttendedYN:B ShowingConsiderations:SLM ShowingContactName:S '+
    'ShowingContactPhone:S ShowingContactPhoneExt:S ShowingContactType:SLM ShowingDays:SLM ShowingEndTime:T '+
    'ShowingInstructions:S ShowingRequirements:SLM ShowingServiceName:SLS ShowingStartTime:T '+
    'DistanceToBusComments:S DistanceToBusNumeric:N DistanceToBusUnits:SLS DistanceToFreewayComments:S '+
    'DistanceToFreewayNumeric:N DistanceToFreewayUnits:SLS DistanceToPlaceofWorshipComments:S '+
    'DistanceToPlaceofWorshipNumeric:N DistanceToPlaceofWorshipUnits:SLS DistanceToSchoolBusComments:S '+
    'DistanceToSchoolBusNumeric:N DistanceToSchoolBusUnits:SLS DistanceToSchoolsComments:S '+
    'DistanceToSchoolsNumeric:N DistanceToSchoolsUnits:SLS DistanceToShoppingComments:S DistanceToShoppingNumeric:N '+
    'DistanceToShoppingUnits:SLS DistanceToStreetComments:S DistanceToStreetNumeric:N DistanceToStreetUnits:SLS '+
    'CarrierRoute:S City:SLS Country:SLS CountyOrParish:SLS PostalCity:SLS PostalCode:S PostalCodePlus4:S '+
    'StateOrProvince:SLS StreetAdditionalInfo:S StreetDirPrefix:SLS StreetDirSuffix:SLS StreetName:S StreetNumber:S '+
    'StreetNumberNumeric:N StreetSuffix:SLS StreetSuffixModifier:S Township:S UnitNumber:S UnparsedAddress:S '+
    'CityRegion:S ContinentRegion:S CountryRegion:S MLSAreaMajor:SLS MLSAreaMinor:SLS StateRegion:S '+
    'SubdivisionName:S CrossStreet:S Directions:S Elevation:N ElevationUnits:SLS Latitude:N Longitude:N '+
    'MapCoordinate:S MapCoordinateSource:S MapURL:S ElementarySchool:SLS ElementarySchoolDistrict:SLS '+
    'HighSchool:SLS HighSchoolDistrict:SLS MiddleOrJuniorSchool:SLS MiddleOrJuniorSchoolDistrict:SLS OccupantName:S '+
    'OccupantPhone:S OccupantType:SLS OwnerName:S OwnerPhone:S AboveGradeFinishedArea:N '+
    'AboveGradeFinishedAreaSource:SLS AboveGradeFinishedAreaUnits:SLS AboveGradeUnfinishedArea:N '+
    'AboveGradeUnfinishedAreaSource:SLS AboveGradeUnfinishedAreaUnits:SLS AccessibilityFeatures:SLM '+
    'ArchitecturalStyle:SLM AttachedGarageYN:B Basement:SLM BasementYN:B BathroomsFull:N BathroomsHalf:N '+
    'BathroomsOneQuarter:N BathroomsPartial:N BathroomsThreeQuarter:N BathroomsTotalInteger:N BedroomsPossible:N '+
    'BedroomsTotal:N BelowGradeFinishedArea:N BelowGradeFinishedAreaSource:SLS BelowGradeFinishedAreaUnits:SLS '+
    'BelowGradeUnfinishedArea:N BelowGradeUnfinishedAreaSource:SLS BelowGradeUnfinishedAreaUnits:SLS BodyType:SLM '+
    'BuilderModel:S BuilderName:S BuildingAreaSource:SLS BuildingAreaTotal:N BuildingAreaUnits:SLS '+
    'BuildingFeatures:SLM BuildingName:S CarportSpaces:N CarportYN:B CommonWalls:SLM ConstructionMaterials:SLM '+
    'Cooling:SLM CoolingYN:B CoveredSpaces:N DOH1:S DOH2:S DOH3:S DirectionFaces:SLS DoorFeatures:SLM EntryLevel:N '+
    'EntryLocation:S ExteriorFeatures:SLM FireplaceFeatures:SLM FireplaceYN:B FireplacesTotal:N Flooring:SLM '+
    'FoundationArea:N FoundationDetails:SLM GarageSpaces:N GarageYN:B GrossLivingAreaAnsi:N HabitableResidenceYN:B '+
    'Heating:SLM HeatingYN:B InteriorFeatures:SLM LeasableArea:N LeasableAreaUnits:SLS Levels:SLM License1:S '+
    'License2:S License3:S LivingArea:N LivingAreaSource:SLS LivingAreaUnits:SLS MainLevelBathrooms:N '+
    'MainLevelBedrooms:N Make:S MobileDimUnits:SLS MobileLength:N MobileWidth:N Model:S NewConstructionYN:B '+
    'OpenParkingSpaces:N OpenParkingYN:B OtherParking:S OtherStructures:SLM ParkingFeatures:SLM ParkingTotal:N '+
    'PatioAndPorchFeatures:SLM PropertyAttachedYN:B PropertyCondition:SLM RVParkingDimensions:S Roof:SLM SerialU:S '+
    'SerialX:S SerialXX:S Skirt:SLM Stories:N StoriesTotal:N StructureType:SLM WindowFeatures:SLM YearBuilt:N '+
    'YearBuiltDetails:S YearBuiltEffective:N YearBuiltSource:SLS GreenEnergyEfficient:SLM GreenEnergyGeneration:SLM '+
    'GreenIndoorAirQuality:SLM GreenLocation:SLM GreenSustainability:SLM GreenWaterConservation:SLM WalkScore:N '+
    'GreenBuildingVerificationType:SLM GreenBuildingVerifications:C GreenVerificationYN:B RoomType:SLM Rooms:C '+
    'RoomsTotal:N AdditionalParcelsDescription:S AdditionalParcelsYN:B ParcelNumber:S PublicSurveyRange:S '+
    'PublicSurveySection:S PublicSurveyTownship:S TaxAnnualAmount:N TaxAnnualAmountPerLivingAreaUnit:N '+
    'TaxAnnualAmountPerSquareFoot:N TaxAssessedValue:N TaxBlock:S TaxBookNumber:S TaxLegalDescription:S TaxLot:S '+
    'TaxMapNumber:S TaxOtherAnnualAssessmentAmount:N TaxParcelLetter:S TaxStatusCurrent:SLM TaxTract:S TaxYear:N '+
    'Zoning:S ZoningDescription:S UnitTypeType:SLM UnitTypes:C DistanceToElectricComments:S '+
    'DistanceToElectricNumeric:N DistanceToElectricUnits:SLS DistanceToGasComments:S DistanceToGasNumeric:N '+
    'DistanceToGasUnits:SLS DistanceToPhoneServiceComments:S DistanceToPhoneServiceNumeric:N '+
    'DistanceToPhoneServiceUnits:SLS DistanceToSewerComments:S DistanceToSewerNumeric:N DistanceToSewerUnits:SLS '+
    'DistanceToWaterComments:S DistanceToWaterNumeric:N DistanceToWaterUnits:SLS Electric:SLM '+
    'ElectricOnPropertyYN:B IrrigationSource:SLM IrrigationWaterRightsAcres:N IrrigationWaterRightsYN:B '+
    'NumberOfSeparateElectricMeters:N NumberOfSeparateGasMeters:N NumberOfSeparateWaterMeters:N PowerProduction:C '+
    'PowerProductionType:SLM PowerProductionYN:B Sewer:SLM Utilities:SLM WaterSource:SLM PropertySubType:SLS '+
    'PropertyType:SLS UniversalPropertyId:S UniversalPropertySubId:S';

  const MEMBER_SCHEMA =
    'HistoryTransactional:C JobTitle:S LastLoginTimestamp:T Media:C MemberAOR:SLS MemberAORMlsId:S MemberAORkey:S '+
    'MemberAddress1:S MemberAddress2:S MemberAlternateId:S MemberAssociationComments:S MemberBillingPreference:SLS '+
    'MemberBio:S MemberCarrierRoute:S MemberCity:S MemberCommitteeCount:N MemberCountry:SLS '+
    'MemberCountyOrParish:SLS MemberDesignation:SLM MemberDirectPhone:S MemberEmail:S MemberFax:S MemberFirstName:S '+
    'MemberFullName:S MemberHomePhone:S MemberIsAssistantTo:S MemberKey:S MemberLanguages:SLM MemberLastName:S '+
    'MemberLoginId:S MemberMailOptOutYN:B MemberMiddleName:S MemberMlsAccessYN:B MemberMlsId:S '+
    'MemberMlsSecurityClass:SLS MemberMobilePhone:S MemberNamePrefix:S MemberNameSuffix:S '+
    'MemberNationalAssociationEntryDate:D MemberNationalAssociationId:S MemberNickname:S MemberOfficePhone:S '+
    'MemberOfficePhoneExt:S MemberOtherPhoneType:SLS MemberOtherPhones:C MemberPager:S MemberPassword:S '+
    'MemberPhoneTTYTDD:S MemberPostalCode:S MemberPostalCodePlus4:S MemberPreferredMail:SLS '+
    'MemberPreferredMedia:SLS MemberPreferredPhone:S MemberPreferredPhoneExt:S MemberPreferredPublication:SLS '+
    'MemberPrimaryAorId:S MemberSocialMedia:C MemberStateLicense:S MemberStateLicenseExpirationDate:D '+
    'MemberStateLicenseState:SLS MemberStateLicenseType:S MemberStateOrProvince:SLS MemberStatus:SLS '+
    'MemberTollFreePhone:S MemberTransferDate:D MemberType:SLS MemberVoiceMail:S MemberVoiceMailExt:S '+
    'MemberVotingPrecinct:S ModificationTimestamp:T Office:R OfficeKey:S OfficeMlsId:S OfficeName:S '+
    'OfficeNationalAssociationId:S OriginalEntryTimestamp:T OriginatingSystem:R OriginatingSystemID:S '+
    'OriginatingSystemMemberKey:S OriginatingSystemName:S SocialMediaType:SLS SourceSystem:R SourceSystemID:S '+
    'SourceSystemMemberKey:S SourceSystemName:S SyndicateTo:SLM UniqueLicenseeIdentifier:S';

  const parseSchema = s => s.trim().split(/\s+/).map(t => { const [name, type] = t.split(':'); return { name, type }; });
  const TRESTLE_PROPERTY_FIELDS = parseSchema(PROPERTY_SCHEMA);
  const TRESTLE_MEMBER_FIELDS = parseSchema(MEMBER_SCHEMA);
  const isNav = f => f.type === 'R' || f.type === 'C';

  /* Fill every field, even ones that do not apply to a home (business,
     farm, income and mobile-home fields). Set to false to leave fields
     that do not apply as null, which is closer to a real feed. */
  const MOCK_FILL_ALL = true;

  /* Sample pick-list values. Anything not listed falls back to 'Other'.
     Multi pick lists come back as comma-separated strings, as Trestle
     returns them. (View and InteriorFeatures stay arrays because the
     site already reads them that way.) */
  const LOOKUPS = {
    Appliances: 'Dishwasher,Disposal,Microwave,Refrigerator', Cooling: 'Central Air,Electric',
    Heating: 'Central,Gas', Flooring: 'Carpet,Tile', Roof: 'Tile', ConstructionMaterials: 'Frame,Stucco',
    ArchitecturalStyle: 'Two Story', ParkingFeatures: 'Attached,Garage,Garage Door Opener',
    LaundryFeatures: 'Inside,Laundry Room', PatioAndPorchFeatures: 'Covered,Patio', Fencing: 'Block',
    LotFeatures: 'Desert Landscaping,Landscaped', CommunityFeatures: 'Gated,Park', SecurityFeatures: 'Security System Owned',
    WindowFeatures: 'Double Pane Windows', DoorFeatures: 'Sliding Doors', ExteriorFeatures: 'Private Yard',
    Utilities: 'Cable Available,Electricity Connected,Natural Gas Connected', Sewer: 'Public Sewer', WaterSource: 'Public',
    Electric: '220 Volts', Levels: 'Two', StructureType: 'House', CommonWalls: 'No Common Walls',
    PropertyCondition: 'Resale', FoundationDetails: 'Slab', AssociationFeeIncludes: 'Common Area Maintenance',
    AssociationAmenities: 'Clubhouse,Pool', AssociationFeeFrequency: 'Monthly', AssociationFee2Frequency: 'Annually',
    BuyerFinancing: 'Cash,Conventional,FHA,VA', ListingTerms: 'Cash,Conventional,FHA,VA Loan',
    CurrentFinancing: 'Conventional', Disclosures: 'Seller Disclosure', SpecialListingConditions: 'Standard',
    Possession: 'Close Of Escrow', ListingAgreement: 'Exclusive Right To Sell', ListingService: 'Full Service',
    LockBoxType: 'Electronic', ShowingRequirements: 'Appointment Only', ShowingContactType: 'Agent',
    ShowingDays: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday', ShowingConsiderations: 'None',
    SyndicateTo: 'Homes.com,Realtor.com,Zillow/Trulia', PetsAllowed: 'Yes', Furnished: 'Unfurnished',
    UnitsFurnished: 'None', LotSizeUnits: 'Acres', LotSizeSource: 'Assessor', LotDimensionsSource: 'Assessor',
    LivingAreaUnits: 'Square Feet', LivingAreaSource: 'Assessor', BuildingAreaUnits: 'Square Feet',
    BuildingAreaSource: 'Assessor', LeasableAreaUnits: 'Square Feet', ElevationUnits: 'Feet', MobileDimUnits: 'Feet',
    YearBuiltSource: 'Assessor', DirectionFaces: 'North', PropertyTimeZoneName: 'America/Los_Angeles',
    Country: 'US', CountryRegion: 'United States', ContinentRegion: 'North America', CountyOrParish: 'Clark',
    StateOrProvince: 'NV', StateRegion: 'Southern Nevada', ListAOR: 'Las Vegas REALTORS',
    TaxStatusCurrent: 'Current', OccupantType: 'Owner', OwnershipType: 'Private',
    Concessions: 'No', FhaEligibility: 'Yes', CommonInterest: 'Planned Development', MajorChangeType: 'New Listing',
    DocumentStatus: 'Available', DocumentsAvailable: 'Disclosures', ListingURLDescription: 'Listing Website',
    BuyerBrokerageCompensationType: '%', SubAgencyCompensationType: '%', TransactionBrokerCompensationType: '%',
    MemberAOR: 'Las Vegas REALTORS', MemberCountry: 'US', MemberCountyOrParish: 'Clark', MemberStateOrProvince: 'NV',
    MemberStateLicenseState: 'NV', MemberStatus: 'Active', MemberType: 'MLS Member', MemberLanguages: 'English',
    MemberMlsSecurityClass: 'Agent', MemberPreferredMail: 'Email', MemberPreferredMedia: 'Email',
    MemberPreferredPublication: 'Email', MemberBillingPreference: 'Email', MemberOtherPhoneType: 'Mobile',
    SocialMediaType: 'Website'
  };

  /* Status fields that would be wrong on a listing that has not sold or gone pending. */
  const PENDING_ONLY = ['ContingentDate', 'PurchaseContractDate', 'PendingTimestamp', 'ContractStatusChangeDate'];
  const CLOSED_ONLY = ['CloseDate', 'ClosePrice', 'OffMarketDate', 'OffMarketTimestamp'];
  const NEVER_MOCK = ['MemberPassword', 'WithdrawnDate', 'CancellationDate', 'BackOnMarketDate', 'LastLoginTimestamp'];

  /* Fields that only apply to commercial, farm, income or mobile-home listings. */
  const NOT_FOR_HOMES = /^(Business|HoursDays|Labor|Lease|NumberOfFull|NumberOfPart|SeatingCapacity|SpecialLicenses|YearEstablished|YearsCurrentOwner|AnchorsCoTenants|AvailableLeaseType|CurrentUse|DevelopmentStatus|Frontage|Horse|LandLease|MobileHome|NumberOfBuildings|NumberOfLots|NumberOfPads|NumberOfUnits|Park|PossibleUse|Road|UnitsFurnished|Crops|Cultivated|Farm|Grazing|Pasture|Range|Vegetation|Wooded|CableTv|CapRate|ElectricExpense|ExistingLeaseType|FinancialDataSource|Fuel|Furniture|Gardener|Gross|Income|Insurance|Licenses|Maintenance|Manager|NetOperating|NewTaxes|OperatingExpense|OtherExpense|OwnerPays|PestControl|PoolExpense|Professional|RentControl|RentIncludes|Supplies|TenantPays|TotalActualRent|Trash|Vacancy|WaterSewer|Workmans|LeasableArea|Make|Model|Mobile|Serial|Skirt|BodyType|License[123]|DOH[123]|Irrigation|Distance|PowerProduction|UnitTypeType|Green|AdditionalParcels|PublicSurvey|TaxBlock|TaxBook|TaxLot|TaxMap|TaxParcel|TaxTract|Township|Occupant|Owner(Name|Phone)|AssociationFee2|AssociationName2|AssociationPhone2|CoBuyer)/;

  function genericValue(name, type, n) {
    if (type === 'B') return /^(Internet|Heating|Cooling|Habitable|SignOn|PropertyTimeZoneObservesDst|MemberMlsAccess)/.test(name);
    if (type === 'D') return '2026-11-0' + (1 + n % 9);
    if (type === 'T') return '2026-11-1' + (n % 9) + 'T18:00:00Z';
    if (type === 'SLS' || type === 'SLM') return LOOKUPS[name] || 'Other';
    if (type === 'N') {
      if (/Year/.test(name)) return 2018;
      if (/Rate|Offset/.test(name)) return /Offset/.test(name) ? -8 : 5.5;
      if (/Expense|Income|Amount|Rent|Price|Value|Fee|Allowance/.test(name)) return 1200 + n * 25;
      if (/Area|SquareFeet|Length|Width/.test(name)) return 1000 + n * 10;
      if (/Latitude/.test(name)) return 36.17;
      if (/Longitude/.test(name)) return -115.14;
      return 1 + n % 4;
    }
    if (/Phone|Fax|Pager|VoiceMail$|TTYTDD/.test(name) && !/Ext$/.test(name)) return '702-555-01' + String(10 + n % 89);
    if (/Ext$/.test(name)) return '10' + (n % 9);
    if (/Email/.test(name)) return 'sample-' + n + '@example.invalid';
    if (/URL|Url/.test(name)) return 'https://example.invalid/' + name.toLowerCase();
    if (/Key$|Id$|ID$/.test(name)) return name.replace(/(Key|Id|ID)$/, '').toUpperCase().slice(0, 6) + '-' + (1000 + n);
    return 'Sample ' + name.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  }

  /* ---------------- Mock Member records (Trestle "Member") ---------------- */
  const OFFICES = {
    SOS: { Key: 'GLVARO-3450', MlsId: 'SOSR01', Name: 'SOS Realty Group LLC', Phone: '702-215-1838', PhoneExt: null,
      Email: 'realtorjanardhan@gmail.com', Fax: null, URL: null, AOR: 'Las Vegas REALTORS', NationalAssociationId: 'NAR-OFF-0001' },
    SAMPLE: { Key: 'GLVARO-9001', MlsId: 'SAMP01', Name: 'Sample Buyer Brokerage (fictional)', Phone: '702-555-0190', PhoneExt: null,
      Email: 'office@example.invalid', Fax: '702-555-0191', URL: 'https://example.invalid/office', AOR: 'Las Vegas REALTORS', NationalAssociationId: 'NAR-OFF-9001' }
  };

  const MEMBER_SEED = [
    { MemberKey: 'GLVARM-1001', MemberMlsId: 'JVANGALA', MemberFirstName: 'Janardhan', MemberLastName: 'Vangala',
      MemberFullName: 'Janardhan Vangala', MemberEmail: 'realtorjanardhan@gmail.com', MemberMobilePhone: '702-215-1838',
      MemberDirectPhone: '702-215-1838', MemberPreferredPhone: '702-215-1838', MemberOfficePhone: '702-215-1838',
      MemberAddress1: '3450 E. Russell Rd', MemberAddress2: 'Suite 209', MemberCity: 'Las Vegas', MemberPostalCode: '89120',
      MemberStateLicense: 'S.0000000 (placeholder)', JobTitle: 'REALTOR', office: 'SOS' },
    { MemberKey: 'GLVARM-1002', MemberMlsId: 'SAMPLEA', MemberFirstName: 'Avery', MemberLastName: 'Sample',
      MemberFullName: 'Avery Sample (fictional)', MemberEmail: 'avery@example.invalid', MemberMobilePhone: '702-555-0121',
      JobTitle: 'Co-listing agent', office: 'SOS' },
    { MemberKey: 'GLVARM-2001', MemberMlsId: 'SAMPLEB', MemberFirstName: 'Blake', MemberLastName: 'Example',
      MemberFullName: 'Blake Example (fictional)', MemberEmail: 'blake@example.invalid', MemberMobilePhone: '702-555-0132',
      JobTitle: 'Buyer agent', office: 'SAMPLE' },
    { MemberKey: 'GLVARM-2002', MemberMlsId: 'SAMPLEC', MemberFirstName: 'Casey', MemberLastName: 'Placeholder',
      MemberFullName: 'Casey Placeholder (fictional)', MemberEmail: 'casey@example.invalid', MemberMobilePhone: '702-555-0143',
      JobTitle: 'Buyer agent', office: 'SAMPLE' }
  ];

  const MEMBERS = MEMBER_SEED.map((seed, n) => {
    const office = OFFICES[seed.office];
    const known = Object.assign({}, seed, {
      MemberNickname: seed.MemberFirstName, MemberMiddleName: null, MemberNamePrefix: null, MemberNameSuffix: null,
      MemberStateOrProvince: 'NV', MemberCountry: 'US', MemberCountyOrParish: 'Clark',
      MemberIsAssistantTo: null, MemberBio: seed.MemberFullName + ' is a mock Trestle Member record for testing.',
      OfficeKey: office.Key, OfficeMlsId: office.MlsId, OfficeName: office.Name,
      OfficeNationalAssociationId: office.NationalAssociationId,
      OriginatingSystemName: 'GLVAR', OriginatingSystemID: 'GLVAR', OriginatingSystemMemberKey: seed.MemberKey,
      SourceSystemName: 'Trestle', SourceSystemID: 'TRESTLE', SourceSystemMemberKey: seed.MemberKey,
      ModificationTimestamp: '2026-11-11T18:00:00Z', OriginalEntryTimestamp: '2020-01-15T17:00:00Z'
    });
    delete known.office;
    const m = {};
    TRESTLE_MEMBER_FIELDS.filter(f => !isNav(f)).forEach(f => {
      if (NEVER_MOCK.includes(f.name)) m[f.name] = null;
      else if (f.name in known) m[f.name] = known[f.name];
      else m[f.name] = genericValue(f.name, f.type, n * 7 + f.name.length);
    });
    m['@mock.office'] = seed.office;
    return m;
  });
  const memberByKey = key => MEMBERS.find(m => m.MemberKey === key) || null;

  /* Copy a Member and Office onto Property fields such as ListAgentEmail or BuyerOfficeName. */
  function agentFields(prefix, member) {
    const out = {};
    TRESTLE_PROPERTY_FIELDS.filter(f => !isNav(f) && f.name.startsWith(prefix + 'Agent')).forEach(f => {
      const suffix = f.name.slice((prefix + 'Agent').length);
      if (!member) { out[f.name] = null; return; }
      if (suffix === 'URL') out[f.name] = 'https://example.invalid/agents/' + member.MemberMlsId.toLowerCase();
      else out[f.name] = member['Member' + suffix] !== undefined ? member['Member' + suffix] : null;
    });
    const office = member ? OFFICES[member['@mock.office']] : null;
    TRESTLE_PROPERTY_FIELDS.filter(f => !isNav(f) && f.name.startsWith(prefix + 'Office')).forEach(f => {
      out[f.name] = office ? (office[f.name.slice((prefix + 'Office').length)] ?? null) : null;
    });
    return out;
  }

  /* -------- Full Property records: the site's sample rows plus every other field -------- */
  const PROPERTIES = BASE_PROPERTIES.map((base, n) => {
    const r = ROWS[n];
    const status = base.StandardStatus;
    const closed = status === 'Closed', pending = status === 'Pending' || closed;
    const addrNo = String(1000 + n * 37);
    const known = Object.assign(
      agentFields('List', memberByKey('GLVARM-1001')),
      agentFields('CoList', n % 4 === 1 ? memberByKey('GLVARM-1002') : null),
      agentFields('Buyer', pending ? memberByKey(n % 2 ? 'GLVARM-2001' : 'GLVARM-2002') : null),
      agentFields('CoBuyer', null),
      {
        ListTeamKey: null, ListTeamName: null, BuyerTeamKey: null, BuyerTeamName: null,
        OriginatingSystemID: 'GLVAR', OriginatingSystemKey: base.ListingKey, SourceSystemID: 'TRESTLE',
        SourceSystemKey: base.ListingKey, SourceSystemName: 'Trestle',
        ListingURL: 'https://example.invalid/listing/' + base.ListingKey,
        CopyrightNotice: 'Mock data for testing. Not real listings.',
        Disclaimer: 'Fictional sample listing. Information is not real and is not guaranteed.',
        StreetNumber: addrNo, StreetNumberNumeric: Number(addrNo), StreetName: 'Sample', StreetSuffix: 'Street',
        StreetDirPrefix: null, StreetDirSuffix: null, UnitNumber: null, PostalCity: base.City,
        BathroomsFull: Math.max(1, r[6] - 1), BathroomsHalf: 1, BathroomsThreeQuarter: 0, BathroomsOneQuarter: 0, BathroomsPartial: 1,
        BedroomsPossible: base.BedroomsTotal, MainLevelBedrooms: 1, MainLevelBathrooms: 1,
        AboveGradeFinishedArea: base.LivingArea, BuildingAreaTotal: base.LivingArea, GrossLivingAreaAnsi: base.LivingArea,
        BelowGradeFinishedArea: 0, BelowGradeUnfinishedArea: 0, AboveGradeUnfinishedArea: 0,
        LotSizeSquareFeet: Math.round(base.LotSizeAcres * 43560), LotSizeArea: base.LotSizeAcres,
        GarageYN: base.GarageSpaces > 0, AttachedGarageYN: base.GarageSpaces > 0, ParkingTotal: base.GarageSpaces,
        CoveredSpaces: base.GarageSpaces, StoriesTotal: base.Stories, YearBuiltEffective: base.YearBuilt,
        PoolFeatures: base.PoolPrivateYN ? 'In Ground,Private' : 'None', SpaYN: false, SpaFeatures: 'None',
        FireplaceYN: base.InteriorFeatures.includes('Fireplace'), FireplacesTotal: base.InteriorFeatures.includes('Fireplace') ? 1 : 0,
        BasementYN: base.InteriorFeatures.includes('Basement'), Basement: base.InteriorFeatures.includes('Basement') ? 'Finished' : 'None',
        ViewYN: base.View.length > 0, WaterfrontYN: false, WaterfrontFeatures: 'None', WaterBodyName: null,
        AssociationYN: base.AssociationFee > 0, AssociationName: base.AssociationFee > 0 ? base.SubdivisionName + ' HOA (sample)' : null,
        OriginalListPrice: base.ListPrice, PreviousListPrice: base.ListPrice, ListPriceLow: null,
        CumulativeDaysOnMarket: base.DaysOnMarket, DaysInMls: base.DaysOnMarket, DaysOnSite: base.DaysOnMarket, SimpleDaysOnMarket: base.DaysOnMarket,
        OnMarketDate: '2026-11-01', OnMarketTimestamp: '2026-11-01T16:00:00Z', ActivationDate: '2026-11-01',
        OriginalEntryTimestamp: '2026-11-01T16:00:00Z', StatusChangeTimestamp: '2026-11-01T16:00:00Z',
        PhotosCount: 1, PhotosChangeTimestamp: '2026-11-01T16:00:00Z', VideosCount: 0, DocumentsCount: 1,
        VirtualTourURLBranded: base.VirtualTourURLUnbranded,
        TaxAnnualAmount: Math.round(base.ListPrice * 0.0065), TaxAssessedValue: Math.round(base.ListPrice * 0.35), TaxYear: 2025,
        ParcelNumber: '1' + String(60000000000 + n * 1013).slice(0, 10),
        CityRegion: base.City, MLSAreaMajor: base.City, MLSAreaMinor: base.SubdivisionName,
        HighSchool: 'Sample High School', MiddleOrJuniorSchool: 'Sample Middle School', ElementarySchool: 'Sample Elementary School',
        ElementarySchoolDistrict: 'Clark County School District', MiddleOrJuniorSchoolDistrict: 'Clark County School District',
        Directions: 'Mock directions for ' + base.City + '.', CrossStreet: 'Sample Ave', Elevation: 2000,
        MapCoordinate: base.Latitude + ',' + base.Longitude, MapCoordinateSource: 'Mock', MapURL: null,
        PrivateRemarks: 'Mock agent-only remarks.', PrivateOfficeRemarks: 'Mock office-only remarks.', SyndicationRemarks: base.PublicRemarks,
        AccessCode: null, LockBoxSerialNumber: null, LockBoxLocation: 'Front door',
        ShowingContactName: 'Janardhan Vangala', ShowingContactPhone: '702-215-1838', ShowingInstructions: 'Mock showing instructions.',
        ShowingAttendedYN: true, ShowingAdvanceNotice: 2, ShowingServiceName: 'ShowingTime',
        ShowingStartTime: '2026-11-01T16:00:00Z', ShowingEndTime: '2026-11-02T02:00:00Z',
        Inclusions: 'Refrigerator, washer, dryer', Exclusions: 'None', Ownership: 'Fee Simple', Contingency: null,
        ConcessionsAmount: null, ConcessionsComments: null,
        BuyerBrokerageCompensation: null, SubAgencyCompensation: null, TransactionBrokerCompensation: null, CompensationComments: null,
        WalkScore: 40 + n * 3, PropertyTimeZoneStandardOffset: -8, PropertyAttachedYN: base.PropertySubType !== 'Single Family Residence',
        UniversalPropertyId: 'US-32003-N-' + base.ListingKey, UniversalPropertySubId: null,
        OpenHouseModificationTimestamp: OPEN[base.ListingKey] ? '2026-11-10T18:00:00Z' : null,
        ElectricOnPropertyYN: true, GreenVerificationYN: false, CompSaleYN: closed, LeaseConsideredYN: false, HomeWarrantyYN: false
      },
      base
    );
    const p = {};
    TRESTLE_PROPERTY_FIELDS.filter(f => !isNav(f)).forEach(f => {
      if (f.name in known) p[f.name] = known[f.name];
      else if (NEVER_MOCK.includes(f.name)) p[f.name] = null;
      else if (CLOSED_ONLY.includes(f.name) && !closed) p[f.name] = null;
      else if (PENDING_ONLY.includes(f.name) && !pending) p[f.name] = null;
      else if (!MOCK_FILL_ALL && NOT_FOR_HOMES.test(f.name)) p[f.name] = null;
      else p[f.name] = genericValue(f.name, f.type, n * 11 + f.name.length);
    });
    // Keep any extra fields the site set that are not in the standard list.
    Object.keys(base).forEach(k => { if (!(k in p)) p[k] = base[k]; });
    return p;
  });

  /* Navigation properties, filled only when expanded, like Trestle's $expand. */
  function expandProperty(p, options) {
    const out = Object.assign({}, p);
    const want = (options && options.expand) || [];
    TRESTLE_PROPERTY_FIELDS.filter(isNav).forEach(f => {
      if (!want.includes(f.name)) return;
      const agentKey = { ListAgent: p.ListAgentKey, CoListAgent: p.CoListAgentKey, BuyerAgent: p.BuyerAgentKey, CoBuyerAgent: p.CoBuyerAgentKey }[f.name];
      if (agentKey !== undefined) out[f.name] = agentKey ? memberByKey(agentKey) : null;
      else if (f.name === 'Media') out.Media = MEDIA.filter(m => m.ResourceRecordKey === p.ListingKey);
      else if (f.name === 'OpenHouses') out.OpenHouses = OPEN_HOUSES.filter(o => o.ListingKey === p.ListingKey);
      else out[f.name] = f.type === 'C' ? [] : null;
    });
    return out;
  }

  function expandMember(m, options) {
    const out = Object.assign({}, m);
    delete out['@mock.office'];
    const want = (options && options.expand) || [];
    TRESTLE_MEMBER_FIELDS.filter(isNav).forEach(f => {
      if (!want.includes(f.name)) return;
      if (f.name === 'Office') {
        const o = OFFICES[m['@mock.office']];
        out.Office = { OfficeKey: o.Key, OfficeMlsId: o.MlsId, OfficeName: o.Name, OfficePhone: o.Phone, OfficeEmail: o.Email };
      } else out[f.name] = f.type === 'C' ? [] : null;
    });
    return out;
  }

  function typeLabel(sub){
    if (sub === 'Townhouse') return 'Townhome';
    if (sub === 'Condominium') return 'Condo';
    return 'House';
  }

  /** Live Trestle replaces these functions. Same return shape.
   *  options.expand: navigation fields to include, e.g. ['ListAgent', 'Media']. */
  async function fetchTrestleProperties(options){ return clone(PROPERTIES.map(p => expandProperty(p, options))); }
  async function fetchTrestleMembers(options){ return clone(MEMBERS.map(m => expandMember(m, options))); }
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

  let memory = null;
  let remote = false;
  let holding = false;
  const emptyDb = () => ({ assumable_data: [], custom_categories: [], custom_fields: [], custom_values: [] });
  const offline = { ok:false, error:'The database is not connected.' };
  function readDb(){
    return remote && memory ? memory : emptyDb();
  }
  function writeDb(db){
    if (remote) memory = db;
  }
  function touch(action, payload){
    if (holding) return Promise.resolve({ ok:true });
    if (!remote) return Promise.resolve(offline);
    return fetch('/api/mutate', { method:'POST', credentials:'include', headers:{ 'content-type':'application/json' }, body: JSON.stringify({ action, payload }) })
      .then(async r => {
        const data = await r.json().catch(() => ({ ok:false, error:'The database did not answer.' }));
        if (!r.ok || data.ok === false) return { ok:false, error: data.error || 'The database rejected that edit.' };
        return data;
      })
      .catch(() => offline);
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

  const applyColumn = (row, k, v, replace) => {
    const blank = v === undefined || v === '' || v === null;
    if (blank && !replace) return;
    if (blank) {
      if (k === 'rental_restrictions') row.rental_restrictions = 'Not known';
      else row[k] = null;
      return;
    }
    if (k === 'interest_rate') row.interest_rate = Number(Number(v).toFixed(3));
    else if (k === 'remaining_balance' || k === 'down_payment_required' || k === 'balance_loan_term') row[k] = Number(v);
    else if (k === 'rental_restrictions') row.rental_restrictions = ['Yes','No','Not known'].includes(v) ? v : 'Not known';
  };
  const SiteDatabase = {
    /** Full tables. The admin database screen reads this. */
    tables(){ return readDb(); },
    hold(on){ holding = !!on; },
    reset(){},
    /** One confirmed write of the listing's loan row and custom values. */
    persistListing(listingKey, opts){
      const removed = !!(opts && opts.removed);
      const row = removed ? null : this.assumable.get(listingKey);
      const values = this.values.list().filter(v => v.listing_key === listingKey);
      return touch('listing.save', { listingKey, removed, row, values });
    },
    assumable: {
      list(){ return clone(readDb().assumable_data); },
      get(listingKey){ return clone(readDb().assumable_data.find(r => r.listing_key === listingKey) || null); },
      /** Writes the keys you pass. A replace save stores blanks as empty. A partial save leaves other columns alone. */
      save(listingKey, patch, opts){
        const db = readDb();
        let row = db.assumable_data.find(r => r.listing_key === listingKey);
        if (!row) { row = blankRow(listingKey); db.assumable_data.push(row); }
        const replace = !!(opts && opts.replace);
        Object.entries(patch || {}).forEach(([k,v]) => applyColumn(row, k, v, replace));
        if (!row.rental_restrictions) row.rental_restrictions = 'Not known';
        writeDb(db);
        return touch('assumable.save', { listingKey, patch, replace });
      },
      remove(listingKey){
        const db = readDb();
        db.assumable_data = db.assumable_data.filter(r => r.listing_key !== listingKey);
        writeDb(db);
        return touch('assumable.remove', { listingKey });
      },
      reset(listingKey){
        const db = readDb();
        const seed = SEED.assumable_data.find(r => r.listing_key === listingKey) || null;
        db.assumable_data = db.assumable_data.filter(r => r.listing_key !== listingKey);
        if (seed) db.assumable_data.push(clone(seed));
        db.custom_values = db.custom_values.filter(v => v.listing_key !== listingKey);
        SEED.custom_values.filter(v => v.listing_key === listingKey).forEach(v => db.custom_values.push(clone(v)));
        writeDb(db);
        return touch('assumable.reset', { listingKey });
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
        return touch('category.create', row).then(res => res && res.ok === false ? res : {ok:true, row});
      }
    },
    fields: {
      list(){ return clone(readDb().custom_fields); },
      create({name, category_id, type}){
        const label = String(name || '').trim();
        if (!label) return Promise.resolve({ok:false, error:'A field needs a name.'});
        const db = readDb();
        const kind = ['text','amount','yes_no'].includes(type) ? type : 'text';
        const row = {id:'fld-'+Date.now(), category_id: category_id || null, name:label, type:kind};
        db.custom_fields.push(row);
        writeDb(db);
        return touch('field.create', row).then(res => res && res.ok === false ? res : {ok:true, row});
      }
    },
    values: {
      list(){ return clone(readDb().custom_values); },
      set(listingKey, fieldId, value){
        const db = readDb();
        db.custom_values = db.custom_values.filter(v => !(v.listing_key === listingKey && v.field_id === fieldId));
        const stored = value !== undefined && value !== null && String(value).trim() !== '' ? String(value).trim() : '';
        if (stored) db.custom_values.push({listing_key:listingKey, field_id:fieldId, value:stored});
        writeDb(db);
        return touch('value.set', { listingKey, fieldId, value: stored });
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

  async function connect(){
    try {
      const res = await fetch('/api/state', { credentials: 'include' });
      if (!res.ok) return false;
      const data = await res.json();
      if (!data || data.mode !== 'database' || !Array.isArray(data.assumable_data)) return false;
      memory = {
        assumable_data: data.assumable_data,
        custom_categories: data.custom_categories,
        custom_fields: data.custom_fields,
        custom_values: data.custom_values
      };
      remote = true;
      DataPorts.mode = 'database';
      DataPorts.remoteState = data;
      return true;
    } catch { return false; }
  }

  window.DataPorts = {
    mode: 'mock',
    fetchTrestleProperties,
    fetchTrestleMedia,
    fetchTrestleOpenHouses,
    fetchTrestleMembers,
    trestleSchema: { Property: clone(TRESTLE_PROPERTY_FIELDS), Member: clone(TRESTLE_MEMBER_FIELDS) },
    db: SiteDatabase,
    catalog,
    loadCatalog,
    connect,
    remoteState: null
  };
  DataPorts.ready = connect();
})();
