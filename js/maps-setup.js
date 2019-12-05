/* global L:false document:false $:false */
// that first line stops your editor form complaining about these variables
// being undefined, but it will still get mad at you if you accidentlaly try to change
// their values (which you must not do!!)
// `L` is the global Leaflet API object, which must be defined before this
// script is loaded
// `document` is of course the HTML document
// $ is the jQuery object (actually we're not using it here at the moment)
// but just in case you would like to make use of it, it's available


///////////////////////////////////////////////
// VARS!! VARS!! VARS!! VARS!! VARS!! VARS!! //
///////////////////////////////////////////////

//////////////////////////
// Globally Scoped Vars //
//////////////////////////

// In order to access map data, we need some of these variables to
// be defined in global scope. In some cases we can assign values here;
// in others we'll wait till we run the initialization function
// we do this here to make sure we can access them
// whenever we need to -- they have 'global scope'

// 55.4907, -1.594
// map initialization variables
let projectMap, // this will hold the map once it's initialized
  myCenter = [37.427475, -122.169716], // *latitude*, then longitude
  myZoom = 7; // set your preferred zoom here. higher number is closer in.
  // I set the zoom wide to give access to context before zooming in

  
// I'm complicating things a bit with this next set of variables, which will help us
// to make multi-colored markers
// color options are red, blue, green, orange, yellow, violet, grey, black
// just substitute the color name in the URL value (just before `.png`)
const greenURL = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  yellowURL = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
  greyURL = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
  redURL = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  blueURL = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';

// create new icon classes
// I've added this just in case you want very fine control over your marker placement
const myIconClass = L.Icon.extend({
  options: {
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
  }});
// create the new icon types -- cf. https://leafletjs.com/examples/custom-icons/ and
// also https://leafletjs.com/reference-1.5.0.html#icon
const 
  // gryfIcon = new myIconClass({iconUrl: yellowURL}),
  // slythIcon = new myIconClass({iconUrl: greenURL}),
  stanfordResearchParkIcon = new myIconClass({iconUrl: yellowURL}),
  companyIcon = new myIconClass({iconUrl: redURL}),
  universityIcon = new myIconClass({iconUrl: yellowURL});
  


// storing colors in variables, to make it easier to change all the related features at once
let 
  // gryfCol = 'yellow',
  // slythCol = 'green',
  // hogCol = 'grey',
  // meadeCol = 'rgb(40,40,120)',
  // towerCol = 'blue',
  sanMateoCol = 'blue',
  santaClaraCol = 'green',
  sanJoseCol = 'grey',
  sunnyValeCol = 'yellow',
  companyCol = 'red',
  universityCol = 'blue';

///////////////////////////////////////////////////////////////////////
// CHANGE THESE VARIABLE NAMES AND THEIR VALUES TO SUIT YOUR PROJECT //
///////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////
// DATA DATA DATA DATA   //
// DATA DATA DATA DATA   //
//////////////////////////////////////////////////////////


//////////////////////////////////
// MAP DATA PART 1: MARKER INFO //
//////////////////////////////////

///////////////////////////////
// YOU NEED TO CHANGE THESE! //
///////////////////////////////

