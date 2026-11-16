
"use strict";
/* ============ Helpers ============ */
function $(id){return document.getElementById(id);}
function fmtMoney(n,cur){
  if(!isFinite(n)) return "—";
  try{return new Intl.NumberFormat(cur==="GBP"?"en-GB":cur==="CAD"?"en-CA":"en-US",{style:"currency",currency:cur,maximumFractionDigits:2}).format(n);}
  catch(e){return (cur==="GBP"?"£":"$")+Number(n).toLocaleString("en-US",{maximumFractionDigits:2});}
}
function fmtMoney0(n,cur){
  if(!isFinite(n)) return "—";
  try{return new Intl.NumberFormat(cur==="GBP"?"en-GB":cur==="CAD"?"en-CA":"en-US",{style:"currency",currency:cur,maximumFractionDigits:0}).format(n);}
  catch(e){return (cur==="GBP"?"£":"$")+Math.round(n).toLocaleString("en-US");}
}
function fmtNum(n){return isFinite(n)?Number(n).toLocaleString("en-US"):"—";}
function num(id){var v=parseFloat($(id).value);return isNaN(v)?0:v;}
var toastTimer=null;
function toast(msg){
  var t=$("toast");t.textContent=msg;t.classList.add("show");
  clearTimeout(toastTimer);toastTimer=setTimeout(function(){t.classList.remove("show");},2400);
}
function copyText(txt,msg){
  function done(){toast(msg||"Copied to clipboard");}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(done).catch(function(){fallback();});}
  else fallback();
  function fallback(){
    var ta=document.createElement("textarea");ta.value=txt;ta.style.position="fixed";ta.style.opacity="0";
    document.body.appendChild(ta);ta.select();
    try{document.execCommand("copy");done();}catch(e){toast("Copy failed — select and copy manually");}
    document.body.removeChild(ta);
  }
}

/* ============ Tool directory ============ */
var TOOLS=[
  {id:"mortgage",cat:"finance",tag:"Finance",name:"Mortgage Calculator",desc:"Monthly payment, total interest and payoff date for home loans in $, £ or CAD $."},
  {id:"tip",cat:"finance",tag:"Finance",name:"Tip Calculator & Bill Splitter",desc:"Calculate the tip and split any restaurant or bar bill evenly between friends."},
  {id:"salary",cat:"finance",tag:"Finance",name:"Salary to Hourly Calculator",desc:"Convert an annual salary to an hourly wage — or an hourly rate to a yearly salary."},
  {id:"gpa",cat:"study",tag:"Study",name:"GPA Calculator",desc:"US 4.0 scale. Add courses, credits and letter grades to get your term & cumulative GPA."},
  {id:"age",cat:"math",tag:"Dates",name:"Age Calculator",desc:"Exact age in years, months and days, total days lived and your next birthday."},
  {id:"image",cat:"media",tag:"Image",name:"Image Compressor",desc:"Shrink JPG, PNG and WebP images for faster websites, email and social media."},
  {id:"words",cat:"text",tag:"Text",name:"Word Counter",desc:"Count words, characters, sentences and paragraphs in your text — live, as you type."},
  {id:"qr",cat:"fun",tag:"Utility",name:"QR Code Generator",desc:"Turn any link or text into a scannable QR code and download it as a PNG."},
  {id:"password",cat:"fun",tag:"Security",name:"Password Generator",desc:"Generate strong, secure random passwords with a strength and entropy rating."},
  {id:"loan",cat:"finance",tag:"Finance",name:"Loan Calculator",desc:"Monthly payment, total interest and payoff for car, personal and student loans."},
  {id:"compound",cat:"finance",tag:"Finance",name:"Compound Interest Calculator",desc:"See how savings and investments grow with compound interest and monthly deposits."},
  {id:"savings",cat:"finance",tag:"Finance",name:"Savings Goal Calculator",desc:"How long to reach a savings goal with monthly deposits and interest."},
  {id:"salestax",cat:"finance",tag:"USA Tax",name:"US Sales Tax Calculator",desc:"Add state sales tax to a price — major state rates included, or enter your own local rate."},
  {id:"vat",cat:"finance",tag:"UK Tax",name:"UK VAT Calculator",desc:"Add or remove UK VAT at 20%, 5% or 0% — net, VAT and gross."},
  {id:"discount",cat:"finance",tag:"Finance",name:"Discount Calculator",desc:"Sale price after % off, how much you save, plus stacked discounts."},
  {id:"percentage",cat:"finance",tag:"Math",name:"Percentage Calculator",desc:"Percent of a number, what percent, and percentage increase or decrease."},
  {id:"creditcard",cat:"finance",tag:"Finance",name:"Credit Card Payoff Calculator",desc:"Months to clear a card balance, total interest and payoff date."},
  {id:"rent",cat:"finance",tag:"Finance",name:"Rent Affordability Calculator",desc:"How much rent you can afford on your income — the 30% and 40x rules."},
  {id:"inflation",cat:"finance",tag:"Finance",name:"Inflation Calculator",desc:"What today's money will cost in future years at any inflation rate."},
  {id:"bmi",cat:"health",tag:"Health",name:"BMI Calculator",desc:"Body Mass Index from height and weight in imperial or metric, with healthy range."},
  {id:"calorie",cat:"health",tag:"Health",name:"Calorie & TDEE Calculator",desc:"Daily calories for your age, size, activity level and weight goal."},
  {id:"pregnancy",cat:"health",tag:"Health",name:"Pregnancy Due Date Calculator",desc:"Estimated due date, weeks pregnant and trimester from your last period."},
  {id:"water",cat:"health",tag:"Health",name:"Water Intake Calculator",desc:"How much water to drink daily based on your weight and exercise."},
  {id:"idealweight",cat:"health",tag:"Health",name:"Ideal Weight Calculator",desc:"Healthy weight range for your height by BMI and the Devine formula."},
  {id:"pace",cat:"health",tag:"Fitness",name:"Running Pace Calculator",desc:"Pace per mile or kilometre, speed and finish times for 5K, 10K and marathons."},
  {id:"unit",cat:"math",tag:"Convert",name:"Unit Converter",desc:"Feet to metres, pounds to kilos, °F to °C, gallons, acres, mph and more."},
  {id:"fraction",cat:"math",tag:"Math",name:"Fraction Calculator",desc:"Add, subtract, multiply and divide fractions — simplified, mixed and decimal."},
  {id:"randomnum",cat:"math",tag:"Math",name:"Random Number Generator",desc:"Pick random numbers in any range, with or without repeats."},
  {id:"hours",cat:"math",tag:"Everyday",name:"Hours Calculator",desc:"Work hours between start and finish times, minus breaks, with pay."},
  {id:"datediff",cat:"math",tag:"Dates",name:"Date Difference Calculator",desc:"Days, weeks, months and years between two dates."},
  {id:"daysuntil",cat:"math",tag:"Dates",name:"Days Countdown Calculator",desc:"How many days until a birthday, holiday, deadline or any date."},
  {id:"roman",cat:"math",tag:"Math",name:"Roman Numeral Converter",desc:"Convert numbers to Roman numerals and Roman numerals back to numbers."},
  {id:"average",cat:"math",tag:"Math",name:"Average Calculator",desc:"Mean, median, mode, sum, range and more for any list of numbers."},
  {id:"caseconv",cat:"text",tag:"Text",name:"Case Converter",desc:"UPPERCASE, lowercase, Title Case, camelCase, snake_case and more."},
  {id:"lorem",cat:"text",tag:"Text",name:"Lorem Ipsum Generator",desc:"Placeholder paragraphs, sentences and words for designs and mockups."},
  {id:"dedupe",cat:"text",tag:"Text",name:"Remove Duplicate Lines",desc:"Delete repeated lines from a list, keeping the first copy of each."},
  {id:"slug",cat:"text",tag:"Developer",name:"Slug Generator",desc:"Turn a title into a clean URL slug for blogs and websites."},
  {id:"json",cat:"text",tag:"Developer",name:"JSON Formatter",desc:"Format, validate and minify JSON with clear error messages."},
  {id:"base64",cat:"text",tag:"Developer",name:"Base64 Encoder/Decoder",desc:"Encode text to Base64 or decode Base64 back to readable text."},
  {id:"urlenc",cat:"text",tag:"Developer",name:"URL Encode / Decode",desc:"Percent-encode URLs and decode them back safely."},
  {id:"hexrgb",cat:"text",tag:"Developer",name:"Color Picker",desc:"Pick a colour and convert between HEX, RGB and HSL values, with a live preview swatch."},
  {id:"uuid",cat:"text",tag:"Developer",name:"UUID Generator",desc:"Generate random UUIDs (v4) one at a time or in bulk."},
  {id:"baseconv",cat:"text",tag:"Developer",name:"Number Base Converter",desc:"Convert between binary, octal, decimal and hexadecimal."},
  {id:"textrev",cat:"text",tag:"Text",name:"Text Reverser",desc:"Reverse text by characters, words or lines."},
  {id:"imageresize",cat:"media",tag:"Image",name:"Image Resizer",desc:"Resize a JPG, PNG or WebP to exact pixel dimensions and download it."},
  {id:"charcount",cat:"media",tag:"Social",name:"Social Media Character Counter",desc:"Character limits for X, Instagram, TikTok, LinkedIn, Facebook and YouTube."},
  {id:"gradecalc",cat:"study",tag:"Study",name:"Grade Calculator",desc:"Convert a score or percentage to US letter grades and UK degree classes."},
  {id:"finalgrade",cat:"study",tag:"Study",name:"Final Grade Calculator",desc:"What score you need on the final exam to hit your target grade."},
  {id:"dice",cat:"fun",tag:"Fun",name:"Dice Roller",desc:"Roll up to 10 dice of any size — d6, d20 and more — with totals."},
  {id:"coin",cat:"fun",tag:"Fun",name:"Coin Flip",desc:"Flip a coin as many times as you like, with heads and tails stats."},
  {id:"stopwatch",cat:"fun",tag:"Timer",name:"Stopwatch",desc:"Precise stopwatch with laps, down to hundredths of a second."},
  {id:"timer",cat:"fun",tag:"Timer",name:"Countdown Timer",desc:"Set minutes and seconds, with a progress bar and a finish chime."},
  {id:"namepicker",cat:"fun",tag:"Fun",name:"Random Name Picker",desc:"Pick a random winner or name from a list — great for giveaways and classes."},
  {id:"budgetrule",cat:"finance",tag:"Finance",name:"50/30/20 Budget Rule Calculator",desc:"Split your take-home pay into needs (50%), wants (30%) and savings (20%)."},
  {id:"emergencyfund",cat:"finance",tag:"Finance",name:"Emergency Fund Calculator",desc:"How big your emergency fund should be — and how long it will take to build."},
  {id:"debtsnowball",cat:"finance",tag:"Finance",name:"Debt Snowball Payoff Calculator",desc:"Pay off multiple debts smallest-first and see your debt-free date."},
  {id:"retirement",cat:"finance",tag:"Finance",name:"Retirement Savings Calculator",desc:"Project your pension / 401(k) / RRSP pot at retirement age."},
  {id:"autoloan",cat:"finance",tag:"Finance",name:"Auto Loan Calculator",desc:"Monthly car payment with down payment and trade-in, plus total interest."},
  {id:"studentloan",cat:"finance",tag:"Finance",name:"Student Loan Calculator",desc:"Monthly student loan payment, total interest and payoff date."},
  {id:"networth",cat:"finance",tag:"Finance",name:"Net Worth Calculator",desc:"Everything you own minus everything you owe — your financial snapshot."},
  {id:"freelancerate",cat:"finance",tag:"Finance",name:"Freelance Hourly Rate Calculator",desc:"The hourly rate you must charge to hit your target income after tax and time off."},
  {id:"overtimepay",cat:"finance",tag:"Finance",name:"Overtime Pay Calculator",desc:"Regular plus overtime pay at 1.5x or 2x — weekly and monthly totals."},
  {id:"paint",cat:"home",tag:"Home",name:"Paint Calculator",desc:"Gallons and litres of paint needed for any room, doors, windows and coats included."},
  {id:"tile",cat:"home",tag:"Home",name:"Tile & Flooring Calculator",desc:"Tiles, boxes and flooring packs needed for a room, with wastage allowance."},
  {id:"weddingbudget",cat:"home",tag:"Life",name:"Wedding Budget Planner",desc:"Split a wedding budget across venue, food, photo, attire and more — per guest too."},
  {id:"movingcost",cat:"home",tag:"Home",name:"Moving Cost Estimator",desc:"Estimate house-moving costs by distance and home size."},
  {id:"sleepcycle",cat:"health",tag:"Health",name:"Sleep Cycle Calculator",desc:"Best bedtimes and wake times in 90-minute sleep cycles."},
  {id:"macrocalc",cat:"health",tag:"Health",name:"Macro Calculator",desc:"Daily protein, carbs and fats in grams for your calories and goal."},
  {id:"ovulation",cat:"health",tag:"Health",name:"Ovulation Calculator",desc:"Ovulation day, fertile window and next period from your last period."},
  {id:"engagementrate",cat:"creator",tag:"Creator",name:"Social Media Engagement Rate Calculator",desc:"Engagement rate from followers, likes, comments and shares — with a quality rating."},
  {id:"ytearnings",cat:"creator",tag:"Creator",name:"YouTube Earnings Estimator",desc:"Estimate YouTube income from monthly views and your niche RPM."},
  {id:"hashtaggen",cat:"creator",tag:"Creator",name:"Hashtag Generator",desc:"Ready-to-copy Instagram and TikTok hashtags for any topic."},
  {id:"readingtime",cat:"text",tag:"Text",name:"Reading & Speaking Time Calculator",desc:"How long a text takes to read silently and aloud — for speeches, videos and lessons."},
  {id:"evcharging",cat:"home",tag:"Home",name:"EV Charging Cost Calculator",desc:"Cost per charge, per mile and per month for an electric car at home."},
  {id:"kwdensity",cat:"seo",tag:"SEO",name:"Keyword Density Checker",desc:"Paste text and a keyword — see count, density % and placement stats."},
  {id:"metagen",cat:"seo",tag:"SEO",name:"Meta Tag Generator",desc:"Build ready-to-paste meta, Open Graph and Twitter Card tags."},
  {id:"serppreview",cat:"seo",tag:"SEO",name:"Google SERP Preview Tool",desc:"See how your title, URL and description will look in Google results."},
  {id:"robotsgen",cat:"seo",tag:"SEO",name:"Robots.txt Generator",desc:"Create a valid robots.txt with bot rules and your sitemap."},
  {id:"sitemapgen",cat:"seo",tag:"SEO",name:"XML Sitemap Generator",desc:"Turn a list of URLs into a valid sitemap.xml file."},
  {id:"schemagen",cat:"seo",tag:"SEO",name:"Schema Markup Generator",desc:"JSON-LD schema for Local Business, FAQ, Article, Product and WebSite."},
  {id:"utmbuilder",cat:"seo",tag:"Marketing",name:"UTM Campaign Link Builder",desc:"Add UTM tracking parameters to any link for Google Analytics."},
  {id:"readability",cat:"seo",tag:"SEO",name:"Readability Score Checker",desc:"Flesch Reading Ease and grade level for any pasted text."},
  {id:"headinganalyzer",cat:"seo",tag:"SEO",name:"Heading Structure Analyzer",desc:"Extract the H1–H6 outline from HTML or Markdown and spot problems."},
  {id:"textsimilarity",cat:"seo",tag:"SEO",name:"Text Similarity Checker",desc:"Compare two texts and see their percentage similarity."},
  {id:"seochecker",cat:"seo",tag:"SEO",name:"SEO Title & Description Checker",desc:"Character and pixel length checks with too-long / too-short warnings."},
  {id:"ogpreview",cat:"seo",tag:"Marketing",name:"Social Share Preview Tool",desc:"Preview how a link will look when shared on Facebook, X and LinkedIn."},
  {id:"energycost",cat:"home",tag:"Home",name:"Appliance Energy Cost Calculator",desc:"What any appliance really costs to run — per day, month and year at your electricity price."},
  {id:"solarsavings",cat:"home",tag:"Home",name:"Solar Panel Savings Estimator",desc:"Yearly solar generation, bill savings and payback period for rooftop solar."},
  {id:"evvsgas",cat:"home",tag:"Home",name:"EV vs Gas Car Cost Calculator",desc:"Compare yearly fuel cost of a petrol / gasoline car with home EV charging."},
  {id:"refinance",cat:"finance",tag:"Finance",name:"Mortgage Refinance Break-Even Calculator",desc:"Months until a refinance pays for its closing costs — and total interest saved."},
  {id:"rentvsbuy",cat:"finance",tag:"Finance",name:"Rent vs Buy Calculator",desc:"Compare the true cost of renting versus buying over the years you will stay."},
  {id:"takehome",cat:"finance",tag:"Finance",name:"Take-Home Pay Calculator",desc:"Simplified after-tax pay estimate with selectable tax systems. Estimate only."},
  {id:"runway",cat:"finance",tag:"Finance",name:"Savings Runway Calculator",desc:"How many months your savings last if your income stops."},
  {id:"subscriptions",cat:"finance",tag:"Finance",name:"Subscription Cost Calculator",desc:"Add up every subscription — see the true monthly and yearly total."},
  {id:"unitprice",cat:"finance",tag:"Everyday",name:"Unit Price Calculator",desc:"Compare price per ounce, gram or litre and find the genuinely cheaper product."},
  {id:"commutecost",cat:"finance",tag:"Finance",name:"Commute Cost & WFH Savings Calculator",desc:"What your commute costs per month — and what working from home saves."},
  {id:"payraise",cat:"finance",tag:"Finance",name:"Pay Raise Calculator",desc:"New salary after a percentage raise, plus monthly and hourly differences."},
  {id:"timezoneplanner",cat:"math",tag:"Remote Work",name:"Time Zone Meeting Planner",desc:"Pick a meeting time in one city and see it instantly in cities around the world."},
{id:"summarizer",cat:"text",tag:"Text",name:"Text Summarizer",desc:"Paste any article or essay and get a short summary — the key sentences, picked on your device."},
  {id:"citation",cat:"study",tag:"Study",name:"Citation Generator",desc:"Build APA 7, MLA 9 and Chicago citations from author, title, year and source details."},
  {id:"texteditor",cat:"text",tag:"Text",name:"Online Text Editor",desc:"A clean writing pad with live word count, case tools and one-click download as a text file."},
  {id:"speechtotext",cat:"text",tag:"Text",name:"Speech to Text",desc:"Dictate with your microphone and turn speech into text in your browser — nothing is uploaded."},
  {id:"smalltext",cat:"text",tag:"Text",name:"Small Text Generator",desc:"Turn normal text into small caps, superscript, tiny and bubble styles you can copy anywhere."},
  {id:"invisiblechar",cat:"text",tag:"Text",name:"Invisible Character",desc:"Copy a blank invisible character — zero-width space, Hangul filler or Braille blank — and test it."},
  {id:"texttobinary",cat:"text",tag:"Developer",name:"Text to Binary Converter",desc:"Convert text into binary code — every character as 8-bit bytes, fully UTF-8 aware."},
  {id:"binarytotext",cat:"text",tag:"Developer",name:"Binary to Text Converter",desc:"Decode binary code back into readable text, with spaces between bytes or without."},
  {id:"imageconverter",cat:"media",tag:"Image",name:"Image Converter",desc:"Convert images between JPG, PNG and WebP in your browser — no upload and no watermark."},
  {id:"svgtopng",cat:"media",tag:"Image",name:"SVG to PNG Converter",desc:"Turn an SVG file or pasted SVG code into a crisp PNG at exactly the size you choose."},
  {id:"favicon",cat:"media",tag:"Image",name:"Favicon Generator",desc:"Create a favicon from text, an emoji or your own image — download PNG sizes and an ICO file."},
  {id:"meme",cat:"media",tag:"Image",name:"Meme Generator",desc:"Add top and bottom text to any image and download your meme — made entirely on your device."},
  {id:"emojipicker",cat:"media",tag:"Social",name:"Emoji Picker",desc:"Search and tap to copy emojis for messages, posts and bios — faces, animals, food and more."},
  {id:"compresskb",cat:"media",tag:"Image",name:"Compress Image to KB",desc:"Shrink an image to under 20KB, 50KB, 100KB, 200KB or any target size you set."},
  {id:"mergepdf",cat:"pdf",tag:"PDF",name:"Merge PDF",desc:"Combine several PDF files into one, in the order you choose — files never leave your device."},
  {id:"splitpdf",cat:"pdf",tag:"PDF",name:"Split PDF",desc:"Extract a page range from a PDF, or split every page into its own file."},
  {id:"rotatepdf",cat:"pdf",tag:"PDF",name:"Rotate PDF",desc:"Rotate PDF pages 90, 180 or 270 degrees and download the corrected file."},
  {id:"jpgtopdf",cat:"pdf",tag:"PDF",name:"JPG to PDF Converter",desc:"Turn JPG, PNG and WebP images into a single tidy PDF document."},
  {id:"pdftojpg",cat:"pdf",tag:"PDF",name:"PDF to JPG Converter",desc:"Convert PDF pages into JPG images you can download, page by page."},
  {id:"hoursminutes",cat:"math",tag:"Dates",name:"Hours & Minutes Calculator",desc:"Time between two times, plus add or subtract hours and minutes from any time."},
  {id:"htmlviewer",cat:"text",tag:"Developer",name:"HTML Viewer",desc:"Paste HTML and see it rendered live, side by side with a neatly formatted source view."},
  {id:"mybrowser",cat:"text",tag:"Utility",name:"What Is My Browser?",desc:"See your browser name and version, operating system, screen size, language and user agent."}
];
var ICONS={
  mortgage:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>',
  tip:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3h16v18l-2-1.5L16 21l-2-1.5L12 21l-2-1.5L8 21l-2-1.5L4 21z"/><path d="M8 8h8M8 12h8"/></svg>',
  salary:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  gpa:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 9L12 4 2 9l10 5 10-5z"/><path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5"/><path d="M22 9v5"/></svg>',
  age:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
  image:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></svg>',
  words:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V5h16v2M12 5v14M9 19h6"/></svg>',
  qr:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM21 14v.01M14 21v.01M18 18h3v3h-3z"/></svg>',
  password:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="16" r="1.6"/></svg>'
};
var TILECOLORS={finance:["#FFD23F","#141310"],health:["#BDEB9E","#141310"],math:["#A7EBC8","#141310"],text:["#FFB3C7","#141310"],media:["#8ED8F8","#141310"],study:["#BFE3FF","#141310"],fun:["#FF8A7A","#141310"],home:["#FFC59E","#141310"],creator:["#D9C6FF","#141310"],seo:["#C8F542","#141310"],pdf:["#F0B8FF","#141310"]};
var activeCat="all";
var FEATURED_IDS=["mortgage","password","image","words","bmi","qr","vat","gpa","mergepdf","summarizer"];
window.FEATURED_IDS=FEATURED_IDS;
function renderGrid(){
  var q=($("toolSearch").value||"").toLowerCase().trim();
  var grid=$("toolGrid");grid.innerHTML="";var shown=0;
  TOOLS.forEach(function(t){
    if(activeCat==="featured"){if(FEATURED_IDS.indexOf(t.id)===-1)return;}
    else if(activeCat!=="all"&&t.cat!==activeCat)return;
    if(q&&(t.name+" "+t.desc+" "+t.tag).toLowerCase().indexOf(q)===-1)return;
    shown++;
    var b=document.createElement("button");b.className="card";b.type="button";
    b.setAttribute("aria-label","Open "+t.name);
    b.innerHTML='<span class="icon"></span><h3></h3><p></p><span class="meta"><span class="tag"></span><span class="go">Use tool →</span></span>';
    var tile=b.querySelector(".icon");var tc=TILECOLORS[t.cat]||TILECOLORS.finance;tile.textContent=t.name.charAt(0);tile.style.background=tc[0];tile.style.color=tc[1];
    b.querySelector("h3").textContent=t.name;
    b.querySelector("p").textContent=t.desc;
    b.querySelector(".tag").textContent=t.tag;
    b.addEventListener("click",function(){openTool(t.id);});
    grid.appendChild(b);
  });
  $("noResults").style.display=shown?"none":"block";
}
document.querySelectorAll(".chip").forEach(function(ch){
  ch.addEventListener("click",function(){
    document.querySelectorAll(".chip").forEach(function(c){c.classList.remove("active");});
    ch.classList.add("active");activeCat=ch.getAttribute("data-cat");renderGrid();
  });
});
document.querySelectorAll("[data-navcat]").forEach(function(a){
  a.addEventListener("click",function(){
    var cat=a.getAttribute("data-navcat");
    document.querySelectorAll(".chip").forEach(function(c){c.classList.toggle("active",c.getAttribute("data-cat")===cat);});
    activeCat=cat;renderGrid();
  });
});
$("toolSearch").addEventListener("input",renderGrid);

function openTool(id){
  document.querySelectorAll(".tool-panel").forEach(function(p){p.classList.remove("open");});
  var panel=$("panel-"+id);if(!panel)return;
  panel.classList.add("open");
  try{history.replaceState(null,"","#"+id);}catch(e){}
  panel.scrollIntoView({behavior:"smooth",block:"start"});
  if(id==="qr")generateQR();
}
function closeTools(){
  document.querySelectorAll(".tool-panel").forEach(function(p){p.classList.remove("open");});
  try{history.replaceState(null,"","#tools");}catch(e){}
  $("tools").scrollIntoView({behavior:"smooth"});
}
function goHome(e){e.preventDefault();closeTools();window.scrollTo({top:0,behavior:"smooth"});return false;}
document.querySelectorAll("[data-back]").forEach(function(b){b.addEventListener("click",closeTools);});
renderGrid();

/* ============ Segmented controls ============ */
function segWire(id,cb){
  var seg=$(id);if(!seg)return;
  seg.querySelectorAll("button").forEach(function(b){
    b.addEventListener("click",function(){
      seg.querySelectorAll("button").forEach(function(x){x.classList.remove("active");});
      b.classList.add("active");cb(b);
    });
  });
}

/* ============ 1. Mortgage ============ */
var mortCur="USD";
segWire("mortCurrSeg",function(b){mortCur=b.getAttribute("data-cur");calcMortgage();});
function calcMortgage(){
  var price=num("mPrice"),down=num("mDown"),rate=num("mRate")/100/12,months=num("mTerm")*12;
  var loan=Math.max(price-down,0);
  var pi=0;
  if(loan>0&&months>0){pi=rate>0?loan*rate*Math.pow(1+rate,months)/(Math.pow(1+rate,months)-1):loan/months;}
  var taxM=num("mTax")/12,insM=num("mIns")/12,hoa=num("mHoa");
  var total=pi+taxM+insM+hoa;
  var totalPaid=pi*months,interest=Math.max(totalPaid-loan,0);
  $("mMonthly").textContent=fmtMoney(total,mortCur);
  $("mPI").textContent=fmtMoney(pi,mortCur);
  $("mTaxM").textContent=fmtMoney(taxM,mortCur);
  $("mInsM").textContent=fmtMoney(insM,mortCur);
  $("mHoaM").textContent=fmtMoney(hoa,mortCur);
  $("mLoan").textContent=fmtMoney0(loan,mortCur);
  $("mDownOut").textContent=fmtMoney0(down,mortCur)+(price>0?" ("+(down/price*100).toFixed(1)+"%)":"");
  $("mInterest").textContent=fmtMoney0(interest,mortCur);
  $("mTotal").textContent=fmtMoney0(totalPaid,mortCur);
  var now=new Date();var payoff=new Date(now.getFullYear(),now.getMonth()+months,1);
  $("mPayoff").textContent=months>0?payoff.toLocaleDateString("en-US",{month:"long",year:"numeric"}):"—";
  var tot=loan+interest;
  var pp=tot>0?Math.round(loan/tot*100):0;
  $("mPrinBar").style.width=pp+"%";$("mIntBar").style.width=(100-pp)+"%";
  $("mPrinPct").textContent=pp+"%";$("mIntPct").textContent=(100-pp)+"%";
}
["mPrice","mDown","mRate","mTax","mIns","mHoa"].forEach(function(id){$(id).addEventListener("input",calcMortgage);});
$("mTerm").addEventListener("change",calcMortgage);
$("mCalc").addEventListener("click",function(){calcMortgage();toast("Mortgage payment updated");});
calcMortgage();

/* ============ 2. Tip ============ */
var tipCur="USD",tipPct=18;
segWire("tipCurrSeg",function(b){tipCur=b.getAttribute("data-cur");calcTip();});
document.querySelectorAll("#tipPresets button").forEach(function(b){
  b.addEventListener("click",function(){
    document.querySelectorAll("#tipPresets button").forEach(function(x){x.classList.remove("active");});
    b.classList.add("active");tipPct=parseFloat(b.getAttribute("data-tip"));$("tCustom").value="";calcTip();
  });
});
$("tCustom").addEventListener("input",function(){
  if($("tCustom").value!==""){document.querySelectorAll("#tipPresets button").forEach(function(x){x.classList.remove("active");});}
  calcTip();
});
$("tPeople").addEventListener("input",function(){
  var n=num("tPeople");$("tPeopleLabel").textContent=n+(n===1?" person":" people");calcTip();
});
$("tBill").addEventListener("input",calcTip);
function calcTip(){
  var bill=num("tBill");
  var pct=$("tCustom").value!==""?parseFloat($("tCustom").value)||0:tipPct;
  var people=Math.max(1,num("tPeople")||1);
  var tip=bill*pct/100,total=bill+tip;
  $("tPerPerson").textContent=fmtMoney(total/people,tipCur);
  $("tTipAmt").textContent=fmtMoney(tip,tipCur);
  $("tTotal").textContent=fmtMoney(total,tipCur);
  $("tTipPP").textContent=fmtMoney(tip/people,tipCur);
  $("tBillPP").textContent=fmtMoney(bill/people,tipCur);
  $("tEff").textContent=pct+"% of the bill";
}
calcTip();

/* ============ 3. Salary ============ */
var salCur="USD",salMode="toHourly";
segWire("salCurrSeg",function(b){salCur=b.getAttribute("data-cur");calcSalary();});
segWire("salModeSeg",function(b){
  salMode=b.getAttribute("data-mode");
  $("salAmtLabel").textContent=salMode==="toHourly"?"Annual salary (gross, before tax)":"Hourly rate (gross, before tax)";
  $("salHeadlineLabel").textContent=salMode==="toHourly"?"Your hourly rate":"Your annual salary";
  $("sAmount").value=salMode==="toHourly"?"65000":"31.25";
  calcSalary();
});
function calcSalary(){
  var amt=num("sAmount"),hrs=num("sHours")||40,weeks=num("sWeeks")||52;
  var yearly=salMode==="toHourly"?amt:amt*hrs*weeks;
  var hourly=hrs*weeks>0?yearly/(hrs*weeks):0;
  var hoursPerDay=hrs/5;
  $("sHeadline").textContent=fmtMoney(salMode==="toHourly"?hourly:yearly,salCur);
  $("sHourly").textContent=fmtMoney(hourly,salCur);
  $("sDaily").textContent=fmtMoney(hourly*hoursPerDay,salCur);
  $("sWeekly").textContent=fmtMoney(hourly*hrs,salCur);
  $("sBiweekly").textContent=fmtMoney(hourly*hrs*2,salCur);
  $("sMonthly").textContent=fmtMoney(yearly/12,salCur);
  $("sYearly").textContent=fmtMoney0(yearly,salCur);
}
["sAmount","sHours","sWeeks"].forEach(function(id){$(id).addEventListener("input",calcSalary);});
calcSalary();

/* ============ 4. GPA ============ */
var GRADE_POINTS={"A+":4.0,"A":4.0,"A-":3.7,"B+":3.3,"B":3.0,"B-":2.7,"C+":2.3,"C":2.0,"C-":1.7,"D+":1.3,"D":1.0,"D-":0.7,"F":0.0};
function gradeOptions(sel){
  var out="";Object.keys(GRADE_POINTS).forEach(function(g){out+='<option value="'+g+'"'+(g===sel?" selected":"")+'>'+g+" ("+GRADE_POINTS[g].toFixed(1)+")</option>";});
  return out;
}
function addCourse(name,credits,grade){
  var row=document.createElement("div");row.className="course-row";
  row.innerHTML='<input type="text" class="g-name" placeholder="e.g. English 101" aria-label="Course name" />'+
    '<input type="number" class="g-credits" min="0" max="12" step="0.5" value="3" aria-label="Credits" />'+
    '<select class="g-grade" aria-label="Grade">'+gradeOptions(grade||"A")+'</select>'+
    '<button type="button" class="icon-btn" aria-label="Remove course">×</button>';
  if(name)row.querySelector(".g-name").value=name;
  if(credits)row.querySelector(".g-credits").value=credits;
  row.querySelector(".icon-btn").addEventListener("click",function(){row.remove();calcGPA();});
  row.querySelectorAll("input,select").forEach(function(el){el.addEventListener("input",calcGPA);el.addEventListener("change",calcGPA);});
  $("gpaRows").appendChild(row);
}
function calcGPA(){
  var points=0,credits=0;
  document.querySelectorAll("#gpaRows .course-row").forEach(function(r){
    var c=parseFloat(r.querySelector(".g-credits").value)||0;
    var g=r.querySelector(".g-grade").value;
    if(c>0){credits+=c;points+=c*(GRADE_POINTS[g]||0);}
  });
  var gpa=credits>0?points/credits:0;
  $("gpaResult").textContent=credits>0?gpa.toFixed(2):"—";
  $("gpaCredits").textContent=credits>0?credits:"—";
  $("gpaPoints").textContent=credits>0?points.toFixed(1):"—";
  $("gpaBar").style.width=credits>0?(gpa/4*100)+"%":"0%";
  var v=$("gpaVerdict");
  if(credits===0)v.textContent="Add at least one course with credits and a grade.";
  else if(gpa>=3.9)v.textContent="Outstanding — summa cum laude territory at most schools.";
  else if(gpa>=3.7)v.textContent="Excellent — Dean's List level at most colleges.";
  else if(gpa>=3.5)v.textContent="Great work — honors (cum laude) range at many schools.";
  else if(gpa>=3.0)v.textContent="Solid B average — meets most internship and program minimums.";
  else if(gpa>=2.0)v.textContent="Passing, but below the 3.0 many employers and grad schools look for.";
  else v.textContent="Below 2.0 risks academic probation at most schools — talk to your advisor about support options.";
  var prior=parseFloat($("gpaPrior").value),priorCr=parseFloat($("gpaPriorCredits").value);
  if(!isNaN(prior)&&!isNaN(priorCr)&&priorCr>0&&credits>0){
    var cum=(prior*priorCr+points)/(priorCr+credits);
    $("gpaCumulative").textContent=cum.toFixed(2)+" (over "+(priorCr+credits)+" credits)";
  }else $("gpaCumulative").textContent="Add prior GPA + credits";
}
$("gpaAdd").addEventListener("click",function(){addCourse("",3,"A");});
$("gpaCalc").addEventListener("click",function(){calcGPA();toast("GPA updated");});
["gpaPrior","gpaPriorCredits"].forEach(function(id){$(id).addEventListener("input",calcGPA);});
addCourse("English 101",3,"A");addCourse("Calculus I",4,"B+");addCourse("Biology 110",3,"A-");addCourse("",3,"B");
calcGPA();

/* ============ 5. Image Compressor ============ */
var imgFileObj=null,imgURL=null,compURL=null;
var drop=$("imgDrop"),fileInput=$("imgFile");
drop.addEventListener("click",function(){fileInput.click();});
drop.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();fileInput.click();}});
["dragover","dragenter"].forEach(function(ev){drop.addEventListener(ev,function(e){e.preventDefault();drop.classList.add("over");});});
["dragleave","drop"].forEach(function(ev){drop.addEventListener(ev,function(e){e.preventDefault();drop.classList.remove("over");});});
drop.addEventListener("drop",function(e){var f=e.dataTransfer.files&&e.dataTransfer.files[0];if(f)loadImageFile(f);});
fileInput.addEventListener("change",function(){if(fileInput.files[0])loadImageFile(fileInput.files[0]);});
function fmtBytes(b){
  if(b<1024)return b+" B";if(b<1024*1024)return (b/1024).toFixed(1)+" KB";return (b/(1024*1024)).toFixed(2)+" MB";
}
function loadImageFile(f){
  if(!/^image\/(jpeg|png|webp)$/.test(f.type)){toast("Please choose a JPG, PNG or WebP image");return;}
  imgFileObj=f;
  if(imgURL)URL.revokeObjectURL(imgURL);
  imgURL=URL.createObjectURL(f);
  $("imgOrigPreview").src=imgURL;
  $("imgOrigSize").textContent=f.name+" · "+fmtBytes(f.size);
  $("imgCompress").disabled=false;
  $("imgCompSize").textContent="—";$("imgSavings").style.display="none";$("imgDownload").classList.add("hidden");
  toast("Image loaded — press Compress");
}
$("imgQuality").addEventListener("input",function(){$("imgQualityVal").textContent=$("imgQuality").value+"%";});
$("imgCompress").addEventListener("click",function(){
  if(!imgFileObj)return;
  var img=new Image();
  img.onload=function(){
    var maxW=parseInt($("imgWidth").value,10)||0;
    var scale=maxW>0&&img.naturalWidth>maxW?maxW/img.naturalWidth:1;
    var w=Math.round(img.naturalWidth*scale),h=Math.round(img.naturalHeight*scale);
    var canvas=document.createElement("canvas");canvas.width=w;canvas.height=h;
    var ctx=canvas.getContext("2d");
    var format=$("imgFormat").value;
    if(format==="image/jpeg"){ctx.fillStyle="#ffffff";ctx.fillRect(0,0,w,h);}
    ctx.drawImage(img,0,0,w,h);
    var q=parseInt($("imgQuality").value,10)/100;
    canvas.toBlob(function(blob){
      if(!blob){toast("Compression failed — try a different format");return;}
      if(compURL)URL.revokeObjectURL(compURL);
      compURL=URL.createObjectURL(blob);
      $("imgCompPreview").src=compURL;
      $("imgCompSize").textContent=fmtBytes(blob.size)+" · "+w+"×"+h+"px";
      var saved=imgFileObj.size-blob.size,pct=imgFileObj.size>0?Math.round(saved/imgFileObj.size*100):0;
      var sv=$("imgSavings");sv.style.display="block";
      sv.textContent=pct>0?("You saved "+fmtBytes(saved)+" — the file is "+pct+"% smaller."):("Compressed to "+fmtBytes(blob.size)+" (about the same size — try a lower quality for a smaller file).");
      var ext=format==="image/png"?".png":format==="image/webp"?".webp":".jpg";
      var base=imgFileObj.name.replace(/\.[^.]+$/,"");
      var dl=$("imgDownload");dl.href=compURL;dl.setAttribute("download",base+"-compressed"+ext);dl.classList.remove("hidden");
    },format,q);
  };
  img.onerror=function(){toast("Could not read that image file");};
  img.src=imgURL;
});

/* ============ 6. Age ============ */
(function(){var t=new Date();var iso=t.toISOString().slice(0,10);$("aAt").value=iso;})();
function calcAge(){
  var dobVal=$("aDob").value,atVal=$("aAt").value;
  if(!dobVal){toast("Please choose a date of birth");return;}
  var dob=new Date(dobVal+"T00:00:00"),at=atVal?new Date(atVal+"T00:00:00"):new Date();
  if(dob>at){toast("Date of birth is after the “age at” date");return;}
  var y=at.getFullYear()-dob.getFullYear(),m=at.getMonth()-dob.getMonth(),d=at.getDate()-dob.getDate();
  if(d<0){m--;var prev=new Date(at.getFullYear(),at.getMonth(),0);d+=prev.getDate();}
  if(m<0){y--;m+=12;}
  $("aMain").textContent=y+" years, "+m+" months, "+d+" days";
  var totalDays=Math.floor((at-dob)/86400000);
  var totalMonths=y*12+m;
  $("aWeekday").textContent=dob.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});
  $("aMonths").textContent=fmtNum(totalMonths)+" months, "+d+" days";
  $("aWeeks").textContent=fmtNum(Math.floor(totalDays/7));
  $("aDays").textContent=fmtNum(totalDays);
  $("aHours").textContent=fmtNum(totalDays*24);
  var next=new Date(at.getFullYear(),dob.getMonth(),dob.getDate());
  if(next<=at)next=new Date(at.getFullYear()+1,dob.getMonth(),dob.getDate());
  var daysTo=Math.ceil((next-at)/86400000);
  $("aNext").textContent=next.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})+" (in "+daysTo+" day"+(daysTo===1?"":"s")+", turning "+(next.getFullYear()-dob.getFullYear())+")";
}
$("aCalc").addEventListener("click",calcAge);
$("aDob").addEventListener("change",function(){if($("aDob").value)calcAge();});

/* ============ 7. Word Counter ============ */
var STOP={the:1,be:1,to:1,of:1,and:1,a:1,in:1,that:1,it:1,was:1,for:1,on:1,are:1,as:1,with:1,his:1,they:1,i:1,at:1,by:1,this:1,had:1,not:1,are:1,but:1,from:1,or:1,have:1,an:1,they:1,which:1,one:1,you:1,were:1,her:1,all:1,she:1,there:1,would:1,their:1,we:1,or:1,been:1,has:1,when:1,who:1,will:1,more:1,no:1,if:1,out:1,so:1,said:1,what:1,up:1,its:1,about:1,into:1,than:1,them:1,can:1,only:1,other:1,new:1,some:1,could:1,time:1,these:1,two:1,may:1,then:1,do:1,first:1,any:1,my:1,now:1,such:1,like:1,our:1,over:1,man:1,me:1,even:1,most:1,made:1,after:1,also:1,did:1,many:1,before:1,must:1,through:1,back:1,years:1,where:1,much:1,your:1,way:1,well:1,down:1,should:1,because:1,each:1,just:1,those:1,people:1,mr:1,how:1,too:1,little:1,state:1,good:1,very:1,make:1,world:1,still:1,own:1,see:1,men:1,work:1,long:1,get:1,here:1,between:1,both:1,life:1,being:1,under:1,never:1,day:1,same:1,another:1,know:1,while:1,last:1,us:1,might:1,great:1,old:1,year:1,off:1,come:1,since:1,against:1,go:1,came:1,right:1,used:1,take:1,three:1,is:1,am:1,an:1};
function fmtTime(mins){
  if(mins<1)return Math.max(1,Math.round(mins*60))+" sec";
  if(mins<60)return Math.round(mins*10)/10+" min";
  var h=Math.floor(mins/60),mm=Math.round(mins%60);return h+" hr "+mm+" min";
}
function countWords(){
  var text=$("wText").value;
  var words=text.trim()?text.trim().split(/\s+/).filter(Boolean):[];
  var wc=words.length;
  $("wWords").textContent=fmtNum(wc);
  $("wChars").textContent=fmtNum(text.length);
  $("wCharsNS").textContent=fmtNum(text.replace(/\s/g,"").length);
  var sent=text.trim()?(text.match(/[.!?]+(\s|$)/g)||[]).length:0;
  if(text.trim()&&sent===0)sent=1;
  $("wSent").textContent=fmtNum(sent);
  var paras=text.trim()?text.split(/\n\s*\n/).filter(function(p){return p.trim();}).length:0;
  $("wPara").textContent=fmtNum(paras);
  var longest="—",maxL=0;
  words.forEach(function(w){var clean=w.replace(/[^A-Za-z'-]/g,"");if(clean.length>maxL){maxL=clean.length;longest=clean;}});
  $("wLongest").textContent=wc?longest+" ("+maxL+" letters)":"—";
  $("wRead").textContent=wc?fmtTime(wc/200):"0 min";
  $("wSpeak").textContent=wc?fmtTime(wc/130):"0 min";
  var freq={};
  words.forEach(function(w){
    var clean=w.toLowerCase().replace(/[^a-z'-]/g,"");
    if(clean.length>=3&&!STOP[clean])freq[clean]=(freq[clean]||0)+1;
  });
  var top=Object.keys(freq).sort(function(a,b){return freq[b]-freq[a];}).slice(0,5);
  var box=$("wTop");
  if(!top.length){box.innerHTML='<p class="note" style="margin:0">Your most-used words will appear here (words of 3+ letters, common short words excluded).</p>';return;}
  box.innerHTML=top.map(function(w){
    var pct=wc?Math.round(freq[w]/wc*1000)/10:0;
    return '<div class="kv"><span>'+w.replace(/</g,"&lt;")+'</span><b>'+freq[w]+"× · "+pct+'%</b></div>';
  }).join("");
}
$("wText").addEventListener("input",countWords);
$("wClear").addEventListener("click",function(){$("wText").value="";countWords();$("wText").focus();});
$("wCopy").addEventListener("click",function(){if($("wText").value)copyText($("wText").value,"Text copied");else toast("Nothing to copy yet");});
countWords();

/* ============ 8. QR ============ */
var qrInstance=null;
function qrLevel(v){if(typeof QRCode!=="undefined"){return {L:QRCode.CorrectLevel.L,M:QRCode.CorrectLevel.M,Q:QRCode.CorrectLevel.Q,H:QRCode.CorrectLevel.H}[v]||QRCode.CorrectLevel.M;}return 0;}
function generateQR(){
  var text=($("qText").value||"").trim();
  var out=$("qrOut");
  if(!text){out.innerHTML='<span style="color:#5d6d66;font-size:.92rem">Enter a link or text first</span>';$("qDownload").disabled=true;return;}
  if(typeof QRCode==="undefined"){out.innerHTML='<span style="color:#b3261e;font-size:.92rem">QR library could not load — check your connection and try again.</span>';return;}
  var size=parseInt($("qSize").value,10)||300;
  out.innerHTML="";
  qrInstance=new QRCode(out,{text:text,width:size,height:size,colorDark:"#111111",colorLight:"#ffffff",correctLevel:qrLevel($("qLevel").value)});
  $("qDownload").disabled=false;
}
$("qGen").addEventListener("click",generateQR);
["qSize","qLevel"].forEach(function(id){$(id).addEventListener("change",generateQR);});
$("qDownload").addEventListener("click",function(){
  var canvas=$("qrOut").querySelector("canvas");
  var img=$("qrOut").querySelector("img");
  var url=null;
  if(canvas)url=canvas.toDataURL("image/png");
  else if(img&&img.src)url=img.src;
  if(!url){toast("Generate a QR code first");return;}
  var a=document.createElement("a");a.href=url;a.download="qr-code.png";document.body.appendChild(a);a.click();document.body.removeChild(a);
  toast("QR code downloaded");
});

/* ============ 9. Password ============ */
function buildPool(){
  var pool="";
  if($("pUpper").checked)pool+="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if($("pLower").checked)pool+="abcdefghijklmnopqrstuvwxyz";
  if($("pNums").checked)pool+="0123456789";
  if($("pSyms").checked)pool+="!@#$%^&*()-_=+[]{}<>?";
  if($("pNoAmb").checked)pool=pool.replace(/[O0l1I|]/g,"");
  return pool;
}
function genPassword(){
  var pool=buildPool();
  var len=parseInt($("pLen").value,10)||16;
  if(!pool){toast("Tick at least one character type");return;}
  var arr=new Uint32Array(len);crypto.getRandomValues(arr);
  var pw="";for(var i=0;i<len;i++)pw+=pool[arr[i]%pool.length];
  $("pOut").textContent=pw;
  var entropy=len*Math.log2(pool.length);
  $("pEntropy").textContent=Math.round(entropy)+" bits";
  $("pPool").textContent=pool.length+" characters";
  var label,color,pct;
  if(entropy<40){label="Weak";color="#b3261e";pct=25;}
  else if(entropy<60){label="Fair";color="#d97706";pct=45;}
  else if(entropy<80){label="Strong";color="#0b6e5d";pct=70;}
  else{label="Excellent";color="#0b6e5d";pct=100;}
  $("pStrength").textContent=label;
  var bar=$("pBar");bar.style.width=pct+"%";bar.style.background=color;
}
$("pLen").addEventListener("input",function(){$("pLenVal").textContent=$("pLen").value;genPassword();});
["pUpper","pLower","pNums","pSyms","pNoAmb"].forEach(function(id){$(id).addEventListener("change",genPassword);});
$("pGen").addEventListener("click",genPassword);
$("pCopy").addEventListener("click",function(){
  var pw=$("pOut").textContent;
  if(pw&&pw.indexOf("Press")!==0)copyText(pw,"Password copied");else toast("Generate a password first");
});
genPassword();

/* ============ Extra tools (dynamic panels) ============ */
function mkPanel(id,title,desc,body){
  var art=document.createElement("article");art.className="tool-panel";art.id="panel-"+id;
  art.innerHTML='<div class="tool-head"><span class="icon">'+(ICONS[id]||ICONS.mortgage)+'</span><div><h1></h1><p></p></div><button class="back-btn" type="button">← All tools</button></div><div class="tool-body">'+body+'</div>';
  art.querySelector("h1").textContent=title;art.querySelector("p").textContent=desc;
  art.querySelector(".back-btn").addEventListener("click",closeTools);
  if(document.getElementById("panel-"+id))return;
  $("workspace").appendChild(art);
}
function F(label,inner,hint){return '<div class="field"><label>'+label+(hint?' <span class="hint">'+hint+'</span>':'')+'</label>'+inner+'</div>';}
function IN(id,val,extra){return '<input type="number" id="'+id+'" value="'+val+'" '+(extra||'')+' />';}
function IT(id,val,ph){return '<input type="text" id="'+id+'" value="'+(val||'')+'" placeholder="'+(ph||'')+'" />';}
function IDT(id,val){return '<input type="date" id="'+id+'" value="'+(val||'')+'" />';}
function ITM(id,val){return '<input type="time" id="'+id+'" value="'+(val||'')+'" />';}
function TA(id,rows,ph){return '<textarea id="'+id+'" rows="'+(rows||6)+'" placeholder="'+(ph||'')+'"></textarea>';}
function SEL(id,opts){return '<select id="'+id+'">'+opts+'</select>';}
function RB(title,bigId){return '<div class="result-box"><h3>'+title+'</h3><div class="big-num" id="'+bigId+'">—</div><div style="margin-top:12px" id="'+bigId+'Kv"></div><p class="note" id="'+bigId+'Note"></p></div>';}
function KV(bigId,rows){var b=$(bigId+"Kv");if(b)b.innerHTML=rows.map(function(r){return '<div class="kv'+(r[2]?' total':'')+'"><span>'+r[0]+'</span><b>'+r[1]+'</b></div>';}).join("");}
function NOTE(bigId,t){var n=$(bigId+"Note");if(n)n.textContent=t||"";}
function cols2(a,b){return '<div class="cols"><div>'+a+'</div><div>'+b+'</div></div>';}
function onIn(ids,fn){ids.forEach(function(id){var e=$(id);if(e){e.addEventListener("input",fn);e.addEventListener("change",fn);}});}
function curSeg(id){return '<div class="field"><label>Currency</label><div class="seg" id="'+id+'"><button type="button" class="active" data-cur="USD">$ USD</button><button type="button" data-cur="GBP">£ GBP</button><button type="button" data-cur="CAD">$ CAD</button></div></div>';}
function todayISO(){return new Date().toISOString().slice(0,10);}
function addDaysISO(iso,days){var d=new Date(iso+"T00:00:00");d.setDate(d.getDate()+days);return d.toISOString().slice(0,10);}

/* ---- Loan ---- */
(function(){
  mkPanel("loan","Loan Calculator","Monthly payment, total interest and payoff date for any loan.",cols2(
    curSeg("loanCurSeg")+F("Loan amount",IN("loanAmt",25000,'min="0" step="100"'))+ '<div class="row2">'+F("Interest rate (% / year)",IN("loanRate",7.5,'min="0" step="0.05"'))+F("Term (years)",IN("loanYears",5,'min="0.1" step="0.5"'))+'</div>'+F("Extra monthly payment (optional)",IN("loanExtra",0,'min="0" step="10"')),
    RB("Monthly payment","loanBig")));
  var cur="USD";segWire("loanCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){
    var P=num("loanAmt"),r=num("loanRate")/100/12,n=Math.round(num("loanYears")*12),extra=num("loanExtra");
    if(P<=0||n<=0){$("loanBig").textContent="—";return;}
    var pay=r>0?P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):P/n;
    var bal=P,interest=0,months=0,mpay=pay+extra;
    while(bal>0.005&&months<1200){var i=bal*r;interest+=i;bal=bal+i-Math.min(mpay,bal+i);months++;}
    $("loanBig").textContent=fmtMoney(mpay,cur);
    var payoff=new Date();payoff.setMonth(payoff.getMonth()+months);
    KV("loanBig",[["Standard payment",fmtMoney(pay,cur)],["Total interest",fmtMoney0(interest,cur)],["Total repaid",fmtMoney0(P+interest,cur)],["Months to clear",months],["Payoff date",payoff.toLocaleDateString("en-US",{month:"long",year:"numeric"}),1]]);
    NOTE("loanBig",extra>0?"Extra payments save you interest versus the standard schedule.":"Estimate for a fixed-rate loan with monthly payments.");
  }
  onIn(["loanAmt","loanRate","loanYears","loanExtra"],calc);calc();
})();

/* ---- Compound Interest ---- */
(function(){
  mkPanel("compound","Compound Interest Calculator","How savings grow with interest and regular monthly deposits.",cols2(
    curSeg("compCurSeg")+F("Starting amount",IN("compP",10000,'min="0" step="100"'))+F("Monthly deposit",IN("compPmt",250,'min="0" step="10"'))+'<div class="row2">'+F("Annual return (%)",IN("compRate",7,'min="0" step="0.1"'))+F("Years",IN("compYears",20,'min="0" max="80" step="1"'))+'</div>',
    RB("Value at the end","compBig")));
  var cur="USD";segWire("compCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){
    var bal=num("compP"),pmt=num("compPmt"),mr=num("compRate")/100/12,months=Math.round(num("compYears")*12),deposited=num("compP");
    for(var i=0;i<months;i++){bal=bal*(1+mr)+pmt;deposited+=pmt;}
    $("compBig").textContent=fmtMoney0(bal,cur);
    KV("compBig",[["You deposited",fmtMoney0(deposited,cur)],["Interest earned",fmtMoney0(bal-deposited,cur)],["Growth",deposited>0?(((bal/deposited)-1)*100).toFixed(1)+"%":"—",1]]);
    NOTE("compBig","Assumes monthly compounding and deposits at the end of each month. Returns are never guaranteed.");
  }
  onIn(["compP","compPmt","compRate","compYears"],calc);calc();
})();

/* ---- Savings Goal ---- */
(function(){
  mkPanel("savings","Savings Goal Calculator","Find out when you will hit your savings target.",cols2(
    curSeg("savCurSeg")+F("Savings goal",IN("savGoal",20000,'min="0" step="100"'))+F("Already saved",IN("savNow",2000,'min="0" step="100"'))+F("Monthly deposit",IN("savPmt",400,'min="0" step="10"'))+F("Annual interest (%)",IN("savRate",4,'min="0" step="0.1"')),
    RB("Time to reach your goal","savBig")));
  var cur="USD";segWire("savCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){
    var goal=num("savGoal"),bal=num("savNow"),pmt=num("savPmt"),mr=num("savRate")/100/12;
    if(goal<=bal){$("savBig").textContent="Already there 🎉";KV("savBig",[]);return;}
    if(pmt<=0&&mr<=0){$("savBig").textContent="—";NOTE("savBig","Add a monthly deposit to see a date.");return;}
    var months=0,deposited=bal;
    while(bal<goal&&months<1200){bal=bal*(1+mr)+pmt;deposited+=pmt;months++;}
    var yrs=Math.floor(months/12),mos=months%12;
    $("savBig").textContent=(yrs?yrs+" yr ":"")+(mos?mos+" mo":(yrs?"":"0 mo"));
    var d=new Date();d.setMonth(d.getMonth()+months);
    KV("savBig",[["Goal date",d.toLocaleDateString("en-US",{month:"long",year:"numeric"}),1],["Total you deposit",fmtMoney0(deposited,cur)],["Interest earned",fmtMoney0(Math.max(goal-deposited,0),cur)],["Months needed",months]]);
  }
  onIn(["savGoal","savNow","savPmt","savRate"],calc);calc();
})();

/* ---- US Sales Tax ---- */
(function(){
  var states=[["Custom rate",7.25],["California",7.25],["Texas",6.25],["New York (state + NYC avg)",8.875],["Florida",6],["Illinois (Chicago avg)",10.25],["Washington",6.5],["Arizona",5.6],["Colorado",2.9],["Georgia",4],["North Carolina",4.75],["Ohio",5.75],["Pennsylvania",6],["New Jersey",6.625],["Virginia",5.3],["Massachusetts",6.25],["Michigan",6],["Nevada",6.85],["Oregon (no sales tax)",0],["Delaware (no sales tax)",0],["Montana (no sales tax)",0]];
  var opts=states.map(function(x,i){return '<option value="'+i+'">'+x[0]+" — "+x[1]+'%</option>';}).join("");
  mkPanel("salestax","US Sales Tax Calculator","Add sales tax to a price using state rates, or your own local rate.",cols2(
    F("Price before tax ($)",IN("stPrice",100,'min="0" step="0.01"'))+F("State",SEL("stState",opts))+F("Tax rate % (edit for your city/county)",IN("stRate",7.25,'min="0" step="0.001"')),
    RB("Total with tax","stBig")));
  function calc(){
    var price=num("stPrice"),rate=num("stRate"),tax=price*rate/100;
    $("stBig").textContent=fmtMoney(price+tax,"USD");
    KV("stBig",[["Price before tax",fmtMoney(price,"USD")],["Sales tax ("+rate+"%)",fmtMoney(tax,"USD")],["Total",fmtMoney(price+tax,"USD"),1]]);
    NOTE("stBig","Local city and county taxes often add 1–4% on top of the state rate — edit the rate to match your receipt.");
  }
  $("stState").addEventListener("change",function(){$("stRate").value=states[parseInt($("stState").value,10)][1];calc();});
  onIn(["stPrice","stRate"],calc);calc();
})();

/* ---- UK VAT ---- */
(function(){
  mkPanel("vat","UK VAT Calculator","Add VAT to a net price, or strip VAT out of a gross price.",cols2(
    F("Amount (£)",IN("vatAmt",100,'min="0" step="0.01"'))+F("VAT rate",SEL("vatRate",'<option value="20" selected>Standard — 20%</option><option value="5">Reduced — 5%</option><option value="0">Zero — 0%</option>'))+F("The amount I entered is",'<div class="seg" id="vatModeSeg"><button type="button" class="active" data-mode="net">Net (excl. VAT)</button><button type="button" data-mode="gross">Gross (incl. VAT)</button></div>'),
    RB("Gross price (incl. VAT)","vatBig")));
  var mode="net";segWire("vatModeSeg",function(b){mode=b.getAttribute("data-mode");calc();});
  function calc(){
    var amt=num("vatAmt"),r=num("vatRate")/100,net,gross,vat;
    if(mode==="net"){net=amt;vat=amt*r;gross=amt+vat;}else{gross=amt;net=amt/(1+r);vat=gross-net;}
    $("vatBig").textContent=fmtMoney(gross,"GBP");
    KV("vatBig",[["Net (excl. VAT)",fmtMoney(net,"GBP")],["VAT amount",fmtMoney(vat,"GBP")],["Gross (incl. VAT)",fmtMoney(gross,"GBP"),1]]);
    NOTE("vatBig","Most goods and services in the UK carry 20% VAT. Energy and children's clothes are 5% or 0%.");
  }
  onIn(["vatAmt","vatRate"],calc);calc();
})();

/* ---- Discount ---- */
(function(){
  mkPanel("discount","Discount Calculator","Sale price after a percentage off — including a second stacked discount.",cols2(
    curSeg("discCurSeg")+F("Original price",IN("discPrice",80,'min="0" step="0.01"'))+F("Discount % off",IN("discPct",25,'min="0" max="100" step="0.5"'))+F("Extra discount % (optional, applied after the first)",IN("discPct2",0,'min="0" max="100" step="0.5"')),
    RB("You pay","discBig")));
  var cur="USD";segWire("discCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){
    var p=num("discPrice"),a=num("discPct"),b=num("discPct2");
    var after1=p*(1-a/100),final=after1*(1-b/100);
    $("discBig").textContent=fmtMoney(final,cur);
    KV("discBig",[["After first discount",fmtMoney(after1,cur)],["You save",fmtMoney(p-final,cur)],["Effective discount",p>0?((1-final/p)*100).toFixed(1)+"%":"—",1]]);
    NOTE("discBig","Stacked discounts multiply — 25% + 10% off is 32.5% off in total, not 35%.");
  }
  onIn(["discPrice","discPct","discPct2"],calc);calc();
})();

/* ---- Percentage ---- */
(function(){
  mkPanel("percentage","Percentage Calculator","Three everyday percentage questions, answered instantly.",
    '<div class="cols"><div>'+
    F("What is X% of Y?",'<div class="row2">'+IN("pc1x",15)+IN("pc1y",240)+'</div>')+'<div class="result-box" style="margin-bottom:14px"><h3>Result</h3><div class="big-num" id="pc1Out">—</div></div>'+
    F("X is what % of Y?",'<div class="row2">'+IN("pc2x",45)+IN("pc2y",180)+'</div>')+'<div class="result-box"><h3>Result</h3><div class="big-num" id="pc2Out">—</div></div>'+
    '</div><div>'+
    F("Percentage change from X to Y",'<div class="row2">'+IN("pc3x",80)+IN("pc3y",100)+'</div>')+'<div class="result-box"><h3>Change</h3><div class="big-num" id="pc3Out">—</div><p class="note" id="pc3Note"></p></div>'+
    '<p class="note">Tip: a rise from 80 to 100 is +25%, but a fall back from 100 to 80 is −20% — percentages depend on where you start.</p>'+
    '</div></div>');
  function calc(){
    $("pc1Out").textContent=fmtNum(Math.round(num("pc1x")/100*num("pc1y")*100)/100);
    var y2=num("pc2y");$("pc2Out").textContent=y2!==0?(num("pc2x")/y2*100).toFixed(2)+"%":"—";
    var x3=num("pc3x"),y3=num("pc3y");
    if(x3!==0){var ch=(y3-x3)/Math.abs(x3)*100;$("pc3Out").textContent=(ch>=0?"+":"")+ch.toFixed(2)+"%";$("pc3Note").textContent=ch>=0?"An increase of "+fmtNum(Math.abs(y3-x3)):"A decrease of "+fmtNum(Math.abs(y3-x3));}
    else{$("pc3Out").textContent="—";$("pc3Note").textContent="";}
  }
  onIn(["pc1x","pc1y","pc2x","pc2y","pc3x","pc3y"],calc);calc();
})();

/* ---- Credit Card Payoff ---- */
(function(){
  mkPanel("creditcard","Credit Card Payoff Calculator","See how long a balance really takes to clear — and what it costs.",cols2(
    curSeg("ccCurSeg")+F("Card balance",IN("ccBal",3500,'min="0" step="50"'))+F("APR (%)",IN("ccApr",24.99,'min="0" step="0.1"'))+F("Monthly payment",IN("ccPay",150,'min="0" step="5"')),
    RB("Time to pay off","ccBig")));
  var cur="USD";segWire("ccCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){
    var bal=num("ccBal"),mr=num("ccApr")/100/12,pay=num("ccPay");
    if(bal<=0){$("ccBig").textContent="No balance 🎉";KV("ccBig",[]);return;}
    if(pay<=bal*mr){$("ccBig").textContent="Never";KV("ccBig",[["Monthly interest alone",fmtMoney(bal*mr,cur)]]);NOTE("ccBig","Your payment does not cover the monthly interest — the balance will grow. Increase the payment.");return;}
    var interest=0,months=0,b=bal;
    while(b>0.005&&months<1200){var i=b*mr;interest+=i;b=b+i-Math.min(pay,b+i);months++;}
    var yrs=Math.floor(months/12),mos=months%12;
    $("ccBig").textContent=(yrs?yrs+" yr ":"")+mos+" mo";
    var d=new Date();d.setMonth(d.getMonth()+months);
    KV("ccBig",[["Debt-free date",d.toLocaleDateString("en-US",{month:"long",year:"numeric"}),1],["Total interest paid",fmtMoney0(interest,cur)],["Total repaid",fmtMoney0(bal+interest,cur)],["Payments made",months]]);
    NOTE("ccBig","Paying more each month cuts the interest dramatically — try doubling the payment and compare.");
  }
  onIn(["ccBal","ccApr","ccPay"],calc);calc();
})();

/* ---- Rent Affordability ---- */
(function(){
  mkPanel("rent","Rent Affordability Calculator","How much rent fits your income, using the rules landlords actually use.",cols2(
    curSeg("rentCurSeg")+F("Gross annual income (before tax)",IN("rentInc",60000,'min="0" step="1000"'))+F("Other monthly debts (car, cards, loans)",IN("rentDebt",250,'min="0" step="10"'))+F("Rent you are considering (per month)",IN("rentAsk",1400,'min="0" step="25"')),
    RB("Max recommended rent (30% rule)","rentBig")));
  var cur="USD";segWire("rentCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){
    var annual=num("rentInc"),monthly=annual/12,maxRent=monthly*0.30,ask=num("rentAsk"),debt=num("rentDebt");
    $("rentBig").textContent=fmtMoney0(maxRent,cur)+" / mo";
    var ratio=monthly>0?ask/monthly*100:0;
    KV("rentBig",[["Gross monthly income",fmtMoney0(monthly,cur)],["Rent at 28% (comfortable)",fmtMoney0(monthly*0.28,cur)],["Rent at 35% (stretch)",fmtMoney0(monthly*0.35,cur)],["Your rent as % of income",ratio.toFixed(1)+"%"],["Income needed for your rent (40x rule)",fmtMoney0(ask*40,cur)+" / yr",1]]);
    NOTE("rentBig",(ratio<=30?"Your rent is within the classic 30% guideline.":ratio<=35?"Your rent is a stretch — workable, but keep other debts low.":"Your rent is above 35% of gross income — most US landlords require income of 40× the monthly rent, and UK referencing usually caps rent near 30% of income.")+" Monthly debts of "+fmtMoney0(debt,cur)+" leave "+fmtMoney0(Math.max(monthly-maxRent-debt,0),cur)+" after recommended rent and debts.");
  }
  onIn(["rentInc","rentDebt","rentAsk"],calc);calc();
})();

/* ---- Inflation ---- */
(function(){
  mkPanel("inflation","Inflation Calculator","What today's prices will look like in the future — and what your money will really be worth.",cols2(
    curSeg("infCurSeg")+F("Amount today",IN("infAmt",100,'min="0" step="1"'))+F("Inflation rate (% / year)",IN("infRate",3.2,'min="0" step="0.1"'))+F("Years ahead",IN("infYears",10,'min="0" max="60" step="1"')),
    RB("Future cost of the same thing","infBig")));
  var cur="USD";segWire("infCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){
    var amt=num("infAmt"),r=num("infRate")/100,y=num("infYears");
    var future=amt*Math.pow(1+r,y),worth=amt/Math.pow(1+r,y);
    $("infBig").textContent=fmtMoney(future,cur);
    KV("infBig",[["Cost today",fmtMoney(amt,cur)],["Cost in "+y+" years",fmtMoney(future,cur)],["What "+fmtMoney0(amt,cur)+" saved under the mattress buys then",fmtMoney(worth,cur),1]]);
    NOTE("infBig","US inflation averaged about 3% over the long run; the UK target is 2%. Cash that does not earn interest loses buying power every year.");
  }
  onIn(["infAmt","infRate","infYears"],calc);calc();
})();


/* ---- BMI ---- */
(function(){
  mkPanel("bmi","BMI Calculator","Body Mass Index with imperial or metric measurements.",cols2(
    F("Units",'<div class="seg" id="bmiSeg"><button type="button" class="active" data-u="imp">US — ft / in &amp; lb</button><button type="button" data-u="met">Metric — cm &amp; kg</button></div>')+
    '<div id="bmiImp"><div class="row2">'+F("Height — feet",IN("bmiFt",5,'min="0"'))+F("Height — inches",IN("bmiIn",9,'min="0" max="11"'))+'</div>'+F("Weight (lb)",IN("bmiLb",170,'min="0"'))+'</div>'+
    '<div id="bmiMet" class="hidden">'+F("Height (cm)",IN("bmiCm",175,'min="0"'))+F("Weight (kg)",IN("bmiKg",77,'min="0"'))+'</div>',
    RB("Your BMI","bmiBig")));
  var unit="imp";
  segWire("bmiSeg",function(b){unit=b.getAttribute("data-u");$("bmiImp").classList.toggle("hidden",unit!=="imp");$("bmiMet").classList.toggle("hidden",unit!=="met");calc();});
  function calc(){
    var kg,m;
    if(unit==="imp"){kg=num("bmiLb")*0.453592;m=(num("bmiFt")*12+num("bmiIn"))*0.0254;}else{kg=num("bmiKg");m=num("bmiCm")/100;}
    if(kg<=0||m<=0){$("bmiBig").textContent="—";return;}
    var bmi=kg/(m*m),cat=bmi<18.5?"Underweight":bmi<25?"Healthy weight":bmi<30?"Overweight":"Obese";
    $("bmiBig").textContent=bmi.toFixed(1)+" — "+cat;
    var lo=18.5*m*m,hi=24.9*m*m;
    var range=unit==="imp"?Math.round(lo/0.453592)+"–"+Math.round(hi/0.453592)+" lb":lo.toFixed(1)+"–"+hi.toFixed(1)+" kg";
    KV("bmiBig",[["Category",cat],["Healthy weight for your height",range,1]]);
    NOTE("bmiBig","BMI is a screening guide, not a diagnosis — it can misread muscular builds. Talk to a clinician about your individual health.");
  }
  onIn(["bmiFt","bmiIn","bmiLb","bmiCm","bmiKg"],calc);calc();
})();

/* ---- Calorie / TDEE ---- */
(function(){
  mkPanel("calorie","Calorie & TDEE Calculator","Daily calories to maintain, lose or gain weight (Mifflin–St Jeor formula).",cols2(
    F("Sex",'<div class="seg" id="calSeg"><button type="button" class="active" data-s="m">Male</button><button type="button" data-s="f">Female</button></div>')+
    '<div class="row3">'+F("Age",IN("calAge",30,'min="10" max="100"'))+F("Weight (lb)",IN("calLb",180,'min="0"'))+F("Height (inches)",IN("calIn",70,'min="0"'))+'</div>'+
    F("Activity level",SEL("calAct",'<option value="1.2">Sedentary — desk job, little exercise</option><option value="1.375">Light — exercise 1–3 days/week</option><option value="1.55" selected>Moderate — exercise 3–5 days/week</option><option value="1.725">Active — exercise 6–7 days/week</option><option value="1.9">Athlete — physical job or twice-daily training</option>'))+
    F("Goal",SEL("calGoal",'<option value="-500">Lose ~1 lb/week (−500)</option><option value="0" selected>Maintain weight</option><option value="300">Gain muscle (+300)</option>')),
    RB("Target calories per day","calBig")));
  var sex="m";segWire("calSeg",function(b){sex=b.getAttribute("data-s");calc();});
  function calc(){
    var kg=num("calLb")*0.453592,cm=num("calIn")*2.54,age=num("calAge");
    if(kg<=0||cm<=0){$("calBig").textContent="—";return;}
    var bmr=10*kg+6.25*cm-5*age+(sex==="m"?5:-161);
    var tdee=bmr*parseFloat($("calAct").value);
    var target=Math.max(1200,tdee+parseFloat($("calGoal").value));
    $("calBig").textContent=fmtNum(Math.round(target))+" kcal";
    KV("calBig",[["BMR (resting)",fmtNum(Math.round(bmr))+" kcal"],["TDEE (maintenance)",fmtNum(Math.round(tdee))+" kcal"],["Protein guide (~0.8g per lb)",Math.round(num("calLb")*0.8)+" g / day",1]]);
    NOTE("calBig","Estimates vary ±10% person to person. Avoid eating below 1,200 kcal/day without medical advice.");
  }
  onIn(["calAge","calLb","calIn","calAct","calGoal"],calc);calc();
})();

/* ---- Pregnancy ---- */
(function(){
  mkPanel("pregnancy","Pregnancy Due Date Calculator","Estimated due date from the first day of your last period (LMP).",
    cols2(F("First day of last period",IDT("pregLmp",addDaysISO(todayISO(),-120)))+F("Average cycle length (days)",IN("pregCycle",28,'min="20" max="45"')),
    RB("Estimated due date","pregBig"))+'<p class="note">Only about 5% of babies arrive on their exact due date — most come within two weeks either side. Always confirm dates with your midwife, OB-GYN or NHS / provider scan.</p>');
  function calc(){
    var lmp=$("pregLmp").value;if(!lmp){$("pregBig").textContent="—";return;}
    var cycle=num("pregCycle")||28;
    var due=new Date(lmp+"T00:00:00");due.setDate(due.getDate()+280+(cycle-28));
    var today=new Date();today.setHours(0,0,0,0);
    var days=Math.floor((today-new Date(lmp+"T00:00:00"))/86400000);
    var wks=Math.floor(days/7),rem=days%7;
    $("pregBig").textContent=due.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});
    var tri=days<0?"—":wks<14?"First trimester":wks<28?"Second trimester":"Third trimester";
    var left=Math.ceil((due-today)/86400000);
    KV("pregBig",[["You are",days>=0?wks+" weeks, "+rem+" days pregnant":"Not started"],["Trimester",tri],["Days to go",left>0?left:"Due / overdue",1],["Conception (approx.)",addDaysISO(lmp,14+(cycle-28))]]);
  }
  onIn(["pregLmp","pregCycle"],calc);calc();
})();

/* ---- Water Intake ---- */
(function(){
  mkPanel("water","Water Intake Calculator","A personal daily water target based on your body weight and exercise.",cols2(
    F("Body weight (lb)",IN("watLb",160,'min="0"'))+F("Exercise per day (minutes)",IN("watEx",30,'min="0"'))+F("Climate / conditions",SEL("watClim",'<option value="0">Normal</option><option value="8">Hot or humid (+8 oz)</option><option value="16">Very hot / heavy labour (+16 oz)</option>')),
    RB("Drink about","watBig")));
  function calc(){
    var oz=num("watLb")*0.5+Math.floor(num("watEx")/30)*12+parseFloat($("watClim").value);
    $("watBig").textContent=Math.round(oz)+" fl oz / day";
    KV("watBig",[["In litres", (oz*0.0295735).toFixed(2)+" L"],["In cups (8 oz)",(oz/8).toFixed(1)],["In 16.9 oz bottles",(oz/16.9).toFixed(1),1]]);
    NOTE("watBig","A common US guide is half your body weight (lb) in fluid ounces, plus 12 oz for every 30 minutes of exercise. Thirst and pale-yellow urine are good checks.");
  }
  onIn(["watLb","watEx","watClim"],calc);calc();
})();

/* ---- Ideal Weight ---- */
(function(){
  mkPanel("idealweight","Ideal Weight Calculator","The healthy weight range for your height, two ways.",cols2(
    F("Sex",'<div class="seg" id="iwSeg"><button type="button" class="active" data-s="m">Male</button><button type="button" data-s="f">Female</button></div>')+'<div class="row2">'+F("Height — feet",IN("iwFt",5,'min="0"'))+F("Height — inches",IN("iwIn",10,'min="0" max="11"'))+'</div>',
    RB("Healthy range (BMI 18.5–24.9)","iwBig")));
  var sex="m";segWire("iwSeg",function(b){sex=b.getAttribute("data-s");calc();});
  function calc(){
    var inches=num("iwFt")*12+num("iwIn");if(inches<=0){$("iwBig").textContent="—";return;}
    var m=inches*0.0254,lo=18.5*m*m/0.453592,hi=24.9*m*m/0.453592;
    var devine=(sex==="m"?50:45.5)+2.3*Math.max(inches-60,0);
    $("iwBig").textContent=Math.round(lo)+"–"+Math.round(hi)+" lb";
    KV("iwBig",[["In kilograms",(lo*0.453592).toFixed(1)+"–"+(hi*0.453592).toFixed(1)+" kg"],["Devine formula ideal",Math.round(devine/0.453592)+" lb ("+(devine).toFixed(1)+" kg)",1]]);
    NOTE("iwBig","Ranges are guides for average builds — athletes and older adults can be healthy outside them.");
  }
  onIn(["iwFt","iwIn"],calc);calc();
})();

/* ---- Running Pace ---- */
(function(){
  mkPanel("pace","Running Pace Calculator","Pace and speed from any distance and finish time.",cols2(
    '<div class="row2">'+F("Distance",IN("paceDist",3.1,'min="0" step="0.1"'))+F("Unit",SEL("paceUnit",'<option value="mi" selected>Miles</option><option value="km">Kilometres</option>'))+'</div>'+
    '<div class="row3">'+F("Hours",IN("paceH",0,'min="0"'))+F("Minutes",IN("paceM",27,'min="0"'))+F("Seconds",IN("paceS",30,'min="0"'))+'</div>'+
    '<div class="btn-row"><button type="button" class="btn secondary small" data-pace-preset="5k">5K</button><button type="button" class="btn secondary small" data-pace-preset="10k">10K</button><button type="button" class="btn secondary small" data-pace-preset="half">Half marathon</button><button type="button" class="btn secondary small" data-pace-preset="full">Marathon</button></div>',
    RB("Your pace","paceBig")));
  var presets={"5k":[3.10686,"mi"],"10k":[6.21371,"mi"],"half":[13.1094,"mi"],"full":[26.2188,"mi"]};
  document.querySelectorAll("[data-pace-preset]").forEach(function(b){b.addEventListener("click",function(){var pr=presets[b.getAttribute("data-pace-preset")];$("paceDist").value=pr[0];$("paceUnit").value=pr[1];calc();});});
  function fmtPace(secPer){var mm=Math.floor(secPer/60),ss=Math.round(secPer%60);if(ss===60){mm++;ss=0;}return mm+":"+("0"+ss).slice(-2);}
  function calc(){
    var d=num("paceDist"),total=num("paceH")*3600+num("paceM")*60+num("paceS");
    if(d<=0||total<=0){$("paceBig").textContent="—";return;}
    var unit=$("paceUnit").value,perUnit=total/d;
    var otherUnit=unit==="mi"?"km":"mi",otherDist=unit==="mi"?d*1.60934:d/1.60934;
    $("paceBig").textContent=fmtPace(perUnit)+" / "+unit;
    KV("paceBig",[["Pace per "+otherUnit,fmtPace(total/otherDist)],["Speed",unit==="mi"?(d/(total/3600)).toFixed(2)+" mph":(d/(total/3600)).toFixed(2)+" km/h"],["Finish at this pace — 5K",fmtPace(total/otherDist*(otherUnit==="km"?5:3.10686))+" total"], ["Marathon at this pace",fmtPace(perUnit*(unit==="mi"?26.2188:42.195))+" total",1]]);
    NOTE("paceBig","Finish-time rows show total time at the same pace, not pace.");
  }
  onIn(["paceDist","paceUnit","paceH","paceM","paceS"],calc);calc();
})();

/* ---- Unit Converter ---- */
(function(){
  var CATS={
    "Length":{base:"metres",units:{"Millimetres":0.001,"Centimetres":0.01,"Metres":1,"Kilometres":1000,"Inches":0.0254,"Feet":0.3048,"Yards":0.9144,"Miles":1609.344}},
    "Weight":{base:"kg",units:{"Grams":0.001,"Kilograms":1,"Ounces":0.0283495,"Pounds":0.453592,"Stone":6.35029,"US tons":907.185,"Metric tonnes":1000}},
    "Volume":{base:"litres",units:{"Millilitres":0.001,"Litres":1,"Fluid ounces (US)":0.0295735,"Cups (US)":0.236588,"Pints (US)":0.473176,"Quarts (US)":0.946353,"Gallons (US)":3.78541,"Gallons (UK)":4.54609,"Pints (UK)":0.568261}},
    "Area":{base:"sq m",units:{"Square metres":1,"Square feet":0.092903,"Square yards":0.836127,"Acres":4046.86,"Hectares":10000,"Square miles":2589988}},
    "Speed":{base:"m/s",units:{"Metres/second":1,"Kilometres/hour":0.277778,"Miles/hour":0.44704,"Knots":0.514444,"Feet/second":0.3048}}
  };
  mkPanel("unit","Unit Converter","Imperial ↔ metric for length, weight, volume, area, speed and temperature.",cols2(
    F("Category",SEL("ucCat",""))+F("Value",IN("ucVal",10,'step="any"'))+'<div class="row2">'+F("From",SEL("ucFrom",""))+F("To",SEL("ucTo",""))+'</div>'+'<div class="field"><label>Temperature</label><div class="row2">'+IN("ucTemp",72)+SEL("ucTempMode",'<option value="f2c">°F → °C</option><option value="c2f">°C → °F</option>')+'</div></div>',
    RB("Result","ucBig")));
  function fillUnits(){
    var cat=$("ucCat").value;
    if(cat==="Temperature"){$("ucFrom").innerHTML="";$("ucTo").innerHTML="";return;}
    var units=Object.keys(CATS[cat].units);
    $("ucFrom").innerHTML=units.map(function(u){return '<option>'+u+'</option>';}).join("");
    $("ucTo").innerHTML=units.map(function(u){return '<option>'+u+'</option>';}).join("");
    $("ucFrom").selectedIndex=units.indexOf("Feet")>=0?units.indexOf("Feet"):0;
    $("ucTo").selectedIndex=units.indexOf("Metres")>=0?units.indexOf("Metres"):(units.length>1?1:0);
    if(cat==="Weight"){$("ucFrom").value="Pounds";$("ucTo").value="Kilograms";}
    if(cat==="Speed"){$("ucFrom").value="Miles/hour";$("ucTo").value="Kilometres/hour";}
  }
  function calc(){
    var cat=$("ucCat").value;
    if(cat==="Temperature"){calcTemp();return;}
    var v=num("ucVal"),f=CATS[cat].units[$("ucFrom").value],t=CATS[cat].units[$("ucTo").value];
    if(!f||!t){return;}
    var res=v*f/t;
    $("ucBig").textContent=(Math.round(res*10000)/10000)+" "+$("ucTo").value;
    KV("ucBig",[["You entered",fmtNum(v)+" "+$("ucFrom").value],["Equals",(Math.round(res*10000)/10000)+" "+$("ucTo").value,1]]);
    NOTE("ucBig","");
  }
  function calcTemp(){
    var v=num("ucTemp"),mode=$("ucTempMode").value,res=mode==="f2c"?(v-32)*5/9:v*9/5+32;
    $("ucBig").textContent=(Math.round(res*100)/100)+(mode==="f2c"?" °C":" °F");
    KV("ucBig",[["You entered",v+(mode==="f2c"?" °F":" °C")],["Equals",(Math.round(res*100)/100)+(mode==="f2c"?" °C":" °F"),1]]);
    NOTE("ucBig","72°F ≈ 22°C (room temperature) · 98.6°F = 37°C (body temperature) · 212°F = 100°C (boiling).");
  }
  $("ucCat").innerHTML=Object.keys(CATS).concat(["Temperature"]).map(function(c){return '<option>'+c+'</option>';}).join("");
  $("ucCat").addEventListener("change",function(){fillUnits();calc();});
  onIn(["ucVal","ucFrom","ucTo","ucTemp","ucTempMode"],calc);
  fillUnits();calc();onIn(["ucTemp","ucTempMode"],calcTemp);
})();

/* ---- Fraction ---- */
(function(){
  mkPanel("fraction","Fraction Calculator","Add, subtract, multiply or divide two fractions — fully simplified.",cols2(
    '<div class="row3">'+F("Fraction 1 — top",IN("frN1",1))+F("Operation",SEL("frOp",'<option value="+">+ Add</option><option value="-">− Subtract</option><option value="*">× Multiply</option><option value="/">÷ Divide</option>'))+F("Fraction 2 — top",IN("frN2",1))+'</div><div class="row2">'+F("Fraction 1 — bottom",IN("frD1",2))+F("Fraction 2 — bottom",IN("frD2",3))+'</div>',
    RB("Result","frBig")));
  function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=a%b;a=b;b=t;}return a||1;}
  function calc(){
    var n1=num("frN1"),d1=num("frD1"),n2=num("frN2"),d2=num("frD2"),op=$("frOp").value;
    if(d1===0||d2===0){$("frBig").textContent="—";NOTE("frBig","A denominator cannot be zero.");return;}
    var n,d;
    if(op==="+"){n=n1*d2+n2*d1;d=d1*d2;}else if(op==="-"){n=n1*d2-n2*d1;d=d1*d2;}else if(op==="*"){n=n1*n2;d=d1*d2;}else{if(n2===0){$("frBig").textContent="—";return;}n=n1*d2;d=d1*n2;}
    if(d<0){d=-d;n=-n;}
    var g=gcd(n,d);n/=g;d/=g;
    var whole=Math.trunc(n/d),rem=Math.abs(n)-Math.abs(whole)*d;
    $("frBig").textContent=d===1?String(n):n+"/"+d;
    KV("frBig",[["As a decimal",(n/d).toFixed(6).replace(/0+$/,'').replace(/\.$/,'')],["As a mixed number",whole!==0&&rem!==0?whole+" "+rem+"/"+d:(d===1?String(n):n+"/"+d),1]]);
    NOTE("frBig","");
  }
  onIn(["frN1","frD1","frN2","frD2","frOp"],calc);calc();
})();

/* ---- Random Number ---- */
(function(){
  mkPanel("randomnum","Random Number Generator","Generate random whole numbers in any range.",cols2(
    '<div class="row2">'+F("Minimum",IN("rnMin",1))+F("Maximum",IN("rnMax",100))+'</div><div class="row2">'+F("How many numbers",IN("rnCount",5,'min="1" max="100"'))+F("Allow repeats?",SEL("rnRep",'<option value="yes">Yes</option><option value="no">No — all unique</option>'))+'</div>'+'<button type="button" class="btn" id="rnGen">Generate numbers</button>',
    RB("Your numbers","rnBig")));
  function gen(){
    var lo=Math.round(num("rnMin")),hi=Math.round(num("rnMax")),count=Math.min(100,Math.max(1,Math.round(num("rnCount"))));
    if(hi<lo){var t=lo;lo=hi;hi=t;}
    var unique=$("rnRep").value==="no",out=[],guard=0;
    if(unique&&count>hi-lo+1){toast("Range too small for that many unique numbers");return;}
    while(out.length<count&&guard<10000){guard++;var arr=new Uint32Array(1);crypto.getRandomValues(arr);var v=lo+(arr[0]%(hi-lo+1));if(unique&&out.indexOf(v)>=0)continue;out.push(v);}
    $("rnBig").textContent=out.join(", ");
    KV("rnBig",[["Range",lo+" – "+hi],["Count",out.length],["Sum",out.reduce(function(a,b){return a+b;},0),1]]);
  }
  $("rnGen").addEventListener("click",gen);gen();
})();

/* ---- Hours Calculator ---- */
(function(){
  mkPanel("hours","Hours Calculator","Work out hours worked between two times, minus breaks — and pay.",cols2(
    '<div class="row2">'+F("Start time",ITM("hrStart","09:00"))+F("End time",ITM("hrEnd","17:30"))+'</div><div class="row2">'+F("Break (minutes)",IN("hrBreak",30,'min="0"'))+F("Hourly pay (optional)",IN("hrPay",20,'min="0" step="0.25"'))+'</div>'+F("Days per week at this shift",IN("hrDays",5,'min="1" max="7"')),
    RB("Hours worked","hrBig")));
  function calc(){
    var s=$("hrStart").value,e=$("hrEnd").value;if(!s||!e){$("hrBig").textContent="—";return;}
    var sp=s.split(":"),ep=e.split(":");
    var mins=(parseInt(ep[0])*60+parseInt(ep[1]))-(parseInt(sp[0])*60+parseInt(sp[1]));
    if(mins<=0)mins+=1440;
    mins-=num("hrBreak");
    var hrs=Math.max(mins,0)/60,pay=num("hrPay");
    $("hrBig").textContent=Math.floor(hrs)+"h "+Math.round((hrs%1)*60)+"m";
    KV("hrBig",[["Decimal hours",hrs.toFixed(2)],["Pay for this shift",pay>0?fmtMoney(hrs*pay,"USD"):"Add a pay rate"],["Weekly ("+num("hrDays")+" days)",hrs*num("hrDays")+" hrs"+(pay>0?" · "+fmtMoney(hrs*pay*num("hrDays"),"USD"):""),1]]);
    NOTE("hrBig","If the end time is earlier than the start, it is treated as an overnight shift.");
  }
  onIn(["hrStart","hrEnd","hrBreak","hrPay","hrDays"],calc);calc();
})();

/* ---- Date Difference ---- */
(function(){
  mkPanel("datediff","Date Difference Calculator","The exact gap between two dates, every way you might need it.",cols2(
    F("Start date",IDT("ddStart","2026-01-01"))+F("End date",IDT("ddEnd",todayISO())),
    RB("Difference","ddBig")));
  function calc(){
    var a=$("ddStart").value,b=$("ddEnd").value;if(!a||!b){$("ddBig").textContent="—";return;}
    var d1=new Date(a+"T00:00:00"),d2=new Date(b+"T00:00:00");
    if(d2<d1){var t=d1;d1=d2;d2=t;}
    var total=Math.round((d2-d1)/86400000);
    var y=d2.getFullYear()-d1.getFullYear(),mo=d2.getMonth()-d1.getMonth(),da=d2.getDate()-d1.getDate();
    if(da<0){mo--;da+=new Date(d2.getFullYear(),d2.getMonth(),0).getDate();}
    if(mo<0){y--;mo+=12;}
    $("ddBig").textContent=y+" years, "+mo+" months, "+da+" days";
    KV("ddBig",[["Total days",fmtNum(total)],["Total weeks",(total/7).toFixed(1)],["Total months (approx.)",(total/30.44).toFixed(1)],["Weekdays only",weekdays(d1,d2),1]]);
  }
  function weekdays(a,b){var c=0,d=new Date(a);while(d<b){d.setDate(d.getDate()+1);var w=d.getDay();if(w!==0&&w!==6)c++;}return fmtNum(c);}
  onIn(["ddStart","ddEnd"],calc);calc();
})();

/* ---- Days Until ---- */
(function(){
  mkPanel("daysuntil","Days Countdown Calculator","How long until the date you are counting down to?",cols2(
    F("Target date",IDT("duDate",addDaysISO(todayISO(),30)))+F("What is the occasion? (optional)",IT("duName","","e.g. Christmas, wedding, exam day")),
    RB("Countdown","duBig")));
  function calc(){
    var v=$("duDate").value;if(!v){$("duBig").textContent="—";return;}
    var target=new Date(v+"T00:00:00"),today=new Date();today.setHours(0,0,0,0);
    var diff=Math.round((target-today)/86400000);
    var name=$("duName").value.trim();
    $("duBig").textContent=diff>0?diff+" days to go":diff===0?"🎉 Today is the day!":Math.abs(diff)+" days ago";
    KV("duBig",[["Date",target.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})],["Weeks",diff>0?(diff/7).toFixed(1):"—"],["Occasion",name||"—",1]]);
  }
  onIn(["duDate","duName"],calc);calc();
})();

/* ---- Roman Numerals ---- */
(function(){
  mkPanel("roman","Roman Numeral Converter","Numbers ↔ Roman numerals, both directions.",cols2(
    F("Number (1 – 3999)",IN("romNum",2026,'min="1" max="3999"'))+'<div class="result-box" style="margin-bottom:14px"><h3>Roman numeral</h3><div class="big-num" id="romOut">—</div></div>',
    F("Roman numeral",IT("romTxt","MMXXVI","e.g. XIV"))+'<div class="result-box"><h3>Number</h3><div class="big-num" id="romBack">—</div><p class="note" id="romErr"></p></div>'));
  var TABLE=[[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
  function toRoman(n){var out="";TABLE.forEach(function(p){while(n>=p[0]){out+=p[1];n-=p[0];}});return out;}
  function fromRoman(str){
    var vals={I:1,V:5,X:10,L:50,C:100,D:500,M:1000},total=0,prev=0;
    str=str.toUpperCase().trim();if(!/^[IVXLCDM]+$/.test(str))return null;
    for(var i=str.length-1;i>=0;i--){var v=vals[str[i]];if(v<prev)total-=v;else total+=v;prev=Math.max(prev,v);}
    if(toRoman(total)!==str)return null;
    return total;
  }
  function calc(){
    var n=Math.round(num("romNum"));
    $("romOut").textContent=(n>=1&&n<=3999)?toRoman(n):"—";
    var back=fromRoman($("romTxt").value||"");
    $("romBack").textContent=back!==null?back:"—";
    $("romErr").textContent=back===null&&$("romTxt").value.trim()?"That is not a valid standard Roman numeral.":"";
  }
  onIn(["romNum","romTxt"],calc);calc();
})();

/* ---- Average ---- */
(function(){
  mkPanel("average","Average Calculator","Mean, median, mode and more for any list of numbers.",
    F("Your numbers (separate with commas, spaces or new lines)",TA("avgTxt",5,"e.g. 85, 92, 78, 92, 88"))+'<div style="margin-top:14px">'+RB("Mean (average)","avgBig")+'</div>');
  $("avgTxt").value="85, 92, 78, 92, 88, 95, 71";
  function calc(){
    var nums=($("avgTxt").value.match(/-?\d+(\.\d+)?/g)||[]).map(Number);
    if(!nums.length){$("avgBig").textContent="—";KV("avgBig",[]);return;}
    var sum=nums.reduce(function(a,b){return a+b;},0),mean=sum/nums.length;
    var sorted=nums.slice().sort(function(a,b){return a-b;});
    var mid=Math.floor(sorted.length/2),median=sorted.length%2?sorted[mid]:(sorted[mid-1]+sorted[mid])/2;
    var freq={},mode=[],maxF=0;nums.forEach(function(n){freq[n]=(freq[n]||0)+1;if(freq[n]>maxF)maxF=freq[n];});
    Object.keys(freq).forEach(function(k){if(freq[k]===maxF&&maxF>1)mode.push(k);});
    $("avgBig").textContent=Math.round(mean*100)/100;
    KV("avgBig",[["Count",nums.length],["Sum",fmtNum(sum)],["Median",median],["Mode",mode.length?mode.join(", "):"No mode"],["Smallest",sorted[0]],["Largest",sorted[sorted.length-1]],["Range",sorted[sorted.length-1]-sorted[0],1]]);
  }
  onIn(["avgTxt"],calc);calc();
})();


/* ---- Case Converter ---- */
(function(){
  mkPanel("caseconv","Case Converter","Change text between every common letter case.",
    F("Your text",TA("ccTxt",5,"Type or paste text here"))+'<div class="btn-row" id="ccBtns" style="margin:12px 0"></div>'+F("Result",TA("ccOut",5,""))+'<div class="btn-row"><button type="button" class="btn secondary small" id="ccCopy">Copy result</button></div>');
  $("ccTxt").value="the quick brown fox jumps over the lazy dog";
  var modes={
    "UPPERCASE":function(t){return t.toUpperCase();},
    "lowercase":function(t){return t.toLowerCase();},
    "Title Case":function(t){return t.toLowerCase().replace(/\b\w/g,function(c){return c.toUpperCase();});},
    "Sentence case":function(t){return t.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g,function(c){return c.toUpperCase();});},
    "camelCase":function(t){return t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g,function(m,c){return c.toUpperCase();});},
    "PascalCase":function(t){return t.replace(/(^\w|[^a-zA-Z0-9]+.)/g,function(m){return m.replace(/[^a-zA-Z0-9]/g,"").toUpperCase();});},
    "snake_case":function(t){return t.trim().toLowerCase().replace(/[^a-z0-9]+/g,"_");},
    "kebab-case":function(t){return t.trim().toLowerCase().replace(/[^a-z0-9]+/g,"-");},
    "aLtErNaTiNg":function(t){var o="";for(var i=0;i<t.length;i++)o+=i%2?t[i].toUpperCase():t[i].toLowerCase();return o;}
  };
  var btns=$("ccBtns");
  Object.keys(modes).forEach(function(name){
    var b=document.createElement("button");b.type="button";b.className="btn secondary small";b.textContent=name;
    b.addEventListener("click",function(){$("ccOut").value=modes[name]($("ccTxt").value);});
    btns.appendChild(b);
  });
  $("ccTxt").addEventListener("input",function(){$("ccOut").value=modes["Title Case"]($("ccTxt").value);});
  $("ccCopy").addEventListener("click",function(){if($("ccOut").value)copyText($("ccOut").value,"Converted text copied");});
  $("ccOut").value=modes["Title Case"]($("ccTxt").value);
})();

/* ---- Lorem Ipsum ---- */
(function(){
  var WORDS="lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum perspiciatis unde omnis iste natus error voluptatem accusantium doloremque laudantium totam rem aperiam eaque ab illo inventore veritatis quasi architecto beatae vitae dicta explicabo nemo enim ipsam voluptatem quia voluptas aspernatur odit aut fugit consequuntur magni dolores eos ratione sequi nesciunt".split(" ");
  mkPanel("lorem","Lorem Ipsum Generator","Classic placeholder text for designs, mockups and layouts.",cols2(
    F("Generate",SEL("lorType",'<option value="p" selected>Paragraphs</option><option value="s">Sentences</option><option value="w">Words</option>'))+F("How many",IN("lorCount",3,'min="1" max="50"'))+'<button type="button" class="btn" id="lorGen">Generate</button>',
    F("Output",TA("lorOut",10,""))+'<div class="btn-row"><button type="button" class="btn secondary small" id="lorCopy">Copy text</button></div>'));
  function sentence(){var n=6+Math.floor(Math.random()*10),out=[];for(var i=0;i<n;i++)out.push(WORDS[Math.floor(Math.random()*WORDS.length)]);var s=out.join(" ");return s.charAt(0).toUpperCase()+s.slice(1)+".";}
  function gen(){
    var type=$("lorType").value,count=Math.max(1,Math.min(50,Math.round(num("lorCount")))),out="";
    if(type==="w"){var w=[];for(var i=0;i<count;i++)w.push(WORDS[Math.floor(Math.random()*WORDS.length)]);out=w.join(" ");}
    else if(type==="s"){var ss=[];for(var j=0;j<count;j++)ss.push(sentence());out=ss.join(" ");}
    else{var ps=[];for(var k=0;k<count;k++){var pp=[];var c=3+Math.floor(Math.random()*3);for(var m=0;m<c;m++)pp.push(sentence());ps.push(pp.join(" "));}out=ps.join("\n\n");}
    if(out.indexOf("Lorem ipsum")!==0&&type!=="w")out="Lorem ipsum dolor sit amet, consectetur adipiscing elit. "+out;
    $("lorOut").value=out;
  }
  $("lorGen").addEventListener("click",gen);
  $("lorCopy").addEventListener("click",function(){if($("lorOut").value)copyText($("lorOut").value,"Lorem ipsum copied");});
  gen();
})();

/* ---- Remove Duplicate Lines ---- */
(function(){
  mkPanel("dedupe","Remove Duplicate Lines","Paste a list and strip out every repeated line.",
    F("Your list (one item per line)",TA("ddTxt",8,"Paste your list here"))+'<label class="check"><input type="checkbox" id="ddCase" /> Ignore letter case when comparing</label><label class="check"><input type="checkbox" id="ddSort" /> Sort the result A–Z</label><div class="btn-row" style="margin:10px 0"><button type="button" class="btn" id="ddGo">Remove duplicates</button><button type="button" class="btn secondary" id="ddCopy">Copy result</button></div>'+F("Cleaned list",TA("ddOut",8,""))+'<p class="note" id="ddStats"></p>');
  function go(){
    var lines=$("ddTxt").value.split(/\r?\n/),seen={},out=[];
    lines.forEach(function(l){var key=$("ddCase").checked?l.trim().toLowerCase():l.trim();if(key==="" )return;if(!seen[key]){seen[key]=1;out.push(l.trim());}});
    if($("ddSort").checked)out.sort(function(a,b){return a.localeCompare(b);});
    $("ddOut").value=out.join("\n");
    var nonEmpty=lines.filter(function(l){return l.trim();}).length;
    $("ddStats").textContent=nonEmpty+" lines in → "+out.length+" unique lines out ("+(nonEmpty-out.length)+" duplicates removed).";
  }
  $("ddGo").addEventListener("click",go);
  $("ddCopy").addEventListener("click",function(){if($("ddOut").value)copyText($("ddOut").value,"Cleaned list copied");});
})();

/* ---- Slug Generator ---- */
(function(){
  mkPanel("slug","Slug Generator","Turn any title into a clean, URL-friendly slug.",cols2(
    F("Title or text",IT("slugTxt","10 Best Coffee Shops in New York!",""))+'<div class="row2">'+F("Separator",SEL("slugSep",'<option value="-">Hyphen ( - )</option><option value="_">Underscore ( _ )</option>'))+F("Letter case",SEL("slugCase",'<option value="lower">lowercase</option><option value="keep">Keep case</option>'))+'</div>',
    '<div class="result-box"><h3>Your slug</h3><div class="pw-out" id="slugOut">—</div><div class="btn-row" style="margin-top:12px"><button type="button" class="btn secondary small" id="slugCopy">Copy slug</button></div><p class="note">Accents are folded (café → cafe) and punctuation is removed, the way WordPress and most CMS platforms build URLs.</p></div>'));
  function calc(){
    var t=$("slugTxt").value.normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    if($("slugCase").value==="lower")t=t.toLowerCase();
    t=t.replace(/[^a-zA-Z0-9]+/g,$("slugSep").value).replace(/^[-_]+|[-_]+$/g,"");
    $("slugOut").textContent=t||"—";
  }
  $("slugCopy").addEventListener("click",function(){var t=$("slugOut").textContent;if(t!=="—")copyText(t,"Slug copied");});
  onIn(["slugTxt","slugSep","slugCase"],calc);calc();
})();

/* ---- JSON Formatter ---- */
(function(){
  mkPanel("json","JSON Formatter","Format messy JSON beautifully, validate it, or minify it.",
    F("Your JSON",TA("jsonIn",8,'{"name":"ToolNovo","tools":98,"free":true}'))+'<div class="btn-row" style="margin:10px 0"><button type="button" class="btn" id="jsonFmt">Format</button><button type="button" class="btn secondary" id="jsonMin">Minify</button><button type="button" class="btn secondary" id="jsonCopy">Copy output</button></div>'+F("Output",'<div class="output-pre" id="jsonOut">Press Format…</div>')+'<p class="note" id="jsonMsg"></p>');
  $("jsonIn").value='{"name":"ToolNovo","tools":98,"free":true}';
  function run(min){
    try{var obj=JSON.parse($("jsonIn").value);$("jsonOut").textContent=min?JSON.stringify(obj):JSON.stringify(obj,null,2);$("jsonMsg").textContent="✓ Valid JSON.";}
    catch(e){$("jsonMsg").textContent="✗ Invalid JSON: "+e.message;$("jsonOut").textContent="—";}
  }
  $("jsonFmt").addEventListener("click",function(){run(false);});
  $("jsonMin").addEventListener("click",function(){run(true);});
  $("jsonCopy").addEventListener("click",function(){var t=$("jsonOut").textContent;if(t&&t!=="—")copyText(t,"JSON copied");});
  run(false);
})();

/* ---- Base64 ---- */
(function(){
  mkPanel("base64","Base64 Encoder/Decoder","Convert text to Base64 and back — Unicode safe.",cols2(
    F("Input",TA("b64In",7,""))+'<div class="btn-row"><button type="button" class="btn" id="b64Enc">Encode →</button><button type="button" class="btn secondary" id="b64Dec">← Decode</button></div>',
    F("Output",TA("b64Out",7,""))+'<div class="btn-row"><button type="button" class="btn secondary small" id="b64Copy">Copy output</button></div><p class="note" id="b64Msg"></p>'));
  $("b64In").value="Hello from ToolNovo!";
  function enc(){
    try{var bytes=new TextEncoder().encode($("b64In").value);var bin="";bytes.forEach(function(b){bin+=String.fromCharCode(b);});$("b64Out").value=btoa(bin);$("b64Msg").textContent="";}
    catch(e){$("b64Msg").textContent="Encoding failed: "+e.message;}
  }
  function dec(){
    try{var bin=atob($("b64In").value.trim());var bytes=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);$("b64Out").value=new TextDecoder().decode(bytes);$("b64Msg").textContent="";}
    catch(e){$("b64Msg").textContent="That is not valid Base64.";$("b64Out").value="";}
  }
  $("b64Enc").addEventListener("click",enc);$("b64Dec").addEventListener("click",dec);
  $("b64Copy").addEventListener("click",function(){if($("b64Out").value)copyText($("b64Out").value,"Output copied");});
  enc();
})();

/* ---- URL Encode ---- */
(function(){
  mkPanel("urlenc","URL Encode / Decode","Percent-encode text for safe use in web addresses.",cols2(
    F("Input",TA("ueIn",7,""))+'<div class="btn-row"><button type="button" class="btn" id="ueEnc">Encode →</button><button type="button" class="btn secondary" id="ueDec">← Decode</button></div>',
    F("Output",TA("ueOut",7,""))+'<div class="btn-row"><button type="button" class="btn secondary small" id="ueCopy">Copy output</button></div><p class="note" id="ueMsg"></p>'));
  $("ueIn").value="https://example.com/search?q=coffee & tea&lang=en";
  function enc(){$("ueOut").value=encodeURIComponent($("ueIn").value);$("ueMsg").textContent="Encoded with encodeURIComponent — safe for query values.";}
  function dec(){try{$("ueOut").value=decodeURIComponent($("ueIn").value.trim());$("ueMsg").textContent="";}catch(e){$("ueMsg").textContent="That text cannot be decoded (bad % sequence).";}}
  $("ueEnc").addEventListener("click",enc);$("ueDec").addEventListener("click",dec);
  $("ueCopy").addEventListener("click",function(){if($("ueOut").value)copyText($("ueOut").value,"Output copied");});
  enc();
})();

/* ---- HEX to RGB ---- */
(function(){
  mkPanel("hexrgb","Color Picker","Pick a colour and get its HEX, RGB and HSL values — all kept in sync.",cols2(
    F("HEX colour",IT("hexIn","#10b981",""))+F("Or pick a colour",'<input type="color" id="hexPick" value="#10b981" style="width:100%;height:48px;border:1.5px solid var(--line);border-radius:10px;background:var(--surface);padding:4px" />')+'<div class="row3">'+F("R",IN("rgbR",16,'min="0" max="255"'))+F("G",IN("rgbG",185,'min="0" max="255"'))+F("B",IN("rgbB",129,'min="0" max="255"'))+'</div>',
    '<div class="swatch" id="hexSwatch"></div>'+RB("Colour values","hexBig")));
  function setFromRGB(r,g,b){
    r=Math.max(0,Math.min(255,Math.round(r)));g=Math.max(0,Math.min(255,Math.round(g)));b=Math.max(0,Math.min(255,Math.round(b)));
    var hex="#"+"0123456789abcdef"[Math.floor(r/16)]+"0123456789abcdef"[r%16]+"0123456789abcdef"[Math.floor(g/16)]+"0123456789abcdef"[g%16]+"0123456789abcdef"[Math.floor(b/16)]+"0123456789abcdef"[b%16];
    var rn=r/255,gn=g/255,bn=b/255,mx=Math.max(rn,gn,bn),mn=Math.min(rn,gn,bn),l=(mx+mn)/2,h=0,s=0;
    if(mx!==mn){var d=mx-mn;s=l>0.5?d/(2-mx-mn):d/(mx+mn);if(mx===rn)h=(gn-bn)/d+(gn<bn?6:0);else if(mx===gn)h=(bn-rn)/d+2;else h=(rn-gn)/d+4;h*=60;}
    $("hexSwatch").style.background=hex;
    $("hexBig").textContent=hex.toUpperCase();
    KV("hexBig",[["HEX",hex.toUpperCase()],["RGB","rgb("+r+", "+g+", "+b+")"],["HSL","hsl("+Math.round(h)+", "+Math.round(s*100)+"%, "+Math.round(l*100)+"%)",1]]);
    return hex;
  }
  function fromHex(){
    var v=$("hexIn").value.trim().replace(/^#/,"");
    if(/^[0-9a-fA-F]{3}$/.test(v))v=v.split("").map(function(c){return c+c;}).join("");
    if(!/^[0-9a-fA-F]{6}$/.test(v))return;
    var r=parseInt(v.slice(0,2),16),g=parseInt(v.slice(2,4),16),b=parseInt(v.slice(4,6),16);
    $("rgbR").value=r;$("rgbG").value=g;$("rgbB").value=b;$("hexPick").value="#"+v.toLowerCase();setFromRGB(r,g,b);
  }
  $("hexIn").addEventListener("input",fromHex);
  $("hexPick").addEventListener("input",function(){$("hexIn").value=$("hexPick").value;fromHex();});
  ["rgbR","rgbG","rgbB"].forEach(function(id){$(id).addEventListener("input",function(){var hex=setFromRGB(num("rgbR"),num("rgbG"),num("rgbB"));$("hexIn").value=hex;$("hexPick").value=hex;});});
  fromHex();
})();

/* ---- UUID ---- */
(function(){
  mkPanel("uuid","UUID Generator","Cryptographically random UUIDs (version 4).",cols2(
    F("How many (1–50)",IN("uuidCount",5,'min="1" max="50"'))+'<label class="check"><input type="checkbox" id="uuidUpper" /> UPPERCASE</label><div class="btn-row"><button type="button" class="btn" id="uuidGen">Generate UUIDs</button></div>',
    F("Your UUIDs",TA("uuidOut",8,""))+'<div class="btn-row"><button type="button" class="btn secondary small" id="uuidCopy">Copy all</button></div>'));
  function one(){
    if(crypto.randomUUID)return crypto.randomUUID();
    var b=new Uint8Array(16);crypto.getRandomValues(b);b[6]=(b[6]&0x0f)|0x40;b[8]=(b[8]&0x3f)|0x80;
    var h=Array.prototype.map.call(b,function(x){return ("0"+x.toString(16)).slice(-2);}).join("");
    return h.slice(0,8)+"-"+h.slice(8,12)+"-"+h.slice(12,16)+"-"+h.slice(16,20)+"-"+h.slice(20);
  }
  function gen(){
    var n=Math.max(1,Math.min(50,Math.round(num("uuidCount")))),out=[];
    for(var i=0;i<n;i++){var u=one();out.push($("uuidUpper").checked?u.toUpperCase():u);}
    $("uuidOut").value=out.join("\n");
  }
  $("uuidGen").addEventListener("click",gen);$("uuidUpper").addEventListener("change",gen);
  $("uuidCopy").addEventListener("click",function(){if($("uuidOut").value)copyText($("uuidOut").value,"UUIDs copied");});
  gen();
})();

/* ---- Number Base Converter ---- */
(function(){
  mkPanel("baseconv","Number Base Converter","Binary, octal, decimal and hexadecimal — all at once.",cols2(
    F("Value",IT("bcIn","255",""))+F("The value above is in",SEL("bcFrom",'<option value="10" selected>Decimal (base 10)</option><option value="2">Binary (base 2)</option><option value="8">Octal (base 8)</option><option value="16">Hexadecimal (base 16)</option>')),
    RB("Decimal value","bcBig")));
  function calc(){
    var v=$("bcIn").value.trim(),base=parseInt($("bcFrom").value,10);
    var n=parseInt(v,base);
    if(!v||isNaN(n)){$("bcBig").textContent="—";KV("bcBig",[]);NOTE("bcBig","Check the digits match the base you picked.");return;}
    $("bcBig").textContent=n;
    KV("bcBig",[["Binary (2)",n.toString(2)],["Octal (8)",n.toString(8)],["Decimal (10)",String(n)],["Hexadecimal (16)",n.toString(16).toUpperCase(),1]]);
    NOTE("bcBig","");
  }
  onIn(["bcIn","bcFrom"],calc);calc();
})();

/* ---- Text Reverser ---- */
(function(){
  mkPanel("textrev","Text Reverser","Flip text backwards — by letters, by words, or by lines.",cols2(
    F("Your text",TA("trIn",7,""))+'<div class="btn-row"><button type="button" class="btn" data-tr="chars">Reverse letters</button><button type="button" class="btn secondary" data-tr="words">Reverse words</button><button type="button" class="btn secondary" data-tr="lines">Reverse lines</button></div>',
    F("Reversed",TA("trOut",7,""))+'<div class="btn-row"><button type="button" class="btn secondary small" id="trCopy">Copy result</button></div>'));
  $("trIn").value="The quick brown fox";
  function rev(mode){
    var t=$("trIn").value;
    if(mode==="chars")$("trOut").value=t.split("").reverse().join("");
    else if(mode==="words")$("trOut").value=t.split(/\s+/).reverse().join(" ");
    else $("trOut").value=t.split(/\r?\n/).reverse().join("\n");
  }
  document.querySelectorAll("[data-tr]").forEach(function(b){b.addEventListener("click",function(){rev(b.getAttribute("data-tr"));});});
  $("trCopy").addEventListener("click",function(){if($("trOut").value)copyText($("trOut").value,"Reversed text copied");});
  rev("chars");
})();

/* ---- Image Resizer ---- */
(function(){
  mkPanel("imageresize","Image Resizer","Resize any image to exact pixel dimensions and download the result.",
    '<div class="cols"><div><div class="drop" id="irDrop" role="button" tabindex="0"><b>Tap to choose an image, or drop it here</b>JPG, PNG or WebP</div><input type="file" id="irFile" accept="image/jpeg,image/png,image/webp" class="hidden" /><div style="margin-top:16px"><div class="row2">'+F("New width (px)",IN("irW",800,'min="1"'))+F("New height (px)",IN("irH",600,'min="1"'))+'</div><label class="check"><input type="checkbox" id="irLock" checked /> Keep aspect ratio</label>'+F("Output format",SEL("irFmt",'<option value="image/jpeg">JPEG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option>'))+'<div class="btn-row"><button type="button" class="btn" id="irGo" disabled>Resize image</button><a class="btn secondary hidden" id="irDl" download="resized-image.jpg">Download resized</a></div></div></div><div><div class="img-compare"><figure><img id="irOrig" alt="Original image preview" /><figcaption>Original<br /><b id="irOrigInfo">No image yet</b></figcaption></figure><figure><img id="irNew" alt="Resized image preview" /><figcaption>Resized<br /><b id="irNewInfo">—</b></figcaption></figure></div></div></div>');
  var file=null,url=null,newUrl=null,natW=0,natH=0;
  var drop=$("irDrop"),fi=$("irFile");
  drop.addEventListener("click",function(){fi.click();});
  drop.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();fi.click();}});
  ["dragover","dragenter"].forEach(function(ev){drop.addEventListener(ev,function(e){e.preventDefault();drop.classList.add("over");});});
  ["dragleave","drop"].forEach(function(ev){drop.addEventListener(ev,function(e){e.preventDefault();drop.classList.remove("over");});});
  drop.addEventListener("drop",function(e){var f=e.dataTransfer.files&&e.dataTransfer.files[0];if(f)load(f);});
  fi.addEventListener("change",function(){if(fi.files[0])load(fi.files[0]);});
  function load(f){
    if(!/^image\/(jpeg|png|webp)$/.test(f.type)){toast("Please choose a JPG, PNG or WebP image");return;}
    file=f;if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(f);$("irOrig").src=url;
    var img=new Image();img.onload=function(){natW=img.naturalWidth;natH=img.naturalHeight;$("irW").value=natW;$("irH").value=natH;$("irOrigInfo").textContent=natW+" × "+natH+" px · "+fmtBytes(f.size);$("irGo").disabled=false;};img.src=url;
  }
  $("irW").addEventListener("input",function(){if($("irLock").checked&&natW>0)$("irH").value=Math.round(num("irW")/natW*natH);});
  $("irH").addEventListener("input",function(){if($("irLock").checked&&natH>0)$("irW").value=Math.round(num("irH")/natH*natW);});
  $("irGo").addEventListener("click",function(){
    if(!file)return;
    var img=new Image();
    img.onload=function(){
      var w=Math.max(1,Math.round(num("irW"))),h=Math.max(1,Math.round(num("irH")));
      var c=document.createElement("canvas");c.width=w;c.height=h;var ctx=c.getContext("2d");
      var fmt=$("irFmt").value;if(fmt==="image/jpeg"){ctx.fillStyle="#ffffff";ctx.fillRect(0,0,w,h);}
      ctx.drawImage(img,0,0,w,h);
      c.toBlob(function(blob){
        if(!blob){toast("Resize failed");return;}
        if(newUrl)URL.revokeObjectURL(newUrl);newUrl=URL.createObjectURL(blob);
        $("irNew").src=newUrl;$("irNewInfo").textContent=w+" × "+h+" px · "+fmtBytes(blob.size);
        var ext=fmt==="image/png"?".png":fmt==="image/webp"?".webp":".jpg";
        var dl=$("irDl");dl.href=newUrl;dl.setAttribute("download","resized-"+w+"x"+h+ext);dl.classList.remove("hidden");
      },fmt,0.92);
    };
    img.src=url;
  });
})();

/* ---- Social Character Counter ---- */
(function(){
  var LIMITS=[["X (Twitter) post",280],["Instagram caption",2200],["Instagram bio",150],["TikTok caption",2200],["LinkedIn post",3000],["Facebook post",63206],["YouTube title",100],["YouTube description",5000],["Threads post",500],["Pinterest title",100]];
  mkPanel("charcount","Social Media Character Counter","Type once — see exactly how your text fits every platform.",
    F("Your caption, post or title",TA("scTxt",6,"Write your post here…"))+'<div id="scList" style="margin-top:14px"></div>');
  function calc(){
    var len=$("scTxt").value.length;
    $("scList").innerHTML=LIMITS.map(function(L){
      var left=L[1]-len,pct=Math.min(100,len/L[1]*100),over=len>L[1];
      return '<div class="bar-wrap"><div class="bar-label"><span>'+L[0]+'</span><span>'+len+" / "+fmtNum(L[1])+(over?' — '+Math.abs(left)+' over!':' — '+left+' left')+'</span></div><div class="bar'+(over?"":"")+'" style="'+(over?"":"")+'"><i style="width:'+pct+'%;'+(over?"background:var(--danger)":"")+'"></i></div></div>';
    }).join("");
  }
  $("scTxt").addEventListener("input",calc);calc();
})();

/* ---- Grade Calculator ---- */
(function(){
  mkPanel("gradecalc","Grade Calculator","Turn a score into US letter grades and UK degree classifications.",cols2(
    '<div class="row2">'+F("Points earned",IN("gcEarned",86,'min="0"'))+F("Points possible",IN("gcTotal",100,'min="0"'))+'</div>'+F("Or type a percentage directly",IN("gcPct",86,'min="0" max="100" step="0.1"')),
    RB("Your grade","gcBig")));
  function letter(p){return p>=97?"A+":p>=93?"A":p>=90?"A−":p>=87?"B+":p>=83?"B":p>=80?"B−":p>=77?"C+":p>=73?"C":p>=70?"C−":p>=67?"D+":p>=63?"D":p>=60?"D−":"F";}
  function uk(p){return p>=70?"First Class Honours":p>=60?"Upper Second (2:1)":p>=50?"Lower Second (2:2)":p>=40?"Third Class":"Fail (below 40%)";}
  function show(p){
    if(isNaN(p)||p<0){$("gcBig").textContent="—";return;}
    $("gcBig").textContent=letter(p)+" — "+(Math.round(p*10)/10)+"%";
    KV("gcBig",[["US letter grade",letter(p)],["US GPA points",({"A+":"4.0","A":"4.0","A−":"3.7","B+":"3.3","B":"3.0","B−":"2.7","C+":"2.3","C":"2.0","C−":"1.7","D+":"1.3","D":"1.0","D−":"0.7","F":"0.0"})[letter(p)]],["UK degree class (undergraduate)",uk(p),1]]);
    NOTE("gcBig","UK classifications apply to bachelor's degrees; school GCSE/A-level grades use 9–1 and A*–E scales instead.");
  }
  function fromPoints(){var t=num("gcTotal");if(t>0){$("gcPct").value=Math.round(num("gcEarned")/t*1000)/10;show(num("gcEarned")/t*100);}}
  onIn(["gcEarned","gcTotal"],fromPoints);
  $("gcPct").addEventListener("input",function(){show(parseFloat($("gcPct").value));});
  fromPoints();
})();

/* ---- Final Grade ---- */
(function(){
  mkPanel("finalgrade","Final Grade Calculator","What do you need on the final exam to get the grade you want?",cols2(
    F("Current grade (%)",IN("fgCur",88,'min="0" max="100" step="0.1"'))+F("Grade you want overall (%)",IN("fgWant",90,'min="0" max="100" step="0.1"'))+F("Final exam weight (%)",IN("fgWeight",25,'min="1" max="100" step="1"'))+F("Your final score, if you know it (%) — optional",IN("fgScore",0,'min="0" max="100" step="0.1"')),
    RB("You need on the final","fgBig")));
  function calc(){
    var cur=num("fgCur"),want=num("fgWant"),w=num("fgWeight")/100;
    if(w<=0){$("fgBig").textContent="—";return;}
    var need=(want-cur*(1-w))/w;
    $("fgBig").textContent=need>100?"Not possible 😬":need<=0?"Already secured 🎉":(Math.round(need*10)/10)+"%";
    function fmtNeed(v){v=Math.round(v*10)/10;return v<=0?"0% — already secured":v>100?v+"% — not achievable":v+"%";}
    var rows=[["Needed for your target",fmtNeed(need)]];
    [95,90,85,80,70,60].forEach(function(g){rows.push(["Needed for "+g+"% overall",fmtNeed((g-cur*(1-w))/w)]);});
    var sc=parseFloat($("fgScore").value);
    if(sc>0)rows.push(["With a "+sc+"% final, your overall grade", (Math.round((cur*(1-w)+sc*w)*10)/10)+"%",1]);
    KV("fgBig",rows);
    NOTE("fgBig",need>100?"Even a perfect final cannot reach that target — the maximum overall grade is "+(Math.round((cur*(1-w)+100*w)*10)/10)+"%.":need<=0?"Your current grade already guarantees your target, even with a zero on the final.":"Scores are rounded to one decimal place.");
  }
  onIn(["fgCur","fgWant","fgWeight","fgScore"],calc);calc();
})();

/* ---- Dice Roller ---- */
(function(){
  mkPanel("dice","Dice Roller","Roll polyhedral dice for games, decisions and probability fun.",cols2(
    '<div class="row2">'+F("Number of dice (1–10)",IN("diceN",2,'min="1" max="10"'))+F("Dice type",SEL("diceSides",'<option value="4">d4</option><option value="6" selected>d6</option><option value="8">d8</option><option value="10">d10</option><option value="12">d12</option><option value="20">d20</option><option value="100">d100</option>'))+'</div><button type="button" class="btn" id="diceRoll">🎲 Roll the dice</button>',
    '<div class="result-box"><h3>Result</h3><div class="dice-row" id="diceRow"><span style="color:var(--muted)">Press roll…</span></div><div class="kv"><span>Total</span><b id="diceTotal">—</b></div><div class="kv"><span>Rolls this session</span><b id="diceCount">0</b></div><p class="note" id="diceHist"></p></div>'));
  var rolls=0,history=[];
  $("diceRoll").addEventListener("click",function(){
    var n=Math.max(1,Math.min(10,Math.round(num("diceN")))),sides=parseInt($("diceSides").value,10),vals=[],total=0;
    for(var i=0;i<n;i++){var a=new Uint32Array(1);crypto.getRandomValues(a);var v=1+(a[0]%sides);vals.push(v);total+=v;}
    rolls++;
    $("diceRow").innerHTML=vals.map(function(v){return '<span class="die">'+v+'</span>';}).join("");
    $("diceTotal").textContent=total;$("diceCount").textContent=rolls;
    history.unshift("d"+sides+"×"+n+" → "+total);if(history.length>5)history.pop();
    $("diceHist").textContent="Recent: "+history.join(" · ");
  });
})();

/* ---- Coin Flip ---- */
(function(){
  mkPanel("coin","Coin Flip","A fair coin, flipped as often as you need.",cols2(
    '<div class="btn-row" style="flex-direction:column;align-items:stretch"><button type="button" class="btn" id="coinFlip">Flip once</button><button type="button" class="btn secondary" id="coinFlip10">Flip 10 times</button><button type="button" class="btn secondary" id="coinReset">Reset stats</button></div>',
    '<div class="result-box"><h3>Last flip</h3><div class="coin-face" id="coinFace">?</div><div class="kv"><span>Heads</span><b id="coinH">0</b></div><div class="kv"><span>Tails</span><b id="coinT">0</b></div><div class="kv"><span>Total flips</span><b id="coinN">0</b></div><div class="kv"><span>Current streak</span><b id="coinStreak">—</b></div></div>'));
  var H=0,T=0,streak="",streakN=0;
  function flip(times){
    var last="";
    for(var i=0;i<times;i++){var a=new Uint32Array(1);crypto.getRandomValues(a);last=a[0]%2===0?"Heads":"Tails";if(last==="Heads")H++;else T++;if(last===streak)streakN++;else{streak=last;streakN=1;}}
    $("coinFace").textContent=last;$("coinH").textContent=H;$("coinT").textContent=T;$("coinN").textContent=H+T;
    $("coinStreak").textContent=streak+" × "+streakN;
  }
  $("coinFlip").addEventListener("click",function(){flip(1);});
  $("coinFlip10").addEventListener("click",function(){flip(10);});
  $("coinReset").addEventListener("click",function(){H=0;T=0;streak="";streakN=0;$("coinFace").textContent="?";$("coinH").textContent=0;$("coinT").textContent=0;$("coinN").textContent=0;$("coinStreak").textContent="—";});
})();

/* ---- Stopwatch ---- */
(function(){
  mkPanel("stopwatch","Stopwatch","Hundredth-of-a-second timing with laps.",
    '<div class="result-box"><div class="big-timer" id="swDisp">00:00.00</div><div class="btn-row" style="justify-content:center"><button type="button" class="btn" id="swStart">Start</button><button type="button" class="btn secondary" id="swLap" disabled>Lap</button><button type="button" class="btn secondary" id="swReset">Reset</button></div><div class="lap-list" id="swLaps" style="margin-top:14px"></div></div>');
  var start=0,elapsed=0,raf=null,running=false,lapN=0,lastLap=0;
  function fmt(ms){var cs=Math.floor(ms/10)%100,s=Math.floor(ms/1000)%60,m=Math.floor(ms/60000);return ("0"+m).slice(-2)+":"+("0"+s).slice(-2)+"."+("0"+cs).slice(-2);}
  function tick(){$("swDisp").textContent=fmt(elapsed+(running?Date.now()-start:0));if(running)raf=requestAnimationFrame(tick);}
  $("swStart").addEventListener("click",function(){
    if(running){running=false;elapsed+=Date.now()-start;cancelAnimationFrame(raf);$("swStart").textContent="Resume";$("swLap").disabled=true;}
    else{running=true;start=Date.now();$("swStart").textContent="Stop";$("swLap").disabled=false;tick();}
    $("swDisp").textContent=fmt(elapsed);
  });
  $("swLap").addEventListener("click",function(){
    var now=elapsed+(Date.now()-start);lapN++;
    var row=document.createElement("div");row.className="kv";row.innerHTML="<span>Lap "+lapN+"</span><b>"+fmt(now-lastLap)+" · total "+fmt(now)+"</b>";
    $("swLaps").prepend(row);lastLap=now;
  });
  $("swReset").addEventListener("click",function(){running=false;cancelAnimationFrame(raf);elapsed=0;lapN=0;lastLap=0;$("swDisp").textContent="00:00.00";$("swLaps").innerHTML="";$("swStart").textContent="Start";$("swLap").disabled=true;});
})();

/* ---- Countdown Timer ---- */
(function(){
  mkPanel("timer","Countdown Timer","Set a duration and get a chime when time is up.",cols2(
    '<div class="row2">'+F("Minutes",IN("tmMin",5,'min="0" max="999"'))+F("Seconds",IN("tmSec",0,'min="0" max="59"'))+'</div><div class="preset-row" style="margin-bottom:12px"><button type="button" data-tm="60">1 min</button><button type="button" data-tm="300">5 min</button><button type="button" data-tm="600">10 min</button><button type="button" data-tm="1500">25 min Pomodoro</button><button type="button" data-tm="2700">45 min</button></div><div class="btn-row"><button type="button" class="btn" id="tmStart">Start timer</button><button type="button" class="btn secondary" id="tmReset">Reset</button></div>',
    '<div class="result-box"><div class="big-timer" id="tmDisp">05:00</div><div class="bar"><i id="tmBar" style="width:100%"></i></div><p class="note" id="tmMsg" style="text-align:center"></p></div>'));
  var totalMs=300000,remainMs=300000,endAt=0,intv=null,audioCtx=null;
  function fmt(ms){ms=Math.max(0,Math.ceil(ms/1000));var m=Math.floor(ms/60),s=ms%60;return ("0"+m).slice(-2)+":"+("0"+s).slice(-2);}
  function draw(){$("tmDisp").textContent=fmt(remainMs);$("tmBar").style.width=(totalMs>0?remainMs/totalMs*100:0)+"%";}
  function setFromInputs(){totalMs=(num("tmMin")*60+num("tmSec"))*1000;remainMs=totalMs;draw();}
  function beep(){
    try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==="suspended")audioCtx.resume();
      [0,0.35,0.7].forEach(function(off){var o=audioCtx.createOscillator(),g=audioCtx.createGain();o.frequency.value=880;o.connect(g);g.connect(audioCtx.destination);g.gain.setValueAtTime(0.25,audioCtx.currentTime+off);o.start(audioCtx.currentTime+off);o.stop(audioCtx.currentTime+off+0.25);});
    }catch(e){}
  }
  function stopInt(){if(intv){clearInterval(intv);intv=null;}}
  document.querySelectorAll("[data-tm]").forEach(function(b){b.addEventListener("click",function(){stopInt();$("tmStart").textContent="Start timer";var s=parseInt(b.getAttribute("data-tm"),10);$("tmMin").value=Math.floor(s/60);$("tmSec").value=s%60;setFromInputs();$("tmMsg").textContent="";});});
  ["tmMin","tmSec"].forEach(function(id){$(id).addEventListener("input",function(){stopInt();$("tmStart").textContent="Start timer";setFromInputs();});});
  $("tmStart").addEventListener("click",function(){
    if(intv){stopInt();remainMs=Math.max(0,endAt-Date.now());$("tmStart").textContent="Resume timer";draw();return;}
    if(remainMs<=0)setFromInputs();
    if(remainMs<=0){toast("Set a duration first");return;}
    endAt=Date.now()+remainMs;$("tmStart").textContent="Pause";$("tmMsg").textContent="";
    intv=setInterval(function(){remainMs=endAt-Date.now();if(remainMs<=0){remainMs=0;draw();stopInt();$("tmStart").textContent="Start timer";$("tmMsg").textContent="⏰ Time is up!";beep();toast("Timer finished");}else draw();},200);
  });
  $("tmReset").addEventListener("click",function(){stopInt();$("tmStart").textContent="Start timer";$("tmMsg").textContent="";setFromInputs();});
  setFromInputs();
})();

/* ---- Random Name Picker ---- */
(function(){
  mkPanel("namepicker","Random Name Picker","Pick a fair random winner from any list.",cols2(
    F("Names (one per line)",TA("npTxt",8,""))+'<div class="row2">'+F("How many to pick",IN("npCount",1,'min="1" max="50"'))+F(" ",'<label class="check"><input type="checkbox" id="npRemove" /> Remove winners from the list</label>')+'</div><button type="button" class="btn" id="npGo">🎉 Pick a winner</button>',
    '<div class="result-box"><h3>Winner(s)</h3><div class="big-num" id="npOut" style="font-size:1.5rem">—</div><p class="note" id="npInfo"></p></div>'));
  $("npTxt").value="Alex\nPriya\nJordan\nSam\nTaylor\nCasey";
  function names(){return $("npTxt").value.split(/\r?\n/).map(function(x){return x.trim();}).filter(Boolean);}
  function go(){
    var list=names(),n=Math.max(1,Math.round(num("npCount")));
    if(!list.length){toast("Add some names first");return;}
    if(n>list.length){toast("Not enough names in the list");return;}
    var pool=list.slice(),picked=[];
    for(var i=0;i<n;i++){var a=new Uint32Array(1);crypto.getRandomValues(a);picked.push(pool.splice(a[0]%pool.length,1)[0]);}
    $("npOut").textContent=picked.join(", ");
    if($("npRemove").checked)$("npTxt").value=pool.join("\n");
    $("npInfo").textContent="Picked "+picked.length+" from "+list.length+" names."+($("npRemove").checked?" Winners removed — "+pool.length+" names remain.":"");
  }
  $("npGo").addEventListener("click",go);
})();



/* ---- 50/30/20 Budget ---- */
(function(){
  mkPanel("budgetrule","50/30/20 Budget Rule Calculator","Split take-home pay into needs, wants and savings the classic way.",cols2(
    curSeg("brCurSeg")+F("Monthly take-home pay (after tax)",IN("brIncome",4200,'min="0" step="50"')),
    RB("Needs — 50% (rent, bills, groceries)","brBig")));
  var cur="USD";segWire("brCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){var inc=num("brIncome");$("brBig").textContent=fmtMoney(inc*0.5,cur)+" / mo";
    KV("brBig",[["Needs — 50%",fmtMoney(inc*0.5,cur)],["Wants — 30% (fun, eating out, subscriptions)",fmtMoney(inc*0.3,cur)],["Savings & extra debt payments — 20%",fmtMoney(inc*0.2,cur)],["Savings in a year at 20%",fmtMoney0(inc*0.2*12,cur),1]]);
    NOTE("brBig","In high-cost cities like New York, London or Toronto, needs often exceed 50% — adjust the split (for example 60/25/15) rather than abandoning the system.");}
  onIn(["brIncome"],calc);calc();
})();
/* ---- Emergency Fund ---- */
(function(){
  mkPanel("emergencyfund","Emergency Fund Calculator","The safety net that turns a crisis into an inconvenience.",cols2(
    curSeg("efCurSeg")+F("Essential monthly expenses (rent, bills, food, transport)",IN("efExp",2800,'min="0" step="50"'))+F("Months of cover",SEL("efMonths",'<option value="3">3 months — starter</option><option value="6" selected>6 months — standard</option><option value="9">9 months</option><option value="12">12 months — maximum security</option>'))+F("Already saved",IN("efSaved",3000,'min="0" step="50"'))+F("Monthly contribution",IN("efMonthly",400,'min="0" step="25"')),
    RB("Your emergency fund target","efBig")));
  var cur="USD";segWire("efCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){var target=num("efExp")*num("efMonths"),saved=num("efSaved"),need=Math.max(target-saved,0),per=num("efMonthly");
    $("efBig").textContent=fmtMoney0(target,cur);
    var months=per>0?Math.ceil(need/per):0;var d=new Date();d.setMonth(d.getMonth()+months);
    KV("efBig",[["Already saved",fmtMoney0(saved,cur)],["Still needed",fmtMoney0(need,cur)],["Months to finish",need<=0?"Done":(per>0?months:"Add a contribution")],["Target date",need<=0?"Already covered":d.toLocaleDateString("en-US",{month:"long",year:"numeric"}),1]]);
    NOTE("efBig","Keep it in an easy-access savings account, separate from everyday spending. Freelancers and single-income households usually aim for the higher end.");}
  onIn(["efExp","efMonths","efSaved","efMonthly"],calc);calc();
})();
/* ---- Debt Snowball ---- */
(function(){
  function drow(n,b,m,a){return '<div class="row3">'+F("Debt "+n+" balance",IN("dsB"+n,b,'min="0" step="10"'))+F("Min. payment",IN("dsM"+n,m,'min="0" step="5"'))+F("APR %",IN("dsA"+n,a,'min="0" step="0.1"'))+'</div>';}
  mkPanel("debtsnowball","Debt Snowball Payoff Calculator","Smallest balance first — quick wins that build momentum.",cols2(
    curSeg("dsCurSeg")+drow(1,1200,35,24.99)+drow(2,3400,85,19.99)+drow(3,800,25,29.99)+F("Extra money per month (on top of all minimums)",IN("dsExtra",150,'min="0" step="10"')),
    RB("Debt-free in","dsBig")));
  var cur="USD";segWire("dsCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){
    var debts=[];for(var i=1;i<=3;i++){var b=num("dsB"+i);if(b>0)debts.push({bal:b,min:num("dsM"+i),apr:num("dsA"+i)/100/12});}
    if(!debts.length){$("dsBig").textContent="No debts";KV("dsBig",[]);return;}
    debts.sort(function(a,b){return a.bal-b.bal;});
    var extra=num("dsExtra"),months=0,interest=0,ok=true;
    var totalMin=debts.reduce(function(s,d){return s+d.min;},0);
    while(debts.some(function(d){return d.bal>0.005;})&&months<600){
      months++;var freed=extra;
      debts.forEach(function(d){if(d.bal>0){var i=d.bal*d.apr;interest+=i;d.bal+=i;}});
      debts.forEach(function(d){if(d.bal>0){var pay=Math.min(d.min,d.bal);d.bal-=pay;if(d.bal<=0.005)freed+=d.min;}});
      for(var j=0;j<debts.length&&freed>0;j++){var d=debts[j];if(d.bal>0){var pay2=Math.min(freed,d.bal);d.bal-=pay2;freed-=pay2;}}
      if(months===1&&interest>=totalMin+extra){ok=false;break;}
    }
    if(!ok||months>=600){$("dsBig").textContent="Not clearing";NOTE("dsBig","Payments do not beat the interest. Increase the extra amount or minimums.");KV("dsBig",[]);return;}
    var yrs=Math.floor(months/12),mos=months%12;var dte=new Date();dte.setMonth(dte.getMonth()+months);
    $("dsBig").textContent=(yrs?yrs+" yr ":"")+mos+" mo";
    KV("dsBig",[["Debt-free date",dte.toLocaleDateString("en-US",{month:"long",year:"numeric"}),1],["Total interest paid",fmtMoney0(interest,cur)],["Monthly going to debt",fmtMoney0(totalMin+extra,cur)]]);
    NOTE("dsBig","Snowball order: smallest balance first regardless of APR. The avalanche method (highest APR first) costs slightly less — snowball wins on motivation.");}
  onIn(["dsB1","dsM1","dsA1","dsB2","dsM2","dsA2","dsB3","dsM3","dsA3","dsExtra"],calc);calc();
})();
/* ---- Retirement ---- */
(function(){
  mkPanel("retirement","Retirement Savings Calculator","What your pension pot could be worth when you stop work.",cols2(
    curSeg("rtCurSeg")+'<div class="row2">'+F("Your age now",IN("rtNow",30,'min="16" max="80"'))+F("Retirement age",IN("rtRet",67,'min="40" max="90"'))+'</div>'+F("Saved so far (401(k) / pension / RRSP)",IN("rtSaved",25000,'min="0" step="500"'))+F("Monthly contribution (incl. employer match)",IN("rtMonthly",500,'min="0" step="25"'))+F("Expected annual return (%)",IN("rtReturn",7,'min="0" step="0.25"')),
    RB("Projected pot at retirement","rtBig")));
  var cur="USD";segWire("rtCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){var yrs=Math.max(num("rtRet")-num("rtNow"),0),months=Math.round(yrs*12),bal=num("rtSaved"),mr=num("rtReturn")/100/12,contrib=num("rtSaved");
    for(var i=0;i<months;i++){bal=bal*(1+mr)+num("rtMonthly");contrib+=num("rtMonthly");}
    $("rtBig").textContent=fmtMoney0(bal,cur);
    KV("rtBig",[["Years of growth",yrs],["You will contribute",fmtMoney0(contrib,cur)],["Investment growth",fmtMoney0(Math.max(bal-contrib,0),cur),1]]);
    NOTE("rtBig","Illustration only — returns vary and inflation will reduce future buying power. US 401(k), UK workplace pensions and Canadian RRSPs all add tax advantages and often employer matching on top.");}
  onIn(["rtNow","rtRet","rtSaved","rtMonthly","rtReturn"],calc);calc();
})();
/* ---- Auto Loan ---- */
(function(){
  mkPanel("autoloan","Auto Loan Calculator","Car payments with down payment, trade-in and sales tax included.",cols2(
    curSeg("alCurSeg")+F("Vehicle price",IN("alPrice",32000,'min="0" step="250"'))+'<div class="row2">'+F("Down payment",IN("alDown",4000,'min="0" step="250"'))+F("Trade-in value",IN("alTrade",0,'min="0" step="250"'))+'</div><div class="row2">'+F("Sales tax / VAT on purchase (%)",IN("alTax",6,'min="0" step="0.25"'))+F("APR (%)",IN("alRate",7.9,'min="0" step="0.1"'))+'</div>'+F("Term",SEL("alTerm",'<option value="36">36 months</option><option value="48">48 months</option><option value="60" selected>60 months</option><option value="72">72 months</option><option value="84">84 months</option>')),
    RB("Monthly payment","alBig")));
  var cur="USD";segWire("alCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){var price=num("alPrice"),taxAmt=price*num("alTax")/100,loan=Math.max(price+taxAmt-num("alDown")-num("alTrade"),0),r=num("alRate")/100/12,n=parseInt($("alTerm").value,10);
    var pay=loan>0?(r>0?loan*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):loan/n):0;
    $("alBig").textContent=fmtMoney(pay,cur);
    KV("alBig",[["Amount financed",fmtMoney0(loan,cur)],["Tax on purchase",fmtMoney0(taxAmt,cur)],["Total interest",fmtMoney0(Math.max(pay*n-loan,0),cur)],["Total cost of the car",fmtMoney0(price+taxAmt+Math.max(pay*n-loan,0),cur),1]]);
    NOTE("alBig","Longer terms (72–84 months) shrink the payment but you may owe more than the car is worth. Insurance, fuel and maintenance are extra.");}
  onIn(["alPrice","alDown","alTrade","alTax","alRate","alTerm"],calc);calc();
})();
/* ---- Student Loan ---- */
(function(){
  mkPanel("studentloan","Student Loan Calculator","Monthly payment and the real total cost of a student loan.",cols2(
    curSeg("slCurSeg")+F("Total borrowed",IN("slAmt",35000,'min="0" step="500"'))+'<div class="row2">'+F("Interest rate (%)",IN("slRate",5.5,'min="0" step="0.1"'))+F("Repayment term (years)",IN("slYears",10,'min="1" max="30"'))+'</div>'+F("Extra monthly payment (optional)",IN("slExtra",0,'min="0" step="10"')),
    RB("Monthly payment","slBig")));
  var cur="USD";segWire("slCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){var P=num("slAmt"),r=num("slRate")/100/12,n=Math.round(num("slYears")*12),extra=num("slExtra");
    if(P<=0||n<=0){$("slBig").textContent="—";return;}
    var pay=r>0?P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):P/n;
    var bal=P,interest=0,months=0,mp=pay+extra;
    while(bal>0.005&&months<600){var i=bal*r;interest+=i;bal=bal+i-Math.min(mp,bal+i);months++;}
    $("slBig").textContent=fmtMoney(mp,cur);
    var d=new Date();d.setMonth(d.getMonth()+months);
    KV("slBig",[["Standard payment (no extra)",fmtMoney(pay,cur)],["Total interest",fmtMoney0(interest,cur)],["Paid off",d.toLocaleDateString("en-US",{month:"long",year:"numeric"})+" ("+months+" payments)",1]]);
    NOTE("slBig","US federal loans offer income-driven plans and forgiveness routes this estimate does not model; UK Plan 2/4/5 loans are repaid through payroll and written off after a set term — check your exact plan.");}
  onIn(["slAmt","slRate","slYears","slExtra"],calc);calc();
})();
/* ---- Net Worth ---- */
(function(){
  mkPanel("networth","Net Worth Calculator","Own minus owe — the single best snapshot of financial progress.",cols2(
    curSeg("nwCurSeg")+'<div class="field"><label>What you OWN</label></div><div class="row2">'+F("Home value",IN("nwHome",350000,'min="0" step="1000"'))+F("Cash & savings",IN("nwCash",18000,'min="0" step="500"'))+'</div><div class="row2">'+F("Investments & pensions",IN("nwInvest",42000,'min="0" step="500"'))+F("Other assets (car, valuables)",IN("nwOther",8000,'min="0" step="500"'))+'</div><div class="field"><label>What you OWE</label></div><div class="row2">'+F("Mortgage balance",IN("nwMort",260000,'min="0" step="1000"'))+F("Loans (car, student, personal)",IN("nwLoans",12000,'min="0" step="500"'))+'</div><div class="row2">'+F("Credit cards",IN("nwCards",3500,'min="0" step="100"'))+F("Other debts",IN("nwOtherL",0,'min="0" step="100"'))+'</div>',
    RB("Your net worth","nwBig")));
  var cur="USD";segWire("nwCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){var assets=num("nwHome")+num("nwCash")+num("nwInvest")+num("nwOther"),liab=num("nwMort")+num("nwLoans")+num("nwCards")+num("nwOtherL"),nw=assets-liab;
    $("nwBig").textContent=fmtMoney0(nw,cur);
    KV("nwBig",[["Total assets",fmtMoney0(assets,cur)],["Total debts",fmtMoney0(liab,cur)],["Debt as % of assets",assets>0?(liab/assets*100).toFixed(1)+"%":"—"],["Home equity",fmtMoney0(num("nwHome")-num("nwMort"),cur),1]]);
    NOTE("nwBig","Recalculate every 6–12 months and watch the trend, not the level. A negative net worth early in a career with student loans is common — direction matters.");}
  onIn(["nwHome","nwCash","nwInvest","nwOther","nwMort","nwLoans","nwCards","nwOtherL"],calc);calc();
})();
/* ---- Freelance Rate ---- */
(function(){
  mkPanel("freelancerate","Freelance Hourly Rate Calculator","The rate you must charge to match a salary — after tax, expenses and holidays.",cols2(
    curSeg("flCurSeg")+F("Target personal income per year (before your tax)",IN("flSalary",80000,'min="0" step="1000"'))+'<div class="row2">'+F("Weeks off per year (holiday + sick)",IN("flWeeks",4,'min="0" max="20"'))+F("Working hours per week",IN("flHours",40,'min="1" max="80"'))+'</div><div class="row2">'+F("Billable share of hours (%)",IN("flBill",70,'min="10" max="100"'))+F("Business expenses per year",IN("flExp",6000,'min="0" step="250"'))+'</div>'+F("Tax & pension reserve (%)",IN("flTax",22,'min="0" max="60"')),
    RB("Charge at least","flBig")));
  var cur="USD";segWire("flCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){var weeks=52-num("flWeeks"),billable=weeks*num("flHours")*num("flBill")/100,need=(num("flSalary")+num("flExp"))/(1-num("flTax")/100),rate=billable>0?need/billable:0;
    $("flBig").textContent=fmtMoney(rate,cur)+" / hr";
    KV("flBig",[["Billable hours per year",fmtNum(Math.round(billable))],["Revenue you must bill",fmtMoney0(need,cur)],["Equivalent day rate (8 hrs)",fmtMoney(rate*8,cur),1]]);
    NOTE("flBig","Most freelancers bill only 60–75% of their hours — the rest is paperwork, marketing and gaps between clients. Price on billable hours, not total hours.");}
  onIn(["flSalary","flWeeks","flHours","flBill","flExp","flTax"],calc);calc();
})();
/* ---- Overtime Pay ---- */
(function(){
  mkPanel("overtimepay","Overtime Pay Calculator","Regular pay plus overtime at time-and-a-half or double time.",cols2(
    curSeg("otCurSeg")+F("Hourly rate",IN("otRate",22,'min="0" step="0.5"'))+'<div class="row2">'+F("Regular hours (per week)",IN("otReg",40,'min="0"'))+F("Overtime hours (per week)",IN("otHrs",6,'min="0"'))+'</div>'+F("Overtime multiplier",SEL("otMult",'<option value="1.5" selected>1.5× — time and a half</option><option value="2">2× — double time</option><option value="1.25">1.25×</option>')),
    RB("Total weekly pay","otBig")));
  var cur="USD";segWire("otCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){var reg=num("otRate")*num("otReg"),ot=num("otRate")*num("otMult")*num("otHrs"),tot=reg+ot,hrs=num("otReg")+num("otHrs");
    $("otBig").textContent=fmtMoney(tot,cur);
    KV("otBig",[["Regular pay",fmtMoney(reg,cur)],["Overtime pay",fmtMoney(ot,cur)],["Effective hourly rate",hrs>0?fmtMoney(tot/hrs,cur):"—"],["Monthly equivalent (×52÷12)",fmtMoney0(tot*52/12,cur),1]]);
    NOTE("otBig","US federal law requires 1.5× after 40 hours/week for most non-exempt workers. UK and Canadian rules come from your contract and provincial law — check yours.");}
  onIn(["otRate","otReg","otHrs","otMult"],calc);calc();
})();


/* ---- Paint ---- */
(function(){
  mkPanel("paint","Paint Calculator","Gallons and litres for any room — doors, windows and extra coats included.",cols2(
    '<div class="row3">'+F("Room length (ft)",IN("ptLen",12,'min="0" step="0.5"'))+F("Width (ft)",IN("ptWid",10,'min="0" step="0.5"'))+F("Wall height (ft)",IN("ptHgt",8,'min="0" step="0.5"'))+'</div><div class="row3">'+F("Doors",IN("ptDoors",1,'min="0"'))+F("Windows",IN("ptWin",2,'min="0"'))+F("Coats",IN("ptCoats",2,'min="1" max="4"'))+'</div>'+F("Paint the ceiling too?",SEL("ptCeil",'<option value="no" selected>No</option><option value="yes">Yes — one coat</option>')),
    RB("Paint needed","ptBig")));
  function calc(){var walls=2*(num("ptLen")+num("ptWid"))*num("ptHgt")-num("ptDoors")*21-num("ptWin")*15;walls=Math.max(walls,0);
    var area=walls*num("ptCoats");if($("ptCeil").value==="yes")area+=num("ptLen")*num("ptWid");
    var gal=area/350;$("ptBig").textContent=gal.toFixed(2)+" gallons";
    KV("ptBig",[["Paintable area (all coats)",fmtNum(Math.round(area))+" sq ft"],["In litres",(gal*3.785).toFixed(1)+" L"],["US gallons to buy",Math.ceil(gal)+" × 1 gal cans"],["If buying 5 L tins (UK/Canada)",Math.ceil(gal*3.785/5)+" tins",1]]);
    NOTE("ptBig","One US gallon covers about 350 sq ft per coat on smooth walls. Rough, porous or dark-to-light changes need more — buy 10% extra and keep the batch number for touch-ups.");}
  onIn(["ptLen","ptWid","ptHgt","ptDoors","ptWin","ptCoats","ptCeil"],calc);calc();
})();
/* ---- Tile & Flooring ---- */
(function(){
  mkPanel("tile","Tile & Flooring Calculator","Tiles and boxes for a floor or wall, with the wastage professionals add.",cols2(
    '<div class="row2">'+F("Area length (ft)",IN("tlLen",12,'min="0" step="0.5"'))+F("Area width (ft)",IN("tlWid",10,'min="0" step="0.5"'))+'</div><div class="row2">'+F("Tile size",SEL("tlSize",'<option value="36">6 × 6 in</option><option value="144" selected>12 × 12 in</option><option value="324">18 × 18 in</option><option value="576">24 × 24 in</option><option value="288">12 × 24 in</option>'))+F("Tiles per box",IN("tlPerBox",10,'min="1"'))+'</div>'+F("Wastage allowance (%)",IN("tlWaste",10,'min="0" max="30"')),
    RB("Tiles needed","tlBig")));
  function calc(){var area=num("tlLen")*num("tlWid"),tileSqIn=parseFloat($("tlSize").value),perTile=tileSqIn/144;
    var need=perTile>0?Math.ceil(area*(1+num("tlWaste")/100)/perTile):0;
    $("tlBig").textContent=fmtNum(need)+" tiles";
    KV("tlBig",[["Area to cover",fmtNum(Math.round(area))+" sq ft ("+(area*0.0929).toFixed(1)+" m²)"],["Boxes to buy",Math.ceil(need/Math.max(num("tlPerBox"),1))],["Flooring packs (if 20 sq ft / pack)",Math.ceil(area*1.1/20),1]]);
    NOTE("tlBig","Add 10% for straight layouts, 15% for diagonal or patterned layouts. Keep spare tiles from the same batch for future repairs.");}
  onIn(["tlLen","tlWid","tlSize","tlPerBox","tlWaste"],calc);calc();
})();
/* ---- Wedding Budget ---- */
(function(){
  var SPLIT=[["Venue & hire",18],["Catering & drinks",28],["Photography & video",12],["Attire & rings",9],["Flowers & decor",10],["Music & entertainment",5],["Cake",3],["Stationery & favours",3],["Transport",2],["Buffer / miscellaneous",10]];
  mkPanel("weddingbudget","Wedding Budget Planner","A realistic split of your wedding budget — and the cost per guest.",cols2(
    curSeg("wbCurSeg")+F("Total budget",IN("wbBudget",25000,'min="0" step="250"'))+F("Number of guests",IN("wbGuests",120,'min="1"')),
    RB("Cost per guest","wbBig")));
  var cur="USD";segWire("wbCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){var bud=num("wbBudget"),g=Math.max(num("wbGuests"),1);
    $("wbBig").textContent=fmtMoney0(bud/g,cur);
    KV("wbBig",SPLIT.map(function(s){return [s[0]+" — "+s[1]+"%",fmtMoney0(bud*s[1]/100,cur)];}).concat([["Total",fmtMoney0(bud,cur),1]]));
    NOTE("wbBig","Percentages reflect typical US/UK/Canadian weddings. Guest count is the biggest lever: every extra 10 guests adds catering, drinks, stationery and favour costs.");}
  onIn(["wbBudget","wbGuests"],calc);calc();
})();
/* ---- Moving Cost ---- */
(function(){
  var BASE={"Studio":400,"1-bedroom":650,"2-bedroom":950,"3-bedroom":1400,"4-bedroom+":2000};
  mkPanel("movingcost","Moving Cost Estimator","A realistic range for your move, by home size, distance and service level.",cols2(
    curSeg("mvCurSeg")+F("Home size",SEL("mvSize",'<option>Studio</option><option selected>1-bedroom</option><option>2-bedroom</option><option>3-bedroom</option><option>4-bedroom+</option>'))+F("Distance (miles)",IN("mvDist",450,'min="0" step="10"'))+F("Service level",SEL("mvSvc",'<option value="diy">DIY truck rental</option><option value="movers" selected>Professional movers</option><option value="full">Full service (pack + move + unpack)</option>')),
    RB("Estimated cost","mvBig")));
  var cur="USD";segWire("mvCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){var base=BASE[$("mvSize").value]||650,dist=num("mvDist"),svc=$("mvSvc").value;
    var rate=svc==="diy"?0.85:svc==="movers"?2.1:2.9,mult=svc==="diy"?0.55:svc==="movers"?1:1.45;
    var mid=(base+dist*rate)*mult;
    $("mvBig").textContent=fmtMoney0(mid,cur);
    KV("mvBig",[["Low estimate",fmtMoney0(mid*0.8,cur)],["High estimate",fmtMoney0(mid*1.25,cur)],["Distance",fmtNum(dist)+" miles",1]]);
    NOTE("mvBig","Estimates exclude tips, insurance upgrades, storage and supplies. Summer weekends and month-ends cost most — mid-week, mid-month moves are cheapest. Get 3 written quotes.");}
  onIn(["mvSize","mvDist","mvSvc"],calc);calc();
})();
/* ---- Sleep Cycle ---- */
(function(){
  function fmtT(mins){mins=((mins%1440)+1440)%1440;var h=Math.floor(mins/60),m=mins%60,ap=h>=12?"PM":"AM";h=h%12;if(h===0)h=12;return h+":"+("0"+m).slice(-2)+" "+ap;}
  function toMin(v){if(!v)return 420;var s=v.split(":");return parseInt(s[0])*60+parseInt(s[1]);}
  mkPanel("sleepcycle","Sleep Cycle Calculator","Wake up between 90-minute cycles — not in the middle of one.",cols2(
    F("I need to WAKE UP at",'<input type="time" id="scWake" value="07:00" />')+F("I am GOING TO BED at",'<input type="time" id="scBed" value="23:00" />')+'<p class="note">Includes about 14 minutes to fall asleep — the average for most adults.</p>',
    RB("For a 7:00 AM wake-up, go to bed at","scBig")));
  function calc(){var wake=toMin($("scWake").value),bed=toMin($("scBed").value);
    $("scBig").textContent=fmtT(wake-(6*90+14));
    var rows=[["6 cycles (9 hrs sleep) — ideal",fmtT(wake-(6*90+14))],["5 cycles (7.5 hrs)",fmtT(wake-(5*90+14))],["4 cycles (6 hrs) — minimum",fmtT(wake-(4*90+14))],["— If you go to bed at "+fmtT(bed)+", wake at —",""],["After 5 cycles",fmtT(bed+14+5*90)],["After 6 cycles",fmtT(bed+14+6*90),1]];
    KV("scBig",rows);NOTE("scBig","Consistency beats perfection: a regular wake time matters more than hitting an exact cycle every night.");}
  onIn(["scWake","scBed"],calc);calc();
})();
/* ---- Macro Calculator ---- */
(function(){
  var DIETS={"Balanced (30P / 40C / 30F)":[30,40,30],"High protein (40P / 30C / 30F)":[40,30,30],"Low carb (35P / 25C / 40F)":[35,25,40],"Keto (25P / 5C / 70F)":[25,5,70]};
  mkPanel("macrocalc","Macro Calculator","Protein, carbs and fat in grams for your daily calorie target.",cols2(
    F("Daily calories (use the Calorie Calculator first if unsure)",IN("mcCal",2200,'min="800" step="50"'))+F("Diet style",SEL("mcDiet",'<option>Balanced (30P / 40C / 30F)</option><option>High protein (40P / 30C / 30F)</option><option>Low carb (35P / 25C / 40F)</option><option>Keto (25P / 5C / 70F)</option>'))+F("Body weight (lb) — for the protein check",IN("mcWeight",180,'min="0"')),
    RB("Protein per day","mcBig")));
  function calc(){var cal=num("mcCal"),d=DIETS[$("mcDiet").value]||[30,40,30];
    var pro=cal*d[0]/100/4,carb=cal*d[1]/100/4,fat=cal*d[2]/100/9;
    $("mcBig").textContent=Math.round(pro)+" g";
    KV("mcBig",[["Protein ("+d[0]+"%)",Math.round(pro)+" g"],["Carbs ("+d[1]+"%)",Math.round(carb)+" g"],["Fats ("+d[2]+"%)",Math.round(fat)+" g"],["Protein per lb of body weight",num("mcWeight")>0?(pro/num("mcWeight")).toFixed(2)+" g/lb":"—",1]]);
    NOTE("mcBig","Protein and carbs provide 4 kcal per gram, fat 9 kcal. Muscle-building guidance is usually 0.7–1 g of protein per lb of body weight.");}
  onIn(["mcCal","mcDiet","mcWeight"],calc);calc();
})();
/* ---- Ovulation ---- */
(function(){
  mkPanel("ovulation","Ovulation Calculator","Ovulation day, your fertile window and your next period.",
    cols2(F("First day of last period",IDT("ovLmp",addDaysISO(todayISO(),-14)))+F("Average cycle length (days)",IN("ovCycle",28,'min="21" max="40"')),
    RB("Estimated ovulation day","ovBig"))+'<p class="note">Estimates only — cycles vary month to month and this tool is not a contraception method. Confirm with ovulation tests or your clinician if timing matters.</p>');
  function fmtD(iso){return new Date(iso+"T00:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});}
  function calc(){var lmp=$("ovLmp").value;if(!lmp){$("ovBig").textContent="—";return;}
    var cyc=num("ovCycle")||28,ov=addDaysISO(lmp,cyc-14);
    $("ovBig").textContent=fmtD(ov);
    KV("ovBig",[["Fertile window starts",fmtD(addDaysISO(ov,-5))],["Fertile window ends",fmtD(addDaysISO(ov,1))],["Next period expected",fmtD(addDaysISO(lmp,cyc))],["Best days to try",fmtD(addDaysISO(ov,-2))+" to "+fmtD(ov),1]]);}
  onIn(["ovLmp","ovCycle"],calc);calc();
})();
/* ---- Engagement Rate ---- */
(function(){
  mkPanel("engagementrate","Social Media Engagement Rate Calculator","The metric brands actually check before paying a creator.",cols2(
    F("Followers / subscribers",IN("erFollowers",12500,'min="1"'))+'<div class="row3">'+F("Total likes",IN("erLikes",850,'min="0"'))+F("Total comments",IN("erComments",64,'min="0"'))+F("Total shares / saves",IN("erShares",38,'min="0"'))+'</div>'+F("Across how many posts?",IN("erPosts",1,'min="1"')),
    RB("Engagement rate","erBig")));
  function calc(){var posts=Math.max(num("erPosts"),1),perPost=(num("erLikes")+num("erComments")+num("erShares"))/posts,rate=num("erFollowers")>0?perPost/num("erFollowers")*100:0;
    $("erBig").textContent=rate.toFixed(2)+"%";
    var label=rate<1?"Low — below 1%":rate<3?"Average — typical for most accounts":rate<6?"Good — brands take notice":"Excellent — top-tier engagement";
    KV("erBig",[["Engagements per post",fmtNum(Math.round(perPost))],["Rating",label,1]]);
    NOTE("erBig","Benchmarks vary by platform: ~1–3% is typical on Instagram, TikTok often runs higher, X lower. Comments and shares count more than likes in most brand deals.");}
  onIn(["erFollowers","erLikes","erComments","erShares","erPosts"],calc);calc();
})();
/* ---- YouTube Earnings Estimator ---- */
(function(){
  var NICHES={"General / entertainment":[2,5],"Tech & gadgets":[5,12],"Finance & business":[12,30],"Gaming":[1,4],"Education":[4,10],"Vlogging & lifestyle":[2,6],"Health & fitness":[3,8]};
  var opts=Object.keys(NICHES).map(function(k){return '<option>'+k+'</option>';}).join("");
  mkPanel("ytearnings","YouTube Earnings Estimator","A realistic range — not a promise — from views and niche RPM.",cols2(
    F("Monthly views",IN("ytViews",500000,'min="0" step="1000"'))+F("Channel niche",SEL("ytNiche",opts)),
    RB("Estimated monthly earnings","ytBig")));
  function calc(){var v=num("ytViews"),r=NICHES[$("ytNiche").value]||[2,5],lo=v/1000*r[0],hi=v/1000*r[1];
    $("ytBig").textContent="$"+fmtNum(Math.round(lo))+" – $"+fmtNum(Math.round(hi))+" USD";
    KV("ytBig",[["Per year (same pace)","$"+fmtNum(Math.round(lo*12))+" – $"+fmtNum(Math.round(hi*12))+" USD"],["Approx. in GBP (×0.79)","£"+fmtNum(Math.round(lo*0.79))+" – £"+fmtNum(Math.round(hi*0.79))],["Approx. in CAD (×1.36)","$"+fmtNum(Math.round(lo*1.36))+" – $"+fmtNum(Math.round(hi*1.36))+" CAD",1]]);
    NOTE("ytBig","RPM is what you keep per 1,000 views after YouTube's share. Real RPM swings with viewer country (US/UK viewers pay most), video length and season — December is highest, January lowest. Estimate only.");}
  onIn(["ytViews","ytNiche"],calc);calc();
})();
/* ---- Hashtag Generator ---- */
(function(){
  var BANKS={
    fitness:["fitness","workout","gymlife","fitfam","training","healthylifestyle","gymmotivation","personaltrainer","fitnessjourney","strongnotskinny","exercise","fitlife","muscle","cardio","homeworkout","fitnessgoals"],
    food:["foodie","instafood","foodphotography","yummy","foodblogger","homecooking","recipeoftheday","foodlover","eatlocal","comfortfood","bakinglove","foodstagram","tasty","mealprep","brunchgoals","cookingathome"],
    travel:["travelgram","wanderlust","travelphotography","instatravel","vacationmode","exploremore","travelblogger","beautifuldestinations","passportready","roadtrip","citybreak","traveldiaries","adventureawaits","holidayvibes","bucketlist","traveltheworld"],
    business:["smallbusiness","entrepreneur","businessowner","marketingtips","socialmediamarketing","businesstips","startup","womeninbusiness","shoplocal","supportsmallbusiness","digitalmarketing","branding","contentcreator","sidehustle","growyourbusiness","businesstok"],
    general:["instagood","photooftheday","love","instadaily","picoftheday","follow","likeforlikes","viral","trending","explorepage","reels","fyp","foryou","daily","community","share"]};
  mkPanel("hashtaggen","Hashtag Generator","Copy-ready hashtag sets for Instagram and TikTok.",cols2(
    F("Your topic (words)",IT("hgTopic","home workout","e.g. home workout"))+F("Category",SEL("hgCat",'<option value="fitness">Fitness</option><option value="food">Food</option><option value="travel">Travel</option><option value="business">Business</option><option value="general">General</option>')),
    F("Your hashtags",TA("hgOut",8,""))+'<div class="btn-row"><button type="button" class="btn secondary small" id="hgCopy">Copy hashtags</button></div><p class="note">Mix big tags with niche ones, and use 3–5 highly relevant tags on Instagram or 3–6 on TikTok rather than stuffing all 30.</p>'));
  function gen(){var words=($("hgTopic").value||"").toLowerCase().replace(/[^a-z0-9 ]/g,"").split(/\s+/).filter(Boolean);
    var tags=[];if(words.length)tags.push("#"+words.join(""));words.forEach(function(w){if(w.length>2)tags.push("#"+w);});
    (BANKS[$("hgCat").value]||BANKS.general).forEach(function(b){tags.push("#"+b);});
    var seen={},out=[];tags.forEach(function(x){if(!seen[x]){seen[x]=1;out.push(x);}});
    $("hgOut").value=out.slice(0,30).join(" ");}
  onIn(["hgTopic","hgCat"],gen);gen();
  $("hgCopy").addEventListener("click",function(){if($("hgOut").value)copyText($("hgOut").value,"Hashtags copied");});
})();
/* ---- Reading & Speaking Time ---- */
(function(){
  mkPanel("readingtime","Reading & Speaking Time Calculator","How long your words take — silently, aloud, and on stage.",
    F("Your text",TA("rdTxt",8,"Paste a speech, script, article or lesson here"))+'<div style="margin-top:14px">'+RB("Speaking time (130 wpm)","rdBig")+'</div>');
  $("rdTxt").value="Thank you for being here today. This short sample is about one hundred words long, which takes most speakers just under a minute to deliver at a comfortable pace. Paste your own speech, video script, podcast intro or lesson plan here and the calculator will estimate how long it takes to read silently at two hundred words per minute, how long it takes to read aloud, and how long it takes to present with natural pauses, emphasis and breathing room included for a live audience or a recording session today.";
  function fmtM(mins){if(mins<1)return Math.round(mins*60)+" sec";var m=Math.floor(mins),s=Math.round((mins-m)*60);return m+" min "+("0"+s).slice(-2)+" sec";}
  function calc(){var txt=$("rdTxt").value.trim(),words=txt?txt.split(/\s+/).filter(Boolean).length:0;
    $("rdBig").textContent=words?fmtM(words/130):"—";
    KV("rdBig",[["Words",fmtNum(words)],["Silent reading (200 wpm)",words?fmtM(words/200):"—"],["Reading aloud (130 wpm)",words?fmtM(words/130):"—"],["Presenting with pauses (110 wpm)",words?fmtM(words/110):"—"],["Pages (250 words / page)",words?(words/250).toFixed(1):"—",1]]);
    NOTE("rdBig","A 10-minute talk is roughly 1,300 words. A 3-minute wedding speech is about 390 words — shorter than most people expect.");}
  onIn(["rdTxt"],calc);calc();
})();
/* ---- EV Charging ---- */
(function(){
  mkPanel("evcharging","EV Charging Cost Calculator","What home charging really costs — per charge, per mile, per month.",cols2(
    curSeg("evCurSeg")+'<div class="row2">'+F("Battery size (kWh)",IN("evBatt",60,'min="0" step="1"'))+F("Electricity price (per kWh)",IN("evRate",0.16,'min="0" step="0.01"'))+'</div><div class="row2">'+F("Charge from (%)",IN("evFrom",20,'min="0" max="100"'))+F("Charge to (%)",IN("evTo",80,'min="0" max="100"'))+'</div><div class="row2">'+F("Miles driven per month",IN("evMiles",900,'min="0" step="50"'))+F("Efficiency (miles per kWh)",IN("evEff",3.5,'min="0" step="0.1"'))+'</div>',
    RB("Cost of one charge (20% → 80%)","evBig")));
  var cur="USD";segWire("evCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){var kwh=num("evBatt")*Math.max(num("evTo")-num("evFrom"),0)/100,cost=kwh*num("evRate"),mkwh=num("evEff")>0?num("evMiles")/num("evEff"):0;
    $("evBig").textContent=fmtMoney(cost,cur);
    KV("evBig",[["Energy added",kwh.toFixed(1)+" kWh"],["Cost per mile",num("evEff")>0?fmtMoney(num("evRate")/num("evEff"),cur):"—"],["Monthly charging cost",fmtMoney(mkwh*num("evRate"),cur)],["Yearly charging cost",fmtMoney0(mkwh*num("evRate")*12,cur),1]]);
    NOTE("evBig","Home off-peak rates (UK Octopus, US utility EV plans, Canadian overnight rates) can halve these numbers. Public rapid charging costs 2–4× home rates.");}
  onIn(["evBatt","evRate","evFrom","evTo","evMiles","evEff"],calc);calc();
})();


/* ---- Keyword Density ---- */
(function(){
  mkPanel("kwdensity","Keyword Density Checker","How often a keyword or phrase really appears in your text.",cols2(
    F("Your text",TA("kdTxt",8,"Paste your article or page copy here"))+F("Keyword or phrase",IT("kdKey","online tools","")),
    RB("Keyword density","kdBig")));
  function calc(){var txt=($("kdTxt").value||"").toLowerCase(),key=($("kdKey").value||"").trim().toLowerCase();
    var words=txt.trim()?txt.trim().split(/\s+/).filter(Boolean):[],total=words.length;
    if(!key||!total){$("kdBig").textContent="—";KV("kdBig",[]);return;}
    var count=0,pos=0;while(true){var i=txt.indexOf(key,pos);if(i<0)break;count++;pos=i+key.length;}
    var keyWords=key.split(/\s+/).length,density=total>0?count*keyWords/total*100:0;
    $("kdBig").textContent=density.toFixed(2)+"%";
    KV("kdBig",[["Occurrences",count],["Total words",fmtNum(total)],["Verdict",density===0?"Not found — add it naturally":density<0.5?"Low — fine for a minor keyword":density<=2.5?"Healthy range for a main keyword":"High — check it does not read as stuffing",1]]);
    NOTE("kdBig","There is no magic density. Write for readers first: use the keyword in the title, intro, one heading and naturally in the body.");}
  onIn(["kdTxt","kdKey"],calc);
})();
/* ---- Meta Tag Generator ---- */
(function(){
  mkPanel("metagen","Meta Tag Generator","Production-ready meta, Open Graph and Twitter Card tags in one click.",cols2(
    F("Page title",IT("mgTitle","Best Coffee Shops in New York | Guide",""))+F("Meta description",TA("mgDesc",3,""))+F("Keywords (comma separated, optional)",IT("mgKeys","",""))+F("Page URL",IT("mgUrl","https://example.com/page",""))+F("Social image URL",IT("mgImg","https://example.com/image.jpg","")),
    F("Your HTML — paste into <head>",'<div class="output-pre" id="mgOut"></div>')+'<div class="btn-row"><button type="button" class="btn secondary small" id="mgCopy">Copy code</button></div>'));
  $("mgDesc").value="Discover the best coffee shops in New York City, from Brooklyn roasters to Manhattan classics, with prices, neighbourhoods and what to order.";
  function escA(s){return String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;");}
  function calc(){var ti=escA($("mgTitle").value),de=escA($("mgDesc").value),ke=escA($("mgKeys").value),ur=escA($("mgUrl").value),im=escA($("mgImg").value);
    var out='<title>'+ti+'</title>\n<meta name="description" content="'+de+'">';
    if(ke)out+='\n<meta name="keywords" content="'+ke+'">';
    out+='\n<link rel="canonical" href="'+ur+'">\n<meta property="og:type" content="website">\n<meta property="og:title" content="'+ti+'">\n<meta property="og:description" content="'+de+'">\n<meta property="og:url" content="'+ur+'">\n<meta property="og:image" content="'+im+'">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="'+ti+'">\n<meta name="twitter:description" content="'+de+'">\n<meta name="twitter:image" content="'+im+'">';
    $("mgOut").textContent=out;}
  onIn(["mgTitle","mgDesc","mgKeys","mgUrl","mgImg"],calc);calc();
  $("mgCopy").addEventListener("click",function(){copyText($("mgOut").textContent,"Meta tags copied");});
})();
/* ---- SERP Preview ---- */
(function(){
  mkPanel("serppreview","Google SERP Preview Tool","Your search result, as Google visitors will see it.",cols2(
    F("Title tag",IT("spTitle","Best Coffee Shops in New York — 2026 Guide",""))+F("URL",IT("spUrl","https://example.com/best-coffee-shops-new-york",""))+F("Meta description",TA("spDesc",3,"")),
    '<div class="result-box"><h3>Google preview (desktop)</h3><div style="background:#fff;border-radius:8px;padding:14px;color:#202124;font-family:Arial,sans-serif"><div id="spPrevUrl" style="font-size:.82rem;color:#202124"></div><div id="spPrevTitle" style="font-size:1.22rem;color:#1a0dab;line-height:1.3;margin:2px 0"></div><div id="spPrevDesc" style="font-size:.88rem;color:#4d5156;line-height:1.45"></div></div><div style="margin-top:12px" id="spKv"></div><p class="note" id="spNote"></p></div>'));
  $("spDesc").value="Discover the best coffee shops in New York City, from Brooklyn roasters to Manhattan classics, with prices, neighbourhoods and what to order at each one.";
  function calc(){var ti=$("spTitle").value,de=$("spDesc").value,ur=$("spUrl").value;
    $("spPrevTitle").textContent=ti||"Your title here";$("spPrevDesc").textContent=de||"Your description here…";
    var disp=ur;try{var u=new URL(ur);disp=u.hostname+" › "+u.pathname.split("/").filter(Boolean).join(" › ");}catch(e){}
    $("spPrevUrl").textContent=disp;
    $("spKv").innerHTML=[["Title length",ti.length+" chars (aim 50–60)"],["Description length",de.length+" chars (aim 150–160)"]].map(function(r){return '<div class="kv"><span>'+r[0]+'</span><b>'+r[1]+'</b></div>';}).join("");
    $("spNote").textContent=(ti.length>60?"Title may be truncated in results. ":"")+(de.length>160?"Description may be truncated. ":"")+(ti.length<30?"Title is short — add descriptive words. ":"")+"Google rewrites titles and descriptions when it thinks it can do better — clear, accurate text is rewritten least.";}
  onIn(["spTitle","spUrl","spDesc"],calc);calc();
})();
/* ---- Robots.txt ---- */
(function(){
  mkPanel("robotsgen","Robots.txt Generator","Tell search engine crawlers exactly where they may go.",cols2(
    F("All bots ( * )",SEL("rbAll",'<option value="allow" selected>Allow everything</option><option value="disallow">Disallow everything</option>'))+F("Googlebot",SEL("rbGoogle",'<option value="same" selected>Same as all bots</option><option value="allow">Allow everything</option><option value="disallow">Disallow everything</option>'))+F("Disallowed paths (one per line, for all bots)",TA("rbPaths",4,""))+F("Sitemap URL",IT("rbSitemap","https://example.com/sitemap.xml","")),
    F("Your robots.txt",'<div class="output-pre" id="rbOut"></div>')+'<div class="btn-row"><button type="button" class="btn secondary small" id="rbCopy">Copy robots.txt</button></div><p class="note">Upload this file to your domain root as robots.txt. Blocking a page here stops crawling, not indexing of already-known URLs.</p>'));
  $("rbPaths").value="/account/\n/checkout/\n/search/";
  function block(agent,mode,paths){var out="User-agent: "+agent+"\n";if(mode==="disallow"&&!paths.length)out+="Disallow: /\n";else{if(mode==="disallow")out+="Disallow: /\n";paths.forEach(function(x){if(x.trim())out+="Disallow: "+x.trim()+"\n";});if(mode==="allow"&&!paths.length)out+="Disallow:\n";}return out;}
  function calc(){var paths=$("rbPaths").value.split(/\r?\n/),all=$("rbAll").value,goo=$("rbGoogle").value==="same"?all:$("rbGoogle").value;
    var out=block("*",all,paths)+"\n"+block("Googlebot",goo,all==="disallow"||goo==="disallow"?[]:paths);
    var sm=$("rbSitemap").value.trim();if(sm)out+="\nSitemap: "+sm+"\n";
    $("rbOut").textContent=out;}
  onIn(["rbAll","rbGoogle","rbPaths","rbSitemap"],calc);calc();
  $("rbCopy").addEventListener("click",function(){copyText($("rbOut").textContent,"robots.txt copied");});
})();
/* ---- Sitemap ---- */
(function(){
  mkPanel("sitemapgen","XML Sitemap Generator","Paste URLs, get a valid sitemap.xml — ready to upload and submit.",cols2(
    F("URLs (one per line, full https:// addresses)",TA("smUrls",8,""))+'<div class="row2">'+F("Change frequency",SEL("smFreq",'<option>daily</option><option selected>weekly</option><option>monthly</option><option>yearly</option>'))+F("Priority",SEL("smPri",'<option>1.0</option><option selected>0.8</option><option>0.5</option>'))+'</div>',
    F("Your sitemap.xml",'<div class="output-pre" id="smOut"></div>')+'<div class="btn-row"><button type="button" class="btn secondary small" id="smCopy">Copy sitemap</button></div><p class="note" id="smNote"></p>'));
  $("smUrls").value="https://example.com/\nhttps://example.com/about\nhttps://example.com/contact";
  function escX(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
  function calc(){var urls=$("smUrls").value.split(/\r?\n/).map(function(x){return x.trim();}).filter(Boolean);
    var today=todayISO(),out='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    urls.forEach(function(u){out+="  <url>\n    <loc>"+escX(u)+"</loc>\n    <lastmod>"+today+"</lastmod>\n    <changefreq>"+$("smFreq").value+"</changefreq>\n    <priority>"+$("smPri").value+"</priority>\n  </url>\n";});
    out+="</urlset>";$("smOut").textContent=out;
    var bad=urls.filter(function(u){return u.indexOf("http")!==0;}).length;
    $("smNote").textContent=urls.length+" URLs included."+(bad?" Warning: "+bad+" line(s) do not start with http — fix them before submitting.":"")+" Max 50,000 URLs or 50 MB per sitemap file.";}
  onIn(["smUrls","smFreq","smPri"],calc);calc();
  $("smCopy").addEventListener("click",function(){copyText($("smOut").textContent,"Sitemap copied");});
})();
/* ---- Schema ---- */
(function(){
  mkPanel("schemagen","Schema Markup Generator","Valid JSON-LD structured data Google can read.",cols2(
    F("Schema type",SEL("schType",'<option>LocalBusiness</option><option>FAQ</option><option>Article</option><option>Product</option><option>WebSite</option>'))+F("Name / headline / question",IT("schName","Joe's Coffee House",""))+F("URL",IT("schUrl","https://example.com",""))+F("Description / answer / brand",TA("schDesc",3,""))+F("Extra — phone (business), date (article) or price (product)",IT("schExtra","","")),
    F("Your JSON-LD — paste before </body>",'<div class="output-pre" id="schOut"></div>')+'<div class="btn-row"><button type="button" class="btn secondary small" id="schCopy">Copy schema</button></div>'));
  $("schDesc").value="Independent coffee shop in Brooklyn serving single-origin espresso and fresh pastries.";
  function calc(){var ty=$("schType").value,n=$("schName").value,u=$("schUrl").value,d=$("schDesc").value,x=$("schExtra").value,obj;
    if(ty==="LocalBusiness")obj={"@context":"https://schema.org","@type":"LocalBusiness",name:n,url:u,description:d,telephone:x||"+1-555-010-2030"};
    else if(ty==="FAQ")obj={"@context":"https://schema.org","@type":"FAQPage",mainEntity:[{"@type":"Question",name:n,acceptedAnswer:{"@type":"Answer",text:d}}]};
    else if(ty==="Article")obj={"@context":"https://schema.org","@type":"Article",headline:n,url:u,description:d,datePublished:x||todayISO(),author:{"@type":"Organization",name:"Your Site Name"}};
    else if(ty==="Product")obj={"@context":"https://schema.org","@type":"Product",name:n,url:u,description:d,brand:{"@type":"Brand",name:"Your Brand"},offers:{"@type":"Offer",priceCurrency:"USD",price:x||"49.99",availability:"https://schema.org/InStock"}};
    else obj={"@context":"https://schema.org","@type":"WebSite",name:n,url:u,description:d,potentialAction:{"@type":"SearchAction",target:u.replace(/\/$/,"")+"/search?q={query}","query-input":"required name=query"}};
    $("schOut").textContent='<script type="application/ld+json">\n'+JSON.stringify(obj,null,2)+"\n<\/script>";}
  onIn(["schType","schName","schUrl","schDesc","schExtra"],calc);calc();
  $("schCopy").addEventListener("click",function(){copyText($("schOut").textContent,"Schema copied");});
})();
/* ---- UTM Builder ---- */
(function(){
  mkPanel("utmbuilder","UTM Campaign Link Builder","Tag links properly so Google Analytics credits the right campaign.",cols2(
    F("Website URL",IT("utmUrl","https://example.com/spring-sale",""))+F("Campaign source (utm_source)",IT("utmSource","facebook","e.g. facebook, google, newsletter"))+F("Campaign medium (utm_medium)",IT("utmMedium","social","e.g. social, cpc, email"))+F("Campaign name (utm_campaign)",IT("utmCampaign","spring_sale",""))+'<div class="row2">'+F("Term (optional)",IT("utmTerm","",""))+F("Content (optional)",IT("utmContent","",""))+'</div>',
    '<div class="result-box"><h3>Your tagged link</h3><div class="pw-out" id="utmOut" style="font-size:.9rem">—</div><div class="btn-row" style="margin-top:12px"><button type="button" class="btn secondary small" id="utmCopy">Copy tagged URL</button></div><p class="note">Use lowercase and underscores, and keep naming consistent — “Facebook” and “facebook” count as two different sources in Analytics.</p></div>'));
  function calc(){var base=($("utmUrl").value||"").trim();if(!base){$("utmOut").textContent="—";return;}
    var params=[];function add(k,id){var v=$(id).value.trim();if(v)params.push(k+"="+encodeURIComponent(v));}
    add("utm_source","utmSource");add("utm_medium","utmMedium");add("utm_campaign","utmCampaign");add("utm_term","utmTerm");add("utm_content","utmContent");
    $("utmOut").textContent=base+(params.length?(base.indexOf("?")>=0?"&":"?")+params.join("&"):"");}
  onIn(["utmUrl","utmSource","utmMedium","utmCampaign","utmTerm","utmContent"],calc);calc();
  $("utmCopy").addEventListener("click",function(){var v=$("utmOut").textContent;if(v!=="—")copyText(v,"Tagged link copied");});
})();
/* ---- Readability ---- */
(function(){
  function syllables(w){w=w.toLowerCase().replace(/[^a-z]/g,"");if(!w)return 0;if(w.length<=3)return 1;w=w.replace(/(?:[^laeiouy]e|ed|es)$/,"").replace(/^y/,"");var m=w.match(/[aeiouy]{1,2}/g);return m?m.length:1;}
  mkPanel("readability","Readability Score Checker","Flesch Reading Ease and grade level — the scores editors trust.",
    F("Your text (100+ words works best)",TA("rlTxt",8,"Paste your article, page copy or essay here"))+'<div style="margin-top:14px">'+RB("Flesch Reading Ease","rlBig")+'</div>');
  $("rlTxt").value="Good writing is easy to read. Short sentences help. So do simple words. When a page is hard to read, people leave. They do not struggle through long, dense text on a phone screen. The best web pages sound like a clear conversation. They answer one question at a time, use headings to guide the reader, and cut every word that does no work. Test your draft here, then read it aloud. If you run out of breath, the sentence is too long. If a twelve-year-old would stumble, simplify it. Clear writing is not dumbed down. It is respect for the reader's time, and it is what makes people stay, share and come back again later.";
  function calc(){var txt=$("rlTxt").value.trim();if(!txt){$("rlBig").textContent="—";return;}
    var words=txt.split(/\s+/).filter(Boolean),sents=Math.max((txt.match(/[.!?]+/g)||[]).length,1),syll=words.reduce(function(s,w){return s+syllables(w);},0);
    if(!words.length){$("rlBig").textContent="—";return;}
    var ease=206.835-1.015*(words.length/sents)-84.6*(syll/words.length),grade=0.39*(words.length/sents)+11.8*(syll/words.length)-15.59;
    ease=Math.max(0,Math.min(100,Math.round(ease)));
    var label=ease>=90?"Very easy — age 11":ease>=70?"Easy — age 12–13":ease>=60?"Standard — age 13–15":ease>=50?"Fairly difficult — high school":ease>=30?"Difficult — college":"Very difficult — graduate level";
    $("rlBig").textContent=ease+" / 100";
    KV("rlBig",[["Reading level",label],["US grade level (Flesch–Kincaid)",Math.max(grade,0).toFixed(1)],["Words",fmtNum(words.length)],["Sentences",sents],["Avg. words per sentence",(words.length/sents).toFixed(1),1]]);
    NOTE("rlBig","Most successful web content scores 60–80. Government and health pages in the US and UK aim for grade 6–8 so everyone can use them.");}
  onIn(["rlTxt"],calc);calc();
})();
/* ---- Heading Analyzer ---- */
(function(){
  mkPanel("headinganalyzer","Heading Structure Analyzer","See your page outline the way Google does.",cols2(
    F("Paste HTML or Markdown",TA("haIn",9,"")),
    '<div class="result-box"><h3>Outline</h3><div class="output-pre" id="haOut">Paste content to see the outline…</div><div style="margin-top:12px" id="haKv"></div><p class="note" id="haNote"></p></div>'));
  $("haIn").value="<h1>Best Coffee Shops in New York</h1>\n<h2>Brooklyn</h2>\n<h3>Williamsburg</h3>\n<h2>Manhattan</h2>\n<h2>How we chose them</h2>";
  function calc(){var src=$("haIn").value,heads=[];
    var re=/<h([1-6])[^>]*>(.*?)<\/h\1>/gi,m;while((m=re.exec(src))!==null)heads.push({lvl:parseInt(m[1],10),txt:m[2].replace(/<[^>]+>/g,"").trim()});
    if(!heads.length){var lines=src.split(/\r?\n/);lines.forEach(function(l){var mm=l.match(/^(#{1,6})\s+(.*)/);if(mm)heads.push({lvl:mm[1].length,txt:mm[2].trim()});});}
    if(!heads.length){$("haOut").textContent="No headings found. Paste HTML with <h1>–<h6> tags, or Markdown with # headings.";$("haKv").innerHTML="";$("haNote").textContent="";return;}
    $("haOut").textContent=heads.map(function(h){return "  ".repeat(h.lvl-1)+"H"+h.lvl+"  "+h.txt;}).join("\n");
    var h1=heads.filter(function(h){return h.lvl===1;}).length,skips=0;
    for(var i=1;i<heads.length;i++)if(heads[i].lvl>heads[i-1].lvl+1)skips++;
    $("haKv").innerHTML=[["Total headings",heads.length],["H1 count",h1],["Skipped levels",skips]].map(function(r){return '<div class="kv"><span>'+r[0]+'</span><b>'+r[1]+'</b></div>';}).join("");
    $("haNote").textContent=(h1===0?"No H1 — every page needs exactly one. ":h1>1?"Multiple H1s — keep one main H1 per page. ":"")+(skips?"Some levels are skipped (e.g. H2 straight to H4) — keep the hierarchy nested. ":"")+(h1===1&&!skips?"Structure looks clean.":"");}
  onIn(["haIn"],calc);calc();
})();
/* ---- Text Similarity ---- */
(function(){
  mkPanel("textsimilarity","Text Similarity Checker","Spot duplicate or near-duplicate content before Google does.",cols2(
    F("Text A",TA("tsA",7,""))+F("Text B",TA("tsB",7,"")),
    RB("Similarity","tsBig")));
  $("tsA").value="Our coffee shop serves fresh espresso, homemade pastries and free wifi in the heart of Brooklyn, open every day from seven in the morning until eight in the evening.";
  $("tsB").value="Our coffee shop serves fresh espresso, homemade pastries and free wifi in the heart of Brooklyn. We are open daily from 7 AM to 8 PM.";
  function wordsOf(s){return (s||"").toLowerCase().replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(Boolean);}
  function calc(){var a=wordsOf($("tsA").value),b=wordsOf($("tsB").value);
    var setA={},setB={};a.forEach(function(w){setA[w]=1;});b.forEach(function(w){setB[w]=1;});
    var inter=0;Object.keys(setA).forEach(function(k){if(setB[k])inter++;});
    var union=Object.keys(setA).length+Object.keys(setB).length-inter;
    var jac=union?inter/union*100:0;
    function bigrams(arr){var s={};for(var i=0;i<arr.length-1;i++)s[arr[i]+" "+arr[i+1]]=1;return s;}
    var ba=bigrams(a),bb=bigrams(b),bi=0;Object.keys(ba).forEach(function(k){if(bb[k])bi++;});
    var bu=Object.keys(ba).length+Object.keys(bb).length-bi,big=bu?bi/bu*100:0;
    var overall=Math.round((jac+big)/2);
    $("tsBig").textContent=overall+"%";
    KV("tsBig",[["Word overlap (Jaccard)",jac.toFixed(1)+"%"],["Phrase overlap (bigrams)",big.toFixed(1)+"%"],["Shared unique words",inter],["Verdict",overall>=80?"Near-duplicate — rewrite one":overall>=50?"Substantially similar":overall>=25?"Some overlap — normal for one topic":"Largely unique",1]]);
    NOTE("tsBig","Combines unique-word overlap with two-word phrase overlap, so reordered copy still scores high.");}
  onIn(["tsA","tsB"],calc);calc();
})();
/* ---- SEO Title & Description Checker ---- */
(function(){
  function pxWidth(txt,px,font){try{var c=pxWidth.c||(pxWidth.c=document.createElement("canvas").getContext("2d"));c.font=font;return Math.round(c.measureText(txt).width);}catch(e){return Math.round(txt.length*(px/2.6));}}
  mkPanel("seochecker","SEO Title & Description Checker","Length in characters AND pixels — because Google measures pixels.",cols2(
    F("Title tag",IT("seTitle","Best Coffee Shops in New York — 2026 Guide",""))+F("Meta description",TA("seDesc",3,"")),
    RB("Title check","seBig")));
  $("seDesc").value="Discover the best coffee shops in New York City, from Brooklyn roasters to Manhattan classics, with prices, neighbourhoods and what to order at each one.";
  function verdict(chars,px,goodCh,goodPx){if(chars===0)return "Empty";if(px>goodPx)return "Too long — will be truncated";if(chars<goodCh)return "A bit short — room to add keywords";return "Good length ✓";}
  function calc(){var ti=$("seTitle").value,de=$("seDesc").value;
    var tPx=pxWidth(ti,20,'20px Arial'),dPx=pxWidth(de,13,'13px Arial');
    $("seBig").textContent=verdict(ti.length,tPx,30,580);
    KV("seBig",[["Title",ti.length+" chars · ~"+tPx+" px (limit ~580)"],["Title verdict",verdict(ti.length,tPx,30,580)],["Description",de.length+" chars · ~"+dPx+" px (limit ~920)"],["Description verdict",verdict(de.length,dPx,120,920),1]]);
    NOTE("seBig","Pixel widths are estimates measured in Arial, close to Google's rendering. Mobile results truncate sooner than desktop.");}
  onIn(["seTitle","seDesc"],calc);calc();
})();
/* ---- OG / Social Preview ---- */
(function(){
  function card(name,color){return '<div style="border:1px solid var(--line);border-radius:12px;overflow:hidden;margin-bottom:14px;background:var(--surface)"><div style="padding:8px 12px;font-weight:700;font-size:.85rem;color:'+color+'">'+name+'</div><img id="ogImg-'+name+'" alt="" style="width:100%;height:150px;object-fit:cover;display:none;background:var(--surface2)" /><div style="padding:10px 12px"><b id="ogTi-'+name+'" style="display:block;font-size:.95rem"></b><span id="ogDe-'+name+'" style="color:var(--muted);font-size:.85rem;display:block"></span><span id="ogUr-'+name+'" style="color:var(--muted);font-size:.78rem;text-transform:uppercase"></span></div></div>';}
  mkPanel("ogpreview","Social Share Preview Tool","How your link will look when people share it.",cols2(
    F("Page title",IT("ogTitle","Best Coffee Shops in New York",""))+F("Description",TA("ogDesc",3,""))+F("Page URL",IT("ogUrl","https://example.com/coffee",""))+F("Image URL (1200 × 630 works best)",IT("ogImg","","https://example.com/social-image.jpg")),
    '<div>'+card("Facebook","#1877f2")+card("X","var(--ink)")+card("LinkedIn","#0a66c2")+'</div>'));
  $("ogDesc").value="From Brooklyn roasters to Manhattan classics — the definitive guide, with prices and what to order.";
  function calc(){var ti=$("ogTitle").value,de=$("ogDesc").value,ur=$("ogUrl").value,im=$("ogImg").value,host=ur;
    try{host=new URL(ur).hostname;}catch(e){}
    ["Facebook","X","LinkedIn"].forEach(function(n){
      $("ogTi-"+n).textContent=ti||"Your title";$("ogDe-"+n).textContent=de||"Your description";$("ogUr-"+n).textContent=host;
      var img=$("ogImg-"+n);if(im){img.style.display="block";if(img.src!==im)img.src=im;img.onerror=function(){img.style.display="none";};}else img.style.display="none";});}
  onIn(["ogTitle","ogDesc","ogUrl","ogImg"],calc);calc();
})();


/* ---- Appliance Energy Cost ---- */
(function(){
  mkPanel("energycost","Appliance Energy Cost Calculator","The running cost of anything that plugs in — at your electricity price.",cols2(
    curSeg("ecCurSeg")+F("Appliance power (watts — check the label)",IN("ecW",1000,'min="0" step="10"'))+'<div class="row2">'+F("Hours used per day",IN("ecHrs",3,'min="0" max="24" step="0.25"'))+F("Electricity price (per kWh)",IN("ecRate",0.16,'min="0" step="0.01"'))+'</div><p class="note">Typical prices: US ≈ $0.16/kWh, UK ≈ £0.25/kWh (price cap), Canada ≈ CAD $0.13/kWh — check your bill for your exact rate.</p>',
    RB("Cost per day","ecBig")));
  var cur="USD";segWire("ecCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){var kwh=num("ecW")/1000*num("ecHrs"),day=kwh*num("ecRate");
    $("ecBig").textContent=fmtMoney(day,cur);
    KV("ecBig",[["Energy per day",kwh.toFixed(2)+" kWh"],["Cost per month (30 days)",fmtMoney(day*30,cur)],["Cost per year",fmtMoney0(day*365,cur)],["Energy per year",fmtNum(Math.round(kwh*365))+" kWh",1]]);
    NOTE("ecBig","A 2,000W heater run 5 hours a day costs roughly 5× a 400W fridge run all day. The label wattage is the maximum — devices with thermostats cycle on and off.");}
  onIn(["ecW","ecHrs","ecRate"],calc);calc();
})();
/* ---- Solar Savings ---- */
(function(){
  mkPanel("solarsavings","Solar Panel Savings Estimator","Yearly generation, bill savings and payback for rooftop solar.",cols2(
    curSeg("soCurSeg")+F("System size (kW)",IN("soSize",6,'min="0" step="0.5"'))+'<div class="row2">'+F("Peak sun hours per day (your area)",IN("soSun",4.5,'min="0" max="8" step="0.1"'))+F("Electricity price (per kWh)",IN("soRate",0.16,'min="0" step="0.01"'))+'</div>'+F("Installed cost (after incentives)",IN("soCost",15000,'min="0" step="250"'))+'<p class="note">Sun guide: Arizona/Texas ≈ 5.5–6.5, most of the US & southern Canada ≈ 4–5, UK ≈ 2.8–3.5 (annual average).</p>',
    RB("Estimated yearly saving","soBig")));
  var cur="USD";segWire("soCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){var gen=num("soSize")*num("soSun")*365*0.85,saving=gen*num("soRate"),payback=saving>0?num("soCost")/saving:0;
    $("soBig").textContent=fmtMoney0(saving,cur)+" / yr";
    KV("soBig",[["Generation per year",fmtNum(Math.round(gen))+" kWh"],["Payback period",payback?payback.toFixed(1)+" years":"—"],["Savings over 25 years",fmtMoney0(saving*25-num("soCost"),cur)+" (after paying for the system)",1]]);
    NOTE("soBig","Estimate only: assumes 85% system efficiency and that generated power offsets your bill at the full retail rate. Export rates, roof angle, shading and incentives (US federal credit, UK SEG, Canadian programs) change real results — get installer quotes.");}
  onIn(["soSize","soSun","soRate","soCost"],calc);calc();
})();
/* ---- EV vs Gas ---- */
(function(){
  mkPanel("evvsgas","EV vs Gas Car Cost Calculator","Fuel versus charging — the yearly running-cost gap, in plain numbers.",cols2(
    curSeg("egCurSeg")+F("Miles driven per year",IN("egMiles",12000,'min="0" step="500"'))+'<div class="row2">'+F("Gas car economy (mpg)",IN("egMpg",30,'min="0" step="1"'))+F("Fuel price (per gallon)",IN("egFuel",3.60,'min="0" step="0.05"'))+'</div><div class="row2">'+F("EV efficiency (miles per kWh)",IN("egEff",3.5,'min="0" step="0.1"'))+F("Home electricity (per kWh)",IN("egRate",0.16,'min="0" step="0.01"'))+'</div><p class="note">UK drivers: 1 imperial gallon = 1.2 US gallons and petrol is priced per litre — convert your mpg accordingly, or use litres: price per gallon ≈ price per litre × 4.55.</p>',
    RB("You save per year with the EV","egBig")));
  var cur="USD";segWire("egCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){var gas=num("egMpg")>0?num("egMiles")/num("egMpg")*num("egFuel"):0,ev=num("egEff")>0?num("egMiles")/num("egEff")*num("egRate"):0;
    $("egBig").textContent=fmtMoney0(gas-ev,cur);
    KV("egBig",[["Gas car fuel per year",fmtMoney0(gas,cur)],["EV charging per year (home)",fmtMoney0(ev,cur)],["Saving over 5 years",fmtMoney0((gas-ev)*5,cur),1]]);
    NOTE("egBig","Fuel and charging only. EVs also skip oil changes and have fewer moving parts, but can cost more to insure and buy. Public rapid charging costs far more than home charging.");}
  onIn(["egMiles","egMpg","egFuel","egEff","egRate"],calc);calc();
})();
/* ---- Refinance Break-Even ---- */
(function(){
  function pmt(P,annualPct,years){var r=annualPct/100/12,n=Math.round(years*12);if(P<=0||n<=0)return 0;return r>0?P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):P/n;}
  mkPanel("refinance","Mortgage Refinance Break-Even Calculator","When does a lower rate actually start saving you money?",cols2(
    curSeg("rfCurSeg")+F("Current loan balance",IN("rfBal",320000,'min="0" step="1000"'))+'<div class="row2">'+F("Current rate (%)",IN("rfOld",7.25,'min="0" step="0.05"'))+F("New rate (%)",IN("rfNew",6.0,'min="0" step="0.05"'))+'</div><div class="row2">'+F("Years left on the loan",IN("rfYears",27,'min="1" max="35"'))+F("Closing costs",IN("rfCosts",4500,'min="0" step="100"'))+'</div>',
    RB("Break-even point","rfBig")));
  var cur="USD";segWire("rfCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){var bal=num("rfBal"),yrs=num("rfYears"),oldP=pmt(bal,num("rfOld"),yrs),newP=pmt(bal,num("rfNew"),yrs),save=oldP-newP,costs=num("rfCosts");
    if(save<=0){$("rfBig").textContent="No saving";KV("rfBig",[["Current payment",fmtMoney(oldP,cur)],["New payment",fmtMoney(newP,cur)]]);NOTE("rfBig","The new rate does not lower the payment on the same term — a refinance only helps with a lower rate or different term.");return;}
    var months=Math.ceil(costs/save);
    $("rfBig").textContent=months+" months";
    KV("rfBig",[["Current payment",fmtMoney(oldP,cur)],["New payment",fmtMoney(newP,cur)],["Monthly saving",fmtMoney(save,cur)],["Interest saved over the remaining term",fmtMoney0((oldP-newP)*Math.round(yrs*12)-costs,cur)+" (after closing costs)",1]]);
    NOTE("rfBig","Break-even only matters if you will stay in the home longer than that. Restarting a fresh 30-year term lowers payments but can raise lifetime interest — this compares the same remaining term.");}
  onIn(["rfBal","rfOld","rfNew","rfYears","rfCosts"],calc);calc();
})();
/* ---- Rent vs Buy ---- */
(function(){
  mkPanel("rentvsbuy","Rent vs Buy Calculator","Renting is not 'throwing money away' — and buying is not always cheaper. Compare properly.",cols2(
    curSeg("rbvCurSeg")+F("Home price",IN("rbvPrice",450000,'min="0" step="5000"'))+'<div class="row2">'+F("Down payment (%)",IN("rbvDown",20,'min="0" max="100"'))+F("Mortgage rate (%)",IN("rbvRate",6.5,'min="0" step="0.1"'))+'</div><div class="row2">'+F("Monthly rent for a similar home",IN("rbvRent",1800,'min="0" step="50"'))+F("Years you will stay",IN("rbvStay",7,'min="1" max="30"'))+'</div><div class="row2">'+F("Home value growth (%/yr)",IN("rbvApp",3,'min="-5" step="0.25"'))+F("Rent increase (%/yr)",IN("rbvRentInc",3,'min="0" step="0.25"'))+'</div>',
    RB("Cheaper over your stay","rbvBig")));
  var cur="USD";segWire("rbvCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){var price=num("rbvPrice"),down=price*num("rbvDown")/100,loan=price-down,r=num("rbvRate")/100/12,yrs=num("rbvStay"),n=Math.round(yrs*12);
    var pay=r>0?loan*r*Math.pow(1+r,360)/(Math.pow(1+r,360)-1):loan/360;
    var bal=loan,interest=0;for(var i=0;i<n;i++){var ii=bal*r;interest+=ii;bal-=Math.min(pay-ii,bal);}
    var equity=(loan-bal),value=price*Math.pow(1+num("rbvApp")/100,yrs),appGain=value-price;
    var buyCost=interest+price*0.01*yrs+price*0.01*yrs-appGain-equity+down*0.04*yrs;
    var rentCost=0,rent=num("rbvRent");for(var y=0;y<yrs;y++){rentCost+=rent*12;rent*=1+num("rbvRentInc")/100;}
    var diff=buyCost-rentCost;
    $("rbvBig").textContent=(diff<0?"Buying by ":"Renting by ")+fmtMoney0(Math.abs(diff),cur);
    KV("rbvBig",[["Total renting cost ("+yrs+" yrs)",fmtMoney0(rentCost,cur)],["Net buying cost (interest + tax/insurance ~1% + maintenance ~1% − equity − growth, + opportunity cost on deposit)",fmtMoney0(buyCost,cur)],["Equity you would own",fmtMoney0(down+equity,cur),1]]);
    NOTE("rbvBig","Simplified comparison using standard assumptions shown in the breakdown. Buying costs exclude moving/closing fees; short stays under ~5 years usually favour renting because purchase costs are front-loaded.");}
  onIn(["rbvPrice","rbvDown","rbvRate","rbvRent","rbvStay","rbvApp","rbvRentInc"],calc);calc();
})();
/* ---- Take-Home Pay ---- */
(function(){
  mkPanel("takehome","Take-Home Pay Calculator","A simplified after-tax estimate with selectable tax systems.",cols2(
    F("Country",SEL("thCountry",'<option value="US" selected>United States</option><option value="UK">United Kingdom</option><option value="CA">Canada</option>'))+F("Gross salary per year",IN("thSalary",75000,'min="0" step="1000"'))+F("State / provincial tax (%) — US & Canada only",IN("thState",5,'min="0" max="20" step="0.25"'))+'<p class="note"><b>Estimate only — not tax advice.</b> Uses simplified single-filer brackets and standard payroll deductions. It ignores credits, pensions, benefits, local taxes and your exact filing status.</p>',
    RB("Estimated take-home per year","thBig")));
  function bracketTax(income,brackets){var tax=0,prev=0;for(var i=0;i<brackets.length;i++){var cap=brackets[i][0],rate=brackets[i][1];if(income>prev)tax+=(Math.min(income,cap)-prev)*rate;prev=cap;}return tax;}
  function calc(){var s=num("thSalary"),c=$("thCountry").value,cur=c==="UK"?"GBP":c==="CA"?"CAD":"USD",fed,other,rows=[];
    if(c==="US"){fed=bracketTax(s,[[11925,0.10],[48475,0.12],[103350,0.22],[197300,0.24],[Infinity,0.32]]);other=s*0.0765+s*num("thState")/100;rows=[["Federal income tax (simplified)",fmtMoney0(fed,cur)],["Social Security + Medicare (7.65%)",fmtMoney0(s*0.0765,cur)],["State tax (your rate)",fmtMoney0(s*num("thState")/100,cur)]];}
    else if(c==="UK"){var taxable=Math.max(s-12570,0);fed=bracketTax(taxable,[[37700,0.20],[87440,0.40],[Infinity,0.45]]);var ni=Math.max(Math.min(s,50270)-12570,0)*0.08+Math.max(s-50270,0)*0.02;other=ni;rows=[["Income tax (after £12,570 allowance)",fmtMoney0(fed,cur)],["National Insurance",fmtMoney0(ni,cur)]];}
    else{fed=bracketTax(s,[[57375,0.15],[114750,0.205],[Infinity,0.26]]);other=s*num("thState")/100+Math.min(s*0.07,5200);rows=[["Federal tax (simplified)",fmtMoney0(fed,cur)],["Provincial tax (your rate)",fmtMoney0(s*num("thState")/100,cur)],["CPP + EI (approx., capped)",fmtMoney0(Math.min(s*0.07,5200),cur)]];}
    var net=s-fed-other;
    $("thBig").textContent=fmtMoney0(net,cur);
    KV("thBig",rows.concat([["Take-home per month",fmtMoney0(net/12,cur)],["Take-home every 2 weeks",fmtMoney0(net/26,cur)],["Effective tax rate",s>0?((fed+other)/s*100).toFixed(1)+"%":"—",1]]));
    NOTE("thBig","Estimate only — not tax advice. For an exact figure use your payroll department, HMRC (UK), the IRS (US) or the CRA (Canada), or a qualified tax professional.");}
  onIn(["thCountry","thSalary","thState"],calc);calc();
})();
/* ---- Savings Runway ---- */
(function(){
  mkPanel("runway","Savings Runway Calculator","If your income stopped tomorrow, how long would your money last?",cols2(
    curSeg("rwCurSeg")+F("Total savings you could use",IN("rwSavings",18000,'min="0" step="250"'))+F("Essential monthly spending (lean budget)",IN("rwExp",3200,'min="0" step="50"'))+F("Any continuing income per month (benefits, side work, partner)",IN("rwIncome",0,'min="0" step="50"')),
    RB("Your runway","rwBig")));
  var cur="USD";segWire("rwCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){var burn=num("rwExp")-num("rwIncome");
    if(burn<=0){$("rwBig").textContent="Indefinite";KV("rwBig",[["Monthly burn","Covered by continuing income",1]]);NOTE("rwBig","Your continuing income covers your lean budget — savings stay untouched.");return;}
    var months=num("rwSavings")/burn;var d=new Date();d.setDate(d.getDate()+Math.round(months*30.44));
    $("rwBig").textContent=months.toFixed(1)+" months";
    KV("rwBig",[["Monthly burn",fmtMoney0(burn,cur)],["Money lasts until (approx.)",d.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})],["Runway at full current spending +25%",(num("rwSavings")/(burn*1.25)).toFixed(1)+" months",1]]);
    NOTE("rwBig","Financial planners suggest 3–6 months of runway for employees, 6–12 for freelancers and single-income households. Cutting the lean budget by 10% adds weeks instantly.");}
  onIn(["rwSavings","rwExp","rwIncome"],calc);calc();
})();
/* ---- Subscriptions ---- */
(function(){
  mkPanel("subscriptions","Subscription Cost Calculator","Every 'small' monthly fee, added up honestly.",
    F("Your subscriptions — one per line: name then price",TA("subTxt",8,""))+'<div style="margin-top:14px">'+RB("Total per month","subBig")+'</div>');
  $("subTxt").value="Netflix 15.49\nSpotify 11.99\nGym 39.00\niCloud storage 2.99\nStreaming service 2 13.99\nNews app 9.99\nFitness app 12.99";
  function calc(){var lines=$("subTxt").value.split(/\r?\n/).filter(function(l){return l.trim();}),total=0,items=[];
    lines.forEach(function(l){var m=l.match(/(\d+(?:\.\d{1,2})?)\s*$/);if(m){var v=parseFloat(m[1]);total+=v;items.push({name:l.replace(m[0],"").trim()||"Subscription",v:v});}});
    items.sort(function(a,b){return b.v-a.v;});
    $("subBig").textContent="$"+total.toFixed(2);
    var rows=[["Subscriptions counted",items.length],["Total per year","$"+fmtNum(Math.round(total*12))],["Total over 5 years","$"+fmtNum(Math.round(total*12*5))]];
    if(items.length)rows.push(["Most expensive",items[0].name+" — $"+items[0].v.toFixed(2)+"/mo",1]);
    KV("subBig",rows);
    NOTE("subBig","The average household underestimates subscriptions by a wide margin — audit yours against a bank statement; anything unused for 60 days is a candidate to cancel. Currency assumed from your prices as entered.");}
  onIn(["subTxt"],calc);calc();
})();
/* ---- Unit Price ---- */
(function(){
  mkPanel("unitprice","Unit Price Calculator","Which pack is really cheaper? Compare price per unit, not pack price.",cols2(
    curSeg("upCurSeg")+'<div class="field"><label>Product A</label></div><div class="row2">'+F("Price",IN("upP1",4.50,'min="0" step="0.01"'))+F("Size / quantity",IN("upS1",16,'min="0" step="0.1"'))+'</div><div class="field"><label>Product B</label></div><div class="row2">'+F("Price",IN("upP2",7.99,'min="0" step="0.01"'))+F("Size / quantity",IN("upS2",32,'min="0" step="0.1"'))+'</div>'+F("Unit (same for both)",SEL("upUnit",'<option>oz</option><option>lb</option><option>g</option><option>kg</option><option>ml</option><option>litres</option><option>items</option><option>sheets / loads</option>')),
    RB("Better deal","upBig")));
  var cur="USD";segWire("upCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){var u1=num("upS1")>0?num("upP1")/num("upS1"):0,u2=num("upS2")>0?num("upP2")/num("upS2"):0,unit=$("upUnit").value;
    if(!u1||!u2){$("upBig").textContent="—";return;}
    var aWins=u1<=u2,best=Math.min(u1,u2),worst=Math.max(u1,u2);
    $("upBig").textContent=(aWins?"Product A":"Product B")+" — "+fmtMoney(best,cur)+" / "+unit;
    KV("upBig",[["Product A unit price",fmtMoney(u1,cur)+" / "+unit],["Product B unit price",fmtMoney(u2,cur)+" / "+unit],["You save per "+unit,fmtMoney(worst-best,cur)+" ("+((worst-best)/worst*100).toFixed(1)+"%)",1]]);
    NOTE("upBig","Bigger is not always cheaper — promotions often make the small pack the best unit price. US shelf labels usually show unit prices; in the UK look for the per-100g / per-litre line.");}
  onIn(["upP1","upS1","upP2","upS2","upUnit"],calc);calc();
})();
/* ---- Commute Cost ---- */
(function(){
  mkPanel("commutecost","Commute Cost & WFH Savings Calculator","The commute is a pay cut you never see. Price it.",cols2(
    curSeg("cmCurSeg")+'<div class="row2">'+F("Round-trip distance (miles)",IN("cmMiles",22,'min="0" step="1"'))+F("Commute days per week",IN("cmDays",5,'min="0" max="7"'))+'</div><div class="row2">'+F("Car economy (mpg)",IN("cmMpg",30,'min="0"'))+F("Fuel price (per gallon)",IN("cmFuel",3.60,'min="0" step="0.05"'))+'</div><div class="row2">'+F("Parking / transit per day",IN("cmPark",12,'min="0" step="0.5"'))+F("Work-from-home days per week",IN("cmWfh",2,'min="0" max="7"'))+'</div>',
    RB("Commute cost per month","cmBig")));
  var cur="USD";segWire("cmCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){var perDay=(num("cmMpg")>0?num("cmMiles")/num("cmMpg")*num("cmFuel"):0)+num("cmPark"),weeks=4.33;
    var monthly=perDay*num("cmDays")*weeks,wfhSave=perDay*Math.min(num("cmWfh"),num("cmDays"))*weeks;
    $("cmBig").textContent=fmtMoney0(monthly,cur);
    KV("cmBig",[["Cost per commute day",fmtMoney(perDay,cur)],["Cost per year",fmtMoney0(monthly*12,cur)],["Saved by your WFH days (per month)",fmtMoney0(wfhSave,cur)],["Saved per year",fmtMoney0(wfhSave*12,cur),1]]);
    NOTE("cmBig","Fuel and fares only — wear, depreciation (~$0.20+/mile all-in by AAA-style estimates), tolls and your time are extra. Even so, two WFH days a week is often worth thousands a year.");}
  onIn(["cmMiles","cmDays","cmMpg","cmFuel","cmPark","cmWfh"],calc);calc();
})();
/* ---- Pay Raise ---- */
(function(){
  mkPanel("payraise","Pay Raise Calculator","What a percentage raise is actually worth — per month, per hour, per payslip.",cols2(
    curSeg("prCurSeg")+F("Current salary per year",IN("prSalary",62000,'min="0" step="500"'))+F("Raise (%)",IN("prPct",4,'min="0" step="0.25"'))+F("Or type the new salary directly (optional)",IN("prNew",0,'min="0" step="500"')),
    RB("New salary","prBig")));
  var cur="USD";segWire("prCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){var old=num("prSalary"),nw=num("prNew")>0?num("prNew"):old*(1+num("prPct")/100),diff=nw-old,pct=old>0?diff/old*100:0;
    $("prBig").textContent=fmtMoney0(nw,cur);
    KV("prBig",[["Increase per year",fmtMoney0(diff,cur)+" ("+pct.toFixed(2)+"%)"],["Extra per month",fmtMoney(diff/12,cur)],["Extra per payslip (biweekly)",fmtMoney(diff/26,cur)],["New hourly (40 hrs × 52)",fmtMoney(nw/2080,cur),1]]);
    NOTE("prBig","Compare the raise with inflation: a 3% raise in a 3.5% inflation year is a small real-terms pay cut. Use the Inflation Calculator to check.");}
  onIn(["prSalary","prPct","prNew"],calc);calc();
})();
/* ---- Time Zone Meeting Planner ---- */
(function(){
  var CITIES=[["New York (ET)","America/New_York"],["Chicago (CT)","America/Chicago"],["Denver (MT)","America/Denver"],["Los Angeles (PT)","America/Los_Angeles"],["Toronto (ET)","America/Toronto"],["Vancouver (PT)","America/Vancouver"],["London (UK)","Europe/London"],["Berlin (CET)","Europe/Berlin"],["Dubai (GST)","Asia/Dubai"],["Mumbai (IST)","Asia/Kolkata"],["Singapore (SGT)","Asia/Singapore"],["Sydney (AET)","Australia/Sydney"]];
  var opts=CITIES.map(function(c,i){return '<option value="'+i+'"'+(i===0?" selected":"")+'>'+c[0]+'</option>';}).join("");
  mkPanel("timezoneplanner","Time Zone Meeting Planner","One meeting time, every city's local time — no mental gymnastics.",cols2(
    F("Meeting date",IDT("tzDate",todayISO()))+F("Meeting time",'<input type="time" id="tzTime" value="09:00" />')+F("In this city",SEL("tzFrom",opts)),
    RB("Same moment around the world","tzBig")));
  function offsetMs(zone,d){try{var dtf=new Intl.DateTimeFormat("en-US",{timeZone:zone,hourCycle:"h23",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"});var parts={};dtf.formatToParts(d).forEach(function(x){parts[x.type]=x.value;});var asUTC=Date.UTC(+parts.year,+parts.month-1,+parts.day,(+parts.hour)%24,+parts.minute,+parts.second);return asUTC-Math.floor(d.getTime()/1000)*1000;}catch(e){return 0;}}
  function calc(){var dv=$("tzDate").value,tv=$("tzTime").value||"09:00";if(!dv){$("tzBig").textContent="—";return;}
    var from=CITIES[parseInt($("tzFrom").value,10)][1],parts=dv.split("-"),tp=tv.split(":");
    var guess=Date.UTC(+parts[0],+parts[1]-1,+parts[2],+tp[0],+tp[1]);
    var utc=guess-offsetMs(from,new Date(guess));utc=guess-offsetMs(from,new Date(utc));
    var rows=CITIES.map(function(c){var local=new Date(utc+offsetMs(c[1],new Date(utc)));
      var label=local.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})+" · "+local.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});
      return [c[0],label,c[1]===from?1:0];});
    $("tzBig").textContent="Converted ✓";
    KV("tzBig",rows);NOTE("tzBig","Handles daylight saving automatically using your browser's time-zone database. A red-eye slot for one city is usually 2–6 AM — rotate meeting times fairly across regions.");}
  onIn(["tzDate","tzTime","tzFrom"],calc);calc();
})();

/* Open tool from #hash on load */
(function(){
  var h=(location.hash||"").replace("#","");
  if(h&&$("panel-"+h))openTool(h);
})();

;

"use strict";
/* ================= Multi-page routing, articles & site pages ================= */
var CATNAMES={finance:"Money & Finance",health:"Health & Fitness",math:"Math & Dates",text:"Text & Developer",media:"Image & Media",study:"Study",fun:"Fun & Timers",home:"Home & Life",creator:"Social & Creators",seo:"SEO & Marketing",pdf:"PDF Tools"};
var FIN_DISC="Estimates only — not financial advice. This calculator gives general educational estimates based on the numbers you enter. It is not financial, tax, mortgage or investment advice, and it does not replace advice from a licensed financial adviser, mortgage broker, lender or tax professional. Always confirm rates, fees, taxes and terms with your lender or provider before making a decision.";
var HEALTH_DISC="General information only — not medical advice. This tool provides general wellness estimates for healthy adults. It is not a diagnosis and does not replace advice from your doctor, midwife, dietitian or other qualified health professional. If you have a medical condition, are pregnant, or are concerned about your health, please speak to a professional.";
var ART={
mortgage:{intro:"A mortgage calculator estimates your monthly home-loan payment before you talk to a lender. It splits the payment into principal and interest, and can add property tax (US), Council Tax (UK), home insurance and HOA or condo fees so you see the true monthly cost of a home.",steps:["Choose your currency: USD ($), GBP (£) or CAD ($).","Enter the home price and your down payment — the loan amount is the difference.","Enter the interest rate and loan term (30, 25, 20 or 15 years).","Add yearly tax and insurance if you want the full monthly cost, then press Calculate payment."],example:"A $450,000 home with a $90,000 down payment leaves a $360,000 loan. At 6.5% over 30 years, principal and interest is about $2,275 per month. Add $5,400/year property tax ($450/month) and $1,800/year insurance ($150/month) and the full payment is about $2,875 per month, with roughly $459,000 of interest paid over the full term.",use:"Use it when comparing homes, deciding how much down payment to save, or checking whether a shorter term is affordable. A 15-year term costs more each month but usually saves a very large amount of interest.",mistakes:["Forgetting taxes, insurance and HOA fees — the real payment can be hundreds more per month.","Comparing homes on price alone instead of on total monthly cost.","Assuming the rate you see advertised is the rate you will qualify for — your credit score and deposit size matter."],faq:[["How much down payment do I need?","In the US many buyers put down 3–20%, in the UK typically 5–25%, and in Canada at least 5% for homes under $500,000. Below 20% in the US or Canada usually means extra mortgage insurance costs."],["Why is so much of my early payment interest?","Interest is charged on the full balance, which is highest at the start. As the balance falls, more of each payment goes to principal."]]},
tip:{intro:"This tip calculator works out a fair tip and splits the total evenly, so nobody at the table has to do mental maths. Tipping customs vary by place: in the United States and Canada tipping is a core part of service pay, while in the UK it is smaller and a service charge is often already included.",steps:["Choose USD, GBP or CAD.","Enter the bill amount before tip.","Tap a tip percentage (10–25%) or type a custom percentage.","Drag the slider to set how many people are splitting the bill, then read the per-person amount."],example:"An $86.40 dinner bill with an 18% tip gives a $15.55 tip and a $101.95 total. Split between 2 people, each person pays $50.98 — $43.20 for food and $7.78 of tip each.",use:"Use it at restaurants, bars, cafes, salons and for delivery drivers — anywhere a group bill needs splitting fairly, or when you travel and are unsure of local tipping norms.",mistakes:["Tipping on the after-tax total when you meant the pre-tax amount — the difference is small but adds up.","Double-tipping in the UK when a 12.5% service charge is already on the bill — check first.","Splitting only the food and forgetting the tip, drinks or shared starters."],faq:[["How much should I tip in the US and Canada?","15% is the minimum for adequate service, 18–20% is standard for good service, and 22–25% rewards excellent service. For delivery, $3–$5 or 10–15% is common."],["Do I tip in the UK?","10–12.5% in restaurants is customary, but many bills already include a service charge. Tipping in pubs is optional."]]},
salary:{intro:"The salary to hourly calculator converts pay between a yearly salary and an hourly wage. It is essential when comparing a salaried job offer with an hourly or contract role, or when working out what your time is really worth as a freelancer.",steps:["Pick the direction: Salary to Hourly, or Hourly to Salary.","Choose USD, GBP or CAD.","Enter the salary or hourly rate.","Set your hours per week and weeks worked per year — the breakdown updates instantly."],example:"A $65,000 salary at 40 hours a week for 52 weeks equals $31.25 per hour, $250 per day, $1,250 per week and about $5,417 per month. In the UK, a £38,000 salary on a 37.5-hour contract is about £19.49 per hour.",use:"Use it to compare job offers fairly, price freelance work, check overtime value, or see what a part-time schedule would actually pay.",mistakes:["Using 52 weeks when you take unpaid leave — use 48–50 weeks for an honest rate.","Forgetting that UK full-time is often 37.5 hours, not 40 — the hourly rate changes a lot.","Comparing gross salary with take-home pay — this tool converts gross (before tax) figures only."],faq:[["Does this show take-home pay?","No. It converts gross pay before income tax, US Social Security, UK National Insurance, Canadian CPP/EI and pension deductions."],["What is a good hourly rate for a $50,000 salary?","At 40 hours a week, $50,000 a year is $24.04 per hour."]]},
loan:{intro:"A loan calculator shows the true cost of borrowing for a car loan, personal loan or student loan: the monthly payment, the total interest, and the date you will be debt-free. Adding even a small extra monthly payment shows how much interest you can save.",steps:["Choose USD, GBP or CAD.","Enter the loan amount, the annual interest rate (APR) and the term in years.","Optionally add an extra monthly payment to see the saving.","Read the monthly payment, total interest and payoff date."],example:"A $25,000 car loan at 7.5% over 5 years costs $500.95 per month and $5,057 in total interest. Add $100 extra per month and the loan clears about 11 months early, saving roughly $850 in interest.",use:"Use it before signing any loan agreement, when comparing offers from different lenders, or when deciding whether to pay a loan off early.",mistakes:["Looking only at the monthly payment — a longer term lowers the payment but raises total interest sharply.","Ignoring fees and origination charges, which are not included in a simple payment calculation.","Borrowing the maximum you qualify for instead of the amount you comfortably afford."],faq:[["What is APR?","APR is the yearly cost of the loan including the interest rate and most fees, expressed as a percentage. Compare APRs, not just rates."],["Does paying extra really help?","Yes. Extra payments reduce the balance directly, so less interest is charged every month after that."]]},
compound:{intro:"The compound interest calculator shows how savings and investments grow when interest earns interest. It is the single most important idea in long-term saving, and it works the same way for a US 401(k), a UK ISA or a Canadian RRSP or TFSA.",steps:["Choose your currency and enter your starting amount.","Add a monthly deposit you can realistically keep up.","Enter an expected annual return and the number of years.","Compare the final value with the total you deposited — the gap is compound growth."],example:"Start with $10,000, add $250 a month at a 7% annual return for 20 years and you deposit $70,000 in total — but the account grows to about $141,000. Roughly half of the final value is interest earned on interest.",use:"Use it for retirement planning, a child's savings account, or any long-term goal where time in the market matters more than timing the market.",mistakes:["Assuming a fixed return every year — real investments rise and fall, so treat this as an illustration, not a promise.","Forgetting inflation: money growing at 7% with 3% inflation is really growing at about 4% in buying power.","Stopping monthly deposits early — the biggest growth happens in the later years."],faq:[["How often is interest compounded here?","Monthly, with deposits added at the end of each month, which matches most savings accounts and investment plans."],["What return should I assume?","Long-run US and global stock market returns have averaged roughly 7–10% a year before inflation, but past performance never guarantees future results."]]},
savings:{intro:"The savings goal calculator answers one question: if I save this much each month, when will I get there? Enter a target such as a house deposit, a car, a wedding or an emergency fund, and it works out the date and how much of the total is your money versus interest.",steps:["Enter your savings goal and what you have already saved.","Enter your monthly deposit.","Add the interest rate your account pays, if any.","Read your goal date and the breakdown of deposits versus interest."],example:"Saving for a $20,000 house deposit with $2,000 already saved and $400 a month at 4% interest takes about 41 months — you would reach the goal in roughly 3 years and 5 months, with about $900 of the total coming from interest.",use:"Use it to set a realistic monthly amount for a deposit, holiday, car or emergency fund, and to see how raising the deposit by even $25 a month pulls the date forward.",mistakes:["Setting a monthly amount you cannot sustain — a smaller amount you never skip beats a big one you abandon.","Leaving savings in an account paying near 0% while better savings rates exist.","Not counting irregular costs — build a small buffer into the goal."],faq:[["How big should an emergency fund be?","A common guideline is 3–6 months of essential expenses, kept in an easy-access account."],["Should I save or pay off debt first?","High-interest debt (like credit cards at 20%+) usually costs more than savings earn, so many advisers suggest clearing that first while keeping a small starter emergency fund."]]},
salestax:{intro:"The US sales tax calculator adds state sales tax to a price so you know the real amount at the till. Sales tax in the United States is set by states, counties and cities, so the same $100 item can cost very different totals in California, Texas, New York or tax-free Oregon.",steps:["Enter the price before tax.","Pick your state to load its base rate.","Adjust the rate if your city or county adds local tax — the rate on a recent receipt is the most accurate.","Read the tax amount and the total with tax."],example:"A $100 item in California at the 7.25% state base rate adds $7.25 tax, for a $107.25 total. In Chicago the combined rate is about 10.25%, so the same item costs $110.25. In Oregon, with no sales tax, it stays $100.",use:"Use it for budgeting purchases, pricing products in an online store, checking receipts, or planning shopping on a trip to another state.",mistakes:["Using only the state rate — local city and county taxes commonly add 1–4%.","Assuming Canada and the UK work the same way — Canada uses GST/HST/PST and UK prices usually already include VAT.","Forgetting that some items (groceries, clothing under a threshold in some states) are taxed differently."],faq:[["Which states have no sales tax?","Oregon, Montana, Delaware, New Hampshire and Alaska have no statewide sales tax, though some Alaska localities charge one."],["Is sales tax included in US shelf prices?","Usually no — tax is added at checkout, unlike the UK and Canada where shelf prices normally include VAT or HST."]]},
vat:{intro:"The UK VAT calculator adds VAT to a net price or removes it from a gross price. VAT is the UK equivalent of a sales tax, charged at 20% on most goods and services, 5% on items such as home energy, and 0% on most food and children's clothes. It matters to shoppers, freelancers and every VAT-registered business.",steps:["Enter the amount in pounds (£).","Choose the VAT rate: 20%, 5% or 0%.","Tell the tool whether your amount is net (excluding VAT) or gross (including VAT).","Read the net, VAT and gross figures."],example:"A freelancer charges £100 net for a job. At 20% VAT that is £20 of VAT and a £120 invoice total. Working backwards, a £120 receipt contains £100 net and £20 VAT — divide by 1.2 to strip VAT out.",use:"Use it for invoicing, expense claims, checking supplier quotes, or working out the pre-tax price of anything you buy in the UK.",mistakes:["Dividing by 1.2 when the rate is 5% — use 1.05 for the reduced rate.","Adding VAT when you are not VAT-registered — only registered businesses (turnover over the £90,000 threshold) charge VAT.","Mixing up net and gross on quotes — always confirm which one a supplier has given you."],faq:[["What is the standard UK VAT rate?","20% on most goods and services. The reduced rate is 5% and the zero rate is 0%."],["Do visitors to the UK pay VAT?","Prices in shops already include VAT. Canada uses GST/HST instead, and the US adds sales tax at checkout — VAT is the UK system."]]},
discount:{intro:"The discount calculator tells you the real sale price after a percentage off, how much you save, and what happens when a second discount is stacked on top — the classic 'extra 20% off sale prices' offer in stores.",steps:["Choose USD, GBP or CAD and enter the original price.","Enter the main discount percentage.","Optionally enter a second discount that applies after the first.","Read what you pay, what you save, and the true combined discount."],example:"An $80 jacket at 25% off costs $60. With an extra 10% off at the till it drops to $54. That is a total saving of $26 — an effective 32.5% discount, not 35%, because the second discount applies to the already-reduced price.",use:"Use it during sales events like Black Friday, Boxing Day and January sales, for coupon stacking, or when pricing your own products and promotions.",mistakes:["Adding stacked percentages together — 25% + 10% is 32.5% off, not 35%.","Forgetting that sales tax or VAT is charged on the discounted price, not the original.","Comparing a discount percentage instead of the final price across stores."],faq:[["How do I find the percentage off?","Divide the amount saved by the original price and multiply by 100. Saving $26 on $80 is 32.5% off."],["Is a bigger percentage always a better deal?","No — 40% off an inflated original price can cost more than 20% off a fair one. Always compare final prices."]]},
percentage:{intro:"The percentage calculator answers the three percentage questions everyone meets at work, school and in shops: what is X% of Y, X is what percent of Y, and what is the percentage change from X to Y. No formulae to remember and no calculator-button gymnastics.",steps:["Find the question you need — each box works independently.","Type your two numbers.","Read the result instantly; try other values to compare."],example:"15% of 240 is 36. 45 out of 180 is 25%. And a price rising from $80 to $100 is a +25% increase — while falling back from $100 to $80 is only a −20% decrease, because the starting point changed.",use:"Use it for tips, discounts, tax, exam scores, survey results, pay rises and any 'what percent is this of that' moment.",mistakes:["Treating a rise and the reverse fall as the same percentage — they never are.","Confusing percentage points with percent: a rate going from 4% to 5% is up 1 percentage point, but up 25% relatively.","Dividing by the wrong number — the percentage is always measured against the starting or reference value."],faq:[["How do I calculate a percentage of a number?","Multiply the number by the percentage divided by 100. For 15% of 240: 240 × 0.15 = 36."],["What is the formula for percentage change?","(New − Old) ÷ Old × 100. A positive result is an increase, negative is a decrease."]]},
creditcard:{intro:"The credit card payoff calculator shows how long a card balance really takes to clear at a fixed monthly payment, and how much interest you will pay for the privilege. Credit card APRs commonly sit between 20% and 30%, which makes minimum payments painfully slow.",steps:["Choose your currency and enter your current balance.","Enter the card APR from your statement.","Enter the fixed amount you can pay every month.","See your debt-free date, total interest and number of payments."],example:"A $3,500 balance at 24.99% APR paid at $150 a month takes about 31 months to clear and costs roughly $1,100 in interest. Raise the payment to $250 and it clears in about 17 months with roughly $600 of interest — saving about $500.",use:"Use it to build a payoff plan, compare paying one card versus another, or motivate yourself by seeing exactly what a bigger payment saves.",mistakes:["Paying only the minimum — it mostly covers interest, so the balance barely moves for years.","Keeping spending on a card you are trying to clear.","Ignoring balance-transfer offers without checking their fees and the rate after the introductory period ends."],faq:[["Why does my payment need to beat the monthly interest?","If your payment is smaller than the interest added each month, the balance grows even though you are paying. This tool warns you when that happens."],["Which card should I pay off first?","Paying the highest APR first (the avalanche method) costs the least overall. Paying the smallest balance first (snowball) suits people who need quick wins to stay motivated."]]},
rent:{intro:"The rent affordability calculator uses the rules landlords and letting agents actually apply. In the US, the classic guideline is rent at no more than 30% of gross income, and many landlords require income of 40 times the monthly rent. UK referencing is similar, and Canadian landlords commonly look for rent near or below 30–35% of income.",steps:["Choose USD, GBP or CAD and enter your gross annual income (before tax).","Add your other monthly debts, such as car payments and card minimums.","Enter the rent you are considering.","Compare it with the 28%, 30% and 35% comfort levels shown."],example:"On a $60,000 salary ($5,000 a month gross), the 30% rule gives a maximum rent of $1,500 a month. A $1,400 rent is 28% of income — comfortable — and it passes the 40x rule, which requires income of at least $56,000 for that rent.",use:"Use it before flat-hunting or signing a lease, to set a realistic budget on property sites, or to check whether a rent rise is still affordable.",mistakes:["Using take-home pay with a rule designed for gross pay — the 30% rule uses income before tax.","Forgetting bills, council tax or utilities, parking and commuting costs on top of rent.","Stretching past 35% while carrying other debts — it leaves no room for surprises."],faq:[["What is the 40x rule?","Many US landlords require your annual income to be at least 40 times the monthly rent. A $1,500 rent needs $60,000 a year."],["Is the 30% rule realistic in big cities?","In New York, London, Toronto and Vancouver many renters exceed it. Treat 30% as a healthy target, 35% as a stretch, and anything higher as a warning to check the rest of your budget carefully."]]},
inflation:{intro:"The inflation calculator shows what today's prices will cost in the future — and what cash sitting still will really be worth. Inflation in the US and Canada has averaged around 2–3% over the long run, and the Bank of England targets 2% in the UK, but even 'low' inflation quietly halves the buying power of cash in about 24 years at 3%.",steps:["Choose your currency and enter an amount — a weekly shop, rent, or a salary.","Enter an inflation rate, or keep 3.2% as a long-run estimate.","Enter how many years ahead to look.","Compare the future cost with what the same cash buys if it earns nothing."],example:"A $100 weekly grocery shop at 3.2% inflation costs about $137 in 10 years. And $100 kept in cash for those 10 years buys only about $73 worth of today's goods. A $50,000 salary needs to reach about $68,500 in a decade just to stand still.",use:"Use it for retirement planning, negotiating long-term pay, setting savings targets, or understanding why leaving large amounts in a non-interest account loses money.",mistakes:["Assuming inflation stays at today's headline rate — it moves around a lot year to year.","Forgetting inflation when planning savings goals 10+ years away.","Comparing future prices with today's salary instead of a salary that also grows."],faq:[["What inflation rate should I use?","For long-term planning, 2.5–3.5% is a reasonable planning range, even though individual years vary widely."],["How does inflation affect savings?","If your account pays less interest than inflation, your money loses buying power even though the balance grows."]]}
,
bmi:{intro:"The BMI calculator works out your Body Mass Index — a quick screening number that compares your weight with your height. It is used by doctors and health agencies worldwide as a first check of whether your weight sits in a healthy range. Enter measurements in imperial (feet, inches, pounds) or metric (centimetres, kilograms).",steps:["Choose US imperial or metric units.","Enter your height and your weight.","Read your BMI number and its category: underweight, healthy, overweight or obese.","Check the healthy weight range shown for your exact height."],example:"At 5 ft 9 in (175 cm) and 170 lb (77 kg), BMI is 25.1 — just into the overweight band, which starts at 25. The healthy range for that height is about 125–168 lb (57–76 kg), so losing a few pounds crosses back into the healthy band.",use:"Use it as a starting point for a weight goal, before a health check, or to track change over time alongside waist size, fitness and how you feel.",mistakes:["Treating BMI as a diagnosis — it cannot tell muscle from fat, so athletes often score 'overweight' while being very healthy.","Using it for children — under-18s need age- and sex-specific percentile charts, not adult bands.","Measuring height in shoes or guessing weight — small errors move the result noticeably."],faq:[["What is a healthy BMI?","For most adults, 18.5 to 24.9 is the healthy range. Below 18.5 is underweight, 25–29.9 overweight, and 30 or above obese."],["Is BMI different in the UK, US and Canada?","No — the formula and bands are the same worldwide. Only the units people enter differ."]]},
calorie:{intro:"The calorie and TDEE calculator estimates how many calories you burn each day and how many to eat to maintain, lose or gain weight. It uses the Mifflin–St Jeor formula, the same equation dietitians widely use, adjusted for your activity level.",steps:["Select male or female (the formula differs slightly).","Enter your age, weight in pounds and height in inches.","Choose the activity level that honestly matches a normal week.","Pick your goal — lose about 1 lb a week, maintain, or gain — and read your daily target."],example:"A 30-year-old man, 180 lb and 5 ft 10 in, with moderate activity has a maintenance level (TDEE) of about 2,760 kcal a day. Eating about 2,260 kcal targets roughly 1 lb of weight loss per week, with around 144 g of protein a day to protect muscle.",use:"Use it to set a sensible starting calorie target for weight loss, muscle gain or maintenance, then adjust after 2–3 weeks based on what the scale actually does.",mistakes:["Overestimating activity — most desk workers who train three times a week are 'light' or 'moderate', not 'active'.","Cutting too hard: very low calories are hard to sustain and can cost muscle. A 300–500 kcal deficit is the standard approach.","Treating the estimate as exact — real needs vary by roughly ±10%, so track and adjust."],faq:[["What is TDEE?","Total Daily Energy Expenditure — all the calories you burn in a day, including exercise and normal movement. Eat below it to lose weight, above it to gain."],["How fast should I lose weight?","About 0.5–1% of body weight per week is a sustainable rate for most people. Avoid eating below 1,200 kcal a day without medical supervision."]]},
pregnancy:{intro:"The pregnancy due date calculator estimates when your baby is due, counting from the first day of your last menstrual period (LMP). It is the same starting method used by midwives and doctors, before a dating scan confirms it.",steps:["Enter the first day of your last period.","Adjust the cycle length if yours is not the average 28 days.","Read your estimated due date, how many weeks pregnant you are, and your trimester.","Note the approximate conception date if you are working dates backwards."],example:"If your last period started on 1 March and you have a 28-day cycle, your estimated due date is 6 December — 280 days later. On 10 June you would be about 14 weeks and 3 days pregnant, at the start of the second trimester.",use:"Use it to plan appointments, maternity leave, travel and nursery shopping, and to understand which trimester you are in at any point.",mistakes:["Entering the last day of your period instead of the first day.","Forgetting to adjust for a longer or shorter cycle — a 35-day cycle shifts the due date about a week later.","Treating the date as a deadline: only about 5% of babies arrive on the exact day, and any time from 37 to 42 weeks can be normal."],faq:[["How is a due date calculated?","Add 280 days (40 weeks) to the first day of your last period, adjusted for your cycle length. This is called Naegele's rule."],["Can a scan change my due date?","Yes. A first-trimester dating scan is more accurate, and your provider will use that date once it is done."]]},
water:{intro:"The water intake calculator gives you a personal daily hydration target based on your body weight, exercise and climate. The common US guideline is about half an ounce of water per pound of body weight, topped up for workouts and hot weather — and this tool does that maths for you in ounces, litres, cups and bottles.",steps:["Enter your body weight in pounds.","Enter how many minutes you exercise on a typical day.","Choose your climate — hot and humid days need more.","Read your daily target in fl oz, litres, cups and standard bottles."],example:"A 160 lb person needs a base of about 80 fl oz a day. Add 30 minutes of exercise (+12 oz) and the target is 92 fl oz — about 2.72 litres, 11.5 cups, or roughly five and a half 16.9 oz bottles spread through the day.",use:"Use it to set a realistic hydration habit for training, outdoor work, hot climates, or simply to check whether your current intake is in the right area.",mistakes:["Drinking a whole day's water at once — spread it through the day; your body absorbs it better.","Counting only plain water and panicking — tea, coffee, milk and food all contribute fluid too.","Forcing far beyond thirst: overhydration is rare but real, especially during endurance events."],faq:[["Is the '8 glasses a day' rule right?","It is a rough average. Needs scale with body size, activity and heat — a 120 lb office worker and a 220 lb roofer in Texas need very different amounts."],["What colour should urine be?","Pale straw-yellow usually means you are well hydrated. Dark yellow suggests drinking more; completely clear all day can mean you can ease off."]]},
idealweight:{intro:"The ideal weight calculator shows the healthy weight range for your height in two ways: the BMI 18.5–24.9 band used by health services, and the classic Devine formula used in medicine. It gives a range, not a single magic number, because healthy bodies vary.",steps:["Select male or female (used by the Devine formula).","Enter your height in feet and inches.","Read your healthy range in pounds and kilograms, plus the Devine estimate."],example:"A man who is 5 ft 10 in has a healthy BMI range of about 129–174 lb (58.5–79 kg). The Devine formula puts his 'ideal' at about 166 lb (75.3 kg) — near the top of the range, which is normal for that older formula.",use:"Use it to set a realistic target range for weight loss or gain, or as a reference alongside BMI, waist measurement and your clinician's advice.",mistakes:["Aiming for the very bottom of the range — the whole band is healthy, and the middle suits most builds.","Applying adult ranges to teenagers, whose healthy weight depends on growth and age.","Ignoring build and muscle: broad or athletic frames can be healthy above the range."],faq:[["Why do the two methods differ?","The BMI band is a wide statistical range for populations. The Devine formula gives one point estimate from 1974 medical practice. The range is the more useful guide."],["Should my ideal weight change with age?","The ranges stay the same, but body composition changes with age. Many clinicians focus more on waist size, strength and metabolic health in older adults."]]},
pace:{intro:"The running pace calculator converts any race distance and finish time into pace per mile or kilometre, plus your speed. Whether you train in miles or kilometres, it also shows what your pace means for classic distances from 5K to the marathon.",steps:["Enter your distance and choose miles or kilometres.","Enter your finish time in hours, minutes and seconds — or tap a race preset like 5K or Marathon.","Read your pace per mile or km and your speed.","Check the finish-time rows to plan your next race target."],example:"Running 5K (3.11 miles) in 27 minutes 30 seconds is a pace of 8:51 per mile, or 5:30 per kilometre, at about 6.8 mph. Hold that pace for a marathon and you would finish in about 3 hours 52 minutes.",use:"Use it to plan race targets, set treadmill speeds, pace training runs, or work out what finish time a training pace would produce.",mistakes:["Mixing units — a 5:30 pace per kilometre is very different from 5:30 per mile.","Planning a marathon at your 5K pace — longer races are run noticeably slower per mile.","Forgetting that courses, heat and hills change real-world pace."],faq:[["What is a good 5K time?","For adult beginners, under 30 minutes is a great milestone. Intermediate runners often aim for 22–25 minutes, and competitive club runners go under 20."],["How do I convert pace per mile to per km?","Divide the mile pace by 1.609. An 8:51 mile pace (531 seconds) becomes about 330 seconds, or 5:30 per km."]]},
age:{intro:"The age calculator works out an exact age in years, months and days — not just 'about 34'. It also shows total days and hours lived, the weekday you were born, and exactly when your next birthday falls. It is the tool to reach for whenever a form, school or official process needs a precise age.",steps:["Enter the date of birth.","Leave the 'age at' date as today, or change it to any past or future date.","Press Calculate age.","Read the exact age, totals and next-birthday countdown."],example:"Someone born on 15 May 1990 is, on November 2026, exactly 36 years, 6 months and 0 days old. That is 13,333 days, about 319,992 hours, and their next birthday (turning 37) falls on 15 May 2027.",use:"Use it for school enrollment cutoffs, sports age groups, eligibility checks, insurance and pension dates, or settling family debates about who is exactly how old.",mistakes:["Guessing age by year only — someone born in December is almost a full year younger than the year maths suggests.","Using the wrong date format: this tool uses unambiguous date pickers, so there is no US month/day versus UK day/month confusion.","Forgetting leap years when counting days by hand — the calculator counts them for you."],faq:[["How is exact age calculated?","Years first, then whole months, then remaining days — the same method used on official forms. Leap days are counted automatically."],["Can I calculate age at a future date?","Yes. Set the 'age at' date to any date — for example a school cutoff or a retirement date — to see the age on that day."]]},
unit:{intro:"The unit converter translates between imperial and metric measurements — the everyday conversions needed between the United States (imperial), the United Kingdom (a mix) and Canada (officially metric). Length, weight, volume, area, speed and temperature are all covered, including UK versus US gallons, which are genuinely different.",steps:["Choose a category: length, weight, volume, area or speed.","Enter your value and pick the 'from' and 'to' units.","Read the converted result instantly.","For temperature, use the dedicated °F to °C (or reverse) converter at the bottom of the panel."],example:"10 feet is 3.05 metres. 170 pounds is 77.1 kg, or 12 stone 2 lb in UK terms. A US gallon is 3.785 litres but a UK gallon is 4.546 litres — a 20% difference. And 72°F is 22.2°C, a pleasant room temperature.",use:"Use it for recipes, DIY and construction, travel, shipping weights, fitness, schoolwork and any time a product spec arrives in the 'wrong' units.",mistakes:["Confusing US and UK (imperial) gallons and pints — they differ by about 20%.","Confusing a US ton (2,000 lb) with a metric tonne (1,000 kg) or a UK long ton.","Converting temperature with a ratio — °F to °C needs the subtract-32 step, which the temperature box handles."],faq:[["How many centimetres are in an inch?","Exactly 2.54 cm. A foot is 30.48 cm and a mile is 1.609 kilometres."],["Why does the UK use both systems?","The UK is officially metric but still uses miles on roads, pints for beer and milk, and stones for body weight — so UK users convert in both directions daily."]]},
fraction:{intro:"The fraction calculator adds, subtracts, multiplies and divides fractions and simplifies the answer automatically, showing it as a fraction, a mixed number and a decimal. It is built for homework, cooking, woodworking and any job where measurements come in halves, thirds and eighths.",steps:["Enter the top (numerator) and bottom (denominator) of the first fraction.","Choose the operation: add, subtract, multiply or divide.","Enter the second fraction.","Read the simplified result, its mixed-number form and its decimal value."],example:"One half plus one third: 1/2 + 1/3 = 5/6, which is 0.8333 as a decimal. In the kitchen that is why a recipe calling for 1/2 cup plus 1/3 cup needs a 5/6 cup measure — just under a full cup.",use:"Use it for school maths, scaling recipes up or down, carpentry measurements in inches, and checking homework answers.",mistakes:["Adding the tops and bottoms straight across — 1/2 + 1/3 is not 2/5. Denominators must match first, which this tool handles.","Forgetting to simplify: 4/8 should be shown as 1/2.","Dividing by flipping the wrong fraction — when dividing, flip the second fraction and multiply."],faq:[["How do I turn a fraction into a decimal?","Divide the numerator by the denominator. 3/4 = 0.75. The calculator shows the decimal for every result."],["What is a mixed number?","A whole number plus a fraction, such as 1 1/2 instead of 3/2. It is the form most recipes and tape measures use."]]},
randomnum:{intro:"The random number generator picks truly random whole numbers in any range you set, with the option to prevent repeats. It uses your browser's cryptographic random generator — the same quality of randomness used for security — so results are fair for draws, games and sampling.",steps:["Enter the minimum and maximum of your range.","Choose how many numbers to generate (up to 100).","Choose whether repeats are allowed or every number must be unique.","Press Generate numbers and read the list, count and sum."],example:"Generating 5 unique numbers between 1 and 49 gives a lottery-style line such as 4, 17, 23, 38, 45. Generating 2 numbers between 1 and 6 simulates rolling two dice, with the sum shown to check the total.",use:"Use it for raffles and giveaways, picking lottery numbers, classroom cold-calling, board games, A/B sampling and decision-making.",mistakes:["Asking for more unique numbers than the range contains — 10 unique numbers cannot come from a range of 1 to 6.","Using a tiny range for a 'random' draw and being surprised by repeats — repeats are natural in small ranges when allowed.","Using this for passwords or security tokens — use the password and UUID generators instead."],faq:[["Are the numbers really random?","Yes. They come from crypto.getRandomValues in your browser, not from a predictable sequence, and nothing is sent to a server."],["Can I generate numbers with no repeats?","Yes — choose 'No — all unique'. The count must be no larger than the size of the range."]]},
hours:{intro:"The hours calculator works out how long a shift or task lasted between a start and end time, subtracts breaks, and can multiply by an hourly rate to show pay. It handles overnight shifts too — a standard need for healthcare, hospitality, logistics and security workers.",steps:["Enter the start time and end time.","Enter unpaid break minutes to subtract.","Optionally enter an hourly pay rate.","Set days per week to see the weekly total hours and pay."],example:"A shift from 9:00 AM to 5:30 PM is 8.5 hours. Minus a 30-minute unpaid break gives 8 paid hours. At $20 an hour that is $160 for the shift, and five such shifts make a 40-hour, $800 week.",use:"Use it for timesheets, payroll checks, invoicing clients by the hour, and verifying that a payslip matches the hours you actually worked.",mistakes:["Forgetting that unpaid breaks must come off — an 8.5-hour presence is often 8 paid hours.","Entering an overnight shift wrongly: if the end is earlier than the start, this tool treats it as next-day automatically.","Mixing decimal hours with hours-and-minutes: 8.5 hours is 8 hours 30 minutes, not 8 hours 50 minutes."],faq:[["How do I convert minutes to decimal hours?","Divide by 60. 45 minutes is 0.75 hours, 20 minutes is 0.33. The calculator shows both formats."],["Does it calculate overtime?","It shows total hours and straight-time pay. Overtime rules differ (for example, over 40 hours a week under US federal law, or your UK/Canadian contract), so apply your premium rate to the extra hours separately."]]},
datediff:{intro:"The date difference calculator finds the exact gap between two dates — in years, months and days, total days, weeks, and weekdays only. It is the reliable way to answer questions that month lengths and leap years make surprisingly hard to do by hand.",steps:["Enter the start date.","Enter the end date (order does not matter — the tool sorts them).","Read the difference in years/months/days, total days and business days."],example:"From 1 January 2026 to November 2026 is 318 days — 45 weeks and 3 days, or about 10.5 months. Counting only Monday-to-Friday days gives 227 weekdays, which is the number that matters for a business deadline.",use:"Use it for project timelines, notice periods, tenancy and contract dates, visa and eligibility windows, and working out exactly how long until or since an event.",mistakes:["Counting months as exactly 30 days — real months run 28 to 31 days.","Forgetting leap years: 2024 and 2028 have a 29 February that changes long spans.","Assuming weekdays and calendar days are interchangeable in contracts — they rarely are."],faq:[["Does it include both the start and end day?","It counts the elapsed days between the dates, like a stopwatch. If you need an inclusive count (both endpoints counted), add 1 day."],["How many weekdays are in a year?","About 260–262, depending on the year and where weekends fall. This tool counts the exact weekdays in your chosen span."]]},
daysuntil:{intro:"The days countdown calculator tells you exactly how many days remain until a date you care about — a holiday, wedding, exam, deadline, launch or Christmas — and how many weeks that is. Name the occasion and it labels the countdown for you.",steps:["Pick the target date.","Optionally type what the occasion is.","Read the days to go, the weekday and date, and the weeks remaining."],example:"On 15 November, Christmas Day (25 December) is 40 days away — 5 weeks and 5 days. That is the kind of number that turns 'plenty of time' into a concrete shopping and travel plan.",use:"Use it for event planning, project deadlines, pregnancy and leave planning, saving goals tied to a date, and building anticipation for trips and celebrations.",mistakes:["Counting by months instead of days — 'about two months' can hide a two-week error.","Forgetting time zones for international deadlines — a date can arrive a day earlier or later depending on location.","Not re-checking after plans move — update the date and the countdown updates with it."],faq:[["What if the date has passed?","The tool tells you how many days ago it was, which is handy for anniversaries and 'days since' tracking."],["Can I count down to a birthday?","Yes — enter this year's date, or next year's if this year's has passed, and it shows the exact days remaining."]]},
roman:{intro:"The Roman numeral converter translates numbers into Roman numerals and Roman numerals back into numbers, validating as it goes. It covers the standard range 1 to 3999 used on clocks, book chapters, film copyright dates, the Super Bowl, and British monarch names such as Elizabeth II.",steps:["To convert a number, type it in the number box (1–3999).","To convert back, type a Roman numeral in the second box.","Read the result — invalid numerals are flagged with an explanation."],example:"2026 in Roman numerals is MMXXVI. The year 1999 is MCMXCIX — not IMM — because 900 is CM and 99 is XCIX. Queen Elizabeth II is 'the Second', and Super Bowl 60 will be Super Bowl LX.",use:"Use it for homework, reading clock faces and building inscriptions, tattoo designs, document numbering and checking film or book publication years.",mistakes:["Repeating a symbol more than three times — 4 is IV, never IIII (except on some traditional clock faces).","Subtracting the wrong symbols: only I, X and C can subtract, and only from the next two larger values.","Writing 1999 as IMM — subtractive pairs must step one level at a time: CM (900) then XC (90) then IX (9)."],faq:[["Why does it stop at 3999?","Standard Roman numerals have no symbol repeated beyond MMM for 3000 without an overline (vinculum) notation, which everyday use avoids."],["Is there a Roman zero?","No — the Roman system has no zero, which is one reason Arabic numerals replaced it for maths."]]},
average:{intro:"The average calculator finds the mean of any list of numbers and goes further: median, mode, sum, smallest, largest and range. Those extra statistics matter, because a single mean can hide a lot — in exam scores, salaries, house prices and sports stats alike.",steps:["Type or paste your numbers, separated by commas, spaces or new lines.","Read the mean as the headline result.","Check the median and mode below to see whether the mean is being pulled by outliers."],example:"For the scores 85, 92, 78, 92, 88, 95, 71: the mean is 85.9, the median is 88, the mode is 92, the sum is 601 and the range is 24 (from 71 to 95). The mean sits below the median because the 71 pulls it down.",use:"Use it for grade averages, monthly spending, sports statistics, survey results and any list where 'typical' matters more than total.",mistakes:["Reporting only the mean when one extreme value skews it — check the median too.","Averaging averages: combining two group means without weighting by group size gives the wrong answer.","Including a total or a zero placeholder in the list by accident."],faq:[["What is the difference between mean and median?","The mean adds everything and divides by the count. The median is the middle value when sorted. For house prices and salaries, the median is usually the more honest 'typical' figure."],["What if there are two modes?","A list can be bimodal. This tool lists every value tied for most frequent, or says 'no mode' when nothing repeats."]]}
,
gpa:{intro:"The GPA calculator computes your grade point average on the US 4.0 scale, weighted by credit hours, and can fold in your previous cumulative GPA. It is the number colleges, scholarship committees and many US employers screen on — and Canadian students applying to US schools use it too.",steps:["Add each course with its credit hours and letter grade.","Press Add course for more rows, or remove rows you do not need.","Optionally enter your prior cumulative GPA and credits earned so far.","Read this term's GPA, total credits, and your new cumulative GPA."],example:"English 101 (3 credits, A = 4.0), Calculus I (4 credits, B+ = 3.3), Biology 110 (3 credits, A− = 3.7) and a 3-credit B course give 45.3 grade points over 13 credits — a term GPA of 3.48.",use:"Use it each term to track progress toward honours, scholarship minimums (often 3.0) and graduate school requirements, and to see what a single grade does to your average before results day.",mistakes:["Weighting every course equally — a 4-credit A lifts your GPA far more than a 1-credit A.","Using the wrong scale: this is the standard unweighted 4.0 scale; weighted honours/AP scales run to 5.0.","Forgetting failed or repeated courses — most schools count them under their own repeat policy, so check yours."],faq:[["What GPA do I need for honours?","Commonly cum laude is about 3.5, magna cum laude 3.7 and summa cum laude 3.9, but every school sets its own thresholds."],["What is a B+ worth?","3.3 points. The full scale is in the note under the calculator: A = 4.0, A− = 3.7, B = 3.0, C = 2.0, D = 1.0, F = 0."]]},
gradecalc:{intro:"The grade calculator converts a test score into a percentage, a US letter grade with GPA points, and the equivalent UK degree classification. It is built for students who get a mark like 86 out of 100 and immediately want to know: what grade is that, really?",steps:["Enter points earned and points possible — or type a percentage directly.","Read your US letter grade and percentage.","Check the UK degree class if you study in Britain, and the GPA points for US transcripts."],example:"Scoring 86 out of 100 is 86% — a US B (3.0 GPA points). On a UK bachelor's degree, 86% would be a First Class mark, because UK Firsts start at 70% — the two systems use very different scales.",use:"Use it after every test or assignment to track where you stand, to convert grades when applying between different grading systems, and to set targets for the rest of a course.",mistakes:["Applying US percentages to UK degrees — a UK 65% (a 2:1) is a strong result, not a D.","Assuming every teacher uses the same letter bands — some use plus/minus, some round at boundaries.","Converting a single test instead of the weighted course average."],faq:[["What percentage is an A in the US?","Typically 90–100%, with A− at 90–92, A at 93–96 and A+ at 97+. Exact bands vary by school."],["What is a UK 2:1 in US terms?","A 2:1 is 60–69% in the UK and is the degree class most UK graduate employers require. It is roughly comparable to a US B range, though admissions offices convert case by case."]]},
finalgrade:{intro:"The final grade calculator answers the question every student asks in exam season: what do I need on the final to get the grade I want? Enter your current grade, your target, and how much the final exam counts — it also shows the score needed for every grade band and what a specific final score would give you.",steps:["Enter your current course percentage.","Enter the overall grade you want.","Enter the final exam's weight as a percentage of the course.","Optionally enter a predicted or actual final score to see your resulting grade."],example:"You have 88% going into a final worth 25%, and you want 90% overall. You need (90 − 88 × 0.75) ÷ 0.25 = 96% on the final. Wanting 85% overall instead needs only 76% — a far calmer target.",use:"Use it to set a realistic revision target, decide where to focus effort across courses, and check whether a target is still mathematically possible before you burn out chasing it.",mistakes:["Using your current grade without checking it is weighted the same way as the syllabus says.","Forgetting other remaining work — projects and homework still to come also move the final grade.","Assuming you need 100%: often the maths shows your target is already secured or needs a surprisingly modest score."],faq:[["What if the calculator says 'not possible'?","It means even 100% on the final cannot reach that target — it also shows the maximum overall grade still available, so you can aim at the best realistic outcome."],["How is the needed score calculated?","Needed = (Target − Current × (1 − Weight)) ÷ Weight, where Weight is the final's share of the course."]]},
age2:null,
words:{intro:"The word and character counter counts as you type: words, characters with and without spaces, sentences, paragraphs, reading time, speaking time and your most repeated words. It is built for the limits and lengths that matter — college essays, cover letters, LinkedIn posts, articles and speeches.",steps:["Type or paste your text into the box — counts update live.","Read the counts panel for words, characters and paragraphs.","Check reading and speaking time if the text will be read or presented.","Review your top words to spot accidental repetition, then copy or clear the text."],example:"A 1,000-word article takes about 5 minutes to read (at 200 words per minute) and about 7 minutes 40 seconds to read aloud (at 130 wpm). A standard US college essay limit of 650 words is roughly 3,800–4,200 characters including spaces.",use:"Use it for essay and application limits, freelance article briefs, speech timing, meta descriptions, and checking a draft before you submit or publish it. Whatever you call it \u2014 a word counter online, a words counter, a word count checker or a text word counter \u2014 you get the same live counts, with nothing to install.",mistakes:["Counting characters when the limit is words — application portals are strict about which one they mean.","Pasting in hidden formatting or double spaces from a document — the no-spaces count exposes it.","Repeating your top word dozens of times without noticing — the top-words panel catches it."],faq:[["How long does it take to read 500 words?","About 2.5 minutes silently, or around 4 minutes aloud — useful for presentations and video scripts."],["Does it count numbers as words?","Yes — any run of characters separated by spaces counts as a word, matching how most editors and portals count."]]},
caseconv:{intro:"The case converter rewrites text in every standard letter case with one click: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case and alternating case. Developers, writers and social media managers use these formats daily — URLs, code, headlines and hashtags all have their own rules.",steps:["Type or paste your text.","Click the case you need — the result appears below.","Copy the result with the Copy button."],example:"The phrase 'the quick brown fox' becomes THE QUICK BROWN FOX in uppercase, The Quick Brown Fox in Title Case, theQuickBrownFox in camelCase, and the-quick-brown-fox in kebab-case — the last one is exactly how it should appear in a web address.",use:"Use it for headlines, code variables, file names, URL slugs, database fields, and fixing text typed with Caps Lock on by accident.",mistakes:["Using Title Case rules for sentences — headlines and sentences follow different capitalisation.","Putting spaces or capitals in URLs — use kebab-case lowercase for web addresses.","Assuming camelCase and PascalCase are the same: PascalCase capitalises the first word too."],faq:[["What case do URLs use?","Lowercase kebab-case: words separated by hyphens, no capitals or spaces."],["What is the difference between snake_case and kebab-case?","Underscores versus hyphens. Python and databases favour snake_case; URLs and CSS favour kebab-case."]]},
lorem:{intro:"The lorem ipsum generator creates classic placeholder text — paragraphs, sentences or individual words — for designs, mockups and page layouts. Designers use it to show how a page will look with real amounts of text before the final copy exists.",steps:["Choose paragraphs, sentences or words.","Set how many you need (up to 50).","Press Generate, then copy the text into your design."],example:"Three paragraphs produce roughly 180–260 words of placeholder copy — about the length of a typical product description block — starting with the traditional 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'",use:"Use it in website mockups, app prototypes, print layouts and client presentations where layout must be judged without real content distracting anyone.",mistakes:["Shipping a live site with lorem ipsum still on it — always do a final text sweep before launch.","Using placeholder text in a document that needs real content decisions — dummy text hides length problems.","Generating far more than the layout needs, which makes a design look heavier than the real page."],faq:[["What does lorem ipsum mean?","It is scrambled Latin based on a Cicero text from 45 BC. It is deliberately meaningless so viewers judge the design, not the words."],["How many words are in a paragraph here?","Each generated paragraph has 3–5 sentences of 6–15 words, similar to typical web copy."]]},
dedupe:{intro:"Remove Duplicate Lines cleans a list by deleting every repeated line and keeping the first copy of each. It is the fastest way to tidy email lists, product codes, names, keywords and data exports without spreadsheet formulas.",steps:["Paste your list, one item per line.","Optionally ignore letter case, and optionally sort the result A–Z.","Press Remove duplicates, check the before/after counts, and copy the cleaned list."],example:"Paste a list of 120 email addresses collected from two sign-up forms and the tool might return 97 unique lines — 23 duplicates removed. With 'ignore case' on, Alex@Example.com and alex@example.com count as the same line.",use:"Use it for mailing lists, inventory and SKU lists, survey responses, keyword lists and merging exports from different tools.",mistakes:["Forgetting that trailing spaces used to make lines 'different' — this tool trims each line before comparing.","Turning on case-insensitive matching for things like passwords or codes, where case genuinely matters.","Deleting duplicates from data where repeats carry meaning, such as quantities in an order list."],faq:[["Does it keep the original order?","Yes, unless you tick Sort A–Z. The first occurrence of each line is kept, in place."],["Is my list uploaded anywhere?","No. The cleaning happens entirely in your browser; nothing is sent to a server."]]},
slug:{intro:"The slug generator turns a page or post title into a clean URL slug — the readable part of a web address after the domain. Good slugs help readers and search engines in every market, and WordPress, Shopify and most other platforms build them exactly this way.",steps:["Type or paste your title.","Choose a hyphen or underscore separator and your letter case.","Copy the finished slug into your CMS or address bar."],example:"'10 Best Coffee Shops in New York!' becomes 10-best-coffee-shops-in-new-york. Accents are folded too — 'Café Guide: Montréal' becomes cafe-guide-montreal, which is safe in any browser or email.",use:"Use it when publishing blog posts, product pages and landing pages, or when renaming URLs to something shorter and clearer.",mistakes:["Leaving capital letters, spaces or punctuation in a URL — they get encoded into ugly %20-style addresses.","Changing a slug after a page is ranking without setting up a redirect.","Stuffing a slug with keywords instead of keeping it short and descriptive."],faq:[["Hyphens or underscores in URLs?","Hyphens. Google treats hyphens as word separators and underscores as joiners, so search engines prefer hyphens."],["How long should a slug be?","As short as possible while staying clear — typically 3 to 6 words that describe the page."]]},
json:{intro:"The JSON formatter takes messy, minified or broken JSON and turns it into clean, indented, readable output — or compresses it back to one line. It validates as it formats and tells you exactly what is wrong when the JSON is invalid, which makes it a daily tool for developers.",steps:["Paste your JSON into the input box.","Press Format for indented output, or Minify for a single line.","Read the validation message, fix any error it names, and copy the output."],example:"The one-liner {name:ToolNovo,tools:98} is actually invalid — keys need quotes. Correct JSON, {'name':'ToolNovo','tools':98,'free':true} with double quotes, formats into a tidy indented block, and minifies back to a single line for production use.",use:"Use it for debugging API responses, checking config files, preparing data for documentation, and learning JSON structure.",mistakes:["Using single quotes — JSON requires double quotes around keys and strings.","Leaving a trailing comma after the last item, the most common JSON error of all.","Confusing JSON with a JavaScript object: JSON cannot contain comments, functions or undefined."],faq:[["Is my JSON sent to a server?","No. Parsing and formatting happen in your browser with JavaScript's built-in JSON parser."],["What does the error message mean?","It comes from the parser and usually points at the first place the JSON breaks its rules — fix that spot and format again."]]},
base64:{intro:"The Base64 encoder and decoder converts text to Base64 and back, safely handling accented characters and emoji. Base64 is how email attachments, data URLs, API tokens and embedded images travel through systems that only accept plain text.",steps:["Paste your text (or a Base64 string) into the input box.","Press Encode to convert to Base64, or Decode to convert back.","Copy the output and use it where you need it."],example:"'Hello from ToolNovo!' encodes to SGVsbG8gZnJvbSBUb29sTmVzdCE= — note the padding '=' at the end. Decoding that string returns the original text exactly, including punctuation.",use:"Use it for debugging API payloads, JWT headers, basic-auth headers, data URLs and email MIME content.",mistakes:["Treating Base64 as encryption — it is only an encoding. Anyone can decode it, so never use it to protect secrets.","Forgetting the padding characters (=) when copying, which makes decoding fail.","Encoding twice by accident, then wondering why one decode still looks like gibberish."],faq:[["Why does Base64 make text longer?","It represents 3 bytes of data with 4 characters, so output is about 33% bigger — the price of text-safe transport."],["Does it handle emoji and accents?","Yes. Text is converted through UTF-8 first, so café, £ signs and emoji all survive the round trip."]]},
urlenc:{intro:"The URL encoder and decoder percent-encodes text so it is safe inside a web address, and decodes encoded addresses back into readable text. Any character that has a special job in a URL — spaces, ampersands, question marks — must be encoded when it is part of your data rather than the address structure.",steps:["Paste the text or URL into the input box.","Press Encode to percent-encode it, or Decode to reverse it.","Copy the result into your link, query string or code."],example:"The search text 'coffee & tea' encodes to coffee%20%26%20tea — the space becomes %20 and the & becomes %26, so a server does not mistake it for a new parameter. A full example URL encodes every special character the same way.",use:"Use it when building links with search terms, names or messages in them, debugging tracking parameters, and cleaning up copied URLs.",mistakes:["Encoding an entire URL including its :// and slashes when you only meant to encode one value — encode values, not whole addresses, unless you are nesting a URL inside another.","Double-encoding: %2520 in output means a %20 got encoded again.","Using + for spaces in paths — + means space only in query strings, not in URL paths."],faq:[["What is the difference between encodeURI and encodeURIComponent?","encodeURIComponent also encodes characters like / ? & = that hold a URL together, so it is the safe choice for values inside a URL — and it is what this tool uses."],["Why do I see %20 everywhere in links?","%20 is an encoded space. Browsers and email clients add it automatically when a link contains spaces."]]},
hexrgb:{intro:"The Color Picker translates colour values between the HEX codes designers copy from tools, the RGB values CSS also accepts, and HSL. Type a HEX code, drag the colour picker, or enter RGB numbers — all three formats and a live swatch update together.",steps:["Enter a HEX code such as #10B981, pick a colour with the picker, or type R, G and B values.","Read the matching HEX, RGB and HSL values.","Copy the format your design tool, CSS or brand guide needs."],example:"#10B981 is rgb(16, 185, 129) and hsl(160, 84%, 39%) — a bright emerald green. Pure white is #FFFFFF / rgb(255, 255, 255), and the classic web grey #808080 is exactly halfway at rgb(128, 128, 128).",use:"Use it when moving colours between Figma, CSS, brand guidelines, email templates and presentation tools that each demand a different format.",mistakes:["Dropping the leading # in CSS HEX values.","Confusing RGB (a screen colour model) with CMYK, which is for print and needs a different conversion.","Using a 3-digit shorthand like #FFF without realising it expands to #FFFFFF."],faq:[["What does HSL add?","Hue, saturation and lightness. It is the easiest format for making a colour lighter or darker while keeping the same hue — lighten by raising the L value."],["Are HEX and RGB the same colours?","Yes — they are two notations for the same screen colours. HEX is base-16 shorthand for the three RGB numbers."]]},
uuid:{intro:"The UUID generator creates version 4 UUIDs — the near-unique 128-bit identifiers used as database keys, order references, file names and API resource IDs worldwide. They are generated with your browser's cryptographic random source, one at a time or in batches of up to 50.",steps:["Choose how many UUIDs you need (1–50).","Optionally switch to UPPERCASE.","Press Generate UUIDs and copy the batch."],example:"A typical result looks like 3f6d1c2a-9b4e-4a7d-8c1f-2e5b6a7d8c9f. The '4' at the start of the third group marks it as version 4 (random), and the odds of two generated UUIDs ever colliding are effectively zero.",use:"Use it for database primary keys, test data, idempotency keys, file naming and anywhere a label must be unique without asking a central counter.",mistakes:["Using a UUID where a short human-friendly reference is needed — customers cannot read 36 characters over the phone.","Assuming UUIDs are sequential or sortable by time — version 4 is random by design.","Generating IDs with a weak random source in your own code — always use a cryptographic generator like this one."],faq:[["What does version 4 mean?","The UUID is built almost entirely from random bits — 122 of its 128 bits are random. Other versions use timestamps or namespaces."],["Can two UUIDs ever be identical?","In practice, no. You would need to generate billions before a collision became remotely plausible."]]},
baseconv:{intro:"The number base converter translates whole numbers between binary (base 2), octal (base 8), decimal (base 10) and hexadecimal (base 16) — all four shown at once. It is the conversion programmers, electronics students and network engineers reach for when working close to the machine.",steps:["Type the number.","Tell the tool which base it is written in.","Read the same value in binary, octal, decimal and hex."],example:"Decimal 255 is 11111111 in binary, 377 in octal and FF in hexadecimal — which is why full-intensity colours in HEX end in FF. The decimal value 16 is 10000 in binary and 10 in hex.",use:"Use it for programming, subnetting and IP work, colour codes, permissions (like Unix 755, which is octal), and computer-science coursework.",mistakes:["Reading a hex letter as a typo — A to F are digits in base 16, worth 10 to 15.","Entering binary digits into the decimal box: '1010' is ten in decimal but 10 in binary means two.","Forgetting that hex FF is 255, not 1515 — each position is a power of 16."],faq:[["Why do programmers use hex?","One hex digit is exactly four binary digits, so hex is a compact way to write binary values — FF is much friendlier than 11111111."],["What base are Unix file permissions?","Octal. 755 means binary 111 101 101 — read/write/execute patterns for owner, group and others."]]},
textrev:{intro:"The text reverser flips text backwards in three ways: letter by letter, word order, or line order. It is a small tool with real uses — checking palindromes, reversing lists, unscrambling exports, and creating playful text for social posts and puzzles.",steps:["Type or paste your text.","Choose Reverse letters, Reverse words or Reverse lines.","Copy the result."],example:"'The quick brown fox' reversed by letters becomes 'xof nworb kciuq ehT'. Reversed by words it becomes 'fox brown quick The'. A three-line shopping list reversed by lines puts the last item first — handy when a form pasted your list upside down.",use:"Use it for palindrome checks, reversing chronological lists, puzzle and game content, and quick data fixes.",mistakes:["Expecting letter-reversal to handle emoji perfectly — multi-byte characters can split; it works best on plain text.","Reversing lines when you meant words — check which mode matches your data.","Pasting a huge document: the tool is instant, but make sure you copy from the result box, not the input."],faq:[["What is a palindrome?","Text that reads the same reversed, like 'racecar' or 'A man a plan a canal Panama' (ignoring spaces and case). Letter-reverse makes checking easy."],["Can it reverse a whole list?","Yes — paste one item per line and use Reverse lines."]]},
image:{intro:"The image compressor shrinks JPG, PNG and WebP photos so they load faster and take less space, while keeping them looking sharp. Crucially, it works entirely on your device — your photo is never uploaded to a server, which makes it safe for personal pictures as well as work images.",steps:["Tap the upload box or drop an image onto it.","Choose a quality level — 80% is the sweet spot for most photos.","Optionally cap the width, and pick an output format (JPEG is smallest for photos).","Press Compress image, compare the before/after sizes, and download the result."],example:"A 4.2 MB phone photo at full size, compressed at 80% quality with a 1280 px width, typically lands near 380 KB — over 90% smaller — and still looks crisp on a website or in an email.",use:"Use it before uploading images to a website, marketplace listing, email or form with a file-size limit, and to make pages load faster on mobile data.",mistakes:["Compressing an already-compressed image repeatedly — quality drops each time; always start from the original.","Using PNG for photographs — PNG is for graphics and transparency; JPEG or WebP is far smaller for photos.","Shrinking the width below where the image will be displayed, which makes it look blurry."],faq:[["Is my image uploaded to your server?","No. Compression uses your browser's built-in canvas tools on your own device. Nothing leaves your phone or computer."],["What quality should I choose?","75–85% for web photos. Go higher (90%+) for images that will be printed or edited further, lower (50–60%) for thumbnails."]]},
imageresize:{intro:"The image resizer changes an image to exact pixel dimensions — for profile pictures, marketplace listings, ad formats and website slots that demand a specific size. Like the compressor, it runs fully on your device, and it can lock the aspect ratio so your photo never comes out stretched.",steps:["Choose or drop your image — its current dimensions appear automatically.","Type the new width and height in pixels (with the lock on, one updates the other).","Choose JPEG, PNG or WebP output.","Press Resize image and download the result."],example:"A 4032 × 3024 phone photo resized with the aspect lock on and a width of 800 px becomes 800 × 600 px — perfect for a blog. A square 1080 × 1080 version is the standard for an Instagram post.",use:"Use it for social media formats, profile and cover photos, ad banners, thumbnails and any upload form that specifies exact dimensions.",mistakes:["Unlocking the aspect ratio and typing unrelated width and height — the image stretches or squashes.","Upscaling a tiny image to a huge size — it cannot invent detail and will look soft.","Forgetting platform specifics: a LinkedIn banner (1584 × 396) and a YouTube thumbnail (1280 × 720) are very different shapes."],faq:[["Does resizing reduce file size too?","Usually yes — fewer pixels means a smaller file, especially in JPEG or WebP. For maximum shrinking, use the Image Compressor as well."],["What size is a YouTube thumbnail?","1280 × 720 px (16:9). 1280 × 720 px (16:9) is the standard size YouTube itself uses for thumbnails."]]},
charcount:{intro:"The social media character counter shows, as you type, exactly how your text fits every major platform's limit — X, Instagram, TikTok, LinkedIn, Facebook, YouTube, Threads and Pinterest. Write once, then adapt per platform instead of discovering a limit after you have written the perfect caption.",steps:["Type or paste your caption, post or title.","Watch the bars: characters used, characters left, and a red warning when you go over.","Trim or expand the text until it fits the platforms you care about."],example:"A 300-character product announcement fits LinkedIn (3,000), Instagram (2,200) and Facebook easily, but it is 20 characters over the X (Twitter) limit of 280 — the counter flags it instantly so you can cut one short sentence instead of rewriting in the app.",use:"Use it when scheduling posts, writing ad copy, preparing video titles and descriptions, or adapting one message across every channel.",mistakes:["Counting characters for one platform and posting the same text everywhere unchanged.","Forgetting that links and hashtags count toward the limit too.","Writing a YouTube title to the full 100 characters — search results truncate long before that; the front half matters most."],faq:[["What is the X (Twitter) limit?","280 characters for standard posts. Premium accounts can post longer, but 280 remains the safe planning number."],["Do emojis count as one character?","On most platforms an emoji counts as 2 characters (and some count as more). This counter counts standard text characters, so leave a small margin when your post is emoji-heavy."]]},
qr:{intro:"The QR code generator turns any link or text into a scannable QR code you can download as a PNG. Restaurants, shops, event organisers and creators use QR codes on menus, flyers, packaging and business cards to take people from print to a web page in one scan.",steps:["Type or paste the link or text the code should open.","Choose a size — 300 px for screens, 500–800 px for print.","Pick an error-correction level (High for print that may get scuffed).","Generate, test-scan it with your phone, then download the PNG."],example:"Entering https://example.com/menu at 500 × 500 with High error correction produces a crisp code for a table menu that still scans even if part of the print is covered by a sticker or worn — up to about 30% damage is recoverable at that level.",use:"Use it for menus, Wi-Fi sharing, event posters, product packaging, business cards, payment links and connecting print marketing to your website.",mistakes:["Printing too small — keep printed codes at least 2 cm (about 0.8 in) wide and test at arm's length.","Low contrast: dark code on a light background scans best. Avoid reversed or colourful codes without testing.","Linking to a page that is not mobile-friendly — nearly every scan happens on a phone."],faq:[["Do QR codes expire?","No. A code generated here simply contains your text or link, so it works forever — as long as the destination link stays live."],["What size should I print?","At least 2 × 2 cm for close-up scanning, and bigger the further away the scanner will be. A poster code should be 10 cm or more."]]},
password:{intro:"The strong password generator creates random passwords on your device using cryptographic randomness — the same source operating systems trust. Nothing is sent anywhere or stored. Sixteen or more characters with a mix of types defeats the guessing and brute-force attacks that crack short, memorable passwords in seconds.",steps:["Set the length — 16 or more characters is the modern recommendation.","Tick the character types to include (all four is best).","Optionally exclude look-alike characters for passwords you must type by hand.","Generate, check the strength and entropy rating, and copy it straight into your password manager."],example:"A 16-character password using upper, lower, numbers and symbols draws from a 90+ character pool, giving about 104 bits of entropy. A supercomputer guessing a trillion passwords a second would still need longer than the age of the universe to crack it by brute force.",use:"Use it for every new account — email, banking, shopping and social media — with a unique password for each, stored in a password manager.",mistakes:["Reusing one strong password everywhere — one site breach then unlocks all your accounts.","Using personal details: names, birthdays and pets are the first things attackers try.","Shortening a generated password because a site 'probably does not need it' — length is the main defence."],faq:[["How long should a password be?","At least 16 characters for important accounts. Length matters more than clever substitutions like P@ssw0rd, which attackers predict."],["Is it safe that the password appears on screen?","It is generated locally and never transmitted. Copy it into a password manager, and avoid generating passwords on shared or public computers."]]},
dice:{intro:"The dice roller rolls up to ten polyhedral dice — d4, d6, d8, d10, d12, d20 and d100 — using cryptographic randomness, and totals them for you. It covers board games, tabletop role-playing games like Dungeons & Dragons, classroom probability and quick decisions when no physical dice are at hand.",steps:["Choose how many dice to roll (1–10).","Pick the dice type — d6 for most board games, d20 for D&D checks.","Press Roll the dice and read each die plus the total."],example:"Rolling 2d6 gives results like 4 + 5 = 9 — the classic board-game roll, where 7 is the most likely total and 2 or 12 the rarest. A 1d20 roll of 20 is a natural critical success in D&D; a 1 is a critical fail.",use:"Use it for board games, RPG sessions, probability homework, wargaming and settling who goes first.",mistakes:["Confusing '2d6' with doubling a single roll — two dice produce a bell curve centred on 7, not an even spread.","Expecting short-run fairness: ten rolls can easily show no sixes. Randomness evens out over hundreds of rolls.","Using dice rolls for anything that needs a verifiable audit trail, like a paid raffle."],faq:[["What does d20 mean?","A 20-sided die. The number after the d is the number of sides; a number before it (3d6) is how many dice to roll."],["Are the rolls fair?","Yes — each face is equally likely, drawn from your browser's cryptographic random generator."]]},
coin:{intro:"The coin flip simulator flips a fair coin as many times as you like and keeps score: heads, tails, totals and your current streak. Flip once for a decision, or ten at a time to watch the law of large numbers pull the results toward 50/50.",steps:["Press Flip once for a single toss.","Use Flip 10 times to run a quick batch.","Watch heads, tails, totals and streaks update — reset any time to start fresh."],example:"Flip 10 coins and a result like 6 heads and 4 tails is completely normal. Flip 1,000 times in batches and you will almost always land within a percent or two of 500/500 — that convergence is the law of large numbers in action.",use:"Use it for quick either/or decisions, probability lessons, game tie-breaks and settling friendly arguments about who kicks off.",mistakes:["Believing a streak changes the next flip — after five heads, the next flip is still exactly 50/50. That is the gambler's fallacy.","Judging fairness from ten flips — small samples swing wildly by chance.","Using a coin flip for a decision that actually deserves thought — it settles ties, not priorities."],faq:[["Is it exactly 50/50?","Yes, each flip is an independent cryptographic random choice with equal probability."],["What is the longest streak I might see?","In 100 flips, a streak of 6–7 identical results somewhere in the run is typical, not suspicious."]]},
stopwatch:{intro:"The stopwatch times anything to hundredths of a second, with lap timing that records each split and the running total. It runs in your browser tab, so it is always one tap away for workouts, cooking, experiments and games — no app install, no sign-up.",steps:["Press Start to begin timing.","Press Lap at each interval to record a split.","Press Stop to pause (Resume continues), and Reset to clear everything."],example:"Timing four 400 m laps, you might record splits of 1:28.40, 1:31.05, 1:30.62 and 1:27.88 — the lap list shows each split beside the total, instantly revealing that lap 2 was the slow one.",use:"Use it for training intervals, swim and run laps, science experiments, speed-cubing, cooking stages and classroom timing.",mistakes:["Leaving the tab in the background on a phone that aggressively freezes tabs — keep the tab visible for long timings.","Forgetting to record laps before resetting — reset clears the lap list too.","Trusting any stopwatch to the hundredth for official results — reaction time on the button is about ±0.2 seconds."],faq:[["How accurate is it?","It uses your device clock and displays to 0.01 seconds. The limiting factor is human reaction time, not the timer."],["Do laps show split or total?","Both — each lap row shows that lap's own time and the total elapsed time at that point."]]},
timer:{intro:"The countdown timer counts down from any duration in minutes and seconds, shows a draining progress bar, and chimes when time is up. Presets cover the classics — 1, 5 and 10 minutes, a 25-minute Pomodoro focus session, and 45 minutes — and you can set any custom length.",steps:["Enter minutes and seconds, or tap a preset.","Press Start timer and watch the countdown and progress bar.","Pause if you need to, Reset to start over — a chime and message announce the finish."],example:"Set 25:00 for a Pomodoro: work in full focus until the chime, then take a 5-minute break. Four rounds make two hours of deep work with breaks — the system behind the famous Pomodoro Technique.",use:"Use it for cooking, workouts and rest intervals, study sessions, presentations, exams practice, kids' screen time and parking reminders.",mistakes:["Closing the tab — the timer lives in the page, so keep it open (the chime needs the tab alive).","Setting seconds above 59 — roll them into minutes for a correct total.","Relying on it as your only alarm for something critical like medication — use a dedicated alarm as backup."],faq:[["Why is there no sound until I interact?","Browsers block audio until you tap something. Pressing Start counts as that interaction, so the finish chime can play."],["What is the maximum duration?","999 minutes — over 16 hours — which covers any realistic countdown."]]},
namepicker:{intro:"The random name picker draws a fair winner — or several — from a list of names, using cryptographic randomness rather than a predictable shuffle. Teachers, streamers, managers and event organisers use it for giveaways, classroom questions and team draws that everyone can trust.",steps:["Paste your names, one per line.","Choose how many winners to pick.","Optionally remove winners from the list so the same name cannot be drawn twice across rounds.","Press Pick a winner and announce the result."],example:"From a class list of 28 students, picking 1 name gives every student an equal 1-in-28 chance. Pick 3 with 'remove winners' on for a prize draw, and the list shrinks to 25 names for the next round.",use:"Use it for giveaway and raffle winners, picking who answers in class, assigning presentation order, Secret Santa draws and splitting groups fairly.",mistakes:["Leaving blank lines or duplicates in the list — a name entered twice has double the chance.","Picking more winners than there are names — the tool will stop you.","Running a paid or regulated raffle on a simple picker — prize promotions have legal rules that vary by state, province and country."],faq:[["Can the same name win twice?","Not within one draw — winners are picked without replacement. Tick 'remove winners' to exclude them from later draws too."],["Is the draw really fair?","Yes. Each pick uses crypto-grade randomness, and every name in the list has an equal chance."]]},
budgetrule:{"intro": "The 50/30/20 budget rule splits your after-tax income into three buckets: 50% for needs, 30% for wants and 20% for savings and extra debt payments. Popularised by Senator Elizabeth Warren's book All Your Worth, it is the simplest budgeting framework in wide use because it needs no app and no spreadsheet.", "steps": ["Enter your monthly take-home pay — after tax, exactly what lands in your account.", "Read the three targets: needs, wants and savings.", "Compare them with your real spending from last month's bank statement.", "Adjust one category at a time — small moves beat a total overhaul."], "example": "A nurse in Chicago taking home $4,200 a month gets targets of $2,100 for needs (rent, bills, groceries, transport), $1,260 for wants (eating out, streaming, holidays) and $840 for savings. If rent alone is $1,700, the needs bucket is tight — the rule exposes that instantly.", "use": "Use it when setting up a first budget, after a pay rise, or when money feels like it disappears without anything to show for it.", "mistakes": ["Using gross pay instead of take-home pay — the rule only works on money you actually receive.", "Counting debt minimum payments as savings — only extra payments above minimums belong in the 20%.", "Forcing 50/30/20 in a very high-rent city and giving up — a 60/25/15 split you follow beats a perfect split you abandon."], "faq": [["What counts as a need?", "Rent or mortgage, utilities, basic groceries, transport to work, insurance and minimum debt payments. Everything else is a want, however essential it feels."], ["Where do pensions fit?", "Workplace pension contributions deducted before pay are already savings — count them toward the 20% if you want the full picture."]]},
emergencyfund:{"intro": "An emergency fund is cash set aside for the shocks life reliably delivers: a lost job, a car repair, a broken boiler. Financial advisers generally recommend 3 to 6 months of essential expenses, kept separate and instantly accessible.", "steps": ["Enter your essential monthly expenses — the lean version, not your full spending.", "Choose how many months of cover you want.", "Enter what you have already saved and your monthly contribution.", "Read your target, the gap, and your finish date."], "example": "Essential expenses of $2,800 a month with a 6-month target means a $16,800 fund. With $3,000 saved and $400 a month going in, the gap of $13,800 closes in about 35 months.", "use": "Use it when you have cleared expensive debt, started a new job, gone freelance, or realised your only safety net is a credit card.", "mistakes": ["Keeping the fund in your everyday account, where it quietly gets spent.", "Investing it in stocks — the fund must be there on the worst day, not after a market recovery.", "Counting a credit limit as an emergency fund: it is borrowed money at 20%+ interest, the opposite of a safety net."], "faq": [["Where should I keep it?", "An easy-access savings account — in the US a high-yield savings account, in the UK an easy-access ISA or savings account, in Canada a HISA — separate from your daily bank."], ["How much do freelancers need?", "Usually 6–12 months, because income gaps are part of the job."]]},
debtsnowball:{"intro": "The debt snowball clears debts from smallest balance to largest, regardless of interest rate. Each cleared debt frees its payment to roll into the next one — the snowball. It costs slightly more interest than the avalanche method, but the quick wins keep people going, and a plan you finish beats a perfect plan you quit.", "steps": ["List up to three debts: balance, minimum payment and APR for each.", "Add any extra money you can put toward debt each month.", "The tool orders debts smallest-first and simulates every payment.", "Read your debt-free date and total interest."], "example": "Debts of $800 (29.99% APR, $25 minimum), $1,200 (24.99%, $35) and $3,400 (19.99%, $85), plus $150 extra a month, clear in roughly two years — the $800 card disappears in about four months, and its payment joins the attack on the next debt.", "use": "Use it when you have several cards and loans and need a clear order of attack and a finish line to aim at.", "mistakes": ["Stopping minimum payments on any debt — every debt gets its minimum, always, or fees and credit damage follow.", "Adding new spending to a card you are clearing.", "Ignoring a 0% balance-transfer window that could pause interest while you snowball."], "faq": [["Snowball or avalanche — which is better?", "Avalanche (highest APR first) is mathematically cheapest. Snowball is behaviourally strongest. Pick the one you will still be following in month six."], ["What if a payment does not cover interest?", "The tool warns you — raise the extra amount, because the balance grows otherwise."]]},
retirement:{"intro": "The retirement savings calculator projects what your workplace pension, 401(k), RRSP or personal investments could grow to by the age you stop work, assuming a steady return and monthly contributions. It is an illustration, not a forecast — but it shows the two levers that matter most: starting early and contributing consistently.", "steps": ["Enter your age now and your planned retirement age.", "Enter what you have saved so far and your monthly contribution, including any employer match.", "Enter an expected annual return — 5–7% is a common planning range for a mixed portfolio.", "Read the projected pot, what you contributed, and what growth added."], "example": "A 30-year-old with $25,000 saved, adding $500 a month at 7% until 67, contributes about $247,000 in total — but the pot reaches roughly $1.08 million. Starting the same plan at 40 instead produces roughly half as much.", "use": "Use it to set a monthly contribution, check whether you are on track, or show a younger family member why starting at 25 beats starting at 35.", "mistakes": ["Counting on a high return to rescue low contributions — contributions are the lever you control.", "Forgetting employer matching: an unclaimed match is literally declined pay.", "Ignoring inflation — a future pot buys less than the same number today; the Inflation Calculator shows how much less."], "faq": [["How much should I save?", "A common US/UK/Canadian guideline is 12–15% of gross income including employer contributions, adjusted for when you start."], ["Does this include state pensions or Social Security?", "No — it projects only your own savings pot. Government pensions are a separate income layer on top."]]},
autoloan:{"intro": "The auto loan calculator shows the full cost of financing a car: the amount financed after your down payment and trade-in, purchase tax, the monthly payment and total interest. Dealers negotiate on monthly payment because it hides the total — this tool reverses that trick.", "steps": ["Enter the vehicle price and your down payment and trade-in value.", "Enter the purchase tax rate (US state sales tax, or 0% where the price already includes UK VAT / Canadian taxes).", "Enter the APR and choose the term.", "Compare terms — watch total interest, not just the monthly figure."], "example": "A $32,000 car with 6% tax ($1,920), a $4,000 down payment and no trade-in finances $29,920. At 7.9% over 60 months that is about $604 a month and roughly $6,300 of interest — a total car cost near $40,200.", "use": "Use it before visiting a dealer, when comparing bank, credit-union and dealer finance, or when deciding how much down payment to save.", "mistakes": ["Stretching to 72 or 84 months — you risk owing more than the car is worth for years.", "Forgetting tax, registration and dealer fees in the amount financed.", "Negotiating the monthly payment instead of the total price and APR."], "faq": [["Is a bigger down payment always better?", "It cuts interest and protects against negative equity, but keep your emergency fund intact — do not drain it for a deposit."], ["What APR should I expect?", "It depends on credit score and term. US and Canadian buyers with strong credit often see 6–9% on new cars; used cars and weaker credit cost more."]]},
studentloan:{"intro": "The student loan calculator turns a borrowed total into a monthly payment, a payoff date and the true interest cost of a degree. It models a standard repayment loan like US federal and private student loans; UK income-contingent loans work differently and are explained in the notes.", "steps": ["Enter the total borrowed and the interest rate.", "Enter the repayment term in years — 10 is the US federal standard.", "Optionally add an extra monthly payment to see the saving.", "Read the payment, total interest and payoff date."], "example": "Borrowing $35,000 at 5.5% over 10 years costs about $380 a month and $10,600 in interest. Adding $75 extra a month clears it roughly two years early and saves around $1,900.", "use": "Use it before borrowing, when choosing between loan offers, or when planning extra payments after a pay rise.", "mistakes": ["Borrowing the maximum offered rather than the amount your expected salary supports.", "Ignoring interest that accrues while you study on unsubsidised loans.", "Assuming UK loans behave like this — UK Plan loans are repaid as 9% of income above a threshold and are written off after a set period."], "faq": [["How much student debt is reasonable?", "A common rule: total borrowing no more than your expected first-year salary."], ["Should I overpay or invest?", "Compare the loan rate with expected investment returns and keep an emergency fund first — the loan rate is a guaranteed saving."]]},
networth:{"intro": "Net worth is everything you own minus everything you owe. It is the single number that summarises financial progress better than income or account balances, and tracking it once or twice a year is a habit shared by wealthy households around the world.", "steps": ["List what you own: home value, cash, investments and other assets.", "List what you owe: mortgage, loans, cards and other debts.", "Read your net worth, your debt ratio and your home equity.", "Repeat every 6–12 months and track the change."], "example": "A homeowner with a $350,000 home, $18,000 cash, $42,000 invested and an $8,000 car owns $418,000. Against a $260,000 mortgage, $12,000 of loans and $3,500 of card debt, net worth is $142,500.", "use": "Use it for an annual financial check-up, before a big decision, or to stay motivated while paying off debt — the trend matters more than the level.", "mistakes": ["Valuing assets optimistically (a car is worth its sale price, not what you paid).", "Forgetting debts like tax owed, family loans or buy-now-pay-later balances.", "Comparing your number with someone at a different life stage — compare only with your past self."], "faq": [["Is a negative net worth bad?", "It is common early in a career with student loans. What matters is that it rises steadily year after year."], ["Should I include my pension?", "Yes — workplace pensions and retirement accounts are real assets you own."]]},
freelancerate:{"intro": "The freelance hourly rate calculator works backwards from the salary you want to the rate you must charge — accounting for holidays, non-billable hours, business expenses and tax. It exists because the classic beginner mistake, charging your old hourly wage, quietly cuts your income by a third.", "steps": ["Enter the personal income you want to earn in a year.", "Set weeks off, working hours and the share of hours that are actually billable.", "Add yearly business expenses and a tax and pension reserve percentage.", "Read your minimum hourly and day rates."], "example": "To take home the equivalent of an $80,000 salary with 4 weeks off, 40-hour weeks, 70% billable time (1,344 hours), $6,000 of expenses and a 22% tax reserve, you must bill about $110,000 — roughly $82 an hour or $656 a day.", "use": "Use it when setting or raising rates, quoting a project, or comparing a contract offer with a salaried job.", "mistakes": ["Pricing on 2,080 hours — nobody bills every hour; paperwork, marketing and gaps are real.", "Forgetting expenses: software, insurance, equipment and accounting typically run 5–15% of revenue.", "Never raising rates — long-term clients should see regular, small increases."], "faq": [["What billable percentage is realistic?", "60–75% for most solo freelancers. If you are above 80% sustainably, your rate is probably too low."], ["Should I quote hourly or per project?", "Hourly protects you on open-ended work; project pricing rewards speed. Many freelancers price projects using their hourly rate as the floor."]]},
overtimepay:{"intro": "The overtime pay calculator adds regular and overtime earnings at time-and-a-half or double time, and shows your true effective hourly rate. Overtime rules differ — US federal law sets 1.5× after 40 weekly hours for most non-exempt staff, while UK and Canadian entitlements come from contracts and provincial law.", "steps": ["Enter your base hourly rate.", "Enter regular hours and overtime hours per week.", "Choose the overtime multiplier from your contract or law.", "Read weekly pay, effective rate and the monthly equivalent."], "example": "At $22 an hour with 40 regular hours and 6 overtime hours at 1.5×, weekly pay is $880 + $198 = $1,078 — an effective rate of $23.43 an hour, and about $4,671 a month if worked every week.", "use": "Use it to check a payslip, compare job offers with different overtime patterns, or budget around seasonal overtime.", "mistakes": ["Assuming overtime is taxed at a special higher rate — it is taxed as normal income; a big week can just push withholding up temporarily.", "Counting overtime you are not guaranteed when budgeting fixed costs.", "Forgetting salaried-exempt status: many salaried roles have no overtime entitlement at all."], "faq": [["Is overtime mandatory in the UK?", "Only if your contract says so, and total pay must still average at least the National Minimum Wage for hours worked."], ["How is overtime taxed in the US?", "At your normal marginal rate. Recent US rules have changed deductions for some overtime — check current IRS guidance for your situation."]]},
paint:{"intro": "The paint calculator converts a room's dimensions into the gallons or litres you actually need to buy, subtracting doors and windows and multiplying by coats. It ends the two classic DIY disasters: running out mid-wall, and owning three leftover tins for a decade.", "steps": ["Measure the room's length, width and wall height in feet.", "Enter doors and windows — the tool subtracts standard sizes.", "Set the number of coats (two is standard for a colour change).", "Optionally add the ceiling, then read gallons, litres and cans to buy."], "example": "A 12 × 10 ft room with 8 ft walls has 352 sq ft of wall. Minus one door and two windows (51 sq ft) leaves about 301 sq ft; two coats is 602 sq ft of coverage — about 1.72 gallons, so buy 2 gallons (about 6.5 litres).", "use": "Use it before any decorating project, for landlord refreshes between tenants, or to price paint for a whole flat or house room by room.", "mistakes": ["Buying for one coat when the colour change needs two — dark to light can need a primer plus two coats.", "Forgetting the ceiling and doors themselves if you plan to paint them.", "Mixing US gallons (3.785 L) with UK buying habits — UK and Canadian paint is sold in litres, so check the litres figure."], "faq": [["How much does a gallon cover?", "About 350 sq ft per coat on smooth, primed walls; rough or porous surfaces cover less."], ["Should I buy extra?", "About 10% extra, from the same batch — colour varies slightly between batches, and touch-ups are guaranteed."]]},
tile:{"intro": "The tile and flooring calculator works out how many tiles (and boxes) a floor or wall needs, including the wastage allowance every professional adds for cuts and breakages. It works for kitchen splashbacks, bathrooms and whole floors in imperial measurements.", "steps": ["Measure the area's length and width in feet.", "Pick the tile size and how many tiles come in a box.", "Set the wastage allowance — 10% straight, 15% diagonal.", "Read tiles needed and boxes to buy."], "example": "A 12 × 10 ft bathroom floor is 120 sq ft. With 12 × 12 in tiles (1 sq ft each) and 10% wastage, you need 132 tiles — 14 boxes of 10, with spares left for repairs.", "use": "Use it when ordering tiles or flooring packs, budgeting a renovation, or checking a contractor's quantities.", "mistakes": ["Ordering the exact area with no wastage — the first broken corner tile stops the job.", "Ignoring tile direction: diagonal and herringbone layouts genuinely waste more.", "Not keeping spare tiles from the same batch — dye lots differ and a repair years later may not match."], "faq": [["How many tiles are in a box?", "It varies by tile — check the box coverage in sq ft or m² on the packaging and enter tiles per box here."], ["Does grout spacing change the count?", "Slightly — wide joints reduce coverage per tile by a few percent, which the wastage allowance normally absorbs."]]},
weddingbudget:{"intro": "The wedding budget planner splits a total wedding budget across the categories real weddings spend on — venue, catering, photography, attire and the rest — using typical spending proportions, and shows the all-important cost per guest.", "steps": ["Enter your total budget honestly — the number you can afford, not the number you hope for.", "Enter your guest count.", "Read the category split and cost per guest.", "Move money deliberately: cut one category to fund a priority, keeping the total fixed."], "example": "A $25,000 wedding for 120 guests is about $208 per guest. The typical split gives catering and drinks $7,000 (28%), the venue $4,500 (18%), photography and video $3,000 (12%) and a $2,500 buffer for everything forgotten.", "use": "Use it at the start of planning, before booking anything, and revisit it whenever a quote arrives above its category line.", "mistakes": ["Booking the venue before setting the budget — it locks the date, style and half the costs.", "Forgetting the buffer: forgotten items (licences, alterations, tips, postage) reliably eat about 10%.", "Letting the guest list grow after catering is priced — every guest is a full per-head cost."], "faq": [["What is the average wedding cost?", "Recent surveys put it near $30,000 in the US, £20,000 in the UK and CAD $30,000 in Canada — but averages are skewed by luxury weddings; your budget is the right number."], ["Where can we save most?", "Guest count, day of week and season. A Friday or winter wedding for 80 costs a fraction of a Saturday summer wedding for 150."]]},
movingcost:{"intro": "The moving cost estimator gives a realistic price range for a house move based on home size, distance and service level — from a DIY truck to a full packing service. Moving is one of life's most under-budgeted events; this replaces a guess with a range.", "steps": ["Choose your home size and enter the distance in miles.", "Pick the service level: DIY truck, professional movers, or full service.", "Read the mid estimate and the low–high range.", "Use the range to compare at least three written quotes."], "example": "A 1-bedroom move of 450 miles with professional movers estimates around $1,600, within a range of roughly $1,275–$2,000. The same move with a DIY truck drops to around $600–700 plus your fuel, time and lifting.", "use": "Use it when budgeting a relocation, deciding between DIY and movers, or negotiating a job relocation package.", "mistakes": ["Booking the cheapest quote without checking insurance, reviews and what is excluded.", "Forgetting supplies, tips, cleaning, storage gaps and overlap rent or mortgage days.", "Moving on a summer weekend or month-end — the most expensive slots in all three countries."], "faq": [["How far ahead should I book?", "4–8 weeks for movers in peak season; DIY trucks 2–4 weeks."], ["Are estimates binding?", "Only a written, in-home or video-survey quote is close to binding. Phone estimates based on your description often rise on the day."]]},
sleepcycle:{"intro": "The sleep cycle calculator works backwards from your wake-up time (or forwards from bedtime) in 90-minute sleep cycles. Waking at the end of a cycle, rather than mid-deep-sleep, is why the same hours of sleep can feel completely different.", "steps": ["Enter the time you must wake up.", "Read the bedtimes for 6, 5 and 4 complete cycles, including 14 minutes to fall asleep.", "Or enter your bedtime and see the best wake times.", "Pick the latest bedtime that still gives you at least 5 cycles most nights."], "example": "For a 7:00 AM alarm: 6 cycles means bed at 9:46 PM, 5 cycles means 11:16 PM, and 4 cycles means 12:46 AM. Most people do best on the 11:16 PM option — a realistic 7.5 hours.", "use": "Use it when fixing a sleep schedule, adjusting for early shifts or flights, or explaining a teenager's grogginess with science instead of blame.", "mistakes": ["Sacrificing sleep to hit a perfect cycle — total sleep matters more than cycle timing.", "Counting from when you get into bed rather than when you fall asleep.", "Expecting one good night to fix a sleep debt — consistency over a week is what works."], "faq": [["Is a sleep cycle exactly 90 minutes?", "It averages about 90 minutes but ranges 80–120 between people and across the night. Treat the times as guidance, not precision."], ["Are naps good or bad?", "A 20-minute nap avoids deep sleep and refreshes; a 90-minute nap completes a cycle. The groggy 45-minute nap is the one to avoid."]]},
macrocalc:{"intro": "The macro calculator splits your daily calorie target into protein, carbohydrate and fat grams for your chosen eating style — balanced, high-protein, low-carb or keto. It is the natural second step after the Calorie Calculator: calories set the total, macros decide what the total is made of.", "steps": ["Enter your daily calorie target.", "Choose a diet style — the percentages update the split.", "Enter your body weight to check protein per pound.", "Build meals to the gram targets, prioritising the protein number first."], "example": "At 2,200 kcal on the balanced split (30/40/30), targets are 165 g protein, 220 g carbs and 73 g fat. For a 180 lb person that protein figure is 0.92 g per lb — right in the muscle-building range.", "use": "Use it when starting a diet, planning meal prep, or troubleshooting a plateau where calories are right but protein is low.", "mistakes": ["Hitting calories but missing protein badly — protein protects muscle in a deficit and controls hunger.", "Treating keto percentages as a starting point for beginners — most people do better on balanced or high-protein first.", "Tracking perfectly for three days then not at all — a rough average over a week beats perfection and collapse."], "faq": [["How much protein do I really need?", "About 0.7–1 g per lb of body weight for active people and muscle goals; around 0.36 g per lb is the minimum for sedentary adults."], ["Do I need to hit all three numbers exactly?", "Protein matters most, calories second. Carbs and fat can flex against each other within your calorie total."]]},
ovulation:{"intro": "The ovulation calculator estimates your ovulation day and fertile window from the first day of your last period and your usual cycle length. Ovulation typically happens about 14 days before the next period — which is why cycle length, not a fixed day 14, drives the estimate.", "steps": ["Enter the first day of your last period.", "Enter your average cycle length if it is not 28 days.", "Read your ovulation estimate, the 6-day fertile window and your next expected period.", "For trying to conceive, focus on the two days before ovulation and the day itself."], "example": "With a last period starting 1 November and a 30-day cycle, ovulation is estimated around 17 November, the fertile window runs about 12–18 November, and the next period is expected around 1 December.", "use": "Use it for family planning, understanding your cycle, or timing conversations with your clinician.", "mistakes": ["Using a calendar estimate as contraception — cycles vary and this method is not reliable for preventing pregnancy.", "Assuming ovulation is always day 14 — that is only true for a textbook 28-day cycle.", "Ignoring irregular cycles: if yours vary by more than about a week, ovulation tests or clinical advice beat any calculator."], "faq": [["What is the fertile window?", "About 6 days: sperm can survive up to 5 days, and the egg lives about 24 hours after ovulation."], ["Can stress delay ovulation?", "Yes — illness, travel and stress can shift ovulation, which shifts the whole cycle."]]},
engagementrate:{"intro": "The engagement rate calculator divides engagements per post by followers to produce the percentage that sponsors, brands and agencies use to judge an account's real influence. Follower counts can be bought; engagement is much harder to fake, which is why this number decides deals on Instagram, TikTok, X and YouTube.", "steps": ["Enter your follower or subscriber count.", "Enter total likes, comments and shares/saves across a set of posts.", "Enter how many posts those totals cover.", "Read your rate and its rating, from low to excellent."], "example": "An account with 12,500 followers averaging 850 likes, 64 comments and 38 shares per post has 952 engagements per post — a 7.62% engagement rate, which is excellent and well above the typical 1–3%.", "use": "Use it to price sponsorships, audit your own content, compare creators before a campaign, or track whether a content change actually worked.", "mistakes": ["Judging by one viral post — average at least 10 recent posts.", "Counting only likes: comments, shares and saves signal far more to brands and algorithms.", "Comparing rates across platforms directly — TikTok, Instagram and X have very different norms."], "faq": [["What is a good engagement rate?", "On Instagram, 1–3% is typical, 3–6% is good and above 6% is excellent. Smaller accounts naturally score higher."], ["Do brands prefer small accounts?", "Often, yes — micro-creators (10k–100k) usually deliver higher engagement and trust per dollar than celebrities."]]},
ytearnings:{"intro": "The YouTube earnings estimator converts monthly views into a realistic income range using RPM — the amount a creator actually keeps per 1,000 views after YouTube's share — for your niche. Finance channels can earn ten times what gaming channels earn from identical views, because advertisers pay for the audience, not the view.", "steps": ["Enter your channel's monthly views (YouTube Studio shows this).", "Choose the niche closest to your content.", "Read the monthly and yearly ranges in USD, with approximate GBP and CAD conversions.", "Treat the range as planning data, not a promise — then work on the levers: niche, viewer geography and video length."], "example": "A tech channel with 500,000 monthly views at an RPM of $5–$12 earns roughly $2,500–$6,000 a month. The same views on a finance channel at $12–$30 RPM would be $6,000–$15,000.", "use": "Use it when planning a channel, pricing a sponsorship against ad revenue, or deciding whether a niche can support going full-time.", "mistakes": ["Using CPM instead of RPM — CPM is what advertisers pay; you keep roughly 55% of it, which is the RPM.", "Assuming every view is monetised — ad blockers, non-monetised regions and short videos reduce real earnings.", "Ignoring seasonality: December RPM can be double January's."], "faq": [["What RPM do US and UK viewers give?", "The highest in the world — channels with mostly US/UK viewers sit at the top of every niche range."], ["How many views do I need to earn $1,000 a month?", "At a $5 RPM, about 200,000 monthly views. At a $20 finance RPM, about 50,000."]]},
hashtaggen:{"intro": "The hashtag generator builds a copy-ready set of hashtags from your topic words plus a curated bank for your category — fitness, food, travel, business or general. Good hashtags mix one or two large discovery tags with specific niche tags a real community actually follows.", "steps": ["Type your topic words, for example 'home workout'.", "Choose the closest category.", "Copy the generated set and paste it into your caption or first comment.", "Swap out the least relevant tags — relevance beats quantity."], "example": "Topic 'home workout' in Fitness generates #homeworkout, #home and #workout plus fitness bank tags like #fitfam, #training and #fitnessjourney — a 19-tag set you can trim to your best 5–10.", "use": "Use it for Instagram posts and Reels, TikTok videos, and any platform where discovery runs on topics rather than followers.", "mistakes": ["Pasting all 30 tags on every post — platforms reward relevance, and identical blocks look automated.", "Using only giant tags like #love, where your post drowns in seconds.", "Using banned or broken tags — check a tag's page opens before relying on it."], "faq": [["How many hashtags should I use?", "Instagram's own guidance leans to 3–5 highly relevant tags; TikTok works well with 3–6. This tool gives you a menu to choose from, not a quota."], ["Caption or first comment?", "Reach is the same either way on Instagram. Use the caption for TikTok, where text is searchable."]]},
readingtime:{"intro": "The reading and speaking time calculator converts a word count into the three timings that matter: silent reading at about 200 words per minute, reading aloud at 130, and presenting with pauses at about 110. It is built for speeches, video scripts, lessons, sermons and podcast segments.", "steps": ["Paste your speech, script or article into the box.", "Read the speaking time as the headline figure.", "Check the presenting-with-pauses time for live delivery — it is the honest one.", "Trim or pad the text until it fits your slot."], "example": "A 1,300-word script reads silently in about 6.5 minutes, aloud in 10 minutes, and presents live in roughly 12 minutes with pauses. That is why a '10-minute talk' needs about 1,100–1,300 words, not the 2,000 most people draft.", "use": "Use it for wedding speeches, conference talks, YouTube scripts, classroom lessons, podcast planning and timing an audiobook chapter.", "mistakes": ["Timing a speech by silent reading — you will overrun by about a third on the day.", "Writing to the exact minute with no buffer for laughter, applause or a slow start.", "Forgetting that presenting slides, demos or videos eats speaking time too."], "faq": [["How many words is a 5-minute speech?", "About 650 words aloud, or roughly 550 if you present with natural pauses."], ["Why do presenters speak slower?", "Pauses, emphasis, audience reaction and finding your place all consume time — the 110 wpm figure accounts for them."]]},
evcharging:{"intro": "The EV charging cost calculator prices home charging properly: the cost of one charge between two battery percentages, the cost per mile, and the monthly and yearly totals for your mileage. For most drivers it reveals home charging costs a third to a quarter of public charging — and a fraction of petrol or gasoline.", "steps": ["Enter your battery size in kWh and your electricity price per kWh.", "Set the charge window, typically 20% to 80% for daily battery care.", "Enter your monthly miles and the car's efficiency in miles per kWh.", "Read the per-charge, per-mile and monthly costs."], "example": "A 60 kWh car charged from 20% to 80% adds 36 kWh. At $0.16/kWh that is $5.76 a charge. Driving 900 miles a month at 3.5 miles per kWh uses about 257 kWh — roughly $41 a month, or $494 a year.", "use": "Use it when comparing an EV with your current car, choosing an electricity tariff, or checking what a home charger will really cost to run.", "mistakes": ["Pricing everything at public rapid-charger rates — home charging is the economic case for an EV.", "Charging to 100% daily, which most manufacturers advise against for battery longevity (80–90% is typical guidance).", "Forgetting time-of-use tariffs: overnight rates in the UK, US and Canada can cut these costs in half."], "faq": [["What does a full charge cost in the UK?", "A 60 kWh battery at the ~£0.25/kWh price cap is about £15 from empty — and around £4–5 on an overnight EV tariff."], ["How does it compare with petrol?", "At typical prices, home-charged EVs run at roughly a quarter of the per-mile fuel cost of a 35 mpg petrol car."]]},
kwdensity:{"intro": "The keyword density checker counts how often a target word or phrase appears in a page's text and expresses it as a percentage of total words. Density is a diagnostic, not a target: it catches accidental stuffing and pages that never actually mention their topic, both of which are common on real business websites.", "steps": ["Paste the full text of your page or article.", "Enter the keyword or phrase exactly as readers would search it.", "Read the occurrences, total words and density percentage.", "Check the verdict — then edit for the reader, not the number."], "example": "In a 1,200-word guide, the phrase 'coffee shops in New York' appearing 6 times gives a density of 6 × 4 ÷ 1,200 = 2.0% — at the top of the healthy range, worth a read-through to check it still sounds natural.", "use": "Use it when auditing old content, checking a freelancer's draft, or investigating why a page reads awkwardly despite 'good SEO'.", "mistakes": ["Chasing a percentage a blog post recommended — no density target exists in Google's guidance.", "Counting a long phrase as one word — density multiplies by the words in the phrase, which this tool does correctly.", "Stuffing the keyword into every heading, which reads terribly and helps nothing."], "faq": [["What density is best?", "For a main keyword, roughly 0.5–2.5% usually reflects natural writing. Judge by reading aloud, not by the number."], ["Does Google penalise high density?", "Keyword stuffing is a spam policy violation, but ordinary pages are far more often guilty of never mentioning their topic clearly."]]},
metagen:{"intro": "The meta tag generator builds the complete set of tags a modern page needs — title, description, canonical, Open Graph for Facebook and LinkedIn, and Twitter Cards — from a few fields, formatted and escaped correctly so you can paste them straight into your page head.", "steps": ["Enter your page title and meta description.", "Add the canonical URL and the social image URL (1200 × 630 px works best).", "Optionally add keywords — minor today, but harmless.", "Copy the generated block into the <head> of your page."], "example": "For a guide titled 'Best Coffee Shops in New York | Guide', the tool produces matching og:title and twitter:title tags, a summary_large_image card, and a canonical link — the full set social platforms and search engines read, in about ten seconds.", "use": "Use it when launching pages, fixing shares that show the wrong image or title, or standardising tags across a site.", "mistakes": ["Leaving og:image relative (image.jpg instead of the full https URL) — social platforms require absolute URLs.", "Writing one description and reusing it on every page — duplicates are ignored and waste the space.", "Forgetting the canonical after generating everything else, especially on pages reachable by several URLs."], "faq": [["Are meta keywords still used?", "Google ignores them and has since 2009. They are optional in the output; the title, description and social tags do the real work."], ["What size should the social image be?", "1200 × 630 px is the safe standard for Facebook, X and LinkedIn."]]},
serppreview:{"intro": "The Google SERP preview shows your page exactly as searchers will meet it — site name and breadcrumb URL, the blue title link, and the description snippet — alongside live character counts. It exists because a result that reads well in your CMS can look truncated, vague or misleading in the results that actually decide clicks.", "steps": ["Type your title tag and watch the preview update.", "Enter the page URL — it renders as Google's breadcrumb format.", "Write the description to complete the promise the title makes.", "Trim anything the counts flag as over-length, then publish."], "example": "A title of 'Best Coffee Shops in New York — 2026 Guide' (42 characters) displays in full, while a 78-character version loses its ending to an ellipsis — usually the part with the year or benefit that earns the click.", "use": "Use it for every important page: homepages, product pages, guides and anything competing for clicks in search results.", "mistakes": ["Writing the title for keywords only — the preview reveals how robotic it reads to a human.", "Letting the description repeat the title instead of adding new reasons to click.", "Forgetting mobile: phone results truncate sooner, so front-load the important words."], "faq": [["Does Google always show my description?", "No — Google frequently rewrites snippets from page content. Clear, accurate descriptions matching the page are rewritten least."], ["How long can a title be?", "About 50–60 characters usually display fully on desktop; pixel width is the real limit, which the SEO Title Checker measures."]]},
robotsgen:{"intro": "The robots.txt generator creates the small file at your domain root that tells search engine crawlers which areas they may fetch. A correct file protects private and checkout areas and points crawlers to your sitemap; a wrong one can remove your entire site from Google, which has happened to real businesses in all three of our countries.", "steps": ["Choose whether all bots may crawl everything or nothing.", "Set a specific rule for Googlebot if it should differ.", "List paths to block, one per line, such as /account/ or /checkout/.", "Add your sitemap URL, copy the file, and upload it as robots.txt at your domain root."], "example": "A shop's file might allow everything except /account/, /checkout/ and /search/, then close with 'Sitemap: https://example.com/sitemap.xml' — four lines that keep crawlers out of private areas and guide them to every public page.", "use": "Use it when launching a site, after a redesign, or when private or duplicate areas are appearing in search results.", "mistakes": ["Disallowing everything during development and forgetting to remove it at launch — the classic disaster.", "Thinking robots.txt hides a page from the index: blocked pages can still be indexed without content if linked. Use noindex or passwords for secrecy.", "Blocking CSS or JavaScript files, which prevents Google rendering the page properly."], "faq": [["Where does robots.txt go?", "At the root of the domain: https://example.com/robots.txt — not in a folder."], ["Can I stop AI crawlers?", "You can name specific AI user-agents with Disallow rules the same way; compliance is voluntary but the major crawlers honour it."]]},
sitemapgen:{"intro": "The XML sitemap generator converts a plain list of URLs into a standards-compliant sitemap.xml, complete with last-modified dates, change frequency and priority, ready to upload and submit to Google Search Console and Bing Webmaster Tools.", "steps": ["Paste your page URLs, one per line, as full https addresses.", "Choose a change frequency and priority that honestly reflect the pages.", "Copy the generated XML and save it as sitemap.xml.", "Upload it to your domain root and submit its URL in Search Console."], "example": "Three URLs — a homepage, about page and contact page — become a valid urlset document in seconds, each stamped with today's date, weekly change frequency and 0.8 priority.", "use": "Use it for small and medium sites without a CMS generating one automatically, after adding pages, or to rebuild a broken sitemap.", "mistakes": ["Including redirected, non-200 or noindex URLs — a sitemap should list only final, indexable pages.", "Listing http and https or www and non-www versions of the same page.", "Setting every page to priority 1.0 and daily changes — engines ignore signals that are clearly inflated."], "faq": [["How big can a sitemap be?", "50,000 URLs or 50 MB uncompressed per file. Larger sites use a sitemap index of multiple files."], ["Does a sitemap guarantee indexing?", "No — it helps discovery. Indexing still depends on quality, links and crawl budget."]]},
schemagen:{"intro": "The schema markup generator produces valid JSON-LD structured data for five high-value types — Local Business, FAQ, Article, Product and Website — the code that qualifies pages for rich results like star ratings, FAQ dropdowns and business panels in Google.", "steps": ["Choose the schema type that matches the page.", "Fill in the fields — name, URL, description and the type-specific extra.", "Copy the generated script block.", "Paste it before the closing </body> tag (or in the head) and test it in Google's Rich Results Test."], "example": "A Brooklyn coffee shop's Local Business block — name, URL, description and phone in valid JSON-LD — is exactly what Google reads to build its local listing panel and map knowledge cards.", "use": "Use it on business homepages, FAQ pages, articles and product pages that currently show plain blue-link results.", "mistakes": ["Marking up content that is not visible on the page — a guidelines violation that can earn a manual penalty.", "Adding review stars schema to your own business's homepage, which Google explicitly disallows for Local Business self-reviews.", "Generating the code and never validating it — one missing comma breaks the whole block."], "faq": [["Does schema guarantee rich results?", "No. It makes you eligible; Google decides based on quality and context."], ["JSON-LD or microdata?", "JSON-LD, which this tool generates — it is Google's recommended format and the easiest to maintain."]]},
utmbuilder:{"intro": "The UTM campaign builder appends properly formatted tracking parameters to any link, so Google Analytics and other analytics tools attribute visits and sales to the right source, medium and campaign instead of a useless 'direct / none'.", "steps": ["Paste the destination URL.", "Enter source (where: facebook, google, newsletter), medium (how: social, cpc, email) and campaign name.", "Add term or content only if you need them — for paid keywords or A/B creative variants.", "Copy the tagged link and use it everywhere that campaign runs."], "example": "A spring sale link becomes https://example.com/spring-sale?utm_source=facebook&utm_medium=social&utm_campaign=spring_sale — instantly recognisable in Analytics reports next to the untagged traffic.", "use": "Use it for social posts, email campaigns, paid ads, influencer links, QR codes and podcast show notes.", "mistakes": ["Tagging internal links on your own site — it resets the session and corrupts attribution. UTMs are for inbound links only.", "Inconsistent naming: 'Facebook', 'facebook' and 'FB' become three sources. Pick a convention and keep it.", "Using spaces instead of underscores or hyphens, which break or uglify links."], "faq": [["Which parameters are required?", "utm_source, utm_medium and utm_campaign are the standard trio. Term and content are optional."], ["Do UTMs affect SEO?", "No — they are analytics parameters. Use canonical tags correctly and they cause no duplicate-content issues."]]},
readability:{"intro": "The readability checker scores text with the Flesch Reading Ease scale and the Flesch–Kincaid grade level — the two measures behind the reading-age estimates used by government websites, health services and plain-language teams.", "steps": ["Paste at least 100 words for a stable score.", "Read the Reading Ease score out of 100 and the US grade level.", "Check average sentence length — long sentences are the usual culprit.", "Shorten sentences, swap complex words for simple ones, and re-check."], "example": "A government-style paragraph at grade 7 and a score of 72 is readable by most 12-year-olds. The same content written at grade 13 and a score of 38 quietly excludes a large share of adults — including many fluent, busy ones.", "use": "Use it for web pages, help content, health information, application instructions and anything the public must understand the first time.", "mistakes": ["Writing to the score mechanically — chopping every sentence into fragments reads worse, not better.", "Testing a tiny sample: under 100 words, one long sentence swings the score wildly.", "Assuming a high score means good writing — clarity is necessary, not sufficient."], "faq": [["What score should a website aim for?", "Reading Ease 60–80, roughly grade 6–8, for general audiences, following standard public-sector plain-language guidance."], ["How are syllables counted?", "By vowel groups in each word, with common silent-e adjustments — an estimate close to the standard test implementations."]]},
headinganalyzer:{"intro": "The heading structure analyzer extracts the H1–H6 outline from pasted HTML or Markdown and flags the structural problems that confuse both readers and search engines: missing or multiple H1s and skipped heading levels.", "steps": ["Paste your page HTML (or Markdown with # headings).", "Read the indented outline — it should read like a table of contents.", "Check the H1 count and skipped-level warnings.", "Fix the structure in your CMS, then re-check."], "example": "A guide with H1 'Best Coffee Shops in New York', H2s for Brooklyn and Manhattan, and an H3 under Brooklyn has a clean outline. The same page jumping from H1 straight to H4 for the boroughs shows a skipped-level warning.", "use": "Use it during content audits, redesigns, accessibility reviews and before publishing long guides.", "mistakes": ["Choosing heading levels for font size — use CSS for looks; headings are structure, and screen readers navigate by them.", "Writing headings as full sentences stuffed with keywords instead of clear section labels.", "Having no H1, or using the site logo as the only H1 on every page."], "faq": [["Can a page have more than one H1?", "Technically HTML5 allows it, but one clear H1 per page remains the safest practice for SEO and accessibility."], ["Does heading order affect rankings?", "Indirectly — a logical outline helps engines understand sections and helps you win featured snippets and AI answers."]]},
textsimilarity:{"intro": "The text similarity checker compares two passages and scores how alike they are, combining unique-word overlap with two-word phrase overlap so that reordered or lightly edited copies still score high. It is a practical duplicate-content check for writers and site owners.", "steps": ["Paste the first text into Text A.", "Paste the second into Text B.", "Read the overall similarity and the word/phrase breakdown.", "Above roughly 50%, rewrite one version properly rather than spinning words."], "example": "Two product descriptions sharing most phrases score around 70–80% even with sentences swapped — the bigram check catches the shared phrases that a simple word count would miss.", "use": "Use it to check a freelancer's 'unique' content, compare your page with a competitor's, or audit location pages that were templated from one original.", "mistakes": ["Assuming a low score means original ideas — it measures wording, not thought.", "Publishing location pages that differ only in the city name; similarity tools and Google both see through it.", "Checking tiny texts — under about 30 words, scores swing wildly."], "faq": [["What similarity is acceptable?", "Under about 25% is normal overlap for two texts on the same topic. Boilerplate like addresses inflates scores legitimately."], ["Is this how Google detects duplicates?", "Google uses far more sophisticated fingerprinting, but the principle — shared phrases at scale — is the same."]]},
seochecker:{"intro": "The SEO title and description checker measures your title tag and meta description the way Google does — in pixels as well as characters — because a 60-character title in wide letters truncates while a 65-character title in narrow letters fits. It uses your browser's text measurement to estimate rendered width.", "steps": ["Type your title tag and read its character and pixel verdict.", "Type your meta description and check it against the ~920 px desktop guide.", "Fix 'too long' first — truncation cuts the words that earn clicks.", "Recheck after every edit; the verdicts update live."], "example": "'WWWW' is far wider than 'iiii' — a title like 'WOW: Wide World of Widgets Weekly' can hit the pixel limit at 45 characters, while a narrow-letter title fits at 65. Character counts alone miss this entirely.", "use": "Use it alongside the SERP Preview before publishing any page that matters, especially homepages and money pages.", "mistakes": ["Optimising to desktop only — mobile truncates earlier, so keep the essential words at the front.", "Filling leftover space with the brand name repeated, instead of a benefit or keyword.", "Writing descriptions over about 160 characters because 'some of it shows' — the cut point moves, and the end is usually the call to action."], "faq": [["What are the pixel limits?", "Roughly 580 px for titles and about 920 px for descriptions on desktop Google. They vary slightly by device and are estimates here."], ["Should every title include my brand?", "Usually at the end, separated by a dash or pipe — helpful for recognition, wasteful at the front."]]},
ogpreview:{"intro": "The social share preview shows how a link will actually look when shared on Facebook, X and LinkedIn — image, title, description and domain — using the Open Graph values you enter. Shares are earned in the feed, and a missing image or a truncated title silently halves clicks.", "steps": ["Enter the page title, description and URL as your Open Graph tags will serve them.", "Paste the social image URL — 1200 × 630 px is the standard.", "Compare the three platform cards and fix anything cut off, blurry or vague.", "Set the matching tags with the Meta Tag Generator, then re-share to refresh platform caches."], "example": "A guide shared with a clear 1200 × 630 image and the title 'Best Coffee Shops in New York' shows as a large, tappable card on all three platforms. The same link without an image collapses to a small grey thumbnail that most people scroll past.", "use": "Use it before launching content you intend to promote, after fixing wrong share images, and when auditing evergreen posts.", "mistakes": ["Judging by the image alone — on X and LinkedIn the title does most of the work and truncates fast.", "Linking an image that is huge (slow) or tiny (blurry); keep it under about 1 MB at 1200 × 630.", "Forgetting that platforms cache: after fixing tags, use each platform's debugger or a fresh share to pull the new version."], "faq": [["Why does my share show old information?", "Platforms cache Open Graph data. Facebook and LinkedIn offer sharing debuggers to force a refresh; X usually updates within days."], ["What if I have no image?", "Create a simple branded 1200 × 630 graphic with the title text — it outperforms a generic stock photo."]]},
energycost:{"intro": "The appliance energy cost calculator turns a wattage label and your electricity price into the numbers that matter: what a device costs per day, month and year. With energy prices a top household worry, it finds the appliances quietly inflating your bill.", "steps": ["Find the wattage on the appliance label, plug or manual (or use typical values: fridge ~150W, washing machine ~500W per cycle hour, electric heater 1,500–2,000W, gaming PC 300–500W).", "Enter hours used per day.", "Enter your electricity price per kWh from your latest bill.", "Read the daily, monthly and yearly costs and hunt the surprises."], "example": "A 2,000W space heater used 4 hours a day at $0.16/kWh uses 8 kWh daily — $1.28 a day, $38 a month, $467 a year. The fridge next to it, running all day at 150W, costs about a third as much.", "use": "Use it when a bill spikes, before buying a heater, hot tub, tumble dryer or mining/gaming rig, or when comparing appliance running costs in a shop.", "mistakes": ["Using the maximum wattage for cycling appliances — fridges and air conditioners switch on and off, so real use is often 40–60% of the label.", "Forgetting standby: TVs, consoles and chargers sipping 5–10W all year still add up to real money.", "Using a headline price per kWh that excludes delivery charges and taxes — use the all-in rate from your bill."], "faq": [["Where do I find my price per kWh?", "Divide a bill's total electricity charge by kWh used, or find the unit rate line: US bills vary by state, the UK price cap is around 25p, and Canadian rates vary by province."], ["What uses the most electricity in a home?", "Heating and cooling first, then water heating, tumble dryers, ovens and hot tubs — anything that makes heat."]]},
solarsavings:{"intro": "The solar panel savings estimator projects how much electricity a rooftop system will generate in your climate, what that power is worth at your electricity price, and how many years until the system pays for itself. It is a screening estimate, clearly labelled as such — real quotes depend on your roof.", "steps": ["Enter the system size in kW (a typical home system is 4–8 kW).", "Enter peak sun hours for your area using the guide in the tool.", "Enter your electricity price and the installed cost after incentives.", "Read yearly generation, yearly saving and payback years."], "example": "A 6 kW system in a 4.5-sun-hour region generates about 8,350 kWh a year after losses. At $0.16/kWh that saves roughly $1,336 a year, paying back a $15,000 installed cost in about 11 years — faster where prices or sunshine are higher.", "use": "Use it to screen whether solar deserves real quotes, compare quote sizes, and understand installer payback claims before signing anything.", "mistakes": ["Believing any payback figure without the assumptions: sun hours, export rates and price rises change everything.", "Assuming every generated kWh saves the full retail price — power exported while you are out often earns far less.", "Ignoring roof direction, angle and shading, which installers assess and this estimate cannot."], "faq": [["What incentives exist?", "The US has offered a federal residential clean-energy credit, the UK pays for exports via the Smart Export Guarantee, and Canada has run grant and loan programs — all change over time, so verify current rules before buying."], ["Do panels work in the UK and Canada?", "Yes — modern panels work on daylight, not heat. Generation is lower in winter and at northern latitudes, which the sun-hours input accounts for."]]},
evvsgas:{"intro": "The EV vs gas car cost calculator compares the yearly fuel bill of a petrol or gasoline car with the home-charging cost of an electric car over the same mileage. Fuel is the running cost drivers feel weekly, and the gap is the core economic argument for switching.", "steps": ["Enter your yearly mileage.", "Enter your gas car's mpg and your local fuel price per gallon.", "Enter the EV's efficiency in miles per kWh and your home electricity price.", "Read both yearly costs and the 5-year saving."], "example": "At 12,000 miles a year, a 30 mpg car burning $3.60 gallons costs $1,440 in fuel. An EV at 3.5 miles per kWh and $0.16/kWh costs about $549 to charge at home — a saving of roughly $891 a year, or $4,455 over five years.", "use": "Use it when car shopping, building a household budget, or checking a salesperson's savings claims with your own prices.", "mistakes": ["Comparing home charging with a car you would mostly charge publicly — rapid charging can cost as much per mile as petrol.", "Forgetting the EV's higher purchase price: fuel savings are one part of total cost of ownership.", "Using US mpg for a UK car — imperial gallons are 20% larger, so UK mpg figures look better for the same car."], "faq": [["What about maintenance?", "EVs skip oil changes and have fewer wear parts, though tyres can wear faster. This tool compares fuel and charging only, as stated."], ["Is an EV cheaper on a long commute?", "The more miles you drive, the bigger the fuel saving — high-mileage drivers benefit most."]]},
refinance:{"intro": "The mortgage refinance break-even calculator finds the month when a refinance stops costing money and starts saving it: closing costs divided by the monthly payment saving. It is the decision number lenders rarely volunteer, because a lower rate that you pay $5,000 to get is only smart if you stay long enough.", "steps": ["Enter your current balance, current rate and the new rate.", "Enter the years remaining on your loan and the closing costs.", "Read the break-even months and interest saved over the remaining term.", "Compare break-even with how long you realistically expect to stay."], "example": "Refinancing $320,000 from 7.25% to 6.0% with 27 years left cuts the payment by roughly $255 a month. With $4,500 of closing costs, break-even is about 18 months — a clear win if you will stay five years, a loss if you will move in one.", "use": "Use it whenever rates drop about 0.75–1% below yours, or a lender markets a 'no-brainer' refinance at you.", "mistakes": ["Judging by the rate alone without the closing costs and break-even.", "Restarting a fresh 30-year term and calling the lower payment a saving — this tool compares the same remaining term for honesty.", "Refinancing repeatedly, paying closing costs each time before the last one broke even."], "faq": [["What closing costs are typical?", "Roughly 2–5% of the loan in the US, product and legal fees in the UK (where it is called remortgaging), and appraisal/legal plus possible prepayment penalties in Canada."], ["When is refinancing a bad idea?", "When you will move before break-even, when it resets your term much longer, or when fees are rolled into the loan and quietly grow the balance."]]},
rentvsbuy:{"intro": "The rent vs buy calculator compares the true net cost of renting and buying the same home over the years you will actually stay — including interest, taxes, maintenance, equity built and home-price growth on the buying side. It replaces the slogans ('rent is dead money', 'property always wins') with arithmetic.", "steps": ["Enter the home price, down payment percentage and mortgage rate.", "Enter the rent for a similar home and how many years you will stay.", "Adjust growth and rent-increase assumptions if you have local knowledge.", "Read which option is cheaper over your stay, and by how much."], "example": "Buying a $450,000 home with 20% down at 6.5% and staying 7 years produces a net buying cost modestly below 7 years of $1,800 rent rising 3% a year — but shorten the stay to 3 years and renting wins clearly, because purchase costs are front-loaded.", "use": "Use it when deciding whether to renew a lease or buy, relocating for work, or testing whether a first home makes sense yet.", "mistakes": ["Comparing rent with the mortgage payment only — interest, tax, insurance, maintenance and the deposit's opportunity cost are real.", "Assuming your area's price growth matches the national average.", "Ignoring flexibility: for stays under about five years, renting usually wins on cost alone."], "faq": [["What is the 5-year rule?", "The folk rule that buying needs about five years to overcome purchase and sale costs. This calculator replaces the rule with your numbers."], ["Does it include selling costs?", "The estimate uses standard ownership-cost assumptions; agent fees on sale (often 5–6% in the US) make short stays worse for buying than shown — another reason short stays favour renting."]]},
takehome:{"intro": "The take-home pay calculator gives a simplified estimate of after-tax pay from a gross salary, using the tax system you select. It uses published-style brackets and standard payroll deductions in a deliberately simplified way, and it is labelled everywhere as an estimate only — not tax advice.", "steps": ["Choose your country — brackets, currency and deductions change.", "Enter your gross yearly salary.", "For the US and Canada, set your state or provincial tax rate.", "Read estimated yearly, monthly and biweekly take-home and your effective tax rate."], "example": "A $75,000 US salary at a 5% state rate nets roughly $57,000–$59,000 after simplified federal tax, Social Security, Medicare and state tax. A £75,000 UK salary nets roughly £53,000 after income tax and National Insurance. The tool shows its working for your exact inputs.", "use": "Use it to compare job offers across states, provinces or countries, sanity-check a first payslip, or budget from a salary figure.", "mistakes": ["Treating the estimate as a tax return figure — credits, deductions, pensions, benefits and filing status all move the real number.", "Forgetting local taxes: New York City, for example, adds its own income tax.", "Using it for self-employment income, which is taxed and deducted completely differently."], "faq": [["Why does my real payslip differ?", "Pension contributions, health premiums, union dues, student-loan repayments (UK), garnishments and exact bracket rules all adjust real pay. This is a planning estimate."], ["Where do I get an exact figure?", "Your employer's payroll, HMRC in the UK, the IRS in the US or the CRA in Canada — or a qualified tax professional."]]},
runway:{"intro": "The savings runway calculator answers the most important resilience question in personal finance: if your income stopped, how many months could you live on your savings? It is the number behind every 'emergency fund' rule, expressed as time — the thing you are actually buying.", "steps": ["Enter the savings you could realistically access.", "Enter your essential monthly spending on a lean budget — not your normal spending.", "Add any income that would continue: benefits, a partner's income, side work.", "Read your runway in months and the date your money would run out."], "example": "Savings of $18,000 against lean spending of $3,200 a month give 5.6 months of runway. Add $600 a month of continuing income and the burn drops to $2,600 — stretching the same savings to nearly 7 months.", "use": "Use it before quitting a job, going freelance, taking a sabbatical, or deciding how big your emergency fund target should be.", "mistakes": ["Using normal spending instead of a lean budget — in a real income stop, subscriptions, eating out and extras pause.", "Counting illiquid money (home equity, retirement accounts with penalties) as runway.", "Forgetting that some income usually continues — severance, benefits and side income extend the runway materially."], "faq": [["How much runway should I have?", "3–6 months for employees in stable roles, 6–12 for freelancers, single-income households and anyone in a volatile industry."], ["How do I extend my runway fastest?", "Cut the lean budget — every $100 a month removed adds days — and build any small continuing income stream."]]},
subscriptions:{"intro": "The subscription cost calculator adds up every recurring subscription — streaming, music, apps, gyms, storage, news and the rest — and shows the honest monthly, yearly and five-year totals. It exists because subscription fatigue is real: surveys in the US and UK repeatedly find people underestimate their subscriptions by half or more.", "steps": ["List each subscription on its own line: name, then its monthly price at the end.", "Annual subscriptions? Divide by 12 and enter the monthly figure.", "Read the totals and your most expensive item.", "Cancel anything unused for 60 days and re-run the numbers."], "example": "Seven typical subscriptions — Netflix $15.49, Spotify $11.99, a $39 gym, iCloud $2.99, a second streamer $13.99, a news app $9.99 and a fitness app $12.99 — total $106.44 a month: $1,277 a year and $6,386 over five years.", "use": "Use it for a quarterly subscription audit, before adding a new service, or when a card statement feels heavier than it should.", "mistakes": ["Entering annual prices as monthly, which inflates the total twelve-fold.", "Forgetting subscriptions billed through app stores, PayPal and old cards — check all three.", "Keeping a service 'for one show' all year — rotate: subscribe, watch, cancel, move on."], "faq": [["How many subscriptions does an average household have?", "Studies in the US and UK commonly find 8–12 paid subscriptions per household, with several unused."], ["What is the fastest audit method?", "Search your last three bank and card statements for recurring charges, list them here, and cancel from the total, not from memory."]]},
unitprice:{"intro": "The unit price calculator compares two products by price per ounce, gram, litre or item — the only honest way to compare different pack sizes. With grocery prices a top cost-of-living pressure, unit pricing is the highest-value habit in the supermarket.", "steps": ["Enter Product A's price and size.", "Enter Product B's price and size, in the same unit.", "Choose the unit both sizes are measured in.", "Read both unit prices, the winner and the saving per unit."], "example": "Coffee A at $4.50 for 16 oz costs $0.28 per oz. Coffee B at $7.99 for 32 oz costs $0.25 per oz — B wins by about 11% per ounce, saving roughly $1.03 over the big pack versus buying the same amount of A.", "use": "Use it in supermarkets, wholesale clubs and online grocery carts, especially for store-cupboard staples you buy repeatedly.", "mistakes": ["Comparing pack prices instead of unit prices — the entire point of pack-size design.", "Comparing different units (one in grams, one in ounces) without converting first.", "Assuming bigger always wins: promotions regularly make the smaller pack cheaper per unit."], "faq": [["Do shops have to show unit prices?", "Many US states require them and UK rules require them for most packaged goods (per 100g or per litre). Canada varies by province and retailer."], ["When is the worse unit price still the right buy?", "When the big pack would go to waste — a cheap litre of milk you pour away costs more than a pricey pint you finish."]]},
commutecost:{"intro": "The commute cost and work-from-home savings calculator prices your commute in fuel and fares per day, month and year, then shows what each work-from-home day is worth. Commuting is a cost employers never list in the salary — this makes it visible for job and housing decisions.", "steps": ["Enter your round-trip distance and commute days per week.", "Enter fuel economy and fuel price, or your daily transit and parking cost.", "Enter how many days a week you can work from home.", "Read the monthly and yearly commute cost and your WFH saving."], "example": "A 22-mile round trip at 30 mpg with $3.60 fuel and $12 parking costs about $14.64 a day — roughly $317 a month and $3,800 a year. Working from home two days a week saves about $127 a month, over $1,500 a year, before counting time.", "use": "Use it when comparing job offers, negotiating hybrid days, choosing where to live, or costing a move further from work.", "mistakes": ["Counting only fuel — parking, transit passes, tolls and wear often exceed it.", "Ignoring your time: an hour a day is roughly 10 full working days a year.", "Assuming a distant cheaper house saves money before pricing the commute that comes with it."], "faq": [["What is the full cost per mile of driving?", "Motoring organisations such as the AAA estimate all-in costs (fuel, wear, depreciation, insurance share) at several times the fuel-only cost — fuel is the floor, not the total."], ["Is one WFH day really worth much?", "For a typical car commuter, roughly $40–$70 a week per day at home once fuel, parking and fares are counted — this tool uses your numbers."]]},
payraise:{"intro": "The pay raise calculator converts a percentage raise into the figures you actually live on: the new salary, the extra money per month and per payslip, and the new hourly rate. It also frames the question nobody asks — whether the raise beats inflation.", "steps": ["Enter your current yearly salary.", "Enter the raise percentage — or type the offered new salary directly.", "Read the new salary and the monthly and per-payslip differences.", "Compare the percentage with current inflation using the Inflation Calculator."], "example": "A 4% raise on $62,000 gives a new salary of $64,480 — $2,480 more a year, $207 a month, about $95 per biweekly payslip, and a new hourly rate of about $31.00. Against 3.5% inflation, the real gain is only about 0.5%.", "use": "Use it during annual reviews, when comparing a raise with a job offer, or when an employer quotes a monthly figure instead of a percentage.", "mistakes": ["Judging a raise by the yearly headline instead of the monthly reality — $2,480 a year is $207 a month before tax.", "Forgetting the raise is taxed: take-home rises by less than the gross figure.", "Accepting a below-inflation raise silently year after year — three of them compound into a serious real pay cut."], "faq": [["What is a typical annual raise?", "Standard annual increases often run 3–5%, with promotions and job changes paying more."], ["How do I ask for more?", "Bring market data for your role, your measurable results, and a specific number — and use this tool to know exactly what that number is worth monthly."]]},
timezoneplanner:{"intro": "The time zone meeting planner converts a meeting time in one city into the local time in twelve cities across North America, Europe and beyond, handling daylight saving automatically. It exists for the remote-work era, where a careless 9 AM can mean 2 AM for a teammate.", "steps": ["Enter the meeting date and time.", "Choose the city that time is in.", "Read the same moment in every other city, with dates where they shift.", "Avoid slots that land between about 11 PM and 6 AM for anyone required."], "example": "A 9:00 AM Monday call in New York is 2:00 PM in London, 6:00 AM in Vancouver and 1:00 AM Tuesday in Sydney — which is why the Sydney teammate keeps declining, and why rotating the slot is the fair fix.", "use": "Use it when scheduling recurring calls across teams in different time zones, planning webinars, or setting a launch time.", "mistakes": ["Forgetting daylight saving changes on different dates in different countries — the US and UK switch weeks apart, shifting the gap twice a year.", "Scheduling at the edge of someone's day every week — rotate the pain fairly.", "Sending an invite without the zone named: '9 AM ET' beats '9 AM' every time."], "faq": [["What is the best transatlantic slot?", "Around 8–10 AM Eastern / 1–3 PM UK time suits North America and Europe together; adding the US West Coast pushes it to 9–11 AM Eastern."], ["Does it handle daylight saving?", "Yes — conversions use your browser's full time-zone database for the exact date you pick."]]},
summarizer:{intro:"The text summarizer shortens a long article, essay or report into its most important sentences. It works extractively: it scores every sentence by how often its key words appear across the whole text, then keeps the highest-scoring sentences in their original order — so the summary is always in the author's own words, and nothing is invented.",steps:["Paste your text into the box — at least a few sentences works best.","Choose how many sentences the summary should contain (3 is a good start).","Press Summarize and read the result, with the word-count saving shown alongside.","Copy the summary, or adjust the sentence count and run it again for a shorter or longer version."],example:"Paste a 900-word article and ask for 3 sentences: the tool typically returns a summary of around 70–90 words — roughly a 90% reduction — keeping the sentences that carry the article's most repeated key terms.",use:"Use it to triage reading lists, preview reports before a meeting, pull the gist from a long email thread, or create a starting draft for study notes and abstracts.",mistakes:["Summarizing very short text — with only 3–4 sentences there is nothing meaningful to cut.","Expecting rewritten prose: extractive summaries quote original sentences, so always read the result before quoting it.","Treating the summary as a substitute for reading documents you are legally or medically responsible for."],faq:[["Is my text uploaded for summarization?","No. The scoring runs entirely in your browser with JavaScript. Your text never leaves your device."],["How is this different from an AI summary?","AI summaries rewrite text in new words and can introduce errors. This tool only selects original sentences, so every line in the summary exists word-for-word in your source."]]},
citation:{intro:"The citation generator builds correctly formatted references in APA 7, MLA 9 and Chicago styles from the details you type: author, title, year, publisher or journal, and URL. It exists because citation punctuation is fiddly, examiners and editors check it, and a consistent reference list makes any essay or report look professional.",steps:["Choose your style: APA 7, MLA 9 or Chicago (bibliography).","Enter the author as 'Last name, First name' — add more authors separated by semicolons.","Fill in the title, the container (journal, book or website name), publisher, year and URL or DOI.","Copy the finished citation into your reference list, and check names and dates against your source."],example:"Author 'Smith, Jane', title 'How Libraries Adapt', container 'Journal of Information', year 2024 produces in APA: Smith, J. (2024). How libraries adapt. Journal of Information. — with the URL appended when you provide one.",use:"Use it for essays, dissertations, reports and articles — anywhere a bibliography or reference list is marked, checked or simply expected.",mistakes:["Mixing styles in one document — pick one style and use it for every entry.","Guessing a missing year or publisher instead of checking the source.","Forgetting that your institution may have local variations — always compare against your style guide."],faq:[["Which style should I use?","APA is common in social sciences, MLA in humanities and literature, and Chicago in history and publishing. Your teacher, university or journal will usually name the required style."],["Does it handle books and websites too?","Yes — leave the container blank for a standalone book, or enter the website name as the container for an online source."]]},
texteditor:{intro:"The online text editor is a distraction-free writing pad that lives in your browser: a large writing area, a live word and character count, quick case and emphasis tools, and a one-click download of your work as a .txt file. Nothing is saved on a server — the page holds your text only while it is open.",steps:["Start typing or paste a draft into the writing area.","Watch the live counts under the editor as you write.","Select text and use the toolbar to make it bold, italic, UPPERCASE, lowercase or Title Case.","Download your work as a .txt file, or copy it, before you close the page."],example:"Paste a 650-word draft and the counter confirms the length instantly; select the heading line, tap Title Case, then download — you have a clean, correctly formatted text file in seconds.",use:"Use it for quick drafts, notes, social posts and letters when a full word processor is overkill, or when you are on a shared computer and want nothing installed or saved.",mistakes:["Closing the tab before downloading — the editor deliberately stores nothing, so unsaved text is gone.","Expecting rich document features like tables or tracked changes — this is a plain-text editor by design.","Writing passwords or private keys into any online page, including this one."],faq:[["Is my writing saved anywhere?","No. The text exists only in this page on your device. Download or copy it before leaving."],["What format is the download?","A plain .txt file that opens in every editor, email app and word processor."]]},
speechtotext:{intro:"Speech to text turns your voice into typed words using your browser's built-in speech recognition. You talk, it transcribes — handy for drafting messages hands-free, capturing ideas quickly, or helping anyone who finds typing slow or painful. Recognition is provided by your browser, and the tool clearly tells you if your browser does not support it.",steps:["Use Chrome or Edge for the best support, and allow microphone access when asked.","Choose your language, then press Start dictation.","Speak clearly at a normal pace — say 'full stop' or use the punctuation your device supports.","Press Stop, then copy or edit the transcript like normal text."],example:"Dictate a two-minute voice note and you will typically get around 250–300 words of draft text — several times faster than most people type — ready to paste into an email or document.",use:"Use it for first drafts, meeting notes, messages while your hands are busy, and accessibility support for anyone who struggles with a keyboard.",mistakes:["Dictating in a noisy room — background noise is the top cause of wrong words.","Forgetting to proofread: names, numbers and homophones (their/there) always need a check.","Assuming it works in every browser — Safari and Firefox support varies, and the tool will tell you honestly."],faq:[["Is my voice recorded or uploaded by ToolNovo?","ToolNovo never receives your audio. Recognition is performed by your browser's own speech service; check your browser's privacy policy for how it processes speech."],["Why did it stop listening?","Browsers pause recognition after silence or about a minute of speech. Press Start again and continue — your existing text stays in the box."]]},
smalltext:{intro:"The small text generator converts ordinary text into decorative Unicode styles — small caps, superscript, tiny letters and bubble text — that you can paste into social bios, usernames, comments and messages. These are real Unicode characters, not a font, so they display almost everywhere without any app or formatting support.",steps:["Type or paste your text in the box.","Browse the styles generated instantly underneath.","Tap Copy next to the style you like.","Paste it into your bio, post or message."],example:"Type 'good vibes' and get ɢᴏᴏᴅ ᴠɪʙᴇs in small caps, ᵍᵒᵒᵈ ᵛⁱᵇᵉˢ in superscript, and ⒼⓄⓄⒹ ⓋⒾⒷⒺⓈ in bubbles — three different looks from one line of text.",use:"Use it to make Instagram and TikTok bios stand out, style a username, add flair to comments, or create headings inside plain-text posts.",mistakes:["Using styled text for important information — screen readers may read it letter by letter, so keep names and key details in normal text.","Expecting every character to exist in every style: a few letters (like superscript q) have no true Unicode form and are approximated.","Overusing it — a styled name or heading looks sharp; whole paragraphs are hard to read."],faq:[["Will it work on Instagram, TikTok and X?","Yes — because the output is standard Unicode text, it pastes and displays like normal characters on all major platforms."],["Why do some letters look different?","Unicode simply does not include every letter in every style. The generator uses the closest official characters available."]]},
invisiblechar:{intro:"An invisible character is a real character that takes up space but shows nothing on screen — used for blank names in games and social apps, empty-looking messages, spacing tricks and testing how apps handle hidden input. This tool lets you copy three reliable invisible characters and test exactly what you pasted.",steps:["Choose your character: Zero-Width Space (U+200B), Hangul Filler (U+3164) or Braille Blank (U+2800).","Tap its Copy button.","Paste it where you need it — a name field, message or bio.","Use the test box to confirm the paste worked: it counts the hidden characters for you."],example:"Copy the Hangul Filler and paste it as your display name: the field accepts it because it contains a real character, yet the name appears completely blank. The test box shows '1 character' even though nothing is visible.",use:"Use it for blank social-media names, sending an empty-looking message, adding invisible spacing in bios, or testing forms and apps you are building.",mistakes:["Assuming every app accepts every character — some platforms strip zero-width characters; if one fails, try the Braille Blank instead.","Pasting invisible characters into passwords or codes, where they cause silent, confusing failures.","Forgetting they are there — invisible characters in copied text can break searches and usernames later."],faq:[["Which invisible character is best?","Hangul Filler (U+3164) survives in most name fields, Braille Blank (U+2800) is the most visible-width option, and Zero-Width Space (U+200B) adds no width at all."],["Is an invisible character the same as a space?","No. A normal space is U+0020 and many fields trim it. Invisible characters are different code points that most trimming rules leave alone."]]},
texttobinary:{intro:"The text to binary converter turns text into the binary code computers actually store: every character becomes one or more 8-bit bytes written as 1s and 0s. It is fully UTF-8 aware, so accented letters and emoji convert correctly into their multi-byte sequences instead of breaking.",steps:["Type or paste your text.","Read the binary instantly — bytes are separated by spaces so you can follow along.","Use the Copy button to take the binary elsewhere.","Decode it back any time with the Binary to Text Converter."],example:"The letter 'A' becomes 01000001 (byte value 65). 'Hi' becomes 01001000 01101001. An emoji such as 😀 becomes four bytes, because UTF-8 uses up to four bytes for characters outside the basic alphabet.",use:"Use it for computer-science lessons, encoding exercises, puzzles and CTF challenges, or to see concretely how much space a message takes up in storage.",mistakes:["Expecting one byte per character for emoji and accented text — UTF-8 uses 2–4 bytes for those.","Dropping the leading zeros: 1000001 is not the same byte as 01000001 when bytes are read in fixed groups of eight.","Confusing binary text encoding with file formats — this converts the characters, not a whole file."],faq:[["What is UTF-8?","The standard way text is stored on the modern web: common English letters take one byte each, and every other character takes two to four bytes."],["Can I convert binary back to text?","Yes — paste the output into the Binary to Text Converter on ToolNovo and you will get your exact text back."]]},
binarytotext:{intro:"The binary to text converter decodes binary code — long strings of 1s and 0s — back into readable text. It accepts bytes with or without spaces, groups them into eights automatically, and decodes them as UTF-8, so multi-byte characters like accented letters and emoji come back correctly.",steps:["Paste your binary code — spaces between bytes are optional.","Check the decoded text appears instantly below.","If some bits are missing, the tool tells you how many stray digits were ignored.","Copy the recovered text."],example:"01001000 01100101 01101100 01101100 01101111 decodes to 'Hello'. The same code pasted as one unbroken string — 0100100001100101011011000110110001101111 — decodes identically.",use:"Use it to decode homework and puzzle answers, verify your own text-to-binary conversions, and inspect simple encoded messages in lessons and CTF challenges.",mistakes:["Pasting binary that is not in groups of eight — a single missing digit shifts every following character into gibberish.","Expecting it to decode other bases: hexadecimal and Base64 look similar but need their own converters (both are on ToolNovo).","Decoding binary from a non-text source — arbitrary file bytes rarely form valid UTF-8 text."],faq:[["What happens if my binary has an error?","Invalid byte sequences are shown with a replacement character so you can spot where the code breaks. Check for dropped or extra digits around that point."],["Does it need spaces between bytes?","No. Spaces, line breaks or no separation at all — the tool strips everything except 1s and 0s and regroups them into bytes."]]},
imageconverter:{intro:"The image converter changes images between JPG, PNG and WebP formats right in your browser. Format choice matters more than most people realise: the same photo can be a 4 MB PNG or a 300 KB WebP, and some upload forms still accept only JPG. Here you convert without uploading, watermarks or size limits.",steps:["Choose or drop your image — JPG, PNG, WebP, GIF or BMP.","Pick the output format: JPG for compatibility, PNG for transparency and sharp edges, WebP for the smallest web files.","Adjust quality for JPG and WebP (80% is the sweet spot for photos).","Convert, compare the new file size, and download."],example:"A 2.8 MB PNG screenshot converts to a WebP of about 350 KB at 85% quality — an 87% saving with no visible difference — while converting it to JPG gives roughly 500 KB and works in every form and app.",use:"Use it when a website rejects your file type, when email or a CMS needs smaller images, or when a design tool exports only one format.",mistakes:["Converting a logo with transparency to JPG — JPG has no transparency, so the background becomes white.","Re-converting a JPG again and again: every JPG save loses a little quality, so keep the original.","Choosing PNG for photographs — PNG is lossless and huge for photos; WebP or JPG will be far smaller."],faq:[["Which format is smallest?","Usually WebP for photos, often 25–35% smaller than an equivalent JPG. PNG wins only for simple graphics with few colours."],["Is my image uploaded?","No. The conversion happens on a canvas in your browser; the file never leaves your device."]]},
svgtopng:{intro:"The SVG to PNG converter turns vector graphics into pixel images at exactly the size you need. SVGs scale perfectly but many apps, forms and older tools accept only PNG — and a designer may hand you one logo file while you need it at 512 px for one platform and 1024 px for another. This tool renders it crisply at your chosen width.",steps:["Upload an SVG file, or paste SVG code directly into the box.","Choose the output width in pixels — the height scales automatically to keep proportions.","Convert and check the preview.","Download your PNG."],example:"A logo supplied as a 6 KB SVG renders to a sharp 1024 px-wide PNG for a presentation, and the same file gives a clean 256 px version for a document — no blur, because the PNG is rendered fresh from the vector at each size.",use:"Use it for logos in documents and slides, app icons, thumbnails, and anywhere a platform asks for PNG but your artwork exists only as SVG.",mistakes:["Rendering too small then enlarging the PNG later — always render at the largest size you will need.","SVGs that reference external fonts or images may render without them; outlined, self-contained SVGs convert most reliably.","Expecting a transparent PNG from an SVG with a baked-in background — the background is part of the artwork."],faq:[["Can I paste SVG code instead of a file?","Yes — paste the full <svg>…</svg> markup into the code box and convert. The file picker and the code box both work."],["What size should I choose?","Match the biggest place the image will appear. 512 px suits most web uses; 1024 px or more is safer for print and retina screens."]]},
favicon:{intro:"The favicon generator creates the small icon that appears in browser tabs, bookmarks and phone home screens. Build one from a letter or emoji with your brand colour, or turn your own logo image into a proper icon set: PNG files at 16, 32, 48 and 180 pixels, plus a classic favicon.ico containing the standard sizes.",steps:["Choose a mode: Text / Emoji or Upload Image.","For text mode, type one or two characters or an emoji and pick a background colour.","For image mode, choose a square logo image for the cleanest result.","Preview the icon, then download the sizes you need — including the ICO file for your site root."],example:"Type the letter 'T' on an emerald background and download the set: a 16×16 for browser tabs, 32×32 for retina tabs, 180×180 for Apple touch icons and a favicon.ico bundling the classic sizes — a complete favicon kit from one letter.",use:"Use it when launching a website or blog, refreshing a brand, or replacing a default globe icon so your tab stands out among twenty open tabs.",mistakes:["Using a detailed photo — at 16 pixels only a bold letter, simple shape or strong emoji survives.","Forgetting the apple-touch-icon size (180×180) if you want a nice home-screen icon on iPhones.","Uploading a wide rectangular logo: crop it square first or it will be squeezed."],faq:[["Which files does my website actually need?","At minimum favicon.ico in the site root. Modern sites add a 32×32 PNG and a 180×180 Apple touch icon — this generator makes all of them."],["Is the ICO a real ICO file?","Yes. It is a genuine ICO container bundling PNG images at 16, 32 and 48 pixels, the format browsers have used for decades."]]},
meme:{intro:"The meme generator adds classic top-and-bottom caption text to any image, in the bold outlined style everyone recognises, and lets you download the finished meme as a PNG. Your image is processed on a canvas in your browser — it is never uploaded — so you can meme screenshots and personal photos safely.",steps:["Upload the image you want to caption.","Type your top text and bottom text — the preview updates as you type.","Adjust the text size slider until the captions sit well.","Download your meme as a PNG and share it."],example:"Upload a photo of a surprised cat, add 'WHEN THE WIFI DROPS' on top and 'DURING THE FINAL BOSS' below, and you have a shareable meme in under a minute — no app, no watermark, no account.",use:"Use it for social posts, group chats, classroom and team humour, and quick reaction images — anywhere a captioned picture says it faster than a paragraph.",mistakes:["Writing captions that are too long — the best memes read in two seconds; cut every word you can.","Using tiny text on a busy photo: raise the size or pick a calmer area of the image.","Sharing photos of other people without their OK — funny is not a defence; check first."],faq:[["Does it add a watermark?","No. The downloaded PNG is exactly your image plus your text — nothing else."],["What image sizes work best?","Any size works; the canvas keeps your image's proportions. Square or landscape images suit most social feeds."]]},
emojipicker:{intro:"The emoji picker is a searchable library of the emojis people actually use — faces, gestures, hearts, animals, food, travel, objects and symbols. Tap any emoji to copy it, then paste it into a message, post, bio or document. The search understands plain words, so typing 'cat', 'fire' or 'money' finds what you mean instantly.",steps:["Browse the grid, or type a word in the search box to filter.","Tap an emoji to copy it to your clipboard.","Paste it wherever you are writing.","Repeat — your copied emoji stays on the clipboard until you copy the next one."],example:"Search 'party' and tap 🎉, search 'rocket' and tap 🚀 — two taps and your post has both, without hunting through a phone keyboard's tiny panels or remembering any codes.",use:"Use it when writing on a desktop (where emoji keyboards are clumsy), building social posts, composing bios, or finding exactly the right reaction for a message.",mistakes:["Overloading a professional message — one well-chosen emoji adds tone; ten add noise.","Assuming an emoji means the same thing to everyone: a few (like 🙏 or 😭) are read very differently across ages and cultures.","Forgetting platform rendering differs slightly — the emoji is the same character, but Apple, Google and Microsoft draw it in their own style."],faq:[["How do I copy an emoji?","Just tap or click it. A confirmation appears and the emoji is on your clipboard, ready to paste with Ctrl+V or long-press paste."],["Can I copy several at once?","Copy one, paste it, then come back for the next — or build your line in the search-adjacent text of your message as you go."]]},
compresskb:{intro:"Compress image to KB shrinks a photo to fit an exact file-size limit — the kind demanded by job applications, exam forms, visa portals and government uploads that reject anything over 200KB, 100KB or even 20KB. Instead of guessing quality sliders, you set the target and the tool searches quality and dimensions until the file fits under it.",steps:["Choose or drop your JPG, PNG or WebP image.","Pick a target: 20KB, 50KB, 100KB, 200KB, or type a custom size.","Press Compress to target and watch it find settings that fit.","Check the final size shown, then download your compressed image."],example:"A 3.2 MB phone photo with a 100KB target comes out at about 97 KB — the tool steps the JPEG quality down and, if needed, trims the dimensions slightly — ready for an application form that would have rejected the original outright.",use:"Use it for online application forms, ID and passport photo uploads, marketplace listings with strict limits, and email attachments on slow connections.",mistakes:["Setting an unrealistically tiny target for a huge, detailed photo — physics wins; expect softer quality below about 20KB.","Compressing an already-compressed image repeatedly; always start from the original.","Forgetting to check the form's dimension rules too — some portals limit pixels as well as kilobytes."],faq:[["How does it hit the target so precisely?","It tries a series of quality settings (a binary search) and reduces dimensions only if quality alone cannot reach the target, then reports the final size before you download."],["Will the result ever be larger than my target?","The tool keeps working until the file is at or under the target, or tells you honestly if the image cannot reasonably go that small."]]},
mergepdf:{intro:"Merge PDF combines several PDF files into a single document, in the order you select them. It is the fix for scanners that save every page separately, application packs scattered across downloads, and reports that need a cover sheet attached. Everything runs in your browser using an open-source PDF library — your documents are never uploaded.",steps:["Select two or more PDF files (use Ctrl/Cmd-click to pick several at once).","Check the list: files merge in the order shown, which is the order you selected them.","Press Merge PDFs.","Download the combined file and check the page count matches."],example:"Three files — a 2-page form, a 5-page ID scan and a 1-page letter — merge into one tidy 8-page PDF, ready to attach to a single application email instead of three separate files.",use:"Use it for job and university applications, contracts with annexes, combining scanned pages, and building one clean handout from several documents. If you need to merge PDF online in a hurry, this does it in under a minute \u2014 no upload, no account and no watermark.",mistakes:["Selecting files in the wrong order — the merge follows selection order, so pick the cover or first document first.","Merging password-protected PDFs: protected files must be unlocked by their owner first.","Assuming scanned pages will become searchable text — merging preserves pages exactly; it does not add OCR."],faq:[["Is there a file limit?","You can merge as many files as your device memory handles comfortably — dozens of normal documents is fine. Very large scans may be slow on older phones."],["Are my PDFs uploaded to a server?","No. Merging happens entirely in your browser; the files never leave your device."]]},
splitpdf:{intro:"Split PDF does the two jobs people actually need: extract a page range — pages 3–5, or 1, 4 and 7 — into a new smaller PDF, or split a whole document into one file per page. It is how you send just the signed page of a contract, or pull one chapter out of a manual, without printing and rescanning anything.",steps:["Choose your PDF file — the tool shows its page count.","To extract: type a range like 2-4 or single pages like 1,3,6 and press Extract pages.","To split fully: press Split every page and each page downloads as its own PDF.","Check the downloaded file has exactly the pages you wanted."],example:"From a 40-page tenancy agreement, extracting pages 38-40 gives you just the signature pages to return — a 3-page PDF instead of the whole contract — in seconds.",use:"Use it for returning signed pages, sharing one chapter or section, trimming oversized documents for email limits, and separating combined scans.",mistakes:["Counting pages from 0 — page numbers here start at 1, matching how PDF readers display them.","Splitting a 200-page file into 200 downloads without expecting your browser to ask permission for multiple downloads.","Extracting pages from a protected PDF — owner permissions still apply."],faq:[["Can I extract non-adjacent pages?","Yes — type them with commas, like 1,4,7-9, and they are combined into one PDF in document order."],["Does splitting reduce quality?","No. Pages are copied exactly as they are — text and images keep their original quality."]]},
rotatepdf:{intro:"Rotate PDF fixes pages that are sideways or upside down — the classic scanned-document problem — by rotating every page, or just a page range, by 90, 180 or 270 degrees and saving a corrected copy. The content itself is untouched; only the page orientation flag changes, so quality is perfectly preserved.",steps:["Choose the PDF with the sideways pages.","Pick the rotation: 90° clockwise, 180°, or 270° clockwise (90° counter-clockwise).","Optionally enter a page range — leave it blank to rotate the whole document.","Press Rotate and download the corrected PDF."],example:"A 6-page scan where pages 2 and 3 came out sideways: rotate just pages 2-3 by 90° and the whole document reads upright — no rescanning, no printing.",use:"Use it for scanned forms and letters, phone photos converted to PDF at the wrong orientation, and mixed documents where only some pages are wrong.",mistakes:["Rotating the whole file when only two pages are wrong — use the page range box.","Guessing the direction: if text runs bottom-to-top, you need 90° the other way — try 270° instead.","Saving over your only copy before checking the result."],faq:[["Does rotating reduce quality?","No. Rotation changes only orientation metadata for each page; the underlying content is copied exactly."],["Can I rotate different pages by different amounts?","Run the tool once per group — for example pages 2-3 by 90°, then the result again for page 5 by 180° — since each pass is lossless."]]},
jpgtopdf:{intro:"JPG to PDF converts images — JPG, PNG and WebP — into a single PDF document, one image per page. It is the quickest way to turn phone photos of receipts, forms and whiteboards into one professional file that any office, school or application portal will accept.",steps:["Select one or more images — they appear in the PDF in selection order.","Choose the page style: Fit to A4 (with margins) or Full-page image size.","Press Convert to PDF.","Download and open the PDF to check every page."],example:"Five phone photos of a signed form become one 5-page A4 PDF, each photo neatly fitted to its page — a single attachment instead of five loose images that arrive out of order.",use:"Use it for submitting photographed documents, bundling receipts for expenses, archiving whiteboard photos, and sending portfolio pages as one file.",mistakes:["Selecting images out of order — the PDF follows selection order, so choose page 1 first.","Photographing documents at an angle in poor light: the PDF preserves the photo exactly, so retake blurry pages first.","Choosing full-page size for mixed-size images when the recipient expects uniform A4 pages."],faq:[["Can I mix JPG and PNG images?","Yes — JPG, PNG and WebP can be combined in one PDF. Other formats are converted automatically where the browser supports them."],["Are my images uploaded?","No. The PDF is assembled in your browser and downloaded directly; nothing is sent to a server."]]},
pdftojpg:{intro:"PDF to JPG renders each page of a PDF as a JPG image, so you can use a page anywhere images work: in a document, a presentation, a social post or a message. Pages are rendered crisply in your browser with the same open-source engine family that powers many PDF readers.",steps:["Choose your PDF — the tool reads its page count.","Press Convert pages and thumbnails of every page appear.","Download the pages you need individually, each as a JPG.","For long documents, note that rendering many pages can take a few seconds."],example:"A 4-page certificate PDF becomes four JPGs; you drop page 1 straight into a presentation slide and attach page 2 to an email — no screenshots, no fuzzy photos of a screen.",use:"Use it for slides and documents that accept only images, sharing a single page quickly, creating previews of PDFs for websites, and working around apps with no PDF support.",mistakes:["Expecting editable text — a JPG is a picture of the page; the text is no longer selectable or searchable.","Rendering a 100-page document on a low-memory phone — convert big files on a computer where possible.","Using a page image where the recipient actually needs the data — send the original PDF for forms and records."],faq:[["What quality are the JPGs?","Pages are rendered at 1.5× scale, which gives sharp results for screens and slides. Text stays crisp because it is rendered, not screenshotted."],["Are all pages converted at once?","Yes, every page is rendered and shown as a thumbnail with its own download button, so you can take only the pages you need."]]},
hoursminutes:{intro:"The hours and minutes calculator answers the two time questions people fumble with daily: how long is it between two times, and what time will it be after adding or subtracting a duration? It handles overnight spans correctly — a shift from 22:00 to 06:00 is 8 hours, not a negative number — and shows results in hours-and-minutes and decimal form.",steps:["For a duration: enter the start time and end time and read the gap instantly.","If the end is earlier than the start, the tool treats it as the next day — perfect for night shifts.","For time maths: enter a starting time, choose Add or Subtract, and enter the hours and minutes.","Read the resulting time, including whether it lands on the next day."],example:"From 09:15 to 17:45 is 8 hours 30 minutes (8.5 in decimal). Add 2 hours 45 minutes to 16:30 and you get 19:15. Start a 7-hour 20-minute journey at 21:50 and you arrive at 05:10 the next day.",use:"Use it for work shifts and timesheets, travel and cooking durations, study and pomodoro planning, and any deadline counted backwards from a fixed time.",mistakes:["Reading 8.5 hours as 8 hours 50 minutes — decimal 8.5 is 8 hours 30 minutes; the tool shows both forms so you can compare.","Forgetting overnight spans: without next-day handling, 22:00 to 06:00 looks like minus 16 hours.","Mixing 12-hour and 24-hour clocks when typing times — the picker follows your device's clock format."],faq:[["How is this different from the Hours Calculator?","That tool focuses on work shifts with breaks and pay. This one is pure time arithmetic: durations between any two times, and adding or subtracting durations."],["Can it handle spans over 24 hours?","The between-times mode covers up to a full day (overnight included). For multi-day gaps, use the Date Difference Calculator."]]},
htmlviewer:{intro:"The HTML viewer renders HTML live as you type or paste it, side by side with a neatly formatted version of the source. It is the fastest way to check a snippet from a tutorial, preview an email template's markup, or learn how tags nest — no files, no setup, and nothing leaves your browser.",steps:["Paste HTML into the editor, or start from the built-in example and edit it.","Watch the live preview update as you type.","Read the formatted source view to check indentation and nesting.","Copy the formatted code back into your project when it looks right."],example:"Paste a table snippet from a tutorial and the preview shows the rendered table instantly; the formatted view reveals that a missing </tr> was breaking the layout — visible in the indentation before you ever open a browser console.",use:"Use it for learning HTML, testing snippets from tutorials and forums, previewing HTML email building blocks, and checking markup before pasting it into a CMS.",mistakes:["Expecting JavaScript in the snippet to run — for safety the preview does not execute scripts, so script-driven widgets will appear static.","Pasting a full page with external stylesheets: remote CSS may load, but relative file paths from your computer will not.","Confusing formatting with validation — the formatter tidies layout; it does not certify the HTML is error-free."],faq:[["Is the preview safe?","Yes. The preview frame runs without script access to this page, and your code is never uploaded anywhere."],["Can I view a whole web page's source?","Paste any HTML you have copied — from your own project or a tutorial. To inspect a live site, use your browser's built-in View Source instead."]]},
mybrowser:{intro:"What is my browser reads the information your own browser already announces — its name and version, your operating system, screen and window size, language, time zone and the full user-agent string — and lays it out clearly. It is the page support teams ask you to open when something online 'works for them but not for you'.",steps:["Open the tool — every detail is filled in automatically from your browser.","Find the exact item you need: browser version, OS, screen size or user agent.","Tap Copy next to the user agent, or copy the whole report.","Send it to whoever is helping you, or use it to check your own setup."],example:"A site looks broken and support asks for your setup: this page answers in one glance — 'Chrome 126 on Windows 11, screen 1920×1080, window 1340×768, language en-GB' — instead of a guessing game across five settings menus.",use:"Use it when reporting a bug, checking whether your browser is up to date, testing responsive layouts against your real window size, or verifying a new device's language and time zone.",mistakes:["Confusing screen size with window size — websites respond to the window; the tool shows both so you can see the difference.","Assuming the user agent is always truthful: privacy tools and some browsers deliberately generalise it.","Sharing the full report publicly without need — it is low-risk, but it is still your device fingerprint; send it to support, not to strangers."],faq:[["Does ToolNovo collect this information?","No. The details are read and displayed locally by your browser; nothing is sent to or stored by ToolNovo."],["Why does my browser name look wrong?","Most modern browsers are built on Chromium, and user-agent strings carry historical names for compatibility. The tool shows the most specific match it can detect."]]}
};
delete ART.age2;
/* ---------- Page structure: breadcrumb, article container, static pages ---------- */
var mainEl=document.querySelector("main.wrap");
var crumb=document.createElement("nav");crumb.className="crumb";crumb.id="pageCrumb";crumb.setAttribute("aria-label","Breadcrumb");
mainEl.insertBefore(crumb,document.getElementById("workspace"));
var articleWrap=document.createElement("div");articleWrap.className="article-wrap";articleWrap.id="toolArticleWrap";
var workspaceEl=document.getElementById("workspace");
workspaceEl.parentNode.insertBefore(articleWrap,workspaceEl.nextSibling);

var PAGES={
about:{title:"About Us",updated:"Last updated: November 2026",body:"<p><b>ToolNovo is a free library of 124 online tools and calculators</b> — fast, free, and easy-to-use tools for developers, students, and everyone. No signup required.</p><h2>Who We Are</h2><p>ToolNovo started with a simple frustration: most tool websites are cluttered with ads, pop-ups, sign-up walls and tools that quietly upload your files to a server. ToolNovo takes the opposite approach — open a tool, use it, and get on with your day. Every tool has its own dedicated page, with a full written guide below it explaining what it does, how to use it step by step, a worked example, common mistakes to avoid, and answers to frequent questions.</p><h2>Our Mission</h2><p>To make everyday calculations, conversions and small digital tasks instant, accurate and private — for everyone, on any device, without accounts, uploads or cost. We would rather maintain 124 tools that genuinely work than 500 half-finished ones.</p><h2>What We Offer</h2><p>The collection covers eleven categories:</p><ul><li><b>Money &amp; Finance</b> — mortgage, loan, savings, sales tax, VAT, credit card payoff, budgeting and retirement calculators.</li><li><b>Health &amp; Fitness</b> — BMI, calorie, pregnancy due date, water intake, macros, sleep and running pace.</li><li><b>Math &amp; Dates</b> — unit converter, percentages, fractions, roman numerals, date difference and countdowns.</li><li><b>Text &amp; Developer</b> — word counter, case converter, JSON formatter, Base64 encoder/decoder, color picker, UUID and slug generators.</li><li><b>Image &amp; Media</b> — image compressor and resizer, image converter, SVG to PNG, favicon and meme generators, emoji picker and compress-to-KB.</li><li><b>Study</b> — GPA, grade and final grade calculators.</li><li><b>Fun &amp; Timers</b> — password and QR code generators, dice roller, coin flip, stopwatch and countdown timer.</li><li><b>Home &amp; Life</b> — paint, flooring, wedding budget, moving cost, energy cost and solar savings.</li><li><b>Social &amp; Creators</b> — engagement rate, earnings estimator, hashtags and reading time.</li><li><b>SEO &amp; Marketing</b> — keyword density, meta tags, SERP preview, sitemap and robots.txt generators, schema builder and readability.</li><li><b>PDF Tools</b> — merge, split and rotate PDFs, convert JPG to PDF and PDF to JPG — all in your browser, with nothing uploaded.</li></ul><h2>Why Choose ToolNovo</h2><ul><li><b>100% Free</b> — every tool is completely free, with no trials, limits or hidden charges.</li><li><b>No Signup Required</b> — no accounts, no registration, no email walls. Just open and use.</li><li><b>Privacy-Focused</b> — every tool runs entirely in your browser. Your files, text and numbers are never uploaded to or stored on a server.</li><li><b>Fast and Reliable</b> — tools load instantly and calculate as you type, using the standard published formulas for each job.</li><li><b>Mobile Friendly</b> — every tool and guide works properly on phone, tablet and computer.</li></ul><h2>Accuracy</h2><p>Calculators use the standard published formulas — the lender amortization formula for mortgages, Mifflin–St Jeor for calories, Naegele’s rule for due dates, the standard 4.0 scale for GPA. Results are estimates for general information, and our <a href='#/page/disclaimer' data-page-link='disclaimer'>Disclaimer</a> explains the limits clearly.</p><h2>Contact</h2><p>Questions, corrections or a tool you would like us to build? Email <a href='mailto:support@toolnovo.net'>support@toolnovo.net</a> or visit the <a href='#/page/contact' data-page-link='contact'>Contact page</a> — we read every message.</p>"},
contact:{title:"Contact Us",updated:"We typically respond within 24-48 hours",body:"<p>We read every message. The fastest way to reach the ToolNovo team is by email:</p><p style='font-size:1.1rem'><b>Email:</b> <a href='mailto:support@toolnovo.net'>support@toolnovo.net</a></p><h2>What to contact us about</h2><ul><li><b>A tool gave a wrong result</b> — tell us the tool name and the exact numbers you entered, so we can reproduce and fix it.</li><li><b>Suggest a new tool</b> — tell us the problem it would solve for you.</li><li><b>Privacy questions</b> — anything about data, cookies or advertising (see the <a href='#/page/privacy' data-page-link='privacy'>Privacy Policy</a> first; the short answer is that tools run in your browser and we never receive your inputs).</li><li><b>Advertising and business enquiries.</b></li><li><b>Corrections</b> to any guide, rate or formula on the site.</li></ul><h2>Response time</h2><p>We typically respond within <b>24-48 hours</b>. Messages about wrong results are prioritised. Please note we cannot give personal financial, tax or medical advice — for those, please consult a licensed professional, as explained in our <a href='#/page/disclaimer' data-page-link='disclaimer'>Disclaimer</a>.</p><h2>Send a message</h2><p>Fill in the form and press Send — your message goes straight to the ToolNovo team, and we reply to the email address you give. Please do not include passwords or other sensitive details in your message.</p><div class='contact-form'><div class='field'><label for='ctName'>Your name</label><input type='text' id='ctName' placeholder='e.g. Alex Smith' /></div><div class='field'><label for='ctEmail'>Your email (so we can reply)</label><input type='text' id='ctEmail' placeholder='e.g. alex@example.com' /></div><div class='field'><label for='ctTopic'>Subject</label><select id='ctTopic'><option>Report a wrong result</option><option>Suggest a new tool</option><option>Question about a guide</option><option>Privacy question</option><option>Advertising / business</option><option>Something else</option></select></div><div class='field'><label for='ctMsg'>Your message</label><textarea id='ctMsg' rows='6' placeholder='Tell us which tool or page your message is about, and what happened…'></textarea></div><button class='btn' id='ctSend' type='button'>Send message</button></div><h2>Frequently asked questions</h2><details class='faq'><summary>Are the tools free?</summary><p>Yes — every tool on ToolNovo is completely free to use, with no usage limits and no hidden charges. No signup required.</p></details><details class='faq'><summary>Is my data safe?</summary><p>Yes. Every tool runs entirely in your web browser, on your own device. The numbers you type, the text you paste and the images you process are never uploaded to or stored on a server — see our Privacy Policy for the full detail.</p></details><details class='faq'><summary>How can I suggest a new tool?</summary><p>Email us at support@toolnovo.net, or use the form above and choose ‘Suggest a new tool’ as the subject. Tell us what the tool should do and the problem it would solve — the most-requested tools get built first.</p></details>"},
privacy:{title:"Privacy Policy",updated:"Last updated: November 2026",body:"<p>This Privacy Policy explains, in plain English, what information ToolNovo does and does not collect, how cookies and advertising work on this site, and the rights you have under UK, US and Canadian privacy law. It applies to all visitors.</p><h2>1. The short version</h2><p><b>Our tools do not collect, upload or store your data.</b> Every calculator, converter and generator on ToolNovo runs entirely in your web browser using JavaScript. The numbers you type, the text you paste, the passwords you generate and the images you compress or resize are processed on your own device and are never transmitted to, or stored on, any server.</p><h2>2. Information we do not collect</h2><ul><li>No accounts: ToolNovo has no registration, sign-up or login, so we hold no names, passwords or profiles.</li><li>No tool inputs: financial figures, health measurements, dates, text, files or generated passwords never leave your device.</li><li>No uploaded files: image tools work on local copies inside your browser only.</li><li>We do not sell personal information, and we do not build advertising profiles of our visitors.</li></ul><h2>3. Information received automatically</h2><p>Like almost every website, the hosting infrastructure may record standard technical logs (such as IP address, browser type, device type and pages requested) for security, reliability and abuse prevention. These logs are not used to identify individual visitors or to build profiles, and they are the only server-side records generated by ordinary browsing.</p><h2>4. Cookies we use</h2><p>ToolNovo's tools themselves set <b>no tracking cookies</b>. Your cookie-consent choice on this site is remembered within your browsing session so the consent banner does not reappear on every page. If you enable advertising (see below), third-party advertising cookies may be set as described in the next section. You can block or delete cookies at any time in your browser settings; the tools will still work.</p><h2>5. Advertising &amp; Cookies — Google AdSense and third-party vendors</h2><p>ToolNovo is free and may be supported in future by advertising served through <b>Google AdSense</b>. When ads are shown:</p><ul><li><b>Google and other third-party vendors use cookies to serve ads based on your prior visits to this website and/or other websites on the Internet.</b></li><li>Google's use of advertising cookies (including the <b>DART cookie</b>) enables Google and its partners to serve ads to you based on your visits to this site and/or other sites.</li><li>Third-party vendors and ad networks may also use cookies, web beacons and similar technologies to measure ad performance and personalise advertising, under their own privacy policies.</li></ul><p><b>Your choices and opt-outs:</b> you may opt out of personalised advertising by visiting <a href='https://adssettings.google.com' target='_blank' rel='noopener'>Google Ads Settings</a>. You can also opt out of many third-party vendors' use of cookies for personalised advertising at <a href='https://www.aboutads.info/choices/' target='_blank' rel='noopener'>aboutads.info</a> (US/Canada) or Your Online Choices (UK/Europe). Declining cookies in our consent banner means personalised advertising cookies are not used for your session. Opting out does not remove ads entirely — you may still see non-personalised ads.</p><h2>6. Advertisement labelling</h2><p>Any advertisement displayed on ToolNovo in future will be clearly labelled as advertising (for example with the word 'Advertisement') and kept visually separate from tool content. We do not use fake download buttons, deceptive ads or pop-ups.</p><h2>7. Third-party services</h2><p>Some tools load public libraries or fonts from content-delivery networks (for example, the QR code library and web fonts). Those providers receive the technical request needed to deliver the file, under their own privacy policies. Links to external websites are provided for convenience; we are not responsible for their content or privacy practices.</p><h2>8. Your rights — UK GDPR</h2><p>If you are in the United Kingdom, the UK GDPR gives you rights to access, rectify, erase, restrict and object to the processing of your personal data, and to data portability. Because ToolNovo does not hold personal data about its visitors, there is normally nothing for us to access, correct or delete — but if you believe we hold any information about you, contact us (section 12) and we will respond within one month. You also have the right to complain to the Information Commissioner's Office (ICO).</p><h2>9. Your rights — California CCPA / CPRA</h2><p>If you are a California resident, the CCPA/CPRA gives you the right to know what personal information a business collects, to request its deletion, to correct it, and to opt out of its 'sale' or 'sharing'. ToolNovo does not collect or sell personal information, so these requests will normally confirm that we hold nothing about you. We will never discriminate against you for exercising a privacy right.</p><h2>10. Your rights — Canada PIPEDA</h2><p>If you are in Canada, PIPEDA gives you the right to access personal information held about you and to challenge its accuracy. As above, ToolNovo holds no personal information about visitors; any enquiry will be answered promptly, and unresolved complaints may be taken to the Office of the Privacy Commissioner of Canada.</p><h2>11. Children's privacy</h2><p>ToolNovo is a general-audience website and is <b>not directed to children under 13</b>. We do not knowingly collect personal information from children under 13 (or under 16 in the UK/Europe). Because our tools collect no personal information at all, nothing special is stored about younger visitors who use the calculators for schoolwork. If you believe a child has provided us personal information (for example by email), contact us and we will delete it.</p><h2>12. How to contact us about privacy</h2><p>Email: <a href='mailto:support@toolnovo.net'>support@toolnovo.net</a>, or use the <a href='#/page/contact' data-page-link='contact'>Contact page</a>. Please put 'Privacy' in the subject line so your message is routed quickly.</p><h2>13. Changes to this policy</h2><p>We may update this policy when the site changes — for example, before advertising is enabled. The 'Last updated' date at the top of this page always shows the current version, and significant changes will be summarised here.</p>"},
terms:{title:"Terms of Service",updated:"Last updated: November 2026",body:"<p>By using ToolNovo you agree to these Terms of Service. If you do not agree with them, please do not use the website.</p><h2>1. The service</h2><p>ToolNovo provides free online calculators, converters and utilities, together with written guides, for personal and business use. No registration is required. We may add, change or remove tools at any time.</p><h2>2. Estimates, not advice</h2><p>All results are estimates provided for general information and education only. They are not financial, tax, legal, medical or any other form of professional advice. Our <a href='#/page/disclaimer' data-page-link='disclaimer'>Disclaimer</a> forms part of these terms. You are responsible for verifying any result before relying on it for a decision, a filing, a payment or a health choice.</p><h2>3. Acceptable use</h2><ul><li>Use the tools only for lawful purposes.</li><li>Do not attempt to disrupt the website, scrape it in a way that imposes an unreasonable load, or misrepresent ToolNovo content as your own.</li><li>Do not use generated content (such as QR codes or passwords) for any illegal purpose.</li></ul><h2>4. Intellectual property</h2><p>The ToolNovo name, page designs, guides and article text are protected by copyright. You may link to any page and quote short excerpts with credit and a link. You may not republish full guides or copy the site wholesale. Results you produce with the tools (calculations, converted text, resized images, generated codes) are yours to use.</p><h2>5. Availability and accuracy</h2><p>We work to keep ToolNovo available and accurate, but the site is provided 'as is' without warranties of any kind. Formulas, tax rates, platform limits and other reference data can change; we do not guarantee that every figure reflects the latest law or policy in any jurisdiction.</p><h2>6. Limitation of liability</h2><p>To the maximum extent permitted by law, ToolNovo and its operators are not liable for any loss or damage arising from use of, or reliance on, the tools or content — including financial losses, incorrect filings or missed deadlines. Nothing in these terms limits liability that cannot legally be limited.</p><h2>7. External links</h2><p>Pages may link to third-party websites. We do not control or endorse their content and are not responsible for them.</p><h2>8. Changes</h2><p>We may revise these terms from time to time. Continued use of the site after a change means you accept the updated terms. The current version is always the one on this page.</p><h2>9. Contact</h2><p>Questions about these terms: <a href='mailto:support@toolnovo.net'>support@toolnovo.net</a>.</p>"},
disclaimer:{title:"Disclaimer",updated:"Last updated: November 2026",body:"<p>The information and tools on ToolNovo are provided for <b>general information and educational purposes only</b>. Please read this page before relying on any result.</p><h2>Calculators give estimates</h2><p>Every calculator uses standard formulas and the numbers you enter. Real-world outcomes depend on factors a calculator cannot see: your lender's fees, your tax situation, your employer's policies, your body's individual response, and rules that differ between US states, UK nations and Canadian provinces. Treat every result as a well-informed estimate and a starting point for a decision — never as a guarantee.</p><h2>Not financial advice</h2><p>ToolNovo is not a bank, lender, mortgage broker, accountant or financial adviser. The mortgage, loan, savings, credit card, rent, inflation, sales tax and VAT tools do not provide financial, tax or investment advice, and using them does not create any advisory relationship. Tax rates shown (such as US state sales tax rates and UK VAT rates) are general reference figures that change over time and vary locally. For decisions about borrowing, investing, taxes or major purchases, consult a licensed professional in your country: a mortgage adviser or lender, a CPA or chartered accountant, or a regulated financial adviser.</p><h2>Not medical advice</h2><p>The BMI, calorie, pregnancy, water intake, ideal weight and running tools provide general wellness information for healthy adults. They do not diagnose, treat or replace the advice of a doctor, midwife, dietitian or other qualified health professional. Pregnancy dates are estimates to be confirmed by your care provider. If you have a medical condition, symptoms or concerns, seek professional care — in an emergency, call 911 (US and Canada) or 999 (UK).</p><h2>Education and study tools</h2><p>Grade and GPA results follow commonly used scales, but schools, universities and exam boards set their own bands and policies. Always confirm conversions and requirements with your own institution.</p><h2>External content</h2><p>All articles, guides and tool text on ToolNovo are original content written for this website. Media and trademarks belonging to third parties remain their owners' property; you are responsible for respecting copyright and platform terms when reusing any material. See our DMCA / Copyright Policy page for how to report any concern.</p><h2>Advertising disclosure</h2><p>ToolNovo is free to use and may in future be supported by advertising, including Google AdSense. Any advertisement shown will be clearly labelled as advertising (for example, 'Advertisement') and kept separate from tool content and results. ToolNovo does not use fake download buttons, deceptive ads, pop-ups or ad placeholders. Advertising cookies and your opt-out choices are explained in the <a href='#/page/privacy' data-page-link='privacy'>Privacy Policy</a>.</p><h2>No warranties</h2><p>Content is provided 'as is'. While we test our tools carefully, we cannot warrant that every result is error-free or current. If you spot a mistake, please tell us via the <a href='#/page/contact' data-page-link='contact'>Contact page</a> and we will fix it.</p>"},
guides:{title:"Guides",updated:"Every tool guide, organised by category.",body:"<p>Loading the guide index\u2026</p>"},
sitemap:{title:"Sitemap",updated:"Every tool and page on ToolNovo, in one list.",body:"<p>Loading the sitemap\u2026</p>"},
dmca:{title:"DMCA / Copyright Policy",updated:"Last updated: November 2026",body:"<p>ToolNovo respects the intellectual property rights of others and complies with the Digital Millennium Copyright Act (DMCA) and equivalent copyright laws in the UK, Canada and other jurisdictions.</p><h2>Our content</h2><p>All tools, calculators, guides and article text on ToolNovo are original works created for this website. ToolNovo does not host, reproduce or distribute third-party copyrighted files, images or media, and no ToolNovo tool downloads content from third-party platforms.</p><h2>Reporting infringement</h2><p>If you believe that any content on ToolNovo infringes your copyright, please email <a href='mailto:support@toolnovo.net'>support@toolnovo.net</a> with the subject line 'DMCA' and include:</p><ul><li>Your full name and contact information.</li><li>Identification of the copyrighted work you believe has been infringed.</li><li>The exact URL of the ToolNovo page where the material appears.</li><li>A statement that you have a good-faith belief that the use is not authorised by the copyright owner, its agent or the law.</li><li>A statement, under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorised to act on their behalf.</li><li>Your physical or electronic signature.</li></ul><h2>What happens next</h2><p>We review valid notices promptly and will remove or disable access to the identified material where a notice is complete and appears valid. We aim to acknowledge notices within 2–3 business days.</p><h2>Counter-notification</h2><p>If you believe your content was removed by mistake or misidentification, you may send a counter-notification to the same email address with your name, contact details, the URL of the removed material, and a statement consenting to the jurisdiction of the courts applicable to your location. Material may be restored 10–14 business days after a valid counter-notification unless the original complainant notifies us of court action.</p><h2>Repeat infringers</h2><p>Where any user-submitted channel exists in future, accounts or contributors who repeatedly infringe copyright will be terminated.</p><h2>Trademarks</h2><p>Names of third-party products, platforms and companies mentioned on ToolNovo (such as Google, YouTube, Instagram and TikTok) are trademarks of their respective owners and are used only descriptively. No endorsement is implied.</p>"}
};
var staticHost=document.createElement("div");staticHost.id="staticPages";
Object.keys(PAGES).forEach(function(key){
  var sec=document.createElement("section");sec.className="static-page";sec.id="page-"+key;
  sec.innerHTML="<div class='static-card'><p class='updated'></p><h1></h1><div class='page-body'></div><div class='btn-row' style='margin-top:26px'><button class='btn secondary' type='button' data-home-btn>← Back to all tools</button></div></div>";
  sec.querySelector("h1").textContent=PAGES[key].title;
  sec.querySelector(".updated").textContent=PAGES[key].updated;
  sec.querySelector(".page-body").innerHTML=PAGES[key].body;
  staticHost.appendChild(sec);
});
mainEl.appendChild(staticHost);
var nfSec=document.createElement("section");nfSec.className="static-page";nfSec.id="page-notfound";
nfSec.innerHTML="<div class='static-card' style='text-align:center'><p class='updated'>Error 404</p><h1>Page not found</h1><p style='margin-left:auto;margin-right:auto'>Sorry — the page or tool you are looking for does not exist, or its link has changed. Head back to the home page and choose from all 124 tools.</p><div class='btn-row' style='justify-content:center;margin-top:22px'><button class='btn' type='button' data-home-btn>Back to Home</button></div></div>";
staticHost.appendChild(nfSec);

/* ---------- Footer: full site links on every page ---------- */
var footerCols=document.querySelector("footer.site .cols-f");
if(false){
  footerCols.className="wrap f-grid";footerCols.removeAttribute("style");
  footerCols.innerHTML=
  "<div><h4>ToolNovo</h4><p style='margin:0;max-width:34ch'>Free online tools to make your life easier. No signup required. 124 tools, each on its own page with a full guide below it — everything runs in your browser.</p><p style='margin:12px 0 0'><b style='color:var(--ink)'>Email:</b> <a href='mailto:support@toolnovo.net'>support@toolnovo.net</a></p></div>"+
  "<div><h4>Tool categories</h4><div class='f-links'>"+
  "<a href='#/' data-cat-link='finance'>Money &amp; Finance</a><a href='#/' data-cat-link='health'>Health &amp; Fitness</a><a href='#/' data-cat-link='math'>Math &amp; Dates</a><a href='#/' data-cat-link='text'>Text &amp; Developer</a><a href='#/' data-cat-link='media'>Image &amp; Media</a><a href='#/' data-cat-link='study'>Study</a><a href='#/' data-cat-link='fun'>Fun &amp; Timers</a><a href='#/' data-cat-link='home'>Home &amp; Life</a><a href='#/' data-cat-link='creator'>Social &amp; Creators</a><a href='#/' data-cat-link='seo'>SEO &amp; Marketing</a></div></div>"+
  "<div><h4>Popular tools</h4><div class='f-links'>"+
  "<a href='#/tool/mortgage' data-tool-link='mortgage'>Mortgage Calculator</a><a href='#/tool/vat' data-tool-link='vat'>UK VAT Calculator</a><a href='#/tool/salestax' data-tool-link='salestax'>US Sales Tax Calculator</a><a href='#/tool/bmi' data-tool-link='bmi'>BMI Calculator</a><a href='#/tool/gpa' data-tool-link='gpa'>GPA Calculator</a><a href='#/tool/unit' data-tool-link='unit'>Unit Converter</a><a href='#/tool/password' data-tool-link='password'>Password Generator</a></div></div>"+
  "<div><h4>Quick Links</h4><div class='f-links'>"+
  "<a href='#/' data-home-link>Home</a><a href='#/blog' data-blog-home>Blog</a><a href='#/page/about' data-page-link='about'>About Us</a><a href='#/page/contact' data-page-link='contact'>Contact Us</a><a href='#/page/sitemap' data-page-link='sitemap'>Sitemap</a></div></div>"+
  "<div><h4>Legal</h4><div class='f-links'>"+
  "<a href='#/page/disclaimer' data-page-link='disclaimer'>Disclaimer</a><a href='#/page/terms' data-page-link='terms'>Terms of Use</a><a href='#/page/privacy' data-page-link='privacy'>Privacy Policy</a><a href='#/page/dmca' data-page-link='dmca'>DMCA Policy</a><a href='#' id='cookieSettingsLink'>Cookie Settings</a></div></div>";
  var fb=document.createElement("div");fb.className="f-bottom";
  fb.innerHTML="<span>© 2026 ToolNovo. All rights reserved.</span><span>Free online tools to make your life easier. No signup required.</span>";
  document.querySelector("footer.site .wrap").appendChild(fb);
}

/* ---------- Article rendering ---------- */
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");}
function toolById(id){for(var i=0;i<TOOLS.length;i++)if(TOOLS[i].id===id)return TOOLS[i];return null;}
function renderArticle(tool){
  var a=ART[tool.id];var html="";
  if(tool.cat==="finance")html+="<div class='disclaimer-box'><b>⚠ Financial disclaimer</b><p>"+FIN_DISC+"</p></div>";
  if(tool.cat==="health")html+="<div class='disclaimer-box'><b>⚠ Health disclaimer</b><p>"+HEALTH_DISC+"</p></div>";
  if(a){
    html+="<p class='article-meta'>By the ToolNovo team · Last updated: November 2026 · Category: "+CATNAMES[tool.cat]+"</p>";
    html+="<div class='toc'><b>On this page</b><ol><li><a href='#art-about'>About this tool</a></li><li><a href='#art-how'>How to use it — step by step</a></li><li><a href='#art-example'>Worked example</a></li><li><a href='#art-when'>When to use it</a></li><li><a href='#art-mistakes'>Common mistakes to avoid</a></li><li><a href='#art-faq'>Frequently asked questions</a></li></ol></div>";
    html+="<h2 id='art-about'>About the "+esc(tool.name)+"</h2><p>"+esc(a.intro)+"</p>";
    html+="<h3 id='art-how'>How to use the "+esc(tool.name)+" — step by step</h3><ol>"+a.steps.map(function(s){return "<li>"+esc(s)+"</li>";}).join("")+"</ol>";
    html+="<h3 id='art-example'>Worked example</h3><div class='example-box'><p>"+esc(a.example)+"</p></div>";
    html+="<h3 id='art-when'>When to use it</h3><p>"+esc(a.use)+"</p>";
    html+="<h3 id='art-mistakes'>Common mistakes to avoid</h3><ul>"+a.mistakes.map(function(s){return "<li>"+esc(s)+"</li>";}).join("")+"</ul>";
    html+="<h3 id='art-faq'>"+esc(tool.name)+" — frequently asked questions</h3>"+a.faq.map(function(q){return "<details class='faq'><summary>"+esc(q[0])+"</summary><p>"+esc(q[1])+"</p></details>";}).join("");
  }else{
    html+="<h2>About the "+esc(tool.name)+"</h2><p>"+esc(tool.desc)+" Enter your details in the tool above and the result updates instantly. Everything runs in your browser — nothing you type is uploaded or stored.</p>";
  }
  html+="<p class='muted' style='margin-top:18px'>Found this tool useful? Every ToolNovo tool is free, works on phone, tablet and computer, and needs no sign-up.</p>";
  var rel=TOOLS.filter(function(t){return t.cat===tool.cat&&t.id!==tool.id;}).slice(0,4);
  var relHtml="";
  if(rel.length)relHtml="<div class='related'><h3>Related tools</h3><div class='related-grid'>"+rel.map(function(t){return "<button type='button' class='related-card' data-tool-link='"+t.id+"'><b>"+esc(t.name)+"</b><span>"+esc(t.desc)+"</span></button>";}).join("")+"</div></div>";
  articleWrap.innerHTML="<article class='article'>"+html+"</article>"+relHtml;
}

/* ---------- View switching (multi-page behaviour) ---------- */
var homeSections=[];
[".hero","#tools","#how","#faq"].forEach(function(sel){var e=document.querySelector(sel);if(e)homeSections.push(e);});
var BASE_TITLE="ToolNovo \u2013 Free Online Tools: 124 Calculators & More";
var HOME_META="124 free online tools — Word Counter, Mortgage Calculator, Merge PDF, Image Compressor & more. No sign-up, no uploads; everything runs in your browser.";
var SLUG2ID={"word-counter":"words","password-generator":"password","qr-code-generator":"qr","case-converter":"caseconv","lorem-ipsum-generator":"lorem","age-calculator":"age","json-formatter":"json","base64-encoder":"base64","color-picker":"hexrgb","image-compressor":"image"};
function syncSeoMeta(d){try{var tt=document.title;var og=function(p,v){var e=document.querySelector('meta[property="'+p+'"]');if(e&&v)e.setAttribute("content",v);};var tw=function(n,v){var e=document.querySelector('meta[name="'+n+'"]');if(e&&v)e.setAttribute("content",v);};og("og:title",tt);tw("twitter:title",tt);if(d){og("og:description",d);tw("twitter:description",d);}}catch(e){}}
function setMetaDesc(d){var m=document.querySelector('meta[name="description"]');if(m)m.setAttribute("content",d);syncSeoMeta(d);}
function showNotFound(){hideAll();var sec=document.getElementById("page-notfound");if(sec)sec.classList.add("show");crumb.innerHTML="<a href='#/' data-home-link>Home</a><span class='sep'>\u203a</span><b>Page Not Found</b>";crumb.classList.add("show");document.title="Page Not Found | ToolNovo";setMetaDesc("The page you are looking for does not exist on ToolNovo. Browse all 124 free online tools instead.");window.scrollTo({top:0});}
function setHash(h){try{if(location.hash!==h)history.pushState(null,"",h);}catch(e){try{location.hash=h;}catch(e2){}}}
function hideAll(){
  homeSections.forEach(function(e){e.classList.add("hidden");});
  document.querySelectorAll(".tool-panel").forEach(function(p){p.classList.remove("open");});
  document.querySelectorAll(".static-page").forEach(function(p){p.classList.remove("show");});
  articleWrap.classList.remove("show");crumb.classList.remove("show");
  workspaceEl.classList.add("hidden");
}
function showHome(cat){
  hideAll();
  homeSections.forEach(function(e){e.classList.remove("hidden");});
  document.title=BASE_TITLE;setMetaDesc(HOME_META);
  if(cat){
    document.querySelectorAll(".chip").forEach(function(c){c.classList.toggle("active",c.getAttribute("data-cat")===cat);});
    activeCat=cat;renderGrid();
    var t=document.getElementById("tools");if(t)t.scrollIntoView();
  }else{window.scrollTo({top:0});}
}
function showTool(id,skipHash){
  if(!toolById(id)&&SLUG2ID[id])id=SLUG2ID[id];
  var tool=toolById(id);var panel=document.getElementById("panel-"+id);
  if(!tool||!panel){showNotFound();return;}
  hideAll();
  workspaceEl.classList.remove("hidden");
  panel.classList.add("open");
  crumb.innerHTML="<a href='#/' data-home-link>Home</a><span class='sep'>›</span><a href='#/' data-cat-link='"+tool.cat+"'>"+CATNAMES[tool.cat]+"</a><span class='sep'>›</span><b>"+esc(tool.name)+"</b>";
  crumb.classList.add("show");
  renderArticle(tool);articleWrap.classList.add("show");
  document.title=tool.name+" | ToolNovo";setMetaDesc(tool.name+" — "+tool.desc+" Free on ToolNovo, no signup required, with a full step-by-step guide.");
  if(!skipHash)setHash("#/tool/"+id);
  window.scrollTo({top:0});
  if(id==="qr"&&typeof generateQR==="function")generateQR();
}
function showPage(key,skipHash){
  if(!PAGES[key]){showNotFound();return;}
  hideAll();
  var sec=document.getElementById("page-"+key);if(sec)sec.classList.add("show");
  crumb.innerHTML="<a href='#/' data-home-link>Home</a><span class='sep'>›</span><b>"+PAGES[key].title+"</b>";
  crumb.classList.add("show");
  document.title=PAGES[key].title+" | ToolNovo";setMetaDesc(PAGES[key].title+" — ToolNovo. Free online tools to make your life easier. No signup required.");
  if(!skipHash)setHash("#/page/"+key);
  window.scrollTo({top:0});
}
/* Override the original single-page open/close behaviour */
openTool=function(id){showTool(id);};
closeTools=function(){showHome();setHash("#/");};
goHome=function(e){if(e)e.preventDefault();showHome();setHash("#/");return false;};
/* Delegated clicks for router links */
document.addEventListener("click",function(e){
  var t=e.target.closest("[data-tool-link],[data-page-link],[data-cat-link],[data-home-link],[data-home-btn]");
  if(!t){
    var navA=e.target.closest("nav.main a");
    if(navA){var href=navA.getAttribute("href");if(href==="#tools"||href==="#how"||href==="#faq"){e.preventDefault();var c=navA.getAttribute("data-navcat");showHome(c||null);if(!c){var anchor=document.querySelector(href);if(anchor)setTimeout(function(){anchor.scrollIntoView();},40);}setHash("#/");}}
    return;
  }
  e.preventDefault();
  if(t.hasAttribute("data-tool-link"))showTool(t.getAttribute("data-tool-link"));
  else if(t.hasAttribute("data-page-link"))showPage(t.getAttribute("data-page-link"));
  else if(t.hasAttribute("data-cat-link")){showHome(t.getAttribute("data-cat-link"));setHash("#/");}
  else{showHome();setHash("#/");}
});
/* Contact form: compose an email in the visitor's own mail app */
document.addEventListener("click",function(e){
  if(e.target&&e.target.id==="ctSend"){
    var name=(document.getElementById("ctName").value||"").trim();
    var topic=document.getElementById("ctTopic").value;var emailEl=document.getElementById("ctEmail");var emailVal=emailEl?(emailEl.value||"").trim():"";
    var msg=(document.getElementById("ctMsg").value||"").trim();
    if(!msg){toast("Please write a message first");return;}
    var body=encodeURIComponent(msg+(name?"\n\n— "+name:"")+(emailVal?"\nReply to: "+emailVal:""));
    var mailA=document.createElement("a");mailA.href="mailto:support@toolnovo.net?subject="+encodeURIComponent("ToolNovo: "+topic)+"&body="+body;document.body.appendChild(mailA);mailA.click();document.body.removeChild(mailA);
  }
});
/* Hash router */
function route(){
  var h=location.hash||"";
  var m=h.match(/^#\/tools\/(.+)$/);if(m){showTool(m[1],true);return;}
  var m2=h.match(/^#\/tool\/(.+)$/);if(m2){showTool(m2[1],true);return;}
  m=h.match(/^#\/page\/(.+)$/);if(m){showPage(m[1],true);return;}
  if(h===""||h==="#/"||h==="#tools"||h==="#how"||h==="#faq")return; /* stay on home */
  var legacy=h.replace("#","");
  if(legacy&&document.getElementById("panel-"+legacy)){showTool(legacy,true);setHash("#/tool/"+legacy);return;}
  if(h.indexOf("#/")===0)showNotFound();
}
window.addEventListener("hashchange",route);
route();
/* ---------- Guides index: build from TOOLS ---------- */
(function(){var host=document.querySelector("#page-guides .page-body");if(!host)return;var html="<p>Every ToolNovo tool has its own page with a full written guide below it: what the tool does, step-by-step instructions, a worked example with real numbers, common mistakes to avoid, and a short FAQ. Browse all 124 guides by category:</p>";Object.keys(CATNAMES).forEach(function(cat){var list=TOOLS.filter(function(x){return x.cat===cat;});if(!list.length)return;html+="<h2>"+CATNAMES[cat]+" ("+list.length+" guides)</h2><ul>"+list.map(function(x){return "<li><a href='#/tool/"+x.id+"' data-tool-link='"+x.id+"'><b>"+x.name+"</b></a> — "+x.desc+"</li>";}).join("")+"</ul>";});host.innerHTML=html;})();
/* ---------- Sitemap index: build from TOOLS + PAGES ---------- */
(function(){var host=document.querySelector("#page-sitemap .page-body");if(!host)return;var html="<p>Every page on ToolNovo in one place: all 124 tools \u2014 each with its own page and full guide \u2014 plus every information and legal page.</p>";Object.keys(CATNAMES).forEach(function(cat){var list=TOOLS.filter(function(x){return x.cat===cat;});if(!list.length)return;html+="<h2>"+CATNAMES[cat]+" ("+list.length+" tools)</h2><ul>"+list.map(function(x){return "<li><a href='#/tool/"+x.id+"' data-tool-link='"+x.id+"'><b>"+x.name+"</b></a> \u2014 "+x.desc+"</li>";}).join("")+"</ul>";});html+="<h2>Site pages</h2><ul><li><a href='#/blog' data-blog-home><b>Blog</b></a></li><li><a href='#/page/about' data-page-link='about'><b>About Us</b></a></li><li><a href='#/page/contact' data-page-link='contact'><b>Contact Us</b></a></li><li><a href='#/page/guides' data-page-link='guides'><b>Guides</b></a></li><li><a href='#/page/privacy' data-page-link='privacy'><b>Privacy Policy</b></a></li><li><a href='#/page/terms' data-page-link='terms'><b>Terms of Service</b></a></li><li><a href='#/page/disclaimer' data-page-link='disclaimer'><b>Disclaimer</b></a></li><li><a href='#/page/dmca' data-page-link='dmca'><b>DMCA / Copyright Policy</b></a></li></ul>";host.innerHTML=html;})();
/* ---------- Cookie consent (choice stored in this page for the session) ---------- */
var tnConsentChoice=null;
function tnShowCookieBanner(){var b=document.getElementById("cookieBanner");if(b&&!tnConsentChoice){if(window.matchMedia&&window.matchMedia("(max-width: 640px)").matches){var m=document.querySelector("main");if(m&&b.parentNode!==m)m.insertBefore(b,m.firstChild);b.classList.add("docked");}b.classList.add("show");}}
function tnSetConsent(v){tnConsentChoice=v;var b=document.getElementById("cookieBanner");if(b)b.classList.remove("show");toast(v==="accepted"?"Thanks — advertising cookies accepted for this visit.":"Understood — advertising cookies declined for this visit.");}
var caBtn=document.getElementById("cookieAccept"),cdBtn=document.getElementById("cookieDecline");
if(caBtn)caBtn.addEventListener("click",function(){tnSetConsent("accepted");});
if(cdBtn)cdBtn.addEventListener("click",function(){tnSetConsent("declined");});
var cslLink=document.getElementById("cookieSettingsLink");
if(cslLink)cslLink.addEventListener("click",function(e){e.preventDefault();tnConsentChoice=null;tnShowCookieBanner();window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"});});
setTimeout(tnShowCookieBanner,700);

;

"use strict";
/* ================= ToolNovo Blog: 29 built-in posts, index & post pages ================= */
var BLOG_CATS=["Money & Finance","Tech Guides","SEO","Security","Productivity","Web Basics","Online Tools"];
var FIN_NOTE="General information only — not financial advice. Figures in this article are examples to explain how the maths works. Your own rates, fees and terms will differ, so confirm everything with your lender, insurer or a licensed adviser before you decide.";
var BLOG_POSTS=[
{slug:"mortgage-rates-explained",title:"Mortgage Rates Explained: How Your Rate Changes Your Monthly Payment",cat:"Money & Finance",date:"14 November 2026",kw:"mortgage rates",
seo:"Mortgage Rates Explained: How Your Rate Changes Your Monthly Payment | ToolNovo Blog",
meta:"Mortgage rates decide far more than your monthly payment. See with real examples how a 1% rate difference changes your payment and total interest — and try the free mortgage calculator.",
excerpt:"A small change in your mortgage rate can cost — or save — you tens of thousands. Here is how mortgage rates really affect your monthly payment and the total you repay.",
tools:["mortgage","refinance","loan"],related:["refinancing-a-mortgage","auto-loans-explained"],fin:true,
body:`<p>When people shop for a home loan, <b>mortgage rates</b> get most of the attention — and for good reason. Your rate decides your monthly payment, how much of each payment is interest, and the total cost of the loan over 15, 20 or 30 years. Yet many buyers compare rates without seeing what a difference of half a percent actually means in money. This guide fixes that with real numbers.</p>
<h2>What mortgage rates actually are</h2>
<p>A mortgage rate is the price you pay for borrowing, expressed as a yearly percentage of the loan balance. If you borrow $360,000 at 6.5%, the lender charges roughly 6.5% of the remaining balance in interest each year, collected inside your monthly payment. Early in the loan the balance is high, so most of each payment is interest. As the balance falls, more of each payment clears the loan itself.</p>
<p>Rates are not random. Lenders set them from wider market rates, then adjust for your credit score, deposit size, loan term and the type of property. Two neighbours can be offered noticeably different mortgage rates on the same day.</p>
<h2>How mortgage rates change your monthly payment</h2>
<p>Take a $360,000 loan over 30 years and change only the rate:</p>
<ul><li><b>At 5.5%</b> — about $2,044 a month, and roughly $376,000 of interest over the term.</li><li><b>At 6.5%</b> — about $2,275 a month, and roughly $459,000 of interest.</li><li><b>At 7.5%</b> — about $2,517 a month, and roughly $546,000 of interest.</li></ul>
<p>One percentage point — from 6.5% to 5.5% — saves about $231 every month and around $83,000 across the loan. That is why chasing a slightly better rate, or improving your credit score before you apply, can be worth more than negotiating a small discount on the house price. Run your own figures in our <a href="#/tool/mortgage" data-tool-link="mortgage">Mortgage Calculator</a> to see your payment at different rates side by side.</p>
<h3>Why the term matters as much as the rate</h3>
<p>A shorter term usually comes with a lower rate and far less total interest, but a higher monthly payment. A 15-year loan at 6% on the same $360,000 costs about $3,038 a month — yet only about $187,000 of interest in total. The right choice depends on whether your budget can carry the higher payment safely.</p>
<h2>Fixed vs adjustable mortgage rates</h2>
<p>A <b>fixed rate</b> stays the same for the period agreed — sometimes the whole loan, sometimes the first 2, 3 or 5 years. An <b>adjustable rate</b> starts lower but moves with the market after an initial period, so your payment can rise. Adjustable rates can suit someone who will move or refinance soon, but they carry real risk if rates climb. Always check the worst-case payment, not just the starting one.</p>
<h2>How to get a better mortgage rate</h2>
<ul><li><b>Improve your credit score</b> in the months before applying — pay bills on time and clear small balances.</li><li><b>Save a bigger deposit</b> — borrowing a smaller share of the price usually unlocks better rates.</li><li><b>Compare at least three lenders</b> — the first quote is rarely the best.</li><li><b>Watch the fees</b> — a low rate with high arrangement fees can cost more overall. Compare the total cost, which our <a href="#/tool/loan" data-tool-link="loan">Loan Calculator</a> helps you sense-check.</li></ul>
<h2>Key takeaways</h2>
<ul><li>Mortgage rates affect both your monthly payment and, even more, your total interest.</li><li>A 1% lower rate on a typical loan can save tens of thousands over the term.</li><li>Term length, deposit size and credit score all move the rate you are offered.</li></ul>
<h2>Frequently asked questions</h2>
<h3>What is a good mortgage rate?</h3><p>There is no single number — it depends on current market rates, your credit profile and the loan type. The practical test is comparing quotes from several lenders on the same day for the same loan.</p>
<h3>How much does 1% change a mortgage payment?</h3><p>On a $360,000, 30-year loan, each 1% is roughly $230–$240 a month — and around $85,000 of interest over the full term.</p>
<h3>Should I choose a 15-year or 30-year mortgage?</h3><p>A 15-year loan saves a large amount of interest but demands a much higher monthly payment. Choose the shorter term only if the payment still leaves room for savings and emergencies.</p>
<h3>Can I change my rate later?</h3><p>Yes — that is what refinancing does. Our guide to <a href="#/blog/refinancing-a-mortgage" data-blog-link="refinancing-a-mortgage">refinancing a mortgage</a> explains when it genuinely saves money.</p>`},
{slug:"refinancing-a-mortgage",title:"Refinancing a Mortgage: When It Actually Saves You Money",cat:"Money & Finance",date:"13 November 2026",kw:"refinancing a mortgage",
seo:"Refinancing a Mortgage: When It Actually Saves You Money | ToolNovo Blog",
meta:"Refinancing a mortgage only saves money when the interest saved beats the fees and the time you stay in the home. Learn the break-even maths with a clear worked example.",
excerpt:"A lower rate sounds like an automatic win — but fees and timing decide whether refinancing really pays. Here is the break-even calculation, explained simply.",
tools:["refinance","mortgage"],related:["mortgage-rates-explained","credit-card-interest-explained"],fin:true,
body:`<p><b>Refinancing a mortgage</b> means replacing your current home loan with a new one, usually to get a lower rate, a different term, or both. Done at the right time it can save a household a great deal of money. Done carelessly, the fees eat the saving and you end up worse off. This guide shows you how to tell the difference before you sign anything.</p>
<h2>Why people consider refinancing a mortgage</h2>
<p>The common reasons are a fall in market rates since you took your loan, an improved credit score that now qualifies you for better terms, switching from an adjustable rate to the safety of a fixed rate, or shortening the term to clear the loan sooner. Some people also refinance to release equity for home improvements — that raises the loan size, so the maths needs extra care.</p>
<h2>The break-even point: the number that decides</h2>
<p>Refinancing is not free. Typical costs include arrangement or origination fees, valuation, legal work and sometimes an early-repayment charge on your old loan. Add them up, then divide by your monthly saving:</p>
<div class="example-box"><p><b>Example:</b> refinancing costs $4,500 in fees and cuts your payment by $180 a month. $4,500 ÷ $180 = <b>25 months</b> to break even. If you will stay in the home longer than 25 months, the refinance pays off. If you might move in a year, it loses money.</p></div>
<p>Our <a href="#/tool/refinance" data-tool-link="refinance">Mortgage Refinance Break-Even Calculator</a> runs this exact calculation with your own figures — enter your current payment, the new payment and the fees, and it shows your break-even month.</p>
<h2>When refinancing a mortgage usually makes sense</h2>
<ul><li>Your new rate is at least 0.75–1 percentage point lower than your current one.</li><li>You plan to stay in the home well past the break-even point.</li><li>Your credit score has improved since you took the original loan.</li><li>You are shortening the term without stretching your monthly budget.</li></ul>
<h3>When it usually does not</h3>
<p>Refinancing late in a loan — when most of your payment is already principal — saves little interest. Extending the term back to 30 years lowers the payment but can raise the total interest sharply, even at a lower rate. And if fees are high relative to a small loan balance, the break-even point can stretch beyond any realistic stay.</p>
<h2>Watch the total interest, not just the payment</h2>
<p>A new loan restarts the interest clock. In the early years of any mortgage, most of each payment is interest, so refinancing into a fresh 30-year term — even at a lower rate — can mean paying more interest overall if you keep the loan for its full life. Compare the total cost of staying versus switching, which the <a href="#/tool/mortgage" data-tool-link="mortgage">Mortgage Calculator</a> makes easy: run both loans and compare the “total interest” lines.</p>
<h2>Key takeaways</h2>
<ul><li>Refinancing saves money only after you pass the break-even point: fees ÷ monthly saving.</li><li>Staying in the home long enough is as important as the new rate.</li><li>Always compare total interest, not just the lower monthly payment.</li></ul>
<h2>Frequently asked questions</h2>
<h3>How much does refinancing cost?</h3><p>Commonly 2–5% of the loan amount once arrangement, valuation and legal fees are added, though deals vary widely. Always get the full fee list in writing.</p>
<h3>How long does refinancing take?</h3><p>Typically a few weeks to a couple of months, depending on the lender, valuation and paperwork.</p>
<h3>Does refinancing hurt my credit score?</h3><p>A new application causes a small, temporary dip. The long-term effect is usually neutral or positive if the new payment is easier to manage.</p>
<h3>Can I refinance to a shorter term?</h3><p>Yes, and it is one of the strongest reasons to refinance — you pay more each month but far less interest overall, provided the payment fits your budget safely.</p>`},
{slug:"credit-card-debt-snowball-vs-avalanche",title:"Credit Card Debt: The Snowball vs Avalanche Payoff, Explained",cat:"Money & Finance",date:"12 November 2026",kw:"credit card debt",
seo:"Credit Card Debt: Snowball vs Avalanche Payoff Explained | ToolNovo Blog",
meta:"Two proven ways to clear credit card debt: the snowball method (smallest balance first) and the avalanche method (highest interest first). Compare both with examples and pick your plan.",
excerpt:"Snowball or avalanche? Both methods clear credit card debt — one wins on motivation, the other on maths. Here is how each works and how to choose.",
tools:["debtsnowball","creditcard"],related:["credit-card-interest-explained","emergency-fund-guide"],fin:true,
body:`<p>If you carry <b>credit card debt</b> on more than one card, the hardest question is not how much to pay — it is which card to pay first. Two well-tested strategies answer it: the <b>snowball method</b> and the <b>avalanche method</b>. Both work. They differ in what they optimise — your motivation, or your money.</p>
<h2>First, the rule both methods share</h2>
<p>Whichever method you pick, you pay the minimum on every card, on time, every month. Missed minimums trigger fees and damage your credit score, and no strategy survives that. Then every spare dollar goes to one target card until it is gone, and its payment rolls into the next card. That rolling payment is where both methods get their power.</p>
<h2>The snowball method for credit card debt</h2>
<p>With the snowball, you attack the <b>smallest balance first</b>, regardless of interest rate. Clearing a card completely — even a small one — gives a quick, visible win. That win keeps people going, and a plan you stick to beats a perfect plan you abandon in month three.</p>
<div class="example-box"><p><b>Example:</b> you owe $400 on Card A, $1,800 on Card B and $3,500 on Card C. Snowball order: A, then B, then C. Card A could be gone within a couple of months, freeing its payment to join the attack on Card B.</p></div>
<h2>The avalanche method for credit card debt</h2>
<p>With the avalanche, you attack the <b>highest interest rate first</b>. This is the mathematically cheapest route: every dollar of high-rate balance you remove stops the most expensive interest from growing. On larger debts held for a long time, the avalanche can save hundreds compared with the snowball.</p>
<p>Our <a href="#/tool/debtsnowball" data-tool-link="debtsnowball">Debt Snowball Calculator</a> lets you list your debts and compare payoff order, time and interest — run both orders and look at the difference for your real numbers.</p>
<h3>So which one should you choose?</h3>
<p>If the interest difference between the two orders is small, choose the snowball — motivation is worth more than a few dollars. If one card charges a much higher rate than the others and the balances are large, the avalanche saving is real money; choose it, and set small milestones to keep yourself motivated. Many people blend them: clear one tiny balance for momentum, then switch to highest-rate order.</p>
<h2>What actually clears credit card debt fastest</h2>
<ul><li><b>Stop adding to the cards</b> while you repay — move daily spending to a debit card or cash.</li><li><b>Raise the payment, even slightly</b> — an extra $25–$50 a month shortens the plan by months. Check the effect in the <a href="#/tool/creditcard" data-tool-link="creditcard">Credit Card Payoff Calculator</a>.</li><li><b>Automate the payments</b> so a busy month never becomes a missed month.</li><li><b>Throw windfalls at the target card</b> — refunds, bonuses and sold items all count.</li></ul>
<h2>Key takeaways</h2>
<ul><li>Snowball = smallest balance first, best for motivation. Avalanche = highest rate first, cheapest overall.</li><li>Both require minimum payments on every card, every month.</li><li>The best method is the one you will still be following in six months.</li></ul>
<h2>Frequently asked questions</h2>
<h3>Which method saves more money?</h3><p>The avalanche, because it removes the most expensive interest first. The saving grows with bigger balances and bigger rate differences.</p>
<h3>Should I close cards as I clear them?</h3><p>Not automatically. Closing old cards can shorten your credit history and raise your credit utilisation, which can lower your score. Many people keep cleared cards open with no balance.</p>
<h3>What if I can only afford minimum payments?</h3><p>Pay them on time to protect your credit, and look for any small amount to add to one card. If payments are genuinely unaffordable, speak to your card provider or a free debt-advice charity — they can often freeze interest.</p>
<h3>Does the order really matter that much?</h3><p>Less than paying consistently. The difference between methods is usually far smaller than the difference between having a plan and not having one.</p>`},
{slug:"credit-card-interest-explained",title:"How Credit Card Interest Works (and Why Minimum Payments Cost You)",cat:"Money & Finance",date:"11 November 2026",kw:"credit card interest",
seo:"How Credit Card Interest Works — And Why Minimum Payments Cost You | ToolNovo Blog",
meta:"Credit card interest is charged daily on what you owe, and minimum payments are designed to stretch your debt for years. Learn how it works with a clear example and how to pay less.",
excerpt:"Minimum payments feel manageable — that is exactly the problem. See how credit card interest is calculated and why paying only the minimum can triple the cost of a purchase.",
tools:["creditcard","debtsnowball"],related:["credit-card-debt-snowball-vs-avalanche","emergency-fund-guide"],fin:true,
body:`<p><b>Credit card interest</b> is some of the most expensive borrowing most people ever use — and the least understood. Cards advertise a yearly rate, but interest is actually calculated daily, and the “minimum payment” on your statement is designed to keep the debt alive for years. Once you see the maths, you will never look at a minimum payment the same way.</p>
<h2>How credit card interest is calculated</h2>
<p>Your card has an APR — an annual percentage rate, often around 20–30%. The issuer divides that by 365 to get a daily rate, then charges it on your average daily balance. In plain terms: owe $3,000 at 24% APR and you are paying roughly <b>$2 a day, about $60 a month</b>, in interest alone — before you have bought anything new.</p>
<p>There is one escape hatch: the <b>grace period</b>. If you pay your full statement balance by the due date, purchases usually cost no interest at all. The moment you carry a balance, that protection typically disappears and new purchases start accruing interest immediately.</p>
<h2>Why minimum payments cost so much</h2>
<p>A minimum payment is usually a small percentage of the balance — often 1–3% — plus interest. Because it shrinks as the balance shrinks, the debt fades painfully slowly:</p>
<div class="example-box"><p><b>Example:</b> a $3,000 balance at 24% APR, paying only the minimum (interest + 1% of the balance), takes roughly <b>10 years</b> to clear and costs around <b>$3,300 in interest</b> — more than the original purchase. Pay a fixed $150 a month instead and the same debt is gone in about 2 years, with roughly $850 of interest.</p></div>
<p>Try your own balance in the <a href="#/tool/creditcard" data-tool-link="creditcard">Credit Card Payoff Calculator</a> — slide the monthly payment up and watch the payoff date and total interest change. It is the fastest way to feel the difference.</p>
<h2>How to pay less credit card interest</h2>
<ul><li><b>Pay a fixed amount, not a percentage</b> — set it above the minimum and keep it the same every month.</li><li><b>Pay more than once a month</b> — interest is charged on the daily balance, so earlier payments reduce it.</li><li><b>Stop new spending on the card</b> while you clear it, so the balance only moves one way.</li><li><b>Ask about a lower rate</b> — a good payment history sometimes earns a reduction; it costs nothing to ask.</li><li><b>Consider the payoff order</b> if you have several cards — our <a href="#/blog/credit-card-debt-snowball-vs-avalanche" data-blog-link="credit-card-debt-snowball-vs-avalanche">snowball vs avalanche guide</a> compares the two main strategies.</li></ul>
<h3>A note on balance-transfer offers</h3>
<p>A 0% balance-transfer card can pause interest and help you clear debt faster, but only if you clear it inside the promotional window, never miss a payment, and account for the transfer fee. Treat it as a tool with a deadline, not a solution by itself.</p>
<h2>Key takeaways</h2>
<ul><li>Credit card interest is charged daily on your balance; the APR divided by 365 is the daily rate.</li><li>Minimum payments shrink with the balance, stretching debt for years and multiplying its cost.</li><li>A fixed monthly payment above the minimum is the simplest way to pay far less interest.</li></ul>
<h2>Frequently asked questions</h2>
<h3>When is credit card interest charged?</h3><p>Interest accrues daily on any balance you carry past the due date. Paying the full statement balance on time usually means no interest on purchases at all.</p>
<h3>Why did my balance barely move after a payment?</h3><p>Because most of a minimum payment is absorbed by that month's interest. As the balance falls, a growing share of each payment reaches the balance itself.</p>
<h3>Is it better to pay the statement balance or the full balance?</h3><p>Paying the statement balance by the due date avoids interest. Paying the full current balance also covers recent purchases — either way, avoid paying only the minimum.</p>
<h3>How can I check what my debt will cost?</h3><p>Enter your balance, APR and monthly payment into the Credit Card Payoff Calculator linked above — it shows your payoff date and total interest instantly.</p>`},
{slug:"auto-loans-explained",title:"Auto Loans Explained: Terms, Rates and Total Cost",cat:"Money & Finance",date:"10 November 2026",kw:"auto loans",
seo:"Auto Loans Explained: Terms, Rates and Total Cost | ToolNovo Blog",
meta:"Auto loans are sold on the monthly payment, but the term and rate decide the real cost. Learn how auto loan terms, rates and total interest work before you visit a dealer.",
excerpt:"Dealers quote a monthly payment; smart buyers check the term, the rate and the total cost. Here is how auto loans really work — and the trap of the long term.",
tools:["autoloan","loan"],related:["car-insurance-premium-guide","mortgage-rates-explained"],fin:true,
body:`<p><b>Auto loans</b> look simple: borrow money, buy the car, pay monthly. But two loans with the same monthly payment can differ in cost by thousands, because the term and the interest rate quietly decide what the car really costs you. This guide explains how auto loans work so you can judge any offer on its total cost — not just its monthly figure.</p>
<h2>How auto loans work</h2>
<p>An auto loan is a secured loan: the car itself is the security, which is why rates are usually lower than credit cards or unsecured personal loans. You borrow a set amount — the car price minus your deposit and any trade-in — and repay it in equal monthly instalments over a fixed term, commonly 36 to 72 months. Each payment is part interest, part principal, with interest front-loaded in the early months.</p>
<h2>Auto loan terms: why longer is not cheaper</h2>
<p>Stretching the term lowers the monthly payment, which is exactly why dealers offer 72- and even 84-month loans. But the total interest climbs steeply:</p>
<div class="example-box"><p><b>Example:</b> borrowing $28,000 at 7.5% — over <b>48 months</b> the payment is about $677 and total interest is roughly $4,500. Over <b>72 months</b> the payment drops to about $484, but total interest rises to roughly $6,900. The “cheaper” loan costs about $2,400 more.</p></div>
<p>There is a second risk: a long loan can leave you owing more than the car is worth for years, because cars lose value fastest early on. Compare any offer properly with the <a href="#/tool/autoloan" data-tool-link="autoloan">Auto Loan Calculator</a> — enter price, deposit, rate and term and read the total interest line before anything else.</p>
<h2>What decides your auto loan rate</h2>
<ul><li><b>Credit score</b> — the single biggest factor; top scores get rates several points lower.</li><li><b>Term length</b> — shorter terms usually carry lower rates.</li><li><b>Deposit size</b> — borrowing less of the car's value reduces the lender's risk.</li><li><b>New vs used</b> — used-car loans typically cost 1–3 points more.</li><li><b>Where you borrow</b> — banks and credit unions often beat dealer finance; dealer deals sometimes win when manufacturers subsidise the rate.</li></ul>
<h3>Get the loan before you visit the dealer</h3>
<p>Arranging a pre-approval from your own bank first gives you a rate to beat and turns the dealer conversation into a simple question: “Can you do better than this?” It also keeps the focus on the car's price instead of a monthly payment that can hide a long term and add-ons.</p>
<h2>The true cost of the car</h2>
<p>The loan is only part of ownership. Add insurance (which our <a href="#/blog/car-insurance-premium-guide" data-blog-link="car-insurance-premium-guide">car insurance guide</a> breaks down), fuel or charging, maintenance and depreciation. A car that fits your budget on the loan alone can still strain it once running costs are included.</p>
<h2>Key takeaways</h2>
<ul><li>Judge auto loans on total cost: amount borrowed + total interest + fees.</li><li>Longer terms cut the payment but raise total interest and the risk of owing more than the car is worth.</li><li>A pre-approved rate from your bank is your best negotiating tool.</li></ul>
<h2>Frequently asked questions</h2>
<h3>What is a good term for an auto loan?</h3><p>For most buyers, 48–60 months balances payment size against total interest. Longer terms make sense only if the rate is genuinely low and you keep the car for many years.</p>
<h3>How much deposit should I put down?</h3><p>Around 20% on a new car and 10% on a used car is a common guideline — it reduces interest and protects you against early depreciation.</p>
<h3>Can I pay an auto loan off early?</h3><p>Usually yes, and it saves interest — but check for early-repayment fees in your agreement first.</p>
<h3>Does the monthly payment tell me if a deal is good?</h3><p>No. The same payment can hide very different terms and rates. Always ask for the total amount repayable.</p>`}
];
BLOG_POSTS.push(
{slug:"car-insurance-premium-guide",title:"Car Insurance: What Actually Affects Your Premium",cat:"Money & Finance",date:"9 November 2026",kw:"car insurance premium",
seo:"Car Insurance: What Actually Affects Your Premium | ToolNovo Blog",
meta:"Why is your car insurance premium higher than your neighbour's? The real factors insurers use — car, mileage, history, cover level — and the legal ways to pay less.",
excerpt:"Two drivers on the same street can pay wildly different premiums. Here are the factors insurers actually price on — and the honest ways to bring yours down.",
tools:["autoloan","loan"],related:["auto-loans-explained","emergency-fund-guide"],fin:true,
body:`<p>Your <b>car insurance premium</b> can feel arbitrary: it jumps at renewal, differs between neighbours, and rarely matches the price in the advert. In reality insurers price risk from a fairly predictable list of factors. Understanding your car insurance premium means understanding that list — and which parts of it you can legally influence.</p>
<h2>The car itself drives your car insurance premium</h2>
<p>Insurers group cars by repair cost, parts prices, theft rates and performance. A small, common hatchback with cheap parts sits in a low group; a powerful or rare car with expensive panels sits in a high one. The car's value matters too, but repair cost matters more — a modest car with pricey technology in its bumpers can still be expensive to insure. When you are choosing a car, an insurance quote before you buy is worth as much as the <a href="#/tool/autoloan" data-tool-link="autoloan">Auto Loan Calculator</a> is for the loan.</p>
<h2>You: age, history and where the car sleeps</h2>
<ul><li><b>Driving history</b> — claims and convictions raise premiums for years; a clean record is the strongest discount there is.</li><li><b>Experience</b> — younger and newer drivers pay far more, because accident statistics say they claim more.</li><li><b>Address and parking</b> — local theft and accident rates, and whether the car is garaged, on a drive or on the street.</li><li><b>Mileage and use</b> — more miles means more exposure; commuting and business use cost more than social use only.</li><li><b>Who else drives</b> — adding a young driver raises the price; sometimes adding an experienced second driver lowers it.</li></ul>
<h2>The cover you choose</h2>
<p>Comprehensive cover costs more than third-party only — though not always; sometimes comprehensive is cheaper because of who buys each type. Your voluntary excess (the amount you pay towards a claim) trades directly against the premium: a higher excess lowers the price but raises your cost if you claim. Optional extras — breakdown cover, courtesy car, legal protection, windscreen cover — each add a little, and they add up.</p>
<h3>Legal ways to lower your premium</h3>
<ul><li><b>Compare at every renewal</b> — loyalty is rarely rewarded; new-customer prices are usually keener.</li><li><b>Pay annually if you can</b> — monthly instalments usually include an interest charge.</li><li><b>Set mileage honestly but accurately</b> — overestimating miles overcharges you; underestimating can void cover.</li><li><b>Improve security</b> — approved alarms, immobilisers and garaging can help.</li><li><b>Build no-claims years</b> and consider protecting them once you have several.</li></ul>
<p>Never be tempted to misstate facts — a wrong job title, address or main driver (“fronting”) can void the policy exactly when you need it. Keep an <a href="#/blog/emergency-fund-guide" data-blog-link="emergency-fund-guide">emergency fund</a> so a higher excess is a real option, not a gamble.</p>
<h2>Key takeaways</h2>
<ul><li>Your premium is priced on the car, your history, your mileage and your cover choices.</li><li>The biggest savings come from comparing at renewal and keeping a clean record.</li><li>Only ever lower a premium with true information — false details can void cover.</li></ul>
<h2>Frequently asked questions</h2>
<h3>Why did my premium go up when nothing changed?</h3><p>Insurers reprice whole risk pools — repair costs, theft trends and claims in your area all feed in, even if your own record is spotless. It is the strongest reason to compare quotes every year.</p>
<h3>Does a higher excess always save money?</h3><p>It lowers the premium, but you must be able to pay that excess after an accident. Choose the highest excess you could genuinely afford.</p>
<h3>Is third-party insurance always cheapest?</h3><p>No. Comprehensive cover is sometimes cheaper because insurers price by the risk profile of typical buyers. Always compare both.</p>
<h3>Can my job title change my premium?</h3><p>Yes, insurers use occupation in their risk models. Describe your job truthfully — small honest differences in wording are fine, inventing a different job is not.</p>`},
{slug:"student-loans-explained",title:"Student Loans: Repayment Plans and Interest, in Plain English",cat:"Money & Finance",date:"8 November 2026",kw:"student loans",
seo:"Student Loans: Repayment Plans and Interest, in Plain English | ToolNovo Blog",
meta:"Student loans explained without jargon: how interest builds while you study, the main repayment plan types, and how extra payments change the total you repay.",
excerpt:"Student loan statements are confusing by design. This plain-English guide explains how the interest works, what the repayment plans really mean, and when extra payments help.",
tools:["studentloan","loan"],related:["emergency-fund-guide","freelancing-rates-guide"],fin:true,
body:`<p><b>Student loans</b> are often the first serious debt a person takes on — and the least explained. The statements mix balances, interest and plan names in ways that make it hard to answer a simple question: what will I actually repay? This guide explains student loans in plain English: how the interest works, what repayment plans do, and how to think about extra payments.</p>
<h2>How student loan interest builds</h2>
<p>Interest usually starts accruing from the day each part of the loan is paid out — including while you are still studying. That means you can graduate owing more than you borrowed, even before your first payment. The interest rate may be fixed for the life of the loan or linked to inflation or a market rate, depending on the system and when you borrowed. Either way, the mechanics are the same: interest is charged on the outstanding balance, so the balance falls slowly at first and faster later — exactly like the loans modelled in our <a href="#/tool/studentloan" data-tool-link="studentloan">Student Loan Calculator</a>.</p>
<h2>Student loan repayment plans, decoded</h2>
<ul><li><b>Standard / fixed-term plans</b> — a set monthly payment clears the loan in a fixed number of years. Predictable, and usually the cheapest in total interest.</li><li><b>Income-based plans</b> — payments are a percentage of your income above a threshold, so they rise and fall with your earnings. Common in the UK (where repayment is collected through payroll) and available in the US through income-driven plans. Lower earners pay less each month but the loan lasts longer.</li><li><b>Graduated plans</b> — payments start low and rise on a schedule, betting that your income will grow.</li><li><b>Write-off / forgiveness</b> — some systems cancel the remaining balance after a set number of years or for certain public-service careers. A large share of borrowers on income-based plans will never repay in full — which changes the maths of extra payments completely.</li></ul>
<h2>Should you pay extra towards student loans?</h2>
<p>It depends on your plan. On a standard fixed-term loan, extra payments reduce interest exactly as they do on any loan — run the numbers in the <a href="#/tool/loan" data-tool-link="loan">Loan Calculator</a>. On an income-based plan with a realistic write-off, extra payments may simply reduce the amount that would have been cancelled — in that case the same money often works harder in an emergency fund or pension. There is no universal answer; there is only your plan's answer.</p>
<h3>Order your debts by interest rate</h3>
<p>Student loans usually carry lower rates than credit cards. If you have both, the expensive debt almost always deserves the spare money first — see how payoff order works in our snowball vs avalanche guide.</p>
<h2>Key takeaways</h2>
<ul><li>Interest typically accrues from day one, including while you study.</li><li>Income-based plans tie payments to earnings and may end in a write-off.</li><li>Whether extra payments help depends entirely on your plan type — check before paying.</li></ul>
<h2>Frequently asked questions</h2>
<h3>Do student loans affect my credit score?</h3><p>In the US, yes — they appear on your credit file and payment history matters. In the UK, student loans do not appear on credit files, though lenders may consider the payments when assessing affordability for a mortgage.</p>
<h3>What happens if I move abroad?</h3><p>Most systems still require repayment, with thresholds adjusted by country. Tell your loan provider — ignoring it can trigger penalties.</p>
<h3>Can student loans be refinanced?</h3><p>Private refinancing exists in the US and can lower the rate for high earners with strong credit, but it gives up the protections of federal loans. Weigh that trade-off carefully.</p>
<h3>Is it worth clearing a student loan early?</h3><p>On a standard plan, early repayment saves real interest. On an income-based plan with likely write-off, often not — model your own case first.</p>`},
{slug:"emergency-fund-guide",title:"Emergency Fund: How Much You Really Need and How to Build It",cat:"Money & Finance",date:"7 November 2026",kw:"emergency fund",
seo:"Emergency Fund: How Much You Really Need and How to Build It | ToolNovo Blog",
meta:"How big should an emergency fund be — 3 months or 6? A practical guide to sizing your emergency fund from your real expenses and building it with automatic monthly savings.",
excerpt:"An emergency fund turns a crisis into an inconvenience. Here is how to size yours from your actual expenses — and a realistic way to build it month by month.",
tools:["emergencyfund","savings","runway"],related:["credit-card-debt-snowball-vs-avalanche","student-loans-explained"],fin:true,
body:`<p>An <b>emergency fund</b> is cash set aside for the expenses life does not schedule: a lost job, a broken boiler, a car repair you cannot postpone. Without one, those events go on a credit card and become months of interest. With one, they are annoying — and that is all. This guide shows how to size your emergency fund honestly and build it at a pace you can keep.</p>
<h2>How big should an emergency fund be?</h2>
<p>The classic advice is 3–6 months of expenses — but the right number depends on your situation:</p>
<ul><li><b>1 month</b> — a starter fund that already covers most small emergencies.</li><li><b>3 months</b> — reasonable for a dual-income household with stable jobs and no dependants.</li><li><b>6 months</b> — wiser for a single income, freelancers, or anyone whose work is seasonal or contract-based.</li><li><b>More than 6</b> — worth considering if your industry is volatile or you are the only earner for a family.</li></ul>
<p>Note the wording: months of <i>expenses</i>, not income. Add up rent or mortgage, bills, food, transport, insurance and minimum debt payments — the costs that continue even if income stops. Our <a href="#/tool/emergencyfund" data-tool-link="emergencyfund">Emergency Fund Calculator</a> does this with your numbers, and the <a href="#/tool/runway" data-tool-link="runway">Savings Runway Calculator</a> shows how long your current savings would actually last.</p>
<h2>How to build an emergency fund that actually gets built</h2>
<ul><li><b>Automate it</b> — a standing payment the day after payday, even a small one, beats good intentions.</li><li><b>Start embarrassingly small</b> — the first $500–$1,000 covers the most common emergencies (car, appliance, phone) and builds the habit.</li><li><b>Keep it separate but instant</b> — an easy-access savings account, not invested, not in your everyday account where it quietly gets spent.</li><li><b>Feed it windfalls</b> — refunds, bonuses and sold items can jump the fund forward by months.</li><li><b>Refill after use</b> — using the fund is success, not failure; just restart the automatic payment.</li></ul>
<h3>Emergency fund vs paying off debt</h3>
<p>The usual sensible order: build a small starter fund first, then attack high-interest debt (credit cards especially), then complete the fund. Going all-in on debt with zero cash means the next surprise goes straight back on a card. Our <a href="#/blog/credit-card-debt-snowball-vs-avalanche" data-blog-link="credit-card-debt-snowball-vs-avalanche">guide to clearing credit card debt</a> shows how the two goals fit together.</p>
<h2>Where to keep it</h2>
<p>Safety and instant access beat return. An insured, easy-access savings account is the standard home for an emergency fund; the interest is a bonus, not the point. Avoid investing it — markets can be down exactly when jobs are lost, and the fund's job is to be there, in full, on the worst week.</p>
<h2>Key takeaways</h2>
<ul><li>Size your fund from essential expenses, not income: 3 months is a floor for most, 6 for single or irregular incomes.</li><li>Automation and a small starter target make the fund actually happen.</li><li>Keep it in instant-access cash — its job is certainty, not growth.</li></ul>
<h2>Frequently asked questions</h2>
<h3>What counts as an emergency?</h3><p>Job loss, essential repairs, urgent medical or vet bills — expenses that are necessary, unexpected and urgent. Sales and holidays are what separate savings goals are for.</p>
<h3>Should I invest my emergency fund for a better return?</h3><p>No. The fund exists to be available in full at any moment; investment risk works against that purpose.</p>
<h3>How long does it take to build?</h3><p>Saving $150 a month reaches a $1,800 starter fund in a year. Use the <a href="#/tool/savings" data-tool-link="savings">Savings Goal Calculator</a> to turn your target and monthly amount into a finish date.</p>
<h3>Is one month of expenses enough?</h3><p>It is a strong start and covers most everyday emergencies, but it leaves little room for a job gap. Treat it as stage one, not the finish line.</p>`},
{slug:"solar-panels-costs-savings-payback",title:"Solar Panels: Costs, Savings and Payback Time Explained",cat:"Money & Finance",date:"6 November 2026",kw:"solar panels",
seo:"Solar Panels: Costs, Savings and Payback Time Explained | ToolNovo Blog",
meta:"Solar panels explained in money terms: typical system costs, how savings on bills build up, what payback time really means, and the factors that make solar pay faster.",
excerpt:"Solar pays back — but how fast depends on your roof, your usage and your tariff. Here is the honest maths of solar panel costs, savings and payback time.",
tools:["solarsavings","energycost"],related:["emergency-fund-guide","mortgage-rates-explained"],fin:true,
body:`<p><b>Solar panels</b> turn your roof into a small power station — but the decision to install them is a financial one, and it deserves clear maths rather than sales talk. This guide explains what solar panels cost, how the savings actually arise, and how to work out your payback time before you commit.</p>
<h2>What solar panels cost</h2>
<p>A typical home system is 3–5 kW of panels, plus an inverter and installation. Total prices vary widely by country, roof and installer, but the structure is consistent: panels are now the smaller part of the bill; labour, scaffolding, the inverter and optional battery storage make up the rest. A battery can add a large sum — sometimes near the cost of the panels themselves — so treat it as a separate decision with its own payback.</p>
<p>Get at least three quotes, and ask each installer for the same thing: system size in kW, estimated yearly generation in kWh, and the assumptions behind their savings figure. Estimates are only comparable when the assumptions are visible.</p>
<h2>Where solar panel savings come from</h2>
<ul><li><b>Self-consumption</b> — every unit you generate and use yourself is a unit you do not buy at your tariff price. This is the biggest saving, worth your full per-unit rate.</li><li><b>Export payments</b> — surplus power sold back to the grid earns a (usually much lower) export rate.</li><li><b>Battery shifting</b> — storing midday surplus for the evening raises self-consumption, at the cost of the battery itself.</li></ul>
<p>The key variable is how much of your generation you use yourself. A household out all day might self-consume 30–40% without a battery; a home worker might reach 60–70%. Our <a href="#/tool/solarsavings" data-tool-link="solarsavings">Solar Panel Savings Estimator</a> lets you test your own cost, generation and tariff — and the <a href="#/tool/energycost" data-tool-link="energycost">Appliance Energy Cost Calculator</a> shows which devices are worth running while the sun shines.</p>
<h2>Payback time: the honest calculation</h2>
<div class="example-box"><p><b>Example:</b> a system costs $9,000 and saves an estimated $850 a year on bills plus $120 in export payments — $970 a year in total. $9,000 ÷ $970 ≈ <b>9.3 years</b> to pay back. After that, the remaining panel life (systems are commonly warranted for 20–25 years) is largely saving.</p></div>
<p>Stress-test the estimate: if savings were 20% lower, does the payback still fit how long you will live in the home? If you might move in five years, a nine-year payback is a gift to the next owner — though some buyers do pay more for a home with panels fitted.</p>
<h3>What makes solar pay back faster</h3>
<ul><li>A south-facing (or east–west) unshaded roof.</li><li>High daytime electricity use, or an EV charged at home.</li><li>A high electricity tariff — the more each unit costs, the more each saved unit is worth.</li><li>Available grants or tax incentives in your area, which cut the upfront cost directly.</li></ul>
<h2>Key takeaways</h2>
<ul><li>Savings come mainly from using your own generation; export payments are a bonus.</li><li>Payback = total installed cost ÷ realistic yearly saving — test it with pessimistic numbers too.</li><li>Roof direction, daytime usage and tariff price decide whether solar is a great deal or a slow one.</li></ul>
<h2>Frequently asked questions</h2>
<h3>Do solar panels work on cloudy days?</h3><p>Yes — they generate less, but they still produce. Yearly totals matter more than any single day, and reputable installers estimate from local weather data.</p>
<h3>Is a battery worth it?</h3><p>It raises self-consumption and provides backup on some systems, but it has its own payback period. Run the numbers with and without before deciding.</p>
<h3>What maintenance do panels need?</h3><p>Very little: rain cleans most roofs, and the inverter is the part most likely to need replacement once during the system's life. Budget for that in your payback estimate.</p>
<h3>Do panels add value to a home?</h3><p>Often modestly, especially owned (not leased) systems with paperwork in order — but treat any value increase as a bonus, not the reason to buy.</p>`},
{slug:"vpn-explained",title:"VPNs Explained: What They Do, What They Don't, and Who Needs One",cat:"Security",date:"5 November 2026",kw:"VPN",
seo:"VPNs Explained: What They Do, What They Don't, and Who Needs One | ToolNovo Blog",
meta:"A VPN encrypts your connection and hides your traffic from your network — but it does not make you anonymous or invincible. A plain-English guide to what VPNs really do.",
excerpt:"VPN adverts promise total invisibility. The truth is more useful: a VPN does a few specific things very well. Here is what they are — and what they are not.",
tools:["password"],related:["two-factor-authentication-explained","check-if-a-website-is-safe"],fin:false,
body:`<p>A <b>VPN</b> (virtual private network) is one of the most advertised — and most exaggerated — products in tech. Stripped of marketing, a VPN does one core job: it creates an encrypted tunnel between your device and a server run by the VPN provider, and routes your internet traffic through it. That single mechanism has real benefits and real limits. Here is both, in plain English.</p>
<h2>What a VPN actually does</h2>
<ul><li><b>Encrypts your connection</b> — on public Wi-Fi in a café, hotel or airport, other people on the network cannot easily snoop on your traffic.</li><li><b>Hides your traffic from your internet provider</b> — your ISP sees a connection to the VPN server, not the sites you visit.</li><li><b>Changes your apparent location</b> — websites see the VPN server's IP address and country, not yours. This is why VPNs are used to reach home services while travelling.</li><li><b>Connects you to a work network</b> — the original business use: staff reach office systems securely from anywhere.</li></ul>
<h2>What a VPN does not do</h2>
<ul><li><b>It does not make you anonymous.</b> The VPN provider can see your traffic instead of your ISP — you have moved trust, not removed it. Websites can still track you with cookies and accounts you log into.</li><li><b>It does not stop malware or phishing.</b> A VPN will happily deliver a malicious download or a fake login page, encrypted. Your judgement and security software still matter.</li><li><b>It does not protect weak passwords.</b> Account security still rests on strong, unique passwords and <a href="#/blog/two-factor-authentication-explained" data-blog-link="two-factor-authentication-explained">two-factor authentication</a>.</li><li><b>It is not automatically legal or allowed everywhere</b> — some countries restrict VPN use, and using one to break a service's terms can get accounts closed.</li></ul>
<h2>Who actually needs a VPN</h2>
<p>You will get real value from a VPN if you regularly use public Wi-Fi for anything sensitive, travel and need your home country's services, work remotely and connect to company systems, or simply prefer that your ISP not log your browsing. If you mostly browse at home on your own network with up-to-date devices, a VPN is a nice extra rather than an essential — your money may protect you better spent on a password manager and good backups.</p>
<h3>Choosing a VPN provider</h3>
<p>Pick a provider with a clear, independently audited no-logs policy, apps for all your devices, and a jurisdiction you are comfortable with. Be wary of free VPNs: running servers costs money, and if you are not paying, your data or attention is usually the product. A reputable paid VPN plus a strong password from our <a href="#/tool/password" data-tool-link="password">Password Generator</a> covers far more real-world risk than any single tool alone.</p>
<h2>Key takeaways</h2>
<ul><li>A VPN encrypts your connection and shifts who can see your traffic — it does not make you invisible.</li><li>Its strongest everyday use is safety on public Wi-Fi and access while travelling.</li><li>It complements — never replaces — strong passwords, 2FA and careful clicking.</li></ul>
<h2>Frequently asked questions</h2>
<h3>Will a VPN slow my internet down?</h3><p>Slightly — encryption and the extra journey add overhead. Good providers on nearby servers are often only a few percent slower; distant servers slow things more noticeably.</p>
<h3>Is using a VPN legal?</h3><p>In most countries, yes for ordinary use. A few countries restrict or ban them, so check local rules when travelling.</p>
<h3>Does a VPN protect me on public Wi-Fi?</h3><p>It protects the connection between your device and the VPN server, which is exactly the part public Wi-Fi exposes. Still avoid sensitive logins on networks you do not trust where possible.</p>
<h3>Can a VPN stop my ISP throttling video?</h3><p>Sometimes — if the throttling targets specific services, hiding the traffic type can help. If the network is simply congested, it will not.</p>`},
{slug:"web-hosting-explained",title:"Web Hosting Explained: Shared, VPS, Cloud — Which Do You Need?",cat:"Tech Guides",date:"4 November 2026",kw:"web hosting",
seo:"Web Hosting Explained: Shared, VPS, Cloud — Which Do You Need? | ToolNovo Blog",
meta:"Shared, VPS, cloud, dedicated — web hosting types explained in plain English, what each costs, and how to choose the right hosting for a new site, a blog or a growing business.",
excerpt:"Hosting plans are sold with confusing labels. This guide explains shared, VPS, cloud and dedicated hosting with a simple analogy — and tells you which one a new site actually needs.",
tools:["seochecker","sitemapgen"],related:["speed-up-a-slow-website","adsense-approval-guide"],fin:false,
body:`<p><b>Web hosting</b> is the rented space where your website lives so the world can visit it. Every host sells the same basic thing — a computer that stays on, connected, serving your pages — but the labels (shared, VPS, cloud, dedicated) describe very different arrangements at very different prices. This guide explains web hosting types with a housing analogy that makes the choice easy.</p>
<h2>Shared web hosting: the apartment block</h2>
<p>On shared hosting, hundreds of websites live on one server, splitting its power and storage. It is by far the cheapest option and perfectly adequate for a new site, a small blog or a simple business page. The limits: if a neighbour site gets a traffic surge or behaves badly, everyone can feel it, and you cannot change deep server settings. Think of it as renting a flat — affordable, maintained for you, but you share the building.</p>
<h2>VPS hosting: the townhouse</h2>
<p>A VPS (virtual private server) still shares one physical machine, but your slice is fenced off with guaranteed resources. Your site's performance no longer depends on neighbours, and you get control over the server environment. It suits growing sites, online stores and anyone whose shared plan has started to strain. The trade-off: more responsibility — updates, security and configuration are partly yours unless you pay for a managed plan.</p>
<h2>Cloud web hosting: the hotel network</h2>
<p>Cloud hosting spreads your site across many servers. If one fails, others take over; if traffic spikes, more capacity joins in. You often pay for what you use. This is the model behind platforms where static sites and apps deploy from a code repository and scale automatically. For many modern sites — especially static ones built from HTML, CSS and JavaScript — cloud-style hosting gives the best reliability per dollar, and generous free tiers exist for small projects.</p>
<h2>Dedicated hosting: the detached house</h2>
<p>One entire server, all yours. Maximum power and control, maximum price, and you (or your team) maintain it. Only high-traffic sites, heavy applications or strict compliance needs justify it today — cloud hosting has absorbed most of its old territory.</p>
<h3>So which web hosting do you need?</h3>
<ul><li><b>New site, blog or portfolio:</b> shared hosting or a free cloud tier — spend your effort on content, not servers.</li><li><b>Growing business or online store:</b> VPS or managed cloud, for guaranteed performance.</li><li><b>Traffic spikes or an app:</b> cloud hosting that scales automatically.</li><li><b>Huge, steady, demanding workload:</b> dedicated — the rare case.</li></ul>
<p>Whatever you choose, hosting is only half of being found: once your site is live, run it through our <a href="#/tool/seochecker" data-tool-link="seochecker">On-Page SEO Checker</a> and generate a proper <a href="#/tool/sitemapgen" data-tool-link="sitemapgen">XML sitemap</a> so search engines can crawl everything. And if pages feel slow, our guide to <a href="#/blog/speed-up-a-slow-website" data-blog-link="speed-up-a-slow-website">speeding up a slow website</a> starts with the fixes that cost nothing.</p>
<h2>Key takeaways</h2>
<ul><li>Shared = cheapest and shared; VPS = guaranteed slice; cloud = many servers, scales; dedicated = the whole machine.</li><li>Most new sites need the simplest option; upgrade when traffic — not worry — demands it.</li><li>Managed plans cost more but remove server maintenance from your plate.</li></ul>
<h2>Frequently asked questions</h2>
<h3>What is the difference between hosting and a domain?</h3><p>The domain is your address (yourname.com); hosting is the building at that address. You need both, and they can come from different companies.</p>
<h3>How much should hosting cost?</h3><p>Shared plans often start at a few dollars a month; VPS and cloud scale with usage; dedicated runs to hundreds. Beware renewal prices — introductory offers commonly double or triple.</p>
<h3>Can I change hosts later?</h3><p>Yes. Websites can be migrated, and static sites move especially easily — you point the domain at the new host and upload the same files.</p>
<h3>Does hosting affect SEO?</h3><p>Indirectly: slow or unreliable hosting hurts page speed and uptime, both of which affect user experience and rankings. The host alone will not rank you — content does that.</p>`}
);
BLOG_POSTS.push(
{slug:"strong-password-you-can-remember",title:"How to Create a Strong Password That You Can Actually Remember",cat:"Security",date:"3 November 2026",kw:"strong password",
seo:"How to Create a Strong Password You Can Actually Remember | ToolNovo Blog",
meta:"A strong password does not have to be impossible to remember. Learn the passphrase method, why length beats complexity, and how a password manager finishes the job.",
excerpt:"The strongest passwords are long, not complicated. Here is the passphrase method that gives you passwords that are both hard to crack and easy to remember.",
tools:["password"],related:["two-factor-authentication-explained","vpn-explained"],fin:false,
body:`<p>A <b>strong password</b> has one job: to be impractical to guess or crack, even by a computer trying billions of combinations. The surprise is that the passwords easiest for humans to remember — long phrases — are also the hardest for machines to break. This guide shows how to build a strong password you will actually remember, and how to manage the rest.</p>
<h2>What makes a strong password strong</h2>
<p>Length beats complexity. Every extra character multiplies the number of combinations an attacker must try. A 16-character password of ordinary words can be far stronger than an 8-character jumble of symbols — and you can remember it. Uniqueness matters just as much: a strong password used on ten sites is only as safe as the weakest of those sites. When one is breached, attackers try the same email-and-password pair everywhere — this is called credential stuffing, and reused passwords are its fuel.</p>
<h2>The passphrase method for a strong password</h2>
<ul><li><b>Pick four or five random words</b> that do not belong together — “copper lantern river jacket” is the idea, not a suggestion to use those exact words.</li><li><b>Add a twist you will remember</b> — capitalise one word, insert a number or symbol between words.</li><li><b>Check the length</b> — aim for 16 characters or more in total.</li><li><b>Use a different one for every important account</b> — especially email, banking and social media.</li></ul>
<p>Prefer pure randomness? Our <a href="#/tool/password" data-tool-link="password">Password Generator</a> creates strong passwords with a strength and entropy rating, generated on your device and never sent anywhere.</p>
<h2>Let a password manager remember for you</h2>
<p>Nobody can memorise fifty unique passphrases, and nobody needs to. A password manager stores them all in an encrypted vault protected by one master passphrase — the one strong password you do memorise. Reputable managers also warn you about breached or reused passwords and fill logins automatically, which makes the secure choice the lazy choice. Protect the vault itself with <a href="#/blog/two-factor-authentication-explained" data-blog-link="two-factor-authentication-explained">two-factor authentication</a>.</p>
<h3>Mistakes that weaken any password</h3>
<ul><li>Names, birthdays, pets and football teams — the first things attackers and acquaintances guess.</li><li>Predictable patterns like Password123 or Spring2026! — symbols do not rescue a guessable base.</li><li>Swapping letters for look-alikes (p@ssword) — cracking tools know every substitution.</li><li>Sharing passwords by message or writing them on notes near the computer.</li></ul>
<h2>Key takeaways</h2>
<ul><li>Long beats complicated: a 16+ character passphrase is both stronger and more memorable.</li><li>Unique beats everything: never reuse a password across accounts.</li><li>A password manager turns good practice into zero effort.</li></ul>
<h2>Frequently asked questions</h2>
<h3>How long should a password be?</h3><p>At least 12 characters, and 16 or more for important accounts like email and banking. Passphrases make this easy.</p>
<h3>Should I change my passwords regularly?</h3><p>Current guidance says no — change them when there is a reason: a breach, a shared password, or a suspicion of compromise. Forced routine changes tend to produce weaker, recycled passwords.</p>
<h3>Are password managers safe?</h3><p>Reputable ones use strong encryption so even the provider cannot read your vault. The residual risk is far smaller than the risk of reusing passwords, which managers eliminate.</p>
<h3>What is entropy in a password?</h3><p>A measure of unpredictability, in bits. More characters and more variety mean more entropy and exponentially more guesses for an attacker.</p>`},
{slug:"two-factor-authentication-explained",title:"Two-Factor Authentication, Explained: What It Is and Why It Matters",cat:"Security",date:"2 November 2026",kw:"two-factor authentication",
seo:"Two-Factor Authentication, Explained: What It Is and Why It Matters | ToolNovo Blog",
meta:"Two-factor authentication (2FA) adds a second proof of identity beyond your password. Learn how it works, which types are strongest, and which accounts to protect first.",
excerpt:"Passwords leak. Two-factor authentication means a leaked password is not enough to get into your account. Here is how 2FA works and where to turn it on first.",
tools:["password"],related:["strong-password-you-can-remember","check-if-a-website-is-safe"],fin:false,
body:`<p><b>Two-factor authentication</b> — 2FA for short — asks for two proofs that you are you: something you know (your password) plus something you have (your phone, an app, or a physical key). It matters because passwords leak in data breaches every week, and two-factor authentication makes a leaked password nearly useless on its own. If you set up one security feature this year, make it this one.</p>
<h2>How two-factor authentication works</h2>
<p>After you enter your password, the service asks for a second factor before letting you in. That can be a six-digit code from an authenticator app that changes every 30 seconds, a prompt you approve on your phone, a code sent by text message, or a physical security key you tap or plug in. An attacker with your password — even typed perfectly — is stopped at this second gate because they do not hold your device.</p>
<h2>The types of two-factor authentication, ranked</h2>
<ul><li><b>Security keys and passkeys</b> — the strongest option; they cannot be phished in the usual way because they only respond to the genuine site.</li><li><b>Authenticator apps</b> — excellent: codes are generated on your device and never travel over the phone network.</li><li><b>App prompts</b> — approving a sign-in notification is strong and convenient.</li><li><b>Text-message codes</b> — the weakest form, vulnerable to SIM-swap attacks, but still far better than a password alone.</li></ul>
<h2>Where to turn on two-factor authentication first</h2>
<ul><li><b>Your email account</b> — it is the master key: password resets for everything else land there.</li><li><b>Banking and payment apps</b> — direct access to money.</li><li><b>Social media</b> — hijacked accounts are used to scam your contacts.</li><li><b>Your password manager and cloud storage</b> — they hold everything else.</li></ul>
<p>Pair 2FA with a genuinely <a href="#/blog/strong-password-you-can-remember" data-blog-link="strong-password-you-can-remember">strong password</a> on each account — generate them with our <a href="#/tool/password" data-tool-link="password">Password Generator</a> — and save the backup or recovery codes the service gives you, somewhere safe and offline. Losing your phone without recovery codes is the one way 2FA can lock you out of your own life.</p>
<h3>What about “remember this device”?</h3>
<p>Most services let a trusted device skip the second step for a while. That is a sensible convenience on your own computer — never use it on shared or public machines.</p>
<h2>Key takeaways</h2>
<ul><li>2FA stops most account takeovers because a stolen password alone is not enough.</li><li>Authenticator apps and security keys beat text codes; any 2FA beats none.</li><li>Protect email first, and always save your recovery codes.</li></ul>
<h2>Frequently asked questions</h2>
<h3>Is 2FA the same as two-step verification?</h3><p>In everyday use, yes — services use the terms interchangeably for a password plus a second check.</p>
<h3>What if I lose my phone?</h3><p>Use the recovery codes you saved, or a second enrolled device. Services also offer identity-verification recovery, which is slower — another reason to keep those codes.</p>
<h3>Can 2FA be hacked?</h3><p>Determined attackers can trick people into approving prompts or entering codes on fake pages. Treat unexpected prompts as a red flag: if you did not just sign in, deny it.</p>
<h3>Do I need 2FA if I have a strong password?</h3><p>Yes. Passwords leak through breaches you cannot control. 2FA is the layer that keeps those leaks from becoming takeovers.</p>`},
{slug:"compress-images-without-losing-quality",title:"How to Compress Images Without Losing Quality",cat:"Online Tools",date:"1 November 2026",kw:"compress images",
seo:"How to Compress Images Without Losing Quality | ToolNovo Blog",
meta:"Learn how to compress images for the web without visible quality loss: resize first, choose the right format and quality setting, and check the result — free, in your browser.",
excerpt:"Huge images slow websites and clog emails. Here is the simple order of operations — resize, format, quality — that shrinks files dramatically while looking identical.",
tools:["image","imageresize"],related:["jpg-vs-png-vs-webp","speed-up-a-slow-website"],fin:false,
body:`<p>Learning to <b>compress images</b> properly is one of the highest-value skills on the web: smaller images mean faster pages, cheaper storage and emails that actually send. The good news is that most photos can lose 70–90% of their file size with no visible change. The trick is doing the steps in the right order.</p>
<h2>Step 1: Resize before you compress images</h2>
<p>The biggest wins come from dimensions, not quality sliders. A photo straight from a phone may be 4000 pixels wide, but a blog shows it at 800. Resizing to the actual display size can cut the file by 80% before any compression happens. Our <a href="#/tool/imageresize" data-tool-link="imageresize">Image Resizer</a> handles this in seconds — set the width the image will really be shown at, and keep the aspect ratio locked.</p>
<h2>Step 2: Choose the right format</h2>
<p>Format decides how much compression is possible. Photographs belong in JPEG or WebP; graphics with sharp edges and text belong in PNG or WebP; WebP usually beats both on size at the same quality. If you are unsure which to pick, our <a href="#/blog/jpg-vs-png-vs-webp" data-blog-link="jpg-vs-png-vs-webp">JPG vs PNG vs WebP guide</a> compares them with examples. Saving a photo as PNG is the single most common cause of mysteriously huge image files.</p>
<h2>Step 3: Compress images at the right quality</h2>
<p>For JPEG and WebP, a quality setting around 75–85% is the sweet spot: the file shrinks dramatically while the human eye sees no difference at normal viewing sizes. Go lower for thumbnails, higher only for images people will zoom into. Then zoom to 100% and check faces, text and gradients — if they look clean, you are done. Our <a href="#/tool/image" data-tool-link="image">Image Compressor</a> shows before-and-after sizes and previews, runs entirely in your browser, and never uploads your files.</p>
<h3>A practical workflow</h3>
<ul><li>Keep the original file untouched as your master copy.</li><li>Resize to the display size (for example 1600px wide for a hero image, 800px for in-article images — roughly double the display size for sharp screens).</li><li>Export as WebP where supported, JPEG as the universal fallback.</li><li>Compress at 80% quality, check at 100% zoom, adjust once if needed.</li></ul>
<h2>Why it matters</h2>
<p>Images are usually the heaviest part of a web page. Compressing them is the fastest single fix in our guide to <a href="#/blog/speed-up-a-slow-website" data-blog-link="speed-up-a-slow-website">speeding up a slow website</a> — and it also makes images cheaper to store, quicker to share and kinder to visitors on mobile data.</p>
<h2>Key takeaways</h2>
<ul><li>Resize first, format second, quality third — in that order.</li><li>75–85% quality is visually lossless for most photographs.</li><li>Always keep your original as the master and compress a copy.</li></ul>
<h2>Frequently asked questions</h2>
<h3>Does compressing an image always reduce quality?</h3><p>Lossy formats discard some data, but at sensible settings the difference is invisible in normal use. Lossless compression (PNG) keeps every pixel but produces much larger files.</p>
<h3>What is the best format for website images?</h3><p>WebP for most photos and graphics, with JPEG as a fallback for older software. PNG is for graphics that need transparency or pixel-perfect edges.</p>
<h3>How small should a web image be?</h3><p>As a guide: under 200 KB for in-page images and under 500 KB for large hero images is a healthy target most sites can hit.</p>
<h3>Can I compress images on my phone?</h3><p>Yes — browser-based tools like ToolNovo's compressor run on phones exactly as on computers, with no app and no upload.</p>`},
{slug:"jpg-vs-png-vs-webp",title:"JPG vs PNG vs WebP: Which Image Format Should You Use?",cat:"Web Basics",date:"31 October 2026",kw:"JPG vs PNG vs WebP",
seo:"JPG vs PNG vs WebP: Which Image Format Should You Use? | ToolNovo Blog",
meta:"JPG vs PNG vs WebP explained simply: what each format is good at, where each fails, and a quick rule for choosing the right image format every time.",
excerpt:"Three formats cover almost every image on the web. Here is what each one does best, where each one fails, and the simple rule that settles the choice.",
tools:["image","imageresize"],related:["compress-images-without-losing-quality","speed-up-a-slow-website"],fin:false,
body:`<p><b>JPG vs PNG vs WebP</b> is a choice you make every time you save or upload an image — and the wrong one can make a file ten times bigger than it needs to be, or quietly ruin its quality. Each format was built for a different job. Once you know those jobs, choosing takes two seconds.</p>
<h2>JPG: the photograph specialist</h2>
<p>JPEG (JPG) was designed for photographs. It compresses by discarding detail the eye barely notices, shrinking a multi-megabyte photo to a few hundred kilobytes. It supports millions of colours and is understood by every device and program on earth. Its weaknesses: no transparency, and sharp edges — text, logos, screenshots — develop fuzzy halos. Every re-save also degrades it slightly, so keep an original and export JPGs from that.</p>
<h2>PNG: the precision format</h2>
<p>PNG compresses losslessly: every pixel is preserved exactly. That makes it ideal for screenshots, diagrams, logos and any image with text or hard edges, and it supports full transparency — the see-through backgrounds logos rely on. The cost is size: a photograph saved as PNG can be five to ten times larger than the same image as JPG, with no visible benefit. Using PNG for photos is the classic beginner mistake behind slow websites.</p>
<h2>WebP: the modern all-rounder</h2>
<p>WebP, created by Google, does both jobs: it compresses photographs more efficiently than JPG (typically 25–35% smaller at the same quality) and handles lossless images and transparency like PNG, usually smaller. All modern browsers support it. Its remaining weakness is compatibility outside the browser — some older desktop software and a few social platforms still prefer JPG or PNG uploads.</p>
<h2>JPG vs PNG vs WebP: the two-second rule</h2>
<ul><li><b>Photograph for the web:</b> WebP first, JPG as the universal fallback.</li><li><b>Logo, icon or graphic with transparency:</b> WebP or PNG (SVG is even better for logos where available).</li><li><b>Screenshot or image containing text:</b> PNG, or lossless WebP.</li><li><b>Image to email or upload to an unknown system:</b> JPG for photos, PNG for graphics — maximum compatibility.</li></ul>
<p>Whichever you choose, run the result through our <a href="#/tool/image" data-tool-link="image">Image Compressor</a> and set the dimensions with the <a href="#/tool/imageresize" data-tool-link="imageresize">Image Resizer</a> — format is only half the size story, as our guide to <a href="#/blog/compress-images-without-losing-quality" data-blog-link="compress-images-without-losing-quality">compressing images without losing quality</a> explains.</p>
<h2>Key takeaways</h2>
<ul><li>JPG: small photos, no transparency. PNG: exact pixels and transparency, big photos. WebP: smaller than both, modern browsers.</li><li>Never save photographs as PNG unless you specifically need lossless quality.</li><li>Keep originals; export the format each destination needs.</li></ul>
<h2>Frequently asked questions</h2>
<h3>Which format has the best quality?</h3><p>PNG and lossless WebP preserve every pixel. But for photographs, a high-quality JPG or WebP is visually identical at a fraction of the size — “best” depends on the image.</p>
<h3>Why are my PNG files so large?</h3><p>Because PNG is lossless. If the image is a photograph, re-exporting it as JPG or WebP will shrink it dramatically with no visible change.</p>
<h3>Does WebP work everywhere?</h3><p>All current browsers support it. Some older apps and a few upload systems do not — keep a JPG fallback for those.</p>
<h3>Can I convert between formats?</h3><p>Yes, freely — but converting a JPG to PNG will not restore quality; it only makes the file bigger. Always convert from the highest-quality original you have.</p>`},
{slug:"speed-up-a-slow-website",title:"How to Speed Up a Slow Website: 10 Free Ways",cat:"Web Basics",date:"30 October 2026",kw:"speed up a slow website",
seo:"How to Speed Up a Slow Website: 10 Free Ways | ToolNovo Blog",
meta:"Ten free ways to speed up a slow website: compress images, cut heavy scripts, use caching and a CDN, and fix the bottlenecks that matter most — no paid tools required.",
excerpt:"Slow pages lose visitors and rankings. These ten free fixes — starting with images, the usual main culprit — will make most websites noticeably faster today.",
tools:["image","seochecker"],related:["compress-images-without-losing-quality","web-hosting-explained"],fin:false,
body:`<p>To <b>speed up a slow website</b>, you rarely need a rebuild or paid tools — you need to remove the weight. Most slow sites share the same few problems: oversized images, too many scripts, and no caching. Work through these ten free fixes in order and most sites become visibly faster within an hour.</p>
<h2>Fix the images first (fixes 1–3)</h2>
<p><b>1. Compress every image.</b> Images are typically 50–70% of a page's weight. Run them through an <a href="#/tool/image" data-tool-link="image">image compressor</a> at around 80% quality. <b>2. Resize to display size</b> — never serve a 4000px photo in an 800px slot. <b>3. Use modern formats</b> — WebP instead of JPG/PNG where possible. Our full walkthrough is in <a href="#/blog/compress-images-without-losing-quality" data-blog-link="compress-images-without-losing-quality">how to compress images without losing quality</a>.</p>
<h2>Cut what the page carries (fixes 4–6)</h2>
<p><b>4. Delete unused plugins and scripts.</b> Every plugin, chat widget, tracker and social embed adds requests and code. If it does not earn its place, it goes. <b>5. Reduce third-party fonts</b> — one family, two weights, is enough for almost every site; load them efficiently and let text show in a fallback font while they arrive. <b>6. Minify and combine where your platform allows</b> — smaller CSS and JavaScript files download and parse faster.</p>
<h2>Serve pages smarter (fixes 7–10)</h2>
<p><b>7. Turn on caching</b> so repeat visitors load stored copies instead of downloading everything again. <b>8. Use a free CDN tier</b> to serve files from locations near your visitors and add modern compression (Brotli/Gzip). <b>9. Lazy-load below-the-fold images and videos</b> so the visible part of the page renders first. <b>10. Check your hosting</b> — if the server itself responds slowly (a high “time to first byte”), no page fix can compensate; our <a href="#/blog/web-hosting-explained" data-blog-link="web-hosting-explained">web hosting guide</a> explains when an upgrade is genuinely the answer.</p>
<h3>Measure before and after</h3>
<p>Run a free speed test (PageSpeed Insights is the standard) before you start and after each round of fixes. Chase the specific warnings it names for your pages rather than a perfect score — and run our <a href="#/tool/seochecker" data-tool-link="seochecker">On-Page SEO Checker</a> too, since slow, heavy pages and weak on-page SEO often travel together.</p>
<h2>Key takeaways</h2>
<ul><li>Images are the biggest, cheapest win: compress, resize, convert.</li><li>Every script and plugin must justify its weight.</li><li>Caching and a CDN make repeat visits and distant visitors fast.</li></ul>
<h2>Frequently asked questions</h2>
<h3>How fast should a website load?</h3><p>Aim for the main content to appear within about 2.5 seconds on a mobile connection — that is the threshold search engines use for a “good” experience.</p>
<h3>Does speed affect Google rankings?</h3><p>Yes, as one factor among many, and it strongly affects whether visitors stay. Fast pages convert better even where rankings do not move.</p>
<h3>What is the single biggest speed fix?</h3><p>For most sites, image weight. It is common to cut a page's total size by half with image fixes alone.</p>
<h3>My speed score is fine on desktop but bad on mobile — why?</h3><p>Mobile tests simulate slower networks and weaker processors, so heavy images and scripts hurt far more. Optimise for the mobile result; desktop will follow.</p>`},
{slug:"check-if-a-website-is-safe",title:"How to Check If a Website Is Safe Before You Click",cat:"Security",date:"29 October 2026",kw:"check if a website is safe",
seo:"How to Check If a Website Is Safe Before You Click | ToolNovo Blog",
meta:"Learn how to check if a website is safe: read the URL like a detective, spot fake login pages and too-good offers, and use the checks that take under a minute.",
excerpt:"Fake websites steal passwords and card details every day. These quick checks — starting with reading the URL properly — will catch most of them before you click.",
tools:["password"],related:["two-factor-authentication-explained","vpn-explained"],fin:false,
body:`<p>Knowing how to <b>check if a website is safe</b> is a core life skill now: fake shops, fake login pages and fake delivery texts are designed to look flawless. The good news is that most scams fail a few simple checks that take less than a minute. Here is the routine.</p>
<h2>Check if a website is safe by reading its URL properly</h2>
<p>The domain is the part before the first single slash — read it right to left from the “.com” (or “.co.uk” etc.). In <i>secure-paypal-login.example.com</i>, the real domain is <b>example.com</b>; “paypal” is just a subdomain anyone can create. Watch for look-alike spellings (paypa1, arnazon, micros0ft), extra words glued to real brands (paypal-secure.com), and unusual endings. If the domain is not exactly the brand's real domain, stop.</p>
<h2>Look for the signs a safe website has</h2>
<ul><li><b>HTTPS with the padlock</b> — necessary, but not proof of honesty: it only means the connection is encrypted. Scam sites have padlocks too.</li><li><b>Real contact details</b> — a physical address, a working email on the same domain, and a phone number suggest a real business.</li><li><b>A history</b> — established sites have reviews across independent platforms, consistent information, and pages like privacy policies that read like they were written for that business.</li><li><b>Sensible prices</b> — a new site selling popular products at 60–80% off is the oldest trap on the internet.</li></ul>
<h2>Check before you enter anything</h2>
<p>Never reach a login or payment page from a link in an unexpected message. Type the address yourself, or use your saved bookmark or the official app. Before entering card details, search the site's name plus “reviews” or “scam” and read what independent sources say. And whatever happens, protect the accounts that matter with <a href="#/blog/two-factor-authentication-explained" data-blog-link="two-factor-authentication-explained">two-factor authentication</a> and unique passwords from our <a href="#/tool/password" data-tool-link="password">Password Generator</a> — so that even a convincing fake cannot take the account with one stolen password.</p>
<h3>Red flags that mean “leave now”</h3>
<ul><li>Pressure: countdown timers, “only 2 left”, threats that an account closes today.</li><li>Payment by bank transfer, gift cards or crypto only — methods with no buyer protection.</li><li>Spelling errors in the domain, or a page that looks right but has broken links everywhere else.</li><li>A login page reached from an email about a problem you were not expecting.</li></ul>
<h2>Key takeaways</h2>
<ul><li>Read the real domain — everything before it can be faked decoration.</li><li>A padlock means encrypted, not honest.</li><li>Arrive at important sites by typing the address yourself, never from message links.</li></ul>
<h2>Frequently asked questions</h2>
<h3>Does the padlock mean a site is safe?</h3><p>No. It means your connection to the site is encrypted. A scam site can be encrypted too — judge the domain and the business, not the padlock.</p>
<h3>How can I check a link without clicking it?</h3><p>On a computer, hover over it to preview the destination; on a phone, press and hold. If the real domain does not match the organisation that supposedly sent it, do not click.</p>
<h3>What should I do if I entered details on a fake site?</h3><p>Change that password immediately (and anywhere you reused it), turn on 2FA, tell your bank if card details were involved, and watch the account for unfamiliar activity.</p>
<h3>Are review sites reliable for checking?</h3><p>Use several independent sources and read the detailed negative reviews — a wall of short, glowing, same-day reviews is itself a warning sign.</p>`}
);
BLOG_POSTS.push(
{slug:"meta-tags-explained",title:"Meta Tags Explained: Title and Description That Rank",cat:"SEO",date:"28 October 2026",kw:"meta tags",
seo:"Meta Tags Explained: Title and Description That Rank | ToolNovo Blog",
meta:"Meta tags are the title and description searchers see before they click. Learn how meta title and description tags work, ideal lengths, and the mistakes that waste them.",
excerpt:"Your meta title and description are your free advert in Google's results. Here is how they work, how long they should be, and how to write ones people click.",
tools:["metagen","serppreview"],related:["how-search-engines-work","adsense-approval-guide"],fin:false,
body:`<p><b>Meta tags</b> are the snippets of code that tell search engines — and searchers — what a page is about. Two of them run your presence in the results: the title tag, which becomes the clickable headline, and the meta description, the short text beneath it. Get these meta tags right and the same ranking produces more clicks; get them wrong and you are invisible in plain sight.</p>
<h2>The title tag: your headline in search</h2>
<p>The title tag is the strongest on-page signal of what a page covers and the first thing a searcher reads. Good titles put the page's main topic at the front, match what the page genuinely delivers, and read like headlines a human would click. Aim for roughly 50–60 characters so the full title usually displays, and give every page a unique one — duplicated titles across a site confuse both search engines and visitors. Preview exactly how yours will look with our <a href="#/tool/serppreview" data-tool-link="serppreview">SERP Preview Tool</a>.</p>
<h2>The meta description: your free advert</h2>
<p>The meta description does not directly raise rankings — Google says so openly — but it decides whether the searcher clicks you or the result above you. Write it as an advert: what the page offers, who it helps, and one concrete detail or benefit, in about 150–160 characters. Include the phrase a searcher would use, naturally, once. If you skip it, Google will improvise a snippet from your page text, and it is rarely flattering.</p>
<h2>Other meta tags worth knowing</h2>
<ul><li><b>Viewport tag</b> — essential: it makes pages display correctly on phones. Without it, mobile visitors get a shrunken desktop page.</li><li><b>Robots tag</b> — optional instructions like “noindex” for pages you deliberately keep out of search (thank-you pages, account screens).</li><li><b>Open Graph tags</b> — control the title, description and image shown when your page is shared on social media. Test them with an OG preview tool.</li><li><b>Canonical tag</b> — tells search engines which version of a duplicated page is the main one.</li></ul>
<p>Generate clean title and description tags — plus Open Graph tags — in seconds with our <a href="#/tool/metagen" data-tool-link="metagen">Meta Tag Generator</a>. Then check the finished page as a whole with the On-Page SEO Checker.</p>
<h3>Meta tag mistakes that waste good pages</h3>
<ul><li>The same title on every page (“Home”, or the site name repeated).</li><li>Keyword stuffing: “Cheap Shoes, Best Cheap Shoes, Buy Cheap Shoes Online” — unreadable and counterproductive.</li><li>Descriptions that promise what the page does not deliver — clicks that bounce straight back teach Google the page disappoints.</li><li>Leaving descriptions empty on your most important pages.</li></ul>
<h2>Key takeaways</h2>
<ul><li>Title tag: unique, topic first, about 50–60 characters.</li><li>Meta description: an honest advert of about 150–160 characters that earns the click.</li><li>Every page gets its own pair — duplicates waste rankings you already have.</li></ul>
<h2>Frequently asked questions</h2>
<h3>Do meta keywords still matter?</h3><p>No. Google ignores the meta keywords tag entirely, and has for many years. Spend the effort on titles and descriptions instead.</p>
<h3>Why did Google rewrite my title or description?</h3><p>Google rewrites snippets it thinks match a specific search better. Clear, accurate, page-specific titles and descriptions are rewritten least often.</p>
<h3>How long should a meta description be?</h3><p>Around 150–160 characters on desktop; mobile shows less. Put the most persuasive words early.</p>
<h3>Should every page have meta tags?</h3><p>Every page you want found in search, yes. Pages deliberately kept out of search can use a noindex robots tag instead.</p>`},
{slug:"how-search-engines-work",title:"How Search Engines Work, in Plain English",cat:"SEO",date:"27 October 2026",kw:"how search engines work",
seo:"How Search Engines Work, in Plain English | ToolNovo Blog",
meta:"How search engines work explained simply: crawling, indexing and ranking — the three stages every page goes through before it can appear in Google results.",
excerpt:"Crawling, indexing, ranking: every page you have ever found in Google passed through these three stages. Here is how search engines work, without the jargon.",
tools:["seochecker","kwdensity"],related:["meta-tags-explained","adsense-approval-guide"],fin:false,
body:`<p>Understanding <b>how search engines work</b> turns SEO from superstition into common sense. Behind the search box, Google and Bing run a three-stage system: they <b>crawl</b> the web to discover pages, <b>index</b> what they find into a giant library, and <b>rank</b> results for each search. Every practical SEO task you will ever do supports one of these three stages.</p>
<h2>Stage 1: Crawling — how search engines find pages</h2>
<p>Automated programs called crawlers (or spiders) follow links across the web, downloading pages as they go. They start from pages they already know and follow every link they find — which is why internal links between your own pages matter, and why a page nobody links to may never be discovered. Files like robots.txt tell crawlers where they may and may not go, and a sitemap.xml hands them a tidy list of your pages. Both are easy to create: try our Robots.txt Generator and Sitemap Generator.</p>
<h2>Stage 2: Indexing — the giant library</h2>
<p>Crawled pages are analysed — text, headings, images, language, location signals — and stored in the index, a database of hundreds of billions of pages. Not everything crawled gets indexed: duplicates, thin pages and pages marked “noindex” are left out. If a page is not in the index, it cannot appear in results at all, which is why “why isn't my page on Google?” is usually an indexing question, not a ranking one.</p>
<h2>Stage 3: Ranking — how search engines order results</h2>
<p>When you search, the engine scans its index for relevant pages and orders them using hundreds of signals, including:</p>
<ul><li><b>Relevance</b> — how well the page's words, headings and topic match the search's intent.</li><li><b>Quality and trust</b> — original, accurate content; links from other reputable sites act as votes of confidence.</li><li><b>Usability</b> — mobile-friendliness, speed and a page that answers the query without tricks.</li><li><b>Context</b> — your location, language and search history personalise the order.</li></ul>
<p>This is why tools like our <a href="#/tool/seochecker" data-tool-link="seochecker">On-Page SEO Checker</a> focus on titles, headings and content quality — they are the relevance signals you control directly. Checking that your main topic appears naturally in your text (with a <a href="#/tool/kwdensity" data-tool-link="kwdensity">keyword density check</a>) is part of the same stage.</p>
<h3>What this means for your site</h3>
<p>Make pages easy to crawl (clear links, a sitemap), worth indexing (original, substantial content) and easy to rank (honest titles, helpful structure, other sites happy to link to you). Our <a href="#/blog/meta-tags-explained" data-blog-link="meta-tags-explained">meta tags guide</a> covers the ranking signals on the page itself.</p>
<h2>Key takeaways</h2>
<ul><li>Crawling discovers pages, indexing stores them, ranking orders them.</li><li>No index, no ranking — discovery and quality come before everything else.</li><li>SEO is simply helping each of the three stages do its job.</li></ul>
<h2>Frequently asked questions</h2>
<h3>How long does it take for a new page to appear on Google?</h3><p>Anywhere from hours to weeks. Submitting your sitemap in Google Search Console and linking the page from your existing pages speeds discovery up.</p>
<h3>Why is my page crawled but not indexed?</h3><p>Common causes: thin or duplicated content, a noindex tag, or the page being too similar to another. Improve the content's usefulness and uniqueness first.</p>
<h3>Do paid ads affect organic rankings?</h3><p>No. Advertising and organic ranking are separate systems; paying for ads does not raise your natural results.</p>
<h3>How often do search engines re-crawl pages?</h3><p>Popular, frequently updated pages may be revisited daily; quiet pages, every few weeks or months. Fresh, useful updates encourage more frequent visits.</p>`},
{slug:"adsense-approval-guide",title:"How Google AdSense Approval Works: What New Sites Must Fix First",cat:"Tech Guides",date:"26 October 2026",kw:"AdSense approval",
seo:"How Google AdSense Approval Works: What New Sites Must Fix First | ToolNovo Blog",
meta:"AdSense approval explained: what Google actually checks on a new site — original content, essential pages, navigation, policy compliance — and the common reasons for rejection.",
excerpt:"Most AdSense rejections come from a short list of fixable problems. Here is what Google checks before approving a new site, and what to fix first.",
tools:["seochecker","readability"],related:["how-search-engines-work","meta-tags-explained"],fin:false,
body:`<p><b>AdSense approval</b> is the gate between building a website and earning from it, and for new sites it can feel mysterious: some are approved in days, others are rejected repeatedly with vague messages. In practice, Google checks a knowable list of things — content quality, site completeness and policy compliance. This guide explains how AdSense approval works and what to fix first.</p>
<h2>What Google looks for before AdSense approval</h2>
<ul><li><b>Original, substantial content</b> — pages that genuinely help visitors, written by you, long enough to be useful. Thin pages, copied text and collections of embeds are the top rejection cause.</li><li><b>A complete, working site</b> — clear navigation, no broken links, no “under construction” pages, and a design that works on mobile.</li><li><b>The essential pages</b> — About, Contact and a proper Privacy Policy that discloses advertising cookies. Missing legal pages signal an unfinished site.</li><li><b>Policy-safe topics and behaviour</b> — no copied or prohibited content, no misleading buttons, no encouraging accidental ad clicks.</li></ul>
<h2>The fixes that solve most rejections</h2>
<p><b>1. Deepen thin content.</b> Every important page should stand on its own: a clear purpose, real information, and enough depth that a visitor leaves satisfied. On ToolNovo, every tool page carries a full written guide beneath the tool for exactly this reason. <b>2. Publish the essential pages</b> and link them in the footer. <b>3. Fix navigation and broken links</b> — reviewers click around like visitors. <b>4. Check readability</b> — clear headings and short paragraphs (our <a href="#/tool/readability" data-tool-link="readability">Readability Checker</a> helps) signal a site made for humans. <b>5. Run an on-page check</b> with the <a href="#/tool/seochecker" data-tool-link="seochecker">SEO Checker</a> so titles and descriptions are in place.</p>
<h2>What happens during review</h2>
<p>After you add Google's verification code, reviewers (automated and human) crawl your site. Reviews take from a day to a few weeks. If you are rejected, the message names a category — “low value content” is the most common — and you may reapply after fixing the issues. Reapplying without changes simply repeats the result.</p>
<h3>After approval: staying approved</h3>
<p>Approval is not permanent immunity. Keep publishing original content, never click your own ads or ask others to, place ads so they do not trick visitors, and keep the Privacy Policy accurate. Sites that treat AdSense as a long-term partnership with their readers keep their accounts; sites that chase quick clicks lose them. Understanding <a href="#/blog/how-search-engines-work" data-blog-link="how-search-engines-work">how search engines work</a> helps you grow the honest traffic that makes ads worthwhile in the first place.</p>
<h2>Key takeaways</h2>
<ul><li>Approval rests on original content, a complete site and policy compliance.</li><li>“Low value content” usually means thin, copied or unfinished pages — fix depth first.</li><li>Essential pages (About, Contact, Privacy Policy) are not optional decoration.</li></ul>
<h2>Frequently asked questions</h2>
<h3>How much traffic do I need for AdSense approval?</h3><p>There is no official traffic minimum. Content quality and site completeness decide approval; traffic decides earnings afterwards.</p>
<h3>How many pages or posts should a new site have?</h3><p>No fixed number is published, but a site with a solid body of complete, useful pages — rather than a handful of stubs — presents far better. Quality and completeness beat raw count.</p>
<h3>Why was I rejected for “low value content”?</h3><p>Usually thin pages, content copied or lightly rewritten from elsewhere, or pages that exist only to hold ads. Add genuine depth and originality, then reapply.</p>
<h3>Can I apply again after a rejection?</h3><p>Yes, once you have fixed the named issues. There is no penalty for reapplying after real improvements.</p>`},
{slug:"youtube-earnings-guide",title:"How to Grow a YouTube Channel's Earnings: A Beginner's Creator Guide",cat:"Tech Guides",date:"25 October 2026",kw:"YouTube earnings",
seo:"How to Grow a YouTube Channel's Earnings: A Beginner's Creator Guide | ToolNovo Blog",
meta:"YouTube earnings explained for beginners: how channels actually make money, what RPM means, and the honest levers — watch time, niche, consistency — that grow a channel's income.",
excerpt:"YouTube income is not magic or luck — it is watch time, topic and consistency, multiplied over months. Here is how channel earnings work and how to grow them honestly.",
tools:["ytearnings","engagementrate"],related:["freelancing-rates-guide","adsense-approval-guide"],fin:true,
body:`<p><b>YouTube earnings</b> are often talked about in extremes — overnight fortunes or nothing at all. The reality is a system: YouTube pays creators a share of advertising revenue, and the size of that share depends on measurable things you can influence. This guide explains how YouTube earnings work and the levers that grow them. Any figures are illustrative estimates, not promises — every channel's results differ.</p>
<h2>How YouTube earnings actually work</h2>
<p>Once a channel qualifies for the YouTube Partner Program (subscriber and watch-hour thresholds, plus policy compliance), ads run on its videos and the creator receives a share of what advertisers pay. The number creators watch is <b>RPM</b> — revenue per 1,000 views after YouTube's share. RPM varies enormously: finance, business and software topics attract high-value advertisers, while general entertainment pays far less per view. That is why a small, focused channel can out-earn a much larger unfocused one.</p>
<p>Our <a href="#/tool/ytearnings" data-tool-link="ytearnings">YouTube Earnings Estimator</a> lets you model views and RPM ranges to see plausible scenarios — treat the output as a planning estimate, never a guarantee.</p>
<h2>The levers that grow YouTube earnings</h2>
<ul><li><b>Watch time</b> — videos people watch to the end get recommended more, and more ads are seen. Hook the first 30 seconds, deliver the promise of the title, cut the padding.</li><li><b>Topic choice</b> — searchable, problem-solving topics in a defined niche compound: each video brings viewers who want the next one.</li><li><b>Consistency</b> — a sustainable schedule (even one video a week) beats bursts followed by silence.</li><li><b>Engagement</b> — comments, likes and shares signal a living community; check yours with the <a href="#/tool/engagementrate" data-tool-link="engagementrate">Engagement Rate Calculator</a>.</li><li><b>A back catalogue</b> — every good video keeps earning while you sleep; channels grow on libraries, not singles.</li></ul>
<h2>Beyond ads: other income streams</h2>
<p>Mature channels add sponsorships (often worth more than ads), affiliate links, their own products or services, and memberships. These streams reward trust, which is why honest channels grow them and hype channels cannot. The same principle as <a href="#/blog/adsense-approval-guide" data-blog-link="adsense-approval-guide">AdSense approval</a> applies: platforms reward creators who keep audiences genuinely satisfied.</p>
<h3>What not to do</h3>
<p>Buying views or subscribers, re-uploading others' content, or making misleading titles may spike a graph briefly — and risks demonetisation or channel termination, which ends all earnings at once. Slow, original and consistent is not just the ethical route; it is the durable business model.</p>
<h2>Key takeaways</h2>
<ul><li>Earnings = views × RPM; your niche sets the RPM range, your quality sets the views.</li><li>Watch time and consistency are the growth engine; the catalogue is the asset.</li><li>Estimates are planning tools — no honest guide can promise a channel's income.</li></ul>
<h2>Frequently asked questions</h2>
<h3>How many views do you need to make money on YouTube?</h3><p>You first need Partner Program eligibility (currently 1,000 subscribers plus watch-time or Shorts thresholds). After that, earnings scale with views and RPM — there is no fixed “views = dollars” rate.</p>
<h3>Why do some channels earn more per view than others?</h3><p>Advertiser demand for their audience. Topics like finance, business and software attract higher bids than general entertainment, raising RPM.</p>
<h3>How long does it take to earn from a new channel?</h3><p>For most creators, months of consistent publishing. Treat the first phase as building a catalogue and an audience; income follows.</p>
<h3>Do Shorts earn the same as long videos?</h3><p>No — Shorts revenue per view is typically much lower. They are excellent for discovery and subscribers, while long-form videos carry most ad income.</p>`},
{slug:"freelancing-rates-guide",title:"Freelancing Rates: How to Price Your Work Without Guessing",cat:"Productivity",date:"24 October 2026",kw:"freelancing rates",
seo:"Freelancing Rates: How to Price Your Work Without Guessing | ToolNovo Blog",
meta:"Set freelancing rates from maths, not guesswork: work backwards from the income you need, account for non-billable time and costs, and price with confidence.",
excerpt:"Most freelancers set their rate by copying someone else's. Here is the backwards calculation — income, costs, billable hours — that produces a rate you can defend.",
tools:["freelancerate","salary"],related:["youtube-earnings-guide","emergency-fund-guide"],fin:true,
body:`<p>Setting <b>freelancing rates</b> is where talented people most often underpay themselves: they copy a number from a forum, or divide a salary by working hours and forget that freelancers are not billable every hour. This guide shows how to build freelancing rates from your real numbers — the income you need, the costs you carry, and the hours you can actually sell.</p>
<h2>Start from the income you need</h2>
<p>Decide the yearly income your freelance work must produce — comparable to a fair salary for your skill, not a dream figure and not a survival figure. Then add the costs an employer would normally cover: tax contributions beyond employee levels, pension saving, insurance, software, equipment and accounting. A common approach adds 20–30% on top of the salary equivalent to cover these. Our <a href="#/tool/freelancerate" data-tool-link="freelancerate">Freelance Rate Calculator</a> walks through exactly this build-up.</p>
<h2>Count only billable hours</h2>
<p>Here is where most rates collapse. From roughly 2,000 working hours in a year, subtract holidays, sick days, paperwork, marketing, invoicing and the gaps between projects. Many freelancers can honestly bill 50–65% of their time. Divide your income-plus-costs target by those billable hours — the result is your minimum sustainable hourly rate. Compare it with the employed equivalent using the <a href="#/tool/salary" data-tool-link="salary">Salary to Hourly Calculator</a> and the gap will make sense: your rate must be higher per hour because you sell fewer hours and carry more costs.</p>
<div class="example-box"><p><b>Example:</b> target income $60,000 + $12,000 of costs and provisions = $72,000 to recover. Billable time: 1,100 hours a year. $72,000 ÷ 1,100 ≈ <b>$65 an hour</b> — the floor, before any margin for quiet months.</p></div>
<h2>Hourly, daily or per project?</h2>
<ul><li><b>Hourly</b> — simple and fair for open-ended work; can punish you for getting faster.</li><li><b>Day rates</b> — standard for consulting and contracting; usually the hourly rate × 7–8 with a small commitment discount.</li><li><b>Project pricing</b> — quote the outcome, not the hours: estimate hours × rate, add a buffer for revisions, and let efficiency become profit. Clients often prefer the certainty.</li></ul>
<h3>Raise rates like a professional</h3>
<p>Review rates yearly, raise them for new clients first, and give existing clients notice and a reason tied to demand and results. Keep an <a href="#/blog/emergency-fund-guide" data-blog-link="emergency-fund-guide">emergency fund</a> — nothing weakens pricing like needing the next project at any price. And track what you actually earned per project; the rate on paper and the rate in reality are often different numbers.</p>
<h2>Key takeaways</h2>
<ul><li>Rate = (income needed + business costs) ÷ honestly billable hours.</li><li>Non-billable time is the hidden factor that sinks guessed rates.</li><li>Project pricing rewards skill and speed; review rates every year.</li></ul>
<h2>Frequently asked questions</h2>
<h3>How do I know if my rate is too low?</h3><p>Signs: you are fully booked but still short of money, you dread new projects at the agreed price, and clients never negotiate. The maths in this guide gives you an objective floor.</p>
<h3>Should I publish my rates?</h3><p>Publishing a starting price (“projects from…”) filters out mismatched enquiries and saves everyone time. Many freelancers keep exact quotes private but anchor expectations publicly.</p>
<h3>What if a client says my rate is too high?</h3><p>Offer a smaller scope at the same rate rather than the same scope cheaper — reducing deliverables protects your pricing; discounting trains the market to wait you out.</p>
<h3>Do I charge for revisions and meetings?</h3><p>Define it in the agreement before starting: include a set number of revision rounds, and count long meetings as billable time or within the project estimate.</p>`}
);
BLOG_POSTS.push(
{slug:"how-business-loans-work",title:"How Business Loans Work: Rates, Terms and Total Cost",cat:"Money & Finance",date:"23 October 2026",kw:"business loans",
seo:"How Business Loans Work: Rates, Terms and Total Cost | ToolNovo Blog",
meta:"Business loans explained for owners: how lenders set rates, what terms really mean, and how to judge a loan by its total cost — with a worked example.",
excerpt:"A business loan is a tool, not free money. Here is how rates, terms and fees combine into the real cost — and how to tell a helpful loan from a harmful one.",
tools:["loan","autoloan"],related:["break-even-point-explained","bookkeeping-basics-small-business"],fin:true,
body:`<p><b>Business loans</b> let a company buy equipment, stock, vehicles or time — but they are priced very differently from personal loans, and the headline rate is only part of the story. This guide explains how business loans work: what lenders look at, how rates and terms interact, and how to judge any offer by its total cost.</p>
<h2>How business loans are priced</h2>
<p>Lenders price risk. A business loan rate reflects the trading history of the business, its accounts and cash flow, the owner's credit record, and whether the loan is secured against an asset (equipment, property, vehicles) or unsecured. Secured loans are usually cheaper because the lender can recover the asset; unsecured loans and newer businesses pay more. Loans also come as fixed sums repaid monthly, or as flexible facilities you draw on when needed — the second suits seasonal cash flow but can cost more per pound borrowed.</p>
<h2>Terms, rates and the total cost of business loans</h2>
<div class="example-box"><p><b>Example:</b> borrowing $40,000 over 5 years at 9% costs about $830 a month and roughly $9,800 in interest. The same loan over 3 years at 8% costs about $1,253 a month but only around $5,100 in interest. Shorter is more demanding monthly — and much cheaper overall.</p></div>
<p>Always ask for the <b>total amount repayable</b>, including arrangement fees, and model the payment against your slowest months, not your best. Our <a href="#/tool/loan" data-tool-link="loan">Loan Calculator</a> shows monthly payment, total interest and payoff date for any amount, rate and term — run the lender's exact figures through it before signing.</p>
<h2>What lenders want to see</h2>
<ul><li><b>Clean, current accounts</b> — ideally prepared with basic bookkeeping discipline (see our <a href="#/blog/bookkeeping-basics-small-business" data-blog-link="bookkeeping-basics-small-business">bookkeeping basics guide</a>).</li><li><b>A clear purpose</b> — what the money buys and how it earns or saves more than it costs.</li><li><b>Cash flow headroom</b> — evidence the payment fits in a bad month, not just a good one.</li><li><b>Your break-even maths</b> — lenders respect owners who know their numbers (our <a href="#/blog/break-even-point-explained" data-blog-link="break-even-point-explained">break-even guide</a> helps).</li></ul>
<h3>Personal guarantees — read this part twice</h3>
<p>Many small-business loans require a personal guarantee: if the business cannot pay, you pay personally. That changes the risk completely. Never sign a guarantee you have not read, and weigh it as your own borrowing, because legally that is what it is.</p>
<h2>Key takeaways</h2>
<ul><li>Judge business loans on total repayable cost, not the headline rate.</li><li>Secured and established borrowers pay less; preparation lowers your price.</li><li>A personal guarantee makes business debt your debt — treat it that way.</li></ul>
<h2>Frequently asked questions</h2>
<h3>How much can a small business borrow?</h3><p>It depends on turnover, profit, credit and security offered. Lenders commonly relate the amount to a multiple of monthly revenue or profit — there is no universal figure.</p>
<h3>Is a loan better than an overdraft or credit line?</h3><p>For a one-off purchase, a fixed loan is usually cheaper and more predictable. For fluctuating short-term needs, a facility you draw on can cost less overall because you only pay interest on what you use.</p>
<h3>Do business loans affect personal credit?</h3><p>They can — especially with a personal guarantee or for sole traders, where business and personal finances are legally the same.</p>
<h3>What is APR for a business loan?</h3><p>Some lenders must show it, others quote flat rates or factor rates. Convert everything to total amount repayable over the term to compare fairly.</p>`},
{slug:"bookkeeping-basics-small-business",title:"Bookkeeping Basics Every Small Business Should Know",cat:"Money & Finance",date:"22 October 2026",kw:"bookkeeping basics",
seo:"Bookkeeping Basics Every Small Business Should Know | ToolNovo Blog",
meta:"Bookkeeping basics for small businesses: what to record, how often, the difference between cash and profit, and the simple weekly routine that keeps you tax-ready.",
excerpt:"Good bookkeeping is not accounting wizardry — it is a small weekly habit. Here are the records every small business needs and the routine that keeps them painless.",
tools:["freelancerate","budgetrule"],related:["how-business-loans-work","side-hustle-taxes-guide"],fin:true,
body:`<p><b>Bookkeeping basics</b> are the difference between a business that knows its numbers and one that guesses until tax season. Bookkeeping simply means recording every amount that comes in and goes out, in an organised way, while it is still fresh. This guide covers what to record, the cash-versus-profit trap, and a weekly routine small enough to actually keep.</p>
<h2>The bookkeeping basics: what to record</h2>
<ul><li><b>Every sale</b> — date, customer, amount, and whether it has been paid yet.</li><li><b>Every expense</b> — date, supplier, what it was for, amount, and the receipt or invoice as proof.</li><li><b>Money owed to you and by you</b> — unpaid invoices in both directions.</li><li><b>Tax collected</b> — sales tax or VAT on sales is never your money; track it separately from income.</li></ul>
<p>Keep business and personal money in separate accounts from day one. Mixing them is the single most common bookkeeping mess, and untangling a year of mixed statements costs far more than the second account ever would.</p>
<h2>Cash is not profit</h2>
<p>The most dangerous misunderstanding in small business: money in the bank feels like profit. It is not. Profit is sales minus <i>all</i> costs — including stock bought but unsold, tax that will be due, and invoices you have issued but not yet been paid for. A business can be profitable and cash-poor (waiting on late payers) or cash-rich and unprofitable (spending next month's tax). Your records are how you see both truths at once.</p>
<h2>A weekly bookkeeping routine that sticks</h2>
<ul><li><b>30 minutes, same time weekly:</b> enter the week's sales and expenses, file the receipts (a photo is fine).</li><li><b>Chase overdue invoices</b> — politely, promptly; late payment is a cash-flow killer (our <a href="#/blog/how-to-write-an-invoice" data-blog-link="how-to-write-an-invoice">invoice guide</a> covers wording that gets paid faster).</li><li><b>Reconcile the bank account</b> — match records to the statement so nothing is missed or doubled.</li><li><b>Monthly:</b> set aside a percentage of income for tax in a separate account, and glance at the big picture — what sold, what cost, what is owed.</li></ul>
<h3>Spreadsheets or software?</h3>
<p>A tidy spreadsheet is fine at very low volume; dedicated bookkeeping software earns its cost quickly by importing bank transactions, generating invoices and preparing tax figures. Whichever you choose, consistency beats sophistication — the same simple system used weekly beats advanced software opened twice a year. Knowing your numbers also strengthens everything else: pricing (our <a href="#/blog/how-to-price-a-product" data-blog-link="how-to-price-a-product">pricing guide</a>), loan applications and honest <a href="#/tool/freelancerate" data-tool-link="freelancerate">rate-setting</a>.</p>
<h2>Key takeaways</h2>
<ul><li>Record sales, expenses, debts and tax — weekly, while it is fresh.</li><li>Separate accounts from day one; cash in the bank is not profit.</li><li>Reconcile monthly and set tax money aside as you earn.</li></ul>
<h2>Frequently asked questions</h2>
<h3>How long should I keep records?</h3><p>Typically at least 5–7 years for tax purposes, depending on your country. Digital copies are acceptable in most systems — keep backups.</p>
<h3>Do I need an accountant?</h3><p>Not for day-to-day bookkeeping, but a good accountant at year-end (and when you start) usually saves more than they cost. They cannot help, though, if the underlying records are missing.</p>
<h3>What is double-entry bookkeeping?</h3><p>A system where every transaction is recorded in two places (for example, cash down, stock up), which makes errors easier to spot. Software does this invisibly; you just enter transactions normally.</p>
<h3>Can I do bookkeeping myself?</h3><p>Yes — most small businesses do. The skill is the habit, not the maths.</p>`},
{slug:"how-to-price-a-product",title:"How to Price a Product: Costs, Margin and Markup Explained",cat:"Money & Finance",date:"21 October 2026",kw:"how to price a product",
seo:"How to Price a Product: Costs, Margin and Markup Explained | ToolNovo Blog",
meta:"How to price a product without guessing: count every cost, understand margin vs markup (they are not the same), and set a price your business can survive on.",
excerpt:"Pricing too low is the quietest way to go broke. Learn how to price a product from your true costs, and why margin and markup are dangerously different numbers.",
tools:["margin","unitprice","discount"],related:["break-even-point-explained","bookkeeping-basics-small-business"],fin:true,
body:`<p>Knowing <b>how to price a product</b> is a survival skill: price too high and nobody buys; price too low and every sale quietly loses money. Good pricing starts from your true costs, adds a margin your business can live on, and then checks itself against the market. This guide walks through each step — including the margin-versus-markup confusion that trips up experienced sellers.</p>
<h2>Step 1: Count the full cost of the product</h2>
<p>Your cost is more than the purchase or materials price. Add packaging, shipping to you, platform and payment fees, returns allowance, and a share of your time and overheads (storage, software, stall or listing fees). Sellers who price from the materials cost alone are donating the rest. Our <a href="#/tool/unitprice" data-tool-link="unitprice">Unit Price Calculator</a> helps compare supplier offers fairly when pack sizes differ.</p>
<h2>Step 2: Margin and markup — not the same thing</h2>
<ul><li><b>Markup</b> is added on top of cost: cost $40, markup 50% → price $60.</li><li><b>Margin</b> is the share of the final price that is profit: price $60, cost $40 → profit $20, which is a <b>33% margin</b>.</li></ul>
<p>Confusing the two is expensive: a seller who wants a 50% margin but applies a 50% markup actually earns 33% — on thin margins, that gap is the whole business. Use our <a href="#/tool/margin" data-tool-link="margin">Profit Margin Calculator</a> to convert between cost, price, margin and markup without the headache.</p>
<h2>Step 3: Sanity-check against the market</h2>
<p>Now compare with competitors. If your cost-based price is far above the market, the answer is rarely “charge it anyway” — it is to cut costs, differentiate the product (quality, service, story, speed), or choose a different product. If you are far below the market, you may be leaving money on the table — or sitting on a genuine advantage worth advertising. Also plan for discounts before you need them: a price that only works at full price breaks the first time you run a sale, so check sale scenarios with the <a href="#/tool/discount" data-tool-link="discount">Discount Calculator</a>.</p>
<h3>Do not forget the break-even check</h3>
<p>Your price must also cover your fixed costs at a realistic sales volume. Our <a href="#/blog/break-even-point-explained" data-blog-link="break-even-point-explained">break-even guide</a> shows how price, costs and volume fit together — the final check before any price goes public.</p>
<h2>Key takeaways</h2>
<ul><li>Price from full cost — materials, fees, packaging, time and overheads.</li><li>Margin is profit as a share of price; markup is added to cost. Never confuse them.</li><li>Check the price against the market and against your break-even point.</li></ul>
<h2>Frequently asked questions</h2>
<h3>What is a good profit margin?</h3><p>It varies hugely by industry — grocery margins are thin, digital products are fat. Compare within your own sector, and judge your margin after all costs, not before.</p>
<h3>Should I match competitors' prices?</h3><p>Only if your costs let you. Matching a price below your break-even is volunteering for losses; compete on value where you cannot compete on cost.</p>
<h3>How often should I review prices?</h3><p>Whenever supplier costs, fees or shipping change — and at least a few times a year. Small, regular increases beat rare, shocking ones.</p>
<h3>Does a lower price always sell more?</h3><p>Not always. Price signals quality; too cheap can reduce trust. Test changes on part of your range and watch real results.</p>`},
{slug:"side-hustle-taxes-guide",title:"Side Hustle Taxes: What Freelancers and Sellers Should Track",cat:"Money & Finance",date:"20 October 2026",kw:"side hustle taxes",
seo:"Side Hustle Taxes: What Freelancers and Sellers Should Track | ToolNovo Blog",
meta:"Side hustle taxes explained in general terms: what income counts, which expenses to record, why you should set money aside as you earn, and when to register.",
excerpt:"Earning on the side is great — until the tax bill arrives as a surprise. Here is what to track from your very first sale so side hustle taxes never ambush you.",
tools:["takehome","freelancerate"],related:["freelancing-rates-guide","bookkeeping-basics-small-business"],fin:true,
body:`<p><b>Side hustle taxes</b> catch people out for one simple reason: the income feels informal, but tax authorities do not see it that way. Whether it is freelancing, selling online, creating content or driving at weekends, income from a side hustle is generally taxable — and tracking it from day one turns a scary bill into a planned expense. This is general information about what to track, not personal tax advice; rules and thresholds differ by country and change over time.</p>
<h2>Side hustle taxes: what counts as income</h2>
<p>Almost everything you are paid for the work or goods: client fees, platform payouts, sales revenue, tips, sponsorship and ad income. It counts when you earn it, whether or not anyone sends you a form. Platforms increasingly report seller and creator income to tax authorities automatically, so “they will never know” is not a plan — it is a liability.</p>
<h2>What to track from the first sale</h2>
<ul><li><b>Every payment in</b> — date, source, amount (your <a href="#/blog/bookkeeping-basics-small-business" data-blog-link="bookkeeping-basics-small-business">bookkeeping routine</a> covers this).</li><li><b>Business expenses</b> — materials, software, equipment, platform fees, mileage and a fair share of home-working costs. Legitimate expenses reduce taxable profit in most systems.</li><li><b>Receipts and statements</b> — keep digital copies; memory is not evidence.</li><li><b>Registration and deadlines</b> — many systems require you to register as self-employed once earnings pass a threshold, and to file annually. Check your own tax authority's current rules early, not at the deadline.</li></ul>
<h2>The habit that prevents every tax panic</h2>
<p>Open a separate account and move a fixed percentage of every side-hustle payment into it the day it arrives — many people use 20–30% as a rough holding figure until they know their actual rate. The money is there when the bill comes, and anything left over is a genuine bonus. Our <a href="#/tool/takehome" data-tool-link="takehome">Take-Home Pay Calculator</a> helps employed earners see how additional income interacts with their salary tax, and the <a href="#/tool/freelancerate" data-tool-link="freelancerate">Freelance Rate Calculator</a> helps you price work so tax is covered from the start.</p>
<h3>When a side hustle becomes a business</h3>
<p>Regular trading with the intention to profit is a business in most tax systems, whatever you call it. As income grows, so do the questions — registering a company, charging sales tax or VAT, hiring help. That is the moment a one-off session with an accountant pays for itself many times over.</p>
<h2>Key takeaways</h2>
<ul><li>Side hustle income is generally taxable from the first payment — track it all.</li><li>Record expenses with receipts; they legitimately reduce the tax bill.</li><li>Set a percentage aside from every payment, and check your registration duties early.</li></ul>
<h2>Frequently asked questions</h2>
<h3>Do I pay tax if my side hustle earns very little?</h3><p>Many systems have a small trading allowance or threshold below which tax is not due — but you may still need to report or register above certain levels. Check your own authority's current figures.</p>
<h3>Can I deduct my laptop and phone?</h3><p>Usually the business-use portion of equipment and bills is deductible. Keep records of how you split personal and business use.</p>
<h3>What if I did not track last year?</h3><p>Reconstruct from bank and platform statements — they hold most of the story. Then start the weekly habit now; late order is far better than none.</p>
<h3>Should I register as a company?</h3><p>Not automatically. Many side hustles are taxed most simply as a sole trader/self-employed. The right structure depends on income, risk and country — a professional can model both in one session.</p>`},
{slug:"how-to-write-an-invoice",title:"How to Write an Invoice That Gets Paid Faster",cat:"Money & Finance",date:"19 October 2026",kw:"how to write an invoice",
seo:"How to Write an Invoice That Gets Paid Faster | ToolNovo Blog",
meta:"How to write an invoice that gets paid on time: the details every invoice needs, payment terms that work, and the polite follow-up sequence that clears late payers.",
excerpt:"Late payment is often an invoice problem, not a client problem. Here is what a professional invoice includes and the habits that get it paid on the first ask.",
tools:["invoice","freelancerate"],related:["bookkeeping-basics-small-business","freelancing-rates-guide"],fin:true,
body:`<p>Learning <b>how to write an invoice</b> properly is worth real money: clear invoices are paid measurably faster than vague ones, because they give the payer everything they need and no excuse to delay. This guide covers the details every invoice must include, terms that encourage prompt payment, and what to do when payment still does not arrive.</p>
<h2>How to write an invoice: the essential details</h2>
<ul><li><b>Your business name and contact details</b>, plus the client's name and billing contact.</li><li><b>A unique invoice number</b> and the invoice date — essential for both sides' records.</li><li><b>An itemised list</b> — what was delivered, quantities, rates and the amount for each line. “Services: $800” invites questions; questions invite delay.</li><li><b>Subtotal, any tax, and the total due</b>, shown clearly.</li><li><b>Payment details and terms</b> — exactly how to pay (bank details or payment link) and by when (“due within 14 days” beats “due on receipt”, which everyone interprets differently).</li><li><b>A reference to the agreement</b> — the project name, purchase order number or contract, so the payer's accounts team can approve it without a treasure hunt.</li></ul>
<p>Build yours in seconds with our free <a href="#/tool/invoice" data-tool-link="invoice">Invoice Generator</a> — it totals the lines, adds tax and produces a clean invoice you can copy or print.</p>
<h2>Habits that get invoices paid faster</h2>
<ul><li><b>Send immediately</b> on delivery — invoices sent the same day are paid sooner than invoices sent at month-end.</li><li><b>Agree terms before the work</b> — payment period, late fees where lawful, and who approves payment.</li><li><b>Send to the right person</b> — the person who can actually release payment, with a copy to your day-to-day contact.</li><li><b>Make paying effortless</b> — bank transfer details printed on the invoice, or a payment link. Every extra step costs days.</li></ul>
<h3>When an invoice goes overdue</h3>
<p>Follow up politely and promptly: a friendly reminder a day or two after the due date (“just checking this reached you”), a firmer note at two weeks restating the amount and terms, and a clear final notice after that. Keep every message professional and in writing — most late payment is disorganisation, not malice, and the supplier who follows up systematically is the one who gets paid first. Your records of all this live in your <a href="#/blog/bookkeeping-basics-small-business" data-blog-link="bookkeeping-basics-small-business">bookkeeping system</a>.</p>
<h2>Key takeaways</h2>
<ul><li>Itemise, number, date and total every invoice — and state exactly how and by when to pay.</li><li>Agree terms upfront and invoice the moment work is delivered.</li><li>Systematic, polite follow-up is what separates paid invoices from pending ones.</li></ul>
<h2>Frequently asked questions</h2>
<h3>What payment terms should I use?</h3><p>14 days is a strong default for small businesses; 30 days is common with larger companies. Shorter terms improve cash flow — what matters most is agreeing them before work starts.</p>
<h3>Can I charge for late payment?</h3><p>In many places, yes — statutory interest or a late fee agreed in your terms. State it on the invoice; you can choose whether to enforce it with good clients.</p>
<h3>Invoice or receipt — what is the difference?</h3><p>An invoice requests payment; a receipt confirms payment was received. Send the invoice first, the receipt after they pay.</p>
<h3>Should I include tax on my invoice?</h3><p>If you are registered for sales tax or VAT, yes — show it as its own line with your registration number. If you are not registered, do not add it.</p>`},
{slug:"break-even-point-explained",title:"Break-Even Point Explained for New Businesses",cat:"Money & Finance",date:"18 October 2026",kw:"break-even point",
seo:"Break-Even Point Explained for New Businesses | ToolNovo Blog",
meta:"The break-even point explained simply: fixed costs, variable costs and contribution — how to calculate how much you must sell before your business makes its first profit.",
excerpt:"Break-even is the most useful number a new business can know: the sales level where costs are covered and profit begins. Here is the simple calculation.",
tools:["breakeven","margin"],related:["how-to-price-a-product","how-business-loans-work"],fin:true,
body:`<p>The <b>break-even point</b> is the level of sales at which your business covers all its costs — below it you lose money, above it you make profit. It converts a vague hope (“sell enough”) into a precise target (“sell 214 units a month”), which is why lenders, landlords and sensible owners all ask for it. This guide explains the break-even point with a worked example you can adapt in minutes.</p>
<h2>The three ingredients of the break-even point</h2>
<ul><li><b>Fixed costs</b> — costs that stay the same whatever you sell: rent, insurance, software, salaries, loan payments. Add up a month's worth.</li><li><b>Variable cost per unit</b> — what each sale costs you: materials, packaging, shipping, platform fees.</li><li><b>Price per unit</b> — what the customer pays.</li></ul>
<p>The difference between price and variable cost is called the <b>contribution</b> — the amount each sale contributes towards covering fixed costs. Break-even units = fixed costs ÷ contribution per unit.</p>
<div class="example-box"><p><b>Example:</b> fixed costs are $3,000 a month. You sell a product for $50; each unit costs $22 in materials, packaging and fees. Contribution = $28. Break-even = $3,000 ÷ $28 ≈ <b>108 units a month</b> (about $5,400 of sales). Unit 109 is where profit starts.</p></div>
<p>Run your own numbers in our <a href="#/tool/breakeven" data-tool-link="breakeven">Break-Even Calculator</a> — change the price or costs and watch the target move.</p>
<h2>Using your break-even point</h2>
<ul><li><b>Pricing decisions</b> — a lower price needs many more sales to break even; the calculator shows exactly how many (pricing method in our <a href="#/blog/how-to-price-a-product" data-blog-link="how-to-price-a-product">product pricing guide</a>).</li><li><b>Cost control</b> — every fixed cost you cut lowers the target permanently.</li><li><b>Reality checks</b> — if break-even needs 108 sales a month and your market realistically offers 60, the plan — not the effort — needs changing.</li><li><b>Loan readiness</b> — lenders ask because it proves you understand your business (see <a href="#/blog/how-business-loans-work" data-blog-link="how-business-loans-work">how business loans work</a>).</p></ul>
<h3>Break-even for services</h3>
<p>Service businesses break even in hours instead of units: fixed costs ÷ (hourly rate − variable cost per hour, such as subcontractors or travel). The logic is identical — and it is also how honest freelance day rates are built.</p>
<h2>Key takeaways</h2>
<ul><li>Break-even units = fixed costs ÷ (price − variable cost per unit).</li><li>Know the number monthly, and recheck it whenever prices or costs change.</li><li>If the target is unreachable, change the model — price, costs or product — not just the effort.</li></ul>
<h2>Frequently asked questions</h2>
<h3>Is break-even the same as profit?</h3><p>No — break-even is zero profit, zero loss. It is the threshold profit starts beyond, which is exactly why it matters.</p>
<h3>Should my salary count as a fixed cost?</h3><p>Yes, if the business must pay you to survive. Excluding your own pay flatters the number and hides the real target.</p>
<h3>What if I sell several products?</h3><p>Use a weighted-average contribution based on your typical sales mix, or calculate break-even in revenue terms: fixed costs ÷ overall margin percentage.</p>
<h3>How often should I recalculate?</h3><p>Whenever rent, prices, supplier costs or fees change — and at least quarterly while the business is young.</p>`},
{slug:"llc-vs-sole-trader-guide",title:"LLC vs Sole Trader: A Plain-English Starting Guide",cat:"Money & Finance",date:"17 October 2026",kw:"LLC vs sole trader",
seo:"LLC vs Sole Trader: A Plain-English Starting Guide | ToolNovo Blog",
meta:"LLC vs sole trader explained in general terms: liability, tax paperwork, costs and credibility — the differences that matter when you are choosing how to start a business.",
excerpt:"The first legal decision in business: trade as yourself, or form a company? A plain-English comparison of liability, paperwork and cost — general information, not legal advice.",
tools:["freelancerate","takehome"],related:["side-hustle-taxes-guide","how-business-loans-work"],fin:true,
body:`<p><b>LLC vs sole trader</b> (in the UK, a limited company vs sole trader) is the first structural choice most founders meet — usually before they have earned anything. The two options differ in liability, paperwork, cost and how tax works. This is a plain-English overview of those differences in general terms; it is not legal or tax advice, and the right answer depends on your country, income and risk.</p>
<h2>Sole trader: you are the business</h2>
<p>As a sole trader (called a sole proprietor in the US), there is no legal separation between you and the business. Starting is simple and cheap — often just registering for tax — paperwork is light, and profits are taxed as your personal income. The trade-off is <b>unlimited liability</b>: if the business owes money or is sued, your personal assets are exposed. For low-risk, low-cost starts, this simplicity is exactly why most people begin here.</p>
<h2>LLC / limited company: the business is its own person</h2>
<p>An LLC (US) or limited company (UK) is a separate legal entity. It can own assets, sign contracts and carry debts in its own name, and the owners' liability is generally limited to what they put in — personal assets are usually protected if the business fails. The costs: formation fees, more formal accounting, separate business tax filings, and rules about how you take money out (salary, dividends, or both). Lenders and landlords may still ask owners for personal guarantees, which quietly reintroduces personal risk — read them carefully (see <a href="#/blog/how-business-loans-work" data-blog-link="how-business-loans-work">how business loans work</a>).</p>
<h2>LLC vs sole trader: the differences that matter</h2>
<ul><li><b>Liability</b> — sole trader: personal and unlimited. Company: limited, with exceptions (fraud, guarantees, some taxes).</li><li><b>Paperwork</b> — sole trader: minimal. Company: annual accounts, filings, stricter record rules.</li><li><b>Tax shape</b> — sole trader: profit taxed as personal income. Company: the company is taxed, then you are taxed on what you extract — sometimes more efficient at higher profits, sometimes not; it depends on current rates and your other income.</li><li><b>Credibility</b> — some clients and suppliers prefer or require a company; others do not care at all.</li><li><b>Privacy</b> — company details (directors, accounts summaries) are publicly filed in many countries; sole trader details are not.</li></ul>
<h3>A common path</h3>
<p>Many founders start as sole traders while income is small and risk is low, then incorporate when profits grow, contracts demand it, or liability becomes a real concern. Changing later is normal and usually straightforward — though assets, contracts and tax registrations must move properly, which is a job for an accountant's checklist. Whichever structure you choose, the foundations are the same: clean <a href="#/blog/bookkeeping-basics-small-business" data-blog-link="bookkeeping-basics-small-business">bookkeeping</a> and honest <a href="#/blog/side-hustle-taxes-guide" data-blog-link="side-hustle-taxes-guide">tax tracking</a> from day one.</p>
<h2>Key takeaways</h2>
<ul><li>Sole trader: simplest and cheapest, but liability is personal.</li><li>LLC/company: liability protection and credibility, in exchange for cost and paperwork.</li><li>Many businesses start simple and incorporate as they grow — get advice at that turning point.</li></ul>
<h2>Frequently asked questions</h2>
<h3>Which is cheaper to run?</h3><p>Sole trader, almost always — fewer filings and simpler accounts. The company's extra cost buys liability protection and sometimes tax efficiency at higher profits.</p>
<h3>Does an LLC stop me being sued personally?</h3><p>It protects you from most business debts and claims, but not from your own wrongdoing, personal guarantees you sign, or certain unpaid taxes. Insurance still matters.</p>
<h3>Can I change from sole trader to a company later?</h3><p>Yes — it is a well-trodden path. You form the company, transfer assets and contracts, register it for taxes and close the sole-trader registration appropriately.</p>
<h3>Which do clients prefer?</h3><p>Larger organisations sometimes require suppliers to be companies; small clients rarely mind. Ask your market if you are unsure.</p>`}
);
/* ---------- Four new tools: ROI, Break-Even, Profit Margin, Invoice ---------- */
TOOLS.push(
{id:"roi",cat:"finance",tag:"Business",name:"ROI Calculator",desc:"Return on investment for projects, marketing and equipment — profit, ROI % and annualised return."},
{id:"breakeven",cat:"finance",tag:"Business",name:"Break-Even Calculator",desc:"How many units you must sell to cover fixed and variable costs — and the revenue that takes."},
{id:"margin",cat:"finance",tag:"Business",name:"Profit Margin Calculator",desc:"Margin, markup and profit from cost and selling price — stop confusing margin with markup."},
{id:"invoice",cat:"finance",tag:"Business",name:"Invoice Generator",desc:"Build a clean, totalled invoice with tax — copy it, free and private."});
ART["roi"]={intro:"The ROI calculator measures return on investment: how much profit an amount of money produced, as a percentage of what you put in. Businesses use it to compare projects, marketing campaigns, equipment and property on one fair scale.",steps:["Enter the total amount you invested, including fees and setup costs.","Enter the total value you got back (or the current value plus income received).","Add the time period in years to see the annualised return.","Compare the ROI % against your other options and your cost of borrowing."],example:"Invest $5,000 in equipment that produces $7,200 of value over 2 years: profit is $2,200 and ROI is 44%, an annualised return of about 20% a year.",use:"Use it before committing to a project and after finishing one — the before/after comparison is how estimating improves.",mistakes:["Forgetting hidden costs — fees, maintenance and your time all belong in the amount invested.","Comparing a 1-year ROI with a 5-year ROI without annualising.","Counting revenue instead of profit as the return."],faq:[["What is a good ROI?","It depends on risk and alternatives. A useful test: it should beat what the money would earn safely elsewhere, by enough to justify the risk and effort."],["Can ROI be negative?","Yes — if you got back less than you put in, ROI is negative, and the calculator shows it."]]};
ART["breakeven"]={intro:"The break-even calculator finds the sales level where a business covers all its costs: below it you lose money, above it you profit. It needs your monthly fixed costs, your selling price and your variable cost per unit.",steps:["Add up one month of fixed costs — rent, insurance, software, wages.","Enter your selling price per unit.","Enter the variable cost per unit — materials, packaging, shipping, fees.","Read the break-even units and the revenue they represent."],example:"Fixed costs of $3,000 a month, a $50 price and $22 variable cost give a $28 contribution per unit — break-even is about 108 units, or $5,400 of sales, per month.",use:"Use it when launching a product, setting prices, or testing whether a cost increase breaks your model.",mistakes:["Leaving your own pay out of fixed costs.","Forgetting platform and payment fees in variable costs.","Using your best month's sales as the comparison instead of a typical month."],faq:[["What is contribution?","Price minus variable cost per unit — the amount each sale contributes towards fixed costs and then profit."],["Can services use break-even?","Yes — in hours: fixed costs divided by (hourly rate minus variable cost per hour)."]]};
ART["margin"]={intro:"The profit margin calculator converts between cost, selling price, margin and markup — the two percentages sellers most often confuse, with expensive results.",steps:["Enter what the product costs you in total.","Enter the selling price.","Read the profit, the margin (profit as a share of price) and the markup (profit added on top of cost)."],example:"A product costing $40 and selling for $60 makes $20 profit: that is a 33.3% margin and a 50% markup — the same deal, two very different numbers.",use:"Use it when setting prices, checking a supplier increase, or working out what a discount really does to your profit.",mistakes:["Asking for a 50% margin but applying a 50% markup — you receive 33%.","Calculating margin on a cost that excludes fees, packaging and shipping.","Forgetting that a 20% discount needs far more than 20% extra sales to recover the same profit."],faq:[["Which should I quote, margin or markup?","Margin is the standard for profitability reporting; markup is handy for quick pricing. This calculator shows both so nothing is lost in translation."],["What margin should I aim for?","It varies by industry. Compare within your sector and always judge margin after all costs."]]};
ART["invoice"]={intro:"The invoice generator builds a clean, professional invoice: your details, your client's details, itemised lines, tax and a clear total — ready to copy into an email.",steps:["Enter your business name and the client's name.","Describe the work or item, with quantity and rate.","Add a tax rate if you are registered to charge it.","Copy the finished invoice — everything is generated on your device."],example:"One line — 'Website design, 1 × $800' — with 0% tax produces an $800 invoice; add a second line for hosting setup and the generator totals both automatically.",use:"Use it for freelance work, small business billing and one-off sales where a proper invoice gets you paid faster and keeps your records clean.",mistakes:["Forgetting the invoice number and date — both sides need them for their records.","Writing vague descriptions that make the payer ask questions (and delay).","Not stating payment terms — always say when payment is due."],faq:[["Is this invoice stored anywhere?","No. It is generated in your browser; copy it before leaving this page."],["Can I add my logo?","This simple generator is text-based for maximum compatibility — paste the text into your usual document or email template to add branding."]]};
(function(){
  mkPanel("roi","ROI Calculator","Return on investment for projects, marketing and equipment.",cols2(
    curSeg("roiCurSeg")+F("Amount invested",IN("roiIn",5000,'min="0" step="50"'))+F("Amount returned / current value",IN("roiOut",7200,'min="0" step="50"'))+F("Time period (years)",IN("roiYrs",2,'min="0.1" step="0.5"')),
    RB("Return on investment","roiBig")));
  var cur="USD";segWire("roiCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){var i=num("roiIn"),o=num("roiOut"),y=Math.max(num("roiYrs"),0.1);var profit=o-i;var roi=i>0?(profit/i)*100:0;var ann=i>0?((Math.pow(o/i,1/y)-1)*100):0;
    $("roiBig").textContent=(isFinite(roi)?roi.toFixed(1):"—")+"%";KV("roiBig",[["Net profit",fmtMoney(profit,cur)],["Amount invested",fmtMoney(i,cur)],["Amount returned",fmtMoney(o,cur)],["Annualised return",isFinite(ann)?ann.toFixed(1)+"% / year":"—",1]]);NOTE("roiBig","ROI compares profit with the amount invested. Annualised return spreads the same result evenly across the years, so offers of different lengths can be compared fairly.");}
  onIn(["roiIn","roiOut","roiYrs"],calc);calc();
})();
(function(){
  mkPanel("breakeven","Break-Even Calculator","How much you must sell before profit starts.",cols2(
    curSeg("beCurSeg")+F("Fixed costs per month",IN("beFixed",3000,'min="0" step="50"'))+F("Selling price per unit",IN("bePrice",50,'min="0" step="1"'))+F("Variable cost per unit",IN("beVar",22,'min="0" step="1"')),
    RB("Break-even point","beBig")));
  var cur="USD";segWire("beCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){var f=num("beFixed"),p=num("bePrice"),v=num("beVar");var contrib=p-v;
    if(contrib<=0){$("beBig").textContent="—";KV("beBig",[["Contribution per unit",fmtMoney(contrib,cur)]]);NOTE("beBig","Your price is not above your variable cost per unit, so every sale loses money and no break-even point exists. Raise the price or cut the variable cost.");return;}
    var units=Math.ceil(f/contrib);$("beBig").textContent=fmtNum(units)+" units / month";KV("beBig",[["Contribution per unit",fmtMoney(contrib,cur)],["Break-even revenue",fmtMoney(units*p,cur)],["Units per day (30 days)",(units/30).toFixed(1),1]]);NOTE("beBig","Break-even units = fixed costs ÷ (price − variable cost per unit). Sales beyond this point are profit before tax.");}
  onIn(["beFixed","bePrice","beVar"],calc);calc();
})();
(function(){
  mkPanel("margin","Profit Margin Calculator","Margin, markup and profit from cost and price.",cols2(
    curSeg("mgCurSeg")+F("Total cost per unit",IN("mgCost",40,'min="0" step="1"'))+F("Selling price per unit",IN("mgPrice",60,'min="0" step="1"')),
    RB("Profit margin","mgBig")));
  var cur="USD";segWire("mgCurSeg",function(b){cur=b.getAttribute("data-cur");calc();});
  function calc(){var c=num("mgCost"),p=num("mgPrice");var profit=p-c;var margin=p>0?(profit/p)*100:0;var markup=c>0?(profit/c)*100:0;
    $("mgBig").textContent=isFinite(margin)?margin.toFixed(1)+"%":"—";KV("mgBig",[["Profit per unit",fmtMoney(profit,cur)],["Markup on cost",isFinite(markup)?markup.toFixed(1)+"%":"—"],["Price for a 50% margin",c>0?fmtMoney(c/0.5,cur):"—",1]]);NOTE("mgBig","Margin is profit as a share of the selling price; markup is profit added on top of cost. A 50% markup is only a 33.3% margin — confusing them is expensive.");}
  onIn(["mgCost","mgPrice"],calc);calc();
})();
(function(){
  mkPanel("invoice","Invoice Generator","A clean, totalled invoice you can copy or print.",cols2(
    F("Your business name",IT("invFrom","","e.g. Alex Design Studio"))+F("Client name",IT("invTo","","e.g. Bright Bakery Ltd"))+F("Item / service description",IT("invItem","Website design",""))+F("Quantity",IN("invQty",1,'min="0" step="1"'))+F("Rate per unit",IN("invRate",800,'min="0" step="10"'))+F("Second item (optional)",IT("invItem2","","e.g. Hosting setup"))+F("Second item quantity",IN("invQty2",0,'min="0" step="1"'))+F("Second item rate",IN("invRate2",0,'min="0" step="10"'))+F("Tax % (if registered)",IN("invTax",0,'min="0" step="1"'))+F("Payment due",SEL("invDue",'<option>Due within 14 days</option><option>Due within 30 days</option><option>Due on receipt</option><option>Due within 7 days</option>')),
    '<div class="result-box"><h3>Your invoice</h3><div class="output-pre" id="invOut"></div><div class="btn-row"><button type="button" class="btn secondary small" id="invCopy">Copy invoice</button></div><p class="note">Generated on your device — copy it before leaving this page. Add your bank/payment details before sending.</p></div>'));
  function calc(){var q1=num("invQty"),r1=num("invRate"),q2=num("invQty2"),r2=num("invRate2"),tax=num("invTax");var l1=q1*r1,l2=q2*r2,sub=l1+l2,taxAmt=sub*tax/100,total=sub+taxAmt;
    var d=new Date();var numStr="INV-"+d.getFullYear()+String(d.getMonth()+1).padStart(2,"0")+String(d.getDate()).padStart(2,"0");
    var lines=["INVOICE "+numStr,"Date: "+d.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}),"","From: "+(document.getElementById("invFrom").value||"—"),"To: "+(document.getElementById("invTo").value||"—"),""];
    lines.push((document.getElementById("invItem").value||"Item")+" — "+q1+" × "+r1.toFixed(2)+" = "+l1.toFixed(2));
    if(q2>0)lines.push((document.getElementById("invItem2").value||"Item 2")+" — "+q2+" × "+r2.toFixed(2)+" = "+l2.toFixed(2));
    lines.push("","Subtotal: "+sub.toFixed(2));if(tax>0)lines.push("Tax ("+tax+"%): "+taxAmt.toFixed(2));lines.push("TOTAL DUE: "+total.toFixed(2),"",document.getElementById("invDue").value+". Thank you for your business.");
    document.getElementById("invOut").textContent=lines.join("\n");}
  onIn(["invFrom","invTo","invItem","invQty","invRate","invItem2","invQty2","invRate2","invTax","invDue"],calc);calc();
  document.getElementById("invCopy").addEventListener("click",function(){copyText(document.getElementById("invOut").textContent,"Invoice copied — paste it into your email");});
})();
if(typeof renderGrid==="function")renderGrid();
(function(){var g=document.querySelector("#page-guides .page-body");if(g){var d=document.createElement("div");d.innerHTML="<h2>New business tools</h2><ul>"+["roi","breakeven","margin","invoice"].map(function(id){var t=toolById(id);return t?"<li><a href='#/tool/"+id+"' data-tool-link='"+id+"'><b>"+esc(t.name)+"</b></a> — "+esc(t.desc)+"</li>":"";}).join("")+"</ul>";g.appendChild(d);}
var sm=document.querySelector("#page-sitemap .page-body");if(sm){var d2=document.createElement("div");d2.innerHTML="<h2>New business tools</h2><ul>"+["roi","breakeven","margin","invoice"].map(function(id){var t=toolById(id);return t?"<li><a href='#/tool/"+id+"' data-tool-link='"+id+"'><b>"+esc(t.name)+"</b></a> — "+esc(t.desc)+"</li>":"";}).join("")+"</ul>";sm.appendChild(d2);}})();

function blogSlugify(s){return String(s||"").toLowerCase().trim().replace(/[^a-z0-9\s-]/g,"").replace(/[\s_]+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"")||"post";}
function blogEsc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function blogReadTime(html){var txt=String(html||"").replace(/<[^>]+>/g," ");var w=txt.trim().split(/\s+/).filter(Boolean).length;return Math.max(1,Math.round(w/200));}
function blogAllPosts(){return BLOG_POSTS.map(function(p){return {slug:p.slug,title:p.title,cat:p.cat,date:p.date,excerpt:p.excerpt,read:blogReadTime(p.body),body:p.body,tools:p.tools,related:p.related,seo:p.seo,meta:p.meta,fin:p.fin};});}
function blogFindPost(slug){var all=blogAllPosts();for(var i=0;i<all.length;i++)if(all[i].slug===slug)return all[i];return null;}
function blogToolLinks(ids){if(!ids||!ids.length)return "";var items=ids.map(function(id){var t=(typeof toolById==="function")?toolById(id):null;if(!t)return "";return "<li><a href='#/tool/"+id+"' data-tool-link='"+id+"'><b>"+blogEsc(t.name)+"</b></a> — "+blogEsc(t.desc)+"</li>";}).join("");return items?"<h2>Try the free tools in this guide</h2><ul>"+items+"</ul>":"";}
function blogRelatedLinks(slugs){if(!slugs||!slugs.length)return "";var items=slugs.map(function(s){var p=null;for(var i=0;i<BLOG_POSTS.length;i++)if(BLOG_POSTS[i].slug===s)p=BLOG_POSTS[i];if(!p)return "";return "<li><a href='#/blog/"+s+"' data-blog-link='"+s+"'><b>"+blogEsc(p.title)+"</b></a></li>";}).join("");return items?"<h2>Keep reading</h2><ul>"+items+"</ul>":"";}

/* ---------- Blog: page shells ---------- */
var blogMain=document.querySelector("main.wrap");
var blogIndexSec=document.createElement("section");blogIndexSec.className="blog-view";blogIndexSec.id="blogIndex";
blogIndexSec.innerHTML="<div class='blog-head'><h1>ToolNovo Blog</h1><p>Plain-English guides on money, technology, security and the web — written to help you use the internet and your tools better. New guides are added regularly.</p></div>"
+"<div class='blog-search'><input type='text' id='blogSearch' placeholder='Search blog posts — try “mortgage”, “password”, “SEO”…' aria-label='Search blog posts' /></div>"
+"<div class='filters' id='blogFilters' role='group' aria-label='Filter blog posts by category'></div>"
+"<p class='article-meta' id='blogCount'></p><div class='blog-grid' id='blogGrid'></div>"
+"<div class='no-results' id='blogNoResults'>No posts match your search. Try a different word, or browse all posts above.</div>";
blogMain.appendChild(blogIndexSec);
var blogPostSec=document.createElement("section");blogPostSec.className="blog-view";blogPostSec.id="blogPostView";blogMain.appendChild(blogPostSec);

/* ---------- Blog: rendering ---------- */
var blogActiveCat="all",blogQuery="";
function renderBlogFilters(){var host=document.getElementById("blogFilters");var cats=["all"].concat(BLOG_CATS);host.innerHTML=cats.map(function(c){return "<button type='button' class='chip"+(blogActiveCat===c?" active":"")+"' data-bcat='"+blogEsc(c)+"'>"+(c==="all"?"All posts":blogEsc(c))+"</button>";}).join("");}
function renderBlogGrid(){var all=blogAllPosts();var list=all.filter(function(p){var okCat=blogActiveCat==="all"||p.cat===blogActiveCat;var q=blogQuery.trim().toLowerCase();var okQ=!q||(p.title+" "+p.excerpt+" "+p.cat).toLowerCase().indexOf(q)>=0;return okCat&&okQ;});
var grid=document.getElementById("blogGrid");document.getElementById("blogCount").textContent=list.length+" of "+all.length+" posts";
document.getElementById("blogNoResults").style.display=list.length?"none":"block";
grid.innerHTML=list.map(function(p){return "<button type='button' class='blog-card' data-blog-open='"+blogEsc(p.slug)+"'><span class='bmeta'><span class='tag'>"+blogEsc(p.cat)+"</span>"+""+"<span>"+blogEsc(p.date)+"</span><span>· "+p.read+" min read</span></span><h3>"+blogEsc(p.title)+"</h3><p>"+blogEsc(p.excerpt)+"</p><span class='go' style='font-weight:700;color:var(--brand);font-size:.9rem'>Read post →</span></button>";}).join("");}
/* ---------- Blog: views & routing ---------- */
var blogViews=[blogIndexSec,blogPostSec];
function hideBlogViews(){blogViews.forEach(function(s){s.classList.remove("show");});hideHomeExtras();}
["showHome","showTool","showPage","showNotFound"].forEach(function(fn){if(typeof window[fn]==="function"){var orig=window[fn];window[fn]=function(){hideBlogViews();return orig.apply(null,arguments);};}});
function blogChrome(title,crumbHtml){if(typeof hideAll==="function")hideAll();document.title=title;var c=document.getElementById("pageCrumb");if(c){c.innerHTML=crumbHtml;c.classList.add("show");}window.scrollTo({top:0});}
function showBlogIndex(skip){hideBlogViews();blogChrome("Blog | ToolNovo","<a href='#/' data-home-link>Home</a><span class='sep'>›</span><b>Blog</b>");setMetaDescSafe("ToolNovo Blog \u2014 plain-English guides on money, technology, security and the web, with the free calculators and tools behind every guide. No sign-up needed.");blogIndexSec.classList.add("show");renderBlogFilters();renderBlogGrid();if(!skip)setHash("#/blog");}
function showBlogPost(slug,skip){var p=blogFindPost(slug);if(!p){if(typeof showNotFound==="function")showNotFound();return;}hideBlogViews();
blogPostSec.innerHTML="<article class='article blog-article'><p class='article-meta'>By ToolNovo Team · "+blogEsc(p.date)+" · "+p.read+" min read · Category: "+blogEsc(p.cat)+"</p><h1>"+blogEsc(p.title)+"</h1>"+(p.fin?"<div class='disclaimer-box'><b>⚠ Please note</b><p>"+FIN_NOTE+"</p></div>":"")+p.body+blogToolLinks(p.tools)+blogRelatedLinks(p.related)+"<div class='btn-row' style='margin:22px 0 14px'><a class='btn secondary' href='#/blog' data-blog-home>← All blog posts</a></div></article>";
blogChrome(p.seo,"<a href='#/' data-home-link>Home</a><span class='sep'>›</span><a href='#/blog' data-blog-home>Blog</a><span class='sep'>›</span><b>"+blogEsc(p.title)+"</b>");
setMetaDescSafe(p.meta);blogPostSec.classList.add("show");if(!skip)setHash("#/blog/"+slug);}
function setMetaDescSafe(d){try{var m=document.querySelector('meta[name="description"]');if(m&&d)m.setAttribute("content",d);if(d&&typeof syncSeoMeta==="function")syncSeoMeta(d);}catch(e){}}
function blogRoute(){var h=location.hash||"";var m=h.match(/^#\/blog\/(.+)$/);if(m){showBlogPost(decodeURIComponent(m[1]),true);return;}if(h==="#/blog"){showBlogIndex(true);return;}}
window.addEventListener("hashchange",blogRoute);

/* Blog interactions */
document.addEventListener("click",function(e){
  var open=e.target.closest("[data-blog-open]");if(open){showBlogPost(open.getAttribute("data-blog-open"));return;}
  var bl=e.target.closest("[data-blog-link]");if(bl){e.preventDefault();showBlogPost(bl.getAttribute("data-blog-link"));return;}
  var bh=e.target.closest("[data-blog-home]");if(bh){e.preventDefault();showBlogIndex();return;}
  var bc=e.target.closest("[data-bcat]");if(bc){blogActiveCat=bc.getAttribute("data-bcat");renderBlogFilters();renderBlogGrid();return;}
});
document.addEventListener("input",function(e){if(e.target&&e.target.id==="blogSearch"){blogQuery=e.target.value;renderBlogGrid();}});
/* ---------- Nav, footer, sitemap ---------- */
(function(){var nav=document.querySelector("nav.main");if(nav&&!nav.querySelector("[data-blog-home]")){var a=document.createElement("a");a.href="#/blog";a.textContent="Blog";a.setAttribute("data-blog-home","");nav.insertBefore(a,nav.firstChild);}
var siteCol=null;document.querySelectorAll("footer.site .f-links").forEach(function(fl){if(fl.querySelector("[data-page-link='sitemap']"))siteCol=fl;});
if(siteCol&&!siteCol.querySelector("[data-blog-home]")){var b1=document.createElement("a");b1.href="#/blog";b1.textContent="Blog";b1.setAttribute("data-blog-home","");siteCol.insertBefore(b1,siteCol.children[1]||null);}
var sm=document.querySelector("#page-sitemap .page-body");if(sm){var d=document.createElement("div");d.innerHTML="<h2>Blog ("+BLOG_POSTS.length+" posts)</h2><ul>"+BLOG_POSTS.map(function(p){return "<li><a href='#/blog/"+p.slug+"' data-blog-link='"+p.slug+"'><b>"+blogEsc(p.title)+"</b></a> — "+blogEsc(p.cat)+"</li>";}).join("")+"</ul><p><a href='#/blog' data-blog-home><b>Visit the Blog →</b></a></p>";sm.appendChild(d);}})();

/* ---------- Homepage extras: featured tools, why, latest posts + theme polish ---------- */
var homeExtras=[];
function featuredCard(id){var t=(typeof toolById==="function")?toolById(id):null;if(!t)return "";return "<button type='button' class='card' data-tool-link='"+id+"'><span class='icon'>✦</span><h3>"+blogEsc(t.name)+"</h3><p>"+blogEsc(t.desc)+"</p><span class='meta'><span class='tag'>"+blogEsc(t.tag||"Tool")+"</span><span class='go'>Open tool →</span></span></button>";}
(function(){
  var toolsSec=document.getElementById("tools");
  /* Featured tools are not a separate section: they live in the "Featured Tools"
     category chip in the directory filters above the grid, listed exactly like
     every other category's tools (see FEATURED_IDS + renderGrid). */
  var why=document.createElement("section");why.className="section home-extra";why.innerHTML="<h2>Why use ToolNovo?</h2><p class='sub'>Built to be the tool site we always wanted to use.</p><div class='how-grid'><div class='how'><span class='n'>✓</span><h3>Private by design</h3><p>Every tool runs in your browser. Your files, text and numbers are never uploaded to a server.</p></div><div class='how'><span class='n'>✓</span><h3>Genuinely free</h3><p>No accounts, no trials, no usage limits — open a tool and use it, as often as you like.</p></div><div class='how'><span class='n'>✓</span><h3>Guides with every tool</h3><p>Each tool comes with a full written guide: steps, a worked example, mistakes to avoid and an FAQ.</p></div><div class='how'><span class='n'>✓</span><h3>Works everywhere</h3><p>Phone, tablet or computer — every tool and article is built to work properly on any screen.</p></div></div>";
  var faqSec=document.getElementById("faq");if(faqSec&&faqSec.parentNode)faqSec.parentNode.insertBefore(why,faqSec);homeExtras.push(why);
  var latest=document.createElement("section");latest.className="section home-extra";latest.id="homeLatest";latest.innerHTML="<h2>Latest from the Blog</h2><p class='sub'>Plain-English guides on money, security and the web — fresh reading, added regularly.</p><div class='blog-grid'>"+BLOG_POSTS.slice(0,6).map(function(p){return "<button type='button' class='blog-card' data-blog-open='"+p.slug+"'><span class='bmeta'><span class='tag'>"+blogEsc(p.cat)+"</span><span>"+blogEsc(p.date)+"</span><span>· "+blogReadTime(p.body)+" min read</span></span><h3>"+blogEsc(p.title)+"</h3><p>"+blogEsc(p.excerpt)+"</p><span style='font-weight:700;color:var(--brand);font-size:.9rem'>Read post →</span></button>";}).join("")+"</div><div class='btn-row' style='margin-top:14px'><a class='btn secondary' href='#/blog' data-blog-home>View all blog posts →</a></div>";
  if(toolsSec&&toolsSec.parentNode)toolsSec.parentNode.insertBefore(latest,toolsSec.nextSibling);homeExtras.push(latest);
  /* Hero trust points + stats */
  var hero=document.querySelector(".hero");if(hero){var stats=hero.querySelector(".hero-stats");if(stats){stats.innerHTML="<span><b>124</b> free tools</span><span><b>29</b> blog guides</span><span><b>100%</b> free — no signup</span><span><b>Private</b> — runs in your browser</span>";}
  var trust=document.createElement("div");trust.className="hero-trust";trust.innerHTML="<span>✓ Free forever</span><span>✓ No signup required</span><span>✓ Nothing uploaded — tools run in your browser</span>";hero.appendChild(trust);}
})();
function hideHomeExtras(){homeExtras.forEach(function(s){s.classList.add("hidden");});}
(function(){var origShowHome=window.showHome;if(typeof origShowHome==="function"){window.showHome=function(){var r=origShowHome.apply(null,arguments);homeExtras.forEach(function(s){s.classList.remove("hidden");});return r;};}})();
/* Theme polish (injected so it applies on every page) */
(function(){var st=document.createElement("style");st.textContent=
".hero{padding:64px 0 30px;background:transparent;margin:0 -20px;padding-left:20px;padding-right:20px}"
+".hero h1{font-size:clamp(42px,7.2vw,84px)}"
+".hero p.lede{font-size:19px;max-width:620px}"
+".hero{text-align:center}.hero h1{margin-left:auto;margin-right:auto}.hero p.lede{margin-left:auto;margin-right:auto}.hero .searchbar{margin-left:auto;margin-right:auto}.hero-stats{justify-content:center}"
+".hero-stats span::before{content:'✓ ';color:#0B8A62;font-weight:700}"
+".hero-trust{display:none}"
+".wrap{max-width:1180px}"
+"header.site{box-shadow:none}"
+"nav.main a{font-size:15px;padding:8px 16px}"
+".searchbar input{font-size:17px;font-weight:600;box-shadow:none}"
+".searchbar .btn{box-shadow:none;flex-shrink:0}"
+".filters{margin:38px 0 20px}"
+".chip{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:9px 18px;font-size:14.5px}"
+".chip .n{font-family:var(--mono);font-size:11.5px;font-weight:700;background:var(--ink);color:#FFF6E3;border-radius:999px;padding:1px 8px}"
+".chip.active .n{background:var(--lime);color:var(--ink)}"
+"#toolGrid{grid-template-columns:repeat(2,1fr);gap:20px}"
+"#toolGrid .card{display:grid;grid-template-columns:52px 1fr;column-gap:14px;row-gap:10px;align-items:start;padding:24px 24px 20px}"
+"#toolGrid .card .icon{width:52px;height:52px;font-size:19px;grid-row:1}"
+"#toolGrid .card h3{grid-row:1;align-self:center;font-size:20px;margin:0}"
+"#toolGrid .card p{grid-column:1/-1;font-size:15px}"
+"#toolGrid .card .meta{grid-column:1/-1;margin-top:2px}"
+".card .tag,.blog-card .tag{font-family:inherit;font-size:12px;text-transform:none;letter-spacing:0;padding:2px 10px;font-weight:700}"
+".card .go{font-size:15px;font-weight:800}"
+".card:hover,.blog-card:hover{transform:translate(-3px,-3px);box-shadow:9px 9px 0 var(--ink)}"
+"#toolGrid .card:hover,.blog-grid .blog-card:hover,.related-grid .related-card:hover{transform:translate(-3px,-3px);box-shadow:9px 9px 0 var(--ink)}"
+".section{padding:58px 0 8px}"
+".section h2{font-size:clamp(30px,4.4vw,46px);text-align:center}"
+".section p.sub{font-size:17px;text-align:center}"
+".blog-grid{gap:20px}"
+".blog-card{padding:20px 22px 22px;gap:9px}"
+".blog-card h3{font-size:20px}"
+".blog-card p{font-size:15px}"
+".blog-card .bmeta{font-size:12px;letter-spacing:.07em;text-transform:uppercase;color:#5c5747}"
+".blog-card>span:last-child{color:var(--ink)!important;border-bottom:3px solid var(--lime);padding-bottom:1px;align-self:flex-start}"
+".no-results{border:var(--b2);box-shadow:var(--shadow-sm);padding:34px;font-weight:700;font-size:17px;color:var(--ink)}"
+"footer.site{background:var(--ink);color:#c9c3ae;border-top:3px solid var(--ink);padding-top:48px;padding-bottom:22px;margin-top:58px}"
+"footer.site .f-grid{gap:28px}"
+"footer.site h4{color:var(--lime);font-family:var(--mono);font-size:14px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin:0 0 14px}"
+"footer.site .f-links{gap:9px}"
+"footer.site .f-links a{color:#e9e4d2;font-size:14.5px;font-weight:600}"
+"footer.site a{color:#e9e4d2}"
+"footer.site .f-links a:hover,footer.site a:hover{color:var(--lime)}"
+"footer.site b{color:#FFF6E3!important}"
+"footer.site .f-bottom{border-top:1.5px solid #3a382e;color:#a49d88;font-size:13.5px;font-weight:600;margin-top:34px;padding-top:18px}"
+".tool-head{flex-direction:column;align-items:center;text-align:center}.blog-head{text-align:center}.static-card h1,.static-card .updated{text-align:center}.article h2{text-align:center}"
+"@media (max-width:900px){#toolGrid{grid-template-columns:1fr}}"
+"@media (max-width:520px){.searchbar{flex-direction:column;border-radius:22px;padding:10px;gap:10px}.searchbar svg{display:none}.searchbar input{width:100%;text-align:center}.searchbar .btn{width:100%}}"
+"@media (max-width:640px){.cookie-banner.docked{position:static;max-width:none;margin:14px 0 0}.header-in{flex-wrap:wrap;gap:8px;padding:10px 0}.logo small{display:none}nav.main{margin-left:0;width:100%;justify-content:space-between;gap:2px}nav.main a{font-size:14px;padding:6px 9px}.hero{padding-top:44px;padding-bottom:22px}}";
document.head.appendChild(st);
var sb=document.getElementById("heroSearchBtn");if(sb)sb.addEventListener("click",function(){if(typeof renderGrid==="function")renderGrid();var g=document.getElementById("toolGrid");if(g)g.scrollIntoView({behavior:"smooth",block:"start"});});
})();
/* ---------- Homepage refresh helpers ---------- */
function refreshHomeLatest(){var sec=document.getElementById("homeLatest");if(!sec)return;var grid=sec.querySelector(".blog-grid");if(!grid)return;grid.innerHTML=blogAllPosts().slice(0,6).map(function(p){return "<button type='button' class='blog-card' data-blog-open='"+blogEsc(p.slug)+"'><span class='bmeta'><span class='tag'>"+blogEsc(p.cat)+"</span><span>"+blogEsc(p.date)+"</span><span>· "+p.read+" min read</span></span><h3>"+blogEsc(p.title)+"</h3><p>"+blogEsc(p.excerpt)+"</p><span style='font-weight:700;color:var(--brand);font-size:.9rem'>Read post →</span></button>";}).join("");}
function refreshBlogSurfaces(){refreshHomeLatest();if(blogIndexSec.classList.contains("show"))renderBlogGrid();}
function renderFeatured(){if(window.activeCat==="featured"&&typeof renderGrid==="function")renderGrid();}

blogRoute();

;

"use strict";
/* ================= Small SEO Tools additions: 22 new tools + FAQs page ================= */
(function(){
function dlBlob(blob,name){var u=URL.createObjectURL(blob);var a=document.createElement("a");a.href=u;a.download=name;document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(function(){URL.revokeObjectURL(u);},4000);}
function loadImg(src){return new Promise(function(res,rej){var i=new Image();i.onload=function(){res(i);};i.onerror=rej;i.src=src;});}
function fileURL(f){return URL.createObjectURL(f);}
function pdfLibMissing(boxId){var b=$(boxId);if(b)b.textContent="The PDF library could not load — check your connection and reload the page.";}
if(window.pdfjsLib){try{pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";}catch(e){}}

/* ---------- Icons for new tools ---------- */
var NI={
summarizer:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 10h16M4 14h10M4 18h7"/></svg>',
citation:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5z"/><path d="M8 8h8"/></svg>',
texteditor:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
speechtotext:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 19v3"/></svg>',
smalltext:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7V5h16v2M12 5v14M9 19h6M17 15l3 6m0-6l-3 6" transform="scale(0.92) translate(1,0)"/></svg>',
invisiblechar:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4" stroke-dasharray="4 3"/></svg>',
texttobinary:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 4v16M6 4L3 6m3-2l3 2M15 6h4v14h-4M15 13h4"/></svg>',
binarytotext:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 6h4v14h-4M15 13h4M6 4v16M6 4L3 6m3-2l3 2"/></svg>',
imageconverter:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></svg>',
svgtopng:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20L20 4M20 4h-6M20 4v6"/><rect x="3" y="3" width="18" height="18" rx="2"/></svg>',
favicon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M9 17V7h6M9 12h5"/></svg>',
meme:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c1 1.4 2.2 2 3.5 2s2.5-.6 3.5-2M9 9.5h.01M15 9.5h.01"/></svg>',
emojipicker:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 14c1 1.2 2.2 1.8 3.5 1.8S14.5 15.2 15.5 14M9 9.5h.01M15 9.5h.01"/></svg>',
compresskb:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v4a2 2 0 0 1-2 2H3M16 3v4a2 2 0 0 0 2 2h3M8 21v-4a2 2 0 0 0-2-2H3M16 21v-4a2 2 0 0 1 2-2h3"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>',
mergepdf:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M12 12v6M9 15h6"/></svg>',
splitpdf:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M5 12h14" stroke-dasharray="3 2"/></svg>',
rotatepdf:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.3"/><path d="M21 3v6h-6"/></svg>',
jpgtopdf:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="13" height="13" rx="2"/><path d="M17 9h3a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-3"/></svg>',
pdftojpg:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M13 3v6h7"/><circle cx="10" cy="14" r="1.6"/><path d="M6 20l4.5-4L14 19l2.5-2L20 20"/></svg>',
hoursminutes:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
htmlviewer:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6l-5 6 5 6M16 6l5 6-5 6"/></svg>',
mybrowser:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z"/></svg>'
};
Object.keys(NI).forEach(function(k){ICONS[k]=NI[k];});

/* ---------- 1. Text Summarizer ---------- */
(function(){
  mkPanel("summarizer","Text Summarizer","Paste a long text and get its key sentences back as a short summary.",cols2(
    F("Your text",TA("sumText",10,"Paste an article, essay or report here (a few sentences or more)…"))+F("Summary length (sentences)",IN("sumCount",3,'min="1" max="15" step="1"'))+'<div class="btn-row"><button type="button" class="btn" id="sumGo">Summarize</button><button type="button" class="btn secondary" id="sumCopy">Copy summary</button></div>',
    '<div class="result-box"><h3>Summary</h3><div class="output-pre" id="sumOut">Your summary will appear here.</div><div style="margin-top:12px" id="sumStats"></div><p class="note">Extractive summarization: sentences are scored by how often their key words appear in the whole text, then the best are kept in original order. Nothing is uploaded.</p></div>'));
  var STOPW={the:1,be:1,to:1,of:1,and:1,a:1,in:1,that:1,it:1,was:1,for:1,on:1,are:1,as:1,with:1,his:1,they:1,at:1,by:1,this:1,had:1,not:1,but:1,from:1,or:1,have:1,an:1,which:1,one:1,you:1,were:1,her:1,all:1,she:1,there:1,would:1,their:1,we:1,been:1,has:1,when:1,who:1,will:1,more:1,no:1,if:1,out:1,so:1,said:1,what:1,up:1,its:1,about:1,into:1,than:1,them:1,can:1,only:1,other:1,new:1,some:1,could:1,time:1,these:1,two:1,may:1,then:1,do:1,first:1,any:1,my:1,now:1,such:1,like:1,our:1,over:1,even:1,most:1,made:1,after:1,also:1,did:1,many:1,before:1,must:1,through:1,back:1,where:1,much:1,your:1,way:1,well:1,down:1,should:1,because:1,each:1,just:1,those:1,people:1,how:1,too:1,very:1,make:1,still:1,own:1,see:1,work:1,long:1,get:1,here:1,both:1,being:1,under:1,never:1,day:1,same:1,another:1,know:1,while:1,last:1,might:1,great:1,old:1,year:1,off:1,come:1,since:1,against:1,go:1,came:1,right:1,used:1,take:1,three:1,is:1,am:1,are:1};
  function splitSentences(t){var m=t.replace(/\s+/g," ").match(/[^.!?]+[.!?]+["')\]]*|\S[^.!?]*$/g);if(!m)return[];return m.map(function(s){return s.trim();}).filter(function(s){return s.length>1;});}
  function summarize(){
    var text=$("sumText").value.trim();var out=$("sumOut"),stats=$("sumStats");
    if(!text){out.textContent="Paste some text first.";stats.innerHTML="";return;}
    var sents=splitSentences(text);var want=Math.max(1,Math.min(15,Math.round(num("sumCount"))||3));
    if(sents.length<=want){out.textContent=sents.join(" ");stats.innerHTML='<div class="kv"><span>Sentences in your text</span><b>'+sents.length+"</b></div>";return;}
    var freq={};
    sents.forEach(function(s){s.toLowerCase().replace(/[^a-z0-9'\s-]/g," ").split(/\s+/).forEach(function(w){if(w.length>2&&!STOPW[w])freq[w]=(freq[w]||0)+1;});});
    var scored=sents.map(function(s,i){var words=s.toLowerCase().replace(/[^a-z0-9'\s-]/g," ").split(/\s+/).filter(Boolean);var sc=0;words.forEach(function(w){if(freq[w])sc+=freq[w];});sc=words.length?sc/Math.sqrt(words.length):0;if(i===0)sc*=1.25;else if(i===1)sc*=1.1;return {i:i,s:s,sc:sc};});
    var top=scored.slice().sort(function(a,b){return b.sc-a.sc;}).slice(0,want).sort(function(a,b){return a.i-b.i;});
    var summary=top.map(function(x){return x.s;}).join(" ");
    out.textContent=summary;
    var ow=text.split(/\s+/).filter(Boolean).length,sw=summary.split(/\s+/).filter(Boolean).length;
    stats.innerHTML='<div class="kv"><span>Original</span><b>'+sents.length+" sentences · "+ow+' words</b></div><div class="kv"><span>Summary</span><b>'+top.length+" sentences · "+sw+' words</b></div><div class="kv total"><span>Shorter by</span><b>'+(ow?Math.round((1-sw/ow)*100):0)+"%</b></div>";
  }
  $("sumGo").addEventListener("click",summarize);
  $("sumCopy").addEventListener("click",function(){var t=$("sumOut").textContent;if(t&&t.indexOf("Paste some")!==0)copyText(t,"Summary copied");});
})();

/* ---------- 2. Citation Generator ---------- */
(function(){
  mkPanel("citation","Citation Generator","APA 7, MLA 9 and Chicago references, formatted for you.",cols2(
    F("Citation style",'<div class="seg" id="citSeg"><button type="button" class="active" data-style="apa">APA 7</button><button type="button" data-style="mla">MLA 9</button><button type="button" data-style="chicago">Chicago</button></div>')+
    F("Author(s)",IT("citAuthor","","e.g. Smith, Jane — more authors separated by ;"),"Last name, First name")+
    F("Title of article / chapter / page",IT("citTitle","","e.g. How Libraries Adapt"))+
    F("Container (journal, book or website)",IT("citContainer","","e.g. Journal of Information"))+
    '<div class="row2">'+F("Publisher",IT("citPublisher","","e.g. Oxford University Press"))+F("Year",IN("citYear",2024,'min="1000" max="2100" step="1"'))+'</div>'+
    '<div class="row2">'+F("Volume / issue (optional)",IT("citVol","","e.g. 12(3)"))+F("Pages (optional)",IT("citPages","","e.g. 45–61"))+'</div>'+
    F("URL or DOI (optional)",IT("citUrl","","e.g. https://doi.org/10.xxxx/xxxxx")),
    '<div class="result-box"><h3>Your citation</h3><div class="output-pre" id="citOut"></div><div class="btn-row"><button type="button" class="btn secondary small" id="citCopy">Copy citation</button></div><p class="note">Always check names, dates and punctuation against your source and your institution\u2019s style guide — local variations exist.</p></div>'));
  var style="apa";segWire("citSeg",function(b){style=b.getAttribute("data-style");calc();});
  function initials(name){return name.split(/\s+/).filter(Boolean).map(function(p){return p.charAt(0).toUpperCase()+".";}).join(" ");}
  function apaAuthor(a){var parts=a.split(",");if(parts.length>=2)return parts[0].trim()+", "+initials(parts[1].trim());return a.trim();}
  function plainAuthor(a){var parts=a.split(",");if(parts.length>=2)return parts[1].trim()+" "+parts[0].trim();return a.trim();}
  function sentCase(t){if(!t)return t;return t.charAt(0).toUpperCase()+t.slice(1);}
  function titleCase(t){var small={of:1,the:1,a:1,an:1,and:1,in:1,on:1,for:1,to:1,with:1,by:1,at:1,from:1};var words=t.split(/\s+/);return words.map(function(w,i){var lw=w.toLowerCase();if(i>0&&small[lw])return lw;return w.charAt(0).toUpperCase()+w.slice(1);}).join(" ");}
  function joinAuthors(list,fmt,conj){if(!list.length)return "";if(list.length===1)return fmt(list[0]);return list.slice(0,-1).map(fmt).join(", ")+", "+conj+" "+fmt(list[list.length-1]);}
  function calc(){
    var raw=$("citAuthor").value.trim(),title=$("citTitle").value.trim(),cont=$("citContainer").value.trim(),pub=$("citPublisher").value.trim(),year=$("citYear").value.trim(),vol=$("citVol").value.trim(),pages=$("citPages").value.trim(),url=$("citUrl").value.trim();
    var authors=raw?raw.split(";").map(function(s){return s.trim();}).filter(Boolean):[];
    var out="";
    if(style==="apa"){
      var a=joinAuthors(authors,apaAuthor,"&");
      out=(a?a+" ":"")+(year?"("+year+"). ":"")+(title?sentCase(title)+". ":"")+(cont?titleCase(cont)+(vol?", "+vol:"")+(pages?", "+pages.replace(/-/g,"–"):"")+". ":"")+(pub&&!cont?pub+". ":"")+(url?url:"");
    }else if(style==="mla"){
      var a2=joinAuthors(authors,plainAuthor,"and");
      out=(a2?a2+". ":"")+(title?"\u201C"+titleCase(title)+".\u201D ":"")+(cont?titleCase(cont)+", ":"")+(vol?"vol. "+vol+", ":"")+(pub?pub+", ":"")+(year?year+(pages?", ":" . "):"")+(pages?"pp. "+pages.replace(/-/g,"–")+".":"")+(url?" "+url+".":"");
      out=out.replace(" . ",". ");
    }else{
      var a3=joinAuthors(authors,plainAuthor,"and");
      out=(a3?a3+". ":"")+(year?year+". ":"")+(title?"\u201C"+sentCase(title)+".\u201D ":"")+(cont?titleCase(cont)+(vol?" "+vol:"")+(pages?" ("+year+")":"")+(pages?": "+pages.replace(/-/g,"–"):"")+". ":"")+(pub?pub+". ":"")+(url?url+".":"");
      if(!cont&&pub)out=(a3?a3+". ":"")+(year?year+". ":"")+(title?titleCase(title)+". ":"")+(pub?pub+". ":"")+(url?url+".":"");
    }
    $("citOut").textContent=out.trim()||"Fill in the fields and your formatted citation appears here.";
  }
  onIn(["citAuthor","citTitle","citContainer","citPublisher","citYear","citVol","citPages","citUrl"],calc);calc();
  $("citCopy").addEventListener("click",function(){copyText($("citOut").textContent,"Citation copied");});
})();

/* ---------- 3. Online Text Editor ---------- */
(function(){
  mkPanel("texteditor","Online Text Editor","A clean writing pad with live counts — download your work as a text file.",
    F("Your document",TA("edText",12,"Start writing here…"))+
    '<div class="btn-row" style="margin-bottom:12px"><button type="button" class="btn secondary small" id="edBold">Bold</button><button type="button" class="btn secondary small" id="edItalic">Italic</button><button type="button" class="btn secondary small" id="edUpper">UPPERCASE</button><button type="button" class="btn secondary small" id="edLower">lowercase</button><button type="button" class="btn secondary small" id="edTitle">Title Case</button><button type="button" class="btn secondary small" id="edClear">Clear</button></div>'+
    '<div class="cols"><div class="result-box"><h3>Counts</h3><div class="kv"><span>Words</span><b id="edWords">0</b></div><div class="kv"><span>Characters</span><b id="edChars">0</b></div><div class="kv"><span>Characters (no spaces)</span><b id="edCharsNS">0</b></div><div class="kv"><span>Lines</span><b id="edLines">0</b></div></div>'+
    '<div class="result-box"><h3>Save your work</h3><p class="note" style="margin-top:0">This editor stores nothing — download or copy your text before closing the page.</p><div class="btn-row"><button type="button" class="btn" id="edDownload">Download .txt</button><button type="button" class="btn secondary" id="edCopy">Copy all</button></div></div></div>');
  var ta=$("edText");
  function counts(){var t=ta.value;$("edWords").textContent=t.trim()?t.trim().split(/\s+/).filter(Boolean).length:0;$("edChars").textContent=t.length;$("edCharsNS").textContent=t.replace(/\s/g,"").length;$("edLines").textContent=t?t.split(/\n/).length:0;}
  ta.addEventListener("input",counts);counts();
  function wrapSel(before,after){var s=ta.selectionStart,e=ta.selectionEnd;var sel=ta.value.slice(s,e)||"text";ta.value=ta.value.slice(0,s)+before+sel+after+ta.value.slice(e);ta.focus();ta.setSelectionRange(s+before.length,s+before.length+sel.length);counts();}
  function transformSel(fn){var s=ta.selectionStart,e=ta.selectionEnd;if(s===e){ta.value=fn(ta.value);}else{ta.value=ta.value.slice(0,s)+fn(ta.value.slice(s,e))+ta.value.slice(e);}counts();}
  $("edBold").addEventListener("click",function(){wrapSel("**","**");});
  $("edItalic").addEventListener("click",function(){wrapSel("*","*");});
  $("edUpper").addEventListener("click",function(){transformSel(function(t){return t.toUpperCase();});});
  $("edLower").addEventListener("click",function(){transformSel(function(t){return t.toLowerCase();});});
  $("edTitle").addEventListener("click",function(){transformSel(function(t){return t.toLowerCase().replace(/\b\w/g,function(c){return c.toUpperCase();});});});
  $("edClear").addEventListener("click",function(){ta.value="";counts();ta.focus();});
  $("edCopy").addEventListener("click",function(){if(ta.value)copyText(ta.value,"Document copied");});
  $("edDownload").addEventListener("click",function(){if(!ta.value){toast("Write something first");return;}dlBlob(new Blob([ta.value],{type:"text/plain"}),"my-document.txt");});
})();

/* ---------- 4. Speech to Text ---------- */
(function(){
  mkPanel("speechtotext","Speech to Text","Dictate with your microphone — speech becomes text in your browser.",cols2(
    F("Language",SEL("sttLang",'<option value="en-US">English (US)</option><option value="en-GB">English (UK)</option><option value="en-CA">English (Canada)</option><option value="es-ES">Spanish</option><option value="fr-FR">French</option><option value="de-DE">German</option><option value="ur-PK">Urdu</option><option value="hi-IN">Hindi</option><option value="ar-SA">Arabic</option>'))+
    '<div class="btn-row"><button type="button" class="btn" id="sttStart">Start dictation</button><button type="button" class="btn secondary" id="sttStop" disabled>Stop</button></div><p class="status-line" id="sttStatus"></p><p class="note">Recognition is performed by your browser\u2019s own speech service. Chrome and Edge work best. ToolNovo never receives your audio.</p>',
    '<div class="result-box"><h3>Transcript</h3><div class="field"><textarea id="sttText" rows="9" placeholder="Your words will appear here…"></textarea></div><div class="btn-row"><button type="button" class="btn secondary small" id="sttCopy">Copy transcript</button><button type="button" class="btn secondary small" id="sttClear">Clear</button></div></div>'));
  var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  var status=$("sttStatus"),rec=null,listening=false;
  if(!SR){status.textContent="Sorry — this browser does not support speech recognition. Try Chrome or Edge.";$("sttStart").disabled=true;}
  function setListening(on){listening=on;$("sttStart").disabled=on;$("sttStop").disabled=!on;status.textContent=on?"Listening… speak now.":"";}
  if(SR){
    $("sttStart").addEventListener("click",function(){
      rec=new SR();rec.lang=$("sttLang").value;rec.continuous=true;rec.interimResults=true;
      var finalText=$("sttText").value;
      rec.onresult=function(ev){var interim="";for(var i=ev.resultIndex;i<ev.results.length;i++){var r=ev.results[i];if(r.isFinal){finalText+=(finalText&&!/[\s.!?]$/.test(finalText)?" ":"")+r[0].transcript;}else interim+=r[0].transcript;}$("sttText").value=finalText+(interim?" "+interim:"");};
      rec.onerror=function(ev){if(ev.error==="not-allowed")status.textContent="Microphone access was blocked — allow it in your browser settings and try again.";else if(ev.error!=="aborted")status.textContent="Recognition note: "+ev.error;setListening(false);};
      rec.onend=function(){if(listening){try{rec.start();}catch(e){setListening(false);}}};
      try{rec.start();setListening(true);}catch(e){status.textContent="Could not start recognition.";}
    });
    $("sttStop").addEventListener("click",function(){listening=false;if(rec)rec.stop();setListening(false);});
  }
  $("sttCopy").addEventListener("click",function(){var t=$("sttText").value;if(t)copyText(t,"Transcript copied");});
  $("sttClear").addEventListener("click",function(){$("sttText").value="";});
})();

/* ---------- 5. Small Text Generator ---------- */
(function(){
  mkPanel("smalltext","Small Text Generator","One line of text, several stylish Unicode versions — tap to copy.",cols2(
    F("Your text",IT("smText","good vibes","Type something…"))+'<p class="note">These styles are real Unicode characters, so they paste into bios, usernames and posts almost everywhere. A few letters have no true small form in Unicode and use the closest match.</p>',
    '<div class="result-box"><h3>Your styles</h3><div id="smOut"></div></div>'));
  var SMALL={a:"ᴀ",b:"ʙ",c:"ᴄ",d:"ᴅ",e:"ᴇ",f:"ꜰ",g:"ɢ",h:"ʜ",i:"ɪ",j:"ᴊ",k:"ᴋ",l:"ʟ",m:"ᴍ",n:"ɴ",o:"ᴏ",p:"ᴘ",q:"ǫ",r:"ʀ",s:"ꜱ",t:"ᴛ",u:"ᴜ",v:"ᴠ",w:"ᴡ",x:"x",y:"ʏ",z:"ᴢ"};
  var SUPER={a:"ᵃ",b:"ᵇ",c:"ᶜ",d:"ᵈ",e:"ᵉ",f:"ᶠ",g:"ᵍ",h:"ʰ",i:"ⁱ",j:"ʲ",k:"ᵏ",l:"ˡ",m:"ᵐ",n:"ⁿ",o:"ᵒ",p:"ᵖ",q:"۹",r:"ʳ",s:"ˢ",t:"ᵗ",u:"ᵘ",v:"ᵛ",w:"ʷ",x:"ˣ",y:"ʸ",z:"ᶻ","0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹"};
  var BUBBLE={}; "abcdefghijklmnopqrstuvwxyz".split("").forEach(function(c,i){BUBBLE[c]=String.fromCodePoint(0x24B6+i);}); "0123456789".split("").forEach(function(c,i){BUBBLE[c]=i===0?"⓪":String.fromCodePoint(0x2460+i-1);});
  function mapWith(map,t){return t.split("").map(function(ch){var low=ch.toLowerCase();return map[low]||ch;}).join("");}
  function render(){
    var t=$("smText").value;
    var styles=[["Small caps",mapWith(SMALL,t)],["Superscript",mapWith(SUPER,t)],["Bubble",mapWith(BUBBLE,t)],["UPPERCASE",t.toUpperCase()]];
    $("smOut").innerHTML=styles.map(function(s,i){return '<div class="style-row"><span class="s-label">'+s[0]+'</span><span class="s-out" id="smStyle'+i+'"></span><button type="button" class="btn secondary small" data-sm-copy="'+i+'">Copy</button></div>';}).join("");
    styles.forEach(function(s,i){$("smStyle"+i).textContent=s[1]||"—";});
  }
  $("smText").addEventListener("input",render);render();
  document.addEventListener("click",function(e){var b=e.target.closest("[data-sm-copy]");if(b){var el=$("smStyle"+b.getAttribute("data-sm-copy"));if(el)copyText(el.textContent,"Style copied — paste it anywhere");}});
})();

/* ---------- 6. Invisible Character ---------- */
(function(){
  mkPanel("invisiblechar","Invisible Character","Copy a blank character that shows nothing but takes up space.",cols2(
    '<div class="result-box"><h3>Choose your character</h3>'+
    '<div class="style-row"><span class="s-label">Zero-Width Space</span><span class="s-out">U+200B · no width</span><button type="button" class="btn secondary small" data-inv="\u200B">Copy</button></div>'+
    '<div class="style-row"><span class="s-label">Hangul Filler</span><span class="s-out">U+3164 · best for blank names</span><button type="button" class="btn secondary small" data-inv="\u3164">Copy</button></div>'+
    '<div class="style-row"><span class="s-label">Braille Blank</span><span class="s-out">U+2800 · one cell wide</span><button type="button" class="btn secondary small" data-inv="\u2800">Copy</button></div>'+
    '<p class="note">Some apps strip zero-width characters. If one does not work in a name field, try the Hangul Filler or Braille Blank.</p></div>',
    '<div class="result-box"><h3>Test box</h3><div class="field"><textarea id="invTest" rows="5" placeholder="Paste here to test — invisible characters still count below."></textarea></div><div class="kv"><span>Total characters</span><b id="invCount">0</b></div><div class="kv"><span>Visible characters</span><b id="invVis">0</b></div><div class="btn-row"><button type="button" class="btn secondary small" id="invInsert">Insert zero-width space</button></div></div>'));
  function counts(){var t=$("invTest").value;$("invCount").textContent=t.length;$("invVis").textContent=t.replace(/[\u200B\u3164\u2800]/g,"").length;}
  $("invTest").addEventListener("input",counts);counts();
  $("invInsert").addEventListener("click",function(){var ta=$("invTest");ta.value+="\u200B";counts();toast("Invisible character inserted");});
  document.addEventListener("click",function(e){var b=e.target.closest("[data-inv]");if(b)copyText(b.getAttribute("data-inv"),"Invisible character copied");});
})();

/* ---------- 7 & 8. Text <-> Binary ---------- */
(function(){
  mkPanel("texttobinary","Text to Binary Converter","Every character as 8-bit binary bytes — UTF-8 aware.",cols2(
    F("Your text",TA("t2bIn",7,"Type or paste text…"))+'<div class="btn-row"><button type="button" class="btn secondary" id="t2bCopy">Copy binary</button></div>',
    '<div class="result-box"><h3>Binary</h3><div class="output-pre" id="t2bOut">—</div><p class="note" id="t2bNote"></p></div>'));
  function conv(){var t=$("t2bIn").value;if(!t){$("t2bOut").textContent="—";$("t2bNote").textContent="";return;}var bytes=new TextEncoder().encode(t);var parts=[];bytes.forEach(function(b){parts.push(("0000000"+b.toString(2)).slice(-8));});$("t2bOut").textContent=parts.join(" ");$("t2bNote").textContent=t.length+" character"+(t.length===1?"":"s")+" = "+bytes.length+" byte"+(bytes.length===1?"":"s")+" in UTF-8.";}
  $("t2bIn").addEventListener("input",conv);conv();
  $("t2bCopy").addEventListener("click",function(){var t=$("t2bOut").textContent;if(t!=="—")copyText(t,"Binary copied");});
})();
(function(){
  mkPanel("binarytotext","Binary to Text Converter","Decode binary back into readable text — spaces optional.",cols2(
    F("Binary code",TA("b2tIn",7,"Paste binary, e.g. 01001000 01101001"))+'<div class="btn-row"><button type="button" class="btn secondary" id="b2tCopy">Copy text</button></div>',
    '<div class="result-box"><h3>Text</h3><div class="output-pre" id="b2tOut">—</div><p class="note" id="b2tNote"></p></div>'));
  function conv(){var raw=$("b2tIn").value.replace(/[^01]/g,"");if(!raw){$("b2tOut").textContent="—";$("b2tNote").textContent="";return;}var n=Math.floor(raw.length/8),leftover=raw.length%8;var bytes=new Uint8Array(n);for(var i=0;i<n;i++)bytes[i]=parseInt(raw.slice(i*8,i*8+8),2);var txt;try{txt=new TextDecoder("utf-8",{fatal:true}).decode(bytes);}catch(e){txt=new TextDecoder("utf-8").decode(bytes);}$("b2tOut").textContent=txt||"—";$("b2tNote").textContent=n+" byte"+(n===1?"":"s")+" decoded."+(leftover?" "+leftover+" stray bit"+(leftover===1?"":"s")+" ignored — check for a missing digit.":"");}
  $("b2tIn").addEventListener("input",conv);conv();
  $("b2tCopy").addEventListener("click",function(){var t=$("b2tOut").textContent;if(t!=="—")copyText(t,"Text copied");});
})();

/* ---------- 9. Image Converter ---------- */
(function(){
  mkPanel("imageconverter","Image Converter","Convert between JPG, PNG and WebP — on your device, not a server.",
    '<div class="cols"><div><div class="drop" id="icDrop" role="button" tabindex="0"><b>Tap to choose an image, or drop it here</b>JPG, PNG, WebP, GIF or BMP</div><input type="file" id="icFile" accept="image/*" class="hidden" />'+
    F("Output format",SEL("icFormat",'<option value="image/jpeg">JPG — works everywhere</option><option value="image/png">PNG — lossless, keeps transparency</option><option value="image/webp" selected>WebP — smallest for the web</option>'))+
    '<div class="field"><label>Quality — <span class="mono" id="icQVal">85%</span> <span class="hint">(JPG / WebP only)</span></label><input type="range" id="icQuality" min="10" max="100" value="85" /></div>'+
    '<div class="btn-row"><button type="button" class="btn" id="icGo" disabled>Convert image</button><a class="btn secondary hidden" id="icDl" download="converted.jpg">Download converted</a></div></div>'+
    '<div><div class="img-compare"><figure><img id="icOrig" alt="Original image preview" /><figcaption>Original<br /><b id="icOrigSize">No image yet</b></figcaption></figure><figure><img id="icConv" alt="Converted image preview" /><figcaption>Converted<br /><b id="icConvSize">—</b></figcaption></figure></div><div class="savings" id="icSavings"></div></div></div>');
  var file=null,url=null;
  var drop=$("icDrop"),fi=$("icFile");
  drop.addEventListener("click",function(){fi.click();});drop.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();fi.click();}});
  drop.addEventListener("dragover",function(e){e.preventDefault();drop.classList.add("over");});drop.addEventListener("dragleave",function(){drop.classList.remove("over");});
  drop.addEventListener("drop",function(e){e.preventDefault();drop.classList.remove("over");if(e.dataTransfer.files[0])setFile(e.dataTransfer.files[0]);});
  fi.addEventListener("change",function(){if(fi.files[0])setFile(fi.files[0]);});
  function setFile(f){file=f;if(url)URL.revokeObjectURL(url);url=fileURL(f);$("icOrig").src=url;$("icOrigSize").textContent=f.name+" · "+fmtBytes(f.size);$("icGo").disabled=false;$("icDl").classList.add("hidden");$("icSavings").style.display="none";}
  $("icQuality").addEventListener("input",function(){$("icQVal").textContent=$("icQuality").value+"%";});
  $("icGo").addEventListener("click",function(){
    if(!file)return;var fmt=$("icFormat").value,q=parseInt($("icQuality").value,10)/100;
    loadImg(url).then(function(img){var c=document.createElement("canvas");c.width=img.naturalWidth;c.height=img.naturalHeight;var ctx=c.getContext("2d");if(fmt==="image/jpeg"){ctx.fillStyle="#ffffff";ctx.fillRect(0,0,c.width,c.height);}ctx.drawImage(img,0,0);c.toBlob(function(blob){if(!blob){toast("Conversion failed for this image");return;}var cu=URL.createObjectURL(blob);$("icConv").src=cu;$("icConvSize").textContent=fmtBytes(blob.size);var ext=fmt==="image/png"?".png":fmt==="image/webp"?".webp":".jpg";var dl=$("icDl");dl.href=cu;dl.setAttribute("download",file.name.replace(/\.[^.]+$/,"")+"-converted"+ext);dl.classList.remove("hidden");var diff=file.size-blob.size,sv=$("icSavings");sv.style.display="block";sv.textContent=diff>0?("Saved "+fmtBytes(diff)+" ("+Math.round(diff/file.size*100)+"% smaller)"):("Converted — new file is "+fmtBytes(blob.size)+" (this format is larger for this image)");},"image/jpeg"===fmt||"image/webp"===fmt?fmt:fmt,q);}).catch(function(){toast("Could not read that image");});
  });
})();

/* ---------- 10. SVG to PNG ---------- */
(function(){
  mkPanel("svgtopng","SVG to PNG Converter","Render an SVG file or pasted SVG code as a PNG at your size.",cols2(
    '<div class="drop" id="svgDrop" role="button" tabindex="0"><b>Tap to choose an SVG file, or drop it here</b>…or paste SVG code below instead</div><input type="file" id="svgFile" accept="image/svg+xml,.svg" class="hidden" />'+
    F("Or paste SVG code",TA("svgCode",5,"<svg xmlns='http://www.w3.org/2000/svg' …>…</svg>"))+
    F("Output width (px)",SEL("svgSize",'<option value="256">256 px</option><option value="512" selected>512 px</option><option value="1024">1024 px</option><option value="2048">2048 px</option>'))+
    '<div class="btn-row"><button type="button" class="btn" id="svgGo">Convert to PNG</button><a class="btn secondary hidden" id="svgDl" download="converted.png">Download PNG</a></div>',
    '<div class="result-box"><h3>Preview</h3><div class="fav-preview"><img id="svgPreview" alt="Converted PNG preview" style="max-width:100%;max-height:300px" /></div><p class="note" id="svgNote">Height scales automatically to keep the SVG\u2019s proportions.</p></div>'));
  var svgText="";
  var drop=$("svgDrop"),fi=$("svgFile");
  drop.addEventListener("click",function(){fi.click();});
  drop.addEventListener("dragover",function(e){e.preventDefault();drop.classList.add("over");});drop.addEventListener("dragleave",function(){drop.classList.remove("over");});
  drop.addEventListener("drop",function(e){e.preventDefault();drop.classList.remove("over");if(e.dataTransfer.files[0])readSvg(e.dataTransfer.files[0]);});
  fi.addEventListener("change",function(){if(fi.files[0])readSvg(fi.files[0]);});
  function readSvg(f){var r=new FileReader();r.onload=function(){svgText=String(r.result);$("svgNote").textContent="Loaded "+f.name+" ("+fmtBytes(f.size)+"). Now press Convert to PNG.";};r.readAsText(f);}
  $("svgGo").addEventListener("click",function(){
    var code=$("svgCode").value.trim()||svgText;
    if(!code){toast("Choose an SVG file or paste SVG code first");return;}
    var blob=new Blob([code],{type:"image/svg+xml;charset=utf-8"});var u=URL.createObjectURL(blob);
    loadImg(u).then(function(img){var W=parseInt($("svgSize").value,10);var ratio=img.naturalWidth?img.naturalHeight/img.naturalWidth:1;var H=Math.max(1,Math.round(W*ratio));var c=document.createElement("canvas");c.width=W;c.height=H;c.getContext("2d").drawImage(img,0,0,W,H);c.toBlob(function(b){if(!b){toast("Could not render that SVG");return;}var pu=URL.createObjectURL(b);$("svgPreview").src=pu;var dl=$("svgDl");dl.href=pu;dl.classList.remove("hidden");$("svgNote").textContent="Rendered at "+W+" × "+H+" px · "+fmtBytes(b.size)+".";},"image/png");}).catch(function(){toast("That SVG could not be rendered — check the code is complete");});
  });
})();

/* ---------- 11. Favicon Generator ---------- */
(function(){
  mkPanel("favicon","Favicon Generator","A complete favicon set from text, an emoji or your own image.",cols2(
    F("Create from",'<div class="seg" id="favSeg"><button type="button" class="active" data-mode="text">Text / Emoji</button><button type="button" data-mode="image">Upload Image</button></div>')+
    '<div id="favTextWrap">'+F("Letter(s) or emoji",IT("favText","T","e.g. T, TN or 🚀"))+F("Background colour",'<input type="color" id="favColor" value="#10b981" />')+F("Text colour",'<input type="color" id="favTextColor" value="#ffffff" />')+'</div>'+
    '<div id="favImgWrap" class="hidden"><div class="drop" id="favDrop" role="button" tabindex="0"><b>Tap to choose a square logo image</b>PNG or JPG works best</div><input type="file" id="favFile" accept="image/*" class="hidden" /></div>'+
    F("Corner style",SEL("favRadius",'<option value="0.22">Rounded</option><option value="0">Square</option><option value="0.5">Circle</option>')),
    '<div class="result-box"><h3>Preview</h3><div class="fav-preview"><canvas id="favCanvas" width="180" height="180" style="width:120px;height:120px;border-radius:18px"></canvas></div><div class="btn-row" style="justify-content:center;margin-top:14px"><button type="button" class="btn secondary small" data-fav-dl="16">PNG 16</button><button type="button" class="btn secondary small" data-fav-dl="32">PNG 32</button><button type="button" class="btn secondary small" data-fav-dl="48">PNG 48</button><button type="button" class="btn secondary small" data-fav-dl="180">PNG 180</button><button type="button" class="btn small" id="favIco">Download favicon.ico</button></div><p class="note">Put favicon.ico in your site\u2019s root folder. The 180 PNG is the Apple touch icon size.</p></div>'));
  var mode="text",imgObj=null;
  segWire("favSeg",function(b){mode=b.getAttribute("data-mode");$("favTextWrap").classList.toggle("hidden",mode!=="text");$("favImgWrap").classList.toggle("hidden",mode!=="image");draw();});
  var drop=$("favDrop"),fi=$("favFile");
  drop.addEventListener("click",function(){fi.click();});
  fi.addEventListener("change",function(){if(fi.files[0])loadImg(fileURL(fi.files[0])).then(function(i){imgObj=i;draw();});});
  function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
  function drawTo(ctx,S){
    var rad=parseFloat($("favRadius").value)*S;
    ctx.clearRect(0,0,S,S);roundRect(ctx,0,0,S,S,rad);ctx.save();ctx.clip();
    if(mode==="image"&&imgObj){ctx.fillStyle="#ffffff";ctx.fillRect(0,0,S,S);var sc=Math.max(S/imgObj.naturalWidth,S/imgObj.naturalHeight);var w=imgObj.naturalWidth*sc,h=imgObj.naturalHeight*sc;ctx.drawImage(imgObj,(S-w)/2,(S-h)/2,w,h);}
    else{ctx.fillStyle=$("favColor").value;ctx.fillRect(0,0,S,S);var t=$("favText").value||"T";ctx.fillStyle=$("favTextColor").value;ctx.textAlign="center";ctx.textBaseline="middle";var fs=t.length>2?S*0.4:(t.length===2?S*0.52:S*0.68);var isEmoji=/[^\x00-\x7F]/.test(t)&&t.length<=4;ctx.font=(isEmoji?"":"800 ")+fs+"px 'Plus Jakarta Sans',sans-serif";ctx.fillText(t,S/2,S/2+fs*0.04);}
    ctx.restore();
  }
  function draw(){drawTo($("favCanvas").getContext("2d"),180);}
  onIn(["favText","favColor","favTextColor","favRadius"],draw);draw();
  function pngBlob(S){return new Promise(function(res){var c=document.createElement("canvas");c.width=S;c.height=S;drawTo(c.getContext("2d"),S);c.toBlob(res,"image/png");});}
  document.addEventListener("click",function(e){var b=e.target.closest("[data-fav-dl]");if(b){var S=parseInt(b.getAttribute("data-fav-dl"),10);pngBlob(S).then(function(blob){if(blob)dlBlob(blob,"favicon-"+S+"x"+S+".png");});}});
  $("favIco").addEventListener("click",function(){
    var sizes=[16,32,48];var blobs=[];
    (function next(i){if(i>=sizes.length){buildIco();return;}pngBlob(sizes[i]).then(function(b){blobs.push(b);next(i+1);});})(0);
    function buildIco(){
      var bufs=[],total=6+16*sizes.length;blobs.forEach(function(b){total+=b.size;});
      var ab=new ArrayBuffer(total),dv=new DataView(ab),u8=new Uint8Array(ab);
      dv.setUint16(0,0,true);dv.setUint16(2,1,true);dv.setUint16(4,sizes.length,true);
      var off=6+16*sizes.length;
      var pending=sizes.length;
      blobs.forEach(function(b,idx){b.arrayBuffer().then(function(buf){var s=sizes[idx];var eoff=6+16*idx;u8[eoff]=s>=256?0:s;u8[eoff+1]=s>=256?0:s;u8[eoff+2]=0;u8[eoff+3]=0;dv.setUint16(eoff+4,1,true);dv.setUint16(eoff+6,32,true);dv.setUint32(eoff+8,buf.byteLength,true);dv.setUint32(eoff+12,off,true);u8.set(new Uint8Array(buf),off);off+=buf.byteLength;pending--;if(!pending)dlBlob(new Blob([ab],{type:"image/x-icon"}),"favicon.ico");});});
    }
  });
})();

/* ---------- 12. Meme Generator ---------- */
(function(){
  mkPanel("meme","Meme Generator","Classic top and bottom captions on any image — no watermark.",cols2(
    '<div class="drop" id="memeDrop" role="button" tabindex="0"><b>Tap to choose an image, or drop it here</b>Your image never leaves this device</div><input type="file" id="memeFile" accept="image/*" class="hidden" />'+
    F("Top text",IT("memeTop","","e.g. WHEN THE WIFI DROPS"))+F("Bottom text",IT("memeBottom","","e.g. DURING THE FINAL BOSS"))+
    '<div class="field"><label>Text size — <span class="mono" id="memeSizeVal">48</span>px</label><input type="range" id="memeSize" min="20" max="110" value="48" /></div>'+
    '<div class="btn-row"><button type="button" class="btn" id="memeDl" disabled>Download meme PNG</button></div>',
    '<div class="result-box"><h3>Preview</h3><canvas id="memeCanvas" class="tool-canvas" width="600" height="400"></canvas><p class="note">Bold white text with a black outline — the classic meme style, readable on any photo.</p></div>'));
  var img=null;var drop=$("memeDrop"),fi=$("memeFile");
  drop.addEventListener("click",function(){fi.click();});
  drop.addEventListener("dragover",function(e){e.preventDefault();drop.classList.add("over");});drop.addEventListener("dragleave",function(){drop.classList.remove("over");});
  drop.addEventListener("drop",function(e){e.preventDefault();drop.classList.remove("over");if(e.dataTransfer.files[0])setImg(e.dataTransfer.files[0]);});
  fi.addEventListener("change",function(){if(fi.files[0])setImg(fi.files[0]);});
  function setImg(f){loadImg(fileURL(f)).then(function(i){img=i;draw();$("memeDl").disabled=false;});}
  function draw(){
    var c=$("memeCanvas"),ctx=c.getContext("2d");
    if(!img){ctx.fillStyle="#e5e7eb";ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle="#5b6b7f";ctx.font="600 22px sans-serif";ctx.textAlign="center";ctx.fillText("Choose an image to start",c.width/2,c.height/2);return;}
    var maxW=900,sc=Math.min(1,maxW/img.naturalWidth);c.width=Math.round(img.naturalWidth*sc);c.height=Math.round(img.naturalHeight*sc);
    ctx.drawImage(img,0,0,c.width,c.height);
    var size=parseInt($("memeSize").value,10)*(c.width/600);size=Math.max(14,size);
    ctx.font="900 "+size+"px 'Arial Black',Arial,sans-serif";ctx.textAlign="center";ctx.lineWidth=size/7;ctx.strokeStyle="#000";ctx.fillStyle="#fff";ctx.lineJoin="round";
    function caption(text,y){if(!text)return;var words=text.toUpperCase().split(/\s+/),lines=[],line="";words.forEach(function(w){var test=line?line+" "+w:w;if(ctx.measureText(test).width>c.width*0.94&&line){lines.push(line);line=w;}else line=test;});if(line)lines.push(line);lines.forEach(function(l,i){var yy=y+(i-(lines.length-1)/2)*size*1.12;ctx.strokeText(l,c.width/2,yy);ctx.fillText(l,c.width/2,yy);});}
    ctx.textBaseline="middle";
    caption($("memeTop").value,size*0.75);
    caption($("memeBottom").value,c.height-size*0.75);
  }
  onIn(["memeTop","memeBottom"],draw);
  $("memeSize").addEventListener("input",function(){$("memeSizeVal").textContent=$("memeSize").value;draw();});
  draw();
  $("memeDl").addEventListener("click",function(){$("memeCanvas").toBlob(function(b){if(b)dlBlob(b,"meme.png");},"image/png");});
})();

/* ---------- 13. Emoji Picker ---------- */
(function(){
  var EMOJIS=[["😀","grinning face happy smile"],["😁","beaming smile grin"],["😂","laugh tears joy funny"],["🤣","rolling laughing rofl"],["😊","smiling blush happy"],["😍","heart eyes love crush"],["😘","kiss love blow"],["😎","cool sunglasses confident"],["🤩","star struck wow excited"],["🥳","party celebrate birthday"],["😢","sad cry tear"],["😭","crying sob loudly"],["😡","angry mad rage"],["🥺","pleading puppy eyes"],["😴","sleepy tired sleep"],["🤔","thinking hmm curious"],["🤯","mind blown shocked exploding"],["🥶","cold freezing winter"],["🥵","hot sweating heat"],["🤠","cowboy hat western"],["👍","thumbs up yes ok good"],["👎","thumbs down no bad"],["🙏","pray please thanks hope"],["👏","clap applause bravo"],["🙌","hands raised celebrate hooray"],["👋","wave hello hi bye"],["🤝","handshake deal agree"],["💪","muscle strong flex gym"],["🫶","heart hands love"],["❤️","red heart love"],["🧡","orange heart"],["💛","yellow heart"],["💚","green heart"],["💙","blue heart"],["💜","purple heart"],["🖤","black heart"],["🤍","white heart"],["💔","broken heart sad"],["💖","sparkling heart love"],["💯","hundred points perfect score"],["🔥","fire hot lit trending"],["⭐","star favorite"],["🌟","glowing star shine"],["✨","sparkles magic new"],["🎉","party popper celebrate confetti"],["🎊","confetti ball party"],["🎁","gift present birthday"],["🎂","birthday cake celebrate"],["🏆","trophy winner champion"],["🥇","gold medal first winner"],["⚽","soccer football sport"],["🏀","basketball sport"],["🎮","video game gaming controller"],["🎲","dice game random"],["🚀","rocket launch space fast"],["✈️","airplane travel flight"],["🚗","car drive travel"],["🏠","house home"],["💻","laptop computer work"],["📱","phone mobile smartphone"],["💡","light bulb idea tip"],["💰","money bag rich cash"],["💸","money wings spend flying"],["📈","chart growth stocks up"],["📉","chart down stocks loss"],["⏰","alarm clock time wake"],["📅","calendar date schedule"],["📌","pin location note"],["🔍","search magnifying find"],["🔒","lock secure private"],["🔑","key password access"],["✉️","email mail envelope"],["📦","package box delivery"],["🛒","shopping cart buy"],["🍕","pizza food"],["🍔","burger food"],["🍟","fries food"],["🍩","donut sweet food"],["🍦","ice cream sweet"],["☕","coffee hot drink"],["🍺","beer drink cheers"],["🥂","cheers glasses celebrate toast"],["🐶","dog puppy pet"],["🐱","cat kitten pet"],["🦁","lion animal"],["🐼","panda bear animal"],["🦊","fox animal"],["🐸","frog animal"],["🦋","butterfly insect pretty"],["🌸","cherry blossom flower spring"],["🌹","rose flower love"],["🌻","sunflower flower"],["🌈","rainbow weather pride"],["☀️","sun sunny weather"],["🌙","moon night crescent"],["⚡","lightning bolt energy fast"],["❄️","snowflake winter cold"],["🌊","wave ocean sea water"],["🎵","music note song"],["🎧","headphones music listen"],["📸","camera photo picture"],["🎬","movie film cinema clapper"],["📚","books study read"],["✏️","pencil write edit"],["📝","memo note write"],["✅","check mark done yes tick"],["❌","cross mark no wrong"],["⚠️","warning caution alert"],["🚫","prohibited no forbidden"],["💤","sleep zzz tired"],["🛠️","tools fix build wrench"],["🎯","target goal aim bullseye"],["🧲","magnet attract"],["🎓","graduation cap education degree"],["💼","briefcase work business job"],["🏥","hospital medical health"],["💊","pill medicine health"],["🌍","globe earth world"],["🗺️","map world travel"],["🧭","compass direction navigate"],["⌛","hourglass time waiting"],["🔔","bell notification alert"],["📢","megaphone announce loud"],["💬","speech balloon chat message"],["💭","thought balloon think dream"],["👀","eyes look watch see"],["🧠","brain smart think mind"],["❓","question mark help"],["❗","exclamation mark important"],["♻️","recycle green environment"],["🌱","seedling plant grow spring"],["🍀","four leaf clover luck"],["🎄","christmas tree holiday"],["🎃","pumpkin halloween"],["🎅","santa christmas"],["🐝","bee honey insect"],["🦄","unicorn magic fantasy"],["🍓","strawberry fruit"],["🍎","apple fruit"],["🍋","lemon fruit sour"],["🥑","avocado food"],["🌮","taco food mexican"],["🍣","sushi food japanese"],["🍜","ramen noodles food"],["🥗","salad healthy food"],["🍿","popcorn movie snack"]];
  mkPanel("emojipicker","Emoji Picker","Search, tap, paste — emojis for messages, posts and bios.",
    F("Search emojis",IT("emoSearch","","Try “cat”, “fire”, “money”, “party”…"))+'<div class="emoji-grid" id="emoGrid"></div><p class="note" id="emoCount"></p>');
  function render(){
    var q=($("emoSearch").value||"").toLowerCase().trim();
    var list=EMOJIS.filter(function(e){return !q||e[1].indexOf(q)>=0;});
    $("emoGrid").innerHTML=list.map(function(e){return '<button type="button" class="emoji-btn" data-emo="'+e[0]+'" aria-label="'+e[1]+'" title="'+e[1]+'">'+e[0]+"</button>";}).join("");
    $("emoCount").textContent=list.length+" emojis — tap one to copy it.";
  }
  $("emoSearch").addEventListener("input",render);render();
  document.addEventListener("click",function(e){var b=e.target.closest("[data-emo]");if(b)copyText(b.getAttribute("data-emo"),"Emoji copied — paste it anywhere");});
})();

/* ---------- 14. Compress Image to KB ---------- */
(function(){
  mkPanel("compresskb","Compress Image to KB","Shrink an image to under the exact file size your form demands.",cols2(
    '<div class="drop" id="ckDrop" role="button" tabindex="0"><b>Tap to choose an image, or drop it here</b>JPG, PNG or WebP</div><input type="file" id="ckFile" accept="image/*" class="hidden" />'+
    F("Target size",SEL("ckTarget",'<option value="20">20 KB</option><option value="50">50 KB</option><option value="100" selected>100 KB</option><option value="200">200 KB</option><option value="custom">Custom…</option>'))+
    F("Custom target (KB)",IN("ckCustom",75,'min="5" max="5000" step="1"'))+
    '<div class="btn-row"><button type="button" class="btn" id="ckGo" disabled>Compress to target</button><a class="btn secondary hidden" id="ckDl" download="compressed.jpg">Download compressed</a></div>',
    '<div class="result-box"><h3>Result</h3><div class="big-num" id="ckBig">—</div><div style="margin-top:12px" id="ckKv"></div><img id="ckPreview" alt="Compressed image preview" style="max-width:100%;border-radius:10px;margin-top:10px" /><p class="note">The tool lowers JPEG quality first, then trims dimensions only if needed, until the file fits under your target.</p></div>'));
  var file=null,url=null;var drop=$("ckDrop"),fi=$("ckFile");
  drop.addEventListener("click",function(){fi.click();});
  drop.addEventListener("dragover",function(e){e.preventDefault();drop.classList.add("over");});drop.addEventListener("dragleave",function(){drop.classList.remove("over");});
  drop.addEventListener("drop",function(e){e.preventDefault();drop.classList.remove("over");if(e.dataTransfer.files[0])setFile(e.dataTransfer.files[0]);});
  fi.addEventListener("change",function(){if(fi.files[0])setFile(fi.files[0]);});
  function setFile(f){file=f;if(url)URL.revokeObjectURL(url);url=fileURL(f);$("ckGo").disabled=false;$("ckBig").textContent=fmtBytes(f.size);$("ckKv").innerHTML='<div class="kv"><span>Original file</span><b>'+f.name+"</b></div>";}
  function targetBytes(){var t=$("ckTarget").value;var kb=t==="custom"?(parseFloat($("ckCustom").value)||75):parseFloat(t);return Math.max(5,kb)*1024;}
  function canvasBlob(c,q){return new Promise(function(res){c.toBlob(res,"image/jpeg",q);});}
  $("ckGo").addEventListener("click",function(){
    if(!file)return;var target=targetBytes();$("ckBig").textContent="Working…";
    loadImg(url).then(async function(img){
      var scale=1,best=null;
      for(var attempt=0;attempt<14&&!best;attempt++){
        var w=Math.max(50,Math.round(img.naturalWidth*scale)),h=Math.max(50,Math.round(img.naturalHeight*scale));
        var c=document.createElement("canvas");c.width=w;c.height=h;var ctx=c.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,w,h);ctx.drawImage(img,0,0,w,h);
        var lo=0.05,hi=0.95,fit=null;
        for(var i=0;i<9;i++){var q=(lo+hi)/2;var b=await canvasBlob(c,q);if(!b)break;if(b.size<=target){fit=b;lo=q;}else hi=q;}
        if(!fit){var low=await canvasBlob(c,0.05);if(low&&low.size<=target)fit=low;}
        if(fit)best={blob:fit,w:w,h:h};else scale*=0.82;
      }
      if(!best){$("ckBig").textContent="Could not reach target";$("ckKv").innerHTML='<div class="kv"><span>Result</span><b>Try a larger target for this image</b></div>';return;}
      var bu=URL.createObjectURL(best.blob);$("ckPreview").src=bu;$("ckBig").textContent=fmtBytes(best.blob.size);
      $("ckKv").innerHTML='<div class="kv"><span>Original</span><b>'+fmtBytes(file.size)+'</b></div><div class="kv"><span>Compressed</span><b>'+fmtBytes(best.blob.size)+'</b></div><div class="kv"><span>Dimensions</span><b>'+best.w+" × "+best.h+'</b></div><div class="kv total"><span>Saved</span><b>'+Math.round((1-best.blob.size/file.size)*100)+"%</b></div>";
      var dl=$("ckDl");dl.href=bu;dl.setAttribute("download",file.name.replace(/\.[^.]+$/,"")+"-under-"+Math.round(target/1024)+"kb.jpg");dl.classList.remove("hidden");
    }).catch(function(){toast("Could not read that image");});
  });
})();

/* ---------- 15. Merge PDF ---------- */
(function(){
  mkPanel("mergepdf","Merge PDF","Combine several PDFs into one — in your browser, never uploaded.",cols2(
    '<div class="drop" id="mgDrop" role="button" tabindex="0"><b>Tap to choose PDF files, or drop them here</b>Select several at once with Ctrl / Cmd + click</div><input type="file" id="mgFiles" accept="application/pdf" multiple class="hidden" />'+
    '<div class="file-list" id="mgList">No files chosen yet.</div>'+
    '<div class="btn-row"><button type="button" class="btn" id="mgGo" disabled>Merge PDFs</button></div><p class="status-line" id="mgStatus"></p>',
    RB("Merged document","mgBig")));
  var files=[];var drop=$("mgDrop"),fi=$("mgFiles");
  drop.addEventListener("click",function(){fi.click();});
  drop.addEventListener("dragover",function(e){e.preventDefault();drop.classList.add("over");});drop.addEventListener("dragleave",function(){drop.classList.remove("over");});
  drop.addEventListener("drop",function(e){e.preventDefault();drop.classList.remove("over");setFiles(e.dataTransfer.files);});
  fi.addEventListener("change",function(){setFiles(fi.files);});
  function setFiles(list){files=Array.prototype.slice.call(list||[]);$("mgList").innerHTML=files.length?files.map(function(f,i){return "<div><b>"+(i+1)+".</b> "+f.name+" — "+fmtBytes(f.size)+"</div>";}).join(""):"No files chosen yet.";$("mgGo").disabled=files.length<2;$("mgStatus").textContent=files.length===1?"Choose at least one more PDF to merge.":"";}
  $("mgGo").addEventListener("click",async function(){
    if(!window.PDFLib){pdfLibMissing("mgStatus");return;}
    $("mgStatus").textContent="Merging…";
    try{
      var out=await PDFLib.PDFDocument.create();var pages=0;
      for(var i=0;i<files.length;i++){var buf=await files[i].arrayBuffer();var src=await PDFLib.PDFDocument.load(buf);var copied=await out.copyPages(src,src.getPageIndices());copied.forEach(function(p){out.addPage(p);});pages+=src.getPageCount();}
      var bytes=await out.save();dlBlob(new Blob([bytes],{type:"application/pdf"}),"merged.pdf");
      $("mgBig").textContent=pages+" pages";KV("mgBig",[["Files merged",files.length],["Total pages",pages,1]]);NOTE("mgBig","Your merged PDF has downloaded. The originals are unchanged.");$("mgStatus").textContent="Done — merged.pdf downloaded.";
    }catch(err){$("mgStatus").textContent="Could not merge — one file may be protected or damaged.";}
  });
})();

/* ---------- 16. Split PDF ---------- */
(function(){
  mkPanel("splitpdf","Split PDF","Extract a page range, or split every page into its own PDF.",cols2(
    '<div class="drop" id="spDrop" role="button" tabindex="0"><b>Tap to choose a PDF, or drop it here</b></div><input type="file" id="spFile" accept="application/pdf" class="hidden" />'+
    F("Pages to extract",IT("spRange","1-3","e.g. 2-4 or 1,3,6"),"Leave the split button for all pages")+
    '<div class="btn-row"><button type="button" class="btn" id="spExtract" disabled>Extract pages</button><button type="button" class="btn secondary" id="spAll" disabled>Split every page</button></div><p class="status-line" id="spStatus"></p>',
    RB("Your PDF","spBig")));
  var file=null,pages=0;var drop=$("spDrop"),fi=$("spFile");
  drop.addEventListener("click",function(){fi.click();});
  drop.addEventListener("dragover",function(e){e.preventDefault();drop.classList.add("over");});drop.addEventListener("dragleave",function(){drop.classList.remove("over");});
  drop.addEventListener("drop",function(e){e.preventDefault();drop.classList.remove("over");if(e.dataTransfer.files[0])setFile(e.dataTransfer.files[0]);});
  fi.addEventListener("change",function(){if(fi.files[0])setFile(fi.files[0]);});
  async function setFile(f){file=f;if(!window.PDFLib){pdfLibMissing("spStatus");return;}try{var buf=await f.arrayBuffer();var doc=await PDFLib.PDFDocument.load(buf);pages=doc.getPageCount();$("spBig").textContent=pages+" pages";KV("spBig",[["File",f.name],["Size",fmtBytes(f.size),1]]);$("spExtract").disabled=false;$("spAll").disabled=false;}catch(e){$("spStatus").textContent="Could not read that PDF.";}}
  function parseRange(str,total){var set={};str.split(",").forEach(function(part){part=part.trim();if(!part)return;var m=part.match(/^(\d+)\s*-\s*(\d+)$/);if(m){var a=Math.max(1,parseInt(m[1],10)),b=Math.min(total,parseInt(m[2],10));for(var i=a;i<=b;i++)set[i]=1;}else{var n=parseInt(part,10);if(n>=1&&n<=total)set[n]=1;}});return Object.keys(set).map(Number).sort(function(a,b){return a-b;});}
  $("spExtract").addEventListener("click",async function(){
    if(!file)return;try{var buf=await file.arrayBuffer();var src=await PDFLib.PDFDocument.load(buf);var idx=parseRange($("spRange").value,src.getPageCount());if(!idx.length){$("spStatus").textContent="Enter at least one valid page number.";return;}var out=await PDFLib.PDFDocument.create();var copied=await out.copyPages(src,idx.map(function(n){return n-1;}));copied.forEach(function(p){out.addPage(p);});var bytes=await out.save();dlBlob(new Blob([bytes],{type:"application/pdf"}),"pages-"+idx.join("-")+".pdf");$("spStatus").textContent="Extracted "+idx.length+" page(s).";}catch(e){$("spStatus").textContent="Extraction failed — the file may be protected.";}
  });
  $("spAll").addEventListener("click",async function(){
    if(!file)return;try{var buf=await file.arrayBuffer();var src=await PDFLib.PDFDocument.load(buf);var total=src.getPageCount();$("spStatus").textContent="Splitting "+total+" pages — downloads will start one by one…";for(var i=0;i<total;i++){var out=await PDFLib.PDFDocument.create();var cp=await out.copyPages(src,[i]);out.addPage(cp[0]);var bytes=await out.save();dlBlob(new Blob([bytes],{type:"application/pdf"}),"page-"+(i+1)+".pdf");await new Promise(function(r){setTimeout(r,350);});}$("spStatus").textContent="Done — "+total+" single-page PDFs downloaded.";}catch(e){$("spStatus").textContent="Split failed — the file may be protected.";}
  });
})();

/* ---------- 17. Rotate PDF ---------- */
(function(){
  mkPanel("rotatepdf","Rotate PDF","Fix sideways or upside-down PDF pages — losslessly.",cols2(
    '<div class="drop" id="rtDrop" role="button" tabindex="0"><b>Tap to choose a PDF, or drop it here</b></div><input type="file" id="rtFile" accept="application/pdf" class="hidden" />'+
    F("Rotate by",SEL("rtAngle",'<option value="90">90° clockwise</option><option value="180">180° (upside down fix)</option><option value="270">270° clockwise (90° counter-clockwise)</option>'))+
    F("Page range (optional)",IT("rtRange","","e.g. 2-3 — blank means all pages"))+
    '<div class="btn-row"><button type="button" class="btn" id="rtGo" disabled>Rotate & download</button></div><p class="status-line" id="rtStatus"></p>',
    RB("Your PDF","rtBig")));
  var file=null;var drop=$("rtDrop"),fi=$("rtFile");
  drop.addEventListener("click",function(){fi.click();});
  drop.addEventListener("dragover",function(e){e.preventDefault();drop.classList.add("over");});drop.addEventListener("dragleave",function(){drop.classList.remove("over");});
  drop.addEventListener("drop",function(e){e.preventDefault();drop.classList.remove("over");if(e.dataTransfer.files[0])setFile(e.dataTransfer.files[0]);});
  fi.addEventListener("change",function(){if(fi.files[0])setFile(fi.files[0]);});
  async function setFile(f){file=f;if(!window.PDFLib){pdfLibMissing("rtStatus");return;}try{var buf=await f.arrayBuffer();var doc=await PDFLib.PDFDocument.load(buf);$("rtBig").textContent=doc.getPageCount()+" pages";KV("rtBig",[["File",f.name],["Size",fmtBytes(f.size),1]]);$("rtGo").disabled=false;}catch(e){$("rtStatus").textContent="Could not read that PDF.";}}
  $("rtGo").addEventListener("click",async function(){
    if(!file)return;try{var buf=await file.arrayBuffer();var doc=await PDFLib.PDFDocument.load(buf);var total=doc.getPageCount();var angle=parseInt($("rtAngle").value,10);
    var range=$("rtRange").value.trim();var targets=[];if(!range){for(var i=1;i<=total;i++)targets.push(i);}else{range.split(",").forEach(function(part){var m=part.trim().match(/^(\d+)\s*-\s*(\d+)$/);if(m){for(var j=parseInt(m[1],10);j<=parseInt(m[2],10);j++)if(j>=1&&j<=total)targets.push(j);}else{var n=parseInt(part,10);if(n>=1&&n<=total)targets.push(n);}});}
    var pagesArr=doc.getPages();targets.forEach(function(n){var p=pagesArr[n-1];var cur=p.getRotation().angle;p.setRotation(PDFLib.degrees((cur+angle)%360));});
    var bytes=await doc.save();dlBlob(new Blob([bytes],{type:"application/pdf"}),"rotated.pdf");$("rtStatus").textContent="Done — rotated "+targets.length+" page(s) by "+angle+"°.";}catch(e){$("rtStatus").textContent="Rotation failed — the file may be protected.";}
  });
})();

/* ---------- 18. JPG to PDF ---------- */
(function(){
  mkPanel("jpgtopdf","JPG to PDF Converter","Images in, one tidy PDF out — one image per page.",cols2(
    '<div class="drop" id="jpDrop" role="button" tabindex="0"><b>Tap to choose images, or drop them here</b>JPG, PNG or WebP — they appear in selection order</div><input type="file" id="jpFiles" accept="image/*" multiple class="hidden" />'+
    '<div class="file-list" id="jpList">No images chosen yet.</div>'+
    F("Page style",SEL("jpStyle",'<option value="a4">Fit to A4 page (with margins)</option><option value="full">Full-page — PDF page matches each image</option>'))+
    '<div class="btn-row"><button type="button" class="btn" id="jpGo" disabled>Convert to PDF</button></div><p class="status-line" id="jpStatus"></p>',
    RB("Your PDF","jpBig")));
  var files=[];var drop=$("jpDrop"),fi=$("jpFiles");
  drop.addEventListener("click",function(){fi.click();});
  drop.addEventListener("dragover",function(e){e.preventDefault();drop.classList.add("over");});drop.addEventListener("dragleave",function(){drop.classList.remove("over");});
  drop.addEventListener("drop",function(e){e.preventDefault();drop.classList.remove("over");setFiles(e.dataTransfer.files);});
  fi.addEventListener("change",function(){setFiles(fi.files);});
  function setFiles(list){files=Array.prototype.slice.call(list||[]);$("jpList").innerHTML=files.length?files.map(function(f,i){return "<div><b>Page "+(i+1)+":</b> "+f.name+" — "+fmtBytes(f.size)+"</div>";}).join(""):"No images chosen yet.";$("jpGo").disabled=!files.length;}
  async function embedImage(doc,f){
    var buf=await f.arrayBuffer();
    if(f.type==="image/jpeg"||/\.jpe?g$/i.test(f.name))return doc.embedJpg(buf);
    if(f.type==="image/png"||/\.png$/i.test(f.name))return doc.embedPng(buf);
    var img=await loadImg(fileURL(f));var c=document.createElement("canvas");c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext("2d").drawImage(img,0,0);
    var pngBuf=await new Promise(function(res){c.toBlob(function(b){b.arrayBuffer().then(res);},"image/png");});
    return doc.embedPng(pngBuf);
  }
  $("jpGo").addEventListener("click",async function(){
    if(!window.PDFLib){pdfLibMissing("jpStatus");return;}
    $("jpStatus").textContent="Building your PDF…";
    try{
      var doc=await PDFLib.PDFDocument.create();var A4=[595.28,841.89];
      for(var i=0;i<files.length;i++){
        var emb=await embedImage(doc,files[i]);
        if($("jpStyle").value==="full"){var pg=doc.addPage([emb.width,emb.height]);pg.drawImage(emb,{x:0,y:0,width:emb.width,height:emb.height});}
        else{var pg2=doc.addPage(A4);var margin=36;var maxW=A4[0]-margin*2,maxH=A4[1]-margin*2;var sc=Math.min(maxW/emb.width,maxH/emb.height);var w=emb.width*sc,h=emb.height*sc;pg2.drawImage(emb,{x:(A4[0]-w)/2,y:(A4[1]-h)/2,width:w,height:h});}
      }
      var bytes=await doc.save();dlBlob(new Blob([bytes],{type:"application/pdf"}),"images.pdf");
      $("jpBig").textContent=files.length+(files.length===1?" page":" pages");KV("jpBig",[["Images converted",files.length],["PDF size",fmtBytes(bytes.length),1]]);NOTE("jpBig","Your PDF has downloaded — one image per page.");$("jpStatus").textContent="Done.";
    }catch(e){$("jpStatus").textContent="Conversion failed — try JPG or PNG images.";}
  });
})();

/* ---------- 19. PDF to JPG ---------- */
(function(){
  mkPanel("pdftojpg","PDF to JPG Converter","Render every PDF page as a JPG image, ready to download.",cols2(
    '<div class="drop" id="pjDrop" role="button" tabindex="0"><b>Tap to choose a PDF, or drop it here</b>Pages render at 1.5× for crisp text</div><input type="file" id="pjFile" accept="application/pdf" class="hidden" />'+
    '<div class="btn-row"><button type="button" class="btn" id="pjGo" disabled>Convert pages</button></div><p class="status-line" id="pjStatus"></p>',
    '<div class="result-box"><h3>Pages</h3><div class="big-num" id="pjBig">—</div><div class="page-thumbs" id="pjThumbs"></div><p class="note">Each page gets its own download button — take only the pages you need.</p></div>'));
  var file=null;var drop=$("pjDrop"),fi=$("pjFile");
  drop.addEventListener("click",function(){fi.click();});
  drop.addEventListener("dragover",function(e){e.preventDefault();drop.classList.add("over");});drop.addEventListener("dragleave",function(){drop.classList.remove("over");});
  drop.addEventListener("drop",function(e){e.preventDefault();drop.classList.remove("over");if(e.dataTransfer.files[0]){file=e.dataTransfer.files[0];$("pjGo").disabled=false;}});
  fi.addEventListener("change",function(){if(fi.files[0]){file=fi.files[0];$("pjGo").disabled=false;}});
  $("pjGo").addEventListener("click",async function(){
    if(!window.pdfjsLib){$("pjStatus").textContent="The PDF renderer could not load — check your connection and reload.";return;}
    if(!file)return;$("pjStatus").textContent="Rendering pages…";$("pjThumbs").innerHTML="";
    try{
      var buf=await file.arrayBuffer();var pdf=await pdfjsLib.getDocument({data:buf}).promise;
      $("pjBig").textContent=pdf.numPages+(pdf.numPages===1?" page":" pages");
      for(var n=1;n<=pdf.numPages;n++){
        var page=await pdf.getPage(n);var vp=page.getViewport({scale:1.5});var c=document.createElement("canvas");c.width=vp.width;c.height=vp.height;
        await page.render({canvasContext:c.getContext("2d"),viewport:vp}).promise;
        var url=c.toDataURL("image/jpeg",0.9);
        var d=document.createElement("div");d.className="page-thumb";d.innerHTML='<img alt="PDF page '+n+' as JPG" /><span>Page '+n+" · "+vp.width+" × "+vp.height+'</span>';
        d.querySelector("img").src=url;var a=document.createElement("a");a.className="btn secondary small";a.textContent="Download page "+n;a.href=url;a.download="page-"+n+".jpg";d.appendChild(a);$("pjThumbs").appendChild(d);
      }
      $("pjStatus").textContent="Done — "+pdf.numPages+" page(s) rendered.";
    }catch(e){$("pjStatus").textContent="Could not render that PDF — it may be protected or damaged.";}
  });
})();

/* ---------- 20. Hours & Minutes Calculator ---------- */
(function(){
  mkPanel("hoursminutes","Hours & Minutes Calculator","Durations between times, and time arithmetic — overnight handled.",cols2(
    '<h3 style="margin:0 0 10px">Time between two times</h3><div class="row2">'+F("Start time",ITM("hmStart","09:15"))+F("End time",ITM("hmEnd","17:45"))+'</div><div class="result-box" style="margin-bottom:18px"><h3>Duration</h3><div class="big-num" id="hmBig">—</div><div style="margin-top:10px" id="hmBigKv"></div></div>',
    '<h3 style="margin:0 0 10px">Add or subtract from a time</h3>'+F("Starting time",ITM("hmBase","16:30"))+F("Operation",SEL("hmOp",'<option value="add">Add</option><option value="sub">Subtract</option>'))+'<div class="row2">'+F("Hours",IN("hmH",2,'min="0" max="999" step="1"'))+F("Minutes",IN("hmM",45,'min="0" max="999" step="1"'))+'</div><div class="result-box"><h3>Resulting time</h3><div class="big-num" id="hmResBig">—</div><p class="note" id="hmResNote"></p></div>'));
  function toMin(v){if(!v)return null;var p=v.split(":");return parseInt(p[0],10)*60+parseInt(p[1]||"0",10);}
  function fmtHM(mins){var h=Math.floor(mins/60),m=mins%60;return h+"h "+("0"+m).slice(-2)+"m";}
  function fmtClock(mins){mins=((mins%1440)+1440)%1440;var h=Math.floor(mins/60),m=mins%60;return ("0"+h).slice(-2)+":"+("0"+m).slice(-2);}
  function calcDur(){var s=toMin($("hmStart").value),e=toMin($("hmEnd").value);if(s===null||e===null){$("hmBig").textContent="—";return;}var d=e-s;var nextDay=d<0;if(nextDay)d+=1440;$("hmBig").textContent=fmtHM(d);$("hmBigKv").innerHTML='<div class="kv"><span>Decimal hours</span><b>'+(d/60).toFixed(2)+'</b></div><div class="kv"><span>Total minutes</span><b>'+d+'</b></div>'+(nextDay?'<div class="kv total"><span>Note</span><b>End time treated as next day</b></div>':"");}
  function calcAdd(){var b=toMin($("hmBase").value);if(b===null){$("hmResBig").textContent="—";return;}var dur=(num("hmH")*60+num("hmM"))*($("hmOp").value==="sub"?-1:1);var res=b+dur;var days=Math.floor(res/1440);$("hmResBig").textContent=fmtClock(res);$("hmResNote").textContent=days>0?"That lands "+days+" day"+(days===1?"":"s")+" later.":(days<0?"That lands "+Math.abs(days)+" day"+(Math.abs(days)===1?"":"s")+" earlier.":"Same day.");}
  onIn(["hmStart","hmEnd"],calcDur);onIn(["hmBase","hmOp","hmH","hmM"],calcAdd);calcDur();calcAdd();
})();

/* ---------- 21. HTML Viewer ---------- */
(function(){
  mkPanel("htmlviewer","HTML Viewer","Live rendered preview plus a neatly formatted source view.",
    F("Your HTML",TA("hvCode",9,""))+
    '<div class="cols"><div><div class="result-box"><h3>Live preview</h3><iframe class="html-preview" id="hvFrame" title="HTML preview" sandbox=""></iframe><p class="note">Scripts do not run in the preview, for safety.</p></div></div>'+
    '<div><div class="result-box"><h3>Formatted source</h3><div class="output-pre" id="hvFmt"></div><div class="btn-row"><button type="button" class="btn secondary small" id="hvCopy">Copy formatted code</button></div></div></div></div>');
  $("hvCode").value='<h1 style="font-family:sans-serif;color:#059669">Hello, world</h1>\n<p>Edit this <b>HTML</b> and watch the preview update.</p>\n<ul><li>One</li><li>Two</li></ul>';
  var VOID={area:1,base:1,br:1,col:1,embed:1,hr:1,img:1,input:1,link:1,meta:1,source:1,track:1,wbr:1};
  function formatHTML(src){
    var tokens=src.replace(/>\s+</g,"><").split(/(<[^>]+>)/g).filter(function(t){return t.trim()!=="";});
    var depth=0,out=[];
    tokens.forEach(function(tok){
      if(/^<\//.test(tok))depth=Math.max(0,depth-1);
      out.push(new Array(depth+1).join("  ")+tok.trim());
      if(/^<[^!\/][^>]*>$/.test(tok)&&!/\/>$/.test(tok)){var tag=(tok.match(/^<([a-zA-Z0-9]+)/)||[])[1];if(tag&&!VOID[tag.toLowerCase()])depth++;}
    });
    return out.join("\n");
  }
  function upd(){var code=$("hvCode").value;$("hvFrame").srcdoc=code;$("hvFmt").textContent=formatHTML(code);}
  $("hvCode").addEventListener("input",upd);upd();
  $("hvCopy").addEventListener("click",function(){copyText($("hvFmt").textContent,"Formatted HTML copied");});
})();

/* ---------- 22. What Is My Browser ---------- */
(function(){
  mkPanel("mybrowser","What Is My Browser?","Everything your browser announces about itself — read locally, sent nowhere.",
    '<div class="result-box"><h3>Your setup</h3><div id="mbKv"></div><div class="btn-row" style="margin-top:14px"><button type="button" class="btn secondary small" id="mbCopy">Copy full report</button><button type="button" class="btn secondary small" id="mbRefresh">Refresh</button></div><h3 style="margin-top:20px">Full user agent</h3><div class="output-pre" id="mbUa"></div><p class="note">This information is read by your browser on this device only. ToolNovo does not receive or store it.</p></div>');
  function detect(){
    var ua=navigator.userAgent,name="Unknown browser",ver="";
    var m;
    if((m=ua.match(/Edg\/([\d.]+)/))){name="Microsoft Edge";ver=m[1];}
    else if((m=ua.match(/OPR\/([\d.]+)/))){name="Opera";ver=m[1];}
    else if((m=ua.match(/SamsungBrowser\/([\d.]+)/))){name="Samsung Internet";ver=m[1];}
    else if((m=ua.match(/Firefox\/([\d.]+)/))){name="Mozilla Firefox";ver=m[1];}
    else if((m=ua.match(/Chrome\/([\d.]+)/))){name="Google Chrome (or Chromium-based)";ver=m[1];}
    else if((m=ua.match(/Version\/([\d.]+).*Safari\//))){name="Apple Safari";ver=m[1];}
    var os="Unknown OS";
    if(/Windows NT 10/.test(ua))os="Windows 10 / 11";else if(/Windows NT/.test(ua))os="Windows";else if(/Android/.test(ua))os="Android "+((ua.match(/Android ([\d.]+)/)||[])[1]||"");else if(/iPhone|iPad|iPod/.test(ua))os="iOS "+(((ua.match(/OS ([\d_]+)/)||[])[1]||"").replace(/_/g,"."));else if(/Mac OS X/.test(ua))os="macOS "+(((ua.match(/Mac OS X ([\d_]+)/)||[])[1]||"").replace(/_/g,"."));else if(/Linux/.test(ua))os="Linux";
    var tz="";try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||"";}catch(e){}
    var rows=[["Browser",name+(ver?" "+ver:"")],["Operating system",os],["Screen size",screen.width+" × "+screen.height+" px"],["Window size (this page)",window.innerWidth+" × "+window.innerHeight+" px"],["Device pixel ratio",window.devicePixelRatio||1],["Language",navigator.language||"—"],["Time zone",tz||"—"],["Cookies enabled",navigator.cookieEnabled?"Yes":"No"],["Touch support",("ontouchstart" in window||navigator.maxTouchPoints>0)?"Yes":"No"],["Online right now",navigator.onLine?"Yes":"No"],["Platform",navigator.platform||"—"]];
    $("mbKv").innerHTML=rows.map(function(r){return '<div class="kv"><span>'+r[0]+"</span><b>"+String(r[1])+"</b></div>";}).join("");
    $("mbUa").textContent=ua;
    return rows;
  }
  var rows=detect();
  window.addEventListener("resize",function(){if($("mbKv"))rows=detect();});
  $("mbRefresh").addEventListener("click",function(){rows=detect();toast("Report refreshed");});
  $("mbCopy").addEventListener("click",function(){var txt=rows.map(function(r){return r[0]+": "+r[1];}).join("\n")+"\nUser agent: "+navigator.userAgent;copyText(txt,"Browser report copied");});
})();

/* ---------- FAQs page (standalone, linked from footer Quick Links) ---------- */
PAGES.faqs={title:"Frequently Asked Questions",updated:"Quick answers about ToolNovo",body:"<p>Everything people ask us most about ToolNovo — how the tools work, what happens to your data, and how to get help. For anything else, email <a href='mailto:support@toolnovo.net'>support@toolnovo.net</a>.</p>"+
"<h2>Using ToolNovo</h2>"+
"<details class='faq'><summary>Is ToolNovo really free?</summary><p>Yes. Every tool on ToolNovo is completely free, with no trials, no usage limits and no hidden charges. Open a tool and use it as often as you like.</p></details>"+
"<details class='faq'><summary>Do I need to sign up or create an account?</summary><p>No. There are no accounts, no registration and no email walls on ToolNovo. Every tool works the moment the page loads.</p></details>"+
"<details class='faq'><summary>Do the tools work on my phone?</summary><p>Yes. Every tool and guide is built to work on phone, tablet and computer, in any modern browser. Tools that need specific browser features — like Speech to Text — tell you clearly if your browser does not support them.</p></details>"+
"<h2>Privacy and your files</h2>"+
"<details class='faq'><summary>Are my files and text uploaded to a server?</summary><p>No. Every ToolNovo tool runs entirely in your web browser using JavaScript. The files you open, the text you paste and the numbers you type are processed on your own device and are never sent to, or stored on, a server. Our <a href='#/page/privacy' data-page-link='privacy'>Privacy Policy</a> explains this in full.</p></details>"+
"<details class='faq'><summary>What happens to a PDF or image after I use a tool?</summary><p>Nothing leaves your device. Downloads are generated in your browser from your original file, and closing the page clears everything. There is no copy of your file anywhere on ToolNovo.</p></details>"+
"<details class='faq'><summary>Does ToolNovo use cookies?</summary><p>The tools themselves set no tracking cookies. A cookie-consent banner lets you accept or decline advertising cookies, and the Privacy Policy explains the Google AdSense cookies that may be used if ads are shown.</p></details>"+
"<h2>Accuracy and help</h2>"+
"<details class='faq'><summary>How accurate are the calculators?</summary><p>Calculators use the standard published formulas for each job — the lender amortization formula for mortgages, Mifflin–St Jeor for calories, the standard 4.0 scale for GPA, and so on. Results are estimates for general information; our <a href='#/page/disclaimer' data-page-link='disclaimer'>Disclaimer</a> explains the limits, and important decisions should always be confirmed with a professional.</p></details>"+
"<details class='faq'><summary>A tool gave a result I think is wrong. What should I do?</summary><p>Tell us via the <a href='#/page/contact' data-page-link='contact'>Contact page</a> — include the tool name and the exact numbers or file you used, so we can reproduce the problem and fix it. Reports of wrong results are our top priority.</p></details>"+
"<details class='faq'><summary>Can I suggest a new tool?</summary><p>Yes — email support@toolnovo.net or use the Contact page and choose \u2018Suggest a new tool\u2019. Tell us the problem the tool would solve; the most-requested tools get built first.</p></details>"+
"<details class='faq'><summary>Can I use ToolNovo results in my own work?</summary><p>Yes. Calculations, conversions and files you produce with the tools are yours to use, including in commercial work. The site\u2019s written guides are copyrighted — please link to them rather than copying them wholesale, as set out in our <a href='#/page/terms' data-page-link='terms'>Terms of Service</a>.</p></details>"};
(function(){
  var host=document.getElementById("staticPages");if(!host||document.getElementById("page-faqs"))return;
  var sec=document.createElement("section");sec.className="static-page";sec.id="page-faqs";
  sec.innerHTML="<div class='static-card'><p class='updated'></p><h1></h1><div class='page-body'></div><div class='btn-row' style='margin-top:26px'><button class='btn secondary' type='button' data-home-btn>← Back to all tools</button></div></div>";
  sec.querySelector("h1").textContent=PAGES.faqs.title;sec.querySelector(".updated").textContent=PAGES.faqs.updated;sec.querySelector(".page-body").innerHTML=PAGES.faqs.body;
  host.appendChild(sec);
  /* Footer Quick Links: add FAQs */
  document.querySelectorAll("footer.site .f-links").forEach(function(fl){
    if(fl.querySelector("[data-page-link='sitemap']")&&!fl.querySelector("[data-page-link='faqs']")){
      var a=document.createElement("a");a.href="#/page/faqs";a.textContent="FAQs";a.setAttribute("data-page-link","faqs");fl.appendChild(a);
    }
  });
  /* Footer Tool Categories: add PDF Tools */
  document.querySelectorAll("footer.site .f-links").forEach(function(fl){
    if(fl.querySelector("[data-cat-link='seo']")&&!fl.querySelector("[data-cat-link='pdf']")){
      var a=document.createElement("a");a.href="#/";a.textContent="PDF Tools";a.setAttribute("data-cat-link","pdf");fl.appendChild(a);
    }
  });
  /* Footer Popular Tools: add two new favourites */
  document.querySelectorAll("footer.site .f-links").forEach(function(fl){
    if(fl.querySelector("[data-tool-link='password']")&&!fl.querySelector("[data-tool-link='mergepdf']")){
      var a=document.createElement("a");a.href="#/tool/mergepdf";a.textContent="Merge PDF";a.setAttribute("data-tool-link","mergepdf");fl.appendChild(a);
      var b=document.createElement("a");b.href="#/tool/summarizer";b.textContent="Text Summarizer";b.setAttribute("data-tool-link","summarizer");fl.appendChild(b);
    }
  });
  /* Sitemap page: add FAQs to site pages list */
  var sm=document.querySelector("#page-sitemap .page-body");
  if(sm){var d=document.createElement("div");d.innerHTML="<h2>Help</h2><ul><li><a href='#/page/faqs' data-page-link='faqs'><b>Frequently Asked Questions</b></a> — free use, privacy, accuracy and getting help.</li></ul>";sm.appendChild(d);}
  /* Featured tools pool — shown by the "Featured Tools" category chip in the directory */
  var featIds=["mortgage","password","image","words","bmi","qr","vat","gpa","mergepdf","summarizer"];
  function fillFeatured(){featIds.forEach(function(id){if(window.FEATURED_IDS&&window.FEATURED_IDS.indexOf(id)===-1)window.FEATURED_IDS.push(id);});if(window.activeCat==="featured"&&typeof renderGrid==="function")renderGrid();}
  fillFeatured();
  window.renderFeatured=function(){fillFeatured();};
  /* Category count badges on the filter pills, like the demo pill bar */
  window.tnChipCounts=function(){
    document.querySelectorAll("#tools .filters .chip[data-cat]").forEach(function(ch){
      var cat=ch.getAttribute("data-cat"); if(cat==="all")return;
      var n=0;
      if(cat==="featured"){n=(window.FEATURED_IDS||[]).length;}
      else if(typeof TOOLS!=="undefined"){for(var i=0;i<TOOLS.length;i++)if(TOOLS[i].cat===cat)n++;}
      var badge=ch.querySelector(".n");
      if(!badge){badge=document.createElement("span");badge.className="n";ch.appendChild(badge);}
      badge.textContent=n;
    });
  };
  window.tnChipCounts();
  if(typeof renderGrid==="function")renderGrid();
})();
})();
