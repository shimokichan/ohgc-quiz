import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════
// OHGC QUIZ — CLUBHOUSE EDITION
// Pixel-art dollhouse × Y2K Barbiecore × gamer-girl clubhouse
// ═══════════════════════════════════════════════════════════════════

// ─── DESIGN TOKENS ────────────────────────────────────────────────
const T = {
  // Colors
  magenta:    "#E71372",
  magentaDim: "#C1005D",
  magentaGlow:"#FF3F97",
  blush:      "#FDE0EC",
  blushDeep:  "#F9C4D9",
  blushSoft:  "#FFF2F7",
  cream:      "#FFF8EE",
  gold:       "#D4A24C",
  goldDeep:   "#A17828",
  goldLight:  "#F0D488",
  ink:        "#1A0A14",
  inkSoft:    "#3D1D30",

  // Pastel accents (use sparingly — in framed art only)
  pastelBlue:   "#B5D9E8",
  pastelLav:    "#D4C4E8",
  pastelCoral:  "#F4A896",

  // Type
  displayFont: "'Bungee', 'Impact', sans-serif",
  scriptFont:  "'Great Vibes', 'Brush Script MT', cursive",
  pixelFont:   "'VT323', 'Courier New', monospace",
  bodyFont:    "'DM Sans', system-ui, sans-serif",
};

// ─── EXTERNAL LINKS ───────────────────────────────────────────────
// Replace these with your actual URLs when ready
const BEEHIIV_SUBSCRIBE_URL = "https://your-beehiiv-subscribe-url.com"; // ← Your Beehiiv signup page
const IDEA_BANK_SHOP_URL = "https://your-shop-url.com"; // ← Your Stan Store / product page

// ─── ARCHETYPES ───────────────────────────────────────────────────
const TYPES = {
  hime: {
    id: "hime", name: "HIKIKOMORI HIME", kanji: "引きこもり姫", emoji: "🏯",
    tagline: "The Aesthetic Curator.",
    description: "Your page feels like walking into the most beautiful nerdy bedroom anyone has ever seen. Everything is intentional. Everything is yours. You don't just consume your fandoms — you build a world around them. Your content is your environment: curated, peaceful, deeply personal.",
    contentLooks: ["Aesthetic setup tours & shelf reveals", "Cozy watch-with-me videos", "Unboxing & collection content", "Ambient flat lays & mood reels", "Merch hauls styled to your space"],
    hype: "Your nerdiness built a whole world. Now let it pay you back.",
    accent: "#F4A7B9",
  },
  gyaru: {
    id: "gyaru", name: "GENKI GYARU", kanji: "元気ギャル", emoji: "💅",
    tagline: "The Hype Machine.",
    description: "You're not performing excitement — you ARE excited, all the time, about everything. New drop? You're first. New con? Already there. New arc? You have opinions before the episode finishes downloading. Your page has no chill and that's the point.",
    contentLooks: ["Con vlogs & event day content", "Reaction & first-watch videos", "Hauls with full unfiltered energy", "Hot takes delivered loud and fast", "Community & hype collab content"],
    hype: "You've been the main character this whole time. Time to make content that proves it.",
    accent: "#FF6B35",
  },
  tsukuri: {
    id: "tsukuri", name: "TSUKURI-CHAN", kanji: "つくりちゃん", emoji: "✂️",
    tagline: "The Maker.",
    description: "Your page is a portfolio. Every post is proof of skill — something that didn't exist before you touched it. A cosplay built from scratch, a piece of fanart, a prop, a handmade thing that makes people stop mid-scroll. The process is as compelling as the result.",
    contentLooks: ["Build & WIP process videos", "Finished piece reveals & before/afters", "Material & supply hauls", "Technique breakdowns & tutorials", "Cosplay & craft portfolio content"],
    hype: "Every thing you've ever made is proof you were already a creator.",
    accent: "#9B59B6",
  },
  monoshiri: {
    id: "monoshiri", name: "MONOSHIRI", kanji: "物知り", emoji: "📚",
    tagline: "The Authority.",
    description: "You're not just opinionated — you're right, and you can prove it. You're the girl in the group chat who always has the receipts, and the critic whose rankings people actually trust. Your page is where people go when they want to understand something properly.",
    contentLooks: ["Deep dives & lore breakdowns", "Rankings & tier lists with real reasoning", "Hot takes backed by actual research", "Character & series analysis", "Theory content & receipts-first commentary"],
    hype: "The thing you know too much about? That's your entire brand.",
    accent: "#3D9BD4",
  },
};

