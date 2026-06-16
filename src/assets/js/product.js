/* LUMINA — Product page. Variant switching, price, stock & SKU updates
   are handled natively by Salla web components (<salla-product-options>).
   We only wire optional gallery zoom here. */
(function(){
  'use strict';
  if (!(window.Lumina && window.Lumina.imageZoom)) return;
  // Salla's <salla-slider data-zoom> + Twilight handle zoom; placeholder hook:
  document.querySelectorAll('.lumina-pdp-img').forEach(function(img){
    img.addEventListener('click', function(){ /* lightbox handled by Twilight fslightbox */ });
  });
})();
