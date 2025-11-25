---
layout: article
title: Contact
permalink: /contact
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
<form id="contactForm" action="https://backend.veemax.be/fn/reprise-contactform" method="POST" style="width: 100%">
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
  <!-- hCaptcha widget -->
  <div class="form-group mt-4 mb-4">
    <div class="h-captcha" data-sitekey="84e033b6-509e-41b4-800a-b23cf290df94"></div>
  </div>
  <button id="submitButton" type="button" class="button button--primary button--rounded button--lg">Verstuur!</button>
</form>
<div id="reponse"></div>

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
      alert('Gelieve de hCaptcha verificatie te voltooien.');
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
</div>
</div>