// These are placeholder arrays; we use them to generate other JS variables
// that will be more useful to us later on
// but writing them this way keeps the code as D.R.Y. as possible
let companyMarkerInfo = [
  {
    position: [37.404990, -122.111080],
    title: "Shockley Semiconductor Laboratory",
    description: '<p>Known as the "Real Birthplace of Silicon Valley", this semiconductor manufacturer eventually closed after eight of its leading scientists departed the company to form Fairchild Semiconductor.</p>'
  },
  {
    position: [37.392560, -121.936410],
    title: "Fairchild Semiconductor",
    description: '<p>A pioneer in the manufacturing of transistors as well as integrated circuits. Together with Shockley Semiconductor Laboratory, there was an influx of semiconductor firms in the Valley.</p>'
  },
  {
    position: [37.412040, -122.148260],
    title: "HP Inc.",
    description: '<p>The largest firm in Santa Clara County in the 1950s. Previously known as Hewlett-Packard.</p>'
  }
];
let universityMarkerInfo = [
  {
      position: [37.427475, -122.169716],
      title: "Stanford",
      description: '<p>Received the "lion’s share of attention" from high-tech firms in the 1950s.</p>',
  },
  {
      position: [37.870628, -122.279762],
      title: "Berkeley",
      description: '<p>A leading university in producing entrepreneurs and receiving funding for start-up companies.</p>'
  },
  {
      position: [37.347141, -121.934517],
      title: "Santa Clara",
      description: '<p>Began offering a 7-9am early bird program for engineering graduate courses in 1959 to compete with Stanford\'s graduate program. By 1963, program enrollment exceeded 600 which was similar to enrollment in Stanford\'s Honours Cooperative Program.</p>'
   },
   {
      position: [37.335186, -121.881073],
      title: "San Jose State",
      description: '<p>A leading contributor of engineers to firms in the Valley since receiving accreditation in civil and electrical engineering in 1959.</p>'
   }
];
// let slythMarkerInfo =
// [
// {position: [55.48997247517858,-1.5944015979766843],
//  title: "Room of Requirement",
//  description: '<p>one half of the Cabinet is located here.</p>'
// },
// {position: [55.49058639152367,-1.5940092937469482],
//  title: "Fenrir Greyback",
//  description: `<p>An evil and spiteful werewolf, he thirsts for blood and impatiently awaits Dumbledore's demise.</p>`
// },
// {position: [55.61679475360749,-1.6392910480499268],
//  title: "Isle of the Locket",
//  description: `<p>A forlorn and terrifying sea cave, guarded by an army of the undead and many other magical protections</p>`},
// {position: [ 55.49086601004396, -1.5939261297996548 ],
//  title: "Draco Malfoy",
//  description: "<p>Weak-willed, dissatisfied, and a natural bully, Draco Malfoy has nonetheless plotted the murder of his own headmaster.</p>"},
// {position: [ 55.49046495468512, -1.5939583064545149 ],
//  title: "Severus Snape",
//  icon: mysteryIcon,
//  description: `<p>what drives him? How has he survived so long with so much decption, such intense longing, guilt, and hatred?`}
// ],
// gryfMarkerInfo =
// [{position: [55.49058639152367,-1.5951092937469482],
// title: "Dumbledore Lies Dying",
// description: "<p>Afflicted by a curse for over a year, and gravely weakened by a powerful poison, Dumbledore lies on the ground, barely mobile.</p>"
//  }];


let 
  // gryfMarkers = processMarkerLayer(gryfMarkerInfo,
  //  {description: 'Gryffindor: People and Places', defaultIcon: gryfIcon}),
  // slythMarkers = processMarkerLayer(slythMarkerInfo,
  //  {description: 'Slytherin: Peple and Places', defaultIcon: slythIcon}),
  companyMarkers = processMarkerLayer(companyMarkerInfo,
   {description: 'Companies', defaultIcon: companyIcon}),
  universityMarkers = processMarkerLayer(universityMarkerInfo,
   {description: 'Universities', defaultIcon: universityIcon});



//////////////////////////////
// MAP DATA PART 2: GEOJSON //
//////////////////////////////

