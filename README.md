# Website van Reprise vzw

De bronbestanden van [reprisevzw.be](https://reprisevzw.be), gemaakt met
[Jekyll](https://jekyllrb.com). Bij elke wijziging op `main`, en elke nacht,
bouwt GitHub Actions de site opnieuw en zet ze online.

## Een nieuwe voorstelling toevoegen (op GitHub)

Elke voorstelling is één bestand in de map `_voorstellingen`. De site rekent
zelf uit wat er nog komt en wat voorbij is: de dag na de voorstelling verhuist
ze vanzelf naar het archief. U hoeft dus nooit bestanden te verplaatsen.

1. **Affiche opladen.** Open de map `assets/images/voorstellingen`, kies
   *Add file* > *Upload files* en zet de affiche in een nieuwe map met de naam
   van het stuk, bv. `assets/images/voorstellingen/de-titel-van-het-stuk/`
   (typ de mapnaam met een `/` erachter vóór de bestandsnaam). Een staande
   afbeelding van ongeveer 800 x 1132 pixels, liefst `.webp`.
2. **Bestand maken.** Open `_voorstellingen/_sjabloon.md.txt`, kopieer de
   volledige inhoud, ga terug naar de map `_voorstellingen` en kies
   *Add file* > *Create new file*. Geef het een naam zoals
   `de-titel-van-het-stuk.md` (kleine letters, streepjes, eindigt op `.md`).
   Die naam wordt het webadres `/voorstellingen/de-titel-van-het-stuk`.
3. **Invullen.** Plak het sjabloon en pas de velden aan:
   - `title`: de titel zoals hij op de site moet staan
   - `gezelschap`: het gezelschap (mag weg)
   - `datum`: datum en uur, bv. `2027-10-14 20:00`
   - `affiche`: het pad naar de affiche uit stap 1, beginnend met `/assets/`
   - `kort`: één zin voor de startpagina (mag weg)
   - `tickets`: de link naar de ticketverkoop
   - `prijzen`: `standaard`, `groep10` en `groep20`, alleen het getal
   - `cast`: per acteur een `naam` en eventueel `bekend_van`

   Onder de tweede regel `---` komt het verhaal als gewone tekst.
4. **Opslaan.** Kies *Commit changes*. Na een paar minuten staat de
   voorstelling op de site, op de startpagina, de pagina Tickets en in
   "Ook dit seizoen".

Let op de inspringing (spaties) bij `prijzen` en `cast`: neem die precies
over uit het sjabloon. Gedeelde teksten, zoals de ticketvoorwaarden en de
abonnementsformule, staan in `_data/reprise.yml`.

## Lokaal bekijken

    bundle install
    bundle exec jekyll serve

De site staat dan op http://localhost:4000. Bezoekers worden alleen geteld in
een build met `JEKYLL_ENV=production`.
