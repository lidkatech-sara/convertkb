import json, re, os, textwrap
from PIL import Image, ImageDraw, ImageFont

OUT='/home/claude/site/convertkb-main/public/img'
W,H,S=1200,630,2
FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
FR='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def F(sz,b=True): return ImageFont.truetype(FB if b else FR, int(sz*S))
BRAND=(91,91,240); INK=(24,24,48); MUTE=(98,102,130); BG1=(244,245,255); BG2=(255,255,255)
GREEN=(22,163,74); RED=(225,70,70); AMBER=(217,119,6); LINE=(210,214,240)
PALETTES=[((91,91,240),(236,236,255)),((14,148,136),(225,247,244)),((219,39,119),(253,232,242)),((217,119,6),(254,243,222)),((37,99,235),(227,238,255)),((124,58,237),(240,233,254))]

def kbtxt(kb): return (f'{round(kb/1024,1):g} MB' if kb>=1024 else f'{kb:g} KB')

def canvas():
    im=Image.new('RGB',(W*S,H*S),BG2); d=ImageDraw.Draw(im)
    # vertical soft gradient
    for y in range(H*S):
        t=y/(H*S); c=tuple(int(BG1[i]*(1-t)+BG2[i]*t) for i in range(3)); d.line([(0,y),(W*S,y)],fill=c)
    return im,d
def rr(d,box,r,fill=None,outline=None,w=1):
    x0,y0,x1,y1=[v*S for v in box]; d.rounded_rectangle([x0,y0,x1,y1],radius=r*S,fill=fill,outline=outline,width=int(w*S))
def tx(d,xy,s,font,fill=INK,anchor='la'): d.text((xy[0]*S,xy[1]*S),s,font=font,fill=fill,anchor=anchor)
def tw(d,s,font): return d.textlength(s,font=font)/S
def wrap(d,s,font,maxw):
    words=s.split(); lines=[]; cur=''
    for w in words:
        t=(cur+' '+w).strip()
        if tw(d,t,font)<=maxw: cur=t
        else: lines.append(cur); cur=w
    if cur: lines.append(cur)
    return lines
def chip(d,x,y,s,fill,fg=(255,255,255),sz=22,pad=14):
    f=F(sz); w=tw(d,s,f)+pad*2; rr(d,(x,y,x+w,y+sz*1.9),sz*0.95,fill=fill); tx(d,(x+pad,y+sz*0.25),s,f,fg); return w
def arrow(d,x0,y0,x1,y1,col=BRAND,wd=6):
    d.line([(x0*S,y0*S),(x1*S,y1*S)],fill=col,width=wd*S)
    import math
    a=math.atan2(y1-y0,x1-x0); L=18
    for da in (2.6,-2.6):
        d.line([(x1*S,y1*S),((x1+L*math.cos(a+da))*S,(y1+L*math.sin(a+da))*S)],fill=col,width=wd*S)
def photo_card(d,x,y,w,h,col,light,label=None,doc=False):
    rr(d,(x+8,y+10,x+w+8,y+h+10),18,fill=(222,224,244))
    rr(d,(x,y,x+w,y+h),18,fill=(255,255,255),outline=LINE,w=2)
    if doc:
        for i in range(7):
            ww=(w-60)*(1 if i%3 else 0.7); yy=y+34+i*(h-80)/7
            rr(d,(x+30,yy,x+30+ww,yy+9),4,fill=light if i%3 else col)
    else:
        rr(d,(x+16,y+16,x+w-16,y+h-16),12,fill=light)
        d.ellipse([(x+w*0.68)*S,(y+h*0.2)*S,(x+w*0.68+w*0.14)*S,(y+h*0.2+w*0.14)*S],fill=(255,214,102))
        d.polygon([((x+16)*S,(y+h-16)*S),((x+w*0.38)*S,(y+h*0.45)*S),((x+w*0.62)*S,(y+h-16)*S)],fill=col)
        d.polygon([((x+w*0.45)*S,(y+h-16)*S),((x+w*0.68)*S,(y+h*0.58)*S),((x+w-16)*S,(y+h-16)*S)],fill=tuple(int(c*0.8) for c in col))