// With this powerful feature you can add arbitrary
// data layers to your map.  It's cool. Learn more at:
// https://leafletjs.com/examples/geojson/
// but essentially: we can add all kinds of features here, including polygons and other shapes
// you can create geoJSON layers here: http://geojson.io/
// and learn more about the format here: https://en.wikipedia.org/wiki/GeoJSON
// to set the line and fill color, you will need to set the `myColor` property as below.
const formerValleyData={
  "type": "FeatureCollection",
  "description": "Silicon Valley (1900-1950)",
  "features": [{
    "type": "Feature",
    "properties": {myColor: sanMateoCol, title: "San Mateo County", description: "Formerly a half of the Valley and home to the Federal Telegraph Company, Litton Engineering Laboratories, and Varian Associates." },
    "geometry": {
    "type": "Polygon",
    "coordinates": [ [ [ -122.39730834960938, 37.70012079430599 ], [ -122.50030517578124, 37.69903420794415 ], [ -122.49893188476561, 37.666429212090605 ], [ -122.49618530273438, 37.644684587165884 ], [ -122.49481201171875, 37.621845878167704 ], [ -122.50030517578124, 37.60335225883687 ], [ -122.50442504882814, 37.59791208382183 ], [ -122.5140380859375, 37.59464778787345 ], [ -122.51953124999999, 37.58376576718623 ], [ -122.51678466796874, 37.56417412088097 ], [ -122.5140380859375, 37.55111016010861 ], [ -122.51815795898436, 37.53586597792038 ], [ -122.5140380859375, 37.51626173528878 ], [ -122.50167846679686, 37.501010429493284 ], [ -122.49893188476561, 37.49556277942662 ], [ -122.4920654296875, 37.501010429493284 ], [ -122.48245239257812, 37.50209991181568 ], [ -122.46597290039062, 37.496652341233364 ], [ -122.45498657226561, 37.483576550426996 ], [ -122.4481201171875, 37.467228593296134 ], [ -122.44400024414062, 37.44433544620035 ], [ -122.44262695312501, 37.42361656106772 ], [ -122.42752075195314, 37.397437140899775 ], [ -122.41790771484375, 37.38216158779349 ], [ -122.40554809570311, 37.36251701774283 ], [ -122.4041748046875, 37.34832607355296 ], [ -122.40280151367188, 37.30355244770045 ], [ -122.41378784179688, 37.26640286793118 ], [ -122.42202758789061, 37.254379960133264 ], [ -122.41241455078125, 37.228141500433615 ], [ -122.40829467773436, 37.20626914065441 ], [ -122.3876953125, 37.17891977403989 ], [ -122.37533569335936, 37.17782559332976 ], [ -122.36572265625, 37.16250539941102 ], [ -122.36022949218749, 37.142803443716836 ], [ -122.34374999999999, 37.14499280340635 ], [ -122.33688354492188, 37.132950540920135 ], [ -122.33551025390625, 37.12309635498927 ], [ -122.32452392578125, 37.114336001507866 ], [ -122.310791015625, 37.118716304960124 ], [ -122.288818359375, 37.10338413422305 ], [ -122.2723388671875, 37.083666782415534 ], [ -122.25311279296874, 37.05736900011469 ], [ -122.23388671874999, 37.068327517596586 ], [ -122.24212646484375, 37.118716304960124 ], [ -122.26409912109375, 37.16469418870222 ], [ -122.16796875, 37.17344871200958 ], [ -122.09381103515624, 37.17563718436526 ], [ -122.091064453125, 37.204081555898526 ], [ -122.02239990234375, 37.21501884556323 ], [ -122.0416259765625, 37.267495764381856 ], [ -122.07733154296875, 37.298090424438506 ], [ -122.1240234375, 37.34395908944491 ], [ -122.1514892578125, 37.36360851770406 ], [ -122.17346191406249, 37.385435182627226 ], [ -122.1954345703125, 37.411618795843026 ], [ -122.1954345703125, 37.43997405227057 ], [ -122.19818115234375, 37.45959832290546 ], [ -122.1954345703125, 37.477037796698056 ], [ -122.17071533203125, 37.49011473195046 ], [ -122.16522216796875, 37.501010429493284 ], [ -122.178955078125, 37.51190453731693 ], [ -122.19818115234375, 37.5249753680482 ], [ -122.2119140625, 37.54675499755639 ], [ -122.24212646484375, 37.55764242679522 ], [ -122.26959228515624, 37.572882155556194 ], [ -122.31353759765624, 37.579412513438385 ], [ -122.3382568359375, 37.59029517052193 ], [ -122.36022949218749, 37.59682400108367 ], [ -122.36572265625, 37.607704112428394 ], [ -122.35198974609375, 37.61640705577992 ], [ -122.36846923828125, 37.63163475580643 ], [ -122.37945556640624, 37.6359849542696 ], [ -122.37396240234375, 37.65120864327176 ], [ -122.39730834960938, 37.70012079430599 ] ] ]
    }
  },
  {
    "type": "Feature",
    "properties": {myColor: 'blue', title: "San Francisco", description: "Formerly a half of the Valley." },
    "geometry": {
    "type": "Point",
    "coordinates": [-122.419418, 37.774929]}
  }]
}

let formerValley = processJSONLayer(formerValleyData);


