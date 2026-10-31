// Extra, page-specific content (part A: hub pages and converters).
// Every paragraph here is written for one page only; nothing is shared between pages.
const p = (x) => ({ t: 'p', x });
const ul = (items) => ({ t: 'ul', items });
const ol = (items) => ({ t: 'ol', items });
const note = (x) => ({ t: 'note', x });
const chips = (slugs, labels) => ({ t: 'chips', slugs, labels });
const S = (h2, ...blocks) => ({ h2, blocks });

export const EXTRAS_A = {
  /* ------------------------------ HUBS ------------------------------ */
  converters: {
    sections: [
      S('Pick a converter by what you have in hand',
        p('Most people arrive here with one file and one problem. Start from the file you already have, and the right converter is usually obvious.'),
        ul([
          'An iPhone photo that a form or Windows PC will not open: HEIC to JPG. Use HEIC to PNG only if you need lossless output for editing.',
          'Several photos that must be sent as one attachment: JPG to PDF or HEIC to PDF, which let you set the page order, page size and margin.',
          'A PDF you need to edit as text: PDF to Word. If the numbers matter more than the wording, use PDF to Excel instead.',
          'A PDF page you want to post or place in a design: PDF to JPG, where you choose the resolution.',
          'A PDF that must be presented: PDF to PowerPoint turns each page into a slide.',
          'A photo of a printed table, receipt or letter: Image to Excel or Image to Word, which read the text with OCR.',
          'A picture saved from a website that will not open in your editor: WebP to JPG or WebP to PNG.'
        ])),
      S('What every converter does the same way',
        p('All converters on this site work on your own device. The file is read by your browser, converted in memory and handed back as a download; there is no upload step and no account. That also means speed depends on your phone or computer, not on a queue at a server, and very large batches can run out of memory on older phones.'),
        p('Where a format has no equivalent in the target, the tool tells you what is dropped. Live Photo motion is not kept when you convert HEIC, animated WebP becomes a single frame, and a PDF turned into Word keeps text but not the original fonts or page art. Reading the short “What to know before you convert” list on each page takes less than a minute and avoids most surprises.')),
      S('Conversion is not compression',
        p('Changing format does not guarantee a smaller file. Moving a photo from JPG to PNG makes it larger, and moving from WebP to JPG can make it larger as well, because WebP is the more efficient format. If a portal rejects your file for size, convert first to the format it names and then use a size page such as Compress Image to 100 KB or Compress PDF to 200 KB.'),
        chips(['compress-image', 'compress-pdf', 'resize-image'], ['Compress image', 'Compress PDF', 'Resize image'])),
      S('If a conversion fails or looks wrong',
        ul([
          'The page stays blank or the progress bar stops: try a smaller batch, or one file at a time. Phones are the usual place this happens.',
          'The result is empty: the PDF may be a scan with no text layer. Turn OCR on for PDF conversions, or use an Image converter on a photo of the page.',
          'The text is garbled: choose the language of the document before reading it, and retake the photo in daylight if it was dark.',
          'A form still rejects the output: the problem is probably the size, the pixel dimensions or the file name, not the format. Use the guides to check each one.'
        ]))
    ],
    faqs: [
      ['Which converter should I use if I am not sure?', 'Decide what you need at the end. Editable text means PDF to Word or Image to Word. A single attachment means JPG to PDF. A picture that opens everywhere means JPG, which HEIC to JPG and WebP to JPG both produce.'],
      ['Is there a limit on how many files I can convert?', 'There is no counter on the site. The practical limit is your device memory, so batches of 20 photos or fewer are comfortable on most phones.'],
      ['Do the converters work offline?', 'The conversion itself happens on your device, but the heavier libraries, such as the HEIC decoder or the text reader, are downloaded the first time you use them, so you need a connection at least once.']
    ]
  },

  'image-tools': {
    sections: [
      S('JPG, PNG or WebP: which output should you ask for?',
        p('Use JPG for photographs and anything going to an official form. It is the smallest of the formats a portal is likely to accept, and it is accepted almost everywhere. Use PNG for logos, screenshots and graphics with hard edges or transparent areas, accepting that the file will be several times larger. Use WebP for your own website, where every modern browser can show it and the smaller size helps page speed.'),
        p('If the form does not name a format, choose JPG. If it names one, match it exactly, because some validators check the extension and the real file type separately.')),
      S('A reliable method for any size limit',
        ol([
          'Read the form and write down three numbers: the maximum size, the minimum size if there is one, and the pixel dimensions if given.',
          'Open the size page that matches the maximum, or the general Compress Image page if the number is unusual.',
          'Crop first, then compress. Removing empty background does more for the file size than lowering quality.',
          'Check the size badge and open the result at 100% zoom before downloading.',
          'Keep the original photo. Compressing an already compressed copy compounds the loss.'
        ])),
      S('One set of pages for JPG and JPEG',
        p('JPG and JPEG are the same format; the three-letter version exists only because older Windows software limited extensions to three characters. Rather than keep two copies of every page, one set of JPG pages covers both spellings, and the old JPEG addresses redirect to them.'),
        p('Whichever spelling your form uses, the result is a genuine JPEG file with a .jpg extension. If a system insists on .jpeg, the file can simply be renamed, since the contents are identical.')),
      S('How to choose between the size pages',
        ul([
          'Under 50 KB: signatures, small ID photos and exam thumbnails. Expect small pixel dimensions.',
          '100 to 200 KB: passport-style photos, profile pictures and most job portals.',
          '500 KB to 1 MB: documents and photos that must stay readable at full screen.',
          'No number given: 100 KB is a sensible general target.'
        ]))
    ],
    faqs: [
      ['Will my photo get blurry at 20 KB?', 'It depends on the pixel dimensions. A 100 × 120 pixel photo fits 20 KB comfortably, while a 3000 × 4000 pixel photo has to be shrunk first. The size pages include a table showing what each limit can hold.'],
      ['Should I resize or compress?', 'Do both in one pass. The tool searches for the best quality under your limit and shrinks the dimensions only if quality alone cannot reach it.']
    ]
  },

  'resize-tools': {
    sections: [
      S('Pixels, centimetres and inches: how forms mix them',
        p('A form that asks for a photograph of 3.5 × 4.5 cm is really asking for a certain number of pixels at a certain density. Pixels equal centimetres divided by 2.54 and multiplied by the DPI, so 3.5 × 4.5 cm at 300 DPI is about 413 × 531 pixels. The first table on this page shows the common conversions, and the resize tool lets you type either unit.'),
        p('DPI itself does not change how an image looks on a screen. It is a note stored in the file that tells printers and some portals the intended physical size, which is why a few forms check it.')),
      S('Common mistakes when resizing for an upload',
        ul([
          'Stretching a picture to fit a box instead of cropping to the right proportions. The tool locks the crop box to your ratio to prevent this.',
          'Enlarging a small image. This adds pixels but no detail, so the result looks soft.',
          'Resizing a screenshot of a photo instead of the original file, which already lost quality once.',
          'Forgetting that the file size limit still applies after the dimensions are set.'
        ])),
      S('Resizing a PDF: page size versus file size',
        p('A PDF has two separate numbers. The page size, such as A4 or Letter, controls how large it prints. The file size, in KB or MB, controls how large it is to upload. Changing the page size scales the content onto a new page; it does not by itself make the file smaller. When you set both, the tool scales the pages first and then reduces the file to fit your limit.')),
      S('Which resize page to open',
        chips(['resize-image', 'resize-pdf', 'passport-photo-size', 'signature-resize'], ['Resize image', 'Resize PDF', 'Passport photo', 'Signature resize']))
    ],
    faqs: [
      ['Can I resize in centimetres?', 'Yes. Choose centimetres or inches next to the width and height boxes and set the DPI the form asks for. The pixel size is calculated for you.'],
      ['Does resizing a PDF change its text?', 'Not when the pages are only scaled. Text stays sharp because the page is placed, not redrawn as a picture.']
    ]
  },

  'pdf-tools': {
    sections: [
      S('Picking a PDF size target',
        p('Portals tend to use a handful of limits. 100 KB and 200 KB appear on exam and government forms, 500 KB and 1 MB on job and bank portals, and 2 MB on university and visa applications. Open the page for your limit and read the table: it shows how many pages of a typical scan fit and at what resolution.'),
        p('A black-and-white text scan is far cheaper than a colour photograph of a page. A single greyscale page often fits in 100 KB with room to spare, while four colour pages may not fit in 500 KB.')),
      S('Three checks before you compress',
        ol([
          'Remove pages you do not need. Every page you drop frees space for the pages that remain.',
          'Decide whether the PDF contains real text. If you can select words with the cursor, a text-preserving pass may already be small enough.',
          'Open the result afterwards and look at the smallest print. If it is too soft, split the document rather than lowering quality further.'
        ])),
      S('When a PDF will not go under the limit',
        ul([
          'Ask whether the portal accepts more than one file, then split the PDF by pages.',
          'Scan again in greyscale at a lower resolution instead of using a colour photo.',
          'Remove embedded photographs that are not required, such as logo banners on every page.',
          'Check whether a higher limit applies to a different upload slot on the same form.'
        ])),
      S('Related PDF tools',
        chips(['resize-pdf', 'convert-pdf-to-jpg', 'jpg-to-pdf', 'convert-pdf-to-word'], ['Resize PDF', 'PDF to JPG', 'JPG to PDF', 'PDF to Word']))
    ],
    faqs: [
      ['Will compression remove my signature or stamps?', 'No content is removed. If pages must be rebuilt as images, signatures and stamps stay visible but at the resolution that fits your limit.'],
      ['Why does a small text document compress better than a scan?', 'A text PDF stores letters as data, which takes very little room. A scan stores a photograph of every page, so it needs far more data.']
    ]
  },

  /* ---------------------------- CONVERTERS ---------------------------- */
  'convert-image-to-word': {
    sections: [
      S('Preparing the photo before you read it',
        p('Text recognition is only as good as the picture. A page photographed flat, in daylight, with the camera directly above it gives results close to the typed original. The same page taken at an angle under a desk lamp can come back with half the words wrong.'),
        ul([
          'Lay the page flat and hold the phone parallel to it so the lines are straight.',
          'Use even light from a window and avoid your own shadow on the paper.',
          'Fill the frame with the page, but keep the edges visible so no words are cut off.',
          'Use the camera at full resolution; very small text needs enough pixels per letter.'
        ])),
      S('A proofreading checklist for recognised text',
        p('Even good recognition makes a few predictable mistakes. After the text appears in the review box, scan for these before you download.'),
        ul([
          'Numbers: the letter O and the digit 0, and the letter l and the digit 1, are the most common swaps.',
          'Names and addresses, which are not in any dictionary the engine can lean on.',
          'Lines that were broken in the photo and now read as separate paragraphs.',
          'Punctuation and quotation marks, which are often dropped or doubled.',
          'In Indian scripts, small vowel signs that sit above or below a letter.'
        ])),
      S('Word, or something else?',
        p('Choose Word when you want to edit or reuse the wording. If you only need to send several photographed pages as one tidy file, a PDF keeps the original look and needs no proofreading.'),
        chips(['jpg-to-pdf', 'convert-image-to-excel'], ['JPG to PDF', 'Image to Excel']))
    ],
    faqs: [
      ['How many pages can I add at once?', 'You can add several images and they are read in order, with the text joined into one document. Reading takes longer for each extra page, so a handful at a time works best on a phone.'],
      ['Will the Word file keep my columns and pictures?', 'No. The result is text in paragraphs. Photos, borders and exact column layouts are not rebuilt, so use Image to Excel for tables.']
    ]
  },

  'convert-image-to-excel': {
    sections: [
      S('Photographing a table so the columns survive',
        p('Rows and columns are rebuilt from the position of each word, so the geometry of the photo matters more than it does for plain text. A table photographed straight on gives clean columns. A table photographed from the side gives columns that drift and merge.'),
        ul([
          'Keep the camera square to the page. Tilt creates lines that slope across the sheet.',
          'Include the whole table in one frame rather than stitching two photos.',
          'Prefer a screenshot over a photo whenever the table is on a screen.',
          'Avoid creases and curled paper, which bend rows.'
        ])),
      S('Cleaning up the spreadsheet afterwards',
        p('Treat the result as a fast first draft. A few quick fixes in Excel usually finish the job.'),
        ul([
          'Check totals first. If the sum of a column differs from the printed total, a digit was misread.',
          'Use Text to Columns on any column where two values landed in one cell.',
          'Set the number format on columns of dates and currency, since only plain numbers are stored as numbers.',
          'Delete stray cells created by borders or stamps that were read as characters.'
        ])),
      S('Image to Excel or PDF to Excel?',
        p('If the table lives in a PDF with real text, PDF to Excel reads the text directly and is more accurate than reading a picture. Use this page when the only copy you have is a photo or a screenshot.'),
        chips(['convert-pdf-to-excel', 'jpg-to-excel'], ['PDF to Excel', 'JPG to Excel']))
    ],
    faqs: [
      ['Does it work on a table with coloured cells?', 'Colours are ignored. Dark text on a light or coloured background still reads well as long as the contrast is high.'],
      ['Can I read a long statement of many rows?', 'Yes, but split very long photos into sections. Smaller images are read faster and with fewer mistakes than one tall image.']
    ]
  },

  'jpg-to-excel': {
    sections: [
      S('Why phone photos of tables need extra care',
        p('A JPG from a phone camera is a photograph, not a screenshot, so it carries perspective, uneven light and sometimes noise. Those are the main reasons columns end up merged or shifted. A few seconds of preparation changes the outcome more than any setting in the tool.'),
        ul([
          'Photograph in daylight and avoid the flash, which creates a bright patch that hides numbers.',
          'Place the paper on a dark, plain surface so the edges are easy to see.',
          'Zoom with your feet, not the camera, to keep the picture sharp.',
          'Retake any photo where the numbers in the corners look blurred.'
        ])),
      S('Typical documents people convert from a JPG',
        ul([
          'Shop receipts and restaurant bills for an expense sheet.',
          'Printed marksheets and result cards for comparing scores.',
          'Class timetables and attendance sheets shared as pictures in a chat.',
          'Price lists and delivery notes photographed on site.'
        ]),
        p('For each of these, the goal is usually the numbers, not the formatting. That is why the output holds values only and leaves fonts, borders and colours for you to apply in Excel.')),
      S('One sheet per photo',
        p('When you add several JPGs, each becomes its own sheet in the workbook, in the order you added them. That keeps pages from different days or different tables separate, and it lets you copy only the sheets you need into your own file.'))
    ],
    faqs: [
      ['Is JPG the same as JPEG for this tool?', 'Yes. Files ending in .jpg or .jpeg are the same format and are read identically.'],
      ['Why did a number turn into text?', 'Values with currency symbols, letters or unusual separators stay as text so that nothing is changed silently. Remove the symbol in Excel and the cell will become a number.']
    ]
  },

  'convert-pdf-to-word': {
    sections: [
      S('What the Word file will and will not contain',
        p('The goal of this conversion is text you can edit, not a copy of the page. Paragraphs, headings and page breaks are carried over, so you can change the wording, copy sections into another document or reformat it from scratch.'),
        table2()),
      S('Getting a cleaner result',
        ol([
          'Convert only the pages you need. Cover pages and long appendices add clutter.',
          'Keep OCR on for scans, and turn it off for digital PDFs, which are quicker and more accurate without it.',
          'Choose the OCR language that matches the document if you see symbols instead of words.',
          'Open the .docx and use Find and Replace to fix repeated errors, such as a name that was read the same wrong way each time.'
        ])),
      S('When to choose another converter',
        p('If your goal is to share the pages as pictures, PDF to JPG is the better fit. If the PDF is mostly tables of figures, PDF to Excel places the numbers in cells so you can calculate with them.'),
        chips(['convert-pdf-to-excel', 'convert-pdf-to-jpg'], ['PDF to Excel', 'PDF to JPG']))
    ],
    faqs: [
      ['Why do some words have odd spacing?', 'PDFs store each line of text in pieces. The converter joins them back into paragraphs, but justified text can leave unusual gaps that you can fix with one pass of Find and Replace.'],
      ['Can I convert a password-protected PDF?', 'Yes, if you know the password. You will be asked for it, and it is used only inside your browser.']
    ]
  },

  'convert-pdf-to-excel': {
    sections: [
      S('How tables are found in a PDF',
        p('A PDF does not contain a table object. It contains letters and numbers placed at coordinates. The converter groups items that share a line, then lines up items that start at similar horizontal positions into the same column. That works well for statements and reports with consistent spacing, and less well for tables that rely on borders instead of spacing.')),
      S('Statements and reports: a short workflow',
        ol([
          'Pick the pages that contain the table, so cover pages do not become empty sheets.',
          'Choose one sheet per page when pages are separate reports, or a single stacked sheet when a long table continues across pages.',
          'Convert, then compare the first and last rows with the PDF.',
          'Check the totals line by line. A wrong total tells you where a digit was misplaced.',
          'Apply number formats and formulas in Excel once the values are right.'
        ])),
      S('Things Excel will not carry over',
        ul([
          'Cell borders, shading and fonts from the PDF layout.',
          'Formulas. Totals in the PDF arrive as plain numbers.',
          'Images, logos and charts on the page.',
          'Merged header cells, which usually appear as a single cell with blank neighbours.'
        ]))
    ],
    faqs: [
      ['Is it safe to convert a bank statement here?', 'The file is read inside your browser and is not sent to a server. As with any financial document, close the tab afterwards and delete the downloaded spreadsheet when you no longer need it.'],
      ['What if the pages are scans?', 'Turn OCR on. Accuracy for numbers depends on the scan, so check every figure against the original.']
    ]
  },

  'convert-pdf-to-jpg': {
    sections: [
      S('Choosing a resolution',
        p('Resolution decides both how sharp the picture is and how large the file is. The table gives the pixel size of an A4 page at common settings, which is the size of the JPG you will receive.'),
        { t: 'table', head: ['DPI', 'A4 page in pixels', 'Best for'], rows: [['72', '595 × 842', 'Small previews and thumbnails'], ['150', '1240 × 1754', 'Reading on screen and sharing in chat'], ['200', '1654 × 2339', 'Detailed slides and web articles'], ['300', '2480 × 3508', 'Printing and fine print']] }),
      S('JPG or PNG for page images',
        p('JPG is the better default. It is much smaller and handles scanned pages well. Choose PNG for pages that are mostly text and line art, where its crisp edges help and the file size stays reasonable, or when you need to place the page in a design tool that prefers PNG.')),
      S('What people do with page images',
        ul([
          'Post one page of a document on social media without sharing the whole file.',
          'Insert a page into a slide deck or a design as a picture.',
          'Upload a page to a form that accepts only images, then compress it to the size limit.',
          'Send a clear picture of a single page in a chat app that does not preview PDFs.'
        ]))
    ],
    faqs: [
      ['How do I get just page 5?', 'Type 5 in the page range, or a range such as 5-7. Only those pages are converted.'],
      ['My JPG files are very large. How do I shrink them?', 'Lower the DPI or the quality slider, or run the files through Compress Image and set a KB target.']
    ]
  },

  'convert-pdf-to-ppt': {
    sections: [
      S('How the slides are built',
        p('Each PDF page is drawn at screen resolution and placed on its own slide, filling the slide. The slide size follows the proportions of the first page, so a landscape PDF gives widescreen slides and a portrait PDF gives tall ones. Any text that was readable on the page is copied into the speaker notes of that slide, so it is still searchable and can be pasted into the slide if you want to rebuild it.')),
      S('Making the deck work for a presentation',
        ol([
          'Start from landscape pages when you can. Portrait pages leave empty bars on a projector.',
          'Convert only the pages you plan to show.',
          'Open the .pptx and reorder or delete slides in the normal way.',
          'Add titles or arrows on top of the page image with the usual PowerPoint tools.'
        ])),
      S('When a different format is better',
        p('If you need to change the words on the slides, a picture is the wrong starting point. Convert the PDF to Word to get editable text, then build slides from it. If the aim is a shareable picture of a page, PDF to JPG is lighter than a whole deck.'),
        chips(['convert-pdf-to-word', 'convert-pdf-to-jpg'], ['PDF to Word', 'PDF to JPG']))
    ],
    faqs: [
      ['Will the deck open on a Mac?', 'Yes. The .pptx file opens in PowerPoint, Keynote and Google Slides.'],
      ['How can I make the deck smaller?', 'Reduce the number of pages, or compress the PDF first. The deck size grows with every page image it holds.']
    ]
  },

  'heic-to-jpg': {
    sections: [
      S('Setting the iPhone so the problem stops',
        p('Converting works, but it is an extra step every time. On an iPhone you can switch the camera to save JPEG from now on: open Settings, then Camera, then Formats, and choose Most Compatible. New photos are saved as JPEG, which is the same format as a file ending in .jpg or .jpeg, and old HEIC photos stay as they are.'),
        p('Keep High Efficiency on if your storage is tight; the file will be about half the size and you can convert only the photos you need to share.')),
      S('Choosing the JPG quality',
        table3()),
      S('Sharing and uploading after conversion',
        ul([
          'For a form with a size limit, convert first, then use Compress Image to reach the exact KB.',
          'For several photos in one attachment, use HEIC to PDF instead of sending many files.',
          'Location data is not copied into the JPG, which is useful when you post photos publicly.',
          'The extension you receive is .jpg. If a system insists on .jpeg, the two are the same format and the file can be renamed.'
        ]),
        chips(['heic-to-png', 'heic-to-pdf', 'compress-image'], ['HEIC to PNG', 'HEIC to PDF', 'Compress image']))
    ],
    faqs: [
      ['Is JPEG different from JPG?', 'No. JPG and JPEG are the same format and the same bytes; only the extension differs.'],
      ['Why does my converted photo look the same size on screen but the file is bigger?', 'JPEG is less efficient than HEIC, so the same picture needs more bytes. That is the price of working everywhere.']
    ]
  },

  'heic-to-png': {
    sections: [
      S('When PNG is the right output for an iPhone photo',
        p('PNG is a good choice when you plan to edit the picture several times and do not want each save to add loss, or when the tool you are sending it to accepts PNG but not JPEG. For simply sharing a photo, JPG is almost always the better choice, because the same picture can be five times smaller.')),
      S('What to expect from the file sizes',
        { t: 'table', head: ['Photo type', 'Typical HEIC', 'Typical PNG'], rows: [['Portrait in daylight', '1.5 MB', '9 to 14 MB'], ['Screenshot saved as HEIC', '0.4 MB', '1 to 3 MB'], ['Night photo with grain', '2.5 MB', '14 to 20 MB']] },
        note('These are planning figures. The tool shows the real size of each converted file before you download it.')),
      S('Getting the best result',
        ul([
          'Convert in small groups. PNG files are large, and a phone can run out of memory with many at once.',
          'Resize afterwards with the Resize Image tool if you need a smaller picture.',
          'If a form needs a file under a size limit, switch to JPG; PNG rarely fits tight limits.',
          'Use a ZIP download when you convert more than a few photos.'
        ]),
        chips(['heic-to-jpg', 'resize-image'], ['HEIC to JPG', 'Resize image']))
    ],
    faqs: [
      ['Does PNG make my HEIC photo sharper?', 'No. It keeps exactly what was in the decoded photo and avoids adding more loss, but it cannot add detail.'],
      ['Will transparency appear?', 'Only if the source had it. Ordinary camera photos are fully opaque, so the PNG will be too.']
    ]
  },

  'jpg-to-pdf': {
    sections: [
      S('Building a good multi-page PDF from photos',
        ol([
          'Add the pictures in the order you want the pages to appear; the first one becomes page one.',
          'Use the arrows to correct the order before you convert.',
          'Choose A4 for printing and most uploads, US Letter for North American paperwork, or Match each image to keep every page the size of its picture.',
          'Set a margin if you plan to print, or none for full-page pictures.',
          'Create the PDF, scroll through it once, then compress it if a limit applies.'
        ])),
      S('Making the PDF small enough to upload',
        p('A PDF made from photographs is as big as the photographs it holds. Four phone photos can reach 10 MB. Compress the images first, or run the finished PDF through Compress PDF with the size from your form, which is the faster way.'),
        chips(['compress-pdf', 'compress-image'], ['Compress PDF', 'Compress image'])),
      S('JPG, JPEG and other pictures',
        p('Files ending in .jpg and .jpeg are the same format, so both are accepted here. PNG, WebP and HEIC pictures can be mixed in as well, which is useful when part of a document came from a screenshot or an iPhone.'))
    ],
    faqs: [
      ['Can I combine photos of different sizes?', 'Yes. With Match each image every page takes the size of its picture; with A4 or Letter each photo is scaled to fit inside the page.'],
      ['Will text inside the pictures be searchable?', 'No. The PDF holds pictures. To get searchable text, convert the photos with Image to Word.']
    ]
  },

  'jpg-to-png': {
    sections: [
      S('JPG versus PNG for the same picture',
        table4()),
      S('When converting to PNG helps',
        ul([
          'You will edit the picture several times and want to avoid fresh JPG loss each time you save.',
          'A design or presentation tool you use handles PNG more reliably.',
          'You plan to add a transparent background in an editor afterwards; start from PNG so the next save does not compress again.'
        ]),
        p('If the goal is only to make the file smaller, converting to PNG is the wrong direction. Keep JPG and use Compress Image.')),
      S('How to avoid disappointment',
        p('Converting JPG to PNG cannot restore detail that JPG already discarded. Blocky areas, ringing around edges and soft shadows remain exactly as they were. The benefit is that no more loss will be added from this point on.'),
        chips(['compress-png', 'webp-to-png', 'jpg-to-webp'], ['Compress PNG', 'WebP to PNG', 'JPG to WebP']))
    ],
    faqs: [
      ['Does it work for JPEG files too?', 'Yes. A file ending in .jpeg is the same format as .jpg and converts identically.'],
      ['Can I make a PNG smaller afterwards?', 'Yes. Open Compress PNG and set a size; it reduces colours and, if you allow it, the dimensions.']
    ]
  },

  'jpg-to-webp': {
    sections: [
      S('How much smaller will it be?',
        { t: 'table', head: ['Image type', 'Typical saving vs JPG', 'Notes'], rows: [['Photograph, original camera file', '25 to 35%', 'Largest gain, best at quality 80 to 90'], ['Photograph already compressed', '10 to 20%', 'Less to gain; check the preview'], ['Graphic with flat colours', 'Often more than for photos', 'WebP handles flat areas efficiently']] },
        note('Savings depend on the picture. The tool shows each new file size so you can compare before downloading.')),
      S('Using WebP on your own website',
        ol([
          'Convert your hero and gallery images and keep quality around 85 for photographs.',
          'Serve WebP with the usual img tag. All current major browsers display it.',
          'Keep the original JPG somewhere in case you need to edit or print the picture later.',
          'Resize before converting when the picture is much larger than its on-page size; that saves more than any format change.'
        ])),
      S('Where WebP will not work',
        p('Official forms and many older programs do not accept WebP and will reject the file or fail to open it. If an upload is the goal, stay with JPG. You can always convert back, though the round trip adds a little loss.'),
        chips(['webp-to-jpg', 'compress-webp'], ['WebP to JPG', 'Compress WebP']))
    ],
    faqs: [
      ['What quality should I pick?', '85 to 90 keeps photographs looking like the original for most pictures. Go lower only for thumbnails.'],
      ['Does JPEG convert too?', 'Yes. Files ending in .jpeg are the same as .jpg and are converted the same way.']
    ]
  },

  'webp-to-jpg': {
    sections: [
      S('Why a picture arrives as WebP',
        p('Websites serve WebP because it loads faster. When you right-click and save, you get the WebP file, which then fails to open in an older editor, will not attach to some email clients, and is rejected by most application forms. Converting to JPG gives you the picture in the format those places expect.')),
      S('Settings that matter',
        ul([
          'Quality: 90 keeps the picture close to the original. Choose 80 if you want a smaller file.',
          'Transparency: JPG has none, so transparent areas are filled with white. Use WebP to PNG if you need to keep them.',
          'Animation: an animated WebP becomes a single still frame.',
          'Batch: add many files and download a ZIP rather than saving each one.'
        ])),
      S('After you convert',
        p('Check the size and pixel dimensions against the instructions on the form. A converted file can be larger than the WebP it came from, because WebP is the more efficient format. If a limit applies, use Compress JPG on the result.'),
        chips(['compress-jpg', 'webp-to-png'], ['Compress JPG', 'WebP to PNG']))
    ],
    faqs: [
      ['Is the picture sharper as JPG?', 'No. It looks the same as the WebP, and at quality 90 the difference cannot be seen.'],
      ['Why is the JPG bigger than the WebP?', 'WebP packs the same picture into fewer bytes. A larger JPG is normal, and it can be made smaller afterwards.']
    ]
  },

  'webp-to-png': {
    sections: [
      S('Keeping transparent backgrounds',
        p('WebP supports transparency and so does PNG, which makes this the right conversion for logos, stickers and cut-out graphics. The transparent pixels stay transparent in the PNG. Converting to JPG instead would fill them with white and lose the cut-out.')),
      S('Typical uses',
        ul([
          'Placing a logo saved from a website into a slide or document.',
          'Editing a graphic in software that does not open WebP.',
          'Keeping an archive copy that will not lose anything more on later saves.',
          'Using a sticker or icon in an app that requires PNG.'
        ])),
      S('File size and what to do about it',
        p('PNG stores pixels without lossy compression, so photographs can grow several times in size. Graphics with flat colours stay small. If a PNG comes out too large, resize it with the Resize Image tool, or open Compress PNG to reduce the colours and set a limit.'),
        chips(['compress-png', 'resize-image', 'webp-to-jpg'], ['Compress PNG', 'Resize image', 'WebP to JPG']))
    ],
    faqs: [
      ['Will an animated WebP become an animated PNG?', 'No. Only the first frame is kept, so you get a single still image.'],
      ['Are colours exact?', 'Yes. The picture is decoded and saved without any further loss, so colours match the WebP as your browser displays it.']
    ]
  }
};

function table2() {
  return { t: 'table', head: ['In the PDF', 'In the Word file'], rows: [['Paragraphs and headings', 'Editable text; headings are detected where they are clearly larger'], ['Page breaks', 'Kept, one section per page'], ['Tables', 'Plain lines of text, not table cells'], ['Pictures and logos', 'Not carried over'], ['Fonts and exact layout', 'Replaced by a standard font']] };
}
function table3() {
  return { t: 'table', head: ['Quality', 'Result', 'Choose it for'], rows: [['95%', 'Nearly identical to the original, largest file', 'Prints and photo archives'], ['90%', 'Hard to tell from the original, good balance', 'Default for almost everything'], ['80%', 'Slight softness, noticeably smaller', 'Email and chat'], ['60%', 'Visible compression in smooth areas', 'Thumbnails only']] };
}
function table4() {
  return { t: 'table', head: ['Property', 'JPG', 'PNG'], rows: [['Compression', 'Lossy: small, discards some detail', 'Lossless: exact, larger'], ['Photos', 'Excellent', 'Very large'], ['Transparency', 'No', 'Yes'], ['Re-saving', 'Adds loss each time', 'No new loss'], ['Accepted by official forms', 'Almost always', 'Sometimes']] };
}
