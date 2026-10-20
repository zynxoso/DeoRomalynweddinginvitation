# Image sources

The couple's photographs were supplied by the owner. Originals are preserved in `WEDDING PICTURES`. The production site uses fourteen optimized derivatives, plus a social preview assembled from the seated portrait and text. The homepage background is `IMG_3929.jpg`, supplied from the owner's LightCraft Exports folder; its SHA-256 matches the existing project original. All fourteen photographs retain their native pixel dimensions (up to 6,000 pixels) and use WebP quality 96. The hero retains its full 5,992 × 3,995 pixels. Next.js serves responsive page versions at quality 95, with crop-aware sizing for high-density displays. The gallery viewer serves the native-resolution file directly and provides a full-resolution link. New asset URLs prevent older, smaller exports from being reused from browser caches. The visible detail is limited by the original photograph, and no generative changes were made to the couple's faces.

The watercolor accent was created with the built-in imagegen tool and saved to `public/decorations/botanical.webp`. It is decorative artwork, not a photograph of either wedding venue.

Final generation prompt:

> Create a refined botanical watercolor illustration for a luxury pastel garden wedding invitation website. Portrait 2:3 composition. A single airy asymmetrical flowering branch rising diagonally from lower left to upper right, delicate dusty blush wild roses, tiny ivory blossoms, soft sage eucalyptus leaves and fine olive stems. Hand painted fine art botanical stationery, subtle paper pigment, restrained and natural, detailed small leaves with generous negative space. Entire branch fully visible with margin around all sides. Isolated on solid warm ivory #FFF9F2 background, no text, no border, no lettering, no shadows, no mockup. This will be a decorative botanical accent alongside real couple photography.

The site blends the original ivory illustration into its background with CSS. A later extraction attempt did not produce a true alpha channel and was not used in the project.

Fonts: Cormorant Garamond and Manrope, distributed by their respective Fontsource packages with their included licenses. Icons: Lucide React.
