// Extra, page-specific content (part C: top-ups for pages that were still short after parts A and B).
const p = (x) => ({ t: 'p', x });
const ul = (items) => ({ t: 'ul', items });
const ol = (items) => ({ t: 'ol', items });
const chips = (slugs, labels) => ({ t: 'chips', slugs, labels });
const S = (h2, ...blocks) => ({ h2, blocks });

export const EXTRAS_C = {
  'webp-to-png': {
    sections: [
      S('WebP to PNG, or WebP to JPG?',
        p('The deciding question is whether the picture has transparent areas. If it does, such as a logo, an icon or a sticker, convert to PNG so the cut-out survives. If it is an ordinary photograph with a solid background, JPG is the better choice because the file is much smaller and every form accepts it.'),
        chips(['webp-to-jpg'], ['WebP to JPG']))
    ],
    faqs: [['Can I convert many WebP files at once?', 'Yes. Add the whole folder, convert, and download a ZIP. For large photographs, convert in smaller groups so the browser does not run out of memory.']]
  },
  'webp-to-jpg': {
    sections: [
      S('Checking the result against a form’s rules',
        p('Once the picture is a JPG, check three things before uploading: the file extension is .jpg, the file size is under the form’s limit, and the pixel dimensions match what the form asks for. WebP pictures from websites are often wide and large, so cropping and resizing are usually the next step after converting.'),
        chips(['resize-image', 'compress-image'], ['Resize image', 'Compress image']))
    ],
    faqs: [['Does the converter change the picture’s dimensions?', 'No. The width and height stay exactly as in the WebP. Use the resize tools afterwards if a form needs a different size.']]
  },
  'jpg-to-png': {
    sections: [
      S('A workflow that keeps quality and file size under control',
        ol([
          'Convert the JPG to PNG once, so that every edit after that is lossless.',
          'Do your cropping, retouching and text overlays on the PNG.',
          'When you are finished, export the final picture back to JPG for sharing or uploading.',
          'Keep the PNG as the master copy, and use the JPG only for delivery.'
        ]))
    ],
    faqs: [['Is it worth converting an already small JPG to PNG?', 'Only if you plan to edit it. For a picture that will simply be shared, converting adds file size and no visible benefit.']]
  },
  'jpg-to-webp': {
    faqs: [['Will WebP images open in all programs?', 'Every current browser and most modern editors open WebP. Older software, some email programs and many official forms do not, so keep the JPG as your master copy.']]
  },
  'heic-to-pdf': {
    sections: [
      S('Turning iPhone photos of paperwork into a clean PDF',
        p('Photographing documents with an iPhone and combining the pictures into one PDF is a quick way to send certificates, bills and forms. The result is tidier when you follow a few habits.'),
        ul([
          'Lay each page flat on a dark surface and photograph it from directly above.',
          'Use daylight, and fill the frame with the page so the text is as large as possible.',
          'Take the pages in the order they will appear so that reordering is not needed.',
          'Check the pages after converting; if one is sideways or blurred, retake only that one and convert again.'
        ]),
        chips(['compress-pdf', 'jpg-to-pdf'], ['Compress PDF', 'JPG to PDF']))
    ],
    faqs: [['How big will the PDF be?', 'It depends on how many photos you add and how detailed they are. Several iPhone photos can reach many MB, so run the result through Compress PDF if the upload has a limit.']]
  },
  'photo-tools': {
    sections: [
      S('Choosing between a specific page and a general tool',
        p('Use a specific page, such as the PAN or SSC page, when your form matches it. Its presets set the pixel size, DPI and size window for you, and the checklist on the page covers the mistakes people make with that form. Use the general Resize Image and Compress Image tools when the form states its own numbers that none of the presets match.'),
        chips(['resize-image', 'compress-image', 'signature-resize'], ['Resize image', 'Compress image', 'Signature resizer'])),
      S('Keeping your prepared files organised',
        ul([
          'Make one folder per application and save the photograph, signature and any thumb impression in it.',
          'Name files clearly, for example “name-photo.jpg” and “name-signature.jpg”, so you do not upload them in the wrong slot.',
          'Keep the originals untouched in a separate folder; prepare copies from them.',
          'Re-use the prepared files only when the next form’s limits match exactly.'
        ]))
    ],
    faqs: [['Can I prepare photos for several exams at once?', 'Yes, but prepare each with its own page, since size windows and shapes differ even when the exams look alike.']]
  }
};
