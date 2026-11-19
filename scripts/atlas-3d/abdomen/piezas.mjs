// Abdomen 3D: qué mallas de Z-Anatomy entran, con qué nombre, sistema, zona y color.
//
// `FUENTE`: mallas a sacar de cada FBX (fuente.mjs). `PIEZAS`: las que se publican,
// por su nombre en inglés (`en`); `de` es la malla de la fuente, o el nombre de una
// operación de construir.mjs (las partidas y las modeladas no salen del FBX tal cual).
//
// Los colores son de órgano (no cambian con el tema), como los de los sistemas del
// atlas: el hígado se parte en segmentos con tonos apenas distintos para que se
// vean sus límites sin que deje de leerse como un solo órgano.

export const FUENTE = {
  'VisceralSystem100.fbx': [
    'Posterior_segment_of_liver_(I)', 'Left_posterior_lateral_segment_of_liver_(II)', 'Left_anterior_lateral_segment_of_liver_(III)',
    'Left_medial_segment_of_liver_(IV)', 'Anterior_medial_segment_of_liver_(V)', 'Anterior_lateral_segment_of_liver_(VI)',
    'Posterior_lateral_segment_of_liver_(VII)', 'Posterior_medial_segment_of_liver_(VIII)', 'Liver',
    'Gallbladder', 'Bile_duct', 'Pancreas', 'Duodenum', 'Jejunum', 'Stomach', 'Oesophagus',
    'Ascending_colon', 'Transverse_colon', 'Descending_colon', 'Sigmoid_colon', 'Vermiform_appendix',
    'Free_taenia', 'Omental_taenia', 'Mesocolic_taenia',
    'Mesocolon', 'Meso-appendix', 'Lesser_omentum', 'Greater_omentum',
    'Kidneyr', 'Kidneyl', 'Suprarenal_glandr', 'Suprarenal_glandl', 'Ureterr', 'Ureterl',
  ],
  'LymphoidOrgans100.fbx': ['Spleen'],
  'CardioVascular41.fbx': [
    'Abdominal_aorta', 'Coeliac_trunk', 'Left_gastric_artery', 'Common_hepatic_artery', 'Gastroduodenal_artery',
    'Proper_hepatic_artery', 'Splenic_artery', 'Superior_mesenteric_artery', 'Ileocolic_artery', 'Appendicular_artery',
    'Colic_branch_of_ileocolic_artery', 'Ileal_branch_of_ileocolic_artery', 'Right_colic_artery', 'Middle_colic_artery',
    'Inferior_pancreaticoduodenal_artery', 'Anterior_inferior_pancreaticoduodenal_artery', 'Marginal_artery',
    'Inferior_mesenteric_artery', 'Left_colic_artery', 'Ascending_branch_of_left_colic_artery',
    'Descending_branch_of_left_colic_artery', 'Sigmoid_arteries', 'Superior_anorectal_artery',
    'Right_renal_artery', 'Left_renal_artery', 'Common_iliac_arteryr', 'Common_iliac_arteryl',
    'Hepatic_portal_vein', 'Splenic_vein', 'Inferior_mesenteric_vein', 'Sigmoid_veins', 'Superior_mesenteric_vein',
    'Middle_colic_vein', 'Right_colic_vein', 'Right_gastro-omental_vein', 'Left_gastro-omental_vein',
    'Inferior_vena_cava_(abdominal_part)', 'Inferior_vena_cava_(thoracic_part)', 'Hepatic_veins',
    'Right_renal_vein', 'Left_renal_vein', 'Common_iliac_veinr', 'Common_iliac_veinl',
  ],
  'SkeletalSystem100.fbx': [
    'Vertebra_T10', 'Vertebra_T11', 'Vertebra_T12', 'Vertebra_L1', 'Vertebra_L2', 'Vertebra_L3', 'Vertebra_L4', 'Vertebra_L5', 'Sacrum',
    'Hip_boner', 'Hip_bonel',
    ...['Seventh', 'Eighth', 'Ninth', 'Tenth', 'Eleventh', 'Twelfth'].flatMap((n) => [`${n}_ribr`, `${n}_ribl`]),
    ...['seventh', 'eighth', 'ninth', 'tenth'].flatMap((n) => [`Costal_cartilage_of_${n}_ribr`, `Costal_cartilage_of_${n}_ribl`]),
  ],
  'MuscularSystem100.fbx': ['Diaphragm'],
};

