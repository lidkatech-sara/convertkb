// Extra, page-specific content (part B: exam, ID and platform photo pages).
// Numbers are only repeated from the spec tables on the same page; every page still tells readers to confirm with their own notification.
const p = (x) => ({ t: 'p', x });
const ul = (items) => ({ t: 'ul', items });
const ol = (items) => ({ t: 'ol', items });
const note = (x) => ({ t: 'note', x });
const chips = (slugs, labels) => ({ t: 'chips', slugs, labels });
const S = (h2, ...blocks) => ({ h2, blocks });

export const EXTRAS_B = {
  'passport-photo-size': {
    sections: [
      S('Taking a photo that is easy to crop',
        p('The best passport photo is decided before you open any tool. A sharp, evenly lit picture crops cleanly to every size in the table, while a dim or tilted one cannot be rescued by resizing.'),
        ul([
          'Stand about an arm’s length from a plain light wall, facing the camera, with the camera at eye level.',
          'Use soft daylight from a window in front of you so there are no shadows under the nose or behind the head.',
          'Keep a neutral expression, mouth closed and eyes open, with both ears and the top of the head visible.',
          'Shoot in portrait orientation and leave space around the head; you can crop in, but you cannot crop out.'
        ])),
      S('How much of the frame the head should fill',
        p('Most specifications ask for the head, from chin to the top of the hair, to fill roughly 70 to 80 percent of the photo height, with the eyes about two thirds of the way up. The crop box in the tool is locked to the preset’s proportions, so move it until the face sits in that range rather than stretching the picture.')),
      S('Final check before you upload or print',
        ol([
          'Confirm the preset matches your country’s size, not just the one you used last time.',
          'Zoom to 100% and check that the eyes, hairline and ears are sharp.',
          'Look at the file size shown; if the form states a limit, make sure you are under it.',
          'For printing, use the 300 DPI presets and choose “actual size” in the print dialog so the picture is not scaled again.'
        ]),
        chips(['us-visa-photo', 'pan-card-photo'], ['US visa photo', 'PAN card photo']))
    ],
    faqs: [
      ['Can I wear glasses or a head covering?', 'Rules differ by country and by document. Many authorities ask for no glasses and allow a head covering only for religious or medical reasons with the face fully visible. Read the issuing office’s page before you shoot.'],
      ['Do I need a white background?', 'Most offices want a plain light background. If yours has patterns or shadows, retake the photo against a plain wall instead of editing it, since retouching can cause a rejection.']
    ]
  },

  'pan-card-photo': {
    sections: [
      S('A photo that passes the first check',
        p('PAN photographs are checked at upload and again when your application is processed, so a clear picture matters more than a perfect size. Use a recent, front-facing photo, taken against a plain light background, with nothing covering the face.'),
        ul([
          'Photograph yourself in daylight with the camera at eye level.',
          'Keep the head centred, shoulders visible and the background plain and light.',
          'Take the photo at full camera resolution so the face is still sharp when it is reduced to a small size.'
        ])),
      S('Pixels, centimetres and DPI together',
        p('The two presets describe the same job in different units. The pixel preset sets the exact dimensions in pixels, while the centimetre preset sets a physical size at 200 DPI. Choose the one your application route names, and do not mix them: a 213 × 213 pixel photo is a square, and a 2.5 × 3.5 cm photo is a rectangle taller than it is wide.')),
      S('Check before you press submit',
        ol([
          'The file ends in .jpg and is under the size limit shown in the table above.',
          'The face is clearly visible in the preview and is not stretched.',
          'You used the photo preset for the photograph and the signature page for the signature.',
          'You kept the original photo in case you need to apply again.'
        ]),
        chips(['pan-card-signature', 'compress-image-to-50kb'], ['PAN signature', 'Compress to 50 KB']))
    ],
    faqs: [
      ['Can I upload a selfie?', 'A selfie works if it is a clear, front-facing photo on a plain background with good light. Avoid filters, strong wide-angle distortion and a very close camera.'],
      ['What if my photo is rejected after upload?', 'Check the exact reason shown by the portal, then retake the photo or prepare it again with the right preset. Size, background and a blurred face are the most common causes.']
    ]
  },

  'pan-card-signature': {
    sections: [
      S('Signing so the scan looks clean',
        p('A signature that reads well at 400 × 200 pixels starts on the paper. The tool can whiten the page and sharpen the ink, but it cannot invent strokes that were never dark.'),
        ul([
          'Use a black or dark blue ball pen or gel pen, not a pencil or a thin light ink.',
          'Sign on plain white paper, inside a rectangle drawn in the 2:1 shape of the target size.',
          'Keep the signature to the middle of the box so the crop does not clip loops or tails.',
          'Photograph it flat in even daylight, directly from above.'
        ])),
      S('Why a 2:1 crop and a whitened background',
        p('Both presets for this page are twice as wide as they are tall. Cropping to that shape before compressing means your signature fills the frame and is large enough to read at a small file size. Whitening the paper removes grey shadow and keeps the file near the lower end of the size limit.')),
      S('Consistency with your other documents',
        p('Your PAN signature should look like the signature you use on your bank forms and identity proofs. If it does not, the application can be questioned later. Take your time, sign the way you normally do, and keep the original scan for future forms.'),
        chips(['signature-resize', 'pan-card-photo'], ['Signature resizer', 'PAN card photo']))
    ],
    faqs: [
      ['Should the signature touch the edges of the box?', 'No. Leave a small margin all round. A signature that touches or is cut by the edge looks cropped and can be rejected.'],
      ['Is a typed or stylus-drawn signature acceptable?', 'Use your own handwritten signature on paper unless the form clearly says a digital one is allowed.']
    ]
  },

  'youtube-thumbnail-size': {
    sections: [
      S('Designing for the safe zone',
        p('A thumbnail is judged in about a second, often at the size of a postage stamp. Design for the smallest size it will appear at, then check how it looks at full size.'),
        ul([
          'Keep text short, large and high contrast. Three to five words read at small sizes; a sentence does not.',
          'Place the subject’s face or the key object on the left or centre, away from the bottom-right corner where the duration label sits.',
          'Leave a margin around the edges, since some surfaces crop a few pixels.',
          'Use a bold, simple background so the subject stands out from it.'
        ])),
      S('Getting under 2 MB without visible blur',
        p('PNG graphics with a lot of detail can easily pass 2 MB, while the same design as a JPG is a fraction of the size. The tool aims just under the limit, keeping quality as high as it can, so you rarely need to lower it yourself. If text looks soft, export your design larger and let the tool scale it down.')),
      S('Before you upload in YouTube Studio',
        ol([
          'Check that the image is landscape and 16:9; a vertical picture will be cropped.',
          'View it at thumbnail size on your phone to confirm the text is readable.',
          'Confirm the size shown is under 2 MB.',
          'After uploading, look at the thumbnail in search and in the suggested list, not only on the video page.'
        ]),
        chips(['instagram-photo-size', 'compress-image-to-1mb'], ['Instagram sizes', 'Compress to 1 MB']))
    ],
    faqs: [
      ['Should I use 1920 × 1080 or 1280 × 720?', 'Both are 16:9 and both work. 1280 × 720 is the usual choice and keeps the file small. 1920 × 1080 holds more detail if the thumbnail has small elements.'],
      ['Why does my thumbnail look washed out?', 'Some editors save in a different colour profile. Export as sRGB, and keep the photograph slightly more saturated than you think it needs.']
    ]
  },

  'instagram-photo-size': {
    sections: [
      S('Choosing between portrait, square and landscape',
        p('The shape you post decides how much of the feed your picture fills. Portrait at 4:5 is the tallest ratio the feed shows in full and takes the most screen, which is why many photographers default to it. Square is a safe choice if the post will also appear in the profile grid. Landscape suits scenery and group shots but takes the least room.'),
        ul([
          'People, food and details: portrait 1080 × 1350.',
          'Mixed carousels, where every slide must share one shape: square 1080 × 1080.',
          'Wide scenery: landscape 1080 × 566.',
          'Stories and Reels: vertical 1080 × 1920, with key content away from the top and bottom edges.'
        ])),
      S('Keeping photos sharp after Instagram’s processing',
        p('Instagram re-compresses every upload, so soft pictures get softer. Start from the sharpest original you have, export at 1080 pixels wide and avoid uploading a picture that was already compressed several times. Skip filters that add noise, since noise makes the second compression more visible.')),
      S('Quick checklist before you post',
        ol([
          'Pick the format first, then crop; do not crop and then try to fit.',
          'Check the subject sits inside the safe area for stories.',
          'Save as JPG at the default quality. PNG gives no benefit for photographs.',
          'Look at the preview on your phone before posting.'
        ]),
        chips(['youtube-thumbnail-size', 'resize-image'], ['YouTube thumbnails', 'Resize image']))
    ],
    faqs: [
      ['Why does my photo look cropped in the grid?', 'The profile grid shows a centre crop of every post. Keep the important part of a portrait photo in the middle of the frame.'],
      ['Does a higher resolution help?', 'Not much. Instagram scales feed images to about 1080 pixels wide, so larger files only make the upload slower.']
    ]
  },

  'us-visa-photo': {
    sections: [
      S('Taking a photo the checker will accept',
        p('The online photo tool for visa applications is strict about the face and the background, so the best preparation is a clean original. A neighbour with a phone and a plain wall will do.'),
        ul([
          'Face the camera directly with a neutral expression and both eyes open and visible.',
          'Use even light with no shadows on the face or on the wall behind you.',
          'Keep the background plain white or off-white, with no patterns, doors or furniture showing.',
          'Do not use filters, beauty modes or heavy editing.'
        ])),
      S('Why the crop matters more than the size',
        p('A photo can have the right dimensions and file size and still be rejected because the head is too small or too large. The guidance is for the head to fill about half to two thirds of the image height. Use the square crop in the tool and adjust it until the head sits in that range with a little space above the hair.')),
      S('After preparing the file',
        ol([
          'Check that the file is a JPEG, square, and below the size limit shown in the table.',
          'Upload it in the photo step of the application and wait for the automated check.',
          'If it is rejected, read the reason, retake the photo rather than editing it further, and try again.',
          'Keep the photo for the interview in case you are asked for a printed copy.'
        ]),
        chips(['passport-photo-size', 'compress-image-to-200kb'], ['Passport photo', 'Compress to 200 KB']))
    ],
    faqs: [
      ['Should the photo be exactly 2 × 2 inches?', 'That is the printed size. For the online upload, the pixel dimensions and the file size are what the system checks.'],
      ['Can I take the photo on my phone?', 'Yes, as long as it is sharp, evenly lit and meets the rules on background, expression and attire. A tripod or a helper makes it easier than a selfie.']
    ]
  },

  'upsc-photo-signature': {
    sections: [
      S('Photo and signature: two different images',
        p('The photograph and the signature use different presets because they have different shapes. The photograph is close to square and holds a face, while the signature is a wide strip. Preparing each with its own preset avoids stretching either one, which is a common reason for a manual review.')),
      S('Making sure the file is not too small',
        p('Many applicants run into the lower limit rather than the upper one. A small, clean image, especially a signature on white paper, can compress to a few KB and then fail a minimum-size check. Leave the padding option ticked and the tool raises the JPG to the minimum without changing how it looks.')),
      S('Preparation checklist',
        ol([
          'Take a recent, front-facing colour photo on a plain light background.',
          'Sign on white paper with dark ink, in the middle of a drawn rectangle.',
          'Prepare each image with its own preset and confirm the size lands inside the window.',
          'Open both files and check that the face is clear and the signature reads naturally.',
          'Keep copies of both for later stages of the process, where you may be asked for the same images.'
        ]),
        chips(['signature-resize', 'defence-photo-and-signature'], ['Signature resizer', 'Defence exam photos']))
    ],
    faqs: [
      ['Do I need to upload the photo and signature again for every UPSC exam?', 'Each application has its own upload step, so you will prepare them again, but you can reuse the same prepared files if the limits are unchanged.'],
      ['Can I use a photo with a cap or spectacles?', 'Read the instructions in the notice you are applying under. Face visibility is what matters; follow the notice on caps, spectacles and head coverings.']
    ]
  },

  'ssc-photo-and-signature': {
    sections: [
      S('Why the pixel sizes are so small',
        p('The photograph at 100 × 120 pixels and the signature at 140 × 60 pixels are much smaller than a phone photo. That is why preparation matters: you are cropping a large picture down to a few thousand pixels, so only the face and the signature itself should remain in the frame. Anything extra, such as a wide background or blank paper, wastes the few pixels you have.')),
      S('Fitting inside both windows',
        p('The photograph must land between 20 and 50 KB, and the signature between 10 and 20 KB. A clean photo at this size is usually near the lower end of its window, so the padding option raises it if it falls short. A signature on white paper is the case most likely to be too small, so keep padding ticked for that preset as well.')),
      S('Checklist for SSC applications',
        ul([
          'Crop the photograph tight to the head and shoulders.',
          'Crop the signature tight to the ink, leaving only a small margin.',
          'Check both files individually: dimensions, size window and sharpness.',
          'Upload them in the matching slots and check the preview in the portal.',
          'Do not use a photo that has a date or text printed on it unless the notice requires it.'
        ]),
        chips(['ibps-photo-and-signature', 'compress-image-to-20kb'], ['IBPS photos', 'Compress to 20 KB']))
    ],
    faqs: [
      ['Is a coloured background acceptable?', 'The usual guidance is a plain light background. A strong colour or pattern can lead to rejection.'],
      ['I uploaded the right size but the portal rejected it. Why?', 'Check the file extension, the dimensions and whether the portal wants the photo and signature in the right slots. Re-run the tool with the matching preset and try again.']
    ]
  },

  'gate-photo-and-signature': {
    sections: [
      S('What GOAPS checks',
        p('The application portal shows a preview of every upload, so you can see exactly what the examiners will see. If the preview is dark, blurred or cropped, fix it before you pay or submit. A good habit is to prepare both images, upload them, and then compare the preview with your original file.')),
      S('Photograph and signature are separate images',
        p('The photograph uses a 3:4 shape that suits a passport-style picture, and the signature uses a wide 2:1 strip. Use the right preset for each and avoid switching them, as a tall image placed in the signature slot will be cropped by the portal or look squeezed.'),
        ul([
          'Photograph: plain background, face centred, recent photo.',
          'Signature: dark ink on white paper, cropped tight, flat scan or photo.',
          'Both: JPEG, within the size ranges printed on the upload page for your year.'
        ])),
      S('A short checklist',
        ol([
          'Read the instructions on the upload page for the current year.',
          'Prepare both files and keep them in one folder with clear names.',
          'Upload each one and check the portal’s preview.',
          'Save the final copies for any later stage, such as scorecard or admission steps.'
        ]),
        chips(['neet-photo-and-signature', 'signature-resize'], ['NEET photos', 'Signature resizer']))
    ],
    faqs: [
      ['Can I use the same photo for other exams?', 'Often yes, if the size limits match. Re-run the tool with the new limits and compare the result with that exam’s notification.'],
      ['Why is my signature file only a few KB?', 'A black signature on a plain white background is a very simple image and compresses to a tiny file. That is normal; use padding if a minimum is required.']
    ]
  },

  'neet-photo-and-signature': {
    sections: [
      S('Four uploads, four presets',
        p('The page covers the passport-size photograph, the postcard-size photograph, the signature and the left thumb impression. Each has its own pixel shape and its own size window, so using the matching preset for each upload is the quickest way to avoid mistakes.')),
      S('Preparing a clear thumb impression',
        p('The thumb impression is the upload that most often fails because the print is smudged. Press the thumb gently on the ink pad, roll it slightly and print inside a drawn box on white paper. Photograph it flat in daylight. If the ridges are not visible in the preview, repeat the print instead of sharpening the picture.'),
        ul([
          'Use a fresh ink pad and clean the thumb first.',
          'Do not press hard; a heavy press blurs the ridges into a blob.',
          'Print on plain white paper and leave a margin around the box.'
        ])),
      S('Before you submit',
        ol([
          'Confirm each file is within the KB window shown in the table.',
          'Check that you used the passport preset for the passport photograph and the postcard preset for the larger photograph.',
          'Open each file and confirm the face, signature and thumb print are clear.',
          'Upload them in the matching slots and check the previews.'
        ]),
        chips(['gate-photo-and-signature', 'compress-image-to-200kb'], ['GATE photos', 'Compress to 200 KB']))
    ],
    faqs: [
      ['Is the postcard photograph the same as the passport one?', 'No. It is a larger print-style picture with a different shape, so use the Postcard preset rather than resizing the passport photo.'],
      ['Which signature should I use?', 'Use the signature you will use at the exam centre and on your other documents, so that they match.']
    ]
  },

  'ibps-photo-and-signature': {
    sections: [
      S('Four uploads in one sitting',
        p('IBPS applications ask for a photograph, a signature, a left thumb impression and a handwritten declaration. Each has a different shape, so the quickest way to finish is to gather all four originals first, then prepare each with its preset one after another.')),
      S('The handwritten declaration',
        p('The declaration is the one upload people do not expect to prepare. Write the text exactly as the notice gives it, in the language and on the paper the notice allows, then photograph it flat and crop to the 2:1 shape of the preset. Clean handwriting with dark ink compresses well and stays readable at 800 × 400 pixels.'),
        ul([
          'Copy the declaration text word for word from the notice.',
          'Use blue or black ink on plain white paper.',
          'Sign it the way you sign everywhere else.',
          'Keep the writing inside the frame with a little margin.'
        ])),
      S('Final checks',
        ol([
          'Each file is a JPEG within its size window.',
          'The photograph is recent, with a plain background.',
          'The signature on the declaration and on the signature upload look the same.',
          'You can read the thumb impression and the declaration at 100% zoom.'
        ]),
        chips(['ssc-photo-and-signature', 'compress-image-to-20kb'], ['SSC photos', 'Compress to 20 KB']))
    ],
    faqs: [
      ['Can I write the declaration on a computer?', 'The notice asks for a handwritten declaration, so a typed one can be rejected. Follow the instructions exactly.'],
      ['What if the portal says my file is too large?', 'Re-run the tool with the matching preset and make sure the size shown is below the upper limit. If the preview is sharp, upload that file.']
    ]
  },

  'defence-photo-and-signature': {
    sections: [
      S('Why one page cannot give one answer',
        p('Defence recruitment uses several portals, run by different organisations, and each publishes its own photo and signature rules. Rules also change between recruitment cycles. For that reason this page gives sensible starting presets and tells you to type in the numbers from your own notification rather than claiming one size fits all.')),
      S('A reliable way to use the presets',
        ol([
          'Open your notification and write down the file type, size window and any pixel guidance for each upload.',
          'Pick the closest preset and edit the maximum and minimum fields to match your numbers.',
          'Prepare the photograph and the signature separately.',
          'Upload and look at the preview in the portal before you submit.'
        ])),
      S('Photograph and signature standards that apply almost everywhere',
        ul([
          'A formal, front-facing photograph with a plain background, not a casual or group photo.',
          'Visible face and ears, no heavy shadows and no filters.',
          'A signature that is dark, clear and consistent with your other documents.',
          'Originals saved safely, since later stages often ask for the same images again.'
        ]),
        chips(['upsc-photo-signature', 'ssc-photo-and-signature'], ['UPSC photos', 'SSC photos']))
    ],
    faqs: [
      ['Does the NDA or CDS application use the same limits as Agniveer?', 'No. NDA and CDS use the UPSC portal, while Agniveer uses the service portal. Check each notice.'],
      ['Should I keep the prepared images?', 'Yes. Keep them in one folder with clear names, because you may need them for admit cards and document verification.']
    ]
  },

  'signature-resize': {
    sections: [
      S('Choosing the right preset',
        p('The presets cover the sizes forms use most. If your form names a size, pick the preset closest to it, then edit the width, height or maximum size to match exactly. If it names none, the 400 × 200 pixel preset under 50 KB is a safe default: it is large enough to read and small enough for most upload limits.')),
      S('Cleaning up a photographed signature',
        ol([
          'Crop tight so the signature fills the frame.',
          'Turn on Document whiten in Enhance to remove grey paper and shadows.',
          'Check the preview at 100% zoom: the strokes should be dark and continuous.',
          'Press Prepare photo and compare the file size with the limit.'
        ]),
        p('If strokes look broken, retake the photograph in better light, or sign again with a darker pen. It is faster than trying to repair a weak image.')),
      S('What the tool cannot do',
        ul([
          'It cannot make a transparent signature; the output is a JPG on white.',
          'It cannot make a light pencil signature dark; the ink needs to be dark to start with.',
          'It cannot correct a skewed photograph; take the picture straight on.'
        ]),
        chips(['pan-card-signature', 'ssc-photo-and-signature'], ['PAN signature', 'SSC photos']))
    ],
    faqs: [
      ['Can I use the same signature file for several forms?', 'Only if the limits match. Run the tool again for each form and save each version with its own name.'],
      ['How do I sign for a very small file such as 10 KB?', 'Use a bold pen, sign inside a wide box and crop tight. A short, clear signature at 300 × 100 pixels easily fits under 10 KB.']
    ]
  }
};
