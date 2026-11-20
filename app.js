(function loadAppFonts() {
  const host =
    ["fonts", "googleapis", "com"].join(".");
  const link =
    document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    `https://${host}/css2?family=Anton` +
    `&family=Rajdhani:wght@600;700&display=swap`;
  document.head.appendChild(link);
})();

(function injectEffectsAndModal() {
  const style =
    document.createElement("style");
  style.textContent = `
    @keyframes kiShake {
      0%, 100% {
        transform: translate(0, 0) rotate(0deg);
      }
      20% {
        transform: translate(-6px, 4px)
          rotate(-1deg);
      }
      40% {
        transform: translate(6px, -4px)
          rotate(1deg);
      }
      60% {
        transform: translate(-4px, -2px)
          rotate(-0.5deg);
      }
      80% {
        transform: translate(4px, 3px)
          rotate(0.5deg);
      }
    }
    @keyframes auraPulse {
      0%, 100% {
        filter: drop-shadow(
          0 0 10px var(--aura-color, #ff9900)
        );
      }
      50% {
        filter: drop-shadow(
          0 0 26px var(--aura-color, #ff9900)
        );
      }
    }
    .shake-active {
      animation: kiShake 0.45s ease-in-out;
    }
    .aura-active {
      animation: auraPulse 1.8s infinite
        ease-in-out;
    }
        .comic-stage {
      background: #101015;
      border: 2px solid #ff9900;
      border-radius: 12px; padding: 12px;
      position: relative; overflow: hidden;
      background-image: radial-gradient(
        #262632 1px, transparent 1px
      );
      background-size: 10px 10px;
    }
    .comic-badge {
      position: absolute; top: 8px; left: 8px;
      background: #ff9900; color: #0b0b0d;
      font-family: 'Anton', sans-serif;
      font-size: 0.78rem; padding: 2px 8px;
      border-radius: 5px; letter-spacing: 0.6px;
    }
    .timer-box {
      font-family: 'Anton', sans-serif;
      font-size: 2.2rem; color: #ffb703;
      letter-spacing: 2px; margin: 4px 0;
    }
    .timer-btn {
      background: #1c1c24;
      border: 1.5px solid #ff9900;
      color: #ff9900;
      font-family: 'Anton', sans-serif;
      font-size: 1rem; padding: 6px 14px;
      border-radius: 8px; cursor: pointer;
      letter-spacing: 0.8px;
    }
  `;
  document.head.appendChild(style);

  const modal = document.createElement("div");
  modal.id = "exercise-modal";
  modal.className = "levelup-overlay hidden";
  modal.innerHTML = `
    <div class="levelup-card"
      style="max-width: 360px;">
      <span id="ex-modal-tag"
        class="orange-tag">
        COMIC-ANLEITUNG
      </span>
      <h2 id="ex-modal-title"
        class="tall-orange-title small">
        ÜBUNG
      </h2>
      <div class="comic-stage">
        <span class="comic-badge">
          TECHNIK-GUIDE
        </span>
        <img id="ex-comic-img"
          style="width:100%;height:140px;
          object-fit:contain;display:none;"
          alt="" />
        <div id="ex-comic-svg"
          style="height:140px;display:grid;
          place-items:center;"></div>
      </div>
      <p id="ex-modal-tip"
        class="poster-copy center"
        style="color:#fff;"></p>
      <div id="ex-timer-area" class="hidden">
        <div id="ex-timer-display"
          class="timer-box">00:20</div>
        <button id="ex-timer-start"
          class="timer-btn">
          TIMER STARTEN
        </button>
      </div>
      <button id="ex-complete-btn"
        class="tall-orange-btn">
        GESCHAFFT (+25 XP)
      </button>
      <button id="ex-close-btn"
        class="reset-link">Abbrechen</button>
    </div>
  `;
  document.body.appendChild(modal);
})();
const CHARACTERS = [
  {
    id: 1, name: "SON-BLITZ",
    attack: "SONNEN-KAMEHA",
    focus: "GANZKÖRPER",
    bio: "Furchtloser Saiyajin-Krieger.",
    color: "#ffb703"
  },
  {
    id: 2, name: "PRINZ-KI",
    attack: "FINALER BLITZ",
    focus: "ARME & BRUST",
    bio: "Meister der schweren Schwerkraft.",
    color: "#5ce1e6"
  },
  {
    id: 3, name: "CYBER-RED",
    attack: "FLAMMEN-HIEB",
    focus: "REAKTION & KERN",
    bio: "High-Tech-Rüstung und Reflexe.",
    color: "#ff5c77"
  },
  {
    id: 4, name: "SHADOW-X",
    attack: "PHANTOM-SALVE",
    focus: "BAUCH & BALANCE",
    bio: "Bewegt sich lautlos wie der Wind.",
    color: "#c77dff"
  },
  {
    id: 5, name: "NOVA-GOLD",
    attack: "SUPERNOVA",
    focus: "GANZKÖRPER",
    bio: "Seine goldene Energie erhellt alles.",
    color: "#ffe66d"
  },
  {
    id: 6, name: "TITAN-FORCE",
    attack: "TITANEN-WALL",
    focus: "ARME & CORE",
    bio: "Verteidiger mit starkem Ki-Schild.",
    color: "#48cae4"
  },
  {
    id: 7, name: "BLITZ-KID",
    attack: "DONNER-SPRINT",
    focus: "BEINE & SPEED",
    bio: "Extrem wendig und voller Schnellkraft.",
    color: "#ff9e5e"
  },
  {
    id: 8, name: "FROST-ZEN",
    attack: "GLETSCHER-STRAHL",
    focus: "KI-KERN",
    bio: "Bleibt unter höchstem Druck eiskalt.",
    color: "#72efdd"
  },
  {
    id: 9, name: "FLAME-REX",
    attack: "MAGMA-FAUST",
    focus: "BRUST & SCHULTERN",
    bio: "Seine Aura steigt mit jedem Training.",
    color: "#ff6b6b"
  },
  {
    id: 10, name: "ULTRA-VEX",
    attack: "KOMETEN-REGEN",
    focus: "GANZKÖRPER",
    bio: "Nutzt kosmische Sprungkraft.",
    color: "#b8c0ff"
  },
  {
    id: 11, name: "SOLAR-KAI",
    attack: "HELIOS-WELLE",
    focus: "AUSDAUER",
    bio: "Zieht Kraft aus dem Sonnenlicht.",
    color: "#ffd166"
  },
  {
    id: 12, name: "DARK-ORION",
    attack: "ECLIPSE-SCHLAG",
    focus: "ARME & RÜCKEN",
    bio: "Einzelgänger mit gewaltiger Kraft.",
    color: "#80ffdb"
  },
  {
    id: 13, name: "AERO-DASH",
    attack: "WIRBELSTURM",
    focus: "BEINE & AGILITÄT",
    bio: "Beherrscht den Himmel blitzschnell.",
    color: "#64dfdf"
  },
  {
    id: 14, name: "OMEGA-GOD",
    attack: "OMEGA-URKNALL",
    focus: "ALLE BEREICHE",
    bio: "Meister-Krieger aller Techniken.",
    color: "#ff758f"
  },
  {
    id: 15, name: "STURM-GREEN",
    attack: "OMEGA-STURM",
    focus: "BEINE & KRAFT",
    bio: "Entfesselt smaragdgrüne Energie.",
    color: "#52e588"
  }
];
const STAGE_RULES = [
  { stage: 1, minLevel: 1 },
  { stage: 2, minLevel: 2 },
  { stage: 3, minLevel: 4 },
  { stage: 4, minLevel: 6 },
  { stage: 5, minLevel: 8 }
];

