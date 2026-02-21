export const ANIME_DATA = {
  catalogue: [
    {
      title: "Berserk",
      type: "Manga",
      score: 9.5,
      progress: "376+ Ch",
      status: "Reading"
    },
    {
      title: "Hunter x Hunter (2011)",
      type: "Anime",
      score: 10,
      progress: "148 Eps",
      status: "Completed"
    },
    {
      title: "Fullmetal Alchemist: B",
      type: "Anime",
      score: 10,
      progress: "64 Eps",
      status: "Completed"
    },
    {
      title: "Steins;Gate",
      type: "Anime",
      score: 10,
      progress: "24 Eps",
      status: "Completed"
    },
    {
      title: "Vinland Saga Season 2",
      type: "Anime",
      score: 10,
      progress: "24 Eps",
      status: "Completed"
    }
  ],
  covers: {
    "Berserk": "https://via.placeholder.com/300x450?text=Berserk+Cover",
    "Hunter x Hunter (2011)": "https://via.placeholder.com/300x450?text=HxH+Cover",
    "Fullmetal Alchemist: B": "https://via.placeholder.com/300x450?text=FMA+Cover",
    "Steins;Gate": "https://via.placeholder.com/300x450?text=SteinsGate+Cover",
    "Vinland Saga Season 2": "https://via.placeholder.com/300x450?text=Vinland+Saga+Cover"
  }
};

export const TRACKS = [
  { id: 1, title: "Momentum", artist: "Colin Cherry", duration: "2:45" },
  { id: 2, title: "Static Void", artist: "Colin Cherry", duration: "3:12" }
];

export const GAMING_DATA = {
  steam: { user: "AugustElliott", level: 42, gamesCount: 184 },
  retro: { user: "AugustElliott", hardcorePoints: 1200, recentMastery: "Final Fantasy VII" },
  collection: [
    { title: "Final Fantasy VII", platform: "Retro", playtime: "84h", status: "Mastered", rating: 10 },
    { title: "Elden Ring", platform: "Steam", playtime: "120h", status: "Playing", rating: 10 },
    { title: "Metal Gear Solid", platform: "Retro", playtime: "20h", status: "Completed", rating: 9.5 },
    { title: "Silent Hill 2", platform: "Retro", playtime: "12h", status: "Completed", rating: 10 },
    { title: "Cyberpunk 2077", platform: "Steam", playtime: "65h", status: "Completed", rating: 9 }
  ],
  covers: {
    "Final Fantasy VII": "https://via.placeholder.com/400x400?text=FF7+Cover",
    "Elden Ring": "https://via.placeholder.com/400x400?text=EldenRing+Cover",
    "Metal Gear Solid": "https://via.placeholder.com/400x400?text=MGS+Cover",
    "Silent Hill 2": "https://via.placeholder.com/400x400?text=SH2+Cover",
    "Cyberpunk 2077": "https://via.placeholder.com/400x400?text=CP2077+Cover"
  }
};

export const VST_LIST = {
  "Dynamics & Mixing": [
    "Waves Renaissance Bundle: RChannel, RCompressor, RVox",
    "Kilohearts (kHs) Essentials: kHs Dynamics, kHs Limiter, kHs Transient Shaper, kHs Gain, kHs Gate",
    "Tokyo Dawn Labs: TDR Nova",
    "TBProAudio: dEQ6V4, dpMeter5, dpMeterXT3, DSEQ3, DynaRide2, Euphonia3, FinalLoud3, GainRider3, LAxLimit4, mvMeter2, SLM2V2",
    "Individual: CLA-2A, ClipShifter, CS5501V2, Fresh Air, MJUCjr, OTT, Soothe2, Vocal Rider"
  ],
  "EQ & Filters": [
    "Waves Renaissance EQ: REQ 2, REQ 4, REQ 6",
    "Kilohearts (kHs) Filters: kHs 3-Band EQ, kHs Filter, kHs Ladder Filter, kHs Formant Filter",
    "TBProAudio: gEQ12V4, sTiltV2"
  ],
  "Reverb & Delay": [
    "Valhalla Suite: Valhalla Delay, Valhalla Shimmer, Valhalla SpaceModulator, Valhalla Supermassive, Valhalla UberMod, Valhalla VintageVerb",
    "Kilohearts (kHs) Time-Based Effects: kHs Chorus, kHs Ensemble, kHs Flanger, kHs Phaser, kHs Delay, kHs Dual Delay, kHs Frequency Shifter, kHs Phase Distortion, kHs Ring Mod, kHs Reverb",
    "Waves Reverb: IR-L (Efficient/Full), RVerb",
    "Individual: Clarity Vx DeReverb, SparkVerb, TAL Reverb 4"
  ],
  "Vocal & Utility": [
    "Waves Vocal Tools: Clarity Vx, Silk Vocal, Waves Tune LT, RDeEsser",
    "Antares: Auto-Tune",
    "Kilohearts (kHs) Pitch/Utility: kHs Pitch Shifter, kHs Tape Stop, kHs Haas, kHs Stereo",
    "Individual: Curves Equator, HoRNetSongKeyMK2, ABLM2, AMM2, ISOL8"
  ],
  "Saturation, Tone & Instruments": [
    "Kilohearts (kHs) Creative/Synth: kHs Bitcrush, kHs Distortion, kHs Reverser, kHs Resonator, kHs Shaper, kHs Trance Gate",
    "Xfer Records: Serum",
    "Individual: Abbey Road Saturator, Drip, RBass, Super VHS, Spitfire LABS, TyrellN6, UVIWorkstation"
  ]
};