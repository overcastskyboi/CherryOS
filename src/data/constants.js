import { 
  Clapperboard, Music, Gamepad2, Monitor, 
  Cloud, Package, Calculator,
  Pocket
} from 'lucide-react';

export const DESKTOP_APPS = [
  { id: 'watch', name: 'Watch List', icon: Clapperboard, path: '/watch', color: 'text-yellow-400', desc: 'Media Tracking' },
  { id: 'songs', name: 'My Music', icon: Music, path: '/songs', color: 'text-pink-400', desc: 'Audio Collection' },
  { id: 'games', name: 'Game Center', icon: Gamepad2, path: '/games', color: 'text-emerald-400', desc: 'Achievement Hub' },
  { id: 'pokedex', name: 'Pokédex', icon: Pocket, path: '/pokedex', color: 'text-red-400', desc: 'Pokémon Favorites' },
  { id: 'studio', name: 'Studio Rack', icon: Monitor, path: '/studio', color: 'text-blue-400', desc: 'VST Management' },
  { id: 'cloud', name: 'OCI Console', icon: Cloud, path: '/cloud', color: 'text-cyan-400', desc: 'Infrastructure' },
  { id: 'collection-tracker', name: 'The Vault', icon: Package, path: '/collection-tracker', color: 'text-amber-400', desc: 'Asset Tracker' },
  { id: 'bpm-calculator', name: 'BPM Sync', icon: Calculator, path: '/bpm-calculator', color: 'text-rose-400', desc: 'Production Tool' },
];

export const TYPE_COLORS = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#6F35FC',
  steel: '#B7B7CE',
  fairy: '#D685AD',
  dark: '#705746'
};

export const VERSION_ORDER = {
  'red-blue': 1, 'yellow': 2,
  'gold-silver': 3, 'crystal': 4,
  'ruby-sapphire': 5, 'emerald': 6, 'firered-leafgreen': 7,
  'diamond-pearl': 8, 'platinum': 9, 'heartgold-soulsilver': 10,
  'black-white': 11, 'black-2-white-2': 12,
  'x-y': 13, 'omega-ruby-alpha-sapphire': 14,
  'sun-moon': 15, 'ultra-sun-ultra-moon': 16,
  'lets-go-pikachu-lets-go-eevee': 17,
  'sword-shield': 18, 'brilliant-diamond-shining-pearl': 19, 'legends-arceus': 20,
  'scarlet-violet': 21
};

export const ANIME_DATA = {
  catalogue: [], // To be populated by mirror
  covers: {}
};

export const GAMING_DATA = {
  steam: { user: "AugustElliott", level: 42 },
  collection: [], // To be populated by mirror
  covers: {}
};

export const DEMO_MUSIC = [
  {
    album_name: "Melancholy (2021)",
    artist: "Colin Cherry",
    type: "Album",
    releaseDate: "2021-06-25",
    cover_url: "https://objectstorage.us-ashburn-1.oraclecloud.com/n/idg3nfddgypd/b/cherryos-deploy-prod/o/music/Melancholy%20(2021)/Melancholy%20(2021).jpg",
    tracks: [
      { title: "Intrusive Thoughts", url: "https://objectstorage.us-ashburn-1.oraclecloud.com/n/idg3nfddgypd/b/cherryos-deploy-prod/o/music/Melancholy%20(2021)/1%20-%20Intrusive%20Thoughts.wav" },
      { title: "Eyes Closed", url: "https://objectstorage.us-ashburn-1.oraclecloud.com/n/idg3nfddgypd/b/cherryos-deploy-prod/o/music/Melancholy%20(2021)/2%20-%20Eyes%20Closed.wav" },
      { title: "In My Head", url: "https://objectstorage.us-ashburn-1.oraclecloud.com/n/idg3nfddgypd/b/cherryos-deploy-prod/o/music/Melancholy%20(2021)/In%20My%20Head.wav" }
    ]
  }
];

