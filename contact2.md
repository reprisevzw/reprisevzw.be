---
layout: article
title: Contact
permalink: /contact2
article_header:
  type: cover
  image:
    src: /assets/images/reprise/header_reducedheight_3.webp
---

<p>
Heb je vragen? Dan kan je ons het best contacteren&nbsp;
{%- assign _author = site.author -%}
<a href="mailto:{{ _author.email | encode_email }}" title="Mail ons">via email</a>
of gebruik het onderstaande formulier:
</p>


<div class="grid cell cell--auto" style="border:1px solid #333">
<div class="m-3" style="width: 100%">
<form id="contactForm" action="https://pts6vjw7e1.execute-api.eu-north-1.amazonaws.com/dev/repriseContactForm" method="POST" style="width: 100%">
  <div class="form-group mt-4 mb-4">
    <div>
      <label for="inputName">Volledige naam:</label>
    </div>
    <div style="width: 100%">
      <input type="text" style="width: 100%" name="name" class="form-control" id="inputName" placeholder="Vul hier uw naam in" required="required">
    </div>
  </div>
  <div class="form-group mt-4 mb-4">
    <label for="inputEmail" required="required">Email adres:</label>
    <div>
    <input type="email" name="email"
      class="form-control" style="width: 100%" id="inputEmail" aria-describedby="emailHelp" placeholder="Vul hier uw email adres in">
    </div>
  </div>
  <div class="form-group mt-4 mb-4">
    <label for="inputMessage" required="required">Uw bericht:</label>
    <div>
    <textarea type="text" name="message" style="width: 100%"
      class="form-control" id="inputMessage" placeholder="Vul hier uw bericht in"></textarea>
    </div>
  </div>
  <!-- add hidden Honeypot input to prevent spams -->
  <input type="hidden" name="_gotcha" style="display:none !important">
  <button id="submitButton" class="button button--primary button--rounded button--lg" type="submit">Verstuur!</button>
</form>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  const submitButton = document.getElementById('submitButton');

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Disable the button and change its text
    submitButton.disabled = true;
    submitButton.textContent = 'Verzenden...';
    submitButton.style.opacity = '0.5';

    // Submit the form
    const formData = new URLSearchParams(new FormData(form));
    fetch(form.action, {
      method: 'POST',
      body: formData,
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(response => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error('Server responded with an error');
        }
      })
      .then(html => {
        // Replace the form with the response HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        form.parentNode.replaceChild(tempDiv.firstChild, form);
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Er is een fout opgetreden. Probeer het later opnieuw.');
      })
      .finally(() => {
        // Re-enable the button and restore its text
        submitButton.disabled = false;
        submitButton.textContent = 'Verstuur!';
        submitButton.style.opacity = '1';
      });
  });
});
</script>
</div>
</div>