// ─── QUESTIONS ────────────────────────────────────────────────────
const QUESTIONS = [
  { id: 1, q: "You suddenly become completely obsessed with something new. What happens next?", answers: [
    { text: "I start collecting little things around it. I change my wallpaper, save pictures, find merch, rearrange my space — somehow my entire environment starts looking like this new obsession.", type: "hime" },
    { text: "I need someone to talk to about it IMMEDIATELY. I'm sending posts to my friends, screaming in the group chat, and probably trying to get someone else obsessed too.", type: "gyaru" },
    { text: "My brain immediately goes, \"Wait... I could MAKE something based on this.\" I'm already thinking about the outfit, prop, drawing, or whatever I can turn it into.", type: "tsukuri" },
    { text: "I need to know everything. Where did it come from? What's the history? Suddenly I'm three hours into a Wikipedia rabbit hole.", type: "monoshiri" },
  ]},
  { id: 2, q: "You're scrolling and find someone making content about something you LOVE. What makes you stop scrolling?", answers: [
    { text: "The whole vibe. The lighting, their room, their collection, the music — I want to crawl through the screen and live in their world.", type: "hime" },
    { text: "Their PERSONALITY. They're funny, dramatic, excited — I don't even have to care about the topic. I'm staying because they're entertaining.", type: "gyaru" },
    { text: "They made something insane. I need to see the process, the transformation, the details.", type: "tsukuri" },
    { text: "They said something I hadn't thought about before. Give me the deep dive, the theory, the hot take with actual receipts.", type: "monoshiri" },
  ]},
  { id: 3, q: "Be honest: when you post about your interests, what do you naturally end up posting?", answers: [
    { text: "My space, my collection, purchases, outfits, cozy setups, or aesthetic clips. I don't need my face in everything.", type: "hime" },
    { text: "Me talking. Reactions, opinions, stories, jokes, rankings, random thoughts that turned into a 90-second video somehow.", type: "gyaru" },
    { text: "Whatever I'm making. WIPs, transformations, cosplay, crafts, drawings — the process IS the content.", type: "tsukuri" },
    { text: "Reviews, recommendations, theories, lore, character analysis, or me explaining something I have too many thoughts about.", type: "monoshiri" },
    { text: "I don't really post yet — I have interests and ideas but I haven't figured out how I want to show up.", type: "none" },
  ]},
  { id: 4, q: "You're finally going to start creating around the things you love. What sounds the most natural?", answers: [
    { text: "\"Let me show you my world without necessarily showing myself.\" Pretty shots, details, atmosphere, glimpses into my life.", type: "hime" },
    { text: "\"Let me get on camera and talk to y'all.\" I already have something to say.", type: "gyaru" },
    { text: "\"Let me make something and show you how I did it.\" If I'm creating something cool, people can watch me make it.", type: "tsukuri" },
    { text: "\"Let me explain something nobody is talking about.\" Give me a topic and approximately 45 minutes.", type: "monoshiri" },
  ]},
  { id: 5, q: "Someone finds your page for the first time. What do you secretly WANT them to think?", answers: [
    { text: "\"Wait... her whole world is SO cute. I want to be in it.\"", type: "hime" },
    { text: "\"She is SO much fun. I feel like we'd be friends.\"", type: "gyaru" },
    { text: "\"HOW DID SHE MAKE THAT?! I need to know.\"", type: "tsukuri" },
    { text: "\"I've never thought about it that way before.\"", type: "monoshiri" },
  ]},
  { id: 6, q: "A friend asks, \"Okay, but WHY do you like this so much?\" What do you do?", answers: [
    { text: "I'd rather just show them my space, my collection, or the things I've surrounded myself with. They'll understand when they see it.", type: "hime" },
    { text: "\"Girl, SIT DOWN.\" I'm giving them the full story, the funniest moments, the characters I love.", type: "gyaru" },
    { text: "I show them something I've made. That's usually when people actually understand why I'm so obsessed.", type: "tsukuri" },
    { text: "I explain it properly. There's context. There's history. Actually, let me start from the beginning...", type: "monoshiri" },
  ]},
  { id: 7, q: "You have a whole day to make ONE piece of content. What sounds most satisfying?", answers: [
    { text: "Setting up the perfect scene, filming the little details, getting the lighting right, making everything feel beautiful.", type: "hime" },
    { text: "Getting dressed, turning on the camera, and talking until I have 14 minutes of footage when I only needed 60 seconds.", type: "gyaru" },
    { text: "Spending the whole day making something and documenting the transformation from \"I have an idea\" to \"LOOK WHAT I MADE.\"", type: "tsukuri" },
    { text: "Going down a research rabbit hole, organizing my thoughts, and turning it into something people can actually understand.", type: "monoshiri" },
  ]},
  { id: 8, q: "What's your relationship with being seen online?", answers: [
    { text: "I like sharing parts of myself, but I don't need my face to be the center. Let the world I'm creating speak for me.", type: "hime" },
    { text: "I LIKE being seen. If I'm going to post, I want people to feel my personality. Give me the camera.", type: "gyaru" },
    { text: "I don't care if I'm the center of attention. I want people looking at what I'm making.", type: "tsukuri" },
    { text: "I care more about whether what I'm saying is interesting than whether I'm the most visible person in the room.", type: "monoshiri" },
  ]},
  { id: 9, q: "You post something you're proud of. Everyone you know can see it. Your immediate thought is...", answers: [
    { text: "\"Do they REALLY need to know this much about me?\" I like sharing, but I still want some things to belong to me.", type: "hime" },
    { text: "\"Wait, why isn't this getting MORE attention?\" If I made it, I want people to see it!", type: "gyaru" },
    { text: "\"I hope people notice the work that went into this.\" I want them to appreciate the craft.", type: "tsukuri" },
    { text: "\"I hope someone actually reads what I said.\" I care more about the conversation than being perceived.", type: "monoshiri" },
  ]},
  { id: 10, q: "You're deep in your favorite anime, manga, or game. What part of the experience grabs you hardest?", answers: [
    { text: "The atmosphere. The characters, the world, the visuals, the feeling of being transported somewhere else.", type: "hime" },
    { text: "The EMOTION. Give me characters I can scream about and moments I can immediately talk about with other people.", type: "gyaru" },
    { text: "The design. Costumes, weapons, sets, art, animation — I'm constantly thinking about how I could recreate it.", type: "tsukuri" },
    { text: "The details. The lore, symbolism, references, worldbuilding — there is ALWAYS something underneath the surface.", type: "monoshiri" },
  ]},
  { id: 11, q: "Last one. If your content could make people feel ONE thing when they leave your page, what would it be?", answers: [
    { text: "\"I want my life to feel a little more like hers.\"", type: "hime" },
    { text: "\"OMG, I love her. I need to see what she's doing next.\"", type: "gyaru" },
    { text: "\"I want to MAKE something now.\"", type: "tsukuri" },
    { text: "\"Wait... I need to go think about that.\"", type: "monoshiri" },
  ]},
];

const PART2 = [
  { id: 12, q: "Camera comfort — where are you right now?", answers: [
    { text: "Fully faceless — my face isn't part of the content, and I don't need it to be.", value: "faceless" },
    { text: "Voice only — I'll talk but showing my face isn't something I'm ready for yet.", value: "voiceover" },
    { text: "Occasionally on-camera — I'm open to it sometimes, just not every video.", value: "occasional" },
    { text: "Fully on-camera — give me the camera. I want people to see me.", value: "full" },
  ]},
  { id: 13, q: "Which kind of content sounds most like something you'd actually make?", answers: [
    { text: "Aesthetic & visual — beautiful shots, mood reels, flat lays. The look IS the content.", value: "aesthetic" },
    { text: "Talking & personality — me on camera talking. Reactions, opinions, stories.", value: "talking" },
    { text: "Process & making — documenting what I create. The making is the point.", value: "process" },
    { text: "Analysis & education — deep dives, breakdowns, reviews, theories.", value: "analysis" },
    { text: "A mix — I like variety and don't want to be locked into one style.", value: "mix" },
  ]},
];

const INTERESTS_LIST = [
  { id: "anime",       label: "Anime",         icon: "✨" },
  { id: "manga",       label: "Manga",         icon: "📖" },
  { id: "cosplay",     label: "Cosplay",       icon: "🎭" },
  { id: "gaming",      label: "Gaming",        icon: "🎮" },
  { id: "kpop",        label: "K-Pop",         icon: "🎵" },
  { id: "figures",     label: "Figures",       icon: "🗿" },
  { id: "conventions", label: "Conventions",   icon: "🎪" },
  { id: "art",         label: "Art",           icon: "🎨" },
  { id: "fashion",     label: "Fashion",       icon: "👗" },
  { id: "food",        label: "Café / Food",   icon: "🍡" },
  { id: "games",       label: "Gacha",         icon: "📱" },
  { id: "webtoons",    label: "Webtoons",      icon: "🌐" },
];

// ─── HELPERS ──────────────────────────────────────────────────────
const CAM_UNLOCK = {
  faceless:   ["faceless"],
  voiceover:  ["faceless", "voiceover"],
  occasional: ["faceless", "voiceover", "occasional"],
  full:       ["faceless", "voiceover", "occasional", "full"],
};

