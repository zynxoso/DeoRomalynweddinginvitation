# Image sources

The couple's photographs were supplied by the owner. Sources are preserved in `WEDDING PICTURES` and `public/PICTURES TO BE REPLACED`; both folders are excluded from Git and deployment. The production site uses seventeen WebP photographs: fifteen gallery entries, one homepage background and one closing photograph. A social preview uses the updated seated portrait. WebP exports retain the supplied dimensions at quality 96; responsive page versions use quality 95. The viewer loads the native-resolution file directly. Changed photos have new URLs to avoid cached older exports. No additional facial retouching or generation was performed.

The October 26 selection follows every labeled replacement:

| Site placement/caption | Supplied source |
| --- | --- |
| Homepage background | HOME PAGE BG.jpg |
| Hand in hand. | Hand in hand..CR2 |
| The little moments. | The little moments.jpg |
| Right here with you. | Right here with you.jpg |
| Our kind of afternoon. | Our kind of afternoon.jpg |
| A moment for us. | A moment for us.jpg |
| It was always you. | It was always you.jpg |
| Close to you. | CLOSE TO YOU.jpg |
| My favorite person. | MY FAVORITE PERSON.jpg |
| With all my love. | WITH ALL MY LOVE.jpg |

The CR2's first TIFF directory contains a full-size 6,000 × 4,000 camera JPEG. The preparation script validates and extracts that embedded image; it does not attempt RAW sensor development or use the small thumbnail. `IMG_3747.CR2` duplicates the labeled file and is not added twice.

Three additional gallery poses were selected: `MEITU_20261020_135731873.jpg` (bamboo portrait), `MEITU_20261025_073307475.jpg` (white outfits with bouquet), and `MEITU_20261025_084642306.jpg` (seated beneath the pines). The veil and closing images also use the matching supplied versions, `MEITU_20261025_073432262.jpg` and `MEITU_20261025_085532158.jpg`. The ring detail and pink-flower garden portrait retain their previous sources. All forty replacement-folder files were reviewed; contact sheets are saved in `.review`.

Dress-code colors were sampled from the six flat swatch areas of the owner's latest reference: blush pink `#F8CECF`, soft peach `#F7D9BF`, butter yellow `#FDEDA2`, lavender `#DBCEE8`, sky blue `#BCDFF6`, and mint cream `#CEDDBE`.

The watercolor accent was created with the built-in imagegen tool and saved to `public/decorations/botanical.webp`. It is decorative artwork, not a photograph of either wedding venue.

Final generation prompt:

> Create a refined botanical watercolor illustration for a luxury pastel garden wedding invitation website. Portrait 2:3 composition. A single airy asymmetrical flowering branch rising diagonally from lower left to upper right, delicate dusty blush wild roses, tiny ivory blossoms, soft sage eucalyptus leaves and fine olive stems. Hand painted fine art botanical stationery, subtle paper pigment, restrained and natural, detailed small leaves with generous negative space. Entire branch fully visible with margin around all sides. Isolated on solid warm ivory #FFF9F2 background, no text, no border, no lettering, no shadows, no mockup. This will be a decorative botanical accent alongside real couple photography.

The site blends the original ivory illustration into its background with CSS. A later extraction attempt did not produce a true alpha channel and was not used in the project.

Fonts: Cormorant Garamond and Manrope, distributed by their respective Fontsource packages with their included licenses. Icons: Lucide React.