def left_text(d,p,eyebrow,sub,col):
    chip(d,64,56,eyebrow,col,sz=20)
    f=F(52); lines=wrap(d,p['h1'],f,590)
    if len(lines)>3: f=F(44); lines=wrap(d,p['h1'],f,590)
    y=130
    for ln in lines[:4]:
        tx(d,(64,y),ln,f,INK); y+=64 if f.size/S>46 else 56
    fs=F(26,False)
    for ln in wrap(d,sub,fs,540)[:3]:
        tx(d,(64,y+14),ln,fs,MUTE); y+=36
    # footer brand
    rr(d,(64,552,64+34,552+34),9,fill=BRAND); tx(d,(64+17,552+17),'C',F(22),(255,255,255),'mm')
    tx(d,(110,555),'ConvertKB',F(26),INK); tx(d,(300,560),'Free  ·  Private  ·  Runs in your browser',F(20,False),MUTE)

def ext_badge(d,x,y,w,h,label,col,light):
    rr(d,(x+8,y+10,x+w+8,y+h+10),16,fill=(222,224,244))
    rr(d,(x,y,x+w,y+h),16,fill=(255,255,255),outline=LINE,w=2)
    for i in range(5):
        rr(d,(x+24,y+26+i*18,x+w-24-(i%2)*30,y+34+i*18),4,fill=light)
    rr(d,(x+14,y+h-62,x+w-14,y+h-14),12,fill=col); tx(d,(x+w/2,y+h-38),label,F(26 if len(label)<5 else 21),(255,255,255),'mm')

def person(d,cx,cy,sc,col):
    d.ellipse([(cx-sc*0.55)*S,(cy-sc*1.25)*S,(cx+sc*0.55)*S,(cy-sc*0.15)*S],fill=col)
    d.pieslice([(cx-sc*1.15)*S,(cy+sc*0.05)*S,(cx+sc*1.15)*S,(cy+sc*2.5)*S],180,360,fill=col)