function getCamTag(idea) {
  const t = (idea.shot + " " + idea.title).toLowerCase();
  if (t.includes("get on camera") || t.includes("turn on the camera") || t.includes("grwm") || t.includes("camera on your face") || t.includes("front-facing") || t.includes("sit in front")) return "full";
  if (t.includes("occasionally") || t.includes("sometimes")) return "occasional";
  if (t.includes("voiceover") || t.includes("voice") || t.includes("narrates")) return "voiceover";
  return "faceless";
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Basic idea set (kept short to preserve build focus on visuals)
const IDEAS = {
  hime: {
    anime: [
      { title: "The Comfort Rewatch Vlog", shot: "Set up your phone at your desk. Film yourself settled in — snacks, lighting, show queued. Text overlay: what you're rewatching and why. No talking needed.", hook: "Rewatching [series] for the 4th time. I am fine." },
      { title: "Ambient Watch-With-Me", shot: "Overhead or side angle of your space. Lofi music, dim lighting, anime on in the background. Let it run 3–5 minutes.", hook: "Come watch [series] with me. No talking, just vibes." },
      { title: "Cozy Night Setup Reel", shot: "Film your setup transitioning from day to night — curtains drawn, lights dimmed. Hands visible pouring a drink or unwrapping snacks.", hook: "This is what a perfect night looks like." },
    ],
    figures: [
      { title: "New Figure Beauty Shot", shot: "Unbox slowly. Place the figure in your space. Film a slow 180° pan from multiple angles. Soft music.", hook: "She arrived. The altar is complete." },
      { title: "Shelf Story Voiceover", shot: "Slow pan across your entire shelf. Voiceover narrates the story behind each piece.", hook: "Every figure on my shelf has a whole backstory." },
    ],
    manga: [
      { title: "Current Read Hands Reel", shot: "Film your hands slowly flipping through your current volume. No face. Just your hands, the pages, and trending audio.", hook: "Currently not okay about this arc." },
      { title: "Shelf Reorganization Timelapse", shot: "Phone captures a timelapse of you reorganizing your manga shelf. End on a beauty shot.", hook: "I reorganized my manga shelf at midnight again." },
    ],
  },
  gyaru: {
    anime: [
      { title: "GRWM To Watch the New Episode", shot: "Film yourself getting dressed or doing makeup while talking about what you're expecting. Energy is everything.", hook: "Getting ready to watch [series] like it's an event. Because it is." },
      { title: "My Immediate Reaction Right After", shot: "Camera on your face right after finishing the episode. No editing — just you and the aftermath.", hook: "Just finished [episode] and I need to talk about it immediately." },
    ],
    conventions: [
      { title: "Full Con Day Vlog", shot: "Film the entire day — getting ready, arriving, the floor, the haul, the people, the ending.", hook: "Con day. I will not be normal about this." },
      { title: "Con Fit Check Before You Go In", shot: "Film your outfit outside the venue. Walk through every element — the character inspo, where you got it.", hook: "Con fit check. Let me explain every piece." },
    ],
    kpop: [
      { title: "Album Unboxing With Full Energy", shot: "Film the unboxing with the same energy you'd give an anime figure drop.", hook: "Unboxing [album] because she deserves a proper unboxing." },
    ],
  },
  tsukuri: {
    cosplay: [
      { title: "Full Build From Start to Finish", shot: "Document the entire cosplay build across a series — from concept to final reveal.", hook: "Building [character]'s costume from scratch. Day [X]." },
      { title: "The Detail Nobody Asked For", shot: "Close-up video entirely focused on one specific detail of your build.", hook: "Nobody asked for a 3-minute video about this one detail. Here it is anyway." },
    ],
    art: [
      { title: "Full Art Process Start to Finish", shot: "Film the complete process of a piece from sketch to final. Time-lapse or real-time.", hook: "Full process video for this piece. Here's every decision I made." },
      { title: "Making Stickers From My Favorite Characters", shot: "Film the design + print + cut process of making your own character stickers.", hook: "I turned my favorite characters into stickers. Here's the whole process." },
    ],
    fashion: [
      { title: "Sewing an Anime-Inspired Outfit", shot: "Film the complete sewing process — fabric selection, cutting, sewing, the final try-on.", hook: "I wanted [style] and couldn't find it, so I made it." },
    ],
  },
  monoshiri: {
    anime: [
      { title: "The Detail Everyone Missed", shot: "Screen record paused at a key moment while voiceover walks through a detail most viewers skipped.", hook: "Nobody is talking about this detail." },
      { title: "Why This Arc Is Actually Perfect", shot: "Voiceover over relevant stills. Make the full analytical case for a divisive arc.", hook: "Everyone hated [arc]. They were wrong. Here's why." },
    ],
    manga: [
      { title: "Manga vs. Anime — What They Changed and Why", shot: "Film your volumes alongside the anime on your screen. Voiceover breaks down the changes.", hook: "The manga did it better. Here are the receipts." },
      { title: "Reading Order Guide for a Complex Series", shot: "Pan across your collection while voiceover walks a beginner through where to start.", hook: "New to [series]? I'll tell you exactly where to begin." },
    ],
    gaming: [
      { title: "Game Lore — What the Game Doesn't Tell You", shot: "Screen record key moments while voiceover fills in the hidden lore.", hook: "The real story of [game] is hidden in the background." },
    ],
  },
};

function getIdeas(typeId, selectedInterests, comfort) {
  const pool = IDEAS[typeId];
  if (!pool) return [];
  const allowed = CAM_UNLOCK[comfort] || CAM_UNLOCK["full"];
  const fits = (idea) => allowed.includes(getCamTag(idea));
  const results = [];
  for (const interest of selectedInterests) {
    const ideaPool = (pool[interest] || []).filter(fits);
    for (const idea of ideaPool.slice(0, 2)) {
      if (!results.find(r => r.title === idea.title)) results.push(idea);
    }
  }
  if (results.length < 4) {
    for (const [, ideaPool] of Object.entries(pool)) {
      for (const idea of ideaPool.filter(fits)) {
        if (!results.find(r => r.title === idea.title)) results.push(idea);
        if (results.length >= 4) break;
      }
      if (results.length >= 4) break;
    }
  }
  if (results.length < 4) return getIdeas(typeId, selectedInterests, "full");
  return results.slice(0, 4);
}

// ─── PERSISTENCE (localStorage) ───────────────────────────────────
// Free-tier persistence: store completed results only, per-browser.
// Partial progress is NOT persisted — clean start every time.
// When the paid tier is built, this will be replaced/augmented by
// server-side storage tied to authenticated user identity.
const STORAGE_KEY = "ohgc_quiz_result_v1";

function saveResult(payload) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: 1,
      completedAt: Date.now(),
      ...payload,
    }));
  } catch (e) {
    console.warn("Could not save result to localStorage:", e);
  }
}

function loadResult() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== 1) return null;
    if (!parsed.archetypeId || !parsed.ideas || !Array.isArray(parsed.ideas)) return null;
    return parsed;
  } catch (e) {
    return null;
  }
}

function clearResult() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
}

// ═══════════════════════════════════════════════════════════════════
// REUSABLE PIXEL COMPONENTS
// ═══════════════════════════════════════════════════════════════════

