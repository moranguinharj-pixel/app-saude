export type HealthEntry = {
  id: string;
  metricName: string;
  value: number;
  unit: string;
  category: string;
  recordedAt: string;
  notes?: string;
};

export type WeatherSnapshot = {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
};

export type WeatherEntry = WeatherSnapshot & {
  id: string;
  capturedAt: string;
  latitude: number;
  longitude: number;
  locality?: string;
};

export const BODY_SITES = [
  { id: "head", label: "Cabeça", icon: "◉" },
  { id: "face", label: "Face", icon: "◌" },
  { id: "neck", label: "Pescoço", icon: "▰" },
  { id: "left-shoulder", label: "Ombro esquerdo", icon: "◒" },
  { id: "right-shoulder", label: "Ombro direito", icon: "◓" },
  { id: "left-arm", label: "Braço esquerdo", icon: "╱" },
  { id: "right-arm", label: "Braço direito", icon: "╲" },
  { id: "left-hand", label: "Mão esquerda", icon: "✋" },
  { id: "right-hand", label: "Mão direita", icon: "✋" },
  { id: "chest", label: "Peito e mamas", icon: "♡" },
  { id: "abdomen", label: "Abdômen", icon: "◇" },
  { id: "upper-back", label: "Costas altas", icon: "▥" },
  { id: "lower-back", label: "Lombar", icon: "▥" },
  { id: "left-hip", label: "Quadril esquerdo", icon: "◒" },
  { id: "right-hip", label: "Quadril direito", icon: "◓" },
  { id: "left-thigh", label: "Coxa esquerda", icon: "╱" },
  { id: "right-thigh", label: "Coxa direita", icon: "╲" },
  { id: "left-knee", label: "Joelho esquerdo", icon: "○" },
  { id: "right-knee", label: "Joelho direito", icon: "○" },
  { id: "left-leg", label: "Perna esquerda", icon: "╱" },
  { id: "right-leg", label: "Perna direita", icon: "╲" },
  { id: "left-foot", label: "Pé esquerdo", icon: "⌁" },
  { id: "right-foot", label: "Pé direito", icon: "⌁" },
] as const;

export type BodySiteId = (typeof BODY_SITES)[number]["id"];

