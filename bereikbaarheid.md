---
layout: article
title: Bereikbaarheid
permalink: /bereikbaarheid
article_header:
  type: cover
---

## Met de auto
[Kunstlaan 5, 3500 Hasselt](https://maps.app.goo.gl/KkdsDtXpD2LTySCM7)

GPS-coördinaten: latitude: 50.92679 - longitude: 5.34725


[Parkeermogelijkheiden](https://www.ccha.be/pQ4WuY/parking)

**OPGELET**
Vanaf maandag 06 maart maakt de parking voor CCHA plaats voor de uitbreiding van het Stadspark. Parkeren is vanaf dan niet meer mogelijk.

{% raw %}
<div id="map"></div>
{% endraw %}

{% raw %}
<script>
  // initialize Leaflet
  var map = L.map('map').setView({ lon: 5.3465362878944624, lat: 50.92616884714751 }, 17);

  // add the OpenStreetMap tiles
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  }).addTo(map);

  // show the scale bar on the lower left corner
  L.control.scale({imperial: false, metric: true}).addTo(map);

  // show a marker on the map
  const marker = L.marker({ lon: 5.3465362878944624, lat: 50.92616884714751 }).addTo(map);
  marker.bindPopup('Cultureel Centrum CCHA').openPopup();
</script>
{% endraw %}



## Met het openbaar vervoer
Aan het station neem je:
- de Boulevardpendel, die rijdt op weekdagen van 7.30 tot 19 u. Je stapt af aan de halte Kunstlaan en moet dan nog 100 m te voet naar CCHA.
- de lijnbus H1, die om het half uur richting CCHA rijdt, halte Kunstlaan. De laatste bus vertrekt omstreeks 19.20 u aan het station.


Op [delijn.be](https://www.delijn.be/) kan je terecht voor meer informatie over de uurregelingen van De Lijn. Meer informatie over de trein vind je op belgiantrain.be.
