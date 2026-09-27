(() => {
  const C = WEDDING_CONFIG;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value ?? ""; };
  const date = new Date(C.date.iso);

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
  window.addEventListener("scroll",()=>{if(!ticking){requestAnimationFrame(parallax);ticking=true}}, {passive:true});

  // Reveal
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.12});
  $$(".reveal").forEach(el=>observer.observe(el));

  // Gallery
  const gallery=$("#gallery"), photos=C.photos.filter(Boolean);
  photos.forEach((src,i)=>{
    const item=document.createElement("div"); item.className="gallery-item";
    const img=document.createElement("img"); img.src=src; img.loading="lazy"; img.alt=`Ảnh cưới ${i+1}`;
    img.onerror=()=>{ item.style.background="linear-gradient(135deg,#dfe7d7,#f6f0e5)"; img.style.display="none"; };
    item.appendChild(img); item.addEventListener("click",()=>openLightbox(i)); gallery.appendChild(item);
  });
  let current=0; const lb=$("#lightbox"), lbImg=$("#lightboxImage"), counter=$("#lightboxCounter");
  function openLightbox(i){current=i;lb.classList.add("open");renderLightbox()}
  function renderLightbox(){lbImg.src=photos[current];counter.textContent=`${current+1} / ${photos.length}`}
  function next(){current=(current+1)%photos.length;renderLightbox()}
  function prev(){current=(current-1+photos.length)%photos.length;renderLightbox()}
  $("#lightboxClose").onclick=()=>lb.classList.remove("open");$("#lightboxNext").onclick=next;$("#lightboxPrev").onclick=prev;
  document.addEventListener("keydown",e=>{if(!lb.classList.contains("open"))return;if(e.key==="Escape")lb.classList.remove("open");if(e.key==="ArrowRight")next();if(e.key==="ArrowLeft")prev()});

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

  window.addEventListener("load",()=>setTimeout(()=>$("#loader").classList.add("hide"),450));
})();