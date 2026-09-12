export const WEAPONS = [
  // Tropas a pie — no son control remoto, van caminando y atacan directo
  { id: 'swat', label: 'SWAT', icon: '👮‍♂️', priceMX: 80, damage: 45, desc: 'A pie • asalto cercano', remote: false, kind: 'ped' },
  { id: 'sniper', label: 'Francotirador', icon: '🎯', priceMX: 95, damage: 85, desc: 'A pie • largo alcance', remote: false, kind: 'ped' },
  { id: 'cannon_basic', label: 'Cañón', icon: '💣', priceMX: 15, damage: 35, desc: 'Artillería básica', remote: false },
  { id: 'howitzer', label: 'Obús', icon: '💥', priceMX: 30, damage: 45, desc: 'Alcance medio', remote: false },
  { id: 'bomb', label: 'Bomba', icon: '💣', priceMX: 75, damage: 90, desc: 'Uso único', remote: false },
  { id: 'heavy_tank', label: 'Tanque Pesado', icon: '🛡️', priceMX: 120, damage: 55, desc: 'Blindado', remote: false },
  // Control remoto — se abre el mapa y eliges dónde atacar
  { id: 'rocket', label: 'Lanzacohetes', icon: '🚀', priceMX: 50, damage: 65, desc: 'Área 3x3 • control remoto mapa', remote: true, radius: 1 },
  { id: 'missile', label: 'Misil', icon: '🚀', priceMX: 200, damage: 120, desc: 'Precisión 5x5 • control remoto', remote: true, radius: 2 },
  { id: 'atomic', label: 'Bomba Atómica ☢️', icon: '☢️', priceMX: 500, damage: 300, desc: 'Área 7x7 • control remoto', remote: true, radius: 3 },
  { id: 'atomic_heavy', label: 'Atómica Pesada ☢️', icon: '💥', priceMX: 850, damage: 520, desc: 'Área 11x11 • escombros grises → pasto', remote: true, radius: 5 },
]

export const REMOTE_WEAPONS = WEAPONS.filter(w => w.remote)
export const FOOT_WEAPONS = WEAPONS.filter(w => !w.remote && ['swat','sniper'].includes(w.id))
