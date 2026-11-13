---
title: Contact
permalink: /contact
---

<p>
Hebt u vragen? Dan contacteert u ons het best&nbsp;
{%- assign _author = site.author -%}
<a href="mailto:{{ _author.email | encode_email }}" title="Mail ons">via e-mail</a>
of met het formulier hieronder:
</p>

<form id="contactForm" class="formulier formulier--kader" action="https://backend.veemax.be/fn/reprise-contactform" method="POST">
  <div class="veld">
    <label for="inputName">Volledige naam</label>
    <input type="text" name="name" id="inputName" autocomplete="name" placeholder="Vul hier uw naam in" required="required">
  </div>
  <div class="veld">
    <label for="inputEmail">E-mailadres</label>
    <input type="email" name="email" id="inputEmail" autocomplete="email" placeholder="Vul hier uw e-mailadres in">
  </div>
  <div class="veld">
    <label for="inputMessage">Uw bericht</label>
    <textarea name="message" id="inputMessage" rows="6" placeholder="Vul hier uw bericht in"></textarea>
  </div>
  <!-- add hidden Honeypot input to prevent spams -->
  <input type="hidden" name="_gotcha" style="display:none !important">
  <!-- hCaptcha widget -->
  <div class="veld">
    <div class="h-captcha" data-sitekey="84e033b6-509e-41b4-800a-b23cf290df94"></div>
  </div>
  <button id="submitButton" type="button" class="knop knop--primair">Verstuur!</button>
</form>
<div id="reponse" role="status" aria-live="polite"></div>

<!-- hCaptcha script -->
<script src="https://js.hcaptcha.com/1/api.js" async defer></script>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  const submitButton = document.getElementById('submitButton');
  let hcaptchaWidgetId = null;
  let hcaptchaCompleted = false;

  // Wait for hCaptcha to load and get widget ID
  function initHcaptcha() {
    if (typeof hcaptcha !== 'undefined') {
      // Find the hCaptcha widget container
      const widgetContainer = document.querySelector('.h-captcha');
      if (widgetContainer && widgetContainer.dataset.hcaptchaWidgetId) {
        hcaptchaWidgetId = widgetContainer.dataset.hcaptchaWidgetId;
      }
    } else {
      setTimeout(initHcaptcha, 100);
    }
  }
  initHcaptcha();

  // Handle form submission
  submitButton.addEventListener('click', function(e) {
    e.preventDefault();

    // Wait for hCaptcha to be loaded
    if (typeof hcaptcha === 'undefined') {
      alert('hCaptcha wordt nog geladen. Probeer het over een moment opnieuw.');
      return;
    }

    // Get hCaptcha response token
    const hCaptchaResponse = hcaptcha.getResponse();
    
    // Check if hCaptcha is completed
    if (!hCaptchaResponse) {
      alert('Gelieve de hCaptcha-verificatie te voltooien.');
      return;
    }

    // Disable the button and change its text
    submitButton.disabled = true;
    submitButton.textContent = 'Verzenden...';
    submitButton.style.opacity = '0.5';

    // Submit the form with hCaptcha token (already included automatically)
    const formData = new URLSearchParams(new FormData(form));
    
    fetch(form.action, {
      method: 'POST',
      body: formData,
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(async response => {
        if (response.ok) {
          return response.text();
        } else if (response.status === 500) {
          // For 500 errors, get the response payload and show it to the user
          const errorPayload = await response.text();
          throw { status: 500, payload: errorPayload };
        } else {
          throw { status: response.status, payload: null };
        }
      })
      .then(html => {
        // Hide the form with id "contactForm"
        form.style.display = 'none';

        // Reset hCaptcha
        if (hcaptchaWidgetId !== null) {
          hcaptcha.reset(hcaptchaWidgetId);
        } else {
          hcaptcha.reset();
        }

        // Log the HTML response to the console
        console.log('Form submission response:', html);

        // Add the received HTML response to the div with id="reponse"
        const responseDiv = document.getElementById('reponse');
        responseDiv.innerHTML = html;
      })
      .catch(error => {
        console.error('Error:', error);
        
        // Re-enable the button and restore its text
        submitButton.disabled = false;
        submitButton.textContent = 'Verstuur!';
        submitButton.style.opacity = '1';
        
        // Reset hCaptcha on error
        if (hcaptchaWidgetId !== null) {
          hcaptcha.reset(hcaptchaWidgetId);
        } else {
          hcaptcha.reset();
        }
        hcaptchaCompleted = false;
        
        // Show error to user
        const responseDiv = document.getElementById('reponse');
        if (error.status === 500 && error.payload) {
          // Display the server error payload
          responseDiv.innerHTML = '<div style="color: red; padding: 1rem; border: 1px solid red; border-radius: 4px;">' + 
            '<strong>Fout:</strong><br>' + 
            error.payload.replace(/\n/g, '<br>') + 
            '</div>';
        } else {
          // Generic error for other cases
          alert('Er is een fout opgetreden. Probeer het later opnieuw.');
        }
      });
  });
});
</script>
