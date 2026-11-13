# frozen_string_literal: true

# Deelt een voorstelling op sociale media met de affiche als afbeelding en de
# korte zin als beschrijving (jekyll-seo-tag leest "image" en "description").
Jekyll::Hooks.register :voorstellingen, :pre_render do |doc|
  doc.data["image"] ||= doc.data["affiche"] if doc.data["affiche"]
  doc.data["description"] ||= doc.data["kort"] if doc.data["kort"]
end
