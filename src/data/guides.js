export const GUIDES = [
  { slug: 'why-upload-photos-get-rejected', title: 'Why Application Portals Reject Photos and Signatures (and How to Fix Each Case)', desc: 'The seven most common reasons a photo or signature upload fails on exam and job portals, with a quick fix for each.', read: 5,
    sections: [
      { h2: 'The file is a little over the limit', ps: ['The most common cause is a file that is a few hundred bytes over the limit. Portals disagree on whether 1 KB is 1000 or 1024 bytes, so a file that shows 50.2 KB in one system can be 50,200 bytes in another. Aim a little under the stated number rather than exactly on it.'] },
      { h2: 'The pixel size is wrong', ps: ['Many forms fix width and height as well as file size, for example 140 by 60 pixels for a signature. If the dimensions are off by even a few pixels the upload can fail. Set the pixel size first and then fit the file size inside it, which is how the presets on ConvertKB work.'] },
      { h2: 'The extension or format is wrong', ps: ['A file called photo.jpeg can fail a form that lists .jpg, and a WebP image renamed to .jpg is still a WebP inside. Convert the picture properly instead of renaming it, and use the extension in the instructions.'] },
      { h2: 'The file is below the minimum', ps: ['Ranges such as 20 to 50 KB have a lower bound. A tiny, simple image can be smaller than the minimum. Either use a larger source image or pad the JPG with harmless comment data until it reaches the minimum.'] },
      { h2: 'The background or lighting is poor', ps: ['Automated checks look for a plain light background and an evenly lit face. Shadows, patterned walls and dark backgrounds are all common reasons for manual rejection. Stand a metre in front of a plain wall with light coming from the front.'] },
      { h2: 'The signature is faint or oversized', ps: ['A signature should fill most of its box in dark ink on white paper. Pencil, light pens and wide margins all make it look small and faint after compression. Crop tightly and use a document-whiten mode to push the paper to pure white.'] },
      { h2: 'The wrong slot or the wrong version', ps: ['Uploading the signature into the photo slot, or using a photo from an old application, causes avoidable rejections. Name your files clearly, keep the originals, and re-check the preview the portal shows before final submit.'] }
    ] },
  { slug: 'jpeg-vs-png-vs-webp', title: 'JPEG vs PNG vs WebP: Which Image Format Should You Use?', desc: 'A plain-language comparison of the three image formats: size, quality, transparency and where each one is accepted.', read: 5,
    sections: [
      { h2: 'JPEG: the default for photographs', ps: ['JPEG throws away detail the eye is unlikely to miss, which is why photographs shrink so dramatically. It does not support transparency and it cannot be edited repeatedly without extra loss. It is accepted everywhere, which makes it the safe choice for official forms.'] },
      { h2: 'PNG: exact pixels and transparency', ps: ['PNG keeps every pixel exactly and supports transparent backgrounds. That is perfect for logos, icons and screenshots, but it makes photographs several times larger than JPEG. Use PNG when sharp edges or transparency matter more than size.'] },
      { h2: 'WebP: smaller files for the web', ps: ['WebP can do both lossy and lossless compression and supports transparency, typically at a quarter less size than JPEG. Modern browsers all display it, but many older programs and official portals do not accept it.'] },
      { h2: 'A simple rule of thumb', ps: ['Uploading to an official portal: JPEG. Logo or screenshot: PNG. Your own website: WebP, with a JPEG fallback if you support old software. If you are unsure, keep the original and convert to the format named in the instructions.'] }
    ] },
  { slug: 'how-to-scan-a-signature', title: 'How to Photograph and Prepare a Signature for Online Forms', desc: 'A step-by-step method for getting a clean, small signature file with a phone camera and no scanner.', read: 4,
    sections: [
      { h2: 'Prepare the paper and pen', ps: ['Use plain white paper without lines and a dark gel or fine-tip pen. Draw a rectangle that matches the aspect ratio of the upload box, usually 2:1, and sign inside it so the signature fills most of the space.'] },
      { h2: 'Take the photo', ps: ['Place the paper flat on a table near a window, hold the phone directly above it and avoid casting a shadow with your hand. Turn off the flash, which creates glare, and take the picture at the highest resolution.'] },
      { h2: 'Crop, whiten and size', ps: ['Crop closely around the signature, switch on a document-whiten mode so the paper becomes pure white, then set the pixel size and the maximum file size from the form. A clean white background is the biggest single reason a signature fits in 10 to 20 KB.'] },
      { h2: 'Check before uploading', ps: ['Open the result at 100% zoom. The strokes should be dark and continuous with no grey halo. If it looks faint, redo the photo with a darker pen rather than raising the quality limit.'] }
    ] },
  { slug: 'compress-pdf-without-losing-readability', title: 'How to Make a PDF Smaller Without Making It Unreadable', desc: 'Why scanned PDFs are large, what really reduces size and how to judge readability at a given file size.', read: 6,
    sections: [
      { h2: 'Why scanned PDFs are large', ps: ['A scanner or phone app saves every page as a photograph, often at 300 DPI or higher. Four pages can reach several megabytes. A PDF exported from a word processor is mostly text and is small by comparison.'] },
      { h2: 'What actually reduces size', ps: ['Removing metadata saves a few kilobytes. The real savings come from lowering the resolution of the page images, using greyscale for text pages and dropping pages you do not need. Halving the resolution cuts the image data to about a quarter.'] },
      { h2: 'How much resolution do you need?', ps: ['For black-and-white text, 150 DPI is comfortably readable on screen and 100 DPI is the lower limit for body text. Below about 70 DPI small print starts to blur. When a target size forces the resolution under 100 DPI, split the document into two files or ask whether a higher limit is allowed.'] },
      { h2: 'Text-preserving versus rebuilding pages', ps: ['If a PDF already contains real text, a text-preserving pass keeps it selectable and searchable. Scans have no text layer, so they must be rebuilt as lower-resolution images. A good tool tells you which approach it used and what resolution it ended up with.'] }
    ] },
  { slug: 'heic-explained', title: 'HEIC Explained: Why iPhone Photos Will Not Open and How to Convert Them', desc: 'What the HEIC format is, why websites reject it, and three ways to get JPG photos from an iPhone.', read: 4,
    sections: [
      { h2: 'What HEIC is', ps: ['HEIC is the container Apple uses for photos by default. It stores the same picture in about half the space of a JPEG by using a more efficient video-based compression method. The catch is compatibility: Windows needs an extension to open it and most upload forms refuse it.'] },
      { h2: 'Option one: change the camera setting', ps: ['On an iPhone open Settings, then Camera, then Formats, and choose Most Compatible. New photos are saved as JPEG from then on. Existing HEIC photos stay as they are.'] },
      { h2: 'Option two: convert existing photos', ps: ['Use a converter that runs in your browser so the pictures are not uploaded. Add the HEIC files, choose JPG with about 90% quality, and download the results. Batches can be saved as a ZIP.'] },
      { h2: 'Option three: let the share sheet convert', ps: ['When you send a photo from the iPhone Photos app to Mail or Files, the Options screen lets you choose Most Compatible. The recipient gets a JPEG even though your library keeps the original HEIC.'] }
    ] }
];