const currentValleyData={
  "type": "FeatureCollection",
  "description": "Silicon Valley (1951-present)",
  "features": [
  {
    "type": "Feature",
    "properties": {myColor: santaClaraCol, title: "Santa Clara County", description: "Current home to Silicon Valley." },
    "geometry": {
    "type": "Polygon",
    "coordinates": [ [ [ -121.8109130859375, 37.469408527523605 ], [ -121.80679321289062, 37.462868534136554 ], [ -121.80816650390625, 37.45632796865522 ], [ -121.81503295898436, 37.45632796865522 ], [ -121.8218994140625, 37.467228593296134 ], [ -121.94274902343749, 37.473768205267504 ], [ -121.97158813476561, 37.46613860234406 ], [ -122.00042724609374, 37.472678309670826 ], [ -122.04437255859375, 37.471588398181176 ], [ -122.091064453125, 37.47594794878128 ], [ -122.12951660156249, 37.489025074767866 ], [ -122.13638305664062, 37.505368263398104 ], [ -122.15698242187499, 37.496652341233364 ], [ -122.17346191406249, 37.489025074767866 ], [ -122.19406127929688, 37.47921744485059 ], [ -122.19818115234375, 37.462868534136554 ], [ -122.19818115234375, 37.45087706042972 ], [ -122.1954345703125, 37.43670283999782 ], [ -122.19680786132812, 37.42252593456307 ], [ -122.1954345703125, 37.40943717748788 ], [ -122.15423583984375, 37.36033397019125 ], [ -122.14050292968749, 37.351601144954785 ], [ -122.11990356445312, 37.33850000215498 ], [ -122.07046508789062, 37.286072577028555 ], [ -122.04437255859375, 37.26858864497055 ], [ -122.02789306640625, 37.23907530202184 ], [ -121.9921875, 37.228141500433615 ], [ -121.98394775390625, 37.2182997233196 ], [ -121.95922851562501, 37.19423663983283 ], [ -121.92626953124999, 37.18548452548039 ], [ -121.88369750976562, 37.17344871200958 ], [ -121.85897827148438, 37.16469418870222 ], [ -121.83563232421875, 37.142803443716836 ], [ -121.81777954101561, 37.131855694734625 ], [ -121.82876586914061, 37.112145754751516 ], [ -121.79306030273438, 37.108860265833 ], [ -121.77383422851562, 37.0957168848389 ], [ -121.75872802734375, 37.09133525109512 ], [ -121.75186157226561, 37.08695336399672 ], [ -121.7340087890625, 37.073806182683725 ], [ -121.69692993164062, 37.06394430056685 ], [ -121.67907714843751, 37.03763967977139 ], [ -121.67495727539061, 37.020098201368114 ], [ -121.67083740234375, 37.00803608513944 ], [ -121.65573120117188, 36.98390610968992 ], [ -121.63787841796875, 36.97183825093165 ], [ -121.61453247070311, 36.96964388918142 ], [ -121.58294677734374, 36.96086580957587 ], [ -121.54037475585938, 36.948794297566366 ], [ -121.53762817382814, 36.94220903003596 ], [ -121.53350830078124, 36.92464553397128 ], [ -121.52252197265626, 36.91696023183306 ], [ -121.50192260742186, 36.91256828285194 ], [ -121.47445678710936, 36.90597988519294 ], [ -121.4483642578125, 36.91256828285194 ], [ -121.43463134765625, 36.92025402759534 ], [ -121.42227172851562, 36.934525498514894 ], [ -121.4208984375, 36.94111143010769 ], [ -121.41952514648438, 36.958671131530316 ], [ -121.41677856445312, 36.96744946416934 ], [ -121.41265869140624, 36.986100060204095 ], [ -121.4044189453125, 37.004746084814784 ], [ -121.39755249023439, 37.01571219880126 ], [ -121.38656616210938, 37.019001724461155 ], [ -121.37283325195312, 37.02229110771148 ], [ -121.35086059570314, 37.004746084814784 ], [ -121.33575439453126, 36.98390610968992 ], [ -121.32888793945312, 36.96854668458301 ], [ -121.30966186523438, 36.958671131530316 ], [ -121.18331909179688, 36.958671131530316 ], [ -121.20666503906249, 36.99158465967016 ], [ -121.21353149414062, 37.01022933958175 ], [ -121.2176513671875, 37.03325468997236 ], [ -121.22039794921874, 37.04312056092881 ], [ -121.2286376953125, 37.06394430056685 ], [ -121.23275756835938, 37.08038005833324 ], [ -121.23275756835938, 37.09352609963704 ], [ -121.22039794921874, 37.100098265217156 ], [ -121.21490478515625, 37.130760832708155 ], [ -121.22039794921874, 37.15156050223665 ], [ -121.20391845703125, 37.16141098099668 ], [ -121.19567871093751, 37.17782559332976 ], [ -121.19567871093751, 37.232515211349174 ], [ -121.2506103515625, 37.26530995561875 ], [ -121.28906250000001, 37.298090424438506 ], [ -121.32476806640625, 37.26968150969715 ], [ -121.35223388671875, 37.260938147754544 ], [ -121.3714599609375, 37.276238364942955 ], [ -121.39343261718749, 37.293720520228696 ], [ -121.431884765625, 37.298090424438506 ], [ -121.47033691406249, 37.293720520228696 ], [ -121.4923095703125, 37.28060928450999 ], [ -121.47583007812501, 37.26312408340919 ], [ -121.48406982421875, 37.243448378654115 ], [ -121.51153564453125, 37.23907530202184 ], [ -121.55548095703125, 37.2456348218214 ], [ -121.55273437499999, 37.26312408340919 ], [ -121.541748046875, 37.28497995025375 ], [ -121.56646728515624, 37.29590550406618 ], [ -121.61041259765624, 37.30682947124943 ], [ -121.8109130859375, 37.469408527523605 ] ] ]
    }
  },
  {
    "type": "Feature",
    "properties": {myColor: 'green', title: "Stanford Research Park", description: "Initially named Stanford Industrial Park. Currently home to more than 150 companies, including Hewlett-Packard and Tesla Motors." },
    "geometry": {
    "type": "Point",
    "coordinates": [-122.1518, 37.4069]}
  }]
}

