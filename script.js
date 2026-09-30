(function(){
  // ---- Demo data (illustrative only) ----
  var PAIRS=[["EUR/USD",1.0842,4,.32],["GBP/USD",1.2715,4,-.11],["USD/JPY",151.24,2,.18],["AUD/USD",.6589,4,-.27],["USD/CAD",1.3601,4,.09],["USD/CHF",.8832,4,-.05],["XAU/USD",2318.4,2,.54]];
  function rng(seed){return function(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646}}
  function series(n,seed,up){var r=rng(seed),v=100,a=[];for(var i=0;i<n;i++){v+=(r()-.5+(up>=0?.06:-.06))*4;a.push(v)}return a}
  function spark(a,w,h,c){var mn=Math.min.apply(0,a),mx=Math.max.apply(0,a),p=a.map(function(v,i){return(i/(a.length-1)*w).toFixed(1)+","+(h-(v-mn)/(mx-mn||1)*h).toFixed(1)}).join(" ");
    return'<svg width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'"><polyline points="'+p+'" fill="none" stroke="'+c+'" stroke-width="1.6" stroke-linejoin="round"/></svg>'}
  function candles(el,n,seed){
    var r=rng(seed),W=400,H=200,p=[],v=100;
    for(var i=0;i<n;i++){var o=v,c=o+(r()-.44)*7,hi=Math.max(o,c)+r()*3,lo=Math.min(o,c)-r()*3;p.push([o,c,hi,lo]);v=c}
    var mn=Math.min.apply(0,p.map(function(x){return x[3]})),mx=Math.max.apply(0,p.map(function(x){return x[2]})),
    y=function(t){return 10+(mx-t)/(mx-mn)*(H-20)},bw=W/n,s='';
    for(var g=1;g<5;g++)s+='<line x1="0" x2="'+W+'" y1="'+g*40+'" y2="'+g*40+'" stroke="rgba(255,255,255,.05)"/>';
    p.forEach(function(d,i){var x=i*bw+bw/2,col=d[1]>=d[0]?'#3ddc97':'#ff6b81';
      s+='<g class="cd" style="opacity:0;animation:fi .5s '+(i*.03)+'s forwards"><line x1="'+x+'" x2="'+x+'" y1="'+y(d[2])+'" y2="'+y(d[3])+'" stroke="'+col+'"/><rect x="'+(x-bw*.3)+'" y="'+y(Math.max(d[0],d[1]))+'" width="'+bw*.6+'" height="'+Math.max(2,Math.abs(y(d[0])-y(d[1])))+'" fill="'+col+'" rx="1"/></g>'});
    var ma=p.map(function(d,i){return(i*bw+bw/2)+","+y(d[1]-(r()-.5)*1)}).join(" ");
    s+='<polyline points="'+ma+'" fill="none" stroke="#7c5cff" stroke-width="1.6" opacity=".9"/>';
    el.innerHTML=s}
  var st=document.createElement('style');st.textContent='@keyframes fi{to{opacity:1}}';document.head.appendChild(st);
  function fmt(p){return p[1].toFixed(p[2])}
  function cls(x){return x>=0?'up':'down'}
  function pc(x){return(x>=0?'+':'')+x.toFixed(2)+'%'}

  // watchlist
  document.getElementById('wl').innerHTML=PAIRS.slice(0,4).map(function(p){return'<li><span>'+p[0]+'<small>'+fmt(p)+'</small></span><span class="'+cls(p[3])+'">'+pc(p[3])+'</span></li>'}).join('');
  candles(document.getElementById('c1'),38,7);

  // markets table
  document.getElementById('mk').innerHTML=PAIRS.map(function(p,i){var sp=Math.pow(10,-p[2])*(p[2]===2?2:1.5);
    return'<tr class="row"><td><strong>'+p[0]+'</strong></td><td>'+p[1].toFixed(p[2])+'</td><td>'+(p[1]+sp).toFixed(p[2])+'</td><td class="'+cls(p[3])+'">'+pc(p[3])+'</td><td>'+spark(series(24,i+3,p[3]),90,28,p[3]>=0?'#3ddc97':'#ff6b81')+'</td></tr>'}).join('');

  // platform tabs
  var TABS={
    Overview:function(){return'<div class="stats"><div class="stat"><small>Portfolio (demo)</small><b>$24,180.50</b></div><div class="stat"><small>Open positions</small><b>3</b></div><div class="stat"><small>Day change</small><b class="up">+1.8%</b></div></div><svg class="chart" id="c2" viewBox="0 0 400 200" preserveAspectRatio="none" style="height:230px"></svg>'},
    Markets:function(){return'<div class="tw"><table><thead><tr><th>Pair</th><th>Price</th><th>Change</th></tr></thead><tbody>'+PAIRS.map(function(p){return'<tr class="row"><td>'+p[0]+'</td><td>'+fmt(p)+'</td><td class="'+cls(p[3])+'">'+pc(p[3])+'</td></tr>'}).join('')+'</tbody></table></div>'},
    Charts:function(){return'<div class="top"><div><small class="ph">GBP/USD · 4H · MA(20)</small><strong>1.2715</strong></div><small class="ph">Indicators: MA · RSI · Volume</small></div><svg class="chart" id="c2" viewBox="0 0 400 200" preserveAspectRatio="none" style="height:300px"></svg>'},
    Positions:function(){return'<div class="tw"><table><thead><tr><th>Pair</th><th>Side</th><th>Size</th><th>P/L (demo)</th></tr></thead><tbody><tr class="row"><td>EUR/USD</td><td class="up">Buy</td><td>0.50 lot</td><td class="up">+$42.10</td></tr><tr class="row"><td>USD/JPY</td><td class="down">Sell</td><td>0.30 lot</td><td class="up">+$18.40</td></tr><tr class="row"><td>XAU/USD</td><td class="up">Buy</td><td>0.10 lot</td><td class="down">−$9.75</td></tr></tbody></table></div>'},
    Watchlist:function(){return'<div class="grid3" style="margin:0">'+PAIRS.slice(0,6).map(function(p,i){return'<div class="stat"><small>'+p[0]+'</small><b>'+fmt(p)+'</b><span class="'+cls(p[3])+'">'+pc(p[3])+'</span>'+spark(series(20,i+11,p[3]),120,30,p[3]>=0?'#3ddc97':'#ff6b81')+'</div>'}).join('')+'</div>'}
  };
  var tabs=document.getElementById('tabs'),panel=document.getElementById('tabpanel');
  Object.keys(TABS).forEach(function(k,i){var b=document.createElement('button');b.className='tab';b.role='tab';b.textContent=k;b.setAttribute('aria-selected',i===0);
    b.onclick=function(){tabs.querySelectorAll('.tab').forEach(function(t){t.setAttribute('aria-selected',t===b)});show(k)};tabs.appendChild(b)});
  function show(k){panel.innerHTML=TABS[k]();var c=document.getElementById('c2');if(c)candles(c,k==='Charts'?48:40,k==='Charts'?21:5)}
  show('Overview');

  // features
  var F=[["radio","Real-Time Market View","Monitor currency pairs and market movements from one clean interface."],["candlestick-chart","Advanced Charts","Analyze price action with professional charting tools and customizable views."],["star","Smart Watchlists","Keep your most important markets within reach."],["zap","Fast, Focused Execution","Designed to make placing and managing trades straightforward."],["graduation-cap","Built for Beginners","Simple navigation, educational resources, and an approachable interface."],["cpu","Advanced When You Need It","Professional tools for traders who want deeper market analysis."]];
  document.getElementById('fgrid').innerHTML=F.map(function(f,i){var bars='';for(var j=0;j<10;j++)bars+='<span style="height:'+(30+((i*7+j*13)%70))+'%;animation-delay:'+(j*.15)+'s"></span>';
    return'<article class="card rv"><div class="ic"><i data-lucide="'+f[0]+'"></i></div><h3>'+f[1]+'</h3><p>'+f[2]+'</p><div class="mini" aria-hidden="true">'+bars+'</div></article>'}).join('');

  // faq
  var Q=[["What is Vexora?","Vexora is a fictional forex trading platform created as a design concept. It illustrates how a modern trading product could present markets, charts and learning resources."],["Is Vexora suitable for beginners?","The interface is designed to be approachable, with clear navigation and educational content. Forex still carries risk, so take time to learn before trading."],["What markets can I trade?","The demo shows major currency pairs and gold (XAU/USD). Available instruments on a real platform would depend on its offering."],["Do I need previous trading experience?","No. The learning center covers the basics of currency pairs, charts and risk management."],["What tools does Vexora provide?","Charts, watchlists, a market overview, position management and educational resources, presented as a concept."],["How do I create an account?","Select “Create account”, set up a profile, and explore. In this demo the button is a placeholder and no account is created."],["Is forex trading risky?","Yes. Forex involves significant risk, leverage can magnify losses, and it may not suit everyone. Never trade more than you can afford to lose."],["Can I learn forex through Vexora?","Yes. The learning center is designed to cover Forex 101, reading the market and risk management."]];
  document.getElementById('faqs').innerHTML=Q.map(function(q){return'<details><summary>'+q[0]+'</summary><p>'+q[1]+'</p></details>'}).join('');

  // nav
  var hd=document.getElementById('hd'),ln=document.getElementById('links'),bg=document.getElementById('burger');
  function sc(){hd.classList.toggle('solid',scrollY>24)}sc();addEventListener('scroll',sc,{passive:true});
  bg.onclick=function(){var o=ln.classList.toggle('open');bg.setAttribute('aria-expanded',o)};
  ln.onclick=function(e){if(e.target.tagName==='A'){ln.classList.remove('open');bg.setAttribute('aria-expanded',false)}};

  // reveal
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
  document.querySelectorAll('.rv').forEach(function(el,i){el.style.transitionDelay=(i%3)*80+'ms';io.observe(el)});
  if(window.lucide)lucide.createIcons();
})();
