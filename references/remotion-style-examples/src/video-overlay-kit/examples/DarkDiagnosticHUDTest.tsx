import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {AdaptiveBilingualSubtitle, AdaptiveText, safeTextStyle} from "../components";
import {theme} from "../theme";

const colors = {
  black: "#05070B",
  panel: "rgba(8, 14, 22, 0.78)",
  panelSoft: "rgba(12, 20, 32, 0.64)",
  white: "#F5F8FF",
  muted: "rgba(220, 232, 255, 0.68)",
  blue: "#2DA8FF",
  green: "#36E07D",
  amber: "#FFB84D",
  red: "#FF4F64",
  purple: "#8A5CFF",
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

export const DarkDiagnosticHUDTest = () => {
  return (
    <AbsoluteFill style={{backgroundColor: colors.black}}>
      <DiagnosticBase />

      <Sequence from={0} durationInFrames={92}>
        <HeroScene />
      </Sequence>

      <Sequence from={92} durationInFrames={104}>
        <HealthReportScene />
      </Sequence>

      <Sequence from={196} durationInFrames={92}>
        <ScoreScene />
      </Sequence>

      <Sequence from={288} durationInFrames={72}>
        <ExportScene />
      </Sequence>
    </AbsoluteFill>
  );
};

const DiagnosticBase = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 360], [0, 34], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Img
        src={staticFile("assets/traffic-compass-bg.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "contrast(1.08) saturate(0.82) brightness(0.62)",
          transform: `scale(1.035) translate3d(${drift * -0.16}px, 0, 0)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 28% 24%, rgba(138,92,255,0.28), transparent 34%), radial-gradient(circle at 76% 42%, rgba(45,168,255,0.18), transparent 36%), linear-gradient(90deg, rgba(5,7,11,0.58), rgba(5,7,11,0.24) 46%, rgba(5,7,11,0.68))",
        }}
      />
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 160px rgba(0,0,0,0.72)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.18,
          backgroundImage:
            "linear-gradient(rgba(45,168,255,0.20) 1px, transparent 1px), linear-gradient(90deg, rgba(45,168,255,0.14) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          transform: `translate3d(${-drift}px, ${-drift * 0.35}px, 0)`,
        }}
      />
    </AbsoluteFill>
  );
};

const HeroScene = () => {
  return (
    <AbsoluteFill>
      <HudSectionLabel english="DARK DIAGNOSTIC HUD" chinese="视频实时体检系统" />
      <StatusChipStack
        items={[
          {english: "LIVE", chinese: "已上线", color: colors.green, icon: "✓"},
          {english: "SCAN", chinese: "扫描中", color: colors.blue, icon: "◎"},
          {english: "AUDIT", chinese: "预审", color: colors.amber, icon: "!"},
        ]}
      />
      <RadarTitle title="AI 体检报告" subtitle="Creator workflow diagnostic system" />
      <AdaptiveBilingualSubtitle
        zh="让视频像被一个 AI 工具实时分析"
        en="Make the video feel analyzed by an AI tool in real time."
        maxWidth={1540}
      />
    </AbsoluteFill>
  );
};

const HealthReportScene = () => {
  return (
    <AbsoluteFill>
      <HudSectionLabel english="AI HEALTH REPORT" chinese="发布前体检" />
      <DocumentPanel />
      <ScanCard />
      <AdaptiveBilingualSubtitle
        zh="它会先提取文案、检查风险，再给出优化建议"
        en="It extracts copy, checks risks, then suggests improvements."
        maxWidth={1540}
      />
    </AbsoluteFill>
  );
};

const ScoreScene = () => {
  return (
    <AbsoluteFill>
      <HudSectionLabel english="TRAFFIC SCORE" chinese="流量潜力评分" />
      <ScoreGauge score={82} />
      <StatusChipStack
        items={[
          {english: "RETENTION", chinese: "留存", color: colors.blue, icon: "↗"},
          {english: "HOOK", chinese: "开头", color: colors.green, icon: "●"},
          {english: "RISK", chinese: "风险", color: colors.amber, icon: "!"},
        ]}
        top={260}
      />
      <AdaptiveBilingualSubtitle
        zh="再给这个视频做一个多维度的打分"
        en="Then score the video across multiple dimensions."
        maxWidth={1540}
      />
    </AbsoluteFill>
  );
};

const ExportScene = () => {
  return (
    <AbsoluteFill>
      <HudSectionLabel english="EXPORT PACKAGE" chinese="方案文件导出" />
      <ExportFileCards />
      <AdaptiveBilingualSubtitle
        zh="最后把整套方案整理成可以复用的 skill"
        en="Finally package the workflow into a reusable skill."
        maxWidth={1540}
      />
    </AbsoluteFill>
  );
};

const HudSectionLabel = ({english, chinese}: {english: string; chinese: string}) => {
  const reveal = useReveal(0, 16);

  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        top: 56,
        opacity: reveal,
        transform: `translate3d(${(1 - reveal) * -22}px, 0, 0)`,
        fontFamily: theme.typography.mono,
      }}
    >
      <div style={{display: "flex", alignItems: "center", gap: 12}}>
        <div style={{width: 4, height: 30, background: colors.blue, boxShadow: glow(colors.blue)}} />
        <div
          style={{
            color: colors.blue,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 7,
          }}
        >
          {english}
        </div>
      </div>
      <div
        style={{
          marginTop: 6,
          marginLeft: 18,
          color: colors.white,
          fontSize: 26,
          fontWeight: 760,
          letterSpacing: 0,
        }}
      >
        {chinese}
      </div>
    </div>
  );
};

const StatusChipStack = ({
  items,
  top = 278,
}: {
  items: Array<{english: string; chinese: string; color: string; icon: string}>;
  top?: number;
}) => {
  return (
    <div style={{position: "absolute", left: 70, top, display: "grid", gap: 18}}>
      {items.map((item, index) => (
        <StatusChip key={item.english} item={item} delay={10 + index * 5} />
      ))}
    </div>
  );
};

const StatusChip = ({
  item,
  delay,
}: {
  item: {english: string; chinese: string; color: string; icon: string};
  delay: number;
}) => {
  const reveal = useReveal(delay, 14);

  return (
    <div
      style={{
        opacity: reveal,
        transform: `translate3d(${(1 - reveal) * -22}px, 0, 0)`,
        width: 254,
        height: 78,
        borderRadius: 12,
        border: `1px solid ${item.color}`,
        background: "rgba(6, 12, 20, 0.72)",
        boxShadow: `0 16px 42px rgba(0,0,0,0.28), ${glow(item.color)}`,
        display: "grid",
        gridTemplateColumns: "58px 1fr",
        alignItems: "center",
        padding: "0 18px",
        fontFamily: theme.typography.body,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          border: `1px solid ${item.color}`,
          color: item.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: theme.typography.mono,
          fontSize: 24,
          fontWeight: 800,
        }}
      >
        {item.icon}
      </div>
      <div>
        <div
          style={{
            color: item.color,
            fontFamily: theme.typography.mono,
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 4,
          }}
        >
          {item.english}
        </div>
        <div style={{...safeTextStyle, color: colors.white, fontSize: 27, fontWeight: 800, marginTop: 2}}>
          {item.chinese}
        </div>
      </div>
    </div>
  );
};

const RadarTitle = ({title, subtitle}: {title: string; subtitle: string}) => {
  const frame = useCurrentFrame();
  const scale = spring({
    frame,
    fps: 30,
    config: {damping: 18, stiffness: 120, mass: 0.8},
    durationInFrames: 24,
  });
  const pulse = interpolate(frame % 72, [0, 36, 72], [0.74, 1, 0.74]);

  return (
    <div
      style={{
        position: "absolute",
        left: 600,
        top: 190,
        width: 760,
        height: 580,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${0.96 + scale * 0.04})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 530,
          height: 530,
          borderRadius: 999,
          border: `3px solid ${colors.blue}`,
          opacity: pulse,
          boxShadow: glow(colors.blue),
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 610,
          height: 610,
          borderRadius: 999,
          border: `1px dashed ${colors.blue}`,
          opacity: 0.45,
        }}
      />
      <div style={{textAlign: "center"}}>
        <AdaptiveText
          text={title}
          baseSize={124}
          minSize={86}
          lineHeight={1}
          maxCharsAtBase={10}
          style={{
            fontFamily: theme.typography.display,
            fontWeight: 900,
            color: colors.white,
            textShadow: "0 10px 34px rgba(0,0,0,0.58)",
          }}
        >
          {title}
        </AdaptiveText>
        <div
          style={{
            marginTop: 18,
            fontFamily: theme.typography.mono,
            fontSize: 20,
            color: colors.muted,
            letterSpacing: 2,
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
};

const DocumentPanel = () => {
  const reveal = useReveal(8, 18);
  const scan = useLoop(96);

  return (
    <div
      style={{
        position: "absolute",
        right: 78,
        top: 148,
        width: 890,
        height: 612,
        opacity: reveal,
        transform: `translate3d(${(1 - reveal) * 28}px, 0, 0) scale(${0.98 + reveal * 0.02})`,
        borderRadius: 14,
        border: "1px solid rgba(245,248,255,0.22)",
        background: "rgba(4, 8, 14, 0.78)",
        boxShadow: "0 30px 90px rgba(0,0,0,0.38)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 58,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(245,248,255,0.12)",
          fontFamily: theme.typography.mono,
          color: colors.muted,
          fontSize: 16,
        }}
      >
        <span>source_copy.md</span>
        <span style={{color: colors.blue}}>SCANNING</span>
      </div>
      <div style={{padding: "30px 38px", display: "grid", gap: 18}}>
        {Array.from({length: 11}).map((_, index) => (
          <div
            key={index}
            style={{
              height: index % 4 === 0 ? 24 : 16,
              width: `${92 - ((index * 13) % 34)}%`,
              borderRadius: 999,
              background:
                index % 4 === 0
                  ? "rgba(245,248,255,0.22)"
                  : "rgba(245,248,255,0.13)",
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 78 + scan * 470,
          height: 4,
          background: `linear-gradient(90deg, transparent, ${colors.green}, transparent)`,
          boxShadow: glow(colors.green),
        }}
      />
    </div>
  );
};

const ScanCard = () => {
  const reveal = useReveal(14, 18);

  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        top: 170,
        width: 520,
        padding: "28px 30px",
        borderRadius: 14,
        opacity: reveal,
        transform: `translate3d(${(1 - reveal) * -26}px, 0, 0)`,
        border: "1px solid rgba(45,168,255,0.48)",
        background: colors.panel,
        boxShadow: `0 24px 76px rgba(0,0,0,0.38), ${glow(colors.blue)}`,
        fontFamily: theme.typography.body,
        color: colors.white,
      }}
    >
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div>
          <div style={{fontFamily: theme.typography.mono, color: colors.blue, fontSize: 18, fontWeight: 800}}>
            AI HEALTH REPORT
          </div>
          <AdaptiveText baseSize={38} minSize={30} maxCharsAtBase={12} style={{fontWeight: 900, marginTop: 5}}>
            AI 体检报告
          </AdaptiveText>
        </div>
        <BlinkDot color={colors.green} label="SCANNING" />
      </div>
      <div style={{display: "grid", gap: 20, marginTop: 28}}>
        <ReportRow color={colors.blue} index="1" title="COPY 文案提取" delay={22} />
        <ReportRow color={colors.green} index="2" title="IMPROVE 改进建议" delay={30} />
        <ReportRow color={colors.amber} index="3" title="TRAFFIC 流量潜力" delay={38} />
      </div>
    </div>
  );
};

const ReportRow = ({
  color,
  index,
  title,
  delay,
}: {
  color: string;
  index: string;
  title: string;
  delay: number;
}) => {
  const reveal = useReveal(delay, 12);

  return (
    <div
      style={{
        opacity: reveal,
        display: "grid",
        gridTemplateColumns: "54px 1fr",
        gap: 16,
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 999,
          border: `2px solid ${color}`,
          color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: theme.typography.mono,
          fontWeight: 900,
          boxShadow: glow(color),
        }}
      >
        {index}
      </div>
      <div>
        <AdaptiveText
          text={title}
          baseSize={23}
          minSize={18}
          maxCharsAtBase={18}
          style={{color, fontWeight: 900, letterSpacing: 1.5}}
        >
          {title}
        </AdaptiveText>
        <div style={{display: "grid", gap: 8, marginTop: 10}}>
          {[0.92, 0.74, 0.58].map((w, i) => (
            <div key={i} style={{height: 7, width: `${w * reveal * 100}%`, borderRadius: 999, background: color, opacity: 0.65 - i * 0.12}} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ScoreGauge = ({score}: {score: number}) => {
  const frame = useCurrentFrame();
  const reveal = useReveal(8, 18);
  const current = Math.round(
    interpolate(frame, [14, 54], [0, score], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: ease,
    }),
  );
  const degree = interpolate(current, [0, 100], [-138, 138]);

  return (
    <div
      style={{
        position: "absolute",
        left: 610,
        top: 178,
        width: 650,
        height: 560,
        opacity: reveal,
        transform: `scale(${0.96 + reveal * 0.04})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 420,
          height: 420,
          borderRadius: 999,
          border: "28px solid rgba(45,168,255,0.18)",
          borderTopColor: colors.blue,
          borderRightColor: current > 55 ? colors.blue : "rgba(45,168,255,0.18)",
          transform: `rotate(${degree}deg)`,
          boxShadow: glow(colors.blue),
        }}
      />
      <div style={{position: "absolute", textAlign: "center"}}>
        <div style={{fontSize: 92, fontWeight: 900, color: colors.white, fontFamily: theme.typography.display}}>
          {current}
          <span style={{fontSize: 32, color: colors.muted}}>/100</span>
        </div>
        <div style={{fontFamily: theme.typography.mono, color: colors.blue, fontSize: 20, fontWeight: 800, letterSpacing: 4}}>
          TRAFFIC SCORE
        </div>
      </div>
    </div>
  );
};