let currentValley = processJSONLayer(currentValleyData);


// const townsData={
// "type": "FeatureCollection",
// "description": "Magical Municipalities",
// "features": [
// {
// "type": "Feature",
// "properties": {myColor: hogCol, title: "Hogwarts School", description: "Terrifying events are commonplace here." },
// "geometry": {
// "type": "Polygon",
// "coordinates": [
//   [[-1.5929424762725828,55.49200869560172],[-1.5931355953216553,55.491753414035976],[-1.5934574604034424,55.49184458621365],[-1.5935111045837402,55.49174125772966],[-1.5935754776000977,55.491552834502244],[-1.5937042236328125,55.4914069578362],[-1.5939724445343018,55.491212454774455],[-1.5942513942718506,55.4911152028834],[-1.5946805477142334,55.491084811618215],[-1.595292091369629,55.4910604985892],[-1.595635414123535,55.49106657684784],[-1.5957105159759521,55.491121281133644],[-1.5959036350250244,55.49102402901751],[-1.5959250926971436,55.49093285494058],[-1.5960323810577393,55.49078697597856],[-1.5962040424346924,55.49052560815388],[-1.5962576866149902,55.49022168989803],[-1.5962469577789307,55.49010620034601],[-1.5961718559265137,55.48994208303175],[-1.5960967540740967,55.489765808117795],[-1.5959680080413818,55.48957737544101],[-1.5957856178283691,55.48941933443642],[-1.5954852104187012,55.489291685469844],[-1.5952062606811523,55.489255214260574],[-1.5951526165008545,55.48916403608966],[-1.5947985649108887,55.48930384253212],[-1.5947234630584717,55.489364627787104],[-1.5943479537963867,55.48943756996929],[-1.5939295291900633,55.48960776786919],[-1.5937042236328125,55.489711101949666],[-1.5934574604034424,55.48978404349032],[-1.5933179855346677,55.48978404349032],[-1.593436002731323,55.48990561242462],[-1.5932321548461914,55.49002110256471],[-1.593017578125,55.490094043531386],[-1.5929424762725828,55.49039796277202],[-1.5928030014038086,55.49066540976418],[-1.5927600860595703,55.49105442032959],[-1.5926849842071533,55.49143127065138],[-1.5926635265350342,55.491704788788255],[-1.5925991535186768,55.49185066435133],[-1.5929424762725828,55.49200869560172]]
// ]
// }
// },
// {
// "type": "Feature",
// "properties": {myColor: meadeCol, title: "Town of Hogsmeade", description: "Home of Butterbeer"},
// "geometry": {
// "type": "Polygon",
// "coordinates": [[[-1.6042613983154297,55.490701879667895],[-1.6042077541351318,55.49065933144361],[-1.6042184829711914,55.49068364472025],[-1.604926586151123,55.49031894399501],[-1.607351303100586,55.49065933144361],[-1.6081881523132324,55.489923847732406],[-1.6085636615753174,55.48901815057725],[-1.6068792343139648,55.48843460312515],[-1.6042506694793701,55.487723392980776],[-1.6029417514801023,55.48743161074576],[-1.600785255432129,55.48822792799636],[-1.5991652011871336,55.48898167911473],[-1.599959135055542,55.490033259401876],[-1.5986931324005127,55.491479896236754],[-1.5987253189086914,55.49171694510582],[-1.5996050834655762,55.49194791442662],[-1.6010427474975586,55.49192360193031],[-1.6019654273986814,55.49204516426178],[-1.6025233268737793,55.491795961078495],[-1.6033065319061277,55.491340097517046],[-1.6042613983154297,55.490701879667895]]  ]
// }
// }
// ]
// }