export const BODY_SITE_DETAILS = [
  { id: "head-top", coarse: "head", label: "Topo da cabeça" },
  { id: "forehead-left", coarse: "head", label: "Testa esquerda" },
  { id: "forehead-right", coarse: "head", label: "Testa direita" },
  { id: "above-eye-left", coarse: "face", label: "Acima do olho esquerdo" },
  { id: "above-eye-right", coarse: "face", label: "Acima do olho direito" },
  { id: "below-eye-left", coarse: "face", label: "Abaixo do olho esquerdo" },
  { id: "below-eye-right", coarse: "face", label: "Abaixo do olho direito" },
  { id: "eye-left", coarse: "face", label: "Olho esquerdo" },
  { id: "eye-right", coarse: "face", label: "Olho direito" },
  { id: "brow-left", coarse: "face", label: "Sobrancelha esquerda" },
  { id: "brow-right", coarse: "face", label: "Sobrancelha direita" },
  { id: "nose-bridge", coarse: "face", label: "Ponte do nariz" },
  { id: "nose-tip", coarse: "face", label: "Ponta do nariz" },
  { id: "upper-lip", coarse: "face", label: "Lábio superior" },
  { id: "lower-lip", coarse: "face", label: "Lábio inferior" },
  { id: "chin", coarse: "face", label: "Queixo" },
  { id: "ear-left-upper", coarse: "face", label: "Orelha esquerda, parte superior" },
  { id: "ear-left-lower", coarse: "face", label: "Orelha esquerda, parte inferior" },
  { id: "ear-right-upper", coarse: "face", label: "Orelha direita, parte superior" },
  { id: "ear-right-lower", coarse: "face", label: "Orelha direita, parte inferior" },
  { id: "behind-eye-left", coarse: "face", label: "Atrás do olho esquerdo" },
  { id: "behind-eye-right", coarse: "face", label: "Atrás do olho direito" },
  { id: "brain-left", coarse: "head", label: "Região cerebral esquerda" },
  { id: "brain-right", coarse: "head", label: "Região cerebral direita" },
  { id: "scalp-left", coarse: "head", label: "Couro cabeludo esquerdo" },
  { id: "scalp-right", coarse: "head", label: "Couro cabeludo direito" },
  { id: "temple-left", coarse: "face", label: "Têmpora esquerda" },
  { id: "temple-right", coarse: "face", label: "Têmpora direita" },
  { id: "cheek-left", coarse: "face", label: "Bochecha esquerda" },
  { id: "cheek-right", coarse: "face", label: "Bochecha direita" },
  { id: "jaw-left", coarse: "face", label: "Mandíbula esquerda" },
  { id: "jaw-right", coarse: "face", label: "Mandíbula direita" },
  { id: "behind-head-left", coarse: "head", label: "Atrás da cabeça, lado esquerdo" },
  { id: "behind-head-right", coarse: "head", label: "Atrás da cabeça, lado direito" },
  { id: "neck-front", coarse: "neck", label: "Frente do pescoço" },
  { id: "neck-back", coarse: "neck", label: "Nuca" },
  { id: "chest-left", coarse: "chest", label: "Peito esquerdo" },
  { id: "chest-right", coarse: "chest", label: "Peito direito" },
  { id: "chest-center", coarse: "chest", label: "Centro do peito" },
  { id: "rib-left-upper", coarse: "chest", label: "Costelas esquerdas superiores" },
  { id: "rib-right-upper", coarse: "chest", label: "Costelas direitas superiores" },
  { id: "rib-left-lower", coarse: "chest", label: "Costelas esquerdas inferiores" },
  { id: "rib-right-lower", coarse: "chest", label: "Costelas direitas inferiores" },
  { id: "lung-left", coarse: "chest", label: "Região do pulmão esquerdo" },
  { id: "lung-right", coarse: "chest", label: "Região do pulmão direito" },
  { id: "heart", coarse: "chest", label: "Região do coração" },
  { id: "diaphragm", coarse: "chest", label: "Região do diafragma" },
  { id: "abdomen-left-upper", coarse: "abdomen", label: "Abdômen superior esquerdo" },
  { id: "abdomen-right-upper", coarse: "abdomen", label: "Abdômen superior direito" },
  { id: "abdomen-left-lower", coarse: "abdomen", label: "Abdômen inferior esquerdo" },
  { id: "abdomen-right-lower", coarse: "abdomen", label: "Abdômen inferior direito" },
  { id: "lower-belly-left", coarse: "abdomen", label: "Baixo ventre esquerdo" },
  { id: "lower-belly-right", coarse: "abdomen", label: "Baixo ventre direito" },
  { id: "flank-left", coarse: "abdomen", label: "Flanco esquerdo" },
  { id: "flank-right", coarse: "abdomen", label: "Flanco direito" },
  { id: "pelvis-left", coarse: "left-hip", label: "Região pélvica esquerda" },
  { id: "pelvis-right", coarse: "right-hip", label: "Região pélvica direita" },
  { id: "ovary-left", coarse: "left-hip", label: "Região próxima ao ovário esquerdo" },
  { id: "ovary-right", coarse: "right-hip", label: "Região próxima ao ovário direito" },
  { id: "groin-left", coarse: "left-hip", label: "Virilha esquerda" },
  { id: "groin-right", coarse: "right-hip", label: "Virilha direita" },
  { id: "lower-back-left", coarse: "lower-back", label: "Lombar esquerda" },
  { id: "lower-back-right", coarse: "lower-back", label: "Lombar direita" },
  { id: "upper-back-left", coarse: "upper-back", label: "Parte alta das costas esquerda" },
  { id: "upper-back-right", coarse: "upper-back", label: "Parte alta das costas direita" },
  { id: "hip-left-side", coarse: "left-hip", label: "Lateral do quadril esquerdo" },
  { id: "hip-right-side", coarse: "right-hip", label: "Lateral do quadril direito" },
  { id: "thigh-left-front", coarse: "left-thigh", label: "Coxa esquerda anterior" },
  { id: "thigh-right-front", coarse: "right-thigh", label: "Coxa direita anterior" },
  { id: "thigh-left-back", coarse: "left-thigh", label: "Coxa esquerda posterior" },
  { id: "thigh-right-back", coarse: "right-thigh", label: "Coxa direita posterior" },
  { id: "knee-left", coarse: "left-knee", label: "Joelho esquerdo" },
  { id: "knee-right", coarse: "right-knee", label: "Joelho direito" },
  { id: "calf-left", coarse: "left-leg", label: "Panturrilha esquerda" },
  { id: "calf-right", coarse: "right-leg", label: "Panturrilha direita" },
  { id: "shin-left", coarse: "left-leg", label: "Canela esquerda" },
  { id: "shin-right", coarse: "right-leg", label: "Canela direita" },
  { id: "leg-left-lateral", coarse: "left-leg", label: "Lateral da perna esquerda" },
  { id: "leg-right-lateral", coarse: "right-leg", label: "Lateral da perna direita" },
  { id: "ankle-left", coarse: "left-foot", label: "Tornozelo esquerdo" },
  { id: "ankle-right", coarse: "right-foot", label: "Tornozelo direito" },
  { id: "foot-left", coarse: "left-foot", label: "Pé esquerdo" },
  { id: "foot-right", coarse: "right-foot", label: "Pé direito" },
  { id: "hand-left-overview", coarse: "left-hand", label: "Mão esquerda: visão geral" },
  { id: "hand-right-overview", coarse: "right-hand", label: "Mão direita: visão geral" },

  // Mamas, quadrantes e axilas
  { id: "breast-left-upper-inner", coarse: "chest", label: "Mama esquerda: quadrante superior interno" },
  { id: "breast-left-upper-outer", coarse: "chest", label: "Mama esquerda: quadrante superior externo" },
  { id: "breast-left-lower-inner", coarse: "chest", label: "Mama esquerda: quadrante inferior interno" },
  { id: "breast-left-lower-outer", coarse: "chest", label: "Mama esquerda: quadrante inferior externo" },
  { id: "breast-left-nipple", coarse: "chest", label: "Mama esquerda: mamilo" },
  { id: "breast-left-axillary-tail", coarse: "chest", label: "Mama esquerda: prolongamento para a axila" },
  { id: "breast-right-upper-inner", coarse: "chest", label: "Mama direita: quadrante superior interno" },
  { id: "breast-right-upper-outer", coarse: "chest", label: "Mama direita: quadrante superior externo" },
  { id: "breast-right-lower-inner", coarse: "chest", label: "Mama direita: quadrante inferior interno" },
  { id: "breast-right-lower-outer", coarse: "chest", label: "Mama direita: quadrante inferior externo" },
  { id: "breast-right-nipple", coarse: "chest", label: "Mama direita: mamilo" },
  { id: "breast-right-axillary-tail", coarse: "chest", label: "Mama direita: prolongamento para a axila" },
  { id: "axilla-left", coarse: "chest", label: "Axila esquerda" },
  { id: "axilla-right", coarse: "chest", label: "Axila direita" },

  // Mãos: punho, palma, dorso, dedos e articulações
  { id: "left-wrist", coarse: "left-hand", label: "Punho esquerdo" },
  { id: "right-wrist", coarse: "right-hand", label: "Punho direito" },
  { id: "left-palm", coarse: "left-hand", label: "Palma da mão esquerda" },
  { id: "right-palm", coarse: "right-hand", label: "Palma da mão direita" },
  { id: "left-hand-back", coarse: "left-hand", label: "Dorso da mão esquerda" },
  { id: "right-hand-back", coarse: "right-hand", label: "Dorso da mão direita" },
  { id: "left-thumb-cmc", coarse: "left-hand", label: "Base do polegar esquerdo: articulação carpometacarpal" },
  { id: "right-thumb-cmc", coarse: "right-hand", label: "Base do polegar direito: articulação carpometacarpal" },
  { id: "left-thumb-mcp", coarse: "left-hand", label: "Articulação central do polegar esquerdo" },
  { id: "right-thumb-mcp", coarse: "right-hand", label: "Articulação central do polegar direito" },
  { id: "left-thumb-ip", coarse: "left-hand", label: "Articulação distal do polegar esquerdo" },
  { id: "right-thumb-ip", coarse: "right-hand", label: "Articulação distal do polegar direito" },
  { id: "left-index-mcp", coarse: "left-hand", label: "Base do indicador esquerdo" },
  { id: "right-index-mcp", coarse: "right-hand", label: "Base do indicador direito" },
  { id: "left-index-pip", coarse: "left-hand", label: "Articulação média do indicador esquerdo" },
  { id: "right-index-pip", coarse: "right-hand", label: "Articulação média do indicador direito" },
  { id: "left-index-dip", coarse: "left-hand", label: "Articulação distal do indicador esquerdo" },
  { id: "right-index-dip", coarse: "right-hand", label: "Articulação distal do indicador direito" },
  { id: "left-middle-mcp", coarse: "left-hand", label: "Base do dedo médio esquerdo" },
  { id: "right-middle-mcp", coarse: "right-hand", label: "Base do dedo médio direito" },
  { id: "left-middle-pip", coarse: "left-hand", label: "Articulação média do dedo médio esquerdo" },
  { id: "right-middle-pip", coarse: "right-hand", label: "Articulação média do dedo médio direito" },
  { id: "left-middle-dip", coarse: "left-hand", label: "Articulação distal do dedo médio esquerdo" },
  { id: "right-middle-dip", coarse: "right-hand", label: "Articulação distal do dedo médio direito" },
  { id: "left-ring-mcp", coarse: "left-hand", label: "Base do anelar esquerdo" },
  { id: "right-ring-mcp", coarse: "right-hand", label: "Base do anelar direito" },
  { id: "left-ring-pip", coarse: "left-hand", label: "Articulação média do anelar esquerdo" },
  { id: "right-ring-pip", coarse: "right-hand", label: "Articulação média do anelar direito" },
  { id: "left-ring-dip", coarse: "left-hand", label: "Articulação distal do anelar esquerdo" },
  { id: "right-ring-dip", coarse: "right-hand", label: "Articulação distal do anelar direito" },
  { id: "left-little-mcp", coarse: "left-hand", label: "Base do dedo mínimo esquerdo" },
  { id: "right-little-mcp", coarse: "right-hand", label: "Base do dedo mínimo direito" },
  { id: "left-little-pip", coarse: "left-hand", label: "Articulação média do dedo mínimo esquerdo" },
  { id: "right-little-pip", coarse: "right-hand", label: "Articulação média do dedo mínimo direito" },
  { id: "left-little-dip", coarse: "left-hand", label: "Articulação distal do dedo mínimo esquerdo" },
  { id: "right-little-dip", coarse: "right-hand", label: "Articulação distal do dedo mínimo direito" },
  { id: "left-thumb-metacarpal", coarse: "left-hand", label: "Metacarpo do polegar esquerdo" },
  { id: "right-thumb-metacarpal", coarse: "right-hand", label: "Metacarpo do polegar direito" },
  { id: "left-index-metacarpal", coarse: "left-hand", label: "Metacarpo do indicador esquerdo" },
  { id: "right-index-metacarpal", coarse: "right-hand", label: "Metacarpo do indicador direito" },
  { id: "left-middle-metacarpal", coarse: "left-hand", label: "Metacarpo do dedo médio esquerdo" },
  { id: "right-middle-metacarpal", coarse: "right-hand", label: "Metacarpo do dedo médio direito" },
  { id: "left-ring-metacarpal", coarse: "left-hand", label: "Metacarpo do anelar esquerdo" },
  { id: "right-ring-metacarpal", coarse: "right-hand", label: "Metacarpo do anelar direito" },
  { id: "left-little-metacarpal", coarse: "left-hand", label: "Metacarpo do dedo mínimo esquerdo" },
  { id: "right-little-metacarpal", coarse: "right-hand", label: "Metacarpo do dedo mínimo direito" },
  { id: "left-thenar", coarse: "left-hand", label: "Região tenar da mão esquerda" },
  { id: "right-thenar", coarse: "right-hand", label: "Região tenar da mão direita" },
  { id: "left-hypothenar", coarse: "left-hand", label: "Região hipotênar da mão esquerda" },
  { id: "right-hypothenar", coarse: "right-hand", label: "Região hipotênar da mão direita" },

  // Pés: dedos, antepé, arco, calcanhar e tornozelo
  { id: "left-ankle-inner", coarse: "left-foot", label: "Tornozelo esquerdo: lado interno" },
  { id: "right-ankle-inner", coarse: "right-foot", label: "Tornozelo direito: lado interno" },
  { id: "left-ankle-outer", coarse: "left-foot", label: "Tornozelo esquerdo: lado externo" },
  { id: "right-ankle-outer", coarse: "right-foot", label: "Tornozelo direito: lado externo" },
  { id: "left-heel", coarse: "left-foot", label: "Calcanhar esquerdo" },
  { id: "right-heel", coarse: "right-foot", label: "Calcanhar direito" },
  { id: "left-arch", coarse: "left-foot", label: "Arco plantar esquerdo" },
  { id: "right-arch", coarse: "right-foot", label: "Arco plantar direito" },
  { id: "left-metatarsal", coarse: "left-foot", label: "Metatarsos do pé esquerdo" },
  { id: "right-metatarsal", coarse: "right-foot", label: "Metatarsos do pé direito" },
  { id: "left-big-toe-mtp", coarse: "left-foot", label: "Base do dedão esquerdo" },
  { id: "right-big-toe-mtp", coarse: "right-foot", label: "Base do dedão direito" },
  { id: "left-big-toe-ip", coarse: "left-foot", label: "Articulação distal do dedão esquerdo" },
  { id: "right-big-toe-ip", coarse: "right-foot", label: "Articulação distal do dedão direito" },
  { id: "left-second-toe", coarse: "left-foot", label: "Segundo dedo do pé esquerdo" },
  { id: "right-second-toe", coarse: "right-foot", label: "Segundo dedo do pé direito" },
  { id: "left-third-toe", coarse: "left-foot", label: "Terceiro dedo do pé esquerdo" },
  { id: "right-third-toe", coarse: "right-foot", label: "Terceiro dedo do pé direito" },
  { id: "left-fourth-toe", coarse: "left-foot", label: "Quarto dedo do pé esquerdo" },
  { id: "right-fourth-toe", coarse: "right-foot", label: "Quarto dedo do pé direito" },
  { id: "left-little-toe", coarse: "left-foot", label: "Dedo mínimo do pé esquerdo" },
  { id: "right-little-toe", coarse: "right-foot", label: "Dedo mínimo do pé direito" },
  { id: "left-second-toe-mtp", coarse: "left-foot", label: "Articulação da base do segundo dedo esquerdo" },
  { id: "right-second-toe-mtp", coarse: "right-foot", label: "Articulação da base do segundo dedo direito" },
  { id: "left-second-toe-pip", coarse: "left-foot", label: "Articulação média do segundo dedo esquerdo" },
  { id: "right-second-toe-pip", coarse: "right-foot", label: "Articulação média do segundo dedo direito" },
  { id: "left-second-toe-dip", coarse: "left-foot", label: "Articulação distal do segundo dedo esquerdo" },
  { id: "right-second-toe-dip", coarse: "right-foot", label: "Articulação distal do segundo dedo direito" },
  { id: "left-third-toe-mtp", coarse: "left-foot", label: "Articulação da base do terceiro dedo esquerdo" },
  { id: "right-third-toe-mtp", coarse: "right-foot", label: "Articulação da base do terceiro dedo direito" },
  { id: "left-third-toe-pip", coarse: "left-foot", label: "Articulação média do terceiro dedo esquerdo" },
  { id: "right-third-toe-pip", coarse: "right-foot", label: "Articulação média do terceiro dedo direito" },
  { id: "left-third-toe-dip", coarse: "left-foot", label: "Articulação distal do terceiro dedo esquerdo" },
  { id: "right-third-toe-dip", coarse: "right-foot", label: "Articulação distal do terceiro dedo direito" },
  { id: "left-fourth-toe-mtp", coarse: "left-foot", label: "Articulação da base do quarto dedo esquerdo" },
  { id: "right-fourth-toe-mtp", coarse: "right-foot", label: "Articulação da base do quarto dedo direito" },
  { id: "left-fourth-toe-pip", coarse: "left-foot", label: "Articulação média do quarto dedo esquerdo" },
  { id: "right-fourth-toe-pip", coarse: "right-foot", label: "Articulação média do quarto dedo direito" },
  { id: "left-fourth-toe-dip", coarse: "left-foot", label: "Articulação distal do quarto dedo esquerdo" },
  { id: "right-fourth-toe-dip", coarse: "right-foot", label: "Articulação distal do quarto dedo direito" },
  { id: "left-little-toe-mtp", coarse: "left-foot", label: "Articulação da base do dedo mínimo esquerdo" },
  { id: "right-little-toe-mtp", coarse: "right-foot", label: "Articulação da base do dedo mínimo direito" },
  { id: "left-little-toe-pip", coarse: "left-foot", label: "Articulação média do dedo mínimo esquerdo" },
  { id: "right-little-toe-pip", coarse: "right-foot", label: "Articulação média do dedo mínimo direito" },
  { id: "left-little-toe-dip", coarse: "left-foot", label: "Articulação distal do dedo mínimo esquerdo" },
  { id: "right-little-toe-dip", coarse: "right-foot", label: "Articulação distal do dedo mínimo direito" },

  // Articulações, músculos e estruturas profundas
  { id: "shoulder-left-joint", coarse: "left-shoulder", label: "Articulação do ombro esquerdo" },
  { id: "shoulder-right-joint", coarse: "right-shoulder", label: "Articulação do ombro direito" },
  { id: "left-elbow-joint", coarse: "left-arm", label: "Articulação do cotovelo esquerdo" },
  { id: "right-elbow-joint", coarse: "right-arm", label: "Articulação do cotovelo direito" },
  { id: "left-elbow-inner", coarse: "left-arm", label: "Cotovelo esquerdo: lado interno" },
  { id: "right-elbow-inner", coarse: "right-arm", label: "Cotovelo direito: lado interno" },
  { id: "left-elbow-outer", coarse: "left-arm", label: "Cotovelo esquerdo: lado externo" },
  { id: "right-elbow-outer", coarse: "right-arm", label: "Cotovelo direito: lado externo" },
  { id: "left-biceps", coarse: "left-arm", label: "Músculo bíceps esquerdo" },
  { id: "right-biceps", coarse: "right-arm", label: "Músculo bíceps direito" },
  { id: "left-triceps", coarse: "left-arm", label: "Músculo tríceps esquerdo" },
  { id: "right-triceps", coarse: "right-arm", label: "Músculo tríceps direito" },
  { id: "left-knee-inner", coarse: "left-knee", label: "Joelho esquerdo: lado interno" },
  { id: "right-knee-inner", coarse: "right-knee", label: "Joelho direito: lado interno" },
  { id: "left-knee-outer", coarse: "left-knee", label: "Joelho esquerdo: lado externo" },
  { id: "right-knee-outer", coarse: "right-knee", label: "Joelho direito: lado externo" },
  { id: "left-quad", coarse: "left-thigh", label: "Músculo quadríceps esquerdo" },
  { id: "right-quad", coarse: "right-thigh", label: "Músculo quadríceps direito" },
  { id: "left-hamstring", coarse: "left-thigh", label: "Músculos posteriores da coxa esquerda" },
  { id: "right-hamstring", coarse: "right-thigh", label: "Músculos posteriores da coxa direita" },
  { id: "left-gluteus", coarse: "left-hip", label: "Músculo glúteo esquerdo" },
  { id: "right-gluteus", coarse: "right-hip", label: "Músculo glúteo direito" },
  { id: "left-calf-muscle", coarse: "left-leg", label: "Músculo da panturrilha esquerda" },
  { id: "right-calf-muscle", coarse: "right-leg", label: "Músculo da panturrilha direita" },
  { id: "left-wrist-joint", coarse: "left-hand", label: "Articulação do punho esquerdo" },
  { id: "right-wrist-joint", coarse: "right-hand", label: "Articulação do punho direito" },
  { id: "left-shoulder-ac", coarse: "left-shoulder", label: "Articulação acromioclavicular esquerda" },
  { id: "right-shoulder-ac", coarse: "right-shoulder", label: "Articulação acromioclavicular direita" },
  { id: "left-hip-joint", coarse: "left-hip", label: "Articulação do quadril esquerdo" },
  { id: "right-hip-joint", coarse: "right-hip", label: "Articulação do quadril direito" },
  { id: "pubic-symphysis", coarse: "abdomen", label: "Sínfise púbica" },
  { id: "sacroiliac-left", coarse: "left-hip", label: "Articulação sacroilíaca esquerda" },
  { id: "sacroiliac-right", coarse: "right-hip", label: "Articulação sacroilíaca direita" },
  { id: "cervical-spine", coarse: "neck", label: "Coluna cervical" },
  { id: "thoracic-spine", coarse: "upper-back", label: "Coluna torácica" },
  { id: "lumbar-spine", coarse: "lower-back", label: "Coluna lombar" },
  { id: "sacrum", coarse: "lower-back", label: "Sacro" },
  { id: "coccyx", coarse: "lower-back", label: "Cóccix" },
  { id: "left-deltoid", coarse: "left-shoulder", label: "Músculo deltoide esquerdo" },
  { id: "right-deltoid", coarse: "right-shoulder", label: "Músculo deltoide direito" },
  { id: "left-forearm-flexor", coarse: "left-arm", label: "Músculos flexores do antebraço esquerdo" },
  { id: "right-forearm-flexor", coarse: "right-arm", label: "Músculos flexores do antebraço direito" },
  { id: "left-forearm-extensor", coarse: "left-arm", label: "Músculos extensores do antebraço esquerdo" },
  { id: "right-forearm-extensor", coarse: "right-arm", label: "Músculos extensores do antebraço direito" },
  { id: "trapezius-left", coarse: "upper-back", label: "Trapézio esquerdo" },
  { id: "trapezius-right", coarse: "upper-back", label: "Trapézio direito" },
  { id: "pectoralis-left", coarse: "chest", label: "Músculo peitoral esquerdo" },
  { id: "pectoralis-right", coarse: "chest", label: "Músculo peitoral direito" },
  { id: "rectus-abdominis", coarse: "abdomen", label: "Músculo reto abdominal" },
  { id: "oblique-left", coarse: "abdomen", label: "Músculo oblíquo esquerdo" },
  { id: "oblique-right", coarse: "abdomen", label: "Músculo oblíquo direito" },
  { id: "uterus", coarse: "abdomen", label: "Região do útero" },
  { id: "bladder", coarse: "abdomen", label: "Região da bexiga" },
  { id: "bowel-left", coarse: "abdomen", label: "Região intestinal esquerda" },
  { id: "bowel-right", coarse: "abdomen", label: "Região intestinal direita" },
  { id: "stomach", coarse: "abdomen", label: "Região do estômago" },
  { id: "liver", coarse: "abdomen", label: "Região do fígado" },
  { id: "gallbladder", coarse: "abdomen", label: "Região da vesícula biliar" },
  { id: "spleen", coarse: "abdomen", label: "Região do baço" },
  { id: "pancreas", coarse: "abdomen", label: "Região do pâncreas" },
  { id: "kidney-left", coarse: "lower-back", label: "Região do rim esquerdo" },
  { id: "kidney-right", coarse: "lower-back", label: "Região do rim direito" },
] as const;
export type BodySiteDetailId = (typeof BODY_SITE_DETAILS)[number]["id"];
export type BodySiteDetail = (typeof BODY_SITE_DETAILS)[number];