export const VST_DETAILS = [
  {
    id: "waves-r",
    name: "Waves Renaissance Bundle",
    category: "Dynamics & Mixing",
    image: "https://static.waves.com/images/products/bundles/renaissance-maxx.jpg",
    link: "https://www.waves.com/bundles/renaissance-maxx",
    blurb: "The quintessential 'musical' processing suite. Includes the legendary R-Vox and R-Compressor.",
    plugins: [
      { name: "R-Vox", desc: "The go-to vocal compressor/gate/limiter.", interface: "https://static.waves.com/images/products/plugins/full/renaissance-vox.jpg" },
      { name: "R-Compressor", desc: "Classic warm compression for any source.", interface: "https://static.waves.com/images/products/plugins/full/renaissance-compressor.jpg" },
      { name: "R-EQ", desc: "Musical and transparent equalization.", interface: "https://static.waves.com/images/products/plugins/full/renaissance-equalizer.jpg" }
    ]
  },
  {
    id: "serum",
    name: "Xfer Records Serum",
    category: "Instruments",
    image: "https://xferrecords.com/product_images/serum_box_large.png",
    link: "https://xferrecords.com/products/serum",
    blurb: "The industry-standard wavetable synthesizer. High-quality sound, visual and creative workflow.",
    plugins: [
      { name: "Serum", desc: "Advanced wavetable synthesis.", interface: "https://xferrecords.com/product_images/serum_main_large.png" }
    ]
  },
  {
    id: "valhalla-super",
    name: "Valhalla Supermassive",
    category: "Reverb & Delay",
    image: "https://valhalladsp.com/wp-content/uploads/2020/05/Supermassive_Main.png",
    link: "https://valhalladsp.com/shop/reverb/valhalla-supermassive/",
    blurb: "Massive echoes, lush reverbs, and strange space-time modulations.",
    plugins: [
      { name: "Supermassive", desc: "The ultimate space machine.", interface: "https://valhalladsp.com/wp-content/uploads/2020/05/Supermassive_Screen.png" }
    ]
  }
];

export const calculateProductionValues = (bpm) => {
  if (bpm <= 0) return {};
  const quarterNote = 60000 / bpm;
  
  return {
    delays: {
      '1/4': {
        straight: Number((quarterNote).toFixed(2)),
        dotted: Number((quarterNote * 1.5).toFixed(2)),
        triplet: Number((quarterNote * 0.66667).toFixed(2))
      },
      '1/8': {
        straight: Number((quarterNote / 2).toFixed(2)),
        dotted: Number((quarterNote / 2 * 1.5).toFixed(2)),
        triplet: Number((quarterNote / 2 * 0.66667).toFixed(2))
      },
      '1/16': {
        straight: Number((quarterNote / 4).toFixed(2)),
        dotted: Number((quarterNote / 4 * 1.5).toFixed(2)),
        triplet: Number((quarterNote / 4 * 0.66667).toFixed(2))
      },
      '1/32': {
        straight: Number((quarterNote / 8).toFixed(2)),
        dotted: Number((quarterNote / 8 * 1.5).toFixed(2)),
        triplet: Number((quarterNote / 8 * 0.66667).toFixed(2))
      }
    },
    reverb: {
      preDelayTightMs: Number((quarterNote / 32).toFixed(2)),
      preDelayMediumMs: Number((quarterNote / 16).toFixed(2)),
      tailDecayMs: Number((quarterNote * 4).toFixed(2))
    },
    compressor: {
      releaseFastMs: Number((quarterNote / 16).toFixed(2)),
      releaseMediumMs: Number((quarterNote / 8).toFixed(2)),
      releaseSlowMs: Number((quarterNote / 4).toFixed(2)),
      attackSnapMs: Number((quarterNote / 64).toFixed(2))
    },
    lfoHz: {
      '1/1': Number((1000 / (quarterNote * 4)).toFixed(3)),
      '1/2': Number((1000 / (quarterNote * 2)).toFixed(3)),
      '1/4': Number((1000 / quarterNote).toFixed(3)),
      '1/8': Number((1000 / (quarterNote / 2)).toFixed(3)),
      '1/16': Number((1000 / (quarterNote / 4)).toFixed(3)),
      '1/32': Number((1000 / (quarterNote / 8)).toFixed(3))
    }
  };
};