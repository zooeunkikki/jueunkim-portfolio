(function(){
  /* ---------- Scroll progress ---------- */
  const progress=document.getElementById('progress');
  window.addEventListener('scroll',()=>{
    const h=document.documentElement.scrollHeight-window.innerHeight;
    const p=h>0?(window.scrollY/h)*100:0;
    progress.style.width=p+'%';
  },{passive:true});

  /* ---------- Custom cursor ---------- */
  const dot=document.getElementById('cursorDot');
  const ring=document.getElementById('cursorRing');
  let mx=window.innerWidth/2,my=window.innerHeight/2;
  let rx=mx,ry=my;
  window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;
    dot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`;
  });
  function loop(){
    rx+=(mx-rx)*0.18;ry+=(my-ry)*0.18;
    ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();
  /* ---------- Mobile menu toggle ---------- */
  (function(){
    const btn=document.getElementById('mobileMenuBtn');
    const menu=document.getElementById('mobileMenu');
    if(!btn||!menu) return;
    function close(){
      btn.classList.remove('is-open');
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden','true');
      document.body.style.overflow='';
    }
    function open(){
      btn.classList.add('is-open');
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden','false');
      document.body.style.overflow='hidden';
    }
    btn.addEventListener('click',()=>{
      menu.classList.contains('is-open')?close():open();
    });
    menu.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click',(e)=>{
        const href=a.getAttribute('href');
        if(href && href.charAt(0)==='#' && href.length>1){
          const target=document.querySelector(href);
          if(target){
            e.preventDefault();
            close();
            requestAnimationFrame(()=>{
              requestAnimationFrame(()=>{
                target.scrollIntoView({behavior:'smooth',block:'start'});
                history.replaceState(null,'',href);
              });
            });
            return;
          }
        }
        close();
      });
    });
    document.addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
  })();

  /* ---------- Side nav scrollspy + click ---------- */
  (function(){
    const navLinks=document.querySelectorAll('.side-nav a');
    if(!navLinks.length) return;
    const sections=Array.from(navLinks).map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);

    navLinks.forEach(a=>{
      a.addEventListener('click',(e)=>{
        const href=a.getAttribute('href');
        if(href && href.charAt(0)==='#' && href.length>1){
          const target=document.querySelector(href);
          if(target){
            e.preventDefault();
            target.scrollIntoView({behavior:'smooth',block:'start'});
            history.replaceState(null,'',href);
          }
        }
      });
    });

    function spy(){
      const scrollY=window.scrollY;
      const maxScroll=document.documentElement.scrollHeight-window.innerHeight;
      let active=null;
      if(scrollY>=maxScroll-2 && sections.length){
        active=sections[sections.length-1].id;
      }else{
        const y=scrollY+window.innerHeight*0.35;
        sections.forEach(sec=>{ if(sec.offsetTop<=y) active=sec.id; });
      }
      navLinks.forEach(a=>{
        if(a.getAttribute('href')==='#'+active) a.classList.add('is-active');
        else a.classList.remove('is-active');
      });
    }
    window.addEventListener('scroll',spy,{passive:true});
    window.addEventListener('resize',spy);
    spy();
  })();

  /* ---------- Video lazy autoplay (viewport-aware) ---------- */
  (function(){
    const videos=document.querySelectorAll('video');
    if(!videos.length || !('IntersectionObserver' in window)) return;
    const io=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        const v=entry.target;
        if(entry.isIntersecting){
          const p=v.play();
          if(p && typeof p.catch==='function') p.catch(()=>{});
        }else{
          v.pause();
        }
      });
    },{rootMargin:'80px 0px',threshold:0.1});
    videos.forEach(v=>io.observe(v));
  })();

  const hoverables=document.querySelectorAll('a,button,.work-row,.strength,.magnetic-btn');
  hoverables.forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
  });

  /* ---------- GSAP ---------- */
  if(window.gsap){
    gsap.registerPlugin(ScrollTrigger);

    // Hero name reveal
    gsap.to('.hero-name .line span',{
      clipPath:'inset(0 0 0% 0)',
      webkitClipPath:'inset(0 0 0% 0)',
      duration:1.2,ease:'power4.out',stagger:0.18,delay:0.15
    });
    gsap.to('#heroBio',{opacity:1,y:0,duration:1,ease:'power3.out',delay:0.6});
    gsap.to('#heroScroll',{opacity:1,y:0,duration:1,ease:'power3.out',delay:0.75});

    // Section displays
    gsap.utils.toArray('.reveal-display').forEach(el=>{
      gsap.to(el,{
        opacity:1,y:0,duration:1,ease:'power3.out',
        scrollTrigger:{trigger:el,start:'top 85%'}
      });
    });

    // Body reveals
    gsap.utils.toArray('.reveal-body').forEach((el,i)=>{
      gsap.to(el,{
        opacity:1,y:0,duration:0.9,ease:'power3.out',delay:i*0.05,
        scrollTrigger:{trigger:el,start:'top 88%'}
      });
    });

    // Strength cards
    gsap.utils.toArray('.strength').forEach((el,i)=>{
      gsap.to(el,{
        opacity:1,y:0,duration:0.8,ease:'power3.out',delay:i*0.1,
        scrollTrigger:{trigger:'.strengths',start:'top 80%'}
      });
    });

    // Works rows
    gsap.to('.work-row',{
      opacity:1,x:0,duration:0.7,ease:'power3.out',stagger:0.07,
      scrollTrigger:{trigger:'.works-list',start:'top 80%'}
    });

    // Experience rows
    gsap.to('.tl-row',{
      opacity:1,y:0,duration:0.8,ease:'power3.out',stagger:0.1,
      scrollTrigger:{trigger:'.timeline',start:'top 85%'}
    });

    // Featured case cards
    gsap.utils.toArray('.feature-case').forEach(el=>{
      gsap.to(el,{
        opacity:1,y:0,duration:1,ease:'power3.out',
        scrollTrigger:{trigger:el,start:'top 85%'}
      });
    });

    // KPI count-up
    document.querySelectorAll('.count').forEach(el=>{
      const target=+el.dataset.target;
      ScrollTrigger.create({
        trigger:el,start:'top 90%',once:true,
        onEnter:()=>{
          const obj={v:0};
          gsap.to(obj,{
            v:target,duration:2,ease:'power2.out',
            onUpdate:()=>{
              el.textContent=Math.round(obj.v).toLocaleString();
            }
          });
        }
      });
    });

    // Contact display
    gsap.to('.contact-display .line span',{
      opacity:1,y:0,duration:1,ease:'power4.out',stagger:0.12,
      scrollTrigger:{trigger:'#contactDisplay',start:'top 80%'}
    });
  }

  /* ---------- Lookbook (auto-flow + hover pause + 1-image arrow slide) ---------- */
  document.querySelectorAll('.lookbook').forEach(lb=>{
    const track=lb.querySelector('.lookbook-track');
    const prev=lb.querySelector('.lookbook-nav.prev');
    const next=lb.querySelector('.lookbook-nav.next');
    if(!track) return;

    /* === Shuffle: 원본 셋 무작위 + 복제 셋 동일 순서로 동기화 === */
    (function shuffle(){
      const all=Array.from(track.children);
      const half=Math.floor(all.length/2);
      const originals=all.slice(0,half);
      // Fisher-Yates
      for(let i=originals.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [originals[i],originals[j]]=[originals[j],originals[i]];
      }
      track.innerHTML='';
      // 원본 셋
      originals.forEach(el=>{
        track.appendChild(el);
        if(el.tagName==='VIDEO'){ el.muted=true; el.play().catch(()=>{}); }
      });
      // 복제 셋 — 동일 순서로 cloneNode (무한 루프 일치)
      originals.forEach(el=>{
        const c=el.cloneNode(true);
        c.setAttribute('aria-hidden','true');
        track.appendChild(c);
        if(c.tagName==='VIDEO'){ c.muted=true; c.load(); c.play().catch(()=>{}); }
      });
    })();

    const items=Array.from(track.children);
    const totalOriginal=items.length/2;  // 원본 세트 개수
    const GAP=14;
    let cumX=[];          // 각 이미지까지의 누적 X offset
    let setWidth=0;       // 원본 1세트 전체 너비
    let currentIndex=0;

    function measure(){
      let x=0;
      cumX=[];
      for(let i=0;i<items.length;i++){
        cumX.push(x);
        x+=items[i].offsetWidth+GAP;
      }
      setWidth=cumX[totalOriginal] || 0;
    }
    measure();
    // 이미지 lazy-load 완료될 때마다 재측정
    items.forEach(img=>{
      if(!img.complete) img.addEventListener('load',measure,{once:true});
    });
    let rzt;
    window.addEventListener('resize',()=>{clearTimeout(rzt);rzt=setTimeout(measure,120);});

    let curX=0, targetX=0;
    let hovering=false;
    let lastT=performance.now();
    const speed=0.04;     // 자동 흐름 (px/ms)
    const lerp=0.12;      // 슬라이드 부드러움

    function frame(now){
      const dt=now-lastT;
      lastT=now;
      if(hovering){
        curX+=(targetX-curX)*lerp;
      }else{
        curX-=speed*dt;
        targetX=curX;
      }
      // 양방향 무한 루프 보정
      if(setWidth>0){
        while(curX<=-setWidth){ curX+=setWidth; targetX+=setWidth; }
        while(curX>0){          curX-=setWidth; targetX-=setWidth; }
      }
      track.style.transform=`translate3d(${curX.toFixed(2)}px,0,0)`;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    function snapToCurrentIndex(){
      // curX와 가장 가까운 원본 인덱스 찾아서 currentIndex 설정
      if(!cumX.length || setWidth===0) return;
      const adj=-curX;  // 양수로 변환
      let best=0, min=Infinity;
      for(let i=0;i<totalOriginal;i++){
        const d=Math.abs(cumX[i]-adj);
        if(d<min){ min=d; best=i; }
      }
      currentIndex=best;
    }

    function slide(dir){
      // dir = +1 (next, 다음 이미지) / -1 (prev, 이전 이미지)
      if(setWidth===0) return;
      hovering=true;
      // 자동 흐름 중이었다면 현재 가장 가까운 인덱스로 먼저 스냅
      snapToCurrentIndex();
      let nextIdx=currentIndex+dir;
      if(nextIdx>=totalOriginal){
        // 끝 → 처음으로 (점프 후 슬라이드)
        nextIdx=0;
        curX+=setWidth;
        targetX+=setWidth;
      }else if(nextIdx<0){
        // 처음 → 끝으로
        nextIdx=totalOriginal-1;
        curX-=setWidth;
        targetX-=setWidth;
      }
      currentIndex=nextIdx;
      targetX=-cumX[currentIndex];
    }

    lb.addEventListener('mouseenter',()=>{
      hovering=true;
      targetX=curX;       // 정지
      snapToCurrentIndex();
    });
    lb.addEventListener('mouseleave',()=>{
      hovering=false;
      lastT=performance.now();
    });

    if(prev) prev.addEventListener('click',e=>{ e.preventDefault(); slide(-1); });
    if(next) next.addEventListener('click',e=>{ e.preventDefault(); slide(+1); });
  });

  /* ---------- Magnetic button ---------- */
  const mag=document.getElementById('magneticBtn');
  if(mag && window.matchMedia('(hover:hover)').matches){
    mag.addEventListener('mousemove',e=>{
      const r=mag.getBoundingClientRect();
      const x=e.clientX-(r.left+r.width/2);
      const y=e.clientY-(r.top+r.height/2);
      mag.style.transform=`translate(${x*0.25}px,${y*0.25}px)`;
    });
    mag.addEventListener('mouseleave',()=>{
      mag.style.transform='translate(0,0)';
      mag.style.transition='transform .5s cubic-bezier(.2,.8,.2,1)';
      setTimeout(()=>mag.style.transition='',500);
    });
  }
})();