// ─── Colores ─────────────────────────────────────────────────────────────────
const C = {
  higado: ['#8d3a2d', '#97432f', '#88382c', '#93412f', '#8a3b2e', '#96453a', '#86372b', '#914033', '#8f3d31'],
  vesicula: '#4f8f56', bilis: '#5a9a4f', pancreas: '#e2bf72', bazo: '#7a3d63',
  estomago: '#d88f7f', esofago: '#cf8476', duodeno: '#dc9b78', yeyuno: '#e3a491', ileon: '#d38c80',
  colon: '#c79a78', tenia: '#f1e4c9', apendice: '#c99079',
  rinon: '#8e3d39', suprarrenal: '#d6a04a', ureter: '#e6d29a',
  peritoneo: '#efd8a6', ligamento: '#ead2a2',
};

// sistema: hueso · musculo · arteria · vena · organo · peritoneo
// zona: higado · estomago · pancreas · intestino · colon · retro · pared
const P = (en, de, nombre, sistema, zona, color) => ({ en, de, nombre, sistema, zona, ...(color ? { color } : {}) });

export const PIEZAS = [
  // Hígado por segmentos (Couinaud). El caudado es el I; el cuadrado, la parte
  // inferior del IV (IVb), que se parte del IV en construir.mjs.
  P('Caudate lobe of liver (segment I)', 'Posterior_segment_of_liver_(I)', 'Lóbulo caudado (segmento I)', 'organo', 'higado', C.higado[0]),
  P('Segment II of liver', 'Left_posterior_lateral_segment_of_liver_(II)', 'Segmento II del hígado', 'organo', 'higado', C.higado[1]),
  P('Segment III of liver', 'Left_anterior_lateral_segment_of_liver_(III)', 'Segmento III del hígado', 'organo', 'higado', C.higado[2]),
  P('Segment IVa of liver', 'op:segmento-IVa', 'Segmento IVa del hígado', 'organo', 'higado', C.higado[3]),
  P('Quadrate lobe of liver (segment IVb)', 'op:lobulo-cuadrado', 'Lóbulo cuadrado (segmento IVb)', 'organo', 'higado', C.higado[4]),
  P('Segment V of liver', 'Anterior_medial_segment_of_liver_(V)', 'Segmento V del hígado', 'organo', 'higado', C.higado[5]),
  P('Segment VI of liver', 'Anterior_lateral_segment_of_liver_(VI)', 'Segmento VI del hígado', 'organo', 'higado', C.higado[6]),
  P('Segment VII of liver', 'Posterior_lateral_segment_of_liver_(VII)', 'Segmento VII del hígado', 'organo', 'higado', C.higado[7]),
  P('Segment VIII of liver', 'Posterior_medial_segment_of_liver_(VIII)', 'Segmento VIII del hígado', 'organo', 'higado', C.higado[8]),
  P('Gallbladder', 'Gallbladder', 'Vesícula biliar', 'organo', 'higado', C.vesicula),
  // Z-Anatomy trae cístico y colédoco en un solo tubo, sin hepático común: se parte
  // en el codo donde se uniría el hepático común, que se modela.
  P('Cystic duct', 'op:cistico', 'Conducto cístico', 'organo', 'higado', C.bilis),
  P('Bile duct', 'op:coledoco', 'Conducto colédoco', 'organo', 'higado', C.bilis),
  P('Common hepatic duct', 'op:hepatico-comun', 'Conducto hepático común', 'organo', 'higado', C.bilis),
  P('Falciform ligament', 'op:falciforme', 'Ligamento falciforme', 'peritoneo', 'higado', C.ligamento),
  P('Round ligament of liver', 'op:redondo', 'Ligamento redondo del hígado', 'peritoneo', 'higado', '#dcb77e'),
  P('Lesser omentum', 'Lesser_omentum', 'Omento menor', 'peritoneo', 'estomago', C.peritoneo),

  // Páncreas y duodeno, partidos en construir.mjs.
  P('Head of pancreas', 'op:pancreas-cabeza', 'Cabeza del páncreas', 'organo', 'pancreas', C.pancreas),
  P('Uncinate process of pancreas', 'op:pancreas-uncinado', 'Proceso uncinado del páncreas', 'organo', 'pancreas', '#dcb766'),
  P('Neck of pancreas', 'op:pancreas-cuello', 'Cuello del páncreas', 'organo', 'pancreas', '#e6c67e'),
  P('Body of pancreas', 'op:pancreas-cuerpo', 'Cuerpo del páncreas', 'organo', 'pancreas', '#dfbb6c'),
  P('Tail of pancreas', 'op:pancreas-cola', 'Cola del páncreas', 'organo', 'pancreas', '#e5c47b'),
  P('Superior part of duodenum', 'op:duodeno-1', 'Porción superior del duodeno (1.ª)', 'organo', 'pancreas', C.duodeno),
  P('Descending part of duodenum', 'op:duodeno-2', 'Porción descendente del duodeno (2.ª)', 'organo', 'pancreas', '#d6946f'),
  P('Horizontal part of duodenum', 'op:duodeno-3', 'Porción horizontal del duodeno (3.ª)', 'organo', 'pancreas', C.duodeno),
  P('Ascending part of duodenum', 'op:duodeno-4', 'Porción ascendente del duodeno (4.ª)', 'organo', 'pancreas', '#d6946f'),

  P('Stomach', 'op:estomago', 'Estómago', 'organo', 'estomago', C.estomago),
  P('Abdominal part of oesophagus', 'op:esofago', 'Esófago (porción abdominal)', 'organo', 'estomago', C.esofago),
  P('Spleen', 'Spleen', 'Bazo', 'organo', 'estomago', C.bazo),
  P('Greater omentum', 'Greater_omentum', 'Omento mayor', 'peritoneo', 'estomago', C.peritoneo),

  // Intestino delgado: Z-Anatomy lo trae en una sola malla («Jejunum»); se parte a
  // lo largo del tubo en sus 2/5 proximales (yeyuno) y 3/5 distales (íleon).
  P('Jejunum', 'op:yeyuno', 'Yeyuno', 'organo', 'intestino', C.yeyuno),
  P('Ileum', 'op:ileon', 'Íleon', 'organo', 'intestino', C.ileon),

  P('Caecum and ascending colon', 'Ascending_colon', 'Ciego y colon ascendente', 'organo', 'colon', C.colon),
  P('Transverse colon', 'Transverse_colon', 'Colon transverso', 'organo', 'colon', C.colon),
  P('Descending colon', 'Descending_colon', 'Colon descendente', 'organo', 'colon', C.colon),
  P('Sigmoid colon', 'Sigmoid_colon', 'Colon sigmoide', 'organo', 'colon', C.colon),
  P('Vermiform appendix', 'Vermiform_appendix', 'Apéndice vermiforme', 'organo', 'colon', C.apendice),
  P('Free taenia', 'Free_taenia', 'Tenia libre', 'organo', 'colon', C.tenia),
  P('Omental taenia', 'Omental_taenia', 'Tenia omental (epiploica)', 'organo', 'colon', C.tenia),
  P('Mesocolic taenia', 'Mesocolic_taenia', 'Tenia mesocólica', 'organo', 'colon', C.tenia),
  P('Mesocolon', 'Mesocolon', 'Mesocolon', 'peritoneo', 'colon', C.peritoneo),
  P('Meso-appendix', 'Meso-appendix', 'Mesoapéndice', 'peritoneo', 'colon', C.peritoneo),

  P('Right kidney', 'Kidneyr', 'Riñón derecho', 'organo', 'retro', C.rinon),
  P('Left kidney', 'Kidneyl', 'Riñón izquierdo', 'organo', 'retro', C.rinon),
  P('Right suprarenal gland', 'Suprarenal_glandr', 'Glándula suprarrenal derecha', 'organo', 'retro', C.suprarrenal),
  P('Left suprarenal gland', 'Suprarenal_glandl', 'Glándula suprarrenal izquierda', 'organo', 'retro', C.suprarrenal),
  P('Right ureter', 'op:ureter-derecho', 'Uréter derecho', 'organo', 'retro', C.ureter),
  P('Left ureter', 'op:ureter-izquierdo', 'Uréter izquierdo', 'organo', 'retro', C.ureter),

  // Arterias
  P('Abdominal aorta', 'Abdominal_aorta', 'Aorta abdominal', 'arteria', 'retro'),
  P('Coeliac trunk', 'Coeliac_trunk', 'Tronco celíaco', 'arteria', 'estomago'),
  P('Left gastric artery', 'Left_gastric_artery', 'Arteria gástrica izquierda', 'arteria', 'estomago'),
  P('Common hepatic artery', 'Common_hepatic_artery', 'Arteria hepática común', 'arteria', 'higado'),
  P('Gastroduodenal artery', 'Gastroduodenal_artery', 'Arteria gastroduodenal', 'arteria', 'pancreas'),
  P('Proper hepatic artery', 'Proper_hepatic_artery', 'Arteria hepática propia', 'arteria', 'higado'),
  P('Splenic artery', 'Splenic_artery', 'Arteria esplénica', 'arteria', 'estomago'),
  P('Superior mesenteric artery', 'Superior_mesenteric_artery', 'Arteria mesentérica superior', 'arteria', 'intestino'),
  P('Ileocolic artery', 'Ileocolic_artery', 'Arteria ileocólica', 'arteria', 'colon'),
  P('Appendicular artery', 'Appendicular_artery', 'Arteria apendicular', 'arteria', 'colon'),
  P('Colic branch of ileocolic artery', 'Colic_branch_of_ileocolic_artery', 'Rama cólica de la arteria ileocólica', 'arteria', 'colon'),
  P('Ileal branch of ileocolic artery', 'Ileal_branch_of_ileocolic_artery', 'Rama ileal de la arteria ileocólica', 'arteria', 'colon'),
  P('Right colic artery', 'Right_colic_artery', 'Arteria cólica derecha', 'arteria', 'colon'),
  P('Middle colic artery', 'Middle_colic_artery', 'Arteria cólica media', 'arteria', 'colon'),
  P('Inferior pancreaticoduodenal artery', 'Inferior_pancreaticoduodenal_artery', 'Arteria pancreaticoduodenal inferior', 'arteria', 'pancreas'),
  P('Anterior inferior pancreaticoduodenal artery', 'Anterior_inferior_pancreaticoduodenal_artery', 'Arteria pancreaticoduodenal inferior anterior', 'arteria', 'pancreas'),
  P('Marginal artery', 'Marginal_artery', 'Arteria marginal del colon', 'arteria', 'colon'),
  P('Inferior mesenteric artery', 'Inferior_mesenteric_artery', 'Arteria mesentérica inferior', 'arteria', 'colon'),
  P('Left colic artery', 'Left_colic_artery', 'Arteria cólica izquierda', 'arteria', 'colon'),
  P('Ascending branch of left colic artery', 'Ascending_branch_of_left_colic_artery', 'Rama ascendente de la arteria cólica izquierda', 'arteria', 'colon'),
  P('Descending branch of left colic artery', 'Descending_branch_of_left_colic_artery', 'Rama descendente de la arteria cólica izquierda', 'arteria', 'colon'),
  P('Sigmoid arteries', 'Sigmoid_arteries', 'Arterias sigmoideas', 'arteria', 'colon'),
  P('Superior rectal artery', 'Superior_anorectal_artery', 'Arteria rectal superior', 'arteria', 'colon'),
  P('Right renal artery', 'Right_renal_artery', 'Arteria renal derecha', 'arteria', 'retro'),
  P('Left renal artery', 'Left_renal_artery', 'Arteria renal izquierda', 'arteria', 'retro'),
  P('Right common iliac artery', 'Common_iliac_arteryr', 'Arteria ilíaca común derecha', 'arteria', 'retro'),
  P('Left common iliac artery', 'Common_iliac_arteryl', 'Arteria ilíaca común izquierda', 'arteria', 'retro'),

  // Venas. Z-Anatomy trae la porta solo hasta el hilio y las hepáticas solo en su
  // desembocadura: las ramas de la porta y las tres hepáticas se modelan.
  P('Hepatic portal vein', 'Hepatic_portal_vein', 'Vena porta hepática', 'vena', 'higado'),
  P('Right branch of hepatic portal vein', 'op:porta-derecha', 'Rama derecha de la vena porta', 'vena', 'higado'),
  P('Left branch of hepatic portal vein', 'op:porta-izquierda', 'Rama izquierda de la vena porta', 'vena', 'higado'),
  P('Right hepatic vein', 'op:hepatica-derecha', 'Vena hepática derecha', 'vena', 'higado'),
  P('Intermediate hepatic vein', 'op:hepatica-media', 'Vena hepática media', 'vena', 'higado'),
  P('Left hepatic vein', 'op:hepatica-izquierda', 'Vena hepática izquierda', 'vena', 'higado'),
  P('Splenic vein', 'Splenic_vein', 'Vena esplénica', 'vena', 'pancreas'),
  P('Superior mesenteric vein', 'Superior_mesenteric_vein', 'Vena mesentérica superior', 'vena', 'intestino'),
  P('Inferior mesenteric vein', 'Inferior_mesenteric_vein', 'Vena mesentérica inferior', 'vena', 'colon'),
  P('Sigmoid veins', 'Sigmoid_veins', 'Venas sigmoideas', 'vena', 'colon'),
  P('Middle colic vein', 'Middle_colic_vein', 'Vena cólica media', 'vena', 'colon'),
  P('Right colic vein', 'Right_colic_vein', 'Vena cólica derecha', 'vena', 'colon'),
  P('Right gastro-omental vein', 'Right_gastro-omental_vein', 'Vena gastroomental derecha', 'vena', 'estomago'),
  P('Left gastro-omental vein', 'Left_gastro-omental_vein', 'Vena gastroomental izquierda', 'vena', 'estomago'),
  P('Inferior vena cava', 'op:cava', 'Vena cava inferior', 'vena', 'retro'),
  P('Right renal vein', 'Right_renal_vein', 'Vena renal derecha', 'vena', 'retro'),
  P('Left renal vein', 'Left_renal_vein', 'Vena renal izquierda', 'vena', 'retro'),
  P('Right common iliac vein', 'Common_iliac_veinr', 'Vena ilíaca común derecha', 'vena', 'retro'),
  P('Left common iliac vein', 'Common_iliac_veinl', 'Vena ilíaca común izquierda', 'vena', 'retro'),

  // Pared: esqueleto y diafragma
  P('Diaphragm', 'Diaphragm', 'Diafragma', 'musculo', 'pared'),
  ...['T10', 'T11', 'T12', 'L1', 'L2', 'L3', 'L4', 'L5'].map((v) => P(`Vertebra ${v}`, `Vertebra_${v}`, `Vértebra ${v}`, 'hueso', 'pared')),
  P('Sacrum', 'Sacrum', 'Sacro', 'hueso', 'pared'),
  P('Right hip bone', 'Hip_boner', 'Hueso coxal derecho', 'hueso', 'pared'),
  P('Left hip bone', 'Hip_bonel', 'Hueso coxal izquierdo', 'hueso', 'pared'),
  ...[['Seventh', '7.ª'], ['Eighth', '8.ª'], ['Ninth', '9.ª'], ['Tenth', '10.ª'], ['Eleventh', '11.ª'], ['Twelfth', '12.ª']].flatMap(([n, o]) => [
    P(`${n} rib (right)`, `${n}_ribr`, `${o} costilla derecha`, 'hueso', 'pared'),
    P(`${n} rib (left)`, `${n}_ribl`, `${o} costilla izquierda`, 'hueso', 'pared'),
  ]),
  ...[['seventh', '7.ª'], ['eighth', '8.ª'], ['ninth', '9.ª'], ['tenth', '10.ª']].flatMap(([n, o]) => [
    P(`Costal cartilage of ${n} rib (right)`, `Costal_cartilage_of_${n}_ribr`, `Cartílago costal de la ${o} costilla derecha`, 'hueso', 'pared'),
    P(`Costal cartilage of ${n} rib (left)`, `Costal_cartilage_of_${n}_ribl`, `Cartílago costal de la ${o} costilla izquierda`, 'hueso', 'pared'),
  ]),
];
