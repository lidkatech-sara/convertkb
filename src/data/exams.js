// Exam, ID and platform photo pages. Limits are commonly published ranges; every page tells readers to confirm against their own notification.
const CHECK = 'Portals and notifications change between recruitment cycles. Treat these numbers as the usual starting point and always confirm them against the instructions on your own application form.';
export const EXAMS = [
  {
    slug: 'passport-photo-size', nav: 'Tools', h1: 'Passport Photo Size Resizer', title: 'Passport Photo Size – Resize to 35×45 mm, 2×2 in | ConvertKB',
    desc: 'Resize a photo to passport size: 35×45 mm, 2×2 inch or 50×70 mm. Crop to the correct ratio, set DPI and reach the KB limit privately in your browser.',
    lead: 'Crop and resize a portrait to the common passport sizes, then fit it to the upload limit without sending the picture anywhere.',
    cfg: { mode: 'photo', targetKb: 250, format: 'jpeg', w: 413, h: 531, dpi: 300, presets: [
      { label: '35×45 mm · 413×531 px', w: 413, h: 531, maxKb: 250, dpi: 300 }, { label: '2×2 in · 600×600 px', w: 600, h: 600, maxKb: 240, dpi: 300 },
      { label: '50×70 mm · 591×827 px', w: 591, h: 827, maxKb: 400, dpi: 300 }] },
    specHead: ['Standard', 'Size', 'Pixels at 300 DPI', 'Used by'],
    specRows: [['ICAO / Schengen / UK / Australia', '35 × 45 mm', '413 × 531', 'Most passports and national ID cards'], ['United States', '2 × 2 in (51 × 51 mm)', '600 × 600', 'US passport and visa'], ['Canada', '50 × 70 mm', '591 × 827', 'Canadian passport'], ['China', '33 × 48 mm', '390 × 567', 'Chinese passport and visa']],
    steps: ['Upload a front-facing photo with a plain light background.', 'Pick the preset that matches your country. The crop box locks to the right proportions.', 'Move the crop so the head fills about 70–80% of the height, eyes level.', 'Press Prepare photo and download the JPG.'],
    mistakes: ['Cropping too wide so the head looks small.', 'Using a photo with shadows across the face or a patterned background.', 'Editing with beauty filters; many offices reject retouched faces.', 'Forgetting that some forms want pixels and others want millimetres; the presets give both.'],
    faq: [['Which passport photo size should I use?', 'Use the size in your country’s passport instructions. 35 × 45 mm is the international standard; the US uses 2 × 2 inches.'], ['What DPI is needed?', 'Online forms usually judge pixels; for printing choose 300 DPI, which the presets set for you.'], ['Can I print the result?', 'Yes. At 300 DPI the 35 × 45 mm preset prints at exactly the right physical size.']],
    official: null, related: ['us-visa-photo', 'compress-image-to-200kb', 'pan-card-photo']
  },
  {
    slug: 'pan-card-photo', nav: 'Tools', h1: 'PAN Card Photo Resizer', title: 'PAN Card Photo Size Online – Resize Under 50 KB | ConvertKB',
    desc: 'Resize and compress a PAN card photo to the commonly requested size: 213×213 px or 2.5×3.5 cm, under 50 KB, JPEG with DPI set. Free and private.',
    lead: 'Make your PAN application photo fit the upload requirements: correct pixel size, DPI and a file under 50 KB.',
    cfg: { mode: 'photo', targetKb: 50, format: 'jpeg', w: 213, h: 213, dpi: 300, presets: [
      { label: '213×213 px · ≤50 KB · 300 DPI', w: 213, h: 213, maxKb: 50, dpi: 300 }, { label: '2.5×3.5 cm · ≤50 KB · 200 DPI', w: 197, h: 276, maxKb: 50, dpi: 200 }] },
    specHead: ['Item', 'Commonly published requirement'],
    specRows: [['File type', 'JPEG (.jpg)'], ['Maximum size', 'About 50 KB'], ['Pixel size (one style)', '213 × 213 px at 300 DPI'], ['Physical size (another style)', '2.5 × 3.5 cm at 200 DPI'], ['Background', 'Plain white or light, face clearly visible']],
    steps: ['Upload a recent, front-facing photo.', 'Choose the preset that matches the instruction on your PAN form.', 'Adjust the crop so the face is centred and the shoulders are visible.', 'Press Prepare photo, check the size shown and download.'],
    mistakes: ['Using the signature settings for the photo or the other way round.', 'Uploading a photo with a dark or coloured background.', 'Compressing a screenshot instead of the original photo.', 'Ignoring the DPI field when the form asks for it.'],
    faq: [['What size should a PAN card photo be?', 'The commonly published limit is 50 KB in JPEG, with either 213 × 213 pixels or 2.5 × 3.5 cm depending on the application route. Check your form.'], ['Do I need 200 or 300 DPI?', 'Use the value written in your instructions. The DPI menu writes it into the file header.'], ['Is my photo uploaded here?', 'No. Processing happens inside your browser.']],
    official: { label: 'Protean (NSDL) PAN services', url: 'https://www.protean-tinpan.com' }, related: ['pan-card-signature', 'compress-image-to-50kb', 'passport-photo-size']
  },
  {
    slug: 'pan-card-signature', nav: 'Tools', h1: 'PAN Card Signature Resizer', title: 'PAN Card Signature Size Online – Resize to 400×200 px | ConvertKB',
    desc: 'Resize and compress a signature for a PAN application: 400×200 px or 4.5×2 cm, up to 50 KB, JPEG. Whiten the paper and fix DPI in your browser.',
    lead: 'Turn a photo of your signature into a clean, correctly sized JPEG for a PAN application.',
    cfg: { mode: 'photo', targetKb: 50, format: 'jpeg', w: 400, h: 200, dpi: 200, presets: [
      { label: '400×200 px · ≤50 KB · 200 DPI', w: 400, h: 200, maxKb: 50, dpi: 200 }, { label: '4.5×2 cm · ≤50 KB · 200 DPI', w: 354, h: 157, maxKb: 50, dpi: 200 }] },
    specHead: ['Item', 'Commonly published requirement'],
    specRows: [['File type', 'JPEG (.jpg)'], ['Maximum size', 'About 50 KB'], ['Pixel size (one style)', '400 × 200 px at 200 DPI'], ['Physical size (another style)', '4.5 × 2 cm at 200 DPI'], ['Content', 'Signature inside the box, within your own boundary']],
    steps: ['Sign inside a box on plain white paper with a dark pen.', 'Photograph it flat in daylight and upload it.', 'Crop tightly around the signature with the 2:1 preset.', 'Open Enhance and choose Document whiten for crisp ink on white.', 'Press Prepare photo and download.'],
    mistakes: ['Signing outside the box or with a very light pen.', 'Leaving large margins, which shrinks the visible signature.', 'Uploading a signature in colour with paper shadows.', 'Using a different signature from the one on your other documents.'],
    faq: [['What is the PAN signature size?', 'Commonly 4.5 × 2 cm or about 400 × 200 pixels at 200 DPI, up to 50 KB in JPEG. Confirm on your form.'], ['Can I use a digital signature?', 'Use a scan or photo of your handwritten signature unless the form clearly says otherwise.'], ['Why whiten the paper?', 'A pure white background keeps the file small and the ink sharp.']],
    official: { label: 'Protean (NSDL) PAN services', url: 'https://www.protean-tinpan.com' }, related: ['pan-card-photo', 'signature-resize', 'compress-image-to-50kb']
  },
  {
    slug: 'youtube-thumbnail-size', nav: 'Tools', h1: 'YouTube Thumbnail Size Resizer', title: 'YouTube Thumbnail Size – 1280×720 Under 2 MB | ConvertKB',
    desc: 'Resize any image to the YouTube thumbnail size of 1280×720 pixels (16:9) and keep it under the 2 MB limit. JPG or PNG, processed privately in your browser.',
    lead: 'Crop to 16:9, scale to 1280 × 720 and keep the file under YouTube’s 2 MB limit.',
    cfg: { mode: 'photo', targetKb: 1900, format: 'jpeg', w: 1280, h: 720, presets: [{ label: '1280×720 · 16:9 · <2 MB', w: 1280, h: 720, maxKb: 1900 }, { label: '1920×1080 · <2 MB', w: 1920, h: 1080, maxKb: 1900 }] },
    specHead: ['Setting', 'Recommended'],
    specRows: [['Resolution', '1280 × 720 pixels (minimum width 640)'], ['Aspect ratio', '16:9'], ['Maximum file size', '2 MB'], ['Formats', 'JPG, PNG or GIF'], ['Safe zone', 'Keep text away from the bottom-right corner where the duration label sits']],
    steps: ['Upload your design or a frame from the video.', 'Keep the 16:9 crop and place the subject on the left or centre.', 'Press Prepare photo; the tool aims safely under 2 MB.', 'Download and upload in YouTube Studio.'],
    mistakes: ['Using a vertical image and letting YouTube crop it.', 'Placing text where the timestamp covers it.', 'Exporting a PNG that exceeds 2 MB.', 'Over-compressing so that small text becomes blurry.'],
    faq: [['What is the YouTube thumbnail size?', '1280 × 720 pixels, 16:9, up to 2 MB. Larger 16:9 images such as 1920 × 1080 also work.'], ['PNG or JPG?', 'JPG is smaller; use PNG for sharp graphics if it stays under 2 MB.'], ['Can I get under 2 MB without blur?', 'Yes. Quality is raised as high as the 2 MB limit allows.']],
    official: { label: 'YouTube Help', url: 'https://support.google.com/youtube' }, related: ['instagram-photo-size', 'compress-image-to-1mb', 'resize-image']
  },
  {
    slug: 'instagram-photo-size', nav: 'Tools', h1: 'Instagram Photo Size Resizer', title: 'Instagram Photo Size – Resize for Feed, Story, Square | ConvertKB',
    desc: 'Resize photos for Instagram: 1080×1080 square, 1080×1350 portrait (4:5), 1080×566 landscape and 1080×1920 stories. Free, private and fast.',
    lead: 'Pick a post format, crop to the correct ratio and export at 1080 pixels wide.',
    cfg: { mode: 'photo', format: 'jpeg', targetKb: 0, w: 1080, h: 1350, presets: [
      { label: 'Portrait 4:5 · 1080×1350', w: 1080, h: 1350 }, { label: 'Square 1:1 · 1080×1080', w: 1080, h: 1080 }, { label: 'Landscape · 1080×566', w: 1080, h: 566 }, { label: 'Story / Reel · 1080×1920', w: 1080, h: 1920 }] },
    specHead: ['Format', 'Pixels', 'Ratio'],
    specRows: [['Feed portrait', '1080 × 1350', '4:5'], ['Feed square', '1080 × 1080', '1:1'], ['Feed landscape', '1080 × 566', '1.91:1'], ['Story / Reel cover', '1080 × 1920', '9:16']],
    steps: ['Upload your image.', 'Choose Portrait, Square, Landscape or Story.', 'Drag the crop to frame the subject.', 'Press Prepare photo and download a high-quality JPG.'],
    mistakes: ['Posting a wide photo that Instagram crops awkwardly.', 'Uploading tiny images that look soft when stretched.', 'Placing text too near the edges of a story.', 'Saving as PNG, which is larger with no benefit for photos.'],
    faq: [['What is the best size for Instagram photos?', '1080 pixels wide. Portrait 1080 × 1350 uses the most screen space in the feed.'], ['Does Instagram compress my photos?', 'Yes, so upload sharp 1080-wide images to keep detail after its own processing.'], ['Will this reduce quality?', 'With no size limit set the tool keeps quality high (85% by default).']],
    official: { label: 'Instagram Help Center', url: 'https://help.instagram.com' }, related: ['youtube-thumbnail-size', 'resize-image', 'compress-image']
  },
  {
    slug: 'us-visa-photo', nav: 'Tools', h1: 'US Visa Photo Resizer', title: 'US Visa Photo Size Online – 600×600 px Under 240 KB | ConvertKB',
    desc: 'Resize and compress a photo for the US visa (DS-160): square 600×600 to 1200×1200 pixels, JPEG, under 240 KB. Private, in-browser, no signup.',
    lead: 'Prepare a square, correctly sized JPEG for the DS-160 online photo upload.',
    cfg: { mode: 'photo', targetKb: 240, format: 'jpeg', w: 600, h: 600, dpi: 300, presets: [{ label: '600×600 px · ≤240 KB', w: 600, h: 600, maxKb: 240, dpi: 300 }, { label: '1000×1000 px · ≤240 KB', w: 1000, h: 1000, maxKb: 240, dpi: 300 }] },
    specHead: ['Requirement', 'US Department of State guidance'],
    specRows: [['Format', 'JPEG'], ['Dimensions', 'Square, 600 × 600 to 1200 × 1200 pixels'], ['File size', 'Up to 240 KB'], ['Colour', 'Colour photo, not greyscale'], ['Background', 'Plain white or off-white'], ['Taken', 'Within the last six months, no glasses or filters']],
    steps: ['Upload a front-facing colour photo with a plain background.', 'Keep the 1:1 crop with the head about 50–69% of the image height.', 'Press Prepare photo; the tool keeps the file under 240 KB.', 'Upload the JPG in the DS-160 photo step and check the photo-tool result.'],
    mistakes: ['Wearing glasses or a head covering when not allowed for religious reasons.', 'Shadows on the face or background.', 'A photo that is too small or too tightly cropped.', 'Using a scan of an old printed photo.'],
    faq: [['What is the size for a US visa photo?', 'A square JPEG between 600 × 600 and 1200 × 1200 pixels, up to 240 KB.'], ['Do I need exactly 2 × 2 inches?', 'Printed photos are 2 × 2 inches; for the online upload, the pixel size and file size matter.'], ['Is the tool safe for passport photos?', 'Nothing leaves your device, so it is safe for ID photos.']],
    official: { label: 'US Department of State – Photo requirements', url: 'https://travel.state.gov' }, related: ['passport-photo-size', 'compress-image-to-200kb', 'compress-jpg-to-200kb']
  },
  {
    slug: 'upsc-photo-signature', nav: 'Exams', h1: 'UPSC Photo & Signature Resizer', title: 'UPSC Photo and Signature Size – Resize Under 300 KB | ConvertKB',
    desc: 'Resize your UPSC photo and signature to the commonly requested JPEG limits (20–300 KB). Crop, whiten and fit the size range privately in your browser.',
    lead: 'Prepare a clear photograph and signature for the UPSC online application, with a minimum-size padding option for the 20 KB lower limit.',
    cfg: { mode: 'photo', targetKb: 300, minKb: 20, format: 'jpeg', w: 350, h: 350, dpi: 300, presets: [
      { label: 'Photo · 350×350 px · 20–300 KB', w: 350, h: 350, minKb: 20, maxKb: 300, dpi: 300 }, { label: 'Signature · 2:1 · 20–300 KB', w: 400, h: 200, minKb: 20, maxKb: 300, dpi: 300 }] },
    specHead: ['Item', 'Typically requested'],
    specRows: [['File type', 'JPEG (.jpg)'], ['Photograph size', 'About 20 KB to 300 KB, around 350 × 350 pixels or more'], ['Signature size', 'About 20 KB to 300 KB'], ['Photo style', 'Recent colour photo, plain light background, face clearly visible'], ['Signature style', 'Black or blue ink on white paper']],
    steps: ['Upload your photograph and pick the Photo preset.', 'Adjust the crop and press Prepare photo.', 'Change image, upload the signature and choose the Signature preset.', 'Keep padding ticked so files below 20 KB are lifted to the minimum.'],
    mistakes: ['Uploading files below the minimum size.', 'Using a dark-background or group photo.', 'Signing in pencil or with a thin light pen.', 'Mixing up the photo and signature slots.'],
    faq: [['What is the UPSC photo size?', 'Notifications have asked for JPEG files of roughly 20 to 300 KB. Read the instructions of the notice you are applying under, as dimensions can change.'], ['What if my file is below 20 KB?', 'Keep the padding option on; the tool grows a JPG to the minimum without changing its look.'], ['Can I use this for NDA or CDS?', 'These exams use the same UPSC portal, but check the notice for each one.']],
    official: { label: 'UPSC official website', url: 'https://upsc.gov.in' }, related: ['compress-image-to-200kb', 'signature-resize', 'defence-photo-and-signature']
  },
  {
    slug: 'ssc-photo-and-signature', nav: 'Exams', h1: 'SSC Photo & Signature Resizer', title: 'SSC Photo and Signature Size – 20–50 KB and 10–20 KB | ConvertKB',
    desc: 'Resize your SSC CGL, CHSL or MTS photo to 100×120 px (20–50 KB) and signature to 140×60 px (10–20 KB). Min-size padding included. Free and private.',
    lead: 'Hit the SSC photo and signature rules in one go: pixel size, size window and a clean white background.',
    cfg: { mode: 'photo', targetKb: 50, minKb: 20, format: 'jpeg', w: 100, h: 120, dpi: 200, presets: [
      { label: 'Photo · 100×120 px · 20–50 KB', w: 100, h: 120, minKb: 20, maxKb: 50, dpi: 200 }, { label: 'Signature · 140×60 px · 10–20 KB', w: 140, h: 60, minKb: 10, maxKb: 20, dpi: 200 }] },
    specHead: ['Item', 'Photograph', 'Signature'],
    specRows: [['Format', 'JPEG', 'JPEG'], ['Size range', '20 – 50 KB', '10 – 20 KB'], ['Pixels (W × H)', '100 × 120', '140 × 60'], ['Physical size', '3.5 × 4.5 cm', '4.0 × 2.0 cm'], ['Notes', 'Plain light background, recent, face visible', 'Dark ink on white paper']],
    steps: ['Upload your photo and select the Photo preset.', 'Press Prepare photo; the file lands between 20 and 50 KB.', 'Change image, upload the signature and select the Signature preset.', 'Download both and upload them in the matching slots.'],
    mistakes: ['Uploading a photo larger than 50 KB.', 'Stretching the signature to fit because the crop ratio was wrong.', 'Using a photo with the date or text that was not requested.', 'Ignoring the minimum of 20 KB for photographs.'],
    faq: [['What size is the SSC photo?', 'Commonly 100 × 120 pixels (3.5 × 4.5 cm) between 20 and 50 KB in JPEG; the signature is 140 × 60 pixels (4 × 2 cm) between 10 and 20 KB.'], ['Does this work for CGL, CHSL and MTS?', 'These share a common upload format in most cycles, but always read the current notice.'], ['Why is my photo below 20 KB?', 'Small, simple images compress very well; keep padding ticked to lift it to the minimum.']],
    official: { label: 'Staff Selection Commission', url: 'https://ssc.gov.in' }, related: ['ibps-photo-and-signature', 'compress-image-to-20kb', 'signature-resize']
  },
  {
    slug: 'gate-photo-and-signature', nav: 'Exams', h1: 'GATE Photo & Signature Resizer', title: 'GATE Photo and Signature Size – Resize Under 200 KB | ConvertKB',
    desc: 'Resize your GATE application photo and signature to the JPEG size ranges used on the GOAPS portal. Crop, set the KB limit and download, all in your browser.',
    lead: 'Get a clean photo and signature ready for the GATE online application portal (GOAPS) without uploading them to a third party.',
    cfg: { mode: 'photo', targetKb: 200, minKb: 10, format: 'jpeg', w: 480, h: 640, dpi: 300, presets: [
      { label: 'Photo · 3:4 · 10–200 KB', w: 480, h: 640, minKb: 10, maxKb: 200, dpi: 300 }, { label: 'Signature · 2:1 · 10–100 KB', w: 400, h: 200, minKb: 10, maxKb: 100, dpi: 300 }] },
    specHead: ['Item', 'Typical GOAPS guidance'],
    specRows: [['File type', 'JPG / JPEG'], ['Photograph', 'Passport-style colour photo, light background, within a size range of tens to about 200 KB'], ['Signature', 'Black or blue ink on white, smaller size range than the photo'], ['Name and date', 'Some cycles ask for a recent photo; read the instruction page']],
    steps: ['Upload the photograph and choose the Photo preset.', 'Press Prepare photo and check the preview.', 'Switch to the Signature preset for the signature image.', 'Upload both on the GOAPS form and confirm the preview.'],
    mistakes: ['Using an old photo that no longer matches your ID.', 'A signature photographed at an angle.', 'Ignoring the pixel guidance printed on the upload page.', 'Compressing a screenshot of the photo.'],
    faq: [['What are the GATE photo requirements?', 'GOAPS asks for a recent passport-style JPEG with a plain background. Exact sizes are printed on the upload page of each year’s portal.'], ['Is 200 KB the right limit?', 'It is a common upper bound; replace it with the number on your page if different.'], ['Can I resize my GATE signature here?', 'Yes. Use the 2:1 preset and adjust the maximum size.']],
    official: null, related: ['neet-photo-and-signature', 'compress-image-to-200kb', 'signature-resize']
  },
  {
    slug: 'neet-photo-and-signature', nav: 'Exams', h1: 'NEET Photo & Signature Resizer', title: 'NEET Photo and Signature Size – 10–200 KB and 4–30 KB | ConvertKB',
    desc: 'Resize your NEET UG photo (10–200 KB), postcard photo, signature (4–30 KB) and left thumb impression (10–50 KB). Pad to the minimum, in your browser.',
    lead: 'One page for every NTA upload: passport photo, postcard photo, signature and left thumb impression.',
    cfg: { mode: 'photo', targetKb: 200, minKb: 10, format: 'jpeg', w: 413, h: 531, dpi: 300, presets: [
      { label: 'Passport photo · 10–200 KB', w: 413, h: 531, minKb: 10, maxKb: 200, dpi: 300 }, { label: 'Postcard photo · 10–200 KB', w: 600, h: 900, minKb: 10, maxKb: 200, dpi: 150 },
      { label: 'Signature · 4–30 KB', w: 400, h: 200, minKb: 4, maxKb: 30, dpi: 200 }, { label: 'Left thumb · 10–50 KB', w: 300, h: 300, minKb: 10, maxKb: 50, dpi: 200 }] },
    specHead: ['Upload', 'Size window', 'Notes'],
    specRows: [['Passport-size photograph', '10 – 200 KB', 'Recent colour photo, white background'], ['Postcard-size photograph', '10 – 200 KB', 'Larger print-style photo'], ['Signature', '4 – 30 KB', 'Black ink on white paper'], ['Left thumb impression', '10 – 50 KB', 'Clear ink print on white paper']],
    steps: ['Choose the preset for the upload you are preparing.', 'Upload the matching image and adjust the crop.', 'Press Prepare photo and confirm the size shown is inside the window.', 'Repeat for each upload, then submit on the NTA portal.'],
    mistakes: ['Using the passport preset for the postcard photograph.', 'A smudged thumb impression that cannot be read.', 'Blurry signature taken in low light.', 'Uploading files outside the stated KB window.'],
    faq: [['What size is the NEET UG photo?', 'Recent information bulletins have listed 10 to 200 KB for photographs, 4 to 30 KB for the signature and 10 to 50 KB for the thumb impression. Check your bulletin.'], ['What if my photo is under 10 KB?', 'Keep padding on to lift it above the minimum.'], ['Does this work for JEE Main?', 'JEE uses similar NTA rules, but the numbers differ; confirm on its page.']],
    official: { label: 'NTA NEET', url: 'https://neet.nta.nic.in' }, related: ['gate-photo-and-signature', 'compress-image-to-200kb', 'signature-resize']
  },
  {
    slug: 'ibps-photo-and-signature', nav: 'Exams', h1: 'IBPS Photo & Signature Resizer', title: 'IBPS Photo, Signature, Thumb and Declaration Size | ConvertKB',
    desc: 'Resize IBPS PO, Clerk and RRB uploads: photo 200×230 px, signature 140×60 px, left thumb 240×240 px and handwritten declaration 800×400 px. Free tool.',
    lead: 'All four IBPS uploads on one page, each with a preset for its pixel size and KB window.',
    cfg: { mode: 'photo', targetKb: 50, minKb: 20, format: 'jpeg', w: 200, h: 230, dpi: 200, presets: [
      { label: 'Photo · 200×230 · 20–50 KB', w: 200, h: 230, minKb: 20, maxKb: 50, dpi: 200 }, { label: 'Signature · 140×60 · 10–20 KB', w: 140, h: 60, minKb: 10, maxKb: 20, dpi: 200 },
      { label: 'Left thumb · 240×240 · 20–50 KB', w: 240, h: 240, minKb: 20, maxKb: 50, dpi: 200 }, { label: 'Declaration · 800×400 · 50–100 KB', w: 800, h: 400, minKb: 50, maxKb: 100, dpi: 200 }] },
    specHead: ['Upload', 'Pixels (W × H)', 'Size window'],
    specRows: [['Photograph', '200 × 230', '20 – 50 KB'], ['Signature', '140 × 60', '10 – 20 KB'], ['Left thumb impression', '240 × 240', '20 – 50 KB'], ['Handwritten declaration', '800 × 400', '50 – 100 KB']],
    steps: ['Choose the preset for the first upload.', 'Upload the image and crop; the aspect ratio locks to the preset.', 'Press Prepare photo and check the size window.', 'Repeat for the other uploads and submit.'],
    mistakes: ['Writing the declaration in a language the notice does not allow.', 'Signing differently on the declaration and the signature upload.', 'Using the photo preset for the thumb impression.', 'Uploading files that are not JPEG.'],
    faq: [['What are the IBPS upload sizes?', 'IBPS notices commonly ask for a 200 × 230 px photo (20–50 KB), a 140 × 60 px signature (10–20 KB), a 240 × 240 px thumb (20–50 KB) and an 800 × 400 px declaration (50–100 KB).'], ['Does this apply to RRB and Clerk?', 'The format is commonly shared across IBPS exams but verify in the notice you are applying under.'], ['Why does the tool pad files?', 'Many windows have a minimum; padding grows a JPG to it without affecting appearance.']],
    official: { label: 'IBPS', url: 'https://www.ibps.in' }, related: ['ssc-photo-and-signature', 'compress-image-to-20kb', 'signature-resize']
  },
  {
    slug: 'defence-photo-and-signature', nav: 'Exams', h1: 'Defence Exam Photo & Signature Resizer', title: 'Defence Exam Photo & Signature – NDA, CDS, Agniveer | ConvertKB',
    desc: 'Prepare photo and signature uploads for defence recruitment forms such as NDA, CDS and Agniveer: crop, set the KB window and download a clean JPEG.',
    lead: 'Defence recruitment uses several portals, each with its own limits. Start from sensible presets, then adjust to your notice.',
    cfg: { mode: 'photo', targetKb: 50, minKb: 10, format: 'jpeg', w: 240, h: 320, dpi: 200, presets: [
      { label: 'Photo · 3:4 · 10–50 KB', w: 240, h: 320, minKb: 10, maxKb: 50, dpi: 200 }, { label: 'Signature · 2:1 · 10–20 KB', w: 280, h: 140, minKb: 10, maxKb: 20, dpi: 200 }, { label: 'Photo · 20–100 KB', w: 300, h: 400, minKb: 20, maxKb: 100, dpi: 200 }] },
    specHead: ['Recruitment route', 'What to check'],
    specRows: [['NDA / CDS (UPSC)', 'Uses the UPSC portal; see the UPSC page for its size range'], ['Agniveer (Army, Navy, Air Force)', 'Each service portal publishes its own photo and signature sizes'], ['AFCAT and other short-service exams', 'Limits are in the online application instructions']],
    steps: ['Read the upload limits in your notification first.', 'Pick the closest preset and edit the maximum and minimum fields to match.', 'Press Prepare photo and verify size and dimensions.', 'Upload and check the portal preview before final submit.'],
    mistakes: ['Assuming all defence portals share the same limits.', 'Using a casual photo instead of a formal front-facing one.', 'Skipping the preview check on the portal.', 'Not saving the originals for later stages of the process.'],
    faq: [['What is the Agniveer photo size?', 'It varies by service and year; commonly tens of KB. Use your notice’s numbers in the maximum and minimum fields.'], ['Can I use the same file for different portals?', 'Only if the limits match. Re-run the tool for each portal.'], ['Is my photo stored?', 'No. Nothing leaves your browser.']],
    official: { label: 'UPSC (NDA/CDS notices)', url: 'https://upsc.gov.in' }, related: ['upsc-photo-signature', 'ssc-photo-and-signature', 'compress-image-to-50kb']
  },
  {
    slug: 'signature-resize', nav: 'Exams', h1: 'Signature Resizer', title: 'Signature Resizer – Under 10, 20, 50 KB | ConvertKB',
    desc: 'Resize a scanned or photographed signature to exact pixel sizes and KB limits: 140×60, 300×100 or 400×200 px. Whiten paper, crop and download a JPEG.',
    lead: 'A purpose-built signature tool: crop tightly, whiten the paper and fit any size limit from 10 KB to 100 KB.',
    cfg: { mode: 'photo', targetKb: 20, minKb: 0, format: 'jpeg', w: 140, h: 60, dpi: 200, presets: [
      { label: '140×60 px · ≤20 KB', w: 140, h: 60, maxKb: 20, dpi: 200 }, { label: '300×100 px · ≤10 KB', w: 300, h: 100, maxKb: 10, dpi: 200 }, { label: '400×200 px · ≤50 KB', w: 400, h: 200, maxKb: 50, dpi: 200 }, { label: '600×200 px · ≤100 KB', w: 600, h: 200, maxKb: 100, dpi: 200 }] },
    specHead: ['Typical use', 'Pixels', 'Size limit'],
    specRows: [['Bank / SSC-style forms', '140 × 60', '10 – 20 KB'], ['Compact portals', '300 × 100', 'Up to 10 KB'], ['PAN and general forms', '400 × 200', 'Up to 50 KB'], ['Offer letters and agreements', '600 × 200', 'Up to 100 KB']],
    steps: ['Sign on plain white paper with a dark pen.', 'Photograph it flat, in even light, and upload it.', 'Crop tight to the signature and choose a preset.', 'Enable Document whiten under Enhance for clean ink, then press Prepare photo.'],
    mistakes: ['Leaving wide margins around the signature.', 'Photographing at an angle so the signature is skewed.', 'Using a pen that is too light for the compressor to keep.', 'Using different signatures on different forms.'],
    faq: [['How do I make my signature under 20 KB?', 'Crop tightly, whiten the paper and set the maximum to 20 KB. A 140 × 60 pixel signature is usually far below the limit.'], ['Can I get a transparent signature?', 'This tool outputs white-background JPG, which is what most forms require.'], ['Which size is best?', 'The one named on the form. If none is given, 400 × 200 pixels under 50 KB is a safe default.']],
    official: null, related: ['pan-card-signature', 'ssc-photo-and-signature', 'compress-image-to-20kb']
  }
];
export { CHECK };