// Font loader (injects Google Fonts once)
function useFonts() {
  useEffect(() => {
    if (document.getElementById("ohgc-fonts")) return;
    const link = document.createElement("link");
    link.id = "ohgc-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Bungee&family=Great+Vibes&family=VT323&family=DM+Sans:wght@400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

// Chunky pixel-style border (using layered box-shadows for stepped edge)
function pixelBorder(color = T.ink, thickness = 3) {
  const t = thickness;
  return {
    boxShadow: `
      ${t}px 0 0 ${color},
      -${t}px 0 0 ${color},
      0 ${t}px 0 ${color},
      0 -${t}px 0 ${color},
      ${t}px ${t}px 0 ${color},
      -${t}px -${t}px 0 ${color},
      ${t}px -${t}px 0 ${color},
      -${t}px ${t}px 0 ${color}
    `,
  };
}

// Ornate gold frame — used for framed art / archetype reveal
function GoldFrame({ children, size = 100, accent = T.gold }) {
  return (
    <div style={{
      position: "relative",
      display: "inline-block",
      padding: 10,
      background: `linear-gradient(135deg, ${T.goldLight} 0%, ${accent} 50%, ${T.goldDeep} 100%)`,
      border: `3px solid ${T.ink}`,
      boxShadow: `4px 4px 0 ${T.ink}, 6px 6px 0 ${T.goldDeep}`,
    }}>
      {/* Inner mat */}
      <div style={{
        background: T.cream,
        border: `2px solid ${T.goldDeep}`,
        width: size, height: size,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        {/* Corner pixels */}
        <div style={{ position: "absolute", top: 2, left: 2, width: 4, height: 4, background: T.goldDeep }} />
        <div style={{ position: "absolute", top: 2, right: 2, width: 4, height: 4, background: T.goldDeep }} />
        <div style={{ position: "absolute", bottom: 2, left: 2, width: 4, height: 4, background: T.goldDeep }} />
        <div style={{ position: "absolute", bottom: 2, right: 2, width: 4, height: 4, background: T.goldDeep }} />
        {children}
      </div>
    </div>
  );
}

// Pixel button — chunky, primary CTA
function PixelButton({ children, onClick, disabled, primary = true, small = false, fullWidth = false }) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const bg = primary ? T.magenta : T.cream;
  const fg = primary ? T.cream : T.ink;
  const offset = pressed ? 0 : (hover ? 2 : 4);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        position: "relative",
        display: fullWidth ? "block" : "inline-block",
        width: fullWidth ? "100%" : "auto",
        padding: small ? "12px 22px" : "18px 34px",
        background: disabled ? "#999" : bg,
        color: disabled ? "#ccc" : fg,
        fontFamily: T.displayFont,
        fontSize: small ? 14 : 18,
        letterSpacing: "0.05em",
        border: `3px solid ${T.ink}`,
        cursor: disabled ? "not-allowed" : "pointer",
        transform: `translate(${-offset}px, ${-offset}px)`,
        boxShadow: `${offset}px ${offset}px 0 ${T.ink}`,
        transition: "transform 0.08s ease, box-shadow 0.08s ease",
        textTransform: "uppercase",
      }}
    >
      {children}
    </button>
  );
}

// The OHGC logo lockup — reuseable
function OHGCLogo({ scale = 1 }) {
  return (
    <div style={{ textAlign: "center", lineHeight: 1 }}>
      {/* OTAKU — chunky pink display */}
      <div style={{
        fontFamily: T.displayFont,
        fontSize: 46 * scale,
        color: T.magenta,
        letterSpacing: "0.02em",
        WebkitTextStroke: `1px ${T.ink}`,
        textShadow: `3px 3px 0 ${T.ink}`,
        lineHeight: 0.9,
      }}>
        OTAKU
      </div>
      {/* Hot Girls — script */}
      <div style={{
        fontFamily: T.scriptFont,
        fontSize: 42 * scale,
        color: T.ink,
        lineHeight: 0.9,
        marginTop: -6 * scale,
        transform: "rotate(-3deg)",
        display: "inline-block",
      }}>
        Hot Girls
      </div>
      {/* CLUB — pixel */}
      <div style={{
        fontFamily: T.pixelFont,
        fontSize: 22 * scale,
        color: T.magentaDim,
        letterSpacing: "0.4em",
        marginTop: 4 * scale,
      }}>
        C · L · U · B
      </div>
    </div>
  );
}

// Small brand chip (used in headers when not the logo moment)
function BrandChip() {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "6px 14px",
      background: T.magenta,
      color: T.cream,
      fontFamily: T.pixelFont,
      fontSize: 16,
      letterSpacing: "0.15em",
      border: `2px solid ${T.ink}`,
      boxShadow: `2px 2px 0 ${T.ink}`,
    }}>
      ♡ OTAKU HOT GIRLS CLUB ♡
    </div>
  );
}

// Wallpaper background — pink vertical stripes
function StripedWallpaper() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0,
      background: `repeating-linear-gradient(
        90deg,
        ${T.blush} 0px,
        ${T.blush} 24px,
        ${T.blushDeep} 24px,
        ${T.blushDeep} 26px
      )`,
      pointerEvents: "none",
    }} />
  );
}

// Chunky floor border (bottom decoration)
function FloorBorder() {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, height: 40, zIndex: 1,
      background: T.magentaDim,
      borderTop: `4px solid ${T.ink}`,
      pointerEvents: "none",
    }}>
      {/* Checker pattern */}
      <div style={{
        position: "absolute", inset: 0,
        background: `repeating-linear-gradient(
          90deg,
          ${T.magentaDim} 0px,
          ${T.magentaDim} 20px,
          ${T.magenta} 20px,
          ${T.magenta} 40px
        )`,
      }} />
    </div>
  );
}

// Chandelier — decorative header piece
function Chandelier() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 8 }}>
      {/* Chain */}
      <div style={{ width: 3, height: 20, background: T.ink }} />
      {/* Body */}
      <div style={{ position: "relative" }}>
        <div style={{
          width: 60, height: 20,
          background: `linear-gradient(180deg, ${T.goldLight}, ${T.goldDeep})`,
          border: `2px solid ${T.ink}`,
          borderRadius: "50%",
        }} />
        {/* Three hanging pixels */}
        <div style={{ position: "absolute", top: 18, left: 8, width: 4, height: 8, background: T.goldDeep, border: `1px solid ${T.ink}` }} />
        <div style={{ position: "absolute", top: 20, left: 28, width: 4, height: 10, background: T.goldDeep, border: `1px solid ${T.ink}` }} />
        <div style={{ position: "absolute", top: 18, left: 48, width: 4, height: 8, background: T.goldDeep, border: `1px solid ${T.ink}` }} />
      </div>
    </div>
  );
}

// Page container — cream card w/ pixel border, floats above wallpaper
function PageCard({ children, maxWidth = 620 }) {
  return (
    <div style={{
      position: "relative", zIndex: 2,
      maxWidth,
      margin: "40px auto 80px",
      padding: "32px 28px",
      background: T.cream,
      border: `4px solid ${T.ink}`,
      boxShadow: `8px 8px 0 ${T.ink}, 8px 8px 0 4px ${T.goldDeep}`,
    }}>
      {/* Corner ornaments */}
      <CornerOrnament pos="tl" />
      <CornerOrnament pos="tr" />
      <CornerOrnament pos="bl" />
      <CornerOrnament pos="br" />
      {children}
    </div>
  );
}