export function bodySiteDetailLabel(id?: string) {
  return BODY_SITE_DETAILS.find((site) => site.id === id)?.label ?? (id ? bodySiteLabel(id) : "Local não informado");
}


export const CHRONIC_CONDITIONS = [
  { id: "fibromyalgia", label: "Fibromialgia", icon: "✦" },
  { id: "endometriosis", label: "Endometriose", icon: "◌" },
  { id: "fibroid", label: "Mioma", icon: "✿" },
  { id: "ovarian-cyst", label: "Cisto no ovário", icon: "◉" },
  { id: "breast-cysts", label: "Cistos nos seios", icon: "♡" },
  { id: "migraine-aura", label: "Enxaqueca com aura", icon: "☼" },
  { id: "disc-herniation", label: "Hérnia de disco", icon: "▥" },
  { id: "hip-bursitis", label: "Bursite na bacia", icon: "◇" },
  { id: "knee-bursitis", label: "Bursite no joelho", icon: "○" },
  { id: "hand-tendinitis", label: "Tendinite na mão", icon: "✋" },
  { id: "other-condition", label: "Outra condição", icon: "+" },
  { id: "unknown-condition", label: "Não sei / sem relação", icon: "?" },
] as const;

export function chronicConditionLabel(id: string) {
  return CHRONIC_CONDITIONS.find((condition) => condition.id === id)?.label ?? id;
}