const BODY_WORKOUTS = {
  arms: {
    label: "TRAINING: ARME & BRUST",
    easy: [
      {
        title: "10x Knie-Liegestütze",
        sub: "Einfach · Basis",
        xp: 25, power: 400,
        pose: "kneepushup",
        tip: "Knie auf den Boden, Rücken gerade."
      },
      {
        title: "20 Sek. Schattenboxen",
        sub: "Einfach · Ki-Fäuste",
        xp: 20, power: 350,
        pose: "punch", sec: 20,
        tip: "Schnelle gerade Schläge nach vorn!"
      }
    ],
    advanced: [
      {
        title: "12x Echte Liegestütze",
        sub: "Profi · Kamehameha",
        xp: 45, power: 900,
        pose: "pushup",
        tip: "Körper wie ein Brett spannen."
      },
      {
        title: "10x Dips am Stuhl",
        sub: "Profi · Trizeps",
        xp: 45, power: 950,
        pose: "dips",
        tip: "Po dicht am Stuhl absenken."
      }
    ],
    master: [
      {
        title: "22x Tiefe Liegestütze",
        sub: "Meister · 100x G",
        xp: 80, power: 2000,
        pose: "pushup",
        tip: "Kurz vor dem Boden abstoppen."
      },
      {
        title: "10x Diamant-Liegestütze",
        sub: "Meister · Final-Ki",
        xp: 90, power: 2400,
        pose: "pushup",
        tip: "Hände bilden ein Dreieck."
      }
    ]
  },
  core: {
    label: "TRAINING: BAUCH & KI-KERN",
    easy: [
      {
        title: "20 Sek. Plank",
        sub: "Einfach · Ki-Schild",
        xp: 25, power: 450,
        pose: "plank", sec: 20,
        tip: "Bauch und Po fest anspannen!"
      },
      {
        title: "10x Crunches",
        sub: "Einfach · Körpermitte",
        xp: 25, power: 400,
        pose: "situp",
        tip: "Schultern kontrolliert einrollen."
      }
    ],
    advanced: [
      {
        title: "40 Sek. Plank",
        sub: "Profi · Goldene Aura",
        xp: 45, power: 950,
        pose: "plank", sec: 40,
        tip: "Ruhig weiteratmen und halten."
      },
      {
        title: "18x Sit-Ups",
        sub: "Profi · Saiyajin-Rumpf",
        xp: 45, power: 900,
        pose: "situp",
        tip: "Nicht am Nacken ziehen."
      }
    ],
    master: [
      {
        title: "70 Sek. Plank",
        sub: "Meister · Abwehr",
        xp: 85, power: 2200,
        pose: "plank", sec: 70,
        tip: "Unzerstörbarer Ki-Schild!"
      },
      {
        title: "25x Beinheben",
        sub: "Meister · Göttlicher Kern",
        xp: 80, power: 2100,
        pose: "legraise",
        tip: "Beine gestreckt langsam heben."
      }
    ]
  },
  legs: {
    label: "TRAINING: BEINE & SPRUNGKRAFT",
    easy: [
      {
        title: "15x Kniebeugen",
        sub: "Einfach · Fester Stand",
        xp: 25, power: 450,
        pose: "squat",
        tip: "Po weit nach hinten schieben."
      },
      {
        title: "25 Sek. Hampelmänner",
        sub: "Einfach · Speed",
        xp: 20, power: 350,
        pose: "jump", sec: 25,
        tip: "Leichtfüßig auf den Fußballen."
      }
    ],
    advanced: [
      {
        title: "25x Kniebeugen",
        sub: "Profi · 10x Schwerkraft",
        xp: 45, power: 950,
        pose: "squat",
        tip: "Über die Fersen hochdrücken."
      },
      {
        title: "14x Ausfallschritte",
        sub: "Profi · Ausweichen",
        xp: 45, power: 900,
        pose: "lunge",
        tip: "Großer Schritt nach vorn."
      }
    ],
    master: [
      {
        title: "15x Sprung-Kniebeugen",
        sub: "Meister · Raketen-Start",
        xp: 85, power: 2300,
        pose: "jump",
        tip: "Explosiv abspringen!"
      },
      {
        title: "45 Sek. Wandsitzen",
        sub: "Meister · 100x G",
        xp: 80, power: 2100,
        pose: "wallsit", sec: 45,
        tip: "Knie im 90-Grad-Winkel halten."
      }
    ]
  }
};
const CHARACTER_WORKOUTS = {
  1: {
    arms: {
      easy: [
        {
          title: "10x Knie-Liegestütze",
          sub: "Einfach · Kamehameha-Basis",
          xp: 25, power: 400,
          pose: "kneepushup",
          tip: "Rücken gerade, Brust tief."
        },
        {
          title: "20 Sek. Ki-Schattenboxen",
          sub: "Einfach · Schnelle Fäuste",
          xp: 20, power: 350,
          pose: "punch", sec: 20,
          tip: "Schnelle Kombos nach vorn!"
        }
      ],
      advanced: [
        {
          title: "15x Echte Liegestütze",
          sub: "Profi · Kaioken x2",
          xp: 45, power: 900,
          pose: "pushup",
          tip: "Volle Körperspannung halten."
        },
        {
          title: "12x Stuhl-Dips",
          sub: "Profi · Arm-Power",
          xp: 45, power: 950,
          pose: "dips",
          tip: "Trizeps voll durchstrecken."
        }
      ],
      master: [
        {
          title: "25x Tiefe Liegestütze",
          sub: "Meister · Kaioken x10",
          xp: 80, power: 2000,
          pose: "pushup",
          tip: "Maximale Tiefe!"
        },
        {
          title: "12x Diamant-Liegestütze",
          sub: "Meister · Super-Kameha",
          xp: 90, power: 2400,
          pose: "pushup",
          tip: "Hände eng unter der Brust."
        }
      ]
    },
    core: {
      easy: [
        {
          title: "20 Sek. Ki-Plank",
          sub: "Einfach · Stabile Aura",
          xp: 25, power: 450,
          pose: "plank", sec: 20,
          tip: "Körper gerade wie ein Pfeil."
        },
        {
          title: "12x Crunches",
          sub: "Einfach · Körpermitte",
          xp: 25, power: 400,
          pose: "situp",
          tip: "Oben kurz halten."
        }
      ],
      advanced: [
        {
          title: "45 Sek. Plank",
          sub: "Profi · Schwerkraft-Kern",
          xp: 45, power: 950,
          pose: "plank", sec: 45,
          tip: "Stabil bleiben und atmen."
        },
        {
          title: "20x Sit-Ups",
          sub: "Profi · Saiyajin-Rumpf",
          xp: 45, power: 900,
          pose: "situp",
          tip: "Langsam abrollen."
        }
      ],
      master: [
        {
          title: "75 Sek. Plank",
          sub: "Meister · Ultra-Abwehr",
          xp: 85, power: 2200,
          pose: "plank", sec: 75,
          tip: "Volle Konzentration!"
        },
        {
          title: "25x Beinheben",
          sub: "Meister · Volle Kontrolle",
          xp: 80, power: 2100,
          pose: "legraise",
          tip: "Kontrolliert absenken."
        }
      ]
    },
    legs: {
      easy: [
        {
          title: "15x Kniebeugen",
          sub: "Einfach · Fester Stand",
          xp: 25, power: 450,
          pose: "squat",
          tip: "Sauber in die Hocke gehen."
        },
        {
          title: "25 Sek. Hampelmänner",
          sub: "Einfach · Aufwärmen",
          xp: 20, power: 350,
          pose: "jump", sec: 25,
          tip: "Schneller Rhythmus!"
        }
      ],
      advanced: [
        {
          title: "25x Kniebeugen",
          sub: "Profi · 10x Schwerkraft",
          xp: 45, power: 950,
          pose: "squat",
          tip: "Tief runter und hochdrücken."
        },
        {
          title: "16x Ausfallschritte",
          sub: "Profi · Blitz-Ausweichen",
          xp: 45, power: 900,
          pose: "lunge",
          tip: "Weite Schritte im Wechsel."
        }
      ],
      master: [
        {
          title: "18x Sprung-Kniebeugen",
          sub: "Meister · Wolken-Sprung",
          xp: 85, power: 2300,
          pose: "jump",
          tip: "Explosiv abspringen!"
        },
        {
          title: "50 Sek. Wandsitzen",
          sub: "Meister · 100x G",
          xp: 80, power: 2100,
          pose: "wallsit", sec: 50,
          tip: "90-Grad-Winkel halten."
        }
      ]
    }
  },
    2: {
    arms: {
      easy: [
        {
          title: "12x Wand-Liegestütze",
          sub: "Einfach · Prinzen-Stolz",
          xp: 25, power: 400,
          pose: "wallpushup",
          tip: "Hände an die Wand stützen."
        },
        {
          title: "25 Sek. Armkreisen",
          sub: "Einfach · Schulter-Ki",
          xp: 20, power: 350,
          pose: "armcircles", sec: 25,
          tip: "Arme gestreckt kreisen."
        }
      ],
      advanced: [
        {
          title: "15x Breite Liegestütze",
          sub: "Profi · Galick-Strahl",
          xp: 45, power: 950,
          pose: "pushup",
          tip: "Hände weiter als schulterbreit."
        },
        {
          title: "12x Schulter-Drücken (Pike)",
          sub: "Profi · 300x G",
          xp: 50, power: 1000,
          pose: "pushup",
          tip: "Hüfte hoch wie ein V."
        }
      ],
      master: [
        {
          title: "20x Explosiv-Liegestütze",
          sub: "Meister · Finaler Blitz",
          xp: 85, power: 2200,
          pose: "pushup",
          tip: "Schnell hochdrücken!"
        },
        {
          title: "15x Diamant-Liegestütze",
          sub: "Meister · Royal Blue",
          xp: 90, power: 2500,
          pose: "pushup",
          tip: "Hände eng zusammen."
        }
      ]
    },
    core: {
      easy: [
        {
          title: "25 Sek. Unterarm-Plank",
          sub: "Einfach · Eiserner Wille",
          xp: 25, power: 450,
          pose: "plank", sec: 25,
          tip: "Körper eisern gerade halten."
        },
        {
          title: "12x Käfer-Crunches",
          sub: "Einfach · Balance",
          xp: 25, power: 400,
          pose: "situp",
          tip: "Ellbogen und Knie zusammen."
        }
      ],
      advanced: [
        {
          title: "45 Sek. Seitlicher Plank",
          sub: "Profi · Ki-Rüstung",
          xp: 45, power: 950,
          pose: "plank", sec: 45,
          tip: "Hüfte hochdrücken."
        },
        {
          title: "20x Russian Twists",
          sub: "Profi · Dreh-Impuls",
          xp: 45, power: 900,
          pose: "situp",
          tip: "Von Seite zu Seite drehen."
        }
      ],
      master: [
        {
          title: "60 Sek. Kommando-Plank",
          sub: "Meister · 400x G Raum",
          xp: 85, power: 2300,
          pose: "plank", sec: 60,
          tip: "Stütz im Wechsel ändern."
        },
        {
          title: "20x V-Ups (Klappmesser)",
          sub: "Meister · Stolz des Prinzen",
          xp: 90, power: 2400,
          pose: "legraise",
          tip: "Arme und Beine hoch."
        }
      ]
    },
    legs: {
      easy: [
        {
          title: "15x Sumo-Kniebeugen",
          sub: "Einfach · Tiefer Stand",
          xp: 25, power: 450,
          pose: "squat",
          tip: "Breiter Stand, tief beugen."
        },
        {
          title: "20x Wadenheben",
          sub: "Einfach · Sprungansatz",
          xp: 20, power: 350,
          pose: "jump",
          tip: "Auf die Zehenspitzen."
        }
      ],
      advanced: [
        {
          title: "20x Ausfallschritte rückwärts",
          sub: "Profi · Konter-Schritt",
          xp: 45, power: 950,
          pose: "lunge",
          tip: "Kontrolliert nach hinten."
        },
        {
          title: "35 Sek. Wandsitzen",
          sub: "Profi · Schwerkraft",
          xp: 45, power: 900,
          pose: "wallsit", sec: 35,
          tip: "Oberschenkel parallel."
        }
      ],
      master: [
        {
          title: "12x Bulgarische Kniebeugen",
          sub: "Meister · Einzelbein-Kraft",
          xp: 85, power: 2300,
          pose: "lunge",
          tip: "Hinteren Fuß auf Stuhl."
        },
        {
          title: "20x Ausfallschritt-Sprünge",
          sub: "Meister · Überschall",
          xp: 90, power: 2400,
          pose: "jump",
          tip: "Beine in der Luft wechseln!"
        }
      ]
    }
  },
    3: {
    arms: {
      easy: [
        {
          title: "25 Sek. Speed-Punches",
          sub: "Einfach · Turbo-Fäuste",
          xp: 25, power: 400,
          pose: "punch", sec: 25,
          tip: "Maximale Schlagfrequenz!"
        },
        {
          title: "10x Schulter-Tippen im Plank",
          sub: "Einfach · Reflexe",
          xp: 25, power: 450,
          pose: "shouldertap",
          tip: "Schulter antippen im Stütz."
        }
      ],
      advanced: [
        {
          title: "14x Enge Liegestütze",
          sub: "Profi · Plasma-Stoß",
          xp: 45, power: 950,
          pose: "pushup",
          tip: "Ellbogen eng am Körper."
        },
        {
          title: "30 Sek. Oberkörper-Boxen",
          sub: "Profi · Overdrive",
          xp: 45, power: 900,
          pose: "punch", sec: 30,
          tip: "Volles Tempo!"
        }
      ],
      master: [
        {
          title: "20x Wechsel-Liegestütze",
          sub: "Meister · Flammen-Hieb",
          xp: 85, power: 2200,
          pose: "pushup",
          tip: "Hand versetzen."
        },
        {
          title: "40 Sek. Bergsteiger (Speed)",
          sub: "Meister · System-Maximum",
          xp: 90, power: 2400,
          pose: "climber", sec: 40,
          tip: "Knie im Sprint vorziehen."
        }
      ]
    },
    core: {
      easy: [
        {
          title: "15x Mountain Climbers",
          sub: "Einfach · Antrieb",
          xp: 25, power: 450,
          pose: "climber",
          tip: "Knie zügig vorziehen."
        },
        {
          title: "20 Sek. Hollow Hold",
          sub: "Einfach · Panzer-Kern",
          xp: 25, power: 400,
          pose: "legraise", sec: 20,
          tip: "Unteren Rücken auf Boden."
        }
      ],
      advanced: [
        {
          title: "30x Fahrrad-Crunches",
          sub: "Profi · Cyber-Rotation",
          xp: 45, power: 950,
          pose: "situp",
          tip: "Ellbogen zu Knie."
        },
        {
          title: "45 Sek. Plank mit Kniezug",
          sub: "Profi · Reaktor-Stabilität",
          xp: 50, power: 1000,
          pose: "climber", sec: 45,
          tip: "Knie seitlich vorziehen."
        }
      ],
      master: [
        {
          title: "50x Fahrrad-Crunches",
          sub: "Meister · Hyper-Kern",
          xp: 85, power: 2300,
          pose: "situp",
          tip: "Sauber durchziehen!"
        },
        {
          title: "60 Sek. Hollow Body Hold",
          sub: "Meister · Titan-Schild",
          xp: 90, power: 2400,
          pose: "legraise", sec: 60,
          tip: "Volle Rumpfspannung!"
        }
      ]
    },
    legs: {
      easy: [
        {
          title: "25 Sek. Kniehebelauf",
          sub: "Einfach · Sprint-Modul",
          xp: 25, power: 450,
          pose: "jump", sec: 25,
          tip: "Knie auf Hüfthöhe ziehen."
        },
        {
          title: "15x Skater-Sprünge",
          sub: "Einfach · Ausweich-Sensor",
          xp: 25, power: 400,
          pose: "lunge",
          tip: "Seitlich springen."
        }
      ],
      advanced: [
        {
          title: "40 Sek. High Knees",
          sub: "Profi · Nachbrenner",
          xp: 45, power: 950,
          pose: "jump", sec: 40,
          tip: "Höchstgeschwindigkeit!"
        },
        {
          title: "18x Seitliche Ausfallschritte",
          sub: "Profi · Ausweich-Manöver",
          xp: 45, power: 900,
          pose: "lunge",
          tip: "Weit zur Seite steigen."
        }
      ],
      master: [
        {
          title: "15x Burpees",
          sub: "Meister · Vollgas-Modus",
          xp: 90, power: 2500,
          pose: "jump",
          tip: "Liegestütz + Strecksprung!"
        },
        {
          title: "20x Skater-Sprünge weit",
          sub: "Meister · Lichtgeschwindigkeit",
          xp: 85, power: 2200,
          pose: "lunge",
          tip: "Maximale Sprungweite."
        }
      ]
    }
  }
    ,
  4: {
    arms: {
      easy: [
        {
          title: "12x Schatten-Liegestütze",
          sub: "Einfach · Lautlos",
          xp: 25, power: 400,
          pose: "kneepushup",
          tip: "Langsam und leise absenken."
        },
        {
          title: "25 Sek. Phantom-Schläge",
          sub: "Einfach · Wind-Speed",
          xp: 20, power: 350,
          pose: "punch", sec: 25,
          tip: "Blitzschnell vor und zurück!"
        }
      ],
      advanced: [
        {
          title: "14x Enge Liegestütze",
          sub: "Profi · Schatten-Stoß",
          xp: 45, power: 900,
          pose: "pushup",
          tip: "Ellbogen eng am Körper."
        },
        {
          title: "12x Schulter-Tippen",
          sub: "Profi · Balance-Stütz",
          xp: 45, power: 950,
          pose: "shouldertap",
          tip: "Hüfte ruhig halten!"
        }
      ],
      master: [
        {
          title: "22x Tiefe Liegestütze",
          sub: "Meister · Phantom-Salve",
          xp: 85, power: 2200,
          pose: "pushup",
          tip: "Volle Tiefe und Spannung."
        },
        {
          title: "15x Stuhl-Dips",
          sub: "Meister · Schatten-Kraft",
          xp: 85, power: 2100,
          pose: "dips",
          tip: "Sauber hochdrücken."
        }
      ]
    },
    core: {
      easy: [
        {
          title: "25 Sek. Balance-Plank",
          sub: "Einfach · Wind-Stille",
          xp: 25, power: 450,
          pose: "plank", sec: 25,
          tip: "Körper ruhig wie ein Schatten."
        },
        {
          title: "15x Langsame Crunches",
          sub: "Einfach · Rumpf-Fokus",
          xp: 25, power: 400,
          pose: "situp",
          tip: "3 Sekunden hoch, 3 runter."
        }
      ],
      advanced: [
        {
          title: "45 Sek. Plank",
          sub: "Profi · Phantom-Kern",
          xp: 45, power: 950,
          pose: "plank", sec: 45,
          tip: "Bauch fest anspannen."
        },
        {
          title: "20x Beinheben",
          sub: "Profi · Schwebekraft",
          xp: 50, power: 1000,
          pose: "legraise",
          tip: "Beine gestreckt halten."
        }
      ],
      master: [
        {
          title: "70 Sek. Schwebender Plank",
          sub: "Meister · Unsichtbar",
          xp: 90, power: 2400,
          pose: "plank", sec: 70,
          tip: "Keine Bewegung zulassen!"
        },
        {
          title: "30x Sit-Ups",
          sub: "Meister · Schatten-Meister",
          xp: 85, power: 2200,
          pose: "situp",
          tip: "Gleichmäßiges Tempo."
        }
      ]
    },
    legs: {
      easy: [
        {
          title: "15x Leise Kniebeugen",
          sub: "Einfach · Katzensprung",
          xp: 25, power: 450,
          pose: "squat",
          tip: "Kontrolliert tief gehen."
        },
        {
          title: "12x Ausfallschritte",
          sub: "Einfach · Gleitschritt",
          xp: 25, power: 400,
          pose: "lunge",
          tip: "Oberkörper aufrecht lassen."
        }
      ],
      advanced: [
        {
          title: "40 Sek. Wandsitzen",
          sub: "Profi · Lautlose Wand",
          xp: 45, power: 950,
          pose: "wallsit", sec: 40,
          tip: "90-Grad-Winkel halten."
        },
        {
          title: "20x Ausfallschritte",
          sub: "Profi · Wind-Schritt",
          xp: 45, power: 900,
          pose: "lunge",
          tip: "Große Schritte im Wechsel."
        }
      ],
      master: [
        {
          title: "20x Sprung-Kniebeugen",
          sub: "Meister · Phantom-Sprung",
          xp: 90, power: 2400,
          pose: "jump",
          tip: "Federleicht landen!"
        },
        {
          title: "60 Sek. Wandsitzen",
          sub: "Meister · Eiserne Beine",
          xp: 85, power: 2200,
          pose: "wallsit", sec: 60,
          tip: "Durchhalten bis zum Ende!"
        }
      ]
    }
  }
  ,
  5: {
    arms: {
      easy: [
        {
          title: "25 Sek. Sonnen-Kreisen",
          sub: "Einfach · Gold-Aura",
          xp: 20, power: 350,
          pose: "armcircles", sec: 25,
          tip: "Große, leuchtende Kreise!"
        },
        {
          title: "12x Wand-Liegestütze",
          sub: "Einfach · Licht-Stoß",
          xp: 25, power: 400,
          pose: "wallpushup",
          tip: "Kraftvoll von der Wand weg."
        }
      ],
      advanced: [
        {
          title: "16x Echte Liegestütze",
          sub: "Profi · Nova-Strahl",
          xp: 45, power: 950,
          pose: "pushup",
          tip: "Brust tief zum Boden."
        },
        {
          title: "14x Stuhl-Dips",
          sub: "Profi · Sonnen-Arme",
          xp: 45, power: 900,
          pose: "dips",
          tip: "Arme ganz durchstrecken."
        }
      ],
      master: [
        {
          title: "25x Supernova-Pushups",
          sub: "Meister · Volle Aura",
          xp: 90, power: 2500,
          pose: "pushup",
          tip: "Explosiv nach oben drücken!"
        },
        {
          title: "45 Sek. Speed-Punches",
          sub: "Meister · Licht-Salve",
          xp: 85, power: 2200,
          pose: "punch", sec: 45,
          tip: "Maximales Tempo!"
        }
      ]
    },
    core: {
      easy: [
        {
          title: "25 Sek. Gold-Plank",
          sub: "Einfach · Licht-Schild",
          xp: 25, power: 450,
          pose: "plank", sec: 25,
          tip: "Körper gerade wie ein Strahl."
        },
        {
          title: "14x Crunches",
          sub: "Einfach · Nova-Kern",
          xp: 25, power: 400,
          pose: "situp",
          tip: "Sauber einrollen."
        }
      ],
      advanced: [
        {
          title: "22x Sit-Ups",
          sub: "Profi · Sonnen-Rumpf",
          xp: 45, power: 950,
          pose: "situp",
          tip: "Kraftvoll aufrichten."
        },
        {
          title: "18x Beinheben",
          sub: "Profi · Sternen-Kraft",
          xp: 45, power: 900,
          pose: "legraise",
          tip: "Beine gestreckt lassen."
        }
      ],
      master: [
        {
          title: "75 Sek. Supernova-Plank",
          sub: "Meister · Unbesiegbar",
          xp: 90, power: 2400,
          pose: "plank", sec: 75,
          tip: "Atmen und Spannung halten!"
        },
        {
          title: "30x Beinheben",
          sub: "Meister · Goldener Kern",
          xp: 85, power: 2200,
          pose: "legraise",
          tip: "Kein Hohlkreuz machen."
        }
      ]
    },
    legs: {
      easy: [
        {
          title: "30 Sek. Hampelmänner",
          sub: "Einfach · Licht-Sprung",
          xp: 20, power: 350,
          pose: "jump", sec: 30,
          tip: "Arme weit über den Kopf."
        },
        {
          title: "16x Kniebeugen",
          sub: "Einfach · Fester Stand",
          xp: 25, power: 450,
          pose: "squat",
          tip: "Po weit nach hinten."
        }
      ],
      advanced: [
        {
          title: "28x Kniebeugen",
          sub: "Profi · Nova-Beine",
          xp: 45, power: 950,
          pose: "squat",
          tip: "Tief runter und hoch."
        },
        {
          title: "18x Ausfallschritte",
          sub: "Profi · Sonnen-Schritt",
          xp: 45, power: 900,
          pose: "lunge",
          tip: "Knie knapp über Boden."
        }
      ],
      master: [
        {
          title: "22x Sprung-Kniebeugen",
          sub: "Meister · Supernova-Start",
          xp: 90, power: 2500,
          pose: "jump",
          tip: "So hoch du kannst!"
        },
        {
          title: "55 Sek. Wandsitzen",
          sub: "Meister · Gold-Säule",
          xp: 85, power: 2200,
          pose: "wallsit", sec: 55,
          tip: "Rücken fest an die Wand."
        }
      ]
    }
  }

    ,
  6: {
    arms: {
      easy: [
        {
          title: "12x Knie-Liegestütze",
          sub: "Einfach · Schild-Basis",
          xp: 25, power: 450,
          pose: "kneepushup",
          tip: "Stabil und kontrolliert."
        },
        {
          title: "12x Schulter-Tippen",
          sub: "Einfach · Titan-Stütz",
          xp: 25, power: 400,
          pose: "shouldertap",
          tip: "Fest wie ein Fels stehen."
        }
      ],
      advanced: [
        {
          title: "16x Echte Liegestütze",
          sub: "Profi · Titanen-Wall",
          xp: 50, power: 1000,
          pose: "pushup",
          tip: "Brust tief absenken."
        },
        {
          title: "14x Stuhl-Dips",
          sub: "Profi · Panzer-Arme",
          xp: 45, power: 950,
          pose: "dips",
          tip: "Kraftvoll nach oben."
        }
      ],
      master: [
        {
          title: "26x Tiefe Liegestütze",
          sub: "Meister · Festung",
          xp: 90, power: 2500,
          pose: "pushup",
          tip: "Unten 1 Sekunde halten!"
        },
        {
          title: "24x Schulter-Tippen",
          sub: "Meister · Eiserner Wall",
          xp: 85, power: 2200,
          pose: "shouldertap",
          tip: "Null Wackeln im Rumpf!"
        }
      ]
    },
    core: {
      easy: [
        {
          title: "30 Sek. Fels-Plank",
          sub: "Einfach · Ki-Schild",
          xp: 25, power: 450,
          pose: "plank", sec: 30,
          tip: "Nichts bewegt dich!"
        },
        {
          title: "12x Crunches",
          sub: "Einfach · Rumpf-Panzer",
          xp: 25, power: 400,
          pose: "situp",
          tip: "Bauch fest anspannen."
        }
      ],
      advanced: [
        {
          title: "50 Sek. Titan-Plank",
          sub: "Profi · Stahl-Kern",
          xp: 50, power: 1000,
          pose: "plank", sec: 50,
          tip: "Ruhig atmen und halten."
        },
        {
          title: "22x Sit-Ups",
          sub: "Profi · Schild-Mitte",
          xp: 45, power: 950,
          pose: "situp",
          tip: "Saubere Ausführung."
        }
      ],
      master: [
        {
          title: "80 Sek. Titanen-Wall",
          sub: "Meister · Unzerstörbar",
          xp: 95, power: 2600,
          pose: "plank", sec: 80,
          tip: "Maximale Willenskraft!"
        },
        {
          title: "28x Beinheben",
          sub: "Meister · Eisen-Rumpf",
          xp: 85, power: 2200,
          pose: "legraise",
          tip: "Langsam absenken."
        }
      ]
    },
    legs: {
      easy: [
        {
          title: "18x Kniebeugen",
          sub: "Einfach · Fels-Stand",
          xp: 25, power: 450,
          pose: "squat",
          tip: "Breiter, sicherer Stand."
        },
        {
          title: "25 Sek. Wandsitzen",
          sub: "Einfach · Mauer-Test",
          xp: 25, power: 400,
          pose: "wallsit", sec: 25,
          tip: "Rücken an die Wand."
        }
      ],
      advanced: [
        {
          title: "45 Sek. Wandsitzen",
          sub: "Profi · Titan-Säule",
          xp: 50, power: 1000,
          pose: "wallsit", sec: 45,
          tip: "90 Grad im Knie halten!"
        },
        {
          title: "28x Kniebeugen",
          sub: "Profi · Schwergewicht",
          xp: 45, power: 950,
          pose: "squat",
          tip: "Tief runter!"
        }
      ],
      master: [
        {
          title: "65 Sek. Wandsitzen",
          sub: "Meister · Unbewegbar",
          xp: 90, power: 2500,
          pose: "wallsit", sec: 65,
          tip: "Du bist die Mauer!"
        },
        {
          title: "24x Ausfallschritte",
          sub: "Meister · Titan-Schritt",
          xp: 85, power: 2200,
          pose: "lunge",
          tip: "Volle Beinkraft!"
        }
      ]
    }
  }

    ,
  7: {
    arms: {
      easy: [
        {
          title: "25 Sek. Donner-Punches",
          sub: "Einfach · Schnellkraft",
          xp: 20, power: 350,
          pose: "punch", sec: 25,
          tip: "So schnell du kannst!"
        },
        {
          title: "20 Sek. Armkreisen",
          sub: "Einfach · Turbo-Schulter",
          xp: 20, power: 350,
          pose: "armcircles", sec: 20,
          tip: "Kleine, schnelle Kreise."
        }
      ],
      advanced: [
        {
          title: "35 Sek. Speed-Punches",
          sub: "Profi · Blitz-Salve",
          xp: 45, power: 950,
          pose: "punch", sec: 35,
          tip: "Keine Pause machen!"
        },
        {
          title: "14x Echte Liegestütze",
          sub: "Profi · Schnell-Push",
          xp: 45, power: 900,
          pose: "pushup",
          tip: "Explosiv hochdrücken."
        }
      ],
      master: [
        {
          title: "50 Sek. Donner-Boxen",
          sub: "Meister · Überschall",
          xp: 90, power: 2400,
          pose: "punch", sec: 50,
          tip: "Maximale Geschwindigkeit!"
        },
        {
          title: "22x Liegestütze",
          sub: "Meister · Blitz-Kraft",
          xp: 85, power: 2200,
          pose: "pushup",
          tip: "Sauber und zügig."
        }
      ]
    },
    core: {
      easy: [
        {
          title: "15x Mountain Climbers",
          sub: "Einfach · Sprint-Kern",
          xp: 25, power: 450,
          pose: "climber",
          tip: "Knie schnell vorziehen."
        },
        {
          title: "20 Sek. Plank",
          sub: "Einfach · Blitz-Haltung",
          xp: 25, power: 400,
          pose: "plank", sec: 20,
          tip: "Körper gerade halten."
        }
      ],
      advanced: [
        {
          title: "30 Sek. Mountain Climbers",
          sub: "Profi · Turbo-Antrieb",
          xp: 45, power: 950,
          pose: "climber", sec: 30,
          tip: "Volles Sprint-Tempo!"
        },
        {
          title: "20x Sit-Ups",
          sub: "Profi · Schnell-Rumpf",
          xp: 45, power: 900,
          pose: "situp",
          tip: "Zügig aufrichten."
        }
      ],
      master: [
        {
          title: "45 Sek. Speed-Climbers",
          sub: "Meister · Donner-Motor",
          xp: 90, power: 2400,
          pose: "climber", sec: 45,
          tip: "Gib alles bis zum Gong!"
        },
        {
          title: "26x Beinheben",
          sub: "Meister · Blitz-Kern",
          xp: 85, power: 2200,
          pose: "legraise",
          tip: "Beine gestreckt!"
        }
      ]
    },
    legs: {
      easy: [
        {
          title: "30 Sek. Hampelmänner",
          sub: "Einfach · Warm-Up",
          xp: 20, power: 350,
          pose: "jump", sec: 30,
          tip: "Leicht und schnell springen."
        },
        {
          title: "15x Kniebeugen",
          sub: "Einfach · Sprung-Basis",
          xp: 25, power: 450,
          pose: "squat",
          tip: "Fester Stand."
        }
      ],
      advanced: [
        {
          title: "14x Sprung-Kniebeugen",
          sub: "Profi · Donner-Sprung",
          xp: 50, power: 1000,
          pose: "jump",
          tip: "Weich auf Fußballen landen."
        },
        {
          title: "18x Ausfallschritte",
          sub: "Profi · Blitz-Schritt",
          xp: 45, power: 950,
          pose: "lunge",
          tip: "Schneller Beinwechsel."
        }
      ],
      master: [
        {
          title: "22x Sprung-Kniebeugen",
          sub: "Meister · Raketen-Kid",
          xp: 95, power: 2600,
          pose: "jump",
          tip: "Explosiv nach oben!"
        },
        {
          title: "45 Sek. Speed-Hampelmänner",
          sub: "Meister · Ausdauer-Blitz",
          xp: 85, power: 2200,
          pose: "jump", sec: 45,
          tip: "Tempo bis zum Schluss halten."
        }
      ]
    }
  }

    ,
  8: {
    arms: {
      easy: [
        {
          title: "12x Wand-Liegestütze",
          sub: "Einfach · Gletscher-Ruhe",
          xp: 25, power: 400,
          pose: "wallpushup",
          tip: "Ganz ruhig und sauber."
        },
        {
          title: "10x Schulter-Tippen",
          sub: "Einfach · Eis-Fokus",
          xp: 25, power: 450,
          pose: "shouldertap",
          tip: "Langsam antippen."
        }
      ],
      advanced: [
        {
          title: "14x Echte Liegestütze",
          sub: "Profi · Frost-Stoß",
          xp: 45, power: 950,
          pose: "pushup",
          tip: "2 Sekunden unten halten."
        },
        {
          title: "12x Stuhl-Dips",
          sub: "Profi · Eis-Trizeps",
          xp: 45, power: 900,
          pose: "dips",
          tip: "Kontrolliert absenken."
        }
      ],
      master: [
        {
          title: "22x Tiefe Liegestütze",
          sub: "Meister · Gletscher-Strahl",
          xp: 85, power: 2200,
          pose: "pushup",
          tip: "Eiskalte Präzision!"
        },
        {
          title: "20x Stuhl-Dips",
          sub: "Meister · Frost-Meister",
          xp: 85, power: 2200,
          pose: "dips",
          tip: "Sauber durchstrecken."
        }
      ]
    },
    core: {
      easy: [
        {
          title: "25 Sek. Eis-Plank",
          sub: "Einfach · Kühle Ruhe",
          xp: 25, power: 450,
          pose: "plank", sec: 25,
          tip: "Ruhig ein- und ausatmen."
        },
        {
          title: "12x Crunches",
          sub: "Einfach · Zen-Mitte",
          xp: 25, power: 400,
          pose: "situp",
          tip: "Kein Schwung holen."
        }
      ],
      advanced: [
        {
          title: "50 Sek. Gletscher-Plank",
          sub: "Profi · Eis-Rüstung",
          xp: 50, power: 1000,
          pose: "plank", sec: 50,
          tip: "Bleib völlig ruhig!"
        },
        {
          title: "18x Beinheben",
          sub: "Profi · Zen-Kontrolle",
          xp: 45, power: 950,
          pose: "legraise",
          tip: "Sehr langsam absenken."
        }
      ],
      master: [
        {
          title: "80 Sek. Absoluter Nullpunkt",
          sub: "Meister · Eis-Kern",
          xp: 95, power: 2600,
          pose: "plank", sec: 80,
          tip: "Eiskalt durchhalten!"
        },
        {
          title: "28x Beinheben",
          sub: "Meister · Frost-Disziplin",
          xp: 85, power: 2200,
          pose: "legraise",
          tip: "Volle Rumpfspannung."
        }
      ]
    },
    legs: {
      easy: [
        {
          title: "25 Sek. Wandsitzen",
          sub: "Einfach · Eis-Säule",
          xp: 25, power: 450,
          pose: "wallsit", sec: 25,
          tip: "Rücken flach an die Wand."
        },
        {
          title: "15x Kniebeugen",
          sub: "Einfach · Zen-Stand",
          xp: 25, power: 400,
          pose: "squat",
          tip: "Langsam tief gehen."
        }
      ],
      advanced: [
        {
          title: "45 Sek. Wandsitzen",
          sub: "Profi · Gletscher-Wand",
          xp: 50, power: 1000,
          pose: "wallsit", sec: 45,
          tip: "Atmung ruhig halten."
        },
        {
          title: "18x Ausfallschritte",
          sub: "Profi · Eis-Schritt",
          xp: 45, power: 950,
          pose: "lunge",
          tip: "Saubere Balance."
        }
      ],
      master: [
        {
          title: "65 Sek. Wandsitzen",
          sub: "Meister · Eis-Thron",
          xp: 90, power: 2500,
          pose: "wallsit", sec: 65,
          tip: "Nichts bringt dich ins Wanken."
        },
        {
          title: "32x Kniebeugen",
          sub: "Meister · Frost-Beine",
          xp: 85, power: 2200,
          pose: "squat",
          tip: "Gleichmäßiger Rhythmus."
        }
      ]
    }
  }

    ,
  9: {
    arms: {
      easy: [
        {
          title: "25 Sek. Magma-Punches",
          sub: "Einfach · Feuer-Fäuste",
          xp: 25, power: 400,
          pose: "punch", sec: 25,
          tip: "Kraftvolle Schläge nach vorn!"
        },
        {
          title: "12x Knie-Liegestütze",
          sub: "Einfach · Glut-Basis",
          xp: 25, power: 450,
          pose: "kneepushup",
          tip: "Brust tief zum Boden."
        }
      ],
      advanced: [
        {
          title: "16x Echte Liegestütze",
          sub: "Profi · Flammen-Stoß",
          xp: 45, power: 950,
          pose: "pushup",
          tip: "Explosiv hochdrücken!"
        },
        {
          title: "14x Stuhl-Dips",
          sub: "Profi · Lava-Trizeps",
          xp: 45, power: 900,
          pose: "dips",
          tip: "Voller Bewegungsradius."
        }
      ],
      master: [
        {
          title: "25x Magma-Liegestütze",
          sub: "Meister · Vulkan-Kraft",
          xp: 90, power: 2500,
          pose: "pushup",
          tip: "Spüre die Hitze in den Armen!"
        },
        {
          title: "45 Sek. Feuer-Boxen",
          sub: "Meister · Magma-Salve",
          xp: 85, power: 2200,
          pose: "punch", sec: 45,
          tip: "Mit voller Wucht schlagen!"
        }
      ]
    },
    core: {
      easy: [
        {
          title: "15x Mountain Climbers",
          sub: "Einfach · Feuer-Antrieb",
          xp: 25, power: 450,
          pose: "climber",
          tip: "Zügig die Knie vorziehen."
        },
        {
          title: "14x Crunches",
          sub: "Einfach · Glut-Kern",
          xp: 25, power: 400,
          pose: "situp",
          tip: "Bauch fest anspannen."
        }
      ],
      advanced: [
        {
          title: "35 Sek. Mountain Climbers",
          sub: "Profi · Lava-Sprint",
          xp: 45, power: 950,
          pose: "climber", sec: 35,
          tip: "Rumpf stabil halten!"
        },
        {
          title: "22x Sit-Ups",
          sub: "Profi · Flammen-Rumpf",
          xp: 45, power: 900,
          pose: "situp",
          tip: "Kraftvoll hochkommen."
        }
      ],
      master: [
        {
          title: "50 Sek. Inferno-Climbers",
          sub: "Meister · Vulkan-Kern",
          xp: 90, power: 2500,
          pose: "climber", sec: 50,
          tip: "Maximales Tempo halten!"
        },
        {
          title: "70 Sek. Magma-Plank",
          sub: "Meister · Feuer-Schild",
          xp: 85, power: 2200,
          pose: "plank", sec: 70,
          tip: "Nicht nachgeben!"
        }
      ]
    },
    legs: {
      easy: [
        {
          title: "16x Kniebeugen",
          sub: "Einfach · Vulkan-Stand",
          xp: 25, power: 450,
          pose: "squat",
          tip: "Tief in die Hocke."
        },
        {
          title: "25 Sek. Hampelmänner",
          sub: "Einfach · Funken-Sprung",
          xp: 20, power: 350,
          pose: "jump", sec: 25,
          tip: "Schnell auf den Fußballen."
        }
      ],
      advanced: [
        {
          title: "14x Sprung-Kniebeugen",
          sub: "Profi · Eruption",
          xp: 50, power: 1000,
          pose: "jump",
          tip: "Explosiv abspringen!"
        },
        {
          title: "18x Ausfallschritte",
          sub: "Profi · Lava-Schritt",
          xp: 45, power: 950,
          pose: "lunge",
          tip: "Tiefe Schritte im Wechsel."
        }
      ],
      master: [
        {
          title: "22x Vulkan-Sprünge",
          sub: "Meister · Magma-Explosion",
          xp: 95, power: 2600,
          pose: "jump",
          tip: "So hoch wie möglich!"
        },
        {
          title: "55 Sek. Wandsitzen",
          sub: "Meister · Glühende Beine",
          xp: 85, power: 2200,
          pose: "wallsit", sec: 55,
          tip: "Halte bis zum letzten Ton!"
        }
      ]
    }
  }

    ,
  10: {
    arms: {
      easy: [
        {
          title: "12x Knie-Liegestütze",
          sub: "Einfach · Kosmos-Basis",
          xp: 25, power: 400,
          pose: "kneepushup",
          tip: "Rücken gerade und sauber."
        },
        {
          title: "25 Sek. Kometen-Schläge",
          sub: "Einfach · Sternen-Faust",
          xp: 20, power: 350,
          pose: "punch", sec: 25,
          tip: "Schnelle Kombos nach vorn!"
        }
      ],
      advanced: [
        {
          title: "16x Echte Liegestütze",
          sub: "Profi · Meteor-Stoß",
          xp: 45, power: 950,
          pose: "pushup",
          tip: "Explosiv hochdrücken."
        },
        {
          title: "14x Stuhl-Dips",
          sub: "Profi · Orbit-Trizeps",
          xp: 45, power: 900,
          pose: "dips",
          tip: "Arme ganz durchstrecken."
        }
      ],
      master: [
        {
          title: "24x Kometen-Pushups",
          sub: "Meister · Schwerelos",
          xp: 90, power: 2400,
          pose: "pushup",
          tip: "Volle Tiefe und Kraft!"
        },
        {
          title: "24x Schulter-Tippen",
          sub: "Meister · Kosmos-Balance",
          xp: 85, power: 2200,
          pose: "shouldertap",
          tip: "Rumpf ruhig halten."
        }
      ]
    },
    core: {
      easy: [
        {
          title: "25 Sek. Orbit-Plank",
          sub: "Einfach · Schwerelos",
          xp: 25, power: 450,
          pose: "plank", sec: 25,
          tip: "Körper gerade halten."
        },
        {
          title: "14x Crunches",
          sub: "Einfach · Sternen-Mitte",
          xp: 25, power: 400,
          pose: "situp",
          tip: "Kontrolliert einrollen."
        }
      ],
      advanced: [
        {
          title: "20x Beinheben",
          sub: "Profi · Kosmos-Flug",
          xp: 50, power: 1000,
          pose: "legraise",
          tip: "Beine gestreckt heben."
        },
        {
          title: "45 Sek. Plank",
          sub: "Profi · Vex-Schild",
          xp: 45, power: 950,
          pose: "plank", sec: 45,
          tip: "Bauch fest anspannen."
        }
      ],
      master: [
        {
          title: "30x Beinheben",
          sub: "Meister · Galaxie-Kern",
          xp: 90, power: 2400,
          pose: "legraise",
          tip: "Langsam absenken!"
        },
        {
          title: "75 Sek. Kosmos-Plank",
          sub: "Meister · Sternen-Wall",
          xp: 85, power: 2200,
          pose: "plank", sec: 75,
          tip: "Ruhig atmen und halten."
        }
      ]
    },
    legs: {
      easy: [
        {
          title: "30 Sek. Hampelmänner",
          sub: "Einfach · Sternen-Sprung",
          xp: 20, power: 350,
          pose: "jump", sec: 30,
          tip: "Leichtfüßig abspringen."
        },
        {
          title: "16x Kniebeugen",
          sub: "Einfach · Startrampe",
          xp: 25, power: 450,
          pose: "squat",
          tip: "Po weit nach hinten."
        }
      ],
      advanced: [
        {
          title: "16x Sprung-Kniebeugen",
          sub: "Profi · Kometen-Sprung",
          xp: 50, power: 1000,
          pose: "jump",
          tip: "Hoch in die Luft!"
        },
        {
          title: "20x Ausfallschritte",
          sub: "Profi · Orbit-Schritt",
          xp: 45, power: 950,
          pose: "lunge",
          tip: "Große Schritte machen."
        }
      ],
      master: [
        {
          title: "24x Sprung-Kniebeugen",
          sub: "Meister · Kometen-Regen",
          xp: 95, power: 2600,
          pose: "jump",
          tip: "Maximale Sprungkraft!"
        },
        {
          title: "60 Sek. Wandsitzen",
          sub: "Meister · Gravitation",
          xp: 85, power: 2200,
          pose: "wallsit", sec: 60,
          tip: "90-Grad-Winkel halten."
        }
      ]
    }
  }

    ,
  11: {
    arms: {
      easy: [
        {
          title: "30 Sek. Sonnen-Kreisen",
          sub: "Einfach · Helios-Aura",
          xp: 20, power: 350,
          pose: "armcircles", sec: 30,
          tip: "Arme oben halten!"
        },
        {
          title: "12x Wand-Liegestütze",
          sub: "Einfach · Licht-Basis",
          xp: 25, power: 400,
          pose: "wallpushup",
          tip: "Gleichmäßiges Tempo."
        }
      ],
      advanced: [
        {
          title: "40 Sek. Sonnen-Boxen",
          sub: "Profi · Ausdauer-Salve",
          xp: 45, power: 950,
          pose: "punch", sec: 40,
          tip: "Nicht aufhören!"
        },
        {
          title: "15x Echte Liegestütze",
          sub: "Profi · Solar-Push",
          xp: 45, power: 900,
          pose: "pushup",
          tip: "Saubere Wiederholungen."
        }
      ],
      master: [
        {
          title: "60 Sek. Helios-Boxen",
          sub: "Meister · Endlos-Ki",
          xp: 90, power: 2400,
          pose: "punch", sec: 60,
          tip: "Volle Minute durchziehen!"
        },
        {
          title: "24x Liegestütze",
          sub: "Meister · Sonnen-Kraft",
          xp: 85, power: 2200,
          pose: "pushup",
          tip: "Gleichmäßig atmen."
        }
      ]
    },
    core: {
      easy: [
        {
          title: "25 Sek. Solar-Plank",
          sub: "Einfach · Licht-Kern",
          xp: 25, power: 450,
          pose: "plank", sec: 25,
          tip: "Körper gerade wie ein Strahl."
        },
        {
          title: "15x Crunches",
          sub: "Einfach · Ausdauer-Mitte",
          xp: 25, power: 400,
          pose: "situp",
          tip: "Schöner Rhythmus."
        }
      ],
      advanced: [
        {
          title: "40 Sek. Mountain Climbers",
          sub: "Profi · Sonnen-Motor",
          xp: 50, power: 1000,
          pose: "climber", sec: 40,
          tip: "Tempo hochhalten!"
        },
        {
          title: "24x Sit-Ups",
          sub: "Profi · Helios-Rumpf",
          xp: 45, power: 950,
          pose: "situp",
          tip: "Sauber hoch und runter."
        }
      ],
      master: [
        {
          title: "60 Sek. Mountain Climbers",
          sub: "Meister · Solar-Sturm",
          xp: 95, power: 2500,
          pose: "climber", sec: 60,
          tip: "Gib alles bis zum Ende!"
        },
        {
          title: "80 Sek. Helios-Plank",
          sub: "Meister · Unerschöpflich",
          xp: 85, power: 2200,
          pose: "plank", sec: 80,
          tip: "Du hast endlose Ausdauer!"
        }
      ]
    },
    legs: {
      easy: [
        {
          title: "35 Sek. Hampelmänner",
          sub: "Einfach · Sonnen-Takt",
          xp: 25, power: 400,
          pose: "jump", sec: 35,
          tip: "Locker weiterhüpfen."
        },
        {
          title: "18x Kniebeugen",
          sub: "Einfach · Solar-Stand",
          xp: 25, power: 450,
          pose: "squat",
          tip: "Flüssige Bewegung."
        }
      ],
      advanced: [
        {
          title: "50 Sek. Hampelmänner",
          sub: "Profi · Ausdauer-Welle",
          xp: 45, power: 950,
          pose: "jump", sec: 50,
          tip: "Atmung ruhig halten."
        },
        {
          title: "22x Ausfallschritte",
          sub: "Profi · Sonnen-Marsch",
          xp: 45, power: 900,
          pose: "lunge",
          tip: "Schritt für Schritt!"
        }
      ],
      master: [
        {
          title: "70 Sek. Speed-Hampelmänner",
          sub: "Meister · Marathon-Ki",
          xp: 90, power: 2400,
          pose: "jump", sec: 70,
          tip: "Keine Pause machen!"
        },
        {
          title: "35x Kniebeugen",
          sub: "Meister · Helios-Beine",
          xp: 85, power: 2200,
          pose: "squat",
          tip: "Stark bis zur letzten!"
        }
      ]
    }
  }

    ,
  12: {
    arms: {
      easy: [
        {
          title: "12x Knie-Liegestütze",
          sub: "Einfach · Schatten-Kraft",
          xp: 25, power: 450,
          pose: "kneepushup",
          tip: "Tief und kraftvoll."
        },
        {
          title: "10x Schulter-Tippen",
          sub: "Einfach · Orion-Stütz",
          xp: 25, power: 400,
          pose: "shouldertap",
          tip: "Rumpf fest anspannen."
        }
      ],
      advanced: [
        {
          title: "18x Echte Liegestütze",
          sub: "Profi · Eclipse-Stoß",
          xp: 50, power: 1000,
          pose: "pushup",
          tip: "Volle Schlagkraft!"
        },
        {
          title: "15x Stuhl-Dips",
          sub: "Profi · Dunkel-Trizeps",
          xp: 45, power: 950,
          pose: "dips",
          tip: "Tief absenken."
        }
      ],
      master: [
        {
          title: "28x Tiefe Liegestütze",
          sub: "Meister · Eclipse-Schlag",
          xp: 95, power: 2600,
          pose: "pushup",
          tip: "Maximale Oberkörper-Power!"
        },
        {
          title: "22x Stuhl-Dips",
          sub: "Meister · Orion-Arme",
          xp: 85, power: 2200,
          pose: "dips",
          tip: "Sauber hochdrücken."
        }
      ]
    },
    core: {
      easy: [
        {
          title: "25 Sek. Eclipse-Plank",
          sub: "Einfach · Dunkel-Aura",
          xp: 25, power: 450,
          pose: "plank", sec: 25,
          tip: "Körper gerade halten."
        },
        {
          title: "14x Crunches",
          sub: "Einfach · Orion-Mitte",
          xp: 25, power: 400,
          pose: "situp",
          tip: "Fest zusammenziehen."
        }
      ],
      advanced: [
        {
          title: "50 Sek. Plank",
          sub: "Profi · Schatten-Wall",
          xp: 50, power: 1000,
          pose: "plank", sec: 50,
          tip: "Nicht durchhängen!"
        },
        {
          title: "22x Sit-Ups",
          sub: "Profi · Dunkel-Rumpf",
          xp: 45, power: 950,
          pose: "situp",
          tip: "Kraftvoll aufrichten."
        }
      ],
      master: [
        {
          title: "80 Sek. Eclipse-Plank",
          sub: "Meister · Finsternis",
          xp: 90, power: 2500,
          pose: "plank", sec: 80,
          tip: "Eiserne Spannung!"
        },
        {
          title: "30x Beinheben",
          sub: "Meister · Orion-Kern",
          xp: 85, power: 2200,
          pose: "legraise",
          tip: "Beine gestreckt lassen."
        }
      ]
    },
    legs: {
      easy: [
        {
          title: "16x Kniebeugen",
          sub: "Einfach · Dunkel-Stand",
          xp: 25, power: 450,
          pose: "squat",
          tip: "Sicherer Stand."
        },
        {
          title: "12x Ausfallschritte",
          sub: "Einfach · Orion-Schritt",
          xp: 25, power: 400,
          pose: "lunge",
          tip: "Kontrolliert tief gehen."
        }
      ],
      advanced: [
        {
          title: "28x Kniebeugen",
          sub: "Profi · Kraft-Hocke",
          xp: 45, power: 950,
          pose: "squat",
          tip: "Über die Fersen hoch."
        },
        {
          title: "45 Sek. Wandsitzen",
          sub: "Profi · Schatten-Wand",
          xp: 45, power: 900,
          pose: "wallsit", sec: 45,
          tip: "90 Grad im Knie."
        }
      ],
      master: [
        {
          title: "24x Ausfallschritte",
          sub: "Meister · Eclipse-Marsch",
          xp: 90, power: 2400,
          pose: "lunge",
          tip: "Tiefe, kraftvolle Schritte."
        },
        {
          title: "65 Sek. Wandsitzen",
          sub: "Meister · Dunkel-Säule",
          xp: 85, power: 2200,
          pose: "wallsit", sec: 65,
          tip: "Halte bis zum Schluss!"
        }
      ]
    }
  }

    ,
  13: {
    arms: {
      easy: [
        {
          title: "25 Sek. Wind-Punches",
          sub: "Einfach · Sturm-Fäuste",
          xp: 20, power: 350,
          pose: "punch", sec: 25,
          tip: "Leicht und blitzschnell!"
        },
        {
          title: "25 Sek. Armkreisen",
          sub: "Einfach · Wirbel-Arme",
          xp: 20, power: 350,
          pose: "armcircles", sec: 25,
          tip: "Schnelle Luftwirbel!"
        }
      ],
      advanced: [
        {
          title: "40 Sek. Wirbel-Boxen",
          sub: "Profi · Sturm-Kombos",
          xp: 45, power: 950,
          pose: "punch", sec: 40,
          tip: "Maximale Geschwindigkeit!"
        },
        {
          title: "14x Schulter-Tippen",
          sub: "Profi · Luft-Balance",
          xp: 45, power: 900,
          pose: "shouldertap",
          tip: "Schneller Handwechsel."
        }
      ],
      master: [
        {
          title: "55 Sek. Orkan-Punches",
          sub: "Meister · Wirbelsturm",
          xp: 90, power: 2400,
          pose: "punch", sec: 55,
          tip: "Wie ein Tornado schlagen!"
        },
        {
          title: "22x Liegestütze",
          sub: "Meister · Aero-Power",
          xp: 85, power: 2200,
          pose: "pushup",
          tip: "Explosiv nach oben."
        }
      ]
    },
    core: {
      easy: [
        {
          title: "16x Mountain Climbers",
          sub: "Einfach · Luft-Sprint",
          xp: 25, power: 450,
          pose: "climber",
          tip: "Leichtfüßig vorziehen."
        },
        {
          title: "25 Sek. Wind-Plank",
          sub: "Einfach · Schweben",
          xp: 25, power: 400,
          pose: "plank", sec: 25,
          tip: "Körper gerade halten."
        }
      ],
      advanced: [
        {
          title: "35 Sek. Mountain Climbers",
          sub: "Profi · Sturm-Antrieb",
          xp: 50, power: 1000,
          pose: "climber", sec: 35,
          tip: "Volles Tempo!"
        },
        {
          title: "22x Sit-Ups",
          sub: "Profi · Aero-Kern",
          xp: 45, power: 950,
          pose: "situp",
          tip: "Flüssig aufrollen."
        }
      ],
      master: [
        {
          title: "55 Sek. Tornado-Climbers",
          sub: "Meister · Wirbel-Motor",
          xp: 95, power: 2500,
          pose: "climber", sec: 55,
          tip: "Schneller als der Wind!"
        },
        {
          title: "28x Beinheben",
          sub: "Meister · Himmels-Kern",
          xp: 85, power: 2200,
          pose: "legraise",
          tip: "Kontrolliert bewegen."
        }
      ]
    },
    legs: {
      easy: [
        {
          title: "30 Sek. Hampelmänner",
          sub: "Einfach · Wind-Hüpfer",
          xp: 20, power: 350,
          pose: "jump", sec: 30,
          tip: "Federnd auf Fußballen."
        },
        {
          title: "14x Ausfallschritte",
          sub: "Einfach · Dash-Schritt",
          xp: 25, power: 450,
          pose: "lunge",
          tip: "Schnell und sauber."
        }
      ],
      advanced: [
        {
          title: "16x Sprung-Kniebeugen",
          sub: "Profi · Himmels-Sprung",
          xp: 50, power: 1000,
          pose: "jump",
          tip: "Weich landen!"
        },
        {
          title: "22x Ausfallschritte",
          sub: "Profi · Sturm-Lauf",
          xp: 45, power: 950,
          pose: "lunge",
          tip: "Zügiger Wechsel."
        }
      ],
      master: [
        {
          title: "25x Sprung-Kniebeugen",
          sub: "Meister · Aero-Flug",
          xp: 95, power: 2600,
          pose: "jump",
          tip: "Ab in die Lüfte!"
        },
        {
          title: "55 Sek. Speed-Hampelmänner",
          sub: "Meister · Wirbel-Beine",
          xp: 85, power: 2200,
          pose: "jump", sec: 55,
          tip: "Höchstgeschwindigkeit!"
        }
      ]
    }
  }

    ,
  14: {
    arms: {
      easy: [
        {
          title: "14x Knie-Liegestütze",
          sub: "Einfach · Götter-Basis",
          xp: 25, power: 450,
          pose: "kneepushup",
          tip: "Perfekte Technik!"
        },
        {
          title: "25 Sek. Omega-Punches",
          sub: "Einfach · Urknall-Faust",
          xp: 25, power: 400,
          pose: "punch", sec: 25,
          tip: "Volle Konzentration."
        }
      ],
      advanced: [
        {
          title: "18x Echte Liegestütze",
          sub: "Profi · Götter-Kraft",
          xp: 50, power: 1000,
          pose: "pushup",
          tip: "Brust tief zum Boden."
        },
        {
          title: "16x Stuhl-Dips",
          sub: "Profi · Omega-Arme",
          xp: 50, power: 1000,
          pose: "dips",
          tip: "Ganz durchstrecken."
        }
      ],
      master: [
        {
          title: "30x Omega-Liegestütze",
          sub: "Meister · Urknall-Power",
          xp: 100, power: 2800,
          pose: "pushup",
          tip: "Göttliche Armkraft!"
        },
        {
          title: "25x Stuhl-Dips",
          sub: "Meister · Meister-Form",
          xp: 90, power: 2400,
          pose: "dips",
          tip: "Bis zum Limit!"
        }
      ]
    },
    core: {
      easy: [
        {
          title: "30 Sek. Götter-Plank",
          sub: "Einfach · Omega-Aura",
          xp: 25, power: 450,
          pose: "plank", sec: 30,
          tip: "Absolute Körperspannung."
        },
        {
          title: "16x Crunches",
          sub: "Einfach · Meister-Mitte",
          xp: 25, power: 450,
          pose: "situp",
          tip: "Sauber einrollen."
        }
      ],
      advanced: [
        {
          title: "55 Sek. Omega-Plank",
          sub: "Profi · Götter-Schild",
          xp: 50, power: 1000,
          pose: "plank", sec: 55,
          tip: "Ruhig atmen und halten."
        },
        {
          title: "24x Beinheben",
          sub: "Profi · Kosmos-Kern",
          xp: 50, power: 1000,
          pose: "legraise",
          tip: "Beine gestreckt lassen."
        }
      ],
      master: [
        {
          title: "90 Sek. Omega-Wall",
          sub: "Meister · Unsterblich",
          xp: 100, power: 2800,
          pose: "plank", sec: 90,
          tip: "90 Sekunden Götter-Fokus!"
        },
        {
          title: "35x Sit-Ups",
          sub: "Meister · Urknall-Rumpf",
          xp: 90, power: 2400,
          pose: "situp",
          tip: "Volle Kraft voraus!"
        }
      ]
    },
    legs: {
      easy: [
        {
          title: "18x Kniebeugen",
          sub: "Einfach · Götter-Stand",
          xp: 25, power: 450,
          pose: "squat",
          tip: "Tief und stabil."
        },
        {
          title: "14x Ausfallschritte",
          sub: "Einfach · Omega-Schritt",
          xp: 25, power: 450,
          pose: "lunge",
          tip: "Saubere Balance."
        }
      ],
      advanced: [
        {
          title: "18x Sprung-Kniebeugen",
          sub: "Profi · Götter-Sprung",
          xp: 50, power: 1000,
          pose: "jump",
          tip: "Explosiv nach oben!"
        },
        {
          title: "50 Sek. Wandsitzen",
          sub: "Profi · Omega-Säule",
          xp: 50, power: 1000,
          pose: "wallsit", sec: 50,
          tip: "90 Grad halten!"
        }
      ],
      master: [
        {
          title: "28x Omega-Sprünge",
          sub: "Meister · Urknall-Start",
          xp: 100, power: 2800,
          pose: "jump",
          tip: "Maximale Höhe!"
        },
        {
          title: "75 Sek. Wandsitzen",
          sub: "Meister · Götter-Thron",
          xp: 90, power: 2400,
          pose: "wallsit", sec: 75,
          tip: "Nichts erschüttert dich!"
        }
      ]
    }
  }

    ,
  15: {
    arms: {
      easy: [
        {
          title: "12x Knie-Liegestütze",
          sub: "Einfach · Natur-Kraft",
          xp: 25, power: 400,
          pose: "kneepushup",
          tip: "Rücken gerade halten."
        },
        {
          title: "25 Sek. Sturm-Punches",
          sub: "Einfach · Smaragd-Faust",
          xp: 20, power: 350,
          pose: "punch", sec: 25,
          tip: "Kraftvolle Schläge!"
        }
      ],
      advanced: [
        {
          title: "16x Echte Liegestütze",
          sub: "Profi · Sturm-Stoß",
          xp: 45, power: 950,
          pose: "pushup",
          tip: "Brust tief absenken."
        },
        {
          title: "14x Stuhl-Dips",
          sub: "Profi · Wurzel-Kraft",
          xp: 45, power: 900,
          pose: "dips",
          tip: "Sauber hochdrücken."
        }
      ],
      master: [
        {
          title: "25x Sturm-Liegestütze",
          sub: "Meister · Natur-Gewalt",
          xp: 90, power: 2500,
          pose: "pushup",
          tip: "Volle Power in den Armen!"
        },
        {
          title: "45 Sek. Smaragd-Boxen",
          sub: "Meister · Omega-Sturm",
          xp: 85, power: 2200,
          pose: "punch", sec: 45,
          tip: "Mit voller Wucht!"
        }
      ]
    },
    core: {
      easy: [
        {
          title: "25 Sek. Eichen-Plank",
          sub: "Einfach · Fester Stamm",
          xp: 25, power: 450,
          pose: "plank", sec: 25,
          tip: "Stark wie ein Baum!"
        },
        {
          title: "14x Crunches",
          sub: "Einfach · Sturm-Mitte",
          xp: 25, power: 400,
          pose: "situp",
          tip: "Bauch anspannen."
        }
      ],
      advanced: [
        {
          title: "45 Sek. Sturm-Plank",
          sub: "Profi · Natur-Schild",
          xp: 45, power: 950,
          pose: "plank", sec: 45,
          tip: "Ruhig atmen und halten."
        },
        {
          title: "22x Sit-Ups",
          sub: "Profi · Smaragd-Rumpf",
          xp: 45, power: 900,
          pose: "situp",
          tip: "Gleichmäßig arbeiten."
        }
      ],
      master: [
        {
          title: "75 Sek. Mammut-Plank",
          sub: "Meister · Unerschütterlich",
          xp: 90, power: 2400,
          pose: "plank", sec: 75,
          tip: "Tief verwurzelt bleiben!"
        },
        {
          title: "28x Beinheben",
          sub: "Meister · Sturm-Kern",
          xp: 85, power: 2200,
          pose: "legraise",
          tip: "Kontrolliert absenken."
        }
      ]
    },
    legs: {
      easy: [
        {
          title: "18x Kniebeugen",
          sub: "Einfach · Starke Wurzeln",
          xp: 25, power: 450,
          pose: "squat",
          tip: "Tief in die Hocke gehen."
        },
        {
          title: "12x Ausfallschritte",
          sub: "Einfach · Sturm-Schritt",
          xp: 25, power: 400,
          pose: "lunge",
          tip: "Sicherer Stand."
        }
      ],
      advanced: [
        {
          title: "30x Kniebeugen",
          sub: "Profi · Smaragd-Beine",
          xp: 50, power: 1000,
          pose: "squat",
          tip: "Über die Fersen hoch!"
        },
        {
          title: "20x Ausfallschritte",
          sub: "Profi · Natur-Marsch",
          xp: 45, power: 950,
          pose: "lunge",
          tip: "Große, tiefe Schritte."
        }
      ],
      master: [
        {
          title: "24x Sturm-Sprünge",
          sub: "Meister · Erdbeben",
          xp: 95, power: 2600,
          pose: "jump",
          tip: "Mit voller Beinkraft hoch!"
        },
        {
          title: "65 Sek. Wandsitzen",
          sub: "Meister · Eichen-Säule",
          xp: 85, power: 2200,
          pose: "wallsit", sec: 65,
          tip: "Halte bis zum Gong!"
        }
      ]
    }
  }
  
};
let state = JSON.parse(
  localStorage.getItem("zwarriors_neon_v8")
) || {
  level: 1, xp: 0, powerLevel: 0,
  carouselIndex: 0, selectedChar: 1,
  selectedStage: 1, selectedPart: "arms",
  difficulty: "easy",
  partXP: { arms: 0, core: 0, legs: 0 }
};

