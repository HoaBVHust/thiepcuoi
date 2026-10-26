(() => {
  const C = WEDDING_CONFIG;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value ?? ""; };
  const date = new Date(C.date.iso);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.title = `${C.couple.bride} & ${C.couple.groom} — ${C.date.display}`;
  ["coverBride","heroBride","coupleBride","ceremonyBride","footerBride","giftBride"].forEach(id => set(id,C.couple.bride));
  ["coverGroom","heroGroom","coupleGroom","ceremonyGroom","footerGroom","giftGroom"].forEach(id => set(id,C.couple.groom));
  set("coverDate", `${date.getDate()} tháng ${date.getMonth()+1}, ${date.getFullYear()}`);
  set("heroDay", C.date.day); set("heroDayNumber", C.date.dayNumber); set("heroMonth", C.date.month); set("heroYear", C.date.year);
  set("ceremonySubtitle", C.ceremony.subtitle); set("ceremonyTime", C.ceremony.time);
  set("ceremonyDay", C.date.day); set("ceremonyDayNumber", C.date.dayNumber); set("ceremonyMonth", C.date.month); set("ceremonyYear", C.date.year); set("ceremonyLunar", C.date.lunar);
  set("receptionTime", C.reception.startTime); set("receptionDay", C.date.day); set("receptionDayName", C.date.day); set("receptionDayNumber", C.date.dayNumber); set("receptionMonth", C.date.month); set("receptionYear", C.date.year);
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

  // Open invitation
  $("#openInvitation").addEventListener("click", async () => {
    $("#cover").classList.add("opened");
    document.body.classList.add("invitation-open");
    window.scrollTo({top:0,behavior:"smooth"});
    if(C.music.enabled && C.music.autoplayAfterOpen && !musicStarted) await toggleMusic();
  });

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

  /* ======================================================================
     ALBUM ẢNH — masonry tự đo kích thước
     Mỗi ảnh được đo tỷ lệ thật (dọc/ngang/vuông) rồi tính số hàng cần chiếm,
     nhờ vậy thêm ảnh mới BẤT KỲ kích thước nào lưới vẫn đẹp, ảnh không méo.
     Ảnh có featured:true chiếm 2 cột.
     ====================================================================== */
  const gallery=$("#gallery");
  const entries=C.photos.map(p=>typeof p==="string"?{src:p}:p).filter(e=>e&&e.src);
  const items=[];

  entries.forEach((entry,i)=>{
    const item=document.createElement("div");
    item.className="gallery-item";
    if(entry.featured) item.classList.add("featured");
    item.style.setProperty("--d",`${Math.min(i%4,3)*90}ms`); // hiệu ứng so le

    const img=document.createElement("img");
    img.src=entry.src; img.loading="lazy"; img.decoding="async";
    img.alt=entry.alt||`Ảnh cưới ${i+1}`;

    // Chú thích hiện khi hover
    const cap=document.createElement("div");
    cap.className="g-cap";
    cap.innerHTML=`<em></em><i>${String(i+1).padStart(2,"0")}</i>`;
    cap.querySelector("em").textContent=entry.alt||"";

    img.addEventListener("load",()=>{ item.classList.add("visible"); layoutMasonry(); });
    img.onerror=()=>{ item.remove(); console.info(`[thiepcuoi] Không tìm thấy ảnh: ${entry.src}`); };

    item.append(img,cap);
    item.addEventListener("click",()=>openLightbox(i));
    gallery.appendChild(item);
    items.push(item);
  });

  // Đo và gán số hàng cho từng ảnh theo tỷ lệ thật của nó
  const ROW=8, GAP=14;
  function layoutMasonry(){
    items.forEach(item=>{
      if(!item.isConnected) return;
      const w=item.clientWidth;
      const img=item.querySelector("img");
      if(!img||!img.naturalWidth) return;
      const h=w*(img.naturalHeight/img.naturalWidth);
      const span=Math.max(4,Math.round((h+GAP)/(ROW+GAP)));
      item.style.setProperty("--s",span);
    });
  }
  let resizeTimer;
  window.addEventListener("resize",()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(layoutMasonry,120)});
  window.addEventListener("load",layoutMasonry);

  // Lightbox
  let current=0; const lb=$("#lightbox"), lbImg=$("#lightboxImage"), counter=$("#lightboxCounter"), caption=$("#lightboxCaption");
  function openLightbox(i){current=i;lb.classList.add("open");document.body.style.overflow="hidden";renderLightbox()}
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
  function closeLightbox(){lb.classList.remove("open");document.body.style.overflow=""}
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

  // Calendar
  const cal=$("#calendar"), year=date.getFullYear(), month=date.getMonth(), selected=date.getDate();
  set("calendarTitle",`Tháng ${month+1} / ${year}`);
  const names=["CN","T2","T3","T4","T5","T6","T7"];
  cal.innerHTML=`<div class="cal-head">${names.map(x=>`<span>${x}</span>`).join("")}</div><div class="cal-grid"></div>`;
  const grid=cal.querySelector(".cal-grid"), first=new Date(year,month,1).getDay(), days=new Date(year,month+1,0).getDate();
  for(let i=0;i<first;i++)grid.innerHTML+="<span class='empty'>0</span>";
  for(let d=1;d<=days;d++)grid.innerHTML+=`<span class="${d===selected?"selected":""}">${d}</span>`;
  const start=`${year}${String(month+1).padStart(2,"0")}${String(selected).padStart(2,"0")}`;
  const end=start;
  $("#calendarLink").href=`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(C.couple.bride+" & "+C.couple.groom+" - Ngày cưới")}&dates=${start}T020000Z/${end}T140000Z&details=${encodeURIComponent("Ngày cưới của "+C.couple.bride+" & "+C.couple.groom)}&location=${encodeURIComponent(C.reception.address)}`;

  // Map
  $("#mapsLink").href=C.reception.mapsUrl;
  $("#mapFrame").src=`https://www.google.com/maps?q=${encodeURIComponent(C.reception.address)}&output=embed`;

  // RSVP local demo
  $("#rsvpForm").addEventListener("submit",e=>{e.preventDefault();$("#rsvpNote").textContent="Đã ghi nhận trên trình duyệt này. Khi deploy thật, bạn có thể nối form vào Google Sheets/Formspree.";e.target.reset()});

  // Guestbook localStorage
  const wishes=$("#wishes"), key="wedding-wishes";
  function renderWishes(){
    const data=JSON.parse(localStorage.getItem(key)||"[]");
    wishes.innerHTML=data.length?data.map(x=>`<article class="wish"><strong>${escapeHtml(x.name)}</strong><p>${escapeHtml(x.message)}</p></article>`).join(""):"<p style='text-align:center;color:#999;font-size:11px'>Chưa có lời chúc nào. Hãy là người đầu tiên!</p>";
  }
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}
  $("#wishForm").addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.target);const data=JSON.parse(localStorage.getItem(key)||"[]");data.unshift({name:f.get("name"),message:f.get("message")});localStorage.setItem(key,JSON.stringify(data.slice(0,30)));e.target.reset();renderWishes()});
  renderWishes();

  // Gift modal
  $("#giftOpen").onclick=()=>$("#giftModal").classList.add("open");
  $("#giftClose").onclick=()=>$("#giftModal").classList.remove("open");
  $("#giftModal").addEventListener("click",e=>{if(e.target.id==="giftModal")$("#giftModal").classList.remove("open")});

  window.addEventListener("load",()=>{layoutMasonry();setTimeout(()=>$("#loader").classList.add("hide"),450)});
})();
