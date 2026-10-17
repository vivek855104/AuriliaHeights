/* Aurelia Heights: the full 2 BHK sample flat, walked room by room.
   Loaded on demand (a plain <script> tag, so it also works when index.html is opened straight from disk) the first
   time a 2 BHK flat is opened, so the site never pays for it otherwise. It registers window.AureliaFlat.buildFlat.
   Every static piece is collected per material and merged into one mesh each, which keeps the whole flat to a few
   dozen draw calls. The shared materials, helpers, the view outside and the time-of-day hooks come from the page
   through `api`, so nothing here is duplicated.

   Plan (metres; +z faces the garden, the living room's glass wall sits at z = Z1 like the other sample flats):
     z  3.5 ┌──────────┬─────────────────┬──────────┐   balcony beyond the living room glass
            │ Bedroom 2│     Living      │  Master  │
     z -0.5 ├────┬─────┤                 ├─────┬────┤
            │Bath│pass │     Dining      │store│Bath│
     z -2.4 ├────┴─────┤                 ├─────┴────┤
            │ Kitchen  │                 │  Foyer   │   entry door in the foyer's back wall
     z -5.0 └──────────┴─────────────────┴──────────┘
           x -6      -2.4               2.4         6                                                      */
(function(){
function buildFlat(api,unit){
  const {THREE,mergeGeometries,M,rbox,scaled,contactMat,pillowGeo,drapeGeo,bladeClump,roomExterior,rng,fbm,cnv,LOW,Z1}=api;
  /* the plan is drawn at a compact size and enlarged here: walls, floors, windows and doors stretch by K across the
     floor (about the garden glass, which must stay where the tower facade is), and the ceiling rises to RH.
     Furniture is never stretched: each group is anchored to the wall it stands against and moves with it (fur) */
  const K=1.18,RH=3.1,ap=(x,z)=>[x*K,Z1+(z-Z1)*K];
  const PI=Math.PI,S=new THREE.Scene(),owned=S.userData.owned=[];
  const own=m=>{owned.push(m);return m;};
  const G=new THREE.Group();S.add(G);
  const rr=rng(2202);

  /* ── batching: static geometry is baked in place and merged per material at the end ── */
  let ARCH=true,SH=[0,0];
  const arch=()=>{ARCH=true;SH=[0,0];};
  const fur=(ax,az)=>{ARCH=false;const q=ap(ax,az);SH=[q[0]-ax,q[1]-az];};
  const AM=new THREE.Matrix4().makeTranslation(0,0,Z1).multiply(new THREE.Matrix4().makeScale(K,1,K)).multiply(new THREE.Matrix4().makeTranslation(0,0,-Z1));
  const buckets=new Map(),tmpM=new THREE.Matrix4(),tmpQ=new THREE.Quaternion(),tmpE=new THREE.Euler(),tmpV=new THREE.Vector3(),one=new THREE.Vector3(1,1,1);
  function add(geo,mat,x,y,z,rx,ry,rz,shadow){
    tmpE.set(rx||0,ry||0,rz||0);tmpQ.setFromEuler(tmpE);tmpM.compose(tmpV.set(x,y,z),tmpQ,one);
    let g=geo.index?geo.toNonIndexed():geo;if(g!==geo)geo.dispose();g.applyMatrix4(tmpM);
    if(ARCH)g.applyMatrix4(AM);else g.translate(SH[0],0,SH[1]);
    ['position','normal','uv'].forEach(k=>{if(!g.attributes[k]&&k==='uv')g.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count*2),2));});
    Object.keys(g.attributes).forEach(k=>{if(!['position','normal','uv'].includes(k))g.deleteAttribute(k);});
    const key=mat.uuid+(shadow===false?'n':'s');
    if(!buckets.has(key))buckets.set(key,{mat,shadow:shadow!==false,list:[]});
    buckets.get(key).list.push(g);}
  const B=(w,h,d,x,y,z,mat,o)=>{o=o||{};add(rbox(w,h,d,o.r===undefined?.006:o.r),mat,x,y,z,o.rx,o.ry,o.rz,o.s);};
  const C=(r,h,x,y,z,mat,o)=>{o=o||{};add(new THREE.CylinderGeometry(o.r2===undefined?r:o.r2,r,h,o.seg||20,1),mat,x,y,z,o.rx,o.ry,o.rz,o.s);};
  const P=(w,h,x,y,z,mat,rx,ry,o)=>{o=o||{};add(new THREE.PlaneGeometry(w,h),mat,x,y,z,rx,ry,0,o.s===undefined?false:o.s);};
  const flush=()=>{buckets.forEach(b=>{const m=new THREE.Mesh(mergeGeometries(b.list,false),b.mat);
    b.list.forEach(g=>g.dispose());m.castShadow=b.shadow;m.receiveShadow=true;G.add(m);});buckets.clear();};
  const contact=(x,z,w,d)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),contactMat());
    m.rotation.x=-PI/2;m.position.set(x+SH[0],.008,z+SH[1]);m.renderOrder=1;G.add(m);};

  /* ── materials owned by this flat (released when the flat is left) ── */
  const std=(o)=>own(new THREE.MeshStandardMaterial(o));
  const paint=std({color:0xf6f0e4,roughness:.94});
  const paintSage=std({color:0x86b08a,roughness:.9});
  const paintClay=std({color:0xdd9670,roughness:.9});
  const lacquer=std({color:0x2c6b55,roughness:.4});            // kitchen base units, deep emerald
  const lacquerLt=std({color:0xe9e3d7,roughness:.38});         // wall units
  const quartz=own(new THREE.MeshPhysicalMaterial({color:0xf3f0ea,roughness:.22,clearcoat:.3,clearcoatRoughness:.3}));
  const ceramic=own(new THREE.MeshPhysicalMaterial({color:0xf4f1ea,roughness:.25,clearcoat:.5,clearcoatRoughness:.2}));
  const blackGlass=own(new THREE.MeshPhysicalMaterial({color:0x0c0d0e,roughness:.12,metalness:.1,clearcoat:1}));
  const glassR=own(new THREE.MeshPhysicalMaterial({color:0xffffff,roughness:.02,transparent:true,opacity:.07,
    envMapIntensity:.5,depthWrite:false,side:THREE.DoubleSide}));
  const showerGlass=own(new THREE.MeshPhysicalMaterial({color:0xdfeceb,roughness:.05,transparent:true,opacity:.18,depthWrite:false,side:THREE.DoubleSide}));
  const ledM=std({color:0xfff3df,emissive:0xffd9a6,emissiveIntensity:1.6,roughness:.6});
  const downM=std({color:0xfff6e8,emissive:0xffe2b8,emissiveIntensity:2.2,roughness:.6});
  const shade=own(new THREE.MeshStandardMaterial({color:0xf2e6d0,emissive:0xffc78a,emissiveIntensity:.2,roughness:.9,side:THREE.DoubleSide}));
  /* a canvas tile texture: square tiles with fine grout, repeated at a real size */
  function tileMat(color,grout,cell,w,h,rough){
    const[c,x]=cnv(256);x.fillStyle=color;x.fillRect(0,0,256,256);
    const n=fbm(9,6,2),im=x.getImageData(0,0,256,256);
    for(let i=0;i<256*256;i++){const k=.94+n((i%256)/256,(i>>8)/256)*.12;im.data[i*4]*=k;im.data[i*4+1]*=k;im.data[i*4+2]*=k;}
    x.putImageData(im,0,0);x.fillStyle=grout;x.fillRect(0,0,256,5);x.fillRect(0,0,5,256);
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;
    t.repeat.set(w/cell,h/cell);t.anisotropy=8;owned.push(t);return std({map:t,roughness:rough===undefined?.35:rough});}
  const fabric=(base,col,o)=>{const m=own(base.clone());m.color=new THREE.Color(col);Object.assign(m,o||{});return m;};
  const sofaM=fabric(M.velvetLt,0xe0c48f,{roughness:.86,sheen:.5});
  const chairM=fabric(M.velvetLt,0x3f8f78,{roughness:.86,sheen:.5});
  const mustardM=fabric(M.velvet,0xd99a2b,{roughness:.84,sheen:.5});
  const bed2M=fabric(M.linen,0x5f97c4,{roughness:.9});
  const headM=fabric(M.velvet,0xd3a465,{roughness:.84,sheen:.5});
  const pillowM=fabric(M.linen,0xffffff,{});
  const duvetM=fabric(M.duvet,0xffffff,{side:THREE.DoubleSide,sheen:.45});
  const leafM=c=>own(M.foliageFn(1.5,{color:c,side:THREE.DoubleSide,roughness:.5}));

  /* ── floors and ceiling ── */
  const floorWood=own(scaled(M.floor,12,8.5,2.1));
  const floorStone=own(scaled(M.stone,1,1,1));
  P(12,8.5,0,0,-.75,floorWood,-PI/2,0);
  P(3.58,2.58,-4.21,.003,-3.71,tileMat('#d8d2c6','#b9b1a3',.6,3.58,2.58,.5),-PI/2,0);          // kitchen
  P(2.1,1.68,-4.95,.003,-1.46,tileMat('#cfcac0','#a9a397',.4,2.1,1.68,.55),-PI/2,0);           // common bath
  P(2.1,1.68,4.95,.003,-1.46,tileMat('#cfcac0','#a9a397',.4,2.1,1.68,.55),-PI/2,0);            // master bath
  P(3.58,2.58,4.21,.003,-3.71,tileMat('#e2dccf','#c6bead',.8,3.58,2.58,.4),-PI/2,0);           // foyer
  P(12,8.5,0,RH,-.75,M.ceil,PI/2,0);
  /* a dropped ceiling band over the living room with a warm cove, and recessed downlights in every room */
  B(4.6,.12,.5,0,RH-.06,-.25,paint,{s:false});B(.4,.12,4,-2.1,RH-.06,1.5,paint,{s:false});B(.4,.12,4,2.1,RH-.06,1.5,paint,{s:false});
  B(3.8,.03,.04,0,RH-.135,.02,ledM,{s:false});
  const downs=[[0,2.2],[0,.8],[-1,-2.9],[1,-2.9],[-4.2,-3.2],[-4.2,-4.2],[-4.2,1.5],[4.2,1.5],[4.2,-3.7],[4.95,-1.46],[-4.95,-1.46]];
  downs.forEach(q=>C(.06,.015,q[0],RH-.008,q[1],downM,{s:false,seg:16}));

  /* ── walls: axis-aligned slabs with openings [from, to, sill, head] measured along the wall ── */
  const TE=.2,TI=.12;
  function wall(axis,at,a0,a1,t,ops,mat){
    ops=(ops||[]).slice().sort((p,q)=>p[0]-q[0]);let u=a0;mat=mat||paint;
    const seg=(u0,u1,y0,y1)=>{if(u1-u0<.01||y1-y0<.01)return;const m=(u0+u1)/2,l=u1-u0,yc=(y0+y1)/2,h=y1-y0;
      if(axis==='x')B(t,h,l,at,yc,m,mat,{r:0});else B(l,h,t,m,yc,at,mat,{r:0});};
    ops.forEach(o=>{seg(u,o[0],0,RH);seg(o[0],o[1],0,o[2]);seg(o[0],o[1],o[3],RH);u=o[1];});seg(u,a1,0,RH);}
  /* exterior */
  wall('z',Z1,-6.2,6.2,TE,[[-5.1,-3.3,.9,2.4],[-2.2,2.2,0,2.62],[3.3,5.1,.9,2.4]]);
  wall('z',-5.1,-6.2,6.2,TE,[[3.7,4.7,0,2.15]]);
  wall('x',-6.1,-5.2,3.6,TE,[[-4.4,-3.0,1.1,2.2],[-1.8,-1.2,1.9,2.4],[.6,2.4,.9,2.4]]);
  wall('x',6.1,-5.2,3.6,TE,[[-1.8,-1.2,1.9,2.4]]);
  /* interior */
  wall('x',-2.36,-5,3.5,TI,[[-4.2,-2.8,1.05,2.2],[-2.2,-.75,0,2.15]]);       // kitchen hatch + passage opening
  wall('x',2.36,-5,3.5,TI,[[-4.4,-2.9,0,2.3],[-.4,.5,0,2.15]]);             // foyer opening + master door
  wall('z',-.5,-6,-2.42,TI,[[-3.55,-2.65,0,2.15]]);                          // bedroom 2 door
  wall('z',-.5,2.42,6,TI,[[4.4,5.2,0,2.15]]);                                // master bath door
  wall('z',-2.36,-6,-2.42,TI,[[-3.7,-2.5,0,2.15]]);                        // kitchen opens off the passage
  wall('z',-2.36,2.42,6,TI,[[2.7,3.5,0,2.15]]); // kitchen / foyer back of the bath row
  wall('x',-3.84,-2.36,-.5,TI,[[-1.9,-1.1,0,2.15]]);                         // common bath door off the passage
  wall('x',3.84,-2.36,-.5,TI);
  /* feature walls */
  B(.02,RH-.01,4,-2.29,RH/2,1.5,paintSage,{r:0,s:false});                    // living: behind the TV
  B(3.56,RH-.01,.02,-4.21,RH/2,-.43,paintClay,{r:0,s:false});                // bedroom 2: behind the wardrobe line
  B(.02,RH-.01,4,6.0-.01,RH/2,1.5,paintSage,{r:0,s:false});                  // master: behind the bed

  /* skirting in the dry rooms */
  const sk=(x0,z0,x1,z1)=>{const l=Math.hypot(x1-x0,z1-z0);B(x0===x1?.014:l,.08,x0===x1?l:.014,(x0+x1)/2,.04,(z0+z1)/2,M.walnut,{r:0,s:false});};
  sk(-2.29,-.4,-2.29,3.38);sk(2.29,.6,2.29,3.38);sk(-2.29,-5,2.29,-5);sk(-5.99,-.4,-5.99,.55);sk(5.99,-.4,5.99,3.38);

  /* ── windows: slim bronze frames, clear glass, a stone sill ── */
  function windowZ(z,x0,x1,y0,y1,dir){const w=x1-x0,h=y1-y0,xc=(x0+x1)/2,yc=(y0+y1)/2;
    [[w+.06,.05,xc,y1],[w+.06,.05,xc,y0]].forEach(q=>B(q[0],q[1],.08,q[2],q[3],z,M.frameWarm,{s:false}));
    [x0,x1,xc].forEach(x=>B(.05,h,.08,x,yc,z,M.frameWarm,{s:false}));
    P(w,h,xc,yc,z,glassR,0,0);if(y0>.1)B(w+.16,.04,.26,xc,y0-.02,z-dir*.08,M.marble,{s:false});}
  function windowX(x,z0,z1,y0,y1,dir){const w=z1-z0,h=y1-y0,zc=(z0+z1)/2,yc=(y0+y1)/2;
    [[y1],[y0]].forEach(q=>B(.08,.05,w+.06,x,q[0],zc,M.frameWarm,{s:false}));
    [z0,z1].forEach(z=>B(.08,h,.05,x,yc,z,M.frameWarm,{s:false}));
    P(w,h,x,yc,zc,glassR,0,PI/2);if(y0>.3)B(.26,.04,w+.16,x-dir*.08,y0-.02,zc,M.marble,{s:false});}
  windowZ(Z1,-5.1,-3.3,.9,2.4,1);windowZ(Z1,3.3,5.1,.9,2.4,1);
  windowX(-6.1,-4.4,-3.0,1.1,2.2,-1);windowX(-6.1,.6,2.4,.9,2.4,-1);
  windowX(-6.1,-1.8,-1.2,1.9,2.4,-1);windowX(6.1,-1.8,-1.2,1.9,2.4,1);
  /* the living room's sliding glass wall to the balcony */
  B(4.46,.07,.12,0,2.62,Z1,M.frameWarm,{s:false});B(4.46,.05,.12,0,.025,Z1,M.frameWarm,{s:false});
  [-2.2,-1.1,0,1.1,2.2].forEach(x=>B(.06,2.58,.1,x,1.31,Z1,M.frameWarm,{s:false}));
  [-1.65,-.55,.55,1.65].forEach(x=>P(1.04,2.54,x,1.31,Z1,glassR,0,0));
  B(.02,.3,.04,-.12,1.1,Z1-.07,M.brass,{s:false});

  /* ── doors: walnut leaves in slim frames. Bedroom doors stand open flat into their rooms, the baths have
     pocket doors slid into the wall (only the frame shows), the store and the entry door are closed ── */
  function door(hx,hz,phi,w,openA){const p=phi+openA,dx=Math.cos(p),dz=Math.sin(p);
    B(w,2.1,.04,hx+dx*w/2,1.05,hz+dz*w/2,M.walnut,{ry:-p});
    C(.012,.12,hx+dx*(w-.07)+(-dz)*.05,1.02,hz+dz*(w-.07)+dx*.05,M.brass,{rx:PI/2,ry:-p,s:false,seg:10});}
  door(-2.65,-.5,PI,.88,-PI/2);               // bedroom 2: hinged by the living wall, open along it
  door(2.36,.5,-PI/2,.88,PI/2);               // master bedroom: open into the room, clear of the dresser
  door(2.7,-2.36,0,.78,0);                    // store, closed
  /* entry: a wider, heavier walnut door with a vertical brass pull and a frame */
  B(1.0,2.15,.06,4.2,1.075,-5.0,M.walnut);B(1.12,2.24,.04,4.2,1.12,-4.97,M.frameWarm,{s:false});
  B(.03,.9,.03,4.58,1.1,-4.93,M.brass,{s:false});
  const frames=[[-3.1,-.5,.9,'z'],[4.8,-.5,.8,'z'],[-3.84,-1.5,.8,'x'],[2.36,.05,.9,'x']];
  frames.forEach(([x,z,w,a])=>{if(a==='z'){B(w+.1,.05,.16,x,2.17,z,M.frameWarm,{s:false});[-1,1].forEach(s=>B(.05,2.15,.16,x+s*(w/2+.02),1.07,z,M.frameWarm,{s:false}));}
    else{B(.16,.05,w+.1,x,2.17,z,M.frameWarm,{s:false});[-1,1].forEach(s=>B(.16,2.15,.05,x,1.07,z+s*(w/2+.02),M.frameWarm,{s:false}));}});

  fur(4.2,-2.36);
  /* ── foyer: shoe cabinet with a mirror and a console bowl ── */
  B(1.6,.9,.38,4.2,.47,-2.62,M.walnut);B(1.64,.03,.4,4.2,.935,-2.62,M.marble);
  [3.66,4.2,4.74].forEach(x=>B(.006,.8,.006,x+.27,.47,-2.815,M.frame,{s:false,r:0}));
  B(.9,1.1,.02,4.2,1.65,-2.44,M.mirror,{s:false});B(.96,1.16,.015,4.2,1.65,-2.446,M.brassDark,{s:false});
  C(.16,.06,4.0,.98,-2.62,ceramic,{r2:.11});
  fur(4.2,-4.3);  B(.6,.01,1.1,4.2,.004,-4.3,own(scaled(M.rug,.6,1.1,1)),{s:false});

  /* ── living room ── */
  fur(.15,1.7);  const rugM=own(scaled(M.rug,2.8,2.3,2.6));
  P(2.9,2.3,.15,.006,1.7,rugM,-PI/2,0);
  fur(2.36,1.75);
  /* three-seat sofa against the master wall, facing the TV */
  const SX=1.78,SZ=1.75;
  B(.92,.24,2.4,SX,.3,SZ,M.walnut,{r:.02});
  [-0.78,0,.78].forEach(o=>add(pillowGeo(.82,.2,.78,10,7+o,.35),sofaM,SX-.04,.52,SZ+o,0,0,0));
  add(pillowGeo(.2,.62,2.36,10,4,.3),sofaM,SX+.38,.82,SZ,0,0,0);
  [-1,1].forEach(s=>B(.92,.52,.16,SX,.5,SZ+s*1.26,sofaM,{r:.05}));
  [[.12,1.08],[-.1,2.4]].forEach((q,i)=>add(pillowGeo(.14,.42,.44,8,20+i,.3),i?chairM:mustardM,SX+.22,.82,SZ+q[0]+(i?.6:-.6),0,0,.18));
  contact(SX,SZ,1.4,2.8);
  fur(.25,1.75);
  /* round marble coffee table and a side table */
  C(.5,.04,.25,.42,1.75,M.marble,{seg:40});C(.32,.38,.25,.2,1.75,M.walnut,{r2:.26,seg:24});
  fur(2.36,.42);  C(.2,.035,1.62,.56,.42,M.marble,{seg:28});C(.025,.54,1.62,.28,.42,M.brass,{seg:10});
  fur(.25,1.75);  add(new THREE.TorusGeometry(.1,.012,8,24),M.brass,.15,.45,1.68,PI/2,0,0,false);
  B(.24,.03,.32,.4,.455,1.9,M.paper,{s:false});
  fur(-1.35,2.85);
  /* accent lounge chair by the glass */
  const LCX=-1.35,LCZ=2.85;
  B(.72,.16,.72,LCX,.4,LCZ,chairM,{r:.07,ry:.6});B(.72,.5,.14,LCX-.21,.72,LCZ-.27,chairM,{r:.06,ry:.6});
  [[-.28,-.28],[.28,-.28],[-.28,.28],[.28,.28]].forEach(q=>{const c=Math.cos(.6),s=Math.sin(.6);
    B(.04,.32,.04,LCX+q[0]*c+q[1]*s,.16,LCZ-q[0]*s+q[1]*c,M.walnut,{r:.01});});
  contact(LCX,LCZ,1.1,1.1);
  fur(-2.36,1.5);
  /* TV wall: walnut slats, a low floating console and the screen */
  for(let i=0;i<22;i++)B(.035,2.5,.07,-2.25,1.3,.45+i*.1,M.walnut,{r:.012});
  B(.46,.42,2.1,-2.02,.42,1.5,M.walnut,{r:.02});B(.44,.02,2.06,-2.02,.2,1.5,M.frameWarm,{s:false});
  B(.05,.82,1.42,-2.18,1.45,1.5,M.frame);B(.012,.76,1.36,-2.152,1.45,1.5,M.screen,{s:false});
  C(.06,.18,-2.0,.72,.85,ceramic,{r2:.04});C(.09,.08,-2.0,.67,2.2,ceramic,{r2:.07});
  fur(2.36,.5);
  /* arc floor lamp over the sofa */
  C(.17,.03,1.9,.015,.42+.1,M.marble,{seg:28});C(.016,1.9,1.9,.96,.5,M.brass,{seg:8});
  add(new THREE.CylinderGeometry(.12,.2,.2,24,1,true),shade,1.9,1.98,.5,0,0,0,false);
  arch();
  /* sheer curtains either side of the glass */
  [-2.05,2.05].forEach((x,i)=>{const w=.5,h=2.5,g=new THREE.PlaneGeometry(w,h,24,6),p=g.attributes.position;
    for(let k=0;k<p.count;k++){const u=(p.getX(k)+w/2)/w;p.setZ(k,Math.sin(u*PI*8+i)*.04);}g.computeVertexNormals();
    const m=new THREE.Mesh(g,M.sheer);m.position.set(x*K,h/2+.1,Z1-.16);G.add(m);});
  B(4.3,.02,.02,0,2.62,Z1-.16,M.brassDark,{s:false});
  /* plants */
  const plant=(x,z,h,n,seed,col,pot)=>{C(pot||.2,.42,x,.21,z,ceramic,{r2:(pot||.2)*.78});
    const m=new THREE.Mesh(bladeClump(n,h,h*.09,h*.42,seed,6),leafM(col));m.position.set(x+SH[0],.4,z+SH[1]);m.castShadow=true;G.add(m);};
  fur(-1.95,3.15);plant(-1.95,3.15,1.15,16,51,0x3e8a46,.22);fur(2.36,.25);plant(2.0,.25,.8,12,52,0x4f8a43);

  fur(0,-2.85);
  /* ── dining ── */
  const DX=0,DZ=-2.85;
  B(1.9,.05,.98,DX,.75,DZ,M.marble,{r:.015});
  [[-.78,-.36],[.78,-.36],[-.78,.36],[.78,.36]].forEach(q=>B(.06,.72,.06,DX+q[0],.36,DZ+q[1],M.walnut,{r:.01}));
  B(1.6,.05,.05,DX,.12,DZ,M.walnut,{r:.01});
  const chair=(x,z,ry)=>{const c=Math.cos(ry),s=Math.sin(ry),P2=(lx,lz)=>[x+lx*c+lz*s,z-lx*s+lz*c];
    let q=P2(0,0);B(.46,.06,.46,q[0],.46,q[1],chairM,{r:.025,ry});q=P2(0,-.21);B(.44,.42,.05,q[0],.72,q[1],M.walnut,{r:.02,ry,rx:-.08});
    [[-.19,-.19],[.19,-.19],[-.19,.19],[.19,.19]].forEach(l=>{const p=P2(l[0],l[1]);B(.035,.44,.035,p[0],.22,p[1],M.walnut,{r:.008});});};
  [-.6,.6].forEach(o=>{chair(DX+o,DZ-.72,0);chair(DX+o,DZ+.72,PI);});chair(DX-1.22,DZ,-PI/2);chair(DX+1.22,DZ,PI/2);
  contact(DX,DZ,2.6,2.1);
  /* linear pendant over the table */
  B(1.3,.05,.12,DX,1.62,DZ,M.brassDark);B(1.24,.012,.09,DX,1.594,DZ,ledM,{s:false});
  [-.55,.55].forEach(o=>C(.004,RH-1.65,DX+o,(RH+1.65)/2,DZ,M.steel,{s:false,seg:4}));
  C(.06,.22,DX+.3,.88,DZ,ceramic,{r2:.035,seg:16});
  fur(2.36,-1.6);
  /* sideboard on the foyer wall, with art above */
  B(.42,.74,1.6,2.07,.45,-1.6,M.walnut,{r:.015});B(.44,.03,1.62,2.07,.835,-1.6,M.marble);
  [-.4,.4].forEach(o=>B(.01,.6,.76,1.855,.45,-1.6+o,M.walnut,{s:false}));
  B(.03,.8,1.1,2.28,1.6,-1.6,M.art);B(.035,.86,1.16,2.29,1.6,-1.6,M.brassDark,{s:false});
  C(.05,.24,2.05,.97,-2.1,ceramic,{r2:.03});

  fur(-6,-5);
  /* ── modular kitchen: an L of base units, wall units on the back run, hob with chimney, sink under the window ── */
  const KZ=-5.0+.3,KX=-6.0+.3,CT=.9;                       // back-run and window-run base unit centre lines, counter top height
  /* back run along z=-5: x from -5.9 to -3.45, the tall fridge unit sits beyond it */
  B(2.45,.1,.52,-4.675,.05,KZ+.02,M.frame,{r:0});                                  // recessed plinth
  B(2.45,.74,.58,-4.675,.47,KZ,lacquer,{r:.005});
  B(2.47,.04,.62,-4.675,CT-.02,KZ+.01,quartz,{r:.004});
  /* window run along x=-6: z from -4.42 to -2.5 */
  B(.52,.1,1.92,KX+.02,.05,-3.46,M.frame,{r:0});
  B(.58,.74,1.92,KX,.47,-3.46,lacquer,{r:.005});
  B(.62,.04,1.96,KX+.01,CT-.02,-3.48,quartz,{r:.004});
  /* door and drawer seams with slim brass pulls */
  [-5.5,-4.9,-4.3,-3.75].forEach(x=>B(.006,.72,.006,x,.47,KZ+.293,M.frame,{s:false,r:0}));
  [-5.2,-4.6,-4.02].forEach(x=>B(.32,.012,.012,x,.8,KZ+.3,M.brass,{s:false,r:0}));
  [-3.94,-3.34,-2.84].forEach(z=>B(.006,.72,.006,KX+.293,.47,z,M.frame,{s:false,r:0}));
  [-4.1,-3.6,-3.1,-2.7].forEach(z=>B(.012,.012,.3,KX+.3,.8,z,M.brass,{s:false,r:0}));
  /* built-in oven under the hob */
  B(.58,.56,.01,-4.6,.5,KZ+.296,blackGlass,{s:false,r:0});B(.5,.012,.012,-4.6,.74,KZ+.31,M.steel,{s:false,r:0});
  /* hob: black glass with four rings, chimney hood and its duct */
  B(.62,.012,.5,-4.6,CT+.006,KZ+.02,blackGlass,{s:false,r:.004});
  [[-.14,-.1],[.14,-.1],[-.14,.12],[.14,.12]].forEach(q=>add(new THREE.TorusGeometry(q[1]>0?.07:.09,.006,6,28),M.steel,-4.6+q[0],CT+.014,KZ+.02+q[1],PI/2,0,0,false));
  add(new THREE.CylinderGeometry(.16,.45,.34,4,1),M.steel,-4.6,1.72,KZ-.02,0,PI/4,0);
  B(.28,RH-1.89,.24,-4.6,(RH+1.89)/2,KZ-.08,M.steel,{r:.004});
  /* wall units, with an LED strip beneath */
  [[-5.55,.7],[-3.95,.7]].forEach(q=>{B(q[1],.72,.34,q[0],1.86,-4.83,lacquerLt,{r:.004});B(.006,.7,.006,q[0],1.86,-4.655,M.frame,{s:false,r:0});
    B(.3,.012,.012,q[0]+(q[0]<-4.6?.15:-.15),1.54,-4.65,M.brass,{s:false,r:0});B(q[1]-.06,.012,.03,q[0],1.495,-4.72,ledM,{s:false});});
  /* backsplash tiles on both runs */
  const splash=tileMat('#4f9e86','#3c7a68',.15,2.45,.6,.25);
  P(2.45,.6,-4.675,CT+.3,-4.995,splash,0,0);P(1.92,.2,-5.995,CT+.1,-3.46,splash,0,PI/2);
  P(.4,1.3,-5.995,CT+.65,-4.75,splash,0,PI/2);P(.5,1.3,-5.995,CT+.65,-2.75,splash,0,PI/2);
  /* sink and a tall arched tap under the window */
  B(.5,.02,.42,KX+.02,CT+.004,-3.7,M.steel,{s:false,r:.01});B(.44,.16,.36,KX+.02,CT-.08,-3.7,M.frame,{s:false,r:.02});
  C(.018,.36,KX-.18,CT+.18,-3.7,M.steel,{seg:10});
  add(new THREE.TorusGeometry(.1,.016,8,20,PI),M.steel,KX-.08,CT+.36,-3.7,0,0,0,false);
  /* tall fridge unit and the microwave niche at the end of the back run */
  B(.78,2.2,.64,-3.03,1.1,KZ+.02,lacquerLt,{r:.01});
  B(.006,1.3,.006,-3.03,.66,KZ+.345,M.frame,{s:false,r:0});
  B(.012,.6,.012,-2.7,1.0,KZ+.35,M.brass,{s:false,r:0});
  B(.56,.32,.02,-3.03,1.66,KZ+.34,blackGlass,{s:false,r:.004});
  fur(-2.36,-3.5);
  /* breakfast counter in the hatch to the dining room, with two stools */
  B(.5,.04,1.45,-2.36,1.08,-3.5,quartz,{r:.006});
  [-3.9,-3.1].forEach(z=>{C(.18,.05,-1.92,.76,z,chairM,{seg:24});C(.018,.74,-1.92,.38,z,M.brassDark,{seg:8});
    add(new THREE.TorusGeometry(.15,.01,6,24),M.brassDark,-1.92,.28,z,PI/2,0,0,false);});
  fur(-6,-5);
  /* counter dressing */
  C(.1,.16,-5.6,CT+.08,-4.75,ceramic,{r2:.08});B(.36,.025,.24,-5.3,CT+.013,-4.78,M.teak,{r:.008});
  plant(-5.75,-2.75,.35,8,57,0x5a9a44,.08);

  fur(6,1.55);
  /* ── master bedroom ── */
  const MBX=5.05,MBZ=1.55;
  for(let i=0;i<8;i++)B(.1,1.08,.27,5.92,1.0,MBZ-1.05+i*.3,headM,{r:.045});
  B(.08,.06,2.5,5.92,1.6,MBZ,M.walnut,{r:.01});
  B(2.05,.22,1.95,MBX,.17,MBZ,M.walnut,{r:.02});B(1.95,.1,1.85,MBX,.05,MBZ,M.frameWarm,{s:false});
  B(2.0,.32,1.88,MBX-.02,.44,MBZ,pillowM,{r:.07});
  const dv=new THREE.Mesh(drapeGeo(MBX-.26,MBZ,1.5,1.9,.66,.07,.18,.014,11,60,60),duvetM);dv.position.set(SH[0],0,SH[1]);
  dv.castShadow=dv.receiveShadow=true;G.add(dv);
  [MBZ-.45,MBZ+.45].forEach((z,i)=>{add(pillowGeo(.5,.18,.72,12,i+2,.4),pillowM,5.6,.72,z,0,0,0);
    add(pillowGeo(.16,.5,.5,10,i+7,.22),headM,5.82,.88,z,0,0,-.1);});
  contact(MBX,MBZ,2.5,2.4);
  [MBZ-1.25,MBZ+1.25].forEach(z=>{B(.44,.32,.44,5.72,.44,z,M.walnut,{r:.02});B(.46,.025,.46,5.72,.61,z,M.marble);
    const lp=new THREE.Mesh(new THREE.SphereGeometry(.08,18,12),ceramic);lp.scale.set(1,1.15,1);lp.position.set(5.72+SH[0],.71,z+SH[1]);lp.castShadow=true;G.add(lp);
    add(new THREE.CylinderGeometry(.09,.13,.18,24,1,true),shade,5.72,.98,z,0,0,0,false);});
  P(2.2,2.6,4.35,.006,MBZ,own(scaled(M.rug,2.2,2.6,2.4)),-PI/2,0);
  fur(2.36,2.12);
  /* full-height wardrobe on the living-room wall: four sliding panels with fluted glass inserts */
  B(.62,2.5,2.4,2.73,1.25,2.12,M.walnut,{r:.008});
  [1.22,1.82,2.42,3.02].forEach(z=>{B(.012,2.4,.004,3.045,1.25,z-.3,M.frame,{s:false,r:0});
    B(.01,1.8,.36,3.045,1.3,z,blackGlass,{s:false,r:.004});});
  fur(3.2,-.5);
  /* dresser with a round mirror on the back wall */
  B(1.3,.74,.44,3.2,.42,-.22,M.walnut,{r:.015});B(1.32,.025,.46,3.2,.8,-.22,M.marble);
  C(.42,.02,3.2,1.55,-.43,M.mirror,{rx:PI/2,seg:40,s:false});
  add(new THREE.TorusGeometry(.42,.015,8,48),M.brassDark,3.2,1.55,-.42,0,0,0,false);
  fur(6,1.55);  B(1.0,.42,.42,4.35,.24,MBZ,mustardM,{r:.06});                                       // bench at the foot of the bed
  fur(2.36,3.5);  plant(3.4,3.15,.9,12,61,0x3f8a47);

  arch();
  /* ── master bath: vanity with a stone top, wall-hung WC, glass shower with a rain head, tiled walls ── */
  const mbTile=tileMat('#e7e2d8','#cfc7b8',.3,2.1,2.2,.3);
  P(2.08,2.2,4.95,1.1,-2.29,mbTile,0,0);P(1.66,2.2,5.99,1.1,-1.46,mbTile,0,-PI/2);P(1.66,2.2,3.91,1.1,-1.46,mbTile,0,PI/2);
  P(.52,2.2,4.16,1.1,-.63,mbTile,0,PI);P(.78,2.2,5.6,1.1,-.63,mbTile,0,PI);
  fur(4.45,-2.36);  B(.9,.16,.5,4.45,.78,-2.04,M.walnut,{r:.02});B(.92,.04,.52,4.45,.88,-2.04,M.marble,{r:.01});
  C(.17,.13,4.45,.96,-2.06,ceramic,{r2:.14,seg:28});C(.012,.2,4.45,1.0,-2.27,M.brass,{seg:8});
  B(.7,.8,.02,4.45,1.6,-2.28,M.mirror,{s:false});B(.012,.012,.6,4.45,2.04,-2.2,ledM,{s:false,ry:PI/2});
  fur(3.84,-1.2);  B(.38,.36,.54,3.98+.2,.44,-1.2,ceramic,{r:.12});B(.36,.5,.12,3.98+.06,.62,-1.2,ceramic,{r:.04});
  fur(6,-1.46);  B(.02,2.0,1.3,5.1,1.0,-1.65,showerGlass,{s:false,r:0});B(.03,.03,1.3,5.1,2.0,-1.65,M.brassDark,{s:false});
  C(.14,.012,5.55,2.2,-1.46,M.steel,{seg:24,s:false});C(.01,.25,5.55,2.33,-1.46,M.steel,{seg:6,s:false});
  fur(6,-2.36);  B(.02,.5,.02,5.98,1.3,-1.1,M.steel,{s:false});B(.5,.02,.02,5.75,1.05,-2.25,M.brass,{s:false});
  B(.04,.5,.3,5.75,.8,-2.24,pillowM,{s:false,r:.02});

  fur(-2.36,1.55);
  /* ── bedroom 2: double bed against the living wall, a study desk under the window, wardrobe ── */
  const B2X=-3.45,B2Z=1.55;
  B(.1,1.0,1.6,-2.48,.95,B2Z,headM,{r:.03});
  B(2.0,.22,1.55,B2X,.17,B2Z,M.walnut,{r:.02});B(1.95,.28,1.5,B2X-.02,.42,B2Z,pillowM,{r:.07});
  const dv2=new THREE.Mesh(drapeGeo(B2X-.25,B2Z,1.4,1.5,.6,.06,.16,.012,23,50,40),bed2M);dv2.position.set(SH[0],0,SH[1]);
  dv2.castShadow=dv2.receiveShadow=true;G.add(dv2);
  add(pillowGeo(.45,.16,1.2,12,31,.4),pillowM,-2.75,.66,B2Z,0,0,0);
  contact(B2X,B2Z,2.3,1.9);
  B(.4,.45,.4,-2.68,.32,B2Z+1.05,M.walnut,{r:.02});C(.07,.28,-2.68,.68,B2Z+1.05,ceramic,{r2:.05});
  add(new THREE.CylinderGeometry(.08,.11,.14,20,1,true),shade,-2.68,.88,B2Z+1.05,0,0,0,false);
  fur(-4.2,Z1);
  /* study desk and chair under the window */
  B(1.5,.04,.6,-4.2,.74,3.05,M.teak,{r:.01});[-4.9,-3.5].forEach(x=>B(.04,.72,.56,x,.36,3.05,M.walnut,{r:.008}));
  B(.34,.22,.02,-4.4,.95,3.25,M.frame,{rx:-.2});B(.3,.012,.2,-4.4,.765,3.0,M.frame,{s:false});
  C(.05,.3,-3.75,.9,3.15,M.brassDark,{seg:8});
  chair(-4.2,2.45,PI);
  fur(-4.83,-.5);
  /* wardrobe on the back wall, beside the door */
  B(2.2,2.3,.58,-4.83,1.15,-.17,lacquerLt,{r:.008});
  [-5.38,-4.83,-4.28].forEach(x=>B(.006,2.2,.006,x+.275,1.15,.115,M.frame,{s:false,r:0}));
  [-5.1,-4.55].forEach(x=>B(.012,.5,.012,x,1.15,.12,M.brass,{s:false,r:0}));
  fur(-4.0,1.5);  P(1.8,1.4,-4.0,.006,1.5,own(scaled(M.rug,1.8,1.4,1.8)),-PI/2,0);
  fur(-6,-.1);  B(.03,.6,.8,-5.98,1.6,-.1+.0,M.art2,{s:false});

  arch();
  /* ── common bath ── */
  const cbTile=tileMat('#dfe3df','#c2c8c3',.3,2.1,2.2,.3);
  P(2.08,2.2,-4.95,1.1,-2.29,cbTile,0,0);P(1.66,2.2,-5.99,1.1,-1.46,cbTile,0,PI/2);P(2.08,2.2,-4.95,1.1,-.63,cbTile,0,PI);
  P(.4,2.2,-3.91,1.1,-2.1,cbTile,0,-PI/2);P(.4,2.2,-3.91,1.1,-.8,cbTile,0,-PI/2);
  fur(-4.4,-2.36);  B(.8,.15,.46,-4.4,.8,-2.06,lacquer,{r:.02});B(.82,.04,.48,-4.4,.89,-2.06,quartz,{r:.01});
  C(.15,.12,-4.4,.96,-2.08,ceramic,{r2:.12,seg:28});C(.012,.2,-4.4,1.0,-2.26,M.steel,{seg:8});
  B(.6,.75,.02,-4.4,1.6,-2.28,M.mirror,{s:false});
  fur(-4.55,-.5);  B(.36,.36,.52,-4.55,.44,-.92,ceramic,{r:.12});B(.34,.5,.12,-4.55,.62,-.7,ceramic,{r:.04});
  fur(-6,-1.46);  B(1.66,2.0,.02,-5.45,1.0,-1.46,showerGlass,{s:false,r:0,ry:PI/2});
  C(.12,.012,-5.6,2.2,-1.46,M.steel,{seg:24,s:false});
  fur(-4.4,-.5);  B(.4,.02,.02,-4.4,1.25,-.66,M.steel,{s:false});B(.36,.4,.04,-4.4,1.05,-.67,bed2M,{s:false,r:.02});

  arch();
  /* ── balcony: deck, glass rail, two chairs and planters ── */
  const BW=5.7,BD=1.8;
  P(BW,BD,0,-.01,Z1+BD/2+.06,own(scaled(M.deckPool,BW,BD,2.6)),-PI/2,0);
  B(BW,.14,BD,0,-.08,Z1+BD/2+.06,M.stone,{r:.004});
  B(BW,1.0,.02,0,.5,Z1+BD+.04,glassR,{s:false,r:0});B(BW,.06,.08,0,1.03,Z1+BD+.04,M.teak,{r:.012});
  [-1,1].forEach(s=>{B(.02,1.0,BD,s*BW/2,.5,Z1+BD/2+.06,glassR,{s:false,r:0});B(.06,.06,BD,s*BW/2,1.03,Z1+BD/2+.06,M.teak,{r:.012});});
  fur(0,Z1+1);  C(.3,.04,.0,.52,Z1+1.0,M.teak,{seg:28});C(.03,.5,0,.25,Z1+1.0,M.steel,{seg:12});
  [-.8,.8].forEach(x=>{B(.5,.07,.5,x,.4,Z1+1.0,M.teak,{r:.025});B(.46,.09,.44,x,.47,Z1+1.0,M.linen,{r:.04});
    B(.5,.5,.07,x,.68,Z1+1.0+(x<0?-.24:-.24),M.teak,{r:.025,rx:-.18});});
  fur(-2.4,Z1+1.4);plant(-2.4,Z1+1.4,.8,10,63,0x3f8a47,.17);fur(2.4,Z1+1.4);plant(2.4,Z1+1.4,.55,8,64,0x5a9a44,.15);
  arch();

  flush();
  roomExterior(S,unit);

  /* ── light: sun through the garden glass, a sky fill at the slider, warm downlights in every room ── */
  const sun=new THREE.DirectionalLight(0xffe9c8,3.0);
  sun.position.set(3.4,7.2,Z1+8.5);sun.target.position.set(-.5,.6,-1.5);
  sun.castShadow=true;sun.shadow.mapSize.set(LOW?1024:2048,LOW?1024:2048);
  const c=sun.shadow.camera;c.left=-10;c.right=10;c.top=10;c.bottom=-9;c.near=1;c.far=34;
  sun.shadow.bias=-.0005;sun.shadow.normalBias=.03;sun.shadow.radius=4;
  S.add(sun,sun.target);
  const skyFill=new THREE.RectAreaLight(0xcfe4f5,1.8,4.2*K,2.4);skyFill.position.set(0,1.4,Z1-.12);skyFill.lookAt(0,1.2,-2);S.add(skyFill);
  const sideFill=new THREE.RectAreaLight(0xcfe4f5,1.0,1.8,1.5);sideFill.position.set(-4.2*K,1.6,Z1-.12);sideFill.lookAt(-4.2*K,1.2,0);S.add(sideFill);
  const sideFill2=new THREE.RectAreaLight(0xcfe4f5,1.0,1.8,1.5);sideFill2.position.set(4.2*K,1.6,Z1-.12);sideFill2.lookAt(4.2*K,1.2,0);S.add(sideFill2);
  const pts=[];
  /* [x, z, strength]: one warm light per room (the smaller rooms share on low-power devices) */
  const lamps=[[0,1.2,2.1],[0,-2.9,1.8],[-4.2,-3.7,1.6],[4.2,1.5,1.6],[-4.2,1.5,1.5],[4.2,-3.7,1.2],[4.95,-1.46,1.0],[-4.95,-1.46,1.0]];
  (LOW?lamps.slice(0,5):lamps).forEach(q=>{const p=new THREE.PointLight(0xffd3a4,q[2],7,2);p.userData.base=q[2];
    const w=ap(q[0],q[1]);p.position.set(w[0],RH-.15,w[1]);S.add(p);pts.push(p);});
  const hem=new THREE.HemisphereLight(0xe2eef6,0x8a7656,.42);S.add(hem);
  S.environment=api.ENV();S.environmentIntensity=.35;
  S.userData.apply=(a,b,f)=>{
    const n=k=>a[k]+(b[k]-a[k])*f;
    sun.color.copy(a.rSun).lerp(b.rSun,f);sun.intensity=n('rSunI');
    [skyFill,sideFill,sideFill2].forEach((l,i)=>{l.color.copy(a.rFill).lerp(b.rFill,f);l.intensity=n('rFillI')*(i?.75:1.3);});
    hem.intensity=n('rHemi')*1.5;S.environmentIntensity=n('rEnv');
    const k=n('rInt');pts.forEach(p=>p.intensity=p.userData.base*k);
    shade.emissiveIntensity=n('rShade');ledM.emissiveIntensity=.4+n('rShade')*1.4;downM.emissiveIntensity=.6+n('rShade')*1.8;
    const sk=S.userData.sky;sk.uniforms.t.value.copy(a.skyT).lerp(b.skyT,f);sk.uniforms.h.value.copy(a.skyH).lerp(b.skyH,f);
    S.fog.color.copy(a.fog).lerp(b.fog,f);};

  /* ── viewpoints, one per room: [camera position], [where it looks], field of view ── */
  S.userData.views={
    Entry:{p:[5.3,1.62,-4.75],t:[-1.2,1.0,-2.0],fov:68},
    Living:{p:[1.8,1.62,-.7],t:[-1.6,1.0,2.6],fov:70},
    Dining:{p:[1.6,1.65,-.25],t:[-1.2,.8,-3.8],fov:68},
    Kitchen:{p:[-2.55,1.65,-2.5],t:[-5.2,1.0,-4.6],fov:72},
    Master:{p:[3.9,1.65,-.2],t:[5.8,.8,2.2],fov:72},
    'Master Bath':{p:[4.8,1.62,-.74],t:[4.9,1.0,-2.3],fov:80},
    'Bedroom 2':{p:[-5.7,1.65,.4],t:[-2.8,.8,2.4],fov:72},
    Bathroom:{p:[-4.1,1.62,-.74],t:[-4.9,1.0,-2.3],fov:80},
    Balcony:{p:[.3,1.6,3.0],t:[.4,1.0,6.4],fov:60},
    View:{p:[.3,1.75,Z1+1.74],t:[.6,-1.6,Z1+4.4],fov:58}};
  Object.values(S.userData.views).forEach(v=>{[v.p,v.t].forEach(a=>{const w=ap(a[0],a[2]);a[0]=w[0];a[2]=w[1];});});
  return S;
}
window.AureliaFlat={buildFlat};
})();