export const LOCAL_SYMPTOMS = [
  { id: "swollen", label: "Inchado", icon: "🔴" },
  { id: "warm", label: "Quente", icon: "♨️" },
  { id: "red", label: "Vermelho", icon: "🟥" },
  { id: "blistered", label: "Com bolhas", icon: "🫧" },
  { id: "bruised", label: "Manchado", icon: "🟣" },
  { id: "numb", label: "Dormente", icon: "⭕" },
  { id: "stiff", label: "Rígido", icon: "🪵" },
  { id: "weak", label: "Fraco", icon: "〽️" },
  { id: "limited-movement", label: "Movimento limitado", icon: "🚫" },
  { id: "touch-sensitive", label: "Sensível ao toque", icon: "✋" },
] as const;

export const PAIN_TYPES = [
  { id: "throbbing", label: "Pulsante", icon: "〰" },
  { id: "aching", label: "Dolorida", icon: "◉" },
  { id: "stabbing", label: "Pontada", icon: "✦" },
  { id: "needle", label: "Agulhada", icon: "✧" },
  { id: "electric", label: "Choque", icon: "ϟ" },
  { id: "burning", label: "Queimação", icon: "♨" },
  { id: "stinging", label: "Ardência", icon: "✹" },
  { id: "tingling", label: "Formigamento", icon: "⁙" },
  { id: "numbness", label: "Dormência", icon: "⊙" },
  { id: "pressure", label: "Pressão", icon: "⇣" },
  { id: "heavy", label: "Peso", icon: "⬇" },
  { id: "tightness", label: "Aperto", icon: "⟷" },
  { id: "cramping", label: "Cólica", icon: "∿" },
  { id: "itching", label: "Coceira", icon: "✋" },
  { id: "tearing", label: "Rasgando", icon: "⌁" },
  { id: "continuous", label: "Contínua", icon: "—" },
  { id: "intermittent", label: "Intermitente", icon: "···" },
] as const;