let activeExercise = null;
let timerInterval = null;

function showScreen(id) {
  [
    "intro-screen", "select-screen",
    "detail-screen", "arena-screen"
  ].forEach(s => {
    document.getElementById(s)
      .classList.toggle("hidden", s !== id);
  });
}

function playSound(mode = "click") {
  try {
    const AudioCtx =
      window.AudioContext ||
      window.webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (mode === "stageup") {
      if (navigator.vibrate) {
        navigator.vibrate(
          Array.of(90, 40, 140, 40, 220)
        );
      }
      Array.of(220, 330, 440, 660, 880)
        .forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = idx % 2 === 0
            ? "sawtooth" : "triangle";
          osc.frequency.setValueAtTime(
            freq, now + idx * 0.08
          );
          osc.frequency.exponentialRampToValueAtTime(
            freq * 1.35, now + idx * 0.08 + 0.28
          );
          gain.gain.setValueAtTime(
            0.14, now + idx * 0.08
          );
          gain.gain.exponentialRampToValueAtTime(
            0.005, now + idx * 0.08 + 0.3
          );
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.31);
        });
      return;
    }

    if (mode === "levelup") {
      if (navigator.vibrate) {
        navigator.vibrate(Array.of(80, 40, 130));
      }
      Array.of(330, 440, 660)
        .forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(
            freq, now + idx * 0.07
          );
          gain.gain.setValueAtTime(
            0.15, now + idx * 0.07
          );
          gain.gain.exponentialRampToValueAtTime(
            0.01, now + idx * 0.07 + 0.25
          );
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.26);
        });
      return;
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(
      540, now + 0.16
    );
    gain.gain.setValueAtTime(0.13, now);
    gain.gain.exponentialRampToValueAtTime(
      0.01, now + 0.18
    );
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);
  } catch (e) {}
}
function getComicSVG(pose) {
  const bg = `<defs>
    <radialGradient id="kiAura"
      cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ff9900"
        stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#ff9900"
        stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="giGrad"
      x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffb703"/>
      <stop offset="100%" stop-color="#e85d04"/>
    </linearGradient>
  </defs>
  <ellipse cx="130" cy="70" rx="95" ry="48"
    fill="url(#kiAura)"/>
  <line x1="20" y1="112" x2="240" y2="112"
    stroke="#3a3a48" stroke-width="3"
    stroke-linecap="round"/>`;

  const hair = (x, y, rot = 0) =>
    `<g transform="translate(${x},${y})
      rotate(${rot})">
      <polygon points="-10,-6 -22,-18 -6,-13
        -12,-28 0,-16 6,-30 10,-15 22,-22
        12,-8 20,-2 8,2"
        fill="#141418" stroke="#ffb703"
        stroke-width="1.2"/>
      <circle cx="2" cy="2" r="9"
        fill="#f4c095" stroke="#141418"
        stroke-width="1.5"/>
    </g>`;

  const svgs = {
    pushup:
      `<svg viewBox="0 0 260 125"
        width="235" height="120">${bg}
        <path d="M48,106 L108,88 L164,66"
          stroke="#1d3557" stroke-width="13"
          stroke-linecap="round" fill="none"/>
        <path d="M108,88 L166,65"
          stroke="url(#giGrad)" stroke-width="16"
          stroke-linecap="round" fill="none"/>
        <path d="M162,68 L156,90 L164,108"
          stroke="#f4c095" stroke-width="9"
          stroke-linecap="round" fill="none"/>
        ${hair(182, 58, 18)}
        <path d="M214,48 L214,88
          M206,79 L214,90 L222,79"
          stroke="#ffb703" stroke-width="3.5"
          fill="none"/>
      </svg>`,

    kneepushup:
      `<svg viewBox="0 0 260 125"
        width="235" height="120">${bg}
        <polyline points="42,92 84,106 122,82"
          stroke="#1d3557" stroke-width="13"
          stroke-linecap="round" fill="none"/>
        <path d="M122,82 L172,62"
          stroke="url(#giGrad)" stroke-width="16"
          stroke-linecap="round"/>
        <path d="M168,65 L164,90 L170,108"
          stroke="#f4c095" stroke-width="9"
          stroke-linecap="round" fill="none"/>
        ${hair(188, 54, 18)}
        <path d="M214,48 L214,88
          M206,79 L214,90 L222,79"
          stroke="#ffb703" stroke-width="3.5"
          fill="none"/>
      </svg>`,

    wallpushup:
      `<svg viewBox="0 0 260 125"
        width="235" height="120">${bg}
        <line x1="196" y1="12" x2="196" y2="112"
          stroke="#ffb703" stroke-width="5"
          stroke-linecap="round"/>
        <path d="M108,108 L130,68"
          stroke="#1d3557" stroke-width="13"
          stroke-linecap="round"/>
        <path d="M130,68 L150,36"
          stroke="url(#giGrad)" stroke-width="16"
          stroke-linecap="round"/>
        <path d="M148,40 L192,42"
          stroke="#f4c095" stroke-width="9"
          stroke-linecap="round"/>
        ${hair(156, 20, 22)}
        <path d="M164,62 L186,62
          M179,56 L188,62 L179,68"
          stroke="#ffb703" stroke-width="3"
          fill="none"/>
      </svg>`,

    armcircles:
      `<svg viewBox="0 0 260 125"
        width="235" height="120">${bg}
        <polyline points="122,76 112,108"
          stroke="#1d3557" stroke-width="13"
          stroke-linecap="round"/>
        <polyline points="138,76 148,108"
          stroke="#1d3557" stroke-width="13"
          stroke-linecap="round"/>
        <path d="M130,40 L130,76"
          stroke="url(#giGrad)" stroke-width="18"
          stroke-linecap="round"/>
        <line x1="74" y1="46" x2="186" y2="46"
          stroke="#f4c095" stroke-width="8"
          stroke-linecap="round"/>
        <circle cx="68" cy="46" r="14"
          stroke="#ffb703" stroke-width="2.5"
          stroke-dasharray="5 3" fill="none"/>
        <circle cx="192" cy="46" r="14"
          stroke="#ffb703" stroke-width="2.5"
          stroke-dasharray="5 3" fill="none"/>
        ${hair(130, 23, 0)}
      </svg>`,

    shouldertap:
      `<svg viewBox="0 0 260 125"
        width="235" height="120">${bg}
        <path d="M46,106 L108,82 L168,54"
          stroke="#1d3557" stroke-width="13"
          stroke-linecap="round" fill="none"/>
        <path d="M108,82 L168,54"
          stroke="url(#giGrad)" stroke-width="16"
          stroke-linecap="round"/>
        <line x1="166" y1="56" x2="166" y2="108"
          stroke="#f4c095" stroke-width="9"
          stroke-linecap="round"/>
        <polyline points="164,58 148,68 158,52"
          stroke="#ffb703" stroke-width="7"
          stroke-linecap="round" fill="none"/>
        ${hair(184, 46, 15)}
      </svg>`,
        dips:
      `<svg viewBox="0 0 260 125"
        width="235" height="120">${bg}
        <polyline
          points="55,110 55,64 95,64 95,110"
          stroke="#555" stroke-width="5"
          fill="none"/>
        <polyline
          points="124,84 162,86 184,108"
          stroke="#1d3557" stroke-width="13"
          stroke-linecap="round" fill="none"/>
        <path d="M116,46 L124,84"
          stroke="url(#giGrad)" stroke-width="16"
          stroke-linecap="round"/>
        <polyline points="116,48 92,62"
          stroke="#f4c095" stroke-width="8"
          stroke-linecap="round" fill="none"/>
        ${hair(116, 30, 0)}
      </svg>`,

    plank:
      `<svg viewBox="0 0 260 125"
        width="235" height="120">${bg}
        <path d="M45,104 L112,88 L174,74"
          stroke="#1d3557" stroke-width="13"
          stroke-linecap="round" fill="none"/>
        <path d="M112,88 L176,73"
          stroke="url(#giGrad)" stroke-width="16"
          stroke-linecap="round" fill="none"/>
        <polyline
          points="172,76 168,104 190,104"
          stroke="#f4c095" stroke-width="9"
          stroke-linecap="round" fill="none"/>
        ${hair(194, 68, 12)}
      </svg>`,

    climber:
      `<svg viewBox="0 0 260 125"
        width="235" height="120">${bg}
        <polyline
          points="52,106 108,82 142,92 126,104"
          stroke="#1d3557" stroke-width="13"
          fill="none"/>
        <path d="M108,82 L168,54"
          stroke="url(#giGrad)" stroke-width="16"
          stroke-linecap="round"/>
        <line x1="166" y1="56" x2="166" y2="108"
          stroke="#f4c095" stroke-width="9"
          stroke-linecap="round"/>
        ${hair(184, 46, 15)}
      </svg>`,

    situp:
      `<svg viewBox="0 0 260 125"
        width="235" height="120">${bg}
        <polyline
          points="126,104 162,74 188,106"
          stroke="#1d3557" stroke-width="13"
          stroke-linecap="round" fill="none"/>
        <path d="M126,104 L104,58"
          stroke="url(#giGrad)" stroke-width="17"
          stroke-linecap="round"/>
        <polyline
          points="106,62 134,56 146,66"
          stroke="#f4c095" stroke-width="8"
          stroke-linecap="round" fill="none"/>
        ${hair(98, 42, -18)}
      </svg>`,

    legraise:
      `<svg viewBox="0 0 260 125"
        width="235" height="120">${bg}
        <path d="M68,104 L124,104"
          stroke="url(#giGrad)" stroke-width="16"
          stroke-linecap="round"/>
        <path d="M124,104 L176,46"
          stroke="#1d3557" stroke-width="13"
          stroke-linecap="round"/>
        ${hair(52, 98, -75)}
      </svg>`,

    squat:
      `<svg viewBox="0 0 260 125"
        width="235" height="120">${bg}
        <polyline
          points="122,76 154,84 134,108"
          stroke="#1d3557" stroke-width="13"
          stroke-linecap="round" fill="none"/>
        <path d="M128,42 L120,76"
          stroke="url(#giGrad)" stroke-width="17"
          stroke-linecap="round"/>
        <polyline
          points="128,46 164,54 182,48"
          stroke="#f4c095" stroke-width="8"
          stroke-linecap="round" fill="none"/>
        ${hair(130, 26, 0)}
      </svg>`,

    lunge:
      `<svg viewBox="0 0 260 125"
        width="235" height="120">${bg}
        <polyline
          points="124,74 162,76 162,108"
          stroke="#1d3557" stroke-width="13"
          stroke-linecap="round" fill="none"/>
        <polyline
          points="124,74 96,102 72,104"
          stroke="#1d3557" stroke-width="12"
          stroke-linecap="round" fill="none"/>
        <path d="M124,38 L124,74"
          stroke="url(#giGrad)" stroke-width="17"
          stroke-linecap="round"/>
        ${hair(124, 22, 0)}
      </svg>`,

    wallsit:
      `<svg viewBox="0 0 260 125"
        width="235" height="120">${bg}
        <line x1="94" y1="14" x2="94" y2="112"
          stroke="#ffb703" stroke-width="5"
          stroke-linecap="round"/>
        <polyline
          points="104,76 146,76 146,108"
          stroke="#1d3557" stroke-width="13"
          stroke-linecap="round" fill="none"/>
        <path d="M104,38 L104,76"
          stroke="url(#giGrad)" stroke-width="17"
          stroke-linecap="round"/>
        ${hair(106, 22, 0)}
        <text x="164" y="82" fill="#ffb703"
          font-family="Anton, sans-serif"
          font-size="16">90°</text>
      </svg>`,

    punch:
      `<svg viewBox="0 0 260 125"
        width="235" height="120">${bg}
        <polyline points="104,76 86,108"
          stroke="#1d3557" stroke-width="13"
          stroke-linecap="round"/>
        <polyline points="108,76 130,108"
          stroke="#1d3557" stroke-width="13"
          stroke-linecap="round"/>
        <path d="M106,40 L106,76"
          stroke="url(#giGrad)" stroke-width="18"
          stroke-linecap="round"/>
        <line x1="108" y1="48" x2="174" y2="46"
          stroke="#f4c095" stroke-width="9"
          stroke-linecap="round"/>
        <polygon
          points="188,46 218,36 208,46 218,56"
          fill="#ff9900"/>
        ${hair(106, 24, 0)}
      </svg>`,

    jump:
      `<svg viewBox="0 0 260 125"
        width="235" height="120">${bg}
        <polyline points="128,68 108,94"
          stroke="#1d3557" stroke-width="12"
          stroke-linecap="round"/>
        <polyline points="132,68 152,94"
          stroke="#1d3557" stroke-width="12"
          stroke-linecap="round"/>
        <path d="M130,34 L130,68"
          stroke="url(#giGrad)" stroke-width="17"
          stroke-linecap="round"/>
        <polyline points="128,40 100,18"
          stroke="#f4c095" stroke-width="8"
          stroke-linecap="round"/>
        <polyline points="132,40 160,18"
          stroke="#f4c095" stroke-width="8"
          stroke-linecap="round"/>
        ${hair(130, 19, 0)}
      </svg>`
  };
  return svgs[pose] || svgs.punch;
}
function loadSmartImage(
  imgEl, baseName, onFail, onSuccess
) {
  imgEl.style.display = "none";
  imgEl.onload = () => {
    imgEl.style.display = "block";
    if (onSuccess) onSuccess();
  };
  imgEl.onerror = () => {
    imgEl.onerror = () => {
      imgEl.style.display = "none";
      imgEl.removeAttribute("src");
      if (onFail) onFail();
    };
    imgEl.src = `${baseName}.jpg`;
  };
  imgEl.src = `${baseName}.png`;
}

