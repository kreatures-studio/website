/* KREA.TURES v4.0 — interacciones sin dependencias. */
(function(){
"use strict";
var header=document.getElementById("siteHeader");
var burger=document.getElementById("burger");
var mobileMenu=document.getElementById("mobileMenu");
var navLinks=Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
function onScroll(){
if(window.scrollY>24){header.classList.add("is-stuck");}
else{header.classList.remove("is-stuck");}
}
window.addEventListener("scroll",onScroll,{passive:true});onScroll();
function setMenu(open){
document.body.classList.toggle("menu-open",open);
burger.setAttribute("aria-expanded",String(open));
burger.setAttribute("aria-label",open?"Cerrar menú":"Abrir menú");
mobileMenu.hidden=!open;
}
burger.addEventListener("click",function(){
setMenu(mobileMenu.hidden);
});
Array.prototype.forEach.call(document.querySelectorAll(".mobile-menu__link"),function(l){
l.addEventListener("click",function(){setMenu(false);});
});
document.addEventListener("keydown",function(e){
if(e.key==="Escape"&&!mobileMenu.hidden){setMenu(false);}
});
var sections=Array.prototype.slice.call(document.querySelectorAll("section[id]"));
var map={};navLinks.forEach(function(a){map[a.getAttribute("href").slice(1)]=a;});
if("IntersectionObserver" in window){
var navObs=new IntersectionObserver(function(entries){
entries.forEach(function(en){
if(en.isIntersecting){
navLinks.forEach(function(a){a.classList.remove("is-active");});
var link=map[en.target.id];if(link){link.classList.add("is-active");}
}
});
},{rootMargin:"0px 0px -70% 0px",threshold:.05});
sections.forEach(function(s){navObs.observe(s);});
var revObs=new IntersectionObserver(function(entries){
entries.forEach(function(en){
if(en.isIntersecting){en.target.classList.add("is-in");revObs.unobserve(en.target);}
});
},{rootMargin:"0px 0px -8% 0px",threshold:.08});
Array.prototype.forEach.call(document.querySelectorAll(".reveal"),function(el){revObs.observe(el);});
}else{
Array.prototype.forEach.call(document.querySelectorAll(".reveal"),function(el){el.classList.add("is-in");});
}
var tags=Array.prototype.slice.call(document.querySelectorAll(".tag"));
var groups=Array.prototype.slice.call(document.querySelectorAll(".work-group"));
var count=document.getElementById("count");
function applyFilter(f){
var shown=0,imgs=0;
groups.forEach(function(g){
var show=(f==="all"||g.getAttribute("data-cat")===f);
g.classList.toggle("is-hidden",!show);
if(show){shown++;imgs+=g.querySelectorAll("img").length;}
});
if(count){count.textContent=(f==="all"?"Mostrando todo":("Filtro: "+f))+" · "+shown+" bloques · "+imgs+" imágenes";}
}
tags.forEach(function(t){
t.addEventListener("click",function(){
tags.forEach(function(x){x.classList.remove("is-active");});
t.classList.add("is-active");
applyFilter(t.getAttribute("data-filter"));
});
});
applyFilter("all");
Array.prototype.forEach.call(document.querySelectorAll(".svc-key"),function(k){
k.addEventListener("click",function(){
var f=k.getAttribute("data-goto");
var btn=document.querySelector('.tag[data-filter="'+f+'"]');
if(btn){btn.click();}
document.getElementById("trabajos").scrollIntoView({behavior:"smooth"});
});
});
var box=document.getElementById("lightbox");
var boxImg=document.getElementById("lightboxImg");
var boxCap=document.getElementById("lightboxCap");
var boxClose=document.getElementById("lightboxClose");
function openBox(src,alt){
boxImg.src=src;boxImg.alt=alt||"";boxCap.textContent=alt||"";
box.hidden=false;document.body.style.overflow="hidden";boxClose.focus();
}
function closeBox(){box.hidden=true;boxImg.removeAttribute("src");document.body.style.overflow="";}
Array.prototype.forEach.call(document.querySelectorAll(".work-grid .shot img"),function(img){
img.addEventListener("click",function(){openBox(img.currentSrc||img.src,img.alt);});
});
boxClose.addEventListener("click",closeBox);
box.addEventListener("click",function(e){if(e.target===box){closeBox();}});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!box.hidden){closeBox();}});
var form=document.getElementById("contactForm");
var note=document.getElementById("formNote");
if(form){
form.addEventListener("submit",function(){
if(note){note.textContent="Abriendo tu email para enviar el mensaje…";}
});
}
})();