export const EMOTIONS = [
  { id: "sad", label: "Triste", icon: "😔" },
  { id: "well", label: "Feliz", icon: "😊" },
  { id: "calm", label: "Calma", icon: "😌" },
  { id: "worried", label: "Estressada", icon: "😫" },
  { id: "moody", label: "Mal-humorada", icon: "😒" },
  { id: "irritated", label: "Irritada", icon: "😠" },
  { id: "anxious", label: "Ansiosa", icon: "😰" },
  { id: "angry", label: "Raivosa", icon: "😡" },
  { id: "discouraged", label: "Desanimada", icon: "😞" },
  { id: "melancholic", label: "Melancólica", icon: "😔" },
  { id: "euphoric", label: "Eufórica", icon: "🤩" },
  { id: "excited", label: "Excitada", icon: "🤗" },
  { id: "impatient", label: "Impaciente", icon: "😤" },
  { id: "frustrated", label: "Frustrada", icon: "😣" },
] as const;

export const FOOD_TRIGGERS = [
  { id: "chocolate", label: "Chocolate", icon: "🍫" },
  { id: "alcohol", label: "Álcool", icon: "🍷" },
  { id: "carbs", label: "Carboidratos", icon: "🍞" },
  { id: "ultra-processed", label: "Ultraprocessado", icon: "🍔" },
  { id: "fried", label: "Fritura", icon: "🍟" },
  { id: "dairy", label: "Laticínios", icon: "🥛" },
  { id: "gluten", label: "Glúten", icon: "🌾" },
  { id: "sugar", label: "Açúcar", icon: "🍬" },
  { id: "caffeine", label: "Cafeína", icon: "☕" },
  { id: "processed-meat", label: "Carne processada", icon: "🥓" },
  { id: "salty", label: "Muito sal", icon: "🧂" },
  { id: "new-food", label: "Alimento novo", icon: "✨" },
  { id: "none", label: "Nenhum desses", icon: "✓" },
] as const;