function getMaxUnlockedStage(lvl) {
  let max = 1;
  STAGE_RULES.forEach(s => {
    if (lvl >= s.minLevel) max = s.stage;
  });
  return max;
}

function updateStaggeredCarousel() {
  const total = CHARACTERS.length;
  const idxCurr =
    (state.carouselIndex + total) % total;
  const idxPrev =
    (idxCurr - 1 + total) % total;
  const idxNext = (idxCurr + 1) % total;

  const cPrev = CHARACTERS[idxPrev];
  const cCurr = CHARACTERS[idxCurr];
  const cNext = CHARACTERS[idxNext];

  document.getElementById("select-power")
    .textContent =
      state.powerLevel.toLocaleString("de-DE");
  document.getElementById("card-prev")
    .style.background = cPrev.color;
  document.getElementById("card-curr")
    .style.background = cCurr.color;
  document.getElementById("card-next")
    .style.background = cNext.color;

  document.getElementById("name-curr")
    .textContent = cCurr.name;
  document.getElementById("lvl-curr")
    .textContent = `LVL ${state.level}`;
  document.getElementById("evo-curr")
    .textContent =
      `STUFE · ` +
      `${getMaxUnlockedStage(state.level)}`;

  document.getElementById("fb-prev")
    .textContent =
      `#${String(cPrev.id).padStart(2, "0")}`;
  document.getElementById("fb-curr")
    .textContent =
      `#${String(cCurr.id).padStart(2, "0")}`;
  document.getElementById("fb-next")
    .textContent =
      `#${String(cNext.id).padStart(2, "0")}`;

  Array.of("prev", "curr", "next")
    .forEach((pos, i) => {
      const charObj =
        Array.of(cPrev, cCurr, cNext)[i];
      const fb =
        document.getElementById(`fb-${pos}`);
      const im =
        document.getElementById(`img-${pos}`);
      im.classList.toggle(
        "is-c3", charObj.id === 3
      );
      fb.style.display = "grid";
      loadSmartImage(
        im,
        `c${charObj.id}_s1`,
        () => { fb.style.display = "grid"; },
        () => { fb.style.display = "none"; }
      );
    });

  const progress =
    (idxCurr / (total - 1)) * 34;
  document.getElementById("scroll-thumb")
    .style.transform =
      `translateY(${progress}px)`;
}
function stepCarousel(dir) {
  state.carouselIndex =
    (state.carouselIndex + dir +
      CHARACTERS.length) % CHARACTERS.length;
  playSound("click");
  updateStaggeredCarousel();
}

