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
<form action="https://pts6vjw7e1.execute-api.eu-north-1.amazonaws.com/repriseContactForm" method="POST"  style="width: 100%">
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
  <button class="button button--primary button--rounded button--lg" type="submit">Verstuur!</button>
</form>
</div>
</div>