const ExportFileCards = () => {
  const files = [
    {name: "SRT", desc: "字幕文件", color: colors.blue},
    {name: "REPORT", desc: "体检报告", color: colors.green},
    {name: "SKILL", desc: "复用方案", color: colors.amber},
  ];

  return (
    <div style={{position: "absolute", left: 555, top: 245, display: "flex", gap: 34}}>
      {files.map((file, index) => (
        <FileCard key={file.name} file={file} delay={12 + index * 7} />
      ))}
    </div>
  );
};

const FileCard = ({
  file,
  delay,
}: {
  file: {name: string; desc: string; color: string};
  delay: number;
}) => {
  const reveal = useReveal(delay, 16);

  return (
    <div
      style={{
        opacity: reveal,
        transform: `translate3d(0, ${(1 - reveal) * 30}px, 0) scale(${0.96 + reveal * 0.04})`,
        width: 250,
        height: 310,
        borderRadius: 16,
        border: `1px solid ${file.color}`,
        background: "rgba(6, 12, 20, 0.76)",
        boxShadow: `0 24px 76px rgba(0,0,0,0.34), ${glow(file.color)}`,
        color: colors.white,
        fontFamily: theme.typography.body,
        padding: 26,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          width: 52,
          height: 62,
          border: `2px solid ${file.color}`,
          borderRadius: 8,
          color: file.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: theme.typography.mono,
          fontSize: 22,
          fontWeight: 900,
        }}
      >
        {file.name.slice(0, 1)}
      </div>
      <div>
        <div style={{fontFamily: theme.typography.mono, color: file.color, fontSize: 20, fontWeight: 900}}>
          {file.name}
        </div>
        <AdaptiveText baseSize={34} minSize={26} maxCharsAtBase={8} style={{fontWeight: 900, marginTop: 8}}>
          {file.desc}
        </AdaptiveText>
      </div>
    </div>
  );
};

const BlinkDot = ({color, label}: {color: string; label: string}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame % 36, [0, 18, 36], [0.38, 1, 0.38]);

  return (
    <div style={{display: "flex", alignItems: "center", gap: 8, color, fontFamily: theme.typography.mono, fontSize: 16, fontWeight: 800}}>
      <span style={{width: 9, height: 9, borderRadius: 999, background: color, opacity, boxShadow: glow(color)}} />
      {label}
    </div>
  );
};

const useReveal = (delay: number, duration: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
};

const useLoop = (duration: number) => {
  const frame = useCurrentFrame();
  return (frame % duration) / duration;
};

const glow = (color: string) => `0 0 24px ${color}44`;
