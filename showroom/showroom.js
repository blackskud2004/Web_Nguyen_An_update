// showroom/showroom.js
// Attach behavior to the logo (no inline onclick) to satisfy CSP.
(function(){
  try{
    const logo = document.getElementById('logo-btn');
    if(!logo) return;
    const goHome = () => { window.location.href = '../index.html'; };
    logo.addEventListener('click', goHome, false);
    // Make it keyboard accessible (Enter/Space)
    logo.addEventListener('keydown', (ev)=>{
      if(ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar'){
        ev.preventDefault();
        goHome();
      }
    });
  }catch(e){
    // don't break the page if something unexpected happens
    console.error('showroom.js error', e);
  }
})();
