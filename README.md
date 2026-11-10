# Janardhan Vangala — SOS Realty Group | Professional Frontend

A clean, responsive, text-free-photography **non-3D** real-estate website redesign created for Janardhan Vangala and SOS Realty Group LLC. Built with plain HTML, CSS and JavaScript; no bundler or backend required.

## Open
- Open `index.html` in a browser (or run any static server in this folder).
- Or open the separately provided `janardhan-vangala-professional-preview.html` single-file preview, which embeds its local assets and styles.

## Design approach
- Editorial typography, ivory and navy palette, subtle gold accents.
- Original SOS Realty Group imagery and Janardhan portrait supplied by the site/reference screenshots.
- No 3D viewers, canvas models, flythroughs or WebGL.
- The four covered communities are Las Vegas, Henderson, North Las Vegas, Boulder City.

## Mock features
- Main property search, filters, advanced search and illustrated map preview.
- Featured homes, open houses, saved favorites, saved searches and local-only listing alerts.
- Detailed valuation request form, mortgage calculator and assumable-loan estimator.
- Buyer/seller resources and agent information/contact form.
- Client-side mock data (`mock-backend.js`) with browser localStorage; demo forms **do not send anything**.

## Contact information from the original site
Janardhan Vangala / SOS Realty Group LLC
(702) 215-1838 — realtorjanardhan@gmail.com
3450 E. Russell Rd, Suite 209, Las Vegas, NV 89120

## Important before launch
- Replace fictional sample property listings, prices, open houses and map markers with a licensed IDX/MLS feed.
- Wire form submissions and alerts to a real secure backend/CRM, and provide production privacy/consent disclosures.
- Verify brokerage licensing and other required real-estate disclosures, marketing copy and current contact details.
- Replace cropped reference-site photos with original, high-resolution photography supplied by the agent for production.
- Conduct visual and usability QA in the target browsers and devices before deployment.

## Clean photo revision
- Removed typography baked into the source community screenshots by using their unobstructed upper photo portions.
- Community labels and guide actions are now separate white card sections below photographs.
- Removed hero-photo captions and promotional badges from images.
- The four source community images remain low-resolution screenshot-derived crops; replace them with licensed original photos before production.

## Four-neighborhood homepage update
- Replaced the former three service-promo cards with four community cards: Las Vegas, Henderson, North Las Vegas, Boulder City.
- Each community name, description and CTA is accessible live HTML below its picture; no text or CTA overlays on pictures.
- Cards open the corresponding community guide in the existing client-side frontend.
- Removed the duplicated lower community-card grid so the page presents one clear set of neighborhood choices.
