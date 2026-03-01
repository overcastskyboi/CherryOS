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
      preDelayLooseMs: Number((quarterNote / 64).toFixed(2)),
      tailDecayMs: Number(((quarterNote * 4) + (quarterNote * 2)).toFixed(2))
    },
    compressor: {
      releaseFastMs: Number((quarterNote / 16).toFixed(2)),
      releaseMediumMs: Number((quarterNote / 8).toFixed(2)),
      releaseSlowMs: Number((quarterNote / 4).toFixed(2)),
      attackSnapMs: Number(((quarterNote / 32) / 2).toFixed(2))
    },
    lfoHz: {
      '1/1': Number((1 / (quarterNote * 4)).toFixed(2)),
      '1/2': Number((1 / (quarterNote * 2)).toFixed(2)),
      '1/4': Number((1 / quarterNote).toFixed(2)),
      '1/8': Number((1 / (quarterNote / 2)).toFixed(2)),
      '1/16': Number((1 / (quarterNote / 4)).toFixed(2)),
      '1/32': Number((1 / (quarterNote / 8)).toFixed(2))
    }
  };
};