"""Hoja de sprites del círculo de invocación del panel «Tu esfuerzo» (home).

Genera 64 fotogramas de 64x64 en una sola tira horizontal (4096x64). La
animación la reproduce el CSS del panel con `steps(64)`, así que el script
solo produce la tira: nada de GIFs ni vistas previas.

    py scripts/esfuerzo/generar_circulo_64.py
"""
from pathlib import Path
from PIL import Image
import math, random

SALIDA = Path(__file__).resolve().parents[2] / 'public' / 'assets' / 'esfuerzo' / 'circulo_invocacion_v1.png'

H=lambda s:(int(s[1:3],16),int(s[3:5],16),int(s[5:7],16),255)
# Paleta: azules profundos + dorado (complementario del azul oscuro)
OUT=H('#0a0f24'); DK=H('#121b3b'); NAVY=H('#1b2b58'); BLUE2=H('#244379'); BLUE=H('#2d67a6')
TEAL=H('#3ea0c8'); CYAN=H('#7fdcef'); MINT=H('#e2fbff')
GD=H('#7a4c1a'); GOLD=H('#c98a2a'); GOLD2=H('#f2bf4e'); GOLDL=H('#ffe69a'); WG=H('#fffbe8')

S=64; CX,CY=32.0,48.5; N=64; TAU=math.tau
RX,RY=30.5,10.4   # proporción ~0.32: círculo acostado en el suelo

def E(x,y,rx,ry): return ((x+.5-CX)/rx)**2+((y+.5-CY)/ry)**2
def inside(x,y,k): return E(x,y,RX*k,RY*k)<=1
def ang(x,y): return math.atan2((y+.5-CY)/RY,(x+.5-CX)/RX)%TAU
def rad(x,y): return math.sqrt(E(x,y,RX,RY))
def adist(a,b):
    d=abs(a-b)%TAU; return min(d,TAU-d)
def proj(r,a,z=0): return (CX+r*RX*math.cos(a)-.5, CY+r*RY*math.sin(a)-.5-z)

# glifos 3x2 para la banda de runas (u: a lo largo, v: radial)
GLYPHS=[[1,0,1, 1,1,1],[1,1,0, 0,1,1],[0,1,0, 1,1,1],[1,1,1, 1,0,1],
        [1,0,0, 1,1,1],[0,1,1, 1,1,0],[1,1,1, 0,1,0],[1,0,1, 0,1,0]]

random.seed(11)
NP=30
PARTS=[(random.uniform(0,TAU), i/NP+random.uniform(-.012,.012), random.uniform(2,22),
        random.choice([1,-1]), random.uniform(1.25,1.75)) for i in range(NP)]
MOTES=[(random.uniform(-3,3), i/9+random.uniform(0,.05), random.uniform(0,TAU)) for i in range(9)]

def frame(f):
    t=f/N
    im=Image.new('RGBA',(S,S),(0,0,0,0)); px=im.load()
    def put(x,y,c):
        x,y=int(round(x)),int(round(y))
        if 0<=x<S and 0<=y<S: px[x,y]=c
    def get(x,y):
        x,y=int(round(x)),int(round(y))
        return px[x,y] if 0<=x<S and 0<=y<S else None
    hl=TAU*t; hl2=(hl+math.pi)%TAU          # dos destellos que recorren el anillo
    rot_r=TAU/4*t                            # runas: 8 celdas por ciclo -> bucle exacto
    rot_in=-TAU/8*t
    pulse=0.5+0.5*math.sin(TAU*t*2)

    for y in range(S):
        for x in range(S):
            r=rad(x,y); a=ang(x,y); back=(y+.5)<CY
            near1=adist(a,hl); near2=adist(a,hl2)
            if 1.02<r<=1.13:                   # aura en damero
                if (x+y)%2==0:
                    if near1<0.3: px[x,y]=CYAN if r<1.07 else TEAL
                    elif near2<0.3: px[x,y]=GOLD2 if r<1.07 else GOLD
                    elif (x+2*y)%8==0: px[x,y]=OUT
            elif 0.975<r<=1.02: px[x,y]=OUT     # contorno
            elif 0.935<r<=0.975:                # línea exterior
                c=BLUE if back else TEAL
                if near1<0.5: c=MINT if near1<0.2 else CYAN
                elif near2<0.5: c=WG if near2<0.2 else GOLDL
                px[x,y]=c
            elif 0.80<r<=0.935:                 # banda de runas grabadas
                cells=32; ua=((a-rot_r)%TAU)/(TAU/cells)
                k=int(ua); u=ua-k; v=(r-0.80)/0.135
                g=GLYPHS[k%8]; col=int(u*4)
                midrow = (0.28<v<0.72) or abs(math.sin(a))>0.75
                on = midrow and col<3 and (g[col] or g[3+col])
                if on:
                    c=BLUE if back else TEAL
                    if near1<0.7: c=CYAN if near1>0.3 else MINT
                    elif near2<0.7: c=GOLD2 if near2>0.3 else GOLDL
                else:
                    c=DK if back else NAVY
                px[x,y]=c
            elif 0.765<r<=0.80: px[x,y]=OUT
            elif 0.73<r<=0.765:                 # línea interior fina
                c=BLUE2 if back else BLUE
                if near1<0.4: c=CYAN
                if near2<0.4: c=GOLDL
                px[x,y]=c
            elif 0.705<r<=0.73: px[x,y]=DK

    # hexagrama inscrito (gira 60 grados por ciclo)
    base=TAU/6*t
    def line(p,q,colf):
        (x0,y0),(x1,y1)=p,q; n=int(max(abs(x1-x0),abs(y1-y0))*2)+1
        for i in range(n+1):
            s=i/n; put(x0+(x1-x0)*s,y0+(y1-y0)*s,colf(s))
    for tri in (0,1):
        angs=[base+tri*TAU/6+i*TAU/3 for i in range(3)]
        pts=[proj(0.70,a) for a in angs]
        for i in range(3):
            a0,a1=angs[i],angs[(i+1)%3]
            # un pulso de luz dorada viaja por cada línea
            def cf(s,i=i,tri=tri):
                ph=(t*2+i/3+tri/6)%1
                d=abs(s-ph)
                if d<0.04: return WG
                if d<0.10: return GOLD2
                return BLUE2 if (math.sin(a0)+math.sin(a1))/2<0 else BLUE
            line(pts[i],pts[(i+1)%3],cf)
    # nodos en las puntas + pilares de luz que parpadean
    for i in range(6):
        a=base+i*TAU/6; X,Y=proj(0.70,a)
        put(X,Y,GOLDL); put(X-1,Y,GOLD); put(X+1,Y,GOLD)
        hgt=int(2+3*(0.5+0.5*math.sin(TAU*(t*2)+i)))
        for h in range(1,hgt+1):
            if h%2==1 or h<3: put(X,Y-h, GOLDL if h<2 else GOLD2 if h<4 else GOLD)

    # anillo interior dorado discontinuo (gira al revés)
    for y in range(S):
        for x in range(S):
            r=rad(x,y)
            if 0.40<r<=0.46:
                a=ang(x,y); back=(y+.5)<CY
                k=int(((a-rot_in)%TAU)/(TAU/16))
                if k%2==0: px[x,y]=GOLD if back else GOLD2
                elif back: px[x,y]=GD
            elif 0.46<r<=0.49 and (y+.5)>=CY: px[x,y]=DK
            elif 0.20<r<=0.235:
                px[x,y]=TEAL if (y+.5)>=CY else BLUE2

    # ondas que convergen despacio
    for w in range(2):
        r=0.68*(1-((t*2+w*0.5)%1))
        if 0.26<r<0.66:
            for i in range(72):
                if i%2: continue
                a=TAU*i/72; X,Y=proj(r,a)
                if get(X,Y) is None or get(X,Y)[3]==0 or r<0.4:
                    put(X,Y, CYAN if r>0.45 else GOLDL)

    # partículas de maná: 30, cada una tarda el bucle entero en ser absorbida
    arrivals=0
    for a0,off,h0,sg,r0 in PARTS:
        def pos(p):
            e=p**1.3
            r=r0*(1-e)+0.02; a=a0+sg*(1-e)*2.6; z=h0*(1-p)**1.6
            return proj(r,a,z)
        p=(t+off)%1
        if p>0.96: arrivals+=1; continue
        cols=[TEAL,CYAN,MINT] if p<0.55 else [GOLD,GOLD2,GOLDL] if p<0.85 else [GOLD2,GOLDL,WG]
        for j,dp in enumerate((0.03,0.015,0)):
            if p-dp<0: continue
            X,Y=pos(p-dp); put(X,Y,cols[j])

    # núcleo que late y absorbe
    cr=3.0+1.8*pulse+0.8*min(arrivals,1)
    for y in range(S):
        for x in range(S):
            e=((x+.5-CX)/cr)**2+((y+.5-CY)/(cr*0.5))**2
            if e<=1:
                px[x,y]=WG if e<0.12 else GOLDL if e<0.35 else GOLD2 if e<0.65 else GOLD
    # brillo vertical corto (se carga, aún no se activa)
    col_h=int(3+5*pulse)
    for h in range(1,col_h):
        put(CX-.5,CY-1.5-h, WG if h<3 else GOLDL if h<5 else GOLD2)
        if h<3: put(CX-1.5,CY-1.5-h,GOLD2); put(CX+.5,CY-1.5-h,GOLD2)
    if arrivals:   # destello en cruz cuando entra una partícula
        for d in (1,2,3):
            put(CX-.5-cr-d+1,CY-.5,GOLDL if d<3 else GOLD); put(CX-.5+cr+d-1,CY-.5,GOLDL if d<3 else GOLD)
    # motas que suben lentamente
    for dx,off,ph in MOTES:
        p=(t+off)%1
        X=CX-.5+dx*(1-p*0.5)+1.2*math.sin(ph+TAU*p*2); Y=CY-4-p*38
        if p<0.92: put(X,Y, WG if p<0.25 else GOLDL if p<0.5 else CYAN if p<0.75 else TEAL)
    return im

sheet=Image.new('RGBA',(S*N,S),(0,0,0,0))
for i in range(N): sheet.paste(frame(i),(S*i,0))
SALIDA.parent.mkdir(parents=True, exist_ok=True)
sheet.save(SALIDA)