export type LocalSymptomId = (typeof LOCAL_SYMPTOMS)[number]["id"];

export type FoodProfile = { id: string; label: string };

export type MedicationPurpose = "preventive" | "pain-control";
export type MedicationProfile = { id: string; name: string; dose?: string; unit?: string };
export type MedicationUse = MedicationProfile & { purpose: MedicationPurpose; takenAt: string };

export type FollowUpStatus = "pending" | "improved" | "not-improved" | "worse" | "closed";

export type PainFollowUp = {
  id: string;
  painEntryId: string;
  scheduledAt: string;
  medicationName?: string;
  status: FollowUpStatus;
  answeredAt?: string;
  nextMedicationName?: string;
};

export type InAppNotification = {
  id: string;
  kind: "pain-follow-up" | "system";
  title: string;
  body: string;
  createdAt: string;
  readAt?: string;
  followUpId?: string;
  painEntryId?: string;
};

export type PainEntry = {
  id: string;
  occurredAt: string;
  primarySite: BodySiteId;
  primaryDetail?: BodySiteDetailId;
  conditions?: string[];
  radiationSites: BodySiteId[];
  radiationDetails?: BodySiteDetailId[];
  intensity: number;
  localSymptoms?: LocalSymptomId[];
  associatedPainIds?: string[];
  painTypes: string[];
  emotion: string;
  emotions?: string[];
  foods: string[];
  foodPeriod?: "today" | "last24h";
  medications?: MedicationUse[];
  weather?: WeatherSnapshot & { locality?: string };
  followUpNote?: string;
};