let touchStartY = 0;
let isSwiping = false;
const carouselEl =
  document.getElementById("staggered-carousel");

carouselEl.addEventListener(
  "touchstart",
  e => {
    if (e.touches && e.touches.length > 0) {
      touchStartY =
        e.touches.item(0).clientY;
      isSwiping = true;
    }
  },
  { passive: true }
);

carouselEl.addEventListener(
  "touchmove",
  e => {
    if (isSwiping) e.preventDefault();
  },
  { passive: false }
);

carouselEl.addEventListener("touchend", e => {
  if (
    !isSwiping ||
    !e.changedTouches ||
    e.changedTouches.length === 0
  ) {
    return;
  }
  isSwiping = false;
  const diff =
    touchStartY -
    e.changedTouches.item(0).clientY;
  if (Math.abs(diff) > 25) {
    stepCarousel(diff > 0 ? 1 : -1);
  }
});

document.getElementById("card-prev")
  .addEventListener("click", () => {
    stepCarousel(-1);
  });
document.getElementById("card-next")
  .addEventListener("click", () => {
    stepCarousel(1);
  });
document.getElementById("card-curr")
  .addEventListener("click", () => {
    playSound("click");
    openCharacterDetails(
      CHARACTERS[state.carouselIndex].id
    );
  });

function openCharacterDetails(charId) {
  const c =
    CHARACTERS.find(
      item => item.id === charId
    ) || CHARACTERS.at(0);
  state.selectedChar = c.id;

  document.getElementById("detail-num")
    .textContent =
      String(c.id).padStart(3, "0");
  document.getElementById("detail-name")
    .textContent = c.name;
  document.getElementById("detail-bio")
    .textContent = c.bio;
  document.getElementById("detail-attack")
    .textContent = c.attack;
  document.getElementById("detail-focus")
    .textContent = c.focus;

  const imgEl =
    document.getElementById("detail-img");
  imgEl.classList.toggle(
    "is-c3", c.id === 3
  );
  const phEl = document.getElementById(
    "detail-placeholder"
  );
  document.getElementById(
    "detail-placeholder-code"
  ).textContent = `c${c.id}_s1.png`;
  phEl.classList.add("hidden");

  loadSmartImage(imgEl, `c${c.id}_s1`, () => {
    phEl.classList.remove("hidden");
  });
  showScreen("detail-screen");
}
function openExerciseModal(ex) {
  activeExercise = ex;
  clearInterval(timerInterval);
  playSound("click");

  document.getElementById("ex-modal-title")
    .textContent = ex.title;
  document.getElementById("ex-modal-tip")
    .textContent =
      ex.tip || "Volle Körperspannung!";
  document.getElementById("ex-complete-btn")
    .textContent =
      `GESCHAFFT (+${ex.xp} XP)`;

  const imgEl =
    document.getElementById("ex-comic-img");
  const svgEl =
    document.getElementById("ex-comic-svg");
  svgEl.innerHTML =
    getComicSVG(ex.pose || "punch");
  svgEl.style.display = "grid";

  loadSmartImage(
    imgEl,
    `ex_${ex.pose || "punch"}`,
    () => { svgEl.style.display = "grid"; },
    () => { svgEl.style.display = "none"; }
  );

  const timerArea =
    document.getElementById("ex-timer-area");
  const timerDisp =
    document.getElementById("ex-timer-display");
  const timerBtn =
    document.getElementById("ex-timer-start");

  if (ex.sec) {
    let remaining = ex.sec;
    timerArea.classList.remove("hidden");
    const fmt = (s) =>
      `00:${String(Math.max(0, s))
        .padStart(2, "0")}`;
    timerDisp.textContent = fmt(remaining);
    timerBtn.textContent = "TIMER STARTEN";
    timerBtn.onclick = () => {
      clearInterval(timerInterval);
      timerBtn.textContent = "LÄUFT...";
      timerInterval = setInterval(() => {
        remaining -= 1;
        timerDisp.textContent = fmt(remaining);
        if (remaining <= 0) {
          clearInterval(timerInterval);
          timerDisp.textContent = "FERTIG!";
          timerBtn.textContent = "NEU STARTEN";
          playSound("levelup");
          remaining = ex.sec;
        }
      }, 1000);
    };
  } else {
    timerArea.classList.add("hidden");
  }

  document.getElementById("exercise-modal")
    .classList.remove("hidden");
}

function renderWorkouts() {
  const custom =
    CHARACTER_WORKOUTS[state.selectedChar];
  const basePart =
    BODY_WORKOUTS[state.selectedPart] ||
    BODY_WORKOUTS.arms;
  const partData =
    (custom && custom[state.selectedPart])
      ? {
          label: basePart.label,
          ...custom[state.selectedPart]
        }
      : basePart;

  document.getElementById(
    "selected-part-title"
  ).textContent = partData.label;

  const list =
    document.getElementById("workout-list");
  list.innerHTML = "";

  const exercises =
    partData[state.difficulty] || partData.easy;
  exercises.forEach(ex => {
    const btn = document.createElement("button");
    btn.className = "workout-card";
    btn.innerHTML =
      `<div><div class="workout-title">` +
      `${ex.title}</div>` +
      `<div class="workout-sub">` +
      `${ex.sub}</div></div>` +
      `<span class="xp-tag">+${ex.xp} XP</span>`;
    btn.addEventListener("click", () => {
      openExerciseModal(ex);
    });
    list.appendChild(btn);
  });

  document.querySelectorAll(".body-hotspot")
    .forEach(spot => {
      spot.classList.toggle(
        "active",
        spot.dataset.part === state.selectedPart
      );
    });

  document.querySelectorAll(".stat-box")
    .forEach(box => {
      box.classList.toggle(
        "active-box",
        box.dataset.partBox === state.selectedPart
      );
    });

  document.querySelectorAll(".diff-tab")
    .forEach(tab => {
      tab.classList.toggle(
        "active",
        tab.dataset.diff === state.difficulty
      );
    });
}
function completeExercise(gainedXP, gainedPower) {
  const oldMax =
    getMaxUnlockedStage(state.level);
  state.xp += gainedXP;
  state.powerLevel += gainedPower;
  state.partXP[state.selectedPart] =
    (state.partXP[state.selectedPart] || 0) +
    gainedXP;

  const stageEl =
    document.querySelector(".arena-poster-stage");
  if (stageEl) {
    stageEl.classList.remove("shake-active");
    void stageEl.offsetWidth;
    stageEl.classList.add("shake-active");
  }

  const xpNeeded = state.level * 100;
  if (state.xp >= xpNeeded) {
    state.xp -= xpNeeded;
    state.level += 1;
    const newMax =
      getMaxUnlockedStage(state.level);
    const badgeEl =
      document.getElementById("levelup-badge");
    const titleEl =
      document.getElementById("levelup-title");
    const descEl =
      document.getElementById("levelup-desc");

    if (newMax > oldMax) {
      state.selectedStage = newMax;
      playSound("stageup");
      badgeEl.textContent = "TRANSFORMATION!";
      titleEl.textContent = `STUFE ${newMax}`;
      descEl.textContent =
        `Stufe ${newMax} freigeschaltet!`;
    } else {
      playSound("levelup");
      badgeEl.textContent = "LEVEL UP!";
      titleEl.textContent =
        `LEVEL ${state.level}`;
      descEl.textContent =
        `Neue Kampfkraft: ` +
        `${state.powerLevel.toLocaleString("de-DE")}!`;
    }
    document.getElementById("levelup-overlay")
      .classList.remove("hidden");
  } else {
    playSound("click");
  }
  updateUI();
}

