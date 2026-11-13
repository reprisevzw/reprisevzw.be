// Pagina Praktisch: de kaart van CCHA en het formulier om een parkeerplaats te
// reserveren bij Amano (via backend.veemax.be).
document.addEventListener('DOMContentLoaded', function () {
  toonKaart();
  parkeerFormulier();
});

function toonKaart() {
  var el = document.getElementById('kaart');
  if (!el || typeof L === 'undefined') return;
  var zonderJs = el.querySelector('.kaart-osm__zonder-js');
  if (zonderJs) zonderJs.remove();

  var plek = { lon: 5.3465362878944624, lat: 50.92616884714751 };
  L.Icon.Default.imagePath = el.getAttribute('data-afbeeldingen') || '/assets/leaflet/images/';
  var map = L.map(el, { scrollWheelZoom: false }).setView(plek, 17);

  // OpenStreetMap-tegels
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  }).addTo(map);

  L.control.scale({ imperial: false, metric: true }).addTo(map);

  var marker = L.marker(plek, { alt: 'CCHA' }).addTo(map);
  marker.bindPopup('Cultureel Centrum CCHA').openPopup();
}

// "08 december 2026 20:00" -> "2026-12-08"
var MAANDEN = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli',
  'augustus', 'september', 'oktober', 'november', 'december'];
function isoDatum(startTime) {
  var d = String(startTime || '').trim().toLowerCase().split(/\s+/);
  var m = MAANDEN.indexOf(d[1]);
  if (d.length < 3 || m < 0) return '';
  return d[2] + '-' + String(m + 1).padStart(2, '0') + '-' + d[0].padStart(2, '0');
}

// "De Schlagerij" + "08 december 2026 20:00" -> "De Schlagerij, dinsdag 8 december 2026"
// Op een smal scherm korter, zodat de hele tekst in het keuzevak past:
// "De Schlagerij, di 8 dec 2026"
var DAGEN = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
var DAGEN_KORT = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
var MAANDEN_KORT = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
function optieTekst(event, kort) {
  var iso = isoDatum(event.startTime);
  if (!iso) return event.name + ' - ' + event.startTime;
  var d = iso.split('-').map(Number);
  var w = new Date(d[0], d[1] - 1, d[2]).getDay();
  if (kort) return event.name + ', ' + DAGEN_KORT[w] + ' ' + d[2] + ' ' + MAANDEN_KORT[d[1] - 1] + ' ' + d[0];
  return event.name + ', ' + DAGEN[w] + ' ' + d[2] + ' ' + MAANDEN[d[1] - 1] + ' ' + d[0];
}

function parkeerFormulier() {
  var form = document.getElementById('parking-form');
  var eventSelect = document.getElementById('event-select');
  var emailInput = document.getElementById('email-input');
  var submitButton = document.getElementById('submit-button');
  var resultMessage = document.getElementById('result-message');
  if (!form) return;
  var knopTekst = submitButton.innerHTML;

  // Welke voorstelling vraagt de link? (?voorstelling=<slug>)
  var gevraagd = null;
  try {
    var slug = new URLSearchParams(window.location.search).get('voorstelling');
    gevraagd = slug && window.repriseVoorstellingen ? window.repriseVoorstellingen[slug] : null;
  } catch (e) { gevraagd = null; }

  // Evenementen ophalen
  fetch('https://backend.veemax.be/fn/amano/events-cached', {
    method: 'GET',
    mode: 'cors',
  })
    .then(function (response) { return response.json(); })
    .then(function (data) {
      var gekozen = '';
      var kort = window.matchMedia('(max-width: 759px)').matches;
      data.forEach(function (event) {
        var option = document.createElement('option');
        option.value = event.id;
        option.textContent = optieTekst(event, kort);
        eventSelect.appendChild(option);
        if (gevraagd && !gekozen) {
          var zelfdeNaam = String(event.name).trim().toLowerCase() === gevraagd.titel.trim().toLowerCase();
          var zelfdeDag = isoDatum(event.startTime) === gevraagd.datum;
          if (zelfdeDag && (zelfdeNaam || data.filter(function (e) { return isoDatum(e.startTime) === gevraagd.datum; }).length === 1)) {
            gekozen = event.id;
          }
        }
      });
      if (gekozen) {
        eventSelect.value = gekozen;
      } else if (gevraagd) {
        resultMessage.textContent = 'Voor ' + gevraagd.titel + ' kan u nog geen parkeerplaats reserveren. Dat kan ten vroegste 2 maanden op voorhand.';
      }
    })
    .catch(function (error) {
      console.error('Error fetching events:', error);
      resultMessage.textContent = 'Er is een fout opgetreden bij het ophalen van de voorstellingen. Probeer het later opnieuw.';
    });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var eventId = eventSelect.value;
    var email = emailInput.value;

    if (!eventId || !email) {
      resultMessage.textContent = 'Selecteer een voorstelling en vul uw e-mailadres in.';
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Verzenden...';

    fetch('https://backend.veemax.be/fn/amano/send-invite', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event_id: eventId, email: email }),
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (data.success) {
          resultMessage.textContent = 'Uw aanvraag is succesvol verzonden. U ontvangt binnenkort een e-mail met de reservatielink.';
        } else {
          resultMessage.textContent = 'Er is een fout opgetreden bij het verzenden van uw aanvraag. Probeer het later opnieuw.';
        }
      })
      .catch(function (error) {
        console.error('Error sending invite:', error);
        resultMessage.textContent = 'Er is een fout opgetreden bij het verzenden van uw aanvraag. Probeer het later opnieuw.';
      })
      .finally(function () {
        submitButton.disabled = false;
        submitButton.innerHTML = knopTekst;
      });
  });
}