export type CalendarEntry = {
  id: string;
  title: string;
  category: "Pessoal" | "Saúde" | "Trabalho" | "Outro";
  startsAt: string;
  endsAt?: string;
  notes?: string;
};

export type AppData = {
  version: 2;
  healthEntries: HealthEntry[];
  weatherEntries: WeatherEntry[];
  calendarEntries: CalendarEntry[];
  painEntries: PainEntry[];
  medicationHistory: MedicationProfile[];
  customFoods: FoodProfile[];
  followUps: PainFollowUp[];
  notifications: InAppNotification[];
  deletedPainEntries: PainEntry[];
};

export const EMPTY_APP_DATA: AppData = {
  version: 2,
  healthEntries: [],
  weatherEntries: [],
  calendarEntries: [],
  painEntries: [],
  medicationHistory: [],
  customFoods: [],
  followUps: [],
  notifications: [],
  deletedPainEntries: [],
};

export function localSymptomLabel(id: string) {
  return LOCAL_SYMPTOMS.find((symptom) => symptom.id === id)?.label ?? id;
}

export function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function bodySiteLabel(id: string) {
  return BODY_SITES.find((site) => site.id === id)?.label ?? bodySiteDetailLabelFallback(id);
}

function bodySiteDetailLabelFallback(id: string) {
  return BODY_SITE_DETAILS.find((site) => site.id === id)?.label ?? id;
}

export function painTypeLabel(id: string) {
  return PAIN_TYPES.find((type) => type.id === id)?.label ?? id;
}

export function emotionLabel(id: string) {
  const legacyLabels: Record<string, string> = { tired: "Cansada", overwhelmed: "Sobrecarregada" };
  return EMOTIONS.find((emotion) => emotion.id === id)?.label ?? legacyLabels[id] ?? id;
}

export function foodLabel(id: string) {
  return FOOD_TRIGGERS.find((food) => food.id === id)?.label ?? id;
}