function updateUI() {
  const xpNeeded = state.level * 100;
  const maxUnlocked =
    getMaxUnlockedStage(state.level);
  if (state.selectedStage > maxUnlocked) {
    state.selectedStage = maxUnlocked;
  }

  const charObj =
    CHARACTERS.find(
      c => c.id === state.selectedChar
    ) || CHARACTERS.at(0);
  const baseFile =
    `c${state.selectedChar}_s${state.selectedStage}`;

  document.getElementById("power-level")
    .textContent =
      state.powerLevel.toLocaleString("de-DE");
  document.getElementById("char-num")
    .textContent =
      String(state.selectedChar).padStart(3, "0");
  document.getElementById("fighter-title")
    .textContent =
      `${charObj.name} · STUFE ${state.selectedStage}`;
  document.getElementById("bg-watermark")
    .textContent = charObj.name;
  document.getElementById("level-label")
    .textContent = `LVL ${state.level}`;
  document.getElementById("xp-text")
    .textContent = `${state.xp} / ${xpNeeded} XP`;

  const pct = Math.min(
    100, (state.xp / xpNeeded) * 100
  );
  document.getElementById("ki-bar-fill")
    .style.width = `${pct}%`;

  const calcPartLvl = (xp) =>
    `LVL ${1 + Math.floor((xp || 0) / 60)}`;
  document.getElementById("stat-arms")
    .textContent = calcPartLvl(state.partXP.arms);
  document.getElementById("stat-core")
    .textContent = calcPartLvl(state.partXP.core);
  document.getElementById("stat-legs")
    .textContent = calcPartLvl(state.partXP.legs);
    loadSmartImage(
    document.getElementById("header-avatar-img"),
    `c${state.selectedChar}_s1`,
    () => {}
  );

  const imgEl =
    document.getElementById("fighter-img");
  imgEl.classList.toggle(
    "is-c3", state.selectedChar === 3
  );
  imgEl.style.setProperty(
    "--aura-color", charObj.color
  );
  imgEl.classList.toggle(
    "aura-active", state.selectedStage >= 2
  );

  const phEl =
    document.getElementById("placeholder-box");
  document.getElementById("placeholder-code")
    .textContent = `${baseFile}.png`;
  phEl.classList.add("hidden");

  loadSmartImage(imgEl, baseFile, () => {
    phEl.classList.remove("hidden");
  });

  const pills =
    document.getElementById("stage-pills");
  pills.innerHTML = "";
  STAGE_RULES.forEach(s => {
    const unlocked = s.stage <= maxUnlocked;
    const btn = document.createElement("button");
    btn.className =
      `stage-pill ` +
      `${s.stage === state.selectedStage ? "active" : ""} ` +
      `${!unlocked ? "locked" : ""}`;
    btn.textContent = unlocked
      ? `STUFE ${s.stage}`
      : `🔒 ${s.stage}`;
    if (unlocked) {
      btn.addEventListener("click", () => {
        state.selectedStage = s.stage;
        playSound("click");
        updateUI();
      });
    }
    pills.appendChild(btn);
  });

  localStorage.setItem(
    "zwarriors_neon_v8",
    JSON.stringify(state)
  );
}

document.getElementById("ex-complete-btn")
  .addEventListener("click", () => {
    clearInterval(timerInterval);
    document.getElementById("exercise-modal")
      .classList.add("hidden");
    if (activeExercise) {
      completeExercise(
        activeExercise.xp,
        activeExercise.power
      );
    }
  });

document.getElementById("ex-close-btn")
  .addEventListener("click", () => {
    clearInterval(timerInterval);
    document.getElementById("exercise-modal")
      .classList.add("hidden");
  });

document.getElementById("enter-app-btn")
  .addEventListener("click", () => {
    playSound("click");
    updateStaggeredCarousel();
    showScreen("select-screen");
  });

document.getElementById("back-to-intro")
  .addEventListener("click", () => {
    showScreen("intro-screen");
  });

document.getElementById("back-to-carousel")
  .addEventListener("click", () => {
    updateStaggeredCarousel();
    showScreen("select-screen");
  });

document.getElementById("confirm-fighter-btn")
  .addEventListener("click", () => {
    playSound("levelup");
    updateUI();
    renderWorkouts();
    showScreen("arena-screen");
  });

document.getElementById("arena-back-btn")
  .addEventListener("click", () => {
    updateStaggeredCarousel();
    showScreen("select-screen");
  });

document.querySelectorAll(".body-hotspot")
  .forEach(spot => {
    spot.addEventListener("click", () => {
      state.selectedPart = spot.dataset.part;
      playSound("click");
      renderWorkouts();
    });
  });

document.querySelectorAll(".diff-tab")
  .forEach(tab => {
    tab.addEventListener("click", () => {
      state.difficulty = tab.dataset.diff;
      renderWorkouts();
    });
  });

document.getElementById("close-levelup")
  .addEventListener("click", () => {
    document.getElementById("levelup-overlay")
      .classList.add("hidden");
  });

document.getElementById("reset-btn")
  .addEventListener("click", () => {
    if (confirm("Bei Level 1 neu starten?")) {
      state = {
        level: 1, xp: 0, powerLevel: 0,
        carouselIndex: 0, selectedChar: 1,
        selectedStage: 1, selectedPart: "arms",
        difficulty: "easy",
        partXP: { arms: 0, core: 0, legs: 0 }
      };
      updateUI();
      renderWorkouts();
      showScreen("intro-screen");
    }
  });

loadSmartImage(
  document.getElementById("intro-hero-img"),
  "c1_s1",
  () => {}
);
updateStaggeredCarousel();
updateUI();
renderWorkouts();
