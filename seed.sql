INSERT OR IGNORE INTO site (
  id, hero_title, hero_lead, about,
  joel_name, joel_phone_display, joel_phone_footer, joel_phone_tel, joel_cta,
  ahren_name, ahren_phone_display, ahren_phone_footer, ahren_phone_tel, ahren_cta,
  email, spanish, cta_secondary,
  quote_heading, quote_submit, quote_helper, quote_photos, updated_at
) VALUES (
  1,
  'Decks, fences, siding, drywall, windows, roofing.',
  'Free estimates. Call Joel or Ahren.',
  'Joel and Ahren Paz.
Solid Craft Construction LLC.
Estimates are free.
We speak Spanish.',
  'Joel Paz', '(541) 653-6793', '541-653-6793', 'tel:+15416536793', 'Call Joel (541) 653-6793',
  'Ahren Paz', '(541) 255-9111', '541-255-9111', 'tel:+15412559111', 'Call Ahren (541) 255-9111',
  'pnw@solidcraftbuilds.com', 'Hablamos español', 'Email us',
  'Email a job', 'Send', 'Or call Joel or Ahren.', 'Job photos, optional',
  datetime('now')
);

INSERT OR IGNORE INTO services (id, slug, name, line, sort_order) VALUES
  (1, 'decks', 'Decks', 'New deck or a repair.', 0),
  (2, 'fences', 'Fences', 'We put them up. We fix them.', 1),
  (3, 'siding', 'Siding', 'Siding on the house.', 2),
  (4, 'drywall', 'Drywall', 'Hang it or patch it.', 3),
  (5, 'windows', 'Windows', 'We install windows.', 4),
  (6, 'roofing', 'Roofing', 'Roof work. Call first.', 5);

INSERT OR IGNORE INTO photos (id, src, job_preset, job_custom, width, height, sort_order) VALUES
  (1, '/work/decks.jpg', 'Decks', '', 810, 1080, 0),
  (2, '/work/siding.jpg', 'Siding', '', 810, 1080, 1),
  (3, '/work/stairs.jpg', 'Decks', '', 810, 1080, 2);
