
/* ---------- ToolNovo x Firebase: live content from the admin panel ----------
   Reads published blog posts, admin-added tools, categories and site settings
   from Firestore (project toolnovo-932f0) and merges them into the built-in
   content. Writes are locked to the owner's login by the Firestore security
   rules. If Firebase is unreachable or the database is empty, the site
   behaves exactly as before. */
(function(){
  "use strict";
  var TN_CFG={apiKey:"AIzaSyDN_QFQAdSMqyswTvt49Sd6ObSbyuhi_4M",authDomain:"toolnovo-932f0.firebaseapp.com",projectId:"toolnovo-932f0",storageBucket:"toolnovo-932f0.firebasestorage.app",messagingSenderId:"1003276808023",appId:"1:1003276808023:web:3a3c82f05f3b29a2251812",measurementId:"G-8YT0FRKJ5Y"};
  var db=null;
  try{
    if(window.firebase&&firebase.firestore){
      if(!firebase.apps.length)firebase.initializeApp(TN_CFG);
      db=firebase.firestore();
    }
  }catch(e){ db=null; }
  if(!db)return;
  window.__tnDb=db;

  /* ---------- helpers ---------- */
  function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
  function toDate(v){ if(!v)return null; if(typeof v.toDate==="function")return v.toDate(); if(typeof v.seconds==="number")return new Date(v.seconds*1000); var d=new Date(v); return isNaN(d.getTime())?null:d; }
  var MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
  function fmtDate(d){ return d?d.getDate()+" "+MONTHS[d.getMonth()]+" "+d.getFullYear():""; }
  function parsePostDate(s){
    var m=String(s||"").match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
    if(m){ var mi=MONTHS.indexOf(m[2]); if(mi>=0)return new Date(+m[3],mi,+m[1]).getTime(); }
    var t=Date.parse(s); return isNaN(t)?0:t;
  }
  function plainText(html){ var div=document.createElement("div"); div.innerHTML=String(html||""); return (div.textContent||"").replace(/\s+/g," ").trim(); }
  function bodyHtml(content){
    var c=String(content||"").trim(); if(!c)return "";
    if(c.indexOf("<")>=0)return c;
    return c.split(/\n\s*\n/).map(function(p){ return "<p>"+esc(p).replace(/\n/g,"<br>")+"</p>"; }).join("");
  }
  function runScriptsIn(container){
    if(!container)return;
    Array.prototype.slice.call(container.querySelectorAll("script")).forEach(function(old){
      var s=document.createElement("script");
      for(var i=0;i<old.attributes.length;i++)s.setAttribute(old.attributes[i].name,old.attributes[i].value);
      s.textContent=old.textContent;
      old.parentNode.replaceChild(s,old);
    });
  }
  function say(msg){ if(typeof toast==="function")toast(msg); }
  function reroute(){
    var h=location.hash||"";
    if(h.indexOf("#/blog")===0){ if(typeof blogRoute==="function")blogRoute(); }
    else if(h.indexOf("#/tool/")===0||h.indexOf("#/tools/")===0){ if(typeof route==="function")route(); }
  }
  function updateCounts(){
    var stats=document.querySelector(".hero-stats");
    if(stats)stats.innerHTML="<span><b>"+TOOLS.length+"</b> free tools</span><span><b>"+BLOG_POSTS.length+"</b> blog guides</span><span><b>100%</b> free — no signup</span><span><b>Private</b> — runs in your browser</span>";
    var allChip=document.querySelector("#tools .filters [data-cat='all']");
    if(allChip)allChip.textContent="All "+TOOLS.length+" tools";
    var blogChip=document.querySelector("#tools .filters .chip-blog");
    if(blogChip)blogChip.textContent="Blog — "+BLOG_POSTS.length+" guides";
    var search=document.getElementById("toolSearch");
    if(search)search.setAttribute("placeholder","Search "+TOOLS.length+" tools — try “VAT”, “BMI”, “JSON”, “loan”…");
    if(window.tnChipCounts)window.tnChipCounts();
  }

  /* ---------- settings & ads ---------- */
  var tnAds={inArticle:""};
  function injectHead(html){
    if(!html||!String(html).trim())return;
    var holder=document.createElement("div"); holder.innerHTML=html;
    Array.prototype.slice.call(holder.childNodes).forEach(function(node){
      if(node.nodeType===1&&node.tagName==="SCRIPT"){
        var s=document.createElement("script");
        for(var i=0;i<node.attributes.length;i++)s.setAttribute(node.attributes[i].name,node.attributes[i].value);
        s.textContent=node.textContent; document.head.appendChild(s);
      }else{
        document.head.appendChild(node);
        if(node.nodeType===1)runScriptsIn(node);
      }
    });
  }
  function applySettings(site,ads){
    if(site){
      if(site.announcement&&String(site.announcement).trim()){
        var bar=document.createElement("div"); bar.id="tnAnnouncement";
        bar.setAttribute("style","background:var(--brand);color:#fff;text-align:center;padding:10px 16px;font-weight:600;font-size:.95rem;line-height:1.45");
        bar.textContent=String(site.announcement).trim();
        document.body.insertBefore(bar,document.body.firstChild);
      }
      if(site.tagline&&String(site.tagline).trim()){
        var lede=document.querySelector(".hero p.lede");
        if(lede)lede.textContent=String(site.tagline).trim();
      }
      if(site.supportEmail&&/@/.test(site.supportEmail)){
        var em=String(site.supportEmail).trim(); window.__tnSupportEmail=em;
        document.querySelectorAll("footer.site a[href^='mailto:']").forEach(function(a){ a.href="mailto:"+em; a.textContent=em; });
        if(window.PAGES)Object.keys(PAGES).forEach(function(k){
          var pg=PAGES[k];
          if(pg&&pg.body&&pg.body.indexOf("support@toolnovo.net")>=0)pg.body=pg.body.split("support@toolnovo.net").join(em);
        });
      }
      if(site.footerText&&String(site.footerText).trim()){
        var fb=document.querySelector("footer.site .f-bottom span:last-child");
        if(fb)fb.textContent=String(site.footerText).trim();
      }
    }
    if(ads){
      if(ads.headScript&&String(ads.headScript).trim())injectHead(ads.headScript);
      else if(ads.clientId&&String(ads.clientId).trim()){
        var s=document.createElement("script"); s.async=true; s.crossOrigin="anonymous";
        s.src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client="+encodeURIComponent(String(ads.clientId).trim());
        document.head.appendChild(s);
      }
      if(ads.inArticle&&String(ads.inArticle).trim())tnAds.inArticle=String(ads.inArticle);
    }
  }
  function placeInArticle(){
    if(!tnAds.inArticle)return;
    ["blogPostView","toolArticleWrap"].forEach(function(id){
      var host=document.getElementById(id); if(!host)return;
      var art=host.querySelector("article"); if(!art||art.querySelector(".tn-ad-slot"))return;
      var slot=document.createElement("div"); slot.className="tn-ad-slot"; slot.innerHTML=tnAds.inArticle;
      art.appendChild(slot); runScriptsIn(slot);
    });
  }
  function hookAdSlots(){
    if(!tnAds.inArticle)return;
    ["showBlogPost","showTool"].forEach(function(fn){
      if(typeof window[fn]==="function"&&!window[fn].__tnAdWrapped){
        var orig=window[fn];
        var wrapped=function(){ var r=orig.apply(null,arguments); try{placeInArticle();}catch(e){} return r; };
        wrapped.__tnAdWrapped=true; window[fn]=wrapped;
      }
    });
  }

  /* ---------- admin-added tools: lazy-load their code when first opened ---------- */
  var TN_LAZY={};
  function initLazyTool(id){
    var code=TN_LAZY[id]; if(code==null)return; delete TN_LAZY[id];
    var panel=document.getElementById("panel-"+id); if(!panel)return;
    var body=panel.querySelector(".tn-tool-body"); if(!body)return;
    body.innerHTML=code; runScriptsIn(body);
  }
  if(typeof window.showTool==="function"){
    var origShowTool=window.showTool;
    window.showTool=function(id){ var r=origShowTool.apply(null,arguments); try{initLazyTool(id);}catch(e){} return r; };
  }

  /* ---------- categories ---------- */
  function addCategoryChip(key,name){
    var filters=document.querySelector("#tools .filters");
    if(!filters||filters.querySelector("[data-cat='"+key+"']"))return;
    var b=document.createElement("button"); b.className="chip"; b.type="button";
    b.setAttribute("data-cat",key); b.textContent=name;
    b.addEventListener("click",function(){
      document.querySelectorAll(".chip").forEach(function(c){ c.classList.remove("active"); });
      b.classList.add("active"); window.activeCat=key;
      if(typeof renderGrid==="function")renderGrid();
      var t=document.getElementById("tools"); if(t)t.scrollIntoView({behavior:"smooth"});
    });
    filters.appendChild(b);
  }
  function addFooterCatLink(key,name){
    var col=null;
    document.querySelectorAll("footer.site .f-links").forEach(function(fl){ if(fl.querySelector("[data-cat-link='finance']"))col=fl; });
    if(!col||col.querySelector("[data-cat-link='"+key+"']"))return;
    var a=document.createElement("a"); a.href="#/"; a.textContent=name; a.setAttribute("data-cat-link",key);
    col.appendChild(a);
  }
  function catKeyFor(name){
    var nm=String(name||"").trim(); if(!nm)return "fun";
    var lower=nm.toLowerCase(), k;
    for(k in CATNAMES){ if(Object.prototype.hasOwnProperty.call(CATNAMES,k)&&CATNAMES[k].toLowerCase()===lower)return k; }
    var key=(typeof blogSlugify==="function")?blogSlugify(nm):(nm.toLowerCase().replace(/[^a-z0-9]+/g,"-")||"misc");
    if(!CATNAMES[key]){ CATNAMES[key]=nm; addCategoryChip(key,nm); addFooterCatLink(key,nm); }
    return key;
  }

  /* ---------- tools ---------- */
  function addToolPanel(tool){
    var ws=document.getElementById("workspace");
    if(!ws||document.getElementById("panel-"+tool.id))return;
    var art=document.createElement("article"); art.className="tool-panel"; art.id="panel-"+tool.id;
    art.innerHTML="<div class='tool-head'><span class='icon' style='font-weight:800;font-size:1.25rem'></span><div><h1></h1><p></p></div><button class='back-btn' type='button'>← All tools</button></div><div class='tool-body'><div class='tn-tool-body'></div></div>";
    art.querySelector(".icon").textContent=tool.icon||tool.name.charAt(0);
    art.querySelector("h1").textContent=tool.name;
    art.querySelector(".tool-head p").textContent=tool.desc;
    var body=art.querySelector(".tn-tool-body");
    if(tool.code&&String(tool.code).trim()){ TN_LAZY[tool.id]=String(tool.code); body.innerHTML="<p>"+esc(tool.desc)+"</p>"; }
    else body.innerHTML="<p>"+esc(tool.desc)+"</p>";
    art.querySelector(".back-btn").addEventListener("click",function(){ if(typeof window.closeTools==="function")window.closeTools(); });
    ws.appendChild(art);
  }
  function appendToolLinks(ids){
    ["#page-guides .page-body","#page-sitemap .page-body"].forEach(function(sel){
      var host=document.querySelector(sel); if(!host)return;
      var d=document.createElement("div");
      d.innerHTML="<h2>New tools</h2><ul>"+ids.map(function(id){
        var t=toolById(id); if(!t)return "";
        return "<li><a href='#/tool/"+id+"' data-tool-link='"+id+"'><b>"+esc(t.name)+"</b></a> — "+esc(t.desc)+"</li>";
      }).join("")+"</ul>";
      host.appendChild(d);
    });
  }
  function mergeTools(docs){
    var addedIds=[], featuredIds=[];
    docs.forEach(function(d){
      var t=d.data(); if(!t)return;
      var slug=t.slug||""; if(!slug)return;
      if(toolById(slug)){ if(t.featured)featuredIds.push(slug); return; }
      var catKey=catKeyFor(t.category);
      var tool={id:slug,cat:catKey,tag:t.category||CATNAMES[catKey],name:t.name||slug,desc:t.description||"",icon:t.icon||"",code:t.code||""};
      TOOLS.push(tool);
      addToolPanel(tool);
      addedIds.push(slug);
      if(t.featured)featuredIds.push(slug);
    });
    if(addedIds.length){
      if(typeof renderGrid==="function")renderGrid();
      appendToolLinks(addedIds);
      updateCounts();
      reroute();
    }
    if(featuredIds.length){
      /* Admin-flagged featured tools join the Featured Tools category in the directory */
      featuredIds.forEach(function(id){ if(window.FEATURED_IDS&&window.FEATURED_IDS.indexOf(id)===-1)window.FEATURED_IDS.push(id); });
      if(window.activeCat==="featured"&&typeof renderGrid==="function")renderGrid();
    }
  }

  /* ---------- blog posts ---------- */
  function refreshSitemapBlog(){
    var sm=document.querySelector("#page-sitemap .page-body"); if(!sm)return;
    var target=null;
    Array.prototype.slice.call(sm.querySelectorAll("div")).forEach(function(div){
      var h=div.querySelector("h2");
      if(h&&h.textContent.indexOf("Blog (")===0)target=div;
    });
    var html="<h2>Blog ("+BLOG_POSTS.length+" posts)</h2><ul>"+BLOG_POSTS.map(function(p){
      return "<li><a href='#/blog/"+p.slug+"' data-blog-link='"+p.slug+"'><b>"+esc(p.title)+"</b></a> — "+esc(p.cat)+"</li>";
    }).join("")+"</ul><p><a href='#/blog' data-blog-home><b>Visit the Blog →</b></a></p>";
    if(target)target.innerHTML=html;
    else{ var d=document.createElement("div"); d.innerHTML=html; sm.appendChild(d); }
  }
  function mergePosts(docs){
    var changed=false;
    docs.forEach(function(d){
      var p=d.data(); if(!p||p.status!=="published")return;
      var slug=p.slug||""; if(!slug)return;
      var body=bodyHtml(p.content);
      var post={
        slug:slug,
        title:p.title||"Untitled post",
        cat:p.category||"Online Tools",
        date:fmtDate(toDate(p.createdAt))||fmtDate(toDate(p.updatedAt))||"",
        excerpt:p.excerpt||plainText(body).slice(0,170),
        body:body,
        tools:[], related:[],
        seo:p.seoTitle||((p.title||"Post")+" | ToolNovo Blog"),
        meta:p.seoDescription||p.excerpt||"",
        fin:(p.category==="Money & Finance")
      };
      var idx=-1;
      for(var i=0;i<BLOG_POSTS.length;i++)if(BLOG_POSTS[i].slug===slug){ idx=i; break; }
      if(idx>=0){
        var keep=BLOG_POSTS[idx];
        post.tools=keep.tools||[]; post.related=keep.related||[]; if(keep.fin)post.fin=true;
        BLOG_POSTS[idx]=post;
      }else BLOG_POSTS.push(post);
      if(BLOG_CATS.indexOf(post.cat)<0)BLOG_CATS.push(post.cat);
      changed=true;
    });
    if(!changed)return;
    BLOG_POSTS.sort(function(a,b){ return parsePostDate(b.date)-parsePostDate(a.date); });
    if(typeof refreshBlogSurfaces==="function")refreshBlogSurfaces();
    refreshSitemapBlog();
    updateCounts();
    reroute();
  }

  /* ---------- contact form: send to the admin inbox (mailto fallback) ---------- */
  document.addEventListener("click",function(e){
    if(!e.target||e.target.id!=="ctSend")return;
    var msgEl=document.getElementById("ctMsg"); if(!msgEl)return;
    var msg=(msgEl.value||"").trim();
    if(!msg)return; /* empty message: let the site's own handler show its reminder */
    e.preventDefault(); e.stopImmediatePropagation();
    var nameEl=document.getElementById("ctName"), emailEl=document.getElementById("ctEmail"), topicEl=document.getElementById("ctTopic");
    var name=nameEl?(nameEl.value||"").trim():"", email=emailEl?(emailEl.value||"").trim():"", topic=topicEl?topicEl.value:"";
    var btn=e.target, oldText=btn.textContent;
    btn.disabled=true; btn.textContent="Sending…";
    db.collection("messages").add({
      name:name, email:email, subject:topic, message:msg, read:false,
      createdAt:firebase.firestore.FieldValue.serverTimestamp()
    }).then(function(){
      btn.disabled=false; btn.textContent=oldText;
      msgEl.value=""; if(nameEl)nameEl.value=""; if(emailEl)emailEl.value="";
      say("Message sent — thank you! We reply by email, usually within 24–48 hours.");
    }).catch(function(){
      btn.disabled=false; btn.textContent=oldText;
      var to=window.__tnSupportEmail||"support@toolnovo.net";
      var body=encodeURIComponent(msg+(name?"\n\n— "+name:"")+(email?"\nReply to: "+email:""));
      var a=document.createElement("a");
      a.href="mailto:"+to+"?subject="+encodeURIComponent("ToolNovo: "+topic)+"&body="+body;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      say("Direct send did not go through — opening your email app instead.");
    });
  },true);

  /* ---------- fetch everything once and merge ---------- */
  function getCol(name){
    return db.collection(name).get().then(function(s){
      var arr=[]; s.forEach(function(d){ arr.push(d); }); return arr;
    }).catch(function(){ return []; });
  }
  Promise.all([getCol("posts"),getCol("tools"),getCol("categories"),getCol("settings")]).then(function(res){
    var site=null, ads=null;
    res[3].forEach(function(d){ if(d.id==="site")site=d.data(); if(d.id==="ads")ads=d.data(); });
    try{ applySettings(site,ads); hookAdSlots(); }catch(e){}
    try{ res[2].forEach(function(d){ var c=d.data(); if(c&&c.name)catKeyFor(c.name); }); }catch(e){}
    try{ mergeTools(res[1]); }catch(e){}
    try{ mergePosts(res[0]); }catch(e){}
  });
})();