// let towns = processJSONLayer(townsData)

////////////////////////////////////////////////////////
// MAP DATA PART 3: DIRECT CREATION OF SHAPE OVERLAYS //
////////////////////////////////////////////////////////


// Hogwarts Buildings Objects and LayerGroup
// API docs: https://leafletjs.com/reference-1.5.0.html#polygon
//  (keep scrolling for docs on rectangles and circles)
// let gryffindor = L.rectangle([[ 55.49021561150901, -1.5941441059112549],
//  [55.49107265510559,-1.5931355953216553]], {
// color: gryfCol,
// opacity: 0.8,
// weight: 2,
// fillColor: gryfCol,
// fillOpacity: 0.35,
// title: 'Gryffindor',
// windowContent: `<h3>Gryffindor</h3><p>The Good Guys Live here</p3>`
// });

// let slytherin = L.rectangle([[ 55.48954090449621, -1.5956997871398926], [55.490288552115494, -1.594712734222412]], {
// color: gryfCol,
// opacity: 0.8,
// weight: 2,
// fillColor: slythCol,
// fillOpacity: 0.35,
// title: 'Slytherin',
// windowContent: `<h3>Slytherin</h3><p>The Bad Guys Live here</p3>`
// });

// let headmasterTower = L.circle([55.4907, -1.5944], {
// color: towerCol,
// opacity: 0.8,
// weight: 2,
// fillColor: towerCol,
// fillOpacity: 0.35,
// radius: 40,
// title: 'Headmaster\'s Tower',
// windowContent: `<h3>Headmaster's Tower</h3><p>Scene of the the Fatal Act.</p>`
// });

// let houses = processManualLayers([gryffindor, slytherin, headmasterTower],
//   {description: 'Important Hogwarts Buildings'});




// Polyline Objects and Layer Group ("paths")
// let vanishingPath = L.polyline([[51.37178037591737, -0.2197265625],
//  [55.36857598381045, -1.7512893676757812],
//  [55.48997247517858,-1.5944015979766843 ]], {
//  color: slythCol,
//  weight: 6,
//  title: 'DeathEaters Travel',
//  windowContent: `<h3>Line of Travel for Deatheaters</h3><p>From the twin Vanishing Cabinet, the Deatheraters can travel directly from Bourquin and Burkes</p>`})


// let tunnelPath = L.polyline([[55.49065933144361,-1.6042077541351318],
//  [55.49027247517858,-1.5943015979766843 ]], {
//  color: gryfCol,
//  weight: 6,
//  title: 'Tunnel to Hogsmeade',
//  windowContent: `<h3>Marauders' Map Tunnel</h3><p>Not really sure why this worked in the first ocuple of books.</p>`})

// let horcruxPath = L.polyline([[55.49058639152367,-1.5951092937469482],
//  [55.61679475360749,-1.6392910480499268]], {
//  color: gryfCol,
//  weight: 4,
//  title: 'Return from Horcrux quest',
//  windowContent: `<h3>Return Disapparation from Failed Horcrux quest</h3><p>Exhaisted and grieviously injured, Dumbledore returns to find the trap he had so long expected has been sprung.</p>`})
// let paths = processManualLayers([vanishingPath, tunnelPath, horcruxPath], {description: 'Paths'})


