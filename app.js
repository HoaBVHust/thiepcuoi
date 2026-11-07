(() => {
  const C = WEDDING_CONFIG;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value ?? ""; };
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));
  const SHEET = (C.appsScriptUrl||"").trim(); // URL Apps Script — rỗng = chế độ demo
  const date = new Date(C.date.iso);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.title = `${C.couple.bride} & ${C.couple.groom} — ${C.date.display}`;
  ["coverBride","heroBride","coupleBride","ceremonyBride","footerBride","giftBride"].forEach(id => set(id,C.couple.bride));
  ["coverGroom","heroGroom","coupleGroom","ceremonyGroom","footerGroom","giftGroom"].forEach(id => set(id,C.couple.groom));
  set("coverDate", `${date.getDate()} tháng ${date.getMonth()+1}, ${date.getFullYear()}`);
  set("heroDay", C.date.day); set("heroDayNumber", C.date.dayNumber); set("heroMonth", C.date.month); set("heroYear", C.date.year);
  set("ceremonySubtitle", C.ceremony.subtitle); set("ceremonyTime", C.ceremony.time);
  set("ceremonyDay", C.date.day); set("ceremonyDayNumber", C.date.dayNumber); set("ceremonyMonth", C.date.month); set("ceremonyYear", C.date.year); set("ceremonyLunar", C.date.lunar);
  set("receptionTime", C.reception.startTime); set("receptionDay", C.date.dayTiec); set("receptionDayName", C.date.dayTiec); set("receptionDayNumber", C.date.dayTiecNumber); set("receptionMonth", C.date.month); set("receptionYear", C.date.year);
  set("guestTime", C.reception.guestTime); set("startTime", C.reception.startTime);
  set("groomFamilyTitle",C.family.groom.title); set("groomParents",`${C.family.groom.father} · ${C.family.groom.mother}`); set("groomAddress",C.family.groom.address);
  set("brideFamilyTitle",C.family.bride.title); set("brideParents",`${C.family.bride.father} · ${C.family.bride.mother}`); set("brideAddress",C.family.bride.address);
  set("venueName",C.reception.venue); set("venueAddress",C.reception.address);
  set("bankGroom",`${C.gift.groom.bank} · ${C.gift.groom.account} · ${C.gift.groom.owner}`);
  set("bankBride",`${C.gift.bride.bank} · ${C.gift.bride.account} · ${C.gift.bride.owner}`);
  $("#qrGroom").src=C.gift.groom.qr; $("#qrBride").src=C.gift.bride.qr;

  /* Ảnh lớn hero — tự ẩn nếu file chưa có */
  (function(){
    const fig=$("#heroPhoto"), img=$("#heroPhotoImg");
    if(!fig||!img||!C.heroPhoto?.src){fig&&fig.remove();return}
    img.src=C.heroPhoto.src; img.alt=C.heroPhoto.alt||"";
    img.onerror=()=>fig.remove();
  })();

  /* Ảnh chân dung chú rể / cô dâu — tự cắt vừa khung 2:3, ẩn nếu chưa có ảnh */
  function setPortrait(id,src){
    const box=document.getElementById(id); if(!box) return;
    if(!src) return;
    const img=new Image();
    img.alt=""; img.decoding="async";
    img.onload=()=>box.classList.remove("placeholder"); // hiện ảnh, bỏ nền trang trí
    img.onerror=()=>{img.remove();console.info(`[thiepcuoi] Chưa có ảnh ${id} → giữ nền trang trí`)};
    img.src=src;
    box.appendChild(img);
  }
  setPortrait("groomPortrait",C.couple.groomPhoto);
  setPortrait("bridePortrait",C.couple.bridePhoto);

  // Music
  const audio=$("#weddingMusic"), music=$("#musicControl");
  audio.src=C.music.src;
  let musicStarted=false;
  async function toggleMusic(){ if(!audio.src)return; try{ if(audio.paused){await audio.play();music.classList.add("playing");musicStarted=true}else{audio.pause();music.classList.remove("playing")} }catch(e){ console.info("Music file chưa có:",e.message); } }
  music.addEventListener("click",toggleMusic);

  // Open invitation — lướt nhanh xuống thiệp, bật nhạc, rồi tự cuộn chậm
  $("#openInvitation").addEventListener("click", () => {
    $("#cover").classList.add("opened");
    document.body.classList.add("invitation-open");
    // nhạc chạy độc lập — KHÔNG await, để play() treo cũng không chặn việc cuộn
    if(C.music.enabled && C.music.autoplayAfterOpen && !musicStarted) toggleMusic();
    const heroY=$(".hero").getBoundingClientRect().top+window.scrollY;
    window.scrollTo({top:heroY,behavior:"smooth"}); // chuyển nhanh xuống trang thiệp
    setTimeout(startAutoScroll,1800);               // sau đó tự cuộn chậm ngắm thiệp
  });

  /* Tự cuộn chậm — dừng ngay khi khách chạm/cuộn/tương tác bất cứ lúc nào */
  let autoScrollRAF=null,autoScrollActive=false,lastUserScroll=0;
  ["touchstart","wheel","keydown","pointerdown"].forEach(ev=>
    window.addEventListener(ev,e=>{
      // bỏ qua tương tác trên chính nút "MỞ THIỆP" (khi đó auto-scroll mới được phép chạy)
      if(e.target&&e.target.closest&&e.target.closest("#openInvitation"))return;
      lastUserScroll=Date.now();
      if(autoScrollActive)stopAutoScroll();
    },{passive:true}));
  function stopAutoScroll(){
    autoScrollActive=false;
    if(autoScrollRAF){cancelAnimationFrame(autoScrollRAF);autoScrollRAF=null}
    document.documentElement.style.scrollBehavior=""; // trả lại smooth cho các cú nhảy anchor
  }
  function startAutoScroll(){
    if(reducedMotion||autoScrollActive)return;
    if(Date.now()-lastUserScroll<2500)return; // khách vừa tự tương tác → không cuộn hộ
    autoScrollActive=true;
    const html=document.documentElement;
    // QUAN TRỌNG: html đang có scroll-behavior:smooth — nếu để vậy, mỗi scrollBy từng frame
    // lại kích hoạt một animation smooth mới => giật lag. Tắt trong lúc cuộn hộ.
    html.style.scrollBehavior="auto";
    const maxY=()=>html.scrollHeight-window.innerHeight-4;
    // tốc độ theo độ dài trang: trọn thiệp ~60s, giới hạn 150–260px/s
    const dist=Math.max(1,maxY()-window.scrollY);
    const speed=Math.min(0.26,Math.max(0.15,dist/60000));
    const t0=performance.now();
    let last=t0;
    const step=(now)=>{
      if(!autoScrollActive)return;
      const dt=Math.min(64,now-last);last=now;
      if(window.scrollY>=maxY()){stopAutoScroll();return}
      const r=Math.min(1,(now-t0)/2000);      // 2s đầu tăng tốc dần từ 35% tốc độ
      const ramp=0.35+0.65*r*r*(3-2*r);       // smoothstep — khởi động mềm, không giật
      window.scrollBy(0,speed*ramp*dt);
      autoScrollRAF=requestAnimationFrame(step);
    };
    autoScrollRAF=requestAnimationFrame(step);
  }

  // Parallax
  const floral=$$(".floral,.cover-flower,.hero-flower,.footer-flower");
  let ticking=false;
  function parallax(){
    const y=window.scrollY;
    floral.forEach(el=>{
      const speed=parseFloat(el.dataset.speed||"0.08");
      el.style.translate=`0 ${y*speed}px`;
    });
    ticking=false;
  }
  if(!reducedMotion){
    window.addEventListener("scroll",()=>{if(!ticking){requestAnimationFrame(parallax);ticking=true}}, {passive:true});
  }

  // Reveal — xuất hiện khi cuộn tới, tự xếp delay so le cho các phần tử con
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}
  }),{threshold:.12});
  $$(".reveal").forEach((el)=>observer.observe(el));

  // Sao băng — mỗi khi lướt qua một mục, một sao băng bay ngang (cách nhau tối thiểu 2.4s)
  const shootSections=document.querySelectorAll("main > section, .cover, .footer");
  let lastShoot=0;
  function spawnShoot(sec){
    const s=document.createElement("i");
    s.className="shooting-star run";
    s.style.top=(6+Math.random()*34)+"%";
    s.style.left=(-10-Math.random()*8)+"%";
    sec.appendChild(s);
    s.addEventListener("animationend",()=>s.remove(),{once:true});
    setTimeout(()=>s.remove(),2400); // phòng hờ animationend không chạy
  }
  if(!reducedMotion){
    const shootIO=new IntersectionObserver(entries=>entries.forEach(en=>{
      if(!en.isIntersecting)return;
      const now=Date.now();
      if(now-lastShoot<2400)return;
      lastShoot=now;
      spawnShoot(en.target);
    }),{rootMargin:"-30% 0px -30% 0px"});
    shootSections.forEach(sec=>shootIO.observe(sec));
  }

  /* ======================================================================
     ALBUM ẢNH — băng chuyền 3D xoay tròn (kiểu coverflow)
     Ảnh giữa hướng thẳng người xem, hai bên xoay nghiêng quanh trục Y rồi
     chìm dần ra sau — vòng xoay vô hạn. Tự chạy chậm; rê chuột/vuốt thì dừng.
     Click ảnh giữa → mở lightbox; click ảnh bên / nút ‹ › / quét ngang → xoay.
     Vị trí từng ảnh quyết định bằng data-pos (0, ±1, ±2, far) — CSS vẽ 3D.
     ====================================================================== */
  const gallery=$("#gallery");
  const entries=C.photos.map(p=>typeof p==="string"?{src:p}:p).filter(e=>e&&e.src);
  const slides=[];
  let active=0;
  const galCounter=$("#galleryCounter");

  entries.forEach(entry=>{
    const item=document.createElement("div");
    item.className="gallery-item";
    const img=document.createElement("img");
    img.src=entry.src; img.loading="lazy"; img.decoding="async";
    img.alt=entry.alt||`Ảnh cưới ${entries.indexOf(entry)+1}`;
    img.onerror=()=>{ // ảnh lỗi → gỡ khỏi vòng xoay và khỏi lightbox luôn
      item.remove();
      const s=slides.indexOf(item);if(s>-1)slides.splice(s,1);
      const e2=entries.indexOf(entry);if(e2>-1)entries.splice(e2,1);
      if(active>=slides.length)active=Math.max(0,slides.length-1);
      updateCarousel();
      console.info(`[thiepcuoi] Không tìm thấy ảnh: ${entry.src}`);
    };
    item.appendChild(img);
    item.addEventListener("click",()=>{
      if(item.dataset.pos==="0")openLightbox(entries.indexOf(entry));
      else if(item.dataset.pos!=="far")goTo(Number(item.dataset.pos));
      restartAuto();
    });
    gallery.appendChild(item);
    slides.push(item);
  });

  function updateCarousel(){
    const n=slides.length;
    slides.forEach((item,i)=>{
      let d=(i-active+n)%n;        // khoảng cách tròn, lấy phía ngắn nhất
      if(d>n/2)d-=n;
      item.dataset.pos=Math.abs(d)>2?"far":String(d);
      item.style.zIndex=String(10-Math.abs(d));
    });
    if(galCounter)galCounter.textContent=`${active+1} / ${n}`;
  }
  function goTo(step){
    const n=slides.length;
    if(n<2)return;
    active=(active+step%n+n)%n;
    updateCarousel();
  }

  $("#galPrev").addEventListener("click",()=>{goTo(-1);restartAuto();});
  $("#galNext").addEventListener("click",()=>{goTo(1);restartAuto();});
  // vuốt trên điện thoại
  let galX=null;
  gallery.addEventListener("touchstart",e=>galX=e.touches[0].clientX,{passive:true});
  gallery.addEventListener("touchend",e=>{
    if(galX===null)return;
    const dx=e.changedTouches[0].clientX-galX;
    if(Math.abs(dx)>40){goTo(dx<0?1:-1);restartAuto();}
    galX=null;
  },{passive:true});

  // tự xoay chậm — rê chuột vào thì tạm dừng, rời ra/chạm thì chạy lại
  let autoTimer=null;
  function restartAuto(){
    if(reducedMotion||slides.length<2)return;
    clearInterval(autoTimer);
    autoTimer=setInterval(()=>{if(!document.hidden)goTo(1)},3400);
  }
  gallery.addEventListener("pointerenter",()=>clearInterval(autoTimer));
  gallery.addEventListener("pointerleave",restartAuto);
  updateCarousel();
  restartAuto();

  // Lightbox
  let current=0; const lb=$("#lightbox"), lbImg=$("#lightboxImage"), counter=$("#lightboxCounter"), caption=$("#lightboxCaption");
  function openLightbox(i){current=i;lb.classList.add("open");document.body.style.overflow="hidden";clearInterval(autoTimer);renderLightbox()}
  function renderLightbox(){
    // reset animation
    lbImg.style.animation="none"; void lbImg.offsetWidth; lbImg.style.animation="";
    lbImg.src=entries[current].src;
    lbImg.alt=entries[current].alt||"Ảnh cưới";
    counter.textContent=`${current+1} / ${entries.length}`;
    caption.textContent=entries[current].alt||"";
  }
  function next(){current=(current+1)%entries.length;renderLightbox()}
  function prev(){current=(current-1+entries.length)%entries.length;renderLightbox()}
  function closeLightbox(){lb.classList.remove("open");document.body.style.overflow="";restartAuto()}
  $("#lightboxClose").onclick=closeLightbox;$("#lightboxNext").onclick=next;$("#lightboxPrev").onclick=prev;
  lb.addEventListener("click",e=>{if(e.target===lb)closeLightbox()});
  document.addEventListener("keydown",e=>{if(!lb.classList.contains("open"))return;if(e.key==="Escape")closeLightbox();if(e.key==="ArrowRight")next();if(e.key==="ArrowLeft")prev()});
  // Vuốt trên điện thoại
  let touchX=null;
  lb.addEventListener("touchstart",e=>touchX=e.touches[0].clientX,{passive:true});
  lb.addEventListener("touchend",e=>{
    if(touchX===null)return;
    const dx=e.changedTouches[0].clientX-touchX;
    if(Math.abs(dx)>50)(dx<0?next:prev)();
    touchX=null;
  },{passive:true});

  // Countdown
  const target=date.getTime();
  function countdown(){
    let diff=Math.max(0,target-Date.now());
    const d=Math.floor(diff/86400000);diff%=86400000;const h=Math.floor(diff/3600000);diff%=3600000;const m=Math.floor(diff/60000);const s=Math.floor(diff/1000)%60;
    set("days",String(d).padStart(2,"0"));set("hours",String(h).padStart(2,"0"));set("minutes",String(m).padStart(2,"0"));set("seconds",String(s).padStart(2,"0"));
  }
  countdown();setInterval(countdown,1000);

  // Calendar — ngày cưới tô trái tim, ngày tiệc trước 1 ngày khoanh vàng
  const cal=$("#calendar"), year=date.getFullYear(), month=date.getMonth(), selected=date.getDate();
  set("calendarTitle",`Tháng ${month+1} / ${year}`);
  const names=["CN","T2","T3","T4","T5","T6","T7"];
  cal.innerHTML=`<div class="cal-head">${names.map(x=>`<span>${x}</span>`).join("")}</div><div class="cal-grid"></div>`;
  const grid=cal.querySelector(".cal-grid"), first=new Date(year,month,1).getDay(), days=new Date(year,month+1,0).getDate();
  // ngày tiệc trước ngày cưới 1 ngày — tự trừ 1 nên vẫn đúng khi sang tháng trước;
  // chỉ hiện khi khác tháng không xảy ra (cùng tháng với lịch đang hiển thị) và có nhãn trong config
  const partyLabel=(C.date.partyBeforeLabel||"").trim();
  const partyTmp=new Date(year,month,selected-1);
  const partyDay=(partyLabel&&partyTmp.getMonth()===month&&partyTmp.getFullYear()===year)?partyTmp.getDate():0;
  for(let i=0;i<first;i++)grid.innerHTML+="<span class='empty'>0</span>";
  for(let d=1;d<=days;d++){
    const cls=d===selected?"selected":(d===partyDay?"party":"");
    grid.innerHTML+=`<span class="${cls}">${d}</span>`;
  }
  // chú thích dưới lịch
  const legend=document.createElement("div");
  legend.className="cal-legend";
  legend.innerHTML=
    `<span><i class="lg-heart"></i>${selected} · ${month+1} — Ngày cưới</span>`+
    (partyDay?`<span><i class="lg-party"></i>${partyDay} · ${month+1} — ${escapeHtml(partyLabel)}</span>`:"");
  cal.appendChild(legend);
  const start=`${year}${String(month+1).padStart(2,"0")}${String(selected).padStart(2,"0")}`;
  const end=start;
  $("#calendarLink").href=`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(C.couple.bride+" & "+C.couple.groom+" - Ngày cưới")}&dates=${start}T020000Z/${end}T140000Z&details=${encodeURIComponent("Ngày cưới của "+C.couple.bride+" & "+C.couple.groom)}&location=${encodeURIComponent(C.reception.address)}`;

  // Địa điểm — sơ đồ vẽ sẵn (không phụ thuộc mạng, không bao giờ lỗi),
  // nút "Chỉ đường" mở Google Maps app trên điện thoại của khách
  $("#mapsLink").href=C.reception.mapsUrl;
  const osm=$("#osmLink");
  if(osm){
    const m=(C.reception.coords||"").split(",").map(s=>Number(s.trim()));
    if(m.length>=2&&isFinite(m[0])&&isFinite(m[1])){
      osm.href=`https://www.openstreetmap.org/?mlat=${m[0]}&mlon=${m[1]}#map=16/${m[0]}/${m[1]}`;
    }else{
      osm.remove();
    }
  }

  // RSVP — gửi về Google Sheet (nếu đã cấu hình appsScriptUrl), kèm honeypot chống bot
  const rsvpNote=$("#rsvpNote"), rsvpStats=$("#rsvpStats");
  const note=(t)=>{if(rsvpNote)rsvpNote.textContent=t};
  $("#rsvpForm").addEventListener("submit", async e=>{
    e.preventDefault();
    const f=new FormData(e.target);
    if(f.get("website")){ e.target.reset(); note("Cảm ơn bạn! 💐"); return; } // honeypot: bot điền → bỏ qua lặng lẽ
    const data={type:"rsvp",name:f.get("name"),attendance:f.get("attendance"),guests:f.get("guests"),note:f.get("note")};
    if(SHEET){
      note("Đang gửi xác nhận…");
      try{
        const r=await fetch(SHEET,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(data)});
        const j=await r.json();
        if(j.ok){ note(`Cảm ơn ${data.name}! Xác nhận của bạn đã được ghi nhận 💐`); e.target.reset(); loadWishes(); return; }
        note("Có lỗi khi ghi nhận: "+(j.error||"không rõ")+". Bạn vui lòng thử lại.");
      }catch(err){ note("Không gửi được lúc này (có thể do mạng chặn Google). Bạn vui lòng thử lại sau nhé."); }
    }else{
      note("Đã ghi nhận trên trình duyệt này (chế độ demo). Khi có appsScriptUrl trong config.js, dữ liệu sẽ lưu vào Google Sheet.");
      e.target.reset();
    }
  });

  // Sổ lưu bút — lưu vào Google Sheet; chưa cấu hình thì lưu localStorage (demo)
  const wishes=$("#wishes"), wishKey="wedding-wishes";
  function renderWishList(list){
    wishes.innerHTML=list.length
      ?list.slice(0,40).map(x=>`<article class="wish"><strong>${escapeHtml(x.name)}</strong><p>${escapeHtml(x.message)}</p></article>`).join("")
      :"<p class='wishes-empty'>Chưa có lời chúc nào. Hãy là người đầu tiên!</p>";
  }
  function updateStats(j){
    if(rsvpStats&&j&&typeof j.guestCount==="number")
      rsvpStats.textContent=j.guestCount>0?`💌 ${j.rsvpCount} lượt xác nhận · ${j.guestCount} khách sẽ tham dự`:"";
  }
  async function loadWishes(){
    if(SHEET){
      try{
        const r=await fetch(SHEET,{cache:"no-store"});
        const j=await r.json();
        if(j.ok){ renderWishList(j.wishes); updateStats(j); return; }
      }catch(e){ /* mạng chặn Google → rơi xuống chế độ demo */ }
      wishes.innerHTML="<p class='wishes-empty'>Chưa tải được lời chúc lúc này — thử tải lại trang nhé.</p>";
      return;
    }
    renderWishList(JSON.parse(localStorage.getItem(wishKey)||"[]"));
  }
  $("#wishForm").addEventListener("submit", async e=>{
    e.preventDefault();
    const f=new FormData(e.target);
    if(f.get("website")){ e.target.reset(); return; } // honeypot
    const data={type:"wish",name:f.get("name"),message:f.get("message")};
    if(SHEET){
      const btn=e.target.querySelector("button"); if(btn)btn.disabled=true;
      try{
        const r=await fetch(SHEET,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(data)});
        const j=await r.json();
        if(j.ok){ e.target.reset(); await loadWishes(); } else { note("Lưu lời chúc bị lỗi: "+(j.error||"?")); }
      }catch(err){ note("Không gửi được lời chúc lúc này — thử lại sau nhé."); }
      finally{ if(btn)btn.disabled=false; }
      return;
    }
    // chế độ demo
    const local=JSON.parse(localStorage.getItem(wishKey)||"[]");
    local.unshift({name:data.name,message:data.message});
    localStorage.setItem(wishKey,JSON.stringify(local.slice(0,30)));
    e.target.reset(); renderWishList(local);
  });
  loadWishes();

  // Hố đen — chạm vào: lóe Big Bang (vòng sáng + 14 mảnh vụn bay toả) rồi mở hộp quà
  $("#giftOpen").onclick=()=>{
    prefetchQr(); // tải sẵn 2 ảnh QR sớm nhất có thể — nút tải mới chạy được trên điện thoại
    const bh=$("#giftOpen");
    if(reducedMotion||bh.classList.contains("bang")){$("#giftModal").classList.add("open");return}
    bh.classList.add("bang");
    const wrap=document.createElement("span");
    wrap.className="bb-wrap";
    const flash=document.createElement("span");
    flash.className="bb-flash";
    wrap.appendChild(flash);
    for(let i=0;i<14;i++){
      const p=document.createElement("span");
      p.className="bb-p";
      p.style.setProperty("--a",Math.round(i*(360/14)+Math.random()*14)+"deg");
      p.style.setProperty("--r",Math.round(120+Math.random()*130)+"px");
      wrap.appendChild(p);
    }
    bh.appendChild(wrap);
    setTimeout(()=>wrap.remove(),1400);
    setTimeout(()=>bh.classList.remove("bang"),700);
    setTimeout(()=>$("#giftModal").classList.add("open"),620);
  };
  $("#giftClose").onclick=()=>$("#giftModal").classList.remove("open");
  $("#giftModal").addEventListener("click",e=>{if(e.target.id==="giftModal")$("#giftModal").classList.remove("open")});

  /* QR — chạm vào ảnh để phóng to từng mã, trong bản phóng to có nút tải ảnh về */
  const qrViewer=$("#qrViewer"), qrData={
    groom:{src:C.gift.groom.qr,label:`QR Chú Rể — ${C.couple.groom}`,file:"QR-chu-re"},
    bride:{src:C.gift.bride.qr,label:`QR Cô Dâu — ${C.couple.bride}`,file:"QR-co-dau"}
  };
  let qrKey=null;
  /* Tải sẵn 2 ảnh QR vào bộ nhớ đệm. QUAN TRỌNG trên điện thoại: nếu bấm nút tải
     rồi mới await fetch(), cú chạm đã hết hiệu lực (user gesture) và trình duyệt
     di động chặn lặng lẽ việc tải — máy tính thì không. Nhờ tải trước, nút tải
     chỉ việc tạo blob + click ngay trong cú chạm. */
  const qrBlobs={};
  function prefetchQr(){
    Object.keys(qrData).forEach(k=>{
      if(qrBlobs[k]!==undefined)return;
      qrBlobs[k]=null; // đang tải
      fetch(qrData[k].src).then(r=>r.blob()).then(b=>{qrBlobs[k]=b}).catch(()=>{qrBlobs[k]=false});
    });
  }
  function openQrViewer(k){
    qrKey=k; prefetchQr();
    $("#qrViewerImage").src=qrData[k].src;
    $("#qrViewerTitle").textContent=qrData[k].label;
    qrViewer.classList.add("open");
    document.body.style.overflow="hidden";
  }
  function closeQrViewer(){qrViewer.classList.remove("open");document.body.style.overflow=""}
  $("#qrGroom").addEventListener("click",()=>openQrViewer("groom"));
  $("#qrBride").addEventListener("click",()=>openQrViewer("bride"));
  $("#qrViewerClose").onclick=closeQrViewer;
  qrViewer.addEventListener("click",e=>{if(e.target===qrViewer)closeQrViewer()});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&qrViewer.classList.contains("open"))closeQrViewer()});
  $("#qrViewerDownload").onclick=()=>{
    if(!qrKey)return;
    const {src,file}=qrData[qrKey];
    const ext=(src.split("?")[0].match(/\.([a-z0-9]+)$/i)||[,"png"])[1].toLowerCase();
    const name=`${file}.${ext}`;
    const go=(href)=>{ // đồng bộ 100% trong cú chạm — không await ở đây
      const a=Object.assign(document.createElement("a"),{href,download:name});
      a.rel="noopener";
      document.body.appendChild(a);a.click();a.remove();
    };
    const blob=qrBlobs[qrKey];
    if(blob){ // ảnh đã sẵn sàng → tải qua blob để đặt đúng tên file
      const url=URL.createObjectURL(blob);
      go(url);
      setTimeout(()=>URL.revokeObjectURL(url),20000);
    }else{ // mạng chậm chưa kịp tải sẵn, hoặc fetch lỗi / mở bằng file:// → tải trực tiếp
      go(src);
    }
  };

  window.addEventListener("load",()=>{setTimeout(()=>$("#loader").classList.add("hide"),450)});
})();