def draw(p,idx):
    col,light=PALETTES[idx%len(PALETTES)]
    im,d=canvas()
    # decorative circles
    d.ellipse([(W-260)*S,(-120)*S,(W+120)*S,(260)*S],fill=light)
    d.ellipse([(W-420)*S,(H-150)*S,(W-120)*S,(H+150)*S],fill=tuple(min(255,int(c+(255-c)*0.5)) for c in light))
    k=p['kind']; s=p['slug']; alt=''; cap=''
    if k=='tool' and p['tool'] in ('image','pdf') and p['family'] and p['family'].startswith('compress'):
        isPdf=p['fmt']=='pdf'; kb=p['kb'] or (200 if isPdf else 100)
        before=(9000,'4-page colour scan') if isPdf else (3200,'Typical phone photo')
        fm={'jpg':'JPG','png':'PNG','webp':'WebP','image':'JPG, PNG or WebP','pdf':'PDF'}[p['fmt']]
        left_text(d,p,'Compress '+('PDF' if isPdf else fm.split(',')[0] if p['fmt']!='image' else 'image'),'Set the exact size limit. The tool searches for the best quality that fits.' if kb else 'Choose any size limit.',col)
        photo_card(d,700,70,300,200,col,light,doc=isPdf)
        chip(d,720,290,kbtxt(before[0]),RED,sz=26)
        tx(d,(720+tw(d,kbtxt(before[0]),F(26))+60,296),before[1],F(18,False),MUTE)
        arrow(d,850,350,850,410,col)
        photo_card(d,740,430,220,92 if False else 110,col,light,doc=isPdf)
        chip(d,980,450,'≤ '+kbtxt(kb),GREEN,sz=26)
        red=max(0,round((1-kb/before[0])*100)); 
        if red>0: chip(d,980,500,f'about {red}% smaller',(60,64,100),sz=18)
        alt=f"Illustration: a {kbtxt(before[0])} {'PDF scan' if isPdf else 'photo'} compressed to under {kbtxt(kb)} as {fm}"
        cap=f"Typical example: a {kbtxt(before[0])} {'scanned PDF' if isPdf else 'phone photo'} fitted under {kbtxt(kb)}. Real results depend on your file."
    elif k=='tool' and p['family']=='resize-image':
        kb=p['kb'] or 100
        left_text(d,p,'Resize image','Exact pixels, centimetres or inches with a file size limit.',col)
        rr(d,(700,90,960,410),10,fill=(255,255,255),outline=col,w=4)
        person(d,830,300,56,light); 
        arrow(d,700,440,960,440,col,4); arrow(d,960,440,700,440,col,4)
        tx(d,(830,462),'width (px)',F(20,False),MUTE,'ma')
        arrow(d,1000,90,1000,410,col,4); arrow(d,1000,410,1000,90,col,4)
        tx(d,(1018,250),'height (px)',F(20,False),MUTE,'lm')
        chip(d,720,500,'≤ '+kbtxt(kb),GREEN,sz=26); chip(d,900,500,'any DPI',(60,64,100),sz=20)
        alt=f"Diagram of a photo frame with width and height arrows and a {kbtxt(kb)} file size limit"
        cap=f"Resize to exact dimensions and keep the file under {kbtxt(kb)}."
    elif k=='tool' and p['family']=='resize-pdf':
        kb=p['kb'] or 200
        left_text(d,p,'Resize PDF','Change the page size to A4, A3, A5, Letter or Legal and fit a size limit.',col)
        for i,(n,wd,ht) in enumerate([('A5',150,212),('A4',210,297),('A3',297,420)]):
            sc=0.7; x=[650,800,960][i]; y=470-ht*sc*1.0
            rr(d,(x+6,y+8,x+wd*sc+6,470+8),8,fill=(222,224,244)); rr(d,(x,y,x+wd*sc,470),8,fill=(255,255,255),outline=col,w=3)
            for j in range(int(ht*sc/38)):
                rr(d,(x+16,y+20+j*34,x+wd*sc-16-(j%3)*20,y+28+j*34),3,fill=light)
            tx(d,(x+wd*sc/2,484),n,F(22),INK,'ma')
        chip(d,700,90,'≤ '+kbtxt(kb),GREEN,sz=22)
        alt=f"Illustration of A5, A4 and A3 pages with a {kbtxt(kb)} PDF size limit"
        cap=f"Scale pages to a new size and keep the PDF under {kbtxt(kb)}."
    elif k=='convert':
        m=re.match(r'(?:convert-)?(.+?)-to-(.+)$',s); a,b=(m.group(1),m.group(2)) if m else ('file','file')
        nm={'image':'IMG','jpg':'JPG','png':'PNG','webp':'WebP','heic':'HEIC','pdf':'PDF','word':'DOCX','excel':'XLSX','ppt':'PPTX'}
        A,B=nm.get(a,a.upper()),nm.get(b,b.upper())
        left_text(d,p,'Free converter',f'Convert {A if a!="image" else "an image"} to {B} in your browser. Nothing is uploaded.',col)
        ext_badge(d,690,150,170,230,A,col,light)
        arrow(d,885,265,985,265,col,7)
        ext_badge(d,1000-0,150,170,230,B,GREEN if idx%2 else (20,120,90),(214,245,226))
        chip(d,720,440,'Private',(60,64,100),sz=20); chip(d,860,440,'No signup',(60,64,100),sz=20); chip(d,1010,440,'Batch',(60,64,100),sz=20)
        alt=f"Illustration of a {A} file being converted to a {B} file"
        cap=f"{A} to {B}: converted on your own device, with no upload."
    elif k=='exam':
        c=p['cfg']; w,h=c['w'],c['h']; kbmax=c['targetKb']; kmin=c.get('minKb') or 0
        wide='signature' in s and 'photo' not in s or s in ('signature-resize','pan-card-signature')
        scenic=s in ('youtube-thumbnail-size','instagram-photo-size')
        left_text(d,p,'Photo & signature',(f'{w} × {h} px' if w and h else '')+(f', {kmin}–{kbmax} KB' if kmin and kbmax else (f', under {kbtxt(kbmax)}' if kbmax else '')),col)
        # frame scaled
        mx,my=300,300; sc=min(mx/w,my/h) if w and h else 1
        fw,fh=w*sc,h*sc; fx=830-fw/2; fy=250-fh/2
        rr(d,(fx,fy,fx+fw,fy+fh),10,fill=(255,255,255),outline=col,w=4)
        if wide:
            d.line([((fx+fw*0.12)*S,(fy+fh*0.65)*S),((fx+fw*0.35)*S,(fy+fh*0.3)*S),((fx+fw*0.5)*S,(fy+fh*0.7)*S),((fx+fw*0.65)*S,(fy+fh*0.35)*S),((fx+fw*0.88)*S,(fy+fh*0.6)*S)],fill=INK,width=5*S,joint='curve')
        elif scenic:
            d.polygon([(fx+fw*0.08)*S,(fy+fh*0.9)*S,(fx+fw*0.38)*S,(fy+fh*0.4)*S,(fx+fw*0.62)*S,(fy+fh*0.9)*S][:0] or [((fx+fw*0.08)*S,(fy+fh*0.9)*S),((fx+fw*0.38)*S,(fy+fh*0.4)*S),((fx+fw*0.62)*S,(fy+fh*0.9)*S)],fill=col)
            d.polygon([((fx+fw*0.45)*S,(fy+fh*0.9)*S),((fx+fw*0.68)*S,(fy+fh*0.52)*S),((fx+fw*0.92)*S,(fy+fh*0.9)*S)],fill=tuple(int(c*0.8) for c in col))
            d.ellipse([(fx+fw*0.72)*S,(fy+fh*0.14)*S,(fx+fw*0.72+fw*0.12)*S,(fy+fh*0.14+fw*0.12)*S],fill=(255,214,102))
        else:
            person(d,fx+fw/2,fy+fh*0.62,min(fw,fh)*0.2,light)
        arrow(d,fx,fy+fh+26,fx+fw,fy+fh+26,col,4); arrow(d,fx+fw,fy+fh+26,fx,fy+fh+26,col,4)
        tx(d,(830,fy+fh+36),f'{w} px',F(20),INK,'ma')
        chip(d,700,484,(f'{kmin}–{kbmax} KB' if kmin and kbmax else (f'≤ {kbtxt(kbmax)}' if kbmax else 'No KB limit')),GREEN,sz=22)
        if c.get('dpi'): chip(d,880,484,f"{c['dpi']} DPI",(60,64,100),sz=20)
        alt=f"Diagram of a {w} by {h} pixel {'signature' if wide else 'photo'} frame with its file size limit"
        cap=f"Preset used on this page: {w} × {h} pixels"+(f', {kmin}–{kbmax} KB' if kmin and kbmax else (f', under {kbtxt(kbmax)}' if kbmax else ''))+'. Confirm against your own notification.'
    else:  # hub
        left_text(d,p,'Tool collection','Free, private tools that run in your browser.',col)
        names=['Image','PDF','Resize','Convert','Photos','Sizes']
        for i in range(6):
            x=690+(i%3)*160; y=140+(i//3)*170
            rr(d,(x+6,y+8,x+136,y+148),16,fill=(222,224,244)); rr(d,(x,y,x+130,y+140),16,fill=(255,255,255),outline=LINE,w=2)
            c2,l2=PALETTES[(idx+i)%6]; rr(d,(x+30,y+22,x+100,y+80),12,fill=l2); rr(d,(x+44,y+38,x+86,y+66),8,fill=c2)
        alt=f"Illustration of a collection of ConvertKB tools: {p['h1']}"
        cap=f"{p['h1']}: free tools that run in your browser."
    im=im.resize((W,H),Image.LANCZOS)
    pal=im.quantize(colors=96,method=Image.MEDIANCUT,dither=Image.NONE)
    pal.save(f'{OUT}/{s}.png',optimize=True)
    return alt,cap

pages=json.load(open('/tmp/pages.json'))
man={}
for i,p in enumerate(pages):
    a,c=draw(p,i); man[p['slug']]={'alt':a,'caption':c}
js='// Generated by gen_img.py: alt text and captions for the original illustration on each page (public/img/<slug>.png).\nexport const IMAGES = '+json.dumps(man,indent=1,ensure_ascii=False)+';\n'
open('/home/claude/site/convertkb-main/src/data/images.js','w').write(js)
print(len(man))