function CornerOrnament({ pos }) {
  const styles = {
    tl: { top: -4, left: -4 },
    tr: { top: -4, right: -4 },
    bl: { bottom: -4, left: -4 },
    br: { bottom: -4, right: -4 },
  };
  return (
    <div style={{
      position: "absolute", ...styles[pos],
      width: 16, height: 16,
      background: T.gold,
      border: `3px solid ${T.ink}`,
    }} />
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function OHGCQuiz() {
  useFonts();
  const [phase, setPhase] = useState("intro");
  const [userName, setUserName] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({ hime: 0, gyaru: 0, tsukuri: 0, monoshiri: 0 });
  const [selected, setSelected] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [result, setResult] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [interests, setInterests] = useState([]);
  const [part2Step, setPart2Step] = useState(0);
  const [part2Answers, setPart2Answers] = useState({});
  const [savedIdeas, setSavedIdeas] = useState(null);
  const [hydrating, setHydrating] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const topRef = useRef(null);
  const comfort = part2Answers[12] || "full";

  // ── Hydrate from localStorage on first mount ──────────────────
  useEffect(() => {
    const saved = loadResult();
    if (saved) {
      setUserName(saved.userName || "");
      setResult(TYPES[saved.archetypeId] || null);
      setInterests(saved.interests || []);
      setPart2Answers({ 12: saved.cameraComfort || "full", 13: saved.contentStyle || "mix" });
      setSavedIdeas(saved.ideas || null);
      setPhase("generator");
    }
    setHydrating(false);
  }, []);

  useEffect(() => {
    if (phase === "quiz") {
      const q = QUESTIONS[currentQ];
      const ans = q.id === 3
        ? shuffleArray(q.answers.filter(a => a.type !== "none")).concat(q.answers.filter(a => a.type === "none"))
        : shuffleArray(q.answers);
      setShuffledAnswers(ans);
    }
  }, [currentQ, phase]);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [phase, currentQ, part2Step]);

  function handleAnswer(answer) {
    if (selected || transitioning) return;
    setSelected(answer.type || answer.value);
    const newScores = { ...scores };
    if (answer.type && answer.type !== "none") {
      newScores[answer.type] = (newScores[answer.type] || 0) + 1;
    }
    setScores(newScores);

    setTimeout(() => {
      setTransitioning(true);
      setTimeout(() => {
        if (currentQ < QUESTIONS.length - 1) {
          setCurrentQ(q => q + 1);
          setSelected(null);
          setTransitioning(false);
        } else {
          const winner = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0];
          setResult(TYPES[winner]);
          setPhase("result");
          setTransitioning(false);
        }
      }, 380);
    }, 500);
  }

  function handlePart2Answer(answer) {
    const q = PART2[part2Step];
    const newAnswers = { ...part2Answers, [q.id]: answer.value };
    setPart2Answers(newAnswers);
    if (part2Step < PART2.length - 1) {
      setPart2Step(s => s + 1);
    } else {
      // Part 2 done — generate ideas, save result, go to generator
      const finalComfort = newAnswers[12] || "full";
      const generated = getIdeas(result.id, interests, finalComfort);
      setSavedIdeas(generated);
      saveResult({
        userName,
        archetypeId: result.id,
        interests,
        cameraComfort: finalComfort,
        contentStyle: newAnswers[13] || "mix",
        ideas: generated,
      });
      setPhase("generator");
    }
  }

  // Only used by the pre-completion "retake" on the result reveal
  // screen (before ideas are generated, so no result is stored yet).
  function restartQuiz() {
    setPhase("intro"); setUserName(""); setCurrentQ(0);
    setScores({ hime: 0, gyaru: 0, tsukuri: 0, monoshiri: 0 });
    setSelected(null); setResult(null); setInterests([]);
    setPart2Step(0); setPart2Answers({});
    setSavedIdeas(null);
    setTransitioning(false);
  }

  // Deliberate "clear my saved result" flow — only reachable after
  // completion via the small link on the generator screen + confirm.
  function deleteResultAndRestart() {
    clearResult();
    setShowResetConfirm(false);
    restartQuiz();
  }

  return (
    <div ref={topRef} style={{
      minHeight: "100vh",
      fontFamily: T.bodyFont,
      color: T.ink,
      background: T.blush,
      overflowX: "hidden",
      paddingBottom: 60,
      position: "relative",
    }}>
      <StripedWallpaper />
      <FloorBorder />

      {hydrating ? null : (
        <div style={{
          position: "relative", zIndex: 2,
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "translateY(6px)" : "translateY(0)",
          transition: "opacity 0.32s ease, transform 0.32s ease",
        }}>
          {phase === "intro" && <IntroScreen onStart={(name) => { setUserName(name); setPhase("quiz"); }} />}
          {phase === "quiz" && (
            <QuizScreen
              question={QUESTIONS[currentQ]}
              questionNum={currentQ + 1}
              total={QUESTIONS.length}
              answers={shuffledAnswers}
              selected={selected}
              onAnswer={handleAnswer}
              userName={userName}
            />
          )}
          {phase === "result" && result && (
            <ResultScreen
              result={result} userName={userName}
              interests={interests} setInterests={setInterests}
              onContinue={() => setPhase("part2")}
              onRetake={restartQuiz}
            />
          )}
          {phase === "part2" && (
            <Part2Screen
              question={PART2[part2Step]}
              step={part2Step} total={PART2.length}
              result={result} userName={userName}
              onAnswer={handlePart2Answer}
            />
          )}
          {phase === "generator" && result && (
            <GeneratorScreen
              result={result}
              userName={userName}
              interests={interests}
              comfort={comfort}
              ideas={savedIdeas || getIdeas(result.id, interests, comfort)}
              onRequestReset={() => setShowResetConfirm(true)}
            />
          )}
        </div>
      )}

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <ResetConfirmModal
          onConfirm={deleteResultAndRestart}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCREEN: INTRO — Enter the Clubhouse
// ═══════════════════════════════════════════════════════════════════
function IntroScreen({ onStart }) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [v, setV] = useState(false);
  useEffect(() => { setTimeout(() => setV(true), 60); }, []);

  function handleStart() {
    if (!name.trim()) { setNameError(true); return; }
    onStart(name.trim());
  }

  const first = name.trim().split(" ")[0];

  return (
    <PageCard>
      <div style={{ textAlign: "center", opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(10px)", transition: "all 0.6s ease" }}>
        <Chandelier />

        <div style={{ marginBottom: 20 }}>
          <OHGCLogo scale={1} />
        </div>

        {/* Framed art row — pixel objects */}
        <div style={{ display: "flex", justifyContent: "center", gap: 14, margin: "24px 0 20px", flexWrap: "wrap" }}>
          <GoldFrame size={54} accent={T.gold}>
            <div style={{ fontSize: 32 }}>🎮</div>
          </GoldFrame>
          <GoldFrame size={54} accent={T.gold}>
            <div style={{ fontSize: 32 }}>💅</div>
          </GoldFrame>
          <GoldFrame size={54} accent={T.gold}>
            <div style={{ fontSize: 32 }}>🎨</div>
          </GoldFrame>
          <GoldFrame size={54} accent={T.gold}>
            <div style={{ fontSize: 32 }}>🌸</div>
          </GoldFrame>
        </div>

        {/* Title */}
        <div style={{
          fontFamily: T.pixelFont, fontSize: 20, color: T.magentaDim,
          letterSpacing: "0.3em", marginBottom: 6,
        }}>
          ✧ CREATOR ARCHETYPE QUIZ ✧
        </div>

        <p style={{
          fontFamily: T.bodyFont, fontSize: 15, lineHeight: 1.7,
          color: T.inkSoft, maxWidth: 380, margin: "16px auto 30px",
        }}>
          Discover what kind of creator you are and get personalized content ideas based on the things you're already obsessed with.
        </p>

        {/* Meta strip */}
        <div style={{
          display: "inline-block",
          padding: "8px 18px",
          background: T.blushDeep,
          border: `2px solid ${T.ink}`,
          fontFamily: T.pixelFont, fontSize: 17,
          color: T.inkSoft, letterSpacing: "0.15em",
          marginBottom: 32,
        }}>
          11 QUESTIONS · ~2 MINUTES
        </div>

        {/* Name input */}
        <div style={{ maxWidth: 340, margin: "0 auto 20px", textAlign: "left" }}>
          <label style={{
            display: "block",
            fontFamily: T.pixelFont, fontSize: 17,
            color: T.magentaDim, letterSpacing: "0.1em",
            marginBottom: 6, textAlign: "center",
          }}>
            ♥ FIRST — WHAT'S YOUR NAME? ♥
          </label>
          <input
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setNameError(false); }}
            onKeyDown={e => e.key === "Enter" && handleStart()}
            placeholder="your name or nickname"
            style={{
              width: "100%",
              padding: "12px 16px",
              background: T.blushSoft,
              border: `3px solid ${nameError ? T.magenta : T.ink}`,
              fontFamily: T.pixelFont, fontSize: 20,
              color: T.ink,
              outline: "none",
              textAlign: "center",
              boxSizing: "border-box",
              boxShadow: `4px 4px 0 ${T.ink}`,
            }}
          />
          {nameError && (
            <div style={{
              fontFamily: T.pixelFont, fontSize: 15, color: T.magenta,
              marginTop: 8, textAlign: "center",
            }}>
              we need something to call you ♡
            </div>
          )}
        </div>

        <div style={{ marginTop: 20 }}>
          <PixelButton onClick={handleStart}>
            {first ? `LET'S GO, ${first.toUpperCase()} →` : "ENTER THE CLUBHOUSE →"}
          </PixelButton>
        </div>
      </div>
    </PageCard>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCREEN: QUIZ
// ═══════════════════════════════════════════════════════════════════
function QuizScreen({ question, questionNum, total, answers, selected, onAnswer, userName }) {
  const first = userName ? userName.split(" ")[0] : "";
  const [v, setV] = useState(false);
  useEffect(() => { setV(false); setTimeout(() => setV(true), 60); }, [questionNum]);

  const pct = Math.round(((questionNum - 1) / total) * 100);

  return (
    <PageCard>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <BrandChip />
      </div>

      {/* Greeting on Q1 */}
      {questionNum === 1 && first && (
        <div style={{
          textAlign: "center",
          fontFamily: T.scriptFont, fontSize: 26,
          color: T.magentaDim, marginBottom: 16,
        }}>
          okay {first}, let's find your type
        </div>
      )}

      {/* Progress — game-style meter */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontFamily: T.pixelFont, fontSize: 18, marginBottom: 6,
        }}>
          <span style={{ color: T.magentaDim, letterSpacing: "0.15em" }}>
            QUESTION {String(questionNum).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span style={{ color: T.inkSoft }}>{pct}%</span>
        </div>
        {/* Pixel meter */}
        <div style={{
          position: "relative",
          height: 16,
          background: T.blushDeep,
          border: `3px solid ${T.ink}`,
          boxShadow: `3px 3px 0 ${T.ink}`,
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${(questionNum / total) * 100}%`,
            background: `repeating-linear-gradient(
              45deg,
              ${T.magenta} 0px, ${T.magenta} 6px,
              ${T.magentaGlow} 6px, ${T.magentaGlow} 12px
            )`,
            transition: "width 0.4s ease",
          }} />
        </div>
      </div>

      {/* Question */}
      <h2 style={{
        fontFamily: T.displayFont,
        fontSize: "clamp(18px, 4vw, 24px)",
        color: T.ink,
        lineHeight: 1.3,
        margin: "0 0 24px",
        letterSpacing: "0.01em",
        opacity: v ? 1 : 0,
        transform: v ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.4s ease",
      }}>
        {question.q}
      </h2>

      {/* Answers */}
      <div style={{ display: "grid", gap: 12 }}>
        {answers.map((answer, i) => {
          const key = answer.type || answer.value;
          const isSelected = selected === key;
          const isOther = selected && !isSelected;
          const typeKey = answer.type !== "none" ? answer.type : null;
          const accent = typeKey ? TYPES[typeKey].accent : T.magenta;

          return (
            <AnswerCard
              key={i} answer={answer} isSelected={isSelected} isOther={isOther}
              disabled={!!selected} accent={accent}
              onClick={() => onAnswer(answer)}
              delay={i * 60} visible={v}
            />
          );
        })}
      </div>
    </PageCard>
  );
}

function AnswerCard({ answer, isSelected, isOther, disabled, accent, onClick, delay, visible }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        width: "100%", textAlign: "left",
        padding: "16px 18px",
        background: isSelected ? T.magenta : (hover && !disabled ? T.blushSoft : T.cream),
        color: isSelected ? T.cream : T.ink,
        border: `3px solid ${T.ink}`,
        boxShadow: isSelected
          ? `4px 4px 0 ${T.ink}, 4px 4px 0 4px ${accent}`
          : `4px 4px 0 ${T.ink}`,
        transform: `translate(${hover && !disabled && !isSelected ? -1 : 0}px, ${hover && !disabled && !isSelected ? -1 : 0}px)`,
        cursor: disabled ? "default" : "pointer",
        opacity: visible ? (isOther ? 0.4 : 1) : 0,
        transition: `all 0.22s ease ${delay}ms`,
        fontFamily: T.bodyFont,
        display: "flex", alignItems: "flex-start", gap: 12,
      }}
    >
      {/* Pixel checkbox */}
      <div style={{
        flexShrink: 0, marginTop: 2,
        width: 18, height: 18,
        background: isSelected ? T.cream : "transparent",
        border: `3px solid ${isSelected ? T.cream : T.ink}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {isSelected && (
          <div style={{ width: 8, height: 8, background: T.magenta }} />
        )}
      </div>
      <span style={{ fontSize: 14, lineHeight: 1.55 }}>{answer.text}</span>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCREEN: RESULT REVEAL + INTEREST PICKER
// ═══════════════════════════════════════════════════════════════════
function ResultScreen({ result, userName, interests, setInterests, onContinue, onRetake }) {
  const [step, setStep] = useState("reveal");
  const first = userName ? userName.split(" ")[0] : "";
  const [v, setV] = useState(false);
  useEffect(() => { setTimeout(() => setV(true), 80); }, []);

  const MAX_INTERESTS = 3;
  function toggle(id) {
    setInterests(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= MAX_INTERESTS) return prev; // blocked at max
      return [...prev, id];
    });
  }
  const atMax = interests.length >= MAX_INTERESTS;

  if (step === "reveal") return (
    <PageCard>
      <div style={{ textAlign: "center", opacity: v ? 1 : 0, transition: "opacity 0.7s ease" }}>
        <div style={{
          fontFamily: T.pixelFont, fontSize: 18, color: T.magentaDim,
          letterSpacing: "0.25em", marginBottom: 4,
        }}>
          ✧ YOUR ARCHETYPE IS ✧
        </div>
        {first && (
          <div style={{
            fontFamily: T.scriptFont, fontSize: 24, color: T.ink,
            marginBottom: 20,
          }}>
            drumroll, {first}...
          </div>
        )}

        {/* Framed archetype reveal */}
        <div style={{ margin: "12px auto 20px", display: "inline-block", transform: v ? "scale(1)" : "scale(0.85)", transition: "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
          <GoldFrame size={140} accent={result.accent}>
            <div style={{ fontSize: 78 }}>{result.emoji}</div>
          </GoldFrame>
        </div>

        <h1 style={{
          fontFamily: T.displayFont,
          fontSize: "clamp(28px, 6vw, 40px)",
          color: T.magenta,
          WebkitTextStroke: `1px ${T.ink}`,
          textShadow: `3px 3px 0 ${T.ink}`,
          letterSpacing: "0.02em",
          margin: "8px 0 6px",
          lineHeight: 1.05,
        }}>
          {result.name}
        </h1>
        <div style={{
          fontFamily: T.pixelFont, fontSize: 16, color: T.inkSoft,
          letterSpacing: "0.2em", marginBottom: 8,
        }}>
          {result.kanji}
        </div>
        <div style={{
          fontFamily: T.scriptFont, fontSize: 28,
          color: result.accent, marginBottom: 20,
        }}>
          {result.tagline}
        </div>

        {/* Divider */}
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center", gap: 8,
          margin: "20px 0",
        }}>
          <div style={{ height: 3, width: 40, background: T.ink }} />
          <div style={{ width: 8, height: 8, background: T.gold, transform: "rotate(45deg)", border: `2px solid ${T.ink}` }} />
          <div style={{ height: 3, width: 40, background: T.ink }} />
        </div>

        <p style={{
          fontFamily: T.bodyFont, fontSize: 14.5, lineHeight: 1.75,
          color: T.inkSoft, maxWidth: 440, margin: "0 auto 24px", textAlign: "left",
        }}>
          {result.description}
        </p>

        {/* Content looks like — pixel list */}
        <div style={{
          background: T.blushSoft,
          border: `3px solid ${T.ink}`,
          boxShadow: `4px 4px 0 ${T.ink}`,
          padding: "16px 18px",
          textAlign: "left",
          marginBottom: 24,
        }}>
          <div style={{
            fontFamily: T.pixelFont, fontSize: 15,
            color: T.magentaDim, letterSpacing: "0.15em", marginBottom: 10,
          }}>
            ✦ YOUR CONTENT NATURALLY LOOKS LIKE
          </div>
          {result.contentLooks.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 8,
              padding: "5px 0",
              fontFamily: T.bodyFont, fontSize: 13.5, color: T.ink, lineHeight: 1.5,
            }}>
              <span style={{ color: T.magenta, marginTop: 2, fontSize: 10 }}>▮</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Hype line */}
        <div style={{
          padding: "14px 18px",
          background: T.ink,
          color: T.blush,
          fontFamily: T.scriptFont, fontSize: 22,
          border: `3px solid ${T.ink}`,
          boxShadow: `4px 4px 0 ${result.accent}`,
          marginBottom: 24,
        }}>
          ✦ {result.hype}
        </div>

        <PixelButton onClick={() => setStep("interests")} fullWidth>
          NEXT: PICK YOUR OBSESSIONS →
        </PixelButton>

        <div style={{ marginTop: 12 }}>
          <button onClick={onRetake} style={{
            background: "none", border: "none",
            fontFamily: T.pixelFont, fontSize: 14,
            color: T.inkSoft, cursor: "pointer",
            textDecoration: "underline",
          }}>retake quiz</button>
        </div>
      </div>
    </PageCard>
  );

  // Interest picker
  return (
    <PageCard>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{
          fontFamily: T.pixelFont, fontSize: 18, color: result.accent,
          letterSpacing: "0.2em", marginBottom: 4,
        }}>
          ✦ {first ? first.toUpperCase() : "OKAY"}, DECORATE YOUR IDENTITY ✦
        </div>
        <h2 style={{
          fontFamily: T.displayFont, fontSize: "clamp(22px, 5vw, 30px)",
          color: T.ink, margin: "8px 0 12px", lineHeight: 1.2,
        }}>
          Pick Your Top 3 Obsessions
        </h2>
        <p style={{
          fontFamily: T.bodyFont, fontSize: 14, color: T.inkSoft,
          maxWidth: 400, margin: "0 auto", lineHeight: 1.6,
        }}>
          Choose up to 3 that feel most like you right now. This shapes your content ideas to match your actual world.
        </p>

        {/* Counter chip */}
        <div style={{
          display: "inline-block", marginTop: 12,
          padding: "5px 14px",
          background: atMax ? T.magenta : T.blushDeep,
          color: atMax ? T.cream : T.inkSoft,
          border: `2px solid ${T.ink}`,
          fontFamily: T.pixelFont, fontSize: 15,
          letterSpacing: "0.15em",
        }}>
          {interests.length} / {MAX_INTERESTS} SELECTED
        </div>
      </div>

      {/* Interest grid — framed pixel objects */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))",
        gap: 10, marginBottom: 28,
      }}>
        {INTERESTS_LIST.map(interest => {
          const active = interests.includes(interest.id);
          const disabled = !active && atMax;
          return (
            <button
              key={interest.id}
              onClick={() => toggle(interest.id)}
              disabled={disabled}
              style={{
                background: active ? T.magenta : T.cream,
                color: active ? T.cream : T.ink,
                border: `3px solid ${T.ink}`,
                boxShadow: active
                  ? `4px 4px 0 ${T.ink}, 4px 4px 0 4px ${T.gold}`
                  : `4px 4px 0 ${T.ink}`,
                padding: "12px 8px",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.35 : 1,
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 4,
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ fontSize: 26 }}>{interest.icon}</div>
              <div style={{
                fontFamily: T.pixelFont, fontSize: 15,
                letterSpacing: "0.1em",
              }}>
                {interest.label.toUpperCase()}
              </div>
            </button>
          );
        })}
      </div>

      <PixelButton onClick={onContinue} disabled={interests.length === 0} fullWidth>
        CONTINUE →
      </PixelButton>
    </PageCard>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCREEN: PART 2 (camera comfort + content style)
// ═══════════════════════════════════════════════════════════════════
function Part2Screen({ question, step, total, result, userName, onAnswer }) {
  const first = userName ? userName.split(" ")[0] : "";
  const [selected, setSelected] = useState(null);
  const [v, setV] = useState(false);
  useEffect(() => { setV(false); setSelected(null); setTimeout(() => setV(true), 60); }, [step]);

  function pick(a) {
    if (selected) return;
    setSelected(a.value);
    setTimeout(() => onAnswer(a), 500);
  }

  return (
    <PageCard>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <BrandChip />
        <div style={{
          marginTop: 14,
          fontFamily: T.pixelFont, fontSize: 17, color: result?.accent || T.magenta,
          letterSpacing: "0.2em",
        }}>
          ROUND 2 · {step + 1} / {total}
        </div>
        {first && (
          <div style={{
            fontFamily: T.scriptFont, fontSize: 22, color: T.inkSoft,
            marginTop: 6,
          }}>
            one more thing, {first}
          </div>
        )}
      </div>

      {/* Progress */}
      <div style={{
        height: 12,
        background: T.blushDeep,
        border: `3px solid ${T.ink}`,
        boxShadow: `3px 3px 0 ${T.ink}`,
        marginBottom: 24, overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: `${((step + 1) / total) * 100}%`,
          background: T.magenta,
          transition: "width 0.4s ease",
        }} />
      </div>

      <h2 style={{
        fontFamily: T.displayFont, fontSize: "clamp(18px, 4vw, 22px)",
        color: T.ink, lineHeight: 1.3, margin: "0 0 20px",
        opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.4s ease",
      }}>
        {question.q}
      </h2>

      <div style={{ display: "grid", gap: 12 }}>
        {question.answers.map((a, i) => {
          const isSelected = selected === a.value;
          const isOther = selected && !isSelected;
          return (
            <AnswerCard
              key={i} answer={a} isSelected={isSelected} isOther={isOther}
              disabled={!!selected} accent={result?.accent || T.magenta}
              onClick={() => pick(a)}
              delay={i * 60} visible={v}
            />
          );
        })}
      </div>
    </PageCard>
  );
}

// (EmailScreen removed — newsletter signup handled via external Beehiiv link)

// ═══════════════════════════════════════════════════════════════════
// SCREEN: CONTENT IDEAS GENERATOR
// ═══════════════════════════════════════════════════════════════════
function GeneratorScreen({ result, userName, interests, comfort, ideas, onRequestReset }) {
  const first = userName ? userName.split(" ")[0] : "";
  const [revealed, setRevealed] = useState([]);
  useEffect(() => {
    ideas.forEach((_, i) => setTimeout(() => setRevealed(r => [...r, i]), i * 90));
  }, []);

  const comfortLabel = {
    faceless: "FULLY FACELESS", voiceover: "VOICE ONLY",
    occasional: "OCCASIONALLY ON-CAMERA", full: "FULLY ON-CAMERA",
  }[comfort] || "";

  return (
    <PageCard maxWidth={680}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ display: "inline-block", marginBottom: 12 }}>
          <GoldFrame size={60} accent={result.accent}>
            <div style={{ fontSize: 36 }}>{result.emoji}</div>
          </GoldFrame>
        </div>
        <div style={{
          fontFamily: T.pixelFont, fontSize: 17, color: result.accent,
          letterSpacing: "0.2em", marginBottom: 4,
        }}>
          ✦ THE COLLECTION ✦
        </div>
        <h2 style={{
          fontFamily: T.displayFont, fontSize: "clamp(24px, 5vw, 32px)",
          color: T.magenta,
          WebkitTextStroke: `1px ${T.ink}`,
          textShadow: `3px 3px 0 ${T.ink}`,
          margin: "6px 0 10px", lineHeight: 1.1,
        }}>
          {first ? `${first.toUpperCase()}'S IDEA BANK` : "YOUR IDEA BANK"}
        </h2>
        <div style={{
          fontFamily: T.pixelFont, fontSize: 15, color: T.inkSoft,
          letterSpacing: "0.12em",
        }}>
          {result.name} · {ideas.length} IDEAS
          {comfortLabel && <> · {comfortLabel}</>}
        </div>
      </div>

      {/* Idea cards */}
      <div style={{ display: "grid", gap: 16 }}>
        {ideas.map((idea, i) => (
          <IdeaCard key={i} idea={idea} num={i + 1} accent={result.accent} visible={revealed.includes(i)} />
        ))}
      </div>

      {/* Two CTA buttons */}
      <div style={{
        marginTop: 40,
        padding: "26px 22px",
        background: T.ink,
        border: `3px solid ${T.ink}`,
        boxShadow: `6px 6px 0 ${result.accent}`,
        textAlign: "center",
      }}>
        <div style={{
          fontFamily: T.pixelFont, fontSize: 16,
          color: result.accent, letterSpacing: "0.2em", marginBottom: 8,
        }}>
          ✦ WANT MORE? ✦
        </div>
        <div style={{
          fontFamily: T.scriptFont, fontSize: 26,
          color: T.cream, marginBottom: 14,
        }}>
          You're just getting started.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 360, margin: "0 auto" }}>
          {/* Newsletter button */}
          <a href={BEEHIIV_SUBSCRIBE_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <PixelButton fullWidth>
              JOIN THE OHGC NEWSLETTER →
            </PixelButton>
          </a>

          {/* Shop button */}
          <a href={IDEA_BANK_SHOP_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <PixelButton primary={false} fullWidth>
              SHOP THE FULL IDEA BANKS →
            </PixelButton>
          </a>
        </div>

        <div style={{
          fontFamily: T.bodyFont, fontSize: 12, color: T.blushDeep,
          marginTop: 14, lineHeight: 1.6,
        }}>
          Content tips, wellness, early access to the community,<br />
          and first to know when new resources drop.
        </div>
      </div>

      {/* Screenshot reminder */}
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <div style={{
          fontFamily: T.pixelFont, fontSize: 13,
          color: T.inkSoft, letterSpacing: "0.15em",
          padding: "10px 16px", display: "inline-block",
          maxWidth: 380, lineHeight: 1.6,
        }}>
          ✧ SCREENSHOT THESE — THEY'RE YOURS TO KEEP ✧
        </div>
      </div>

      {/* Deliberate reset — small, tucked, requires confirmation */}
      <div style={{ textAlign: "center", marginTop: 24, opacity: 0.5 }}>
        <button onClick={onRequestReset} style={{
          background: "none", border: "none",
          fontFamily: T.pixelFont, fontSize: 12,
          color: T.inkSoft, cursor: "pointer",
          textDecoration: "underline",
          letterSpacing: "0.1em",
        }}>
          clear my saved result
        </button>
      </div>
    </PageCard>
  );
}

// ═══════════════════════════════════════════════════════════════════
// RESET CONFIRMATION MODAL
// ═══════════════════════════════════════════════════════════════════
function ResetConfirmModal({ onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(26, 10, 20, 0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div style={{
        maxWidth: 400, width: "100%",
        background: T.cream,
        border: `4px solid ${T.ink}`,
        boxShadow: `8px 8px 0 ${T.magenta}`,
        padding: "28px 24px",
        textAlign: "center",
        position: "relative",
      }}>
        <CornerOrnament pos="tl" />
        <CornerOrnament pos="tr" />
        <CornerOrnament pos="bl" />
        <CornerOrnament pos="br" />

        <div style={{
          fontFamily: T.pixelFont, fontSize: 17,
          color: T.magentaDim, letterSpacing: "0.2em", marginBottom: 12,
        }}>
          ✧ ARE YOU SURE? ✧
        </div>

        <h3 style={{
          fontFamily: T.displayFont, fontSize: 22,
          color: T.ink, lineHeight: 1.2, margin: "0 0 14px",
        }}>
          Clear your saved result?
        </h3>

        <p style={{
          fontFamily: T.bodyFont, fontSize: 14, lineHeight: 1.6,
          color: T.inkSoft, margin: "0 0 24px",
        }}>
          This will delete your archetype, interests, and your 4 personalized ideas from this browser. You'll have to take the quiz again.
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <PixelButton onClick={onCancel} primary={false} small>
            NEVER MIND
          </PixelButton>
          <PixelButton onClick={onConfirm} primary small>
            YES, CLEAR IT
          </PixelButton>
        </div>
      </div>
    </div>
  );
}

function IdeaCard({ idea, num, accent, visible }) {
  return (
    <div style={{
      position: "relative",
      background: T.cream,
      border: `3px solid ${T.ink}`,
      boxShadow: `4px 4px 0 ${T.ink}, 4px 4px 0 4px ${accent}`,
      padding: "16px 18px",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(10px)",
      transition: "opacity 0.4s ease, transform 0.4s ease",
    }}>
      {/* Number badge */}
      <div style={{
        position: "absolute", top: -14, left: 12,
        background: T.magenta,
        color: T.cream,
        fontFamily: T.pixelFont, fontSize: 16,
        padding: "3px 10px",
        border: `2px solid ${T.ink}`,
        letterSpacing: "0.1em",
      }}>
        NO. {String(num).padStart(2, "0")}
      </div>

      <h3 style={{
        fontFamily: T.displayFont, fontSize: 17,
        color: T.ink, lineHeight: 1.25,
        margin: "6px 0 12px",
      }}>
        {idea.title}
      </h3>

      <div style={{ marginBottom: 12 }}>
        <div style={{
          fontFamily: T.pixelFont, fontSize: 13,
          color: accent, letterSpacing: "0.15em", marginBottom: 3,
        }}>
          ▶ THE SHOT
        </div>
        <p style={{
          fontFamily: T.bodyFont, fontSize: 13.5, lineHeight: 1.6,
          color: T.inkSoft, margin: 0,
        }}>
          {idea.shot}
        </p>
      </div>

      <div style={{
        background: T.blushSoft,
        border: `2px solid ${T.ink}`,
        padding: "10px 12px",
      }}>
        <div style={{
          fontFamily: T.pixelFont, fontSize: 13,
          color: T.magentaDim, letterSpacing: "0.15em", marginBottom: 3,
        }}>
          ♡ THE HOOK
        </div>
        <p style={{
          fontFamily: T.bodyFont, fontSize: 13, fontStyle: "italic",
          color: T.ink, margin: 0, lineHeight: 1.5,
        }}>
          "{idea.hook}"
        </p>
      </div>
    </div>
  );
}
