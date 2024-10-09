---
layout: article
title: Parkeren
permalink: /parkeren
article_header:
  type: cover
  image:
    src: /assets/images/reprise/header_reducedheight_3.webp
---

## Parkeerreservatie

Selecteer hieronder het evenement waarvoor u een parkeerplaats wilt reserveren en vul uw e-mailadres in. U ontvangt vervolgens een link om uw parkeerplaats te reserveren.

<div id="parking-form">
  <select id="event-select">
    <option value="">Selecteer een evenement</option>
  </select>
  <input type="email" id="email-input" placeholder="Uw e-mailadres">
  <button id="submit-button">Reserveer parkeerplaats</button>
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
        option.textContent = event.name;
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
      });
  });
});
</script>

<style>
#parking-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 300px;
  margin-bottom: 20px;
}

#parking-form select,
#parking-form input,
#parking-form button {
  padding: 10px;
  font-size: 16px;
}

#result-message {
  margin-top: 20px;
  font-weight: bold;
}
</style>

## Parkeermogelijkheden

Voor meer informatie over parkeermogelijkheden, raadpleeg onze [bereikbaarheidspagina](/bereikbaarheid).
