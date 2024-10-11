---
layout: article
title: Parking aan CCHA reserveren
permalink: /parking-reserveren
article_header:
  type: cover
  image:
    src: /assets/images/reprise/header_reducedheight_3.webp
---

De werking van de parking aan CCHA is sinds kort gewijzigd:
Slimme slagbomen met nummerplaatherkenning regelen nu de toegang.

- **Voor inwoners van Hasselt:** U kan gratis parkeren door gebruik te maken van het Hasselts Parkeerbudget. U hoeft niet op voorhand te reserveren. Meer info vindt u hier: [https://www.hasselt.be/nl/parkeerbudget](https://www.hasselt.be/nl/parkeerbudget).
- **Voor niet-inwoners van Hasselt:** U kan een parkeerplaats reserveren aan 3 euro/avond. Gebruik het onderstaande formulier om een reservatie-link aan te vragen. Indien u niet reserveert, betaalt u het geldend uurtarief van 2 euro/uur.

## Reservatie-link aanvragen


Wanneer u onderstaand formulier invult, ontvangt u een email van [parkinghasselt@amano.be](mailto:parkinghasselt@amano.be)
met een link om uw parkeerplaats te reserveren. De email komt dus niet van Reprisevzw.be. Check ook je spamfolder indien je geen email ontvangt.

**Let op! U moet de reservatie nog bevestigen en betalen via de link in de email die u ontvangt!**

Wenst u meerdere plaatsen te reserveren? Dan moet u het formulier meerdere malen invullen,
**telkens met een verschillend email adres**! Amano - de beheerder van de parking - beperkt het aantal reservaties tot slechts één per email adres.

Selecteer hieronder het evenement waarvoor u een parkeerplaats wilt reserveren en vul uw e-mailadres in:

<div class="center-wrapper">
  <div id="parking-form">
    <select id="event-select">
      <option value="">Selecteer een evenement</option>
    </select>
    <input type="email" id="email-input" placeholder="Uw e-mailadres">
    <button id="submit-button" class="button button--primary button--rounded button--lg">Reserveer parkeerplaats</button>
  </div>
</div>

<div id="result-message"></div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const eventSelect = document.getElementById('event-select');
  const emailInput = document.getElementById('email-input');
  const submitButton = document.getElementById('submit-button');
  const resultMessage = document.getElementById('result-message');

  // Fetch events from the API
  fetch('https://1hjn40kz97.execute-api.eu-north-1.amazonaws.com/amano/events-cached', {
    method: 'GET',
    mode: 'cors',
  })
    .then(response => response.json())
    .then(data => {
      data.forEach(event => {
        const option = document.createElement('option');
        option.value = event.id;
        const eventDate = event.startTime;
        option.textContent = `${event.name} - ${eventDate}`;
        eventSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching events:', error);
      resultMessage.textContent = 'Er is een fout opgetreden bij het ophalen van de evenementen. Probeer het later opnieuw.';
    });

  // Handle form submission
  submitButton.addEventListener('click', function() {
    const eventId = eventSelect.value;
    const email = emailInput.value;

    if (!eventId || !email) {
      resultMessage.textContent = 'Selecteer een evenement en vul uw e-mailadres in.';
      return;
    }

    // Disable the button and change its text
    submitButton.disabled = true;
    submitButton.textContent = 'Verzenden...';
    submitButton.style.opacity = '0.5';

    fetch('https://1hjn40kz97.execute-api.eu-north-1.amazonaws.com/amano/send-invite', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event_id: eventId, email: email }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          resultMessage.textContent = 'Uw aanvraag is succesvol verzonden. U ontvangt binnenkort een e-mail met de reservatielink.';
        } else {
          resultMessage.textContent = 'Er is een fout opgetreden bij het verzenden van uw aanvraag. Probeer het later opnieuw.';
        }
      })
      .catch(error => {
        console.error('Error sending invite:', error);
        resultMessage.textContent = 'Er is een fout opgetreden bij het verzenden van uw aanvraag. Probeer het later opnieuw.';
      })
      .finally(() => {
        // Re-enable the button and restore its text
        submitButton.disabled = false;
        submitButton.textContent = 'Reserveer parkeerplaats';
        submitButton.style.opacity = '1';
      });
  });
});
</script>

<style>
.center-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

#parking-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
}

#parking-form select,
#parking-form input,
#parking-form button {
  padding: 10px;
  font-size: 16px;
  width: 100%;
}

#result-message {
  margin-top: 20px;
  font-weight: bold;
  text-align: center;
}
</style>

<p>&nbsp;</p>
<p>&nbsp;</p>