////////////////////////////////////////////////
// array of all the layers!!!!!!!
// these layers will be added to the map
// you should change these variable names
// to align with the variables you've defiend above
// let allLayers = [gryfMarkers, slythMarkers, companyMarkers, universityMarkers, towns, houses, paths];
let allLayers = [companyMarkers, universityMarkers, formerValley, currentValley];

///////////////////////////////////////
// END DATA!!  END DATA!! END DATA!! //
///////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////
// FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS //
/////////////////////////////////////////////


/**
 * create a Leaflet map inside an element, add base layer and return the map as a return value
 * @param {HTMLElement|string} element: can be either a full HTMLElement or the ID attribute
 * of a DOM node
 * @returns {Object} a Leaflet map object 
 */
function createMap (element) {
  const map = L.map(element, {renderer:L.canvas(), preferCanvas: true}).setView(myCenter, myZoom);
  // now we add the base layer
  // you can change this if you want!
  // if your tiles seem to load very slowly, you may want to generate your own accessToken
  // and insert the value in `accessToken`, below. 
  // see: https://docs.mapbox.com/help/how-mapbox-works/access-tokens/#creating-and-managing-access-tokens
  // to change the tile layer, change the `id` attribute below.
  // some valid options include: mapbox.streets, mapbox.light, mapbox.satellite, mapbox.dark, mapbox.outdoors 
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}@2x.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	id: 'mapbox.dark',
	accessToken: 'pk.eyJ1IjoidGl0YW5pdW1ib25lcyIsImEiOiJjazF0bTdlNXQwM3gxM2hwbXY0bWtiamM3In0.FFPm7UIuj_b15xnd7wOQig'
  })
  .addTo(map);
  return map
}


/**
 * Add Markers to a "layerGroup" and return the populated object
 * @param {Array.<Object>} markerInfo
 * @param {string} markerInfo[].title
 * @param {Array|Object} markerInfo[].position
 * @param {Object} layerGroup
 * @returns {Object} the modified layerGroup object 
 */
function processMarkerLayer (markerInfo, options) {
  let layerGroup = L.layerGroup([], options);
  // iterate over the marker info array, adding to the main marker layer but
  // *also* to another layer if the icon property is set. 
  for (const m of markerInfo) {
  // define a Leaflet marker object for each marker
  // we pass two parameters: a position (2-value array of lat & lng vals)
  // and an object containing marker propertie
  let marker =  L.marker (m.position, {
  // We set the icon 
  icon: m.icon || layerGroup.options.defaultIcon || L.Icon(),
  title: m.title,
  description: m.description,
  windowContent: m.windowContent //this is obsolete
  });
  let t = assembleTexts(marker);
  marker.bindPopup(t.popup);
  // this seems to be unnecessary on modern browsers for some reason
  //marker.bindTooltip(t.tooltip);
  layerGroup.addLayer(marker);
  }
  return layerGroup;
}

/**
 * create a geoJSON layer and return the geoJSON layer object.
 * If the featureGroup has the non-standard property
 * 'description' it will be explicitly set on the returned object as well.
 * If an individual feature has the property feature.properties.title,
 * then the options.title property will be set on the resultant layer
 * for compatibility with marker layers.
 * The custom property `feature.properties.myColor` will also be used to set line and
 * fill colors.
 * 
 * @param {GeoJSON} jsonData
 * @returns {Object} the newly-created geoJSON layer 
 */
function processJSONLayer (jsonData) {
  return L.geoJSON(jsonData, {
  // the 'style' option is a *function* that modifies some
  // feature properties.  
  // cf https://leafletjs.com/reference-1.5.0.html#geojson-style
  style: function(feature) {
  let c = feature.properties.myColor;
  return {color: c, weight: 3, fillColor: c, fillOpacity: 0.5};
  },
  onEachFeature: function (feature, layer) {
  layer.options.description = '';
  if (feature.properties ) {
  if (feature.properties.title) {
 layer.options.title = feature.properties.title;
  }
  if (feature.properties.description) {
 layer.options.description = feature.properties.description;
  }
  }
  let t = assembleTexts(layer);
  layer.bindPopup(t.popup);
  layer.bindTooltip(t.tooltip, {sticky: true});
  },
  description: jsonData.description || "GeoJSON Objects"
  });
}

