export const theme = {
  name: "Signal Desk Overlay",
  canvas: {
    width: 1920,
    height: 1080,
    fps: 30,
  },
  colors: {
    paper: "#F5F2EA",
    paperDeep: "#ECE7DC",
    ink: "#14161A",
    inkSoft: "#303640",
    muted: "#666D78",
    subtle: "#8B929C",
    card: "#FFFFFF",
    cardWarm: "#FBFAF6",
    scrim: "rgba(20, 22, 26, 0.22)",
    line: "#D9DEE7",
    lineStrong: "#AEB7C4",
    teal: "#18A999",
    tealDeep: "#0F766E",
    amber: "#FFB000",
    amberDeep: "#A86400",
    blue: "#5B6CFF",
    blueDeep: "#303A9B",
    danger: "#E45A4F",
  },
  typography: {
    display:
      '"Inter", "SF Pro Display", "PingFang SC", "Microsoft YaHei", sans-serif',
    body:
      '"Inter", "SF Pro Text", "PingFang SC", "Microsoft YaHei", sans-serif',
    mono: '"SF Mono", "JetBrains Mono", "Menlo", monospace',
    sizes: {
      popupTitle: 42,
      popupBody: 28,
      caption: 22,
      label: 17,
      stat: 76,
    },
    weights: {
      medium: 520,
      semibold: 650,
      bold: 740,
      heavy: 780,
    },
  },
  spacing: {
    xs: 8,
    sm: 14,
    md: 22,
    lg: 32,
    xl: 42,
    safeX: 88,
    safeY: 72,
  },
  radius: {
    card: 8,
    chip: 999,
  },
  shadow: {
    popup: "0 20px 56px rgba(20, 22, 26, 0.18)",
    lift: "0 30px 90px rgba(20, 22, 26, 0.24)",
  },
  motion: {
    enter: 12,
    exit: 9,
    stagger: 4,
    easing: [0.16, 1, 0.3, 1] as const,
    spring: {
      damping: 18,
      stiffness: 150,
      mass: 0.8,
    },
  },
} as const;

export type AccentName = "teal" | "amber" | "blue" | "danger";
export type PopupPosition =
  | "top-left"
  | "top-right"
  | "center-left"
  | "center-right"
  | "bottom-left"
  | "bottom-right"
  | "center";

export const accentColor = (accent: AccentName = "teal") =>
  theme.colors[accent];

export const accentDeepColor = (accent: AccentName = "teal") => {
  if (accent === "amber") return theme.colors.amberDeep;
  if (accent === "blue") return theme.colors.blueDeep;
  if (accent === "danger") return theme.colors.danger;
  return theme.colors.tealDeep;
};