/**
 * create a layerGroup from an array of individual Layer objects.
 * If the non-standard options `windowContent`, `title`, and/or `description` have been
 * set, they will be used to create a popup window and tooltip now, and
 * to generate legend text in `addLayerToLegendHTML` later on.
 * The `options` parameter should include a `description` property,
 * (NOTE: this is *separate* from the description of the individual layers!!)
 * which will also be used by `addLayerToLegendHTML` and in the layers
 * control box. 
 * @param {} layerArray
 * @param {} options
 * @returns {} 
 */
function processManualLayers (layerArray, options = {description: 'Unnamed Layer'}) {
  for (const l of layerArray) {
  let t = assembleTexts(l);
  l.bindPopup(t.popup);
  l.bindTooltip(t.tooltip, {sticky: true});
  }
  return L.layerGroup(layerArray, options)
}


function assembleTexts (feature) {
  let opts = feature.options,
  tooltip = 'Untitled Tooltip',
  popup = '<h2>Untitled</h2>',
  legend = 'Untitled';
  
  if (opts.title) {
  popup = `<h2>${opts.title}</h2>` + (opts.description || '');
  tooltip = opts.title;
  legend = opts.title;
  }
  if (opts.windowContent) {
  popup = opts.windowContent;
  }
  return {tooltip: tooltip, popup: popup, legend: legend};
}
/**
 * For every element of `layerGroup`, add an entry to the innerHTML of
 * the element matched by `querySelector`, consisting of a div whose
 * `onclick` attribute is a call to `locateMapFeature` which navigates to, and
 * opens the popup window of, that feature.  The link text will be one of `options.infoHTML`,
 * `options.title`, or 'no title', in that order.
 * @param {Array} layerGroup
 * @param {string} querySelector
 * @returns {string} innerHTML content of the legend element 
 */
function addLayerToLegendHTML (layerGroup, el) {
  let output = `<div class="legend-content-group-wrapper"><h2>${layerGroup.options.description}</h2>`;
  for (let l in layerGroup._layers) {
  // this is hideously ugly! very roundabout way
  // to access anonymous marker from outside the map
  let current = layerGroup._layers[l];
  let info = assembleTexts(current).legend;
  output +=  `
<div class="pointer" onclick="locateMapFeature(projectMap._layers[${layerGroup._leaflet_id}]._layers[${l}])"> 
  ${info} 
</div>`;
  }
  output += '</div>'
  el.innerHTML += output;
  return el.innerHTML
}

/* a function that will run when the page loads.  It creates the map
 and adds the existing layers to it. You probably don't need to change this function; 
 instead, change data and variable names above, or change some of the helper functions that
 precede this function.
 */
async function initializeMap() {

  // this one line creates the actual map
  // it calls a simple 2-line function defined above
  projectMap = createMap('map_canvas');
  // set the legend location
  let legendEl = document.querySelector('#map_legend');

  let layerListObject = {};
  // add markers to map and to legend, then add a toggle switch to layers control panel
  for (let l of allLayers) {
  l.addTo(projectMap);
  addLayerToLegendHTML(l, legendEl);
  layerListObject[l.options.description] = l;
  }

 // add a layers control to the map, using the layer list object
  // assigned above
  L.control.layers(null, layerListObject).addTo(projectMap);

  // You'll want to comment this out before handing in, but it makes life a bit easier.
  // while you're developing
  coordHelp();
}

/**
 * pan to object if it's a marker; otherwise use the `fitBounds` method on the feature
 * Then open the marker popup.
 * @param {Object} marker
 */
function locateMapFeature (marker) {
  marker.getLatLng ? projectMap.panTo(marker.getLatLng(), {animate: true, duration: 1.5}).setZoom(16) : projectMap.fitBounds(marker.getBounds()); 
  marker.openPopup();
}

function coordHelp () {
  projectMap.on('click', function(e) {
  console.log("Lat, Lon : [ " + e.latlng.lat + ", " + e.latlng.lng + " ]")
  });
}

function resetMap (map) {
  map.setView(myCenter, myZoom).closePopups()
}
