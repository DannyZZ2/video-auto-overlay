import type {CSSProperties, ReactNode} from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {AdaptiveText, safeTextStyle, VideoBackdrop} from "../components";
import {theme} from "../theme";

type AnchorPosition =
  | "top-left"
  | "top-right"
  | "center-left"
  | "center-right"
  | "bottom-left"
  | "bottom-right"
  | "center";

type StepItem = {
  index: string;
  title: string;
  detail: string;
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const steps: StepItem[] = [
  {
    index: "01",
    title: "复刻一个片段",
    detail: "效果差强人意，单点模仿不够稳定。",
  },
  {
    index: "02",
    title: "连续调整几天",
    detail: "把口播、剪辑和弹窗节奏拆成模块。",
  },
  {
    index: "03",
    title: "形成完整方案",
    detail: "下一条视频可以按同一套流程复用。",
  },
];

const positionStyle = (position: AnchorPosition): CSSProperties => {
  const x = theme.spacing.safeX;
  const y = theme.spacing.safeY;

  if (position === "top-left") return {left: x, top: y};
  if (position === "top-right") return {right: x, top: y};
  if (position === "center-left") return {left: x, top: "50%", transform: "translateY(-50%)"};
  if (position === "center-right") return {right: x, top: "50%", transform: "translateY(-50%)"};
  if (position === "bottom-left") return {left: x, bottom: y};
  if (position === "bottom-right") return {right: x, bottom: y};
  return {left: "50%", top: "50%", transform: "translate(-50%, -50%)"};
};

const useCardMotion = (visibleFrames: number, lift = 22) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({
    frame,
    fps,
    config: {damping: 18, stiffness: 150, mass: 0.8},
    durationInFrames: 14,
  });
  const exit = interpolate(frame, [visibleFrames - 10, visibleFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  return {
    opacity: opacity * exit,
    transform: `translate3d(0, ${(1 - enter) * lift - (1 - exit) * 12}px, 0) scale(${
      0.965 + enter * 0.035
    })`,
  };
};

const useReveal = (delay: number, duration = 12) => {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
};

const AnchoredLayer = ({
  children,
  position,
  width,
  visibleFrames,
  lift,
  style,
}: {
  children: ReactNode;
  position: AnchorPosition;
  width: number;
  visibleFrames: number;
  lift?: number;
  style: CSSProperties;
}) => {
  const anchor = positionStyle(position);
  const motion = useCardMotion(visibleFrames, lift);
  const transform = [anchor.transform, motion.transform].filter(Boolean).join(" ");

  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <div
        style={{
          position: "absolute",
          ...anchor,
          ...motion,
          transform,
          width,
          maxWidth: "calc(100% - 176px)",
          ...style,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

const SharedScene = ({children, tone}: {children: ReactNode; tone: "hud" | "glass" | "terminal"}) => {
  return (
    <AbsoluteFill style={{backgroundColor: theme.colors.paper}}>
      <VideoBackdrop title={`${tone.toUpperCase()} STYLE / OVERLAY TEST`} />
      {tone === "hud" ? <HudEnvironment /> : null}
      {tone === "glass" ? <GlassEnvironment /> : null}
      {tone === "terminal" ? <TerminalEnvironment /> : null}
      {children}
    </AbsoluteFill>
  );
};

export const PrecisionHUDComposition = () => {
  return (
    <SharedScene tone="hud">
      <Sequence from={18} durationInFrames={96} layout="none">
        <HudPopup
          label="AI_GENERATED"
          title="口播剪辑 + 上方动画"
          body="全部由 AI 自动生成，当前弹窗用于标记观众必须听到的重点。"
          position="top-right"
          visibleFrames={96}
          status="AUTO"
        />
      </Sequence>

      <Sequence from={92} durationInFrames={76} layout="none">
        <HudTag text="TRACKING OVERLAY EFFECT" position="top-left" visibleFrames={76} />
      </Sequence>

      <Sequence from={128} durationInFrames={128} layout="none">
        <HudProcessPanel
          label="ITERATION TRACE"
          title="从复刻片段到完整方案"
          steps={steps}
          position="center-right"
          visibleFrames={128}
        />
      </Sequence>

      <Sequence from={252} durationInFrames={86} layout="none">
        <HudStat
          label="OUTPUT"
          value="1 SET"
          detail="口播剪辑、动画 overlay、复用流程"
          position="top-right"
          visibleFrames={86}
        />
      </Sequence>

      <Sequence from={322} durationInFrames={108} layout="none">
        <HudPopup
          label="SKILL_PACKAGE"
          title="整套方案已整理成 skill"
          body="放在评论区，下一条视频可以直接调用这套流程。"
          position="bottom-right"
          visibleFrames={108}
          status="READY"
        />
      </Sequence>
    </SharedScene>
  );
};

export const FrostedGlassComposition = () => {
  return (
    <SharedScene tone="glass">
      <Sequence from={18} durationInFrames={96} layout="none">
        <GlassPopup
          label="AI 自动生成"
          title="口播剪辑和上方动画，全部由 AI 完成"
          body="半透明玻璃卡片适合叠在真人口播或屏幕录制上，质感更柔和。"
          position="top-right"
          visibleFrames={96}
        />
      </Sequence>

      <Sequence from={102} durationInFrames={74} layout="none">
        <GlassPill text="不知道你觉得效果如何？" position="top-left" visibleFrames={74} />
      </Sequence>

      <Sequence from={128} durationInFrames={128} layout="none">
        <GlassProcess
          label="调整过程"
          title="从差强人意，到完整方案"
          steps={steps}
          position="center-right"
          visibleFrames={128}
        />
      </Sequence>

      <Sequence from={252} durationInFrames={86} layout="none">
        <GlassStat
          value="1 套方案"
          detail="剪辑、口播、弹窗节奏全部模块化"
          position="top-right"
          visibleFrames={86}
        />
      </Sequence>

      <Sequence from={332} durationInFrames={104} layout="none">
        <GlassPopup
          label="Skill 已整理"
          title="这一整套方案放在评论区"
          body="适合做教程视频结尾的轻提示，不会压过原视频主体。"
          position="bottom-right"
          visibleFrames={104}
        />
      </Sequence>
    </SharedScene>
  );
};

export const TerminalAgentComposition = () => {
  return (
    <SharedScene tone="terminal">
      <Sequence from={18} durationInFrames={104} layout="none">
        <TerminalPanel
          label="agent.run"
          title="generate_voiceover_edit()"
          rows={[
            "[ok] transcript segmented",
            "[ok] speech edit assembled",
            "[ok] overlay animation generated",
          ]}
          position="top-right"
          visibleFrames={104}
        />
      </Sequence>

      <Sequence from={128} durationInFrames={132} layout="none">
        <TerminalProcess
          label="iteration.log"
          title="replicate_clip -> build_pipeline"
          steps={steps}
          position="center-right"
          visibleFrames={132}
        />
      </Sequence>

      <Sequence from={260} durationInFrames={86} layout="none">
        <TerminalStat
          label="result"
          value="workflow.skill"
          detail="complete automation package"
          position="top-left"
          visibleFrames={86}
        />
      </Sequence>

      <Sequence from={330} durationInFrames={108} layout="none">
        <TerminalPanel
          label="publish.note"
          title="skill saved to comments"
          rows={[
            "[ready] reusable workflow",
            "[ready] overlay card system",
            "[next] apply to new video",
          ]}
          position="bottom-right"
          visibleFrames={108}
        />
      </Sequence>
    </SharedScene>
  );
};

const HudEnvironment = () => {
  const frame = useCurrentFrame();
  const sweep = interpolate(frame, [0, 450], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{background: "rgba(8, 14, 22, 0.28)", mixBlendMode: "multiply"}}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(24, 169, 153, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(24, 169, 153, 0.10) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          opacity: 0.55,
          transform: `translate3d(${-sweep * 34}px, ${-sweep * 12}px, 0)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          top: 54,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(24,169,153,0.8), transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${8 + sweep * 72}%`,
          top: 0,
          bottom: 0,
          width: 2,
          background:
            "linear-gradient(180deg, transparent, rgba(24,169,153,0.72), transparent)",
          opacity: 0.7,
        }}
      />
    </AbsoluteFill>
  );
};

const HudPopup = ({
  label,
  title,
  body,
  status,
  position,
  visibleFrames,
}: {
  label: string;
  title: string;
  body: string;
  status: string;
  position: AnchorPosition;
  visibleFrames: number;
}) => {
  const rail = useReveal(4, 12);

  return (
    <AnchoredLayer
      position={position}
      width={680}
      visibleFrames={visibleFrames}
      style={{
        padding: "30px 34px 32px",
        border: "1px solid rgba(24, 169, 153, 0.72)",
        background: "rgba(8, 16, 26, 0.82)",
        boxShadow: "0 26px 80px rgba(0, 0, 0, 0.30), inset 0 0 0 1px rgba(255,255,255,0.06)",
        color: "#EAF7F4",
        fontFamily: theme.typography.body,
        overflow: "hidden",
      }}
    >
      <HudCorners />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
          marginBottom: 18,
          fontFamily: theme.typography.mono,
          fontSize: 17,
          color: "#63F3DF",
          letterSpacing: 0,
        }}
      >
        <span>{label}</span>
        <span style={{color: "#FFCF66"}}>{status}</span>
      </div>
      <div
        style={{
          height: 3,
          width: `${rail * 100}%`,
          background: "linear-gradient(90deg, #18A999, rgba(24,169,153,0))",
          marginBottom: 22,
        }}
      />
      <AdaptiveText
        text={title}
        baseSize={42}
        minSize={32}
        lineHeight={1.08}
        maxCharsAtBase={18}
        style={{
          fontFamily: theme.typography.display,
          fontWeight: theme.typography.weights.heavy,
          color: "#EAF7F4",
        }}
      >
        {title}
      </AdaptiveText>
      <AdaptiveText
        text={body}
        baseSize={27}
        minSize={21}
        lineHeight={1.32}
        maxCharsAtBase={44}
        style={{
          marginTop: 14,
          color: "rgba(234,247,244,0.78)",
          fontWeight: theme.typography.weights.medium,
        }}
      >
        {body}
      </AdaptiveText>
    </AnchoredLayer>
  );
};

const HudTag = ({
  text,
  position,
  visibleFrames,
}: {
  text: string;
  position: AnchorPosition;
  visibleFrames: number;
}) => {
  return (
    <AnchoredLayer
      position={position}
      width={430}
      visibleFrames={visibleFrames}
      lift={12}
      style={{
        padding: "14px 18px",
        border: "1px solid rgba(91, 108, 255, 0.72)",
        background: "rgba(10, 16, 28, 0.78)",
        color: "#E8ECFF",
        fontFamily: theme.typography.mono,
        fontSize: 17,
        fontWeight: theme.typography.weights.bold,
        boxShadow: "0 18px 46px rgba(0,0,0,0.26)",
      }}
    >
      <span style={{color: "#63F3DF"}}>● </span>
      <span style={safeTextStyle}>{text}</span>
    </AnchoredLayer>
  );
};

const HudProcessPanel = ({
  label,
  title,
  steps: items,
  position,
  visibleFrames,
}: {
  label: string;
  title: string;
  steps: StepItem[];
  position: AnchorPosition;
  visibleFrames: number;
}) => {
  return (
    <AnchoredLayer
      position={position}
      width={760}
      visibleFrames={visibleFrames}
      style={{
        padding: "30px 34px",
        background: "rgba(8, 16, 26, 0.86)",
        border: "1px solid rgba(255, 176, 0, 0.72)",
        boxShadow: "0 26px 80px rgba(0,0,0,0.30)",
        color: "#FFF7E7",
        fontFamily: theme.typography.body,
      }}
    >
      <HudCorners accent="#FFB000" />
      <div
        style={{
          fontFamily: theme.typography.mono,
          color: "#FFCF66",
          fontSize: 17,
          fontWeight: theme.typography.weights.bold,
          marginBottom: 12,
        }}
      >
        {label}
      </div>
      <AdaptiveText
        text={title}
        baseSize={38}
        minSize={30}
        lineHeight={1.1}
        maxCharsAtBase={20}
        style={{
          fontFamily: theme.typography.display,
          fontWeight: theme.typography.weights.heavy,
          marginBottom: 22,
        }}
      >
        {title}
      </AdaptiveText>
      <div style={{display: "grid", gap: 14}}>
        {items.map((item, index) => (
          <HudStep key={item.index} item={item} delay={8 + index * 5} />
        ))}
      </div>
    </AnchoredLayer>
  );
};

const HudStep = ({item, delay}: {item: StepItem; delay: number}) => {
  const reveal = useReveal(delay, 12);

  return (
    <div
      style={{
        opacity: reveal,
        transform: `translate3d(${(1 - reveal) * 16}px, 0, 0)`,
        display: "grid",
        gridTemplateColumns: "54px 1fr",
        gap: 14,
        alignItems: "start",
        paddingTop: 12,
        borderTop: "1px solid rgba(255, 176, 0, 0.22)",
      }}
    >
      <div
        style={{
          height: 34,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(255,176,0,0.55)",
          color: "#FFCF66",
          fontFamily: theme.typography.mono,
          fontSize: 16,
          fontWeight: theme.typography.weights.bold,
        }}
      >
        {item.index}
      </div>
      <div>
        <AdaptiveText
          text={item.title}
          baseSize={28}
          minSize={22}
          lineHeight={1.15}
          maxCharsAtBase={16}
          style={{fontWeight: theme.typography.weights.bold}}
        >
          {item.title}
        </AdaptiveText>
        <AdaptiveText
          text={item.detail}
          baseSize={22}
          minSize={18}
          lineHeight={1.28}
          maxCharsAtBase={34}
          style={{marginTop: 5, color: "rgba(255,247,231,0.72)"}}
        >
          {item.detail}
        </AdaptiveText>
      </div>
    </div>
  );
};

const HudStat = ({
  label,
  value,
  detail,
  position,
  visibleFrames,
}: {
  label: string;
  value: string;
  detail: string;
  position: AnchorPosition;
  visibleFrames: number;
}) => {
  return (
    <AnchoredLayer
      position={position}
      width={520}
      visibleFrames={visibleFrames}
      style={{
        padding: "28px 34px",
        background: "rgba(8, 16, 26, 0.84)",
        border: "1px solid rgba(91,108,255,0.72)",
        boxShadow: "0 26px 80px rgba(0,0,0,0.30)",
        color: "#E8ECFF",
        fontFamily: theme.typography.body,
      }}
    >
      <HudCorners accent="#5B6CFF" />
      <div style={{fontFamily: theme.typography.mono, color: "#8FA0FF", fontSize: 17, fontWeight: 740}}>
        {label}
      </div>
      <div
        style={{
          marginTop: 8,
          fontFamily: theme.typography.display,
          fontSize: 76,
          lineHeight: 0.92,
          fontWeight: theme.typography.weights.heavy,
        }}
      >
        {value}
      </div>
      <AdaptiveText
        text={detail}
        baseSize={25}
        minSize={19}
        lineHeight={1.28}
        maxCharsAtBase={34}
        style={{marginTop: 16, color: "rgba(232,236,255,0.76)"}}
      >
        {detail}
      </AdaptiveText>
    </AnchoredLayer>
  );
};

const HudCorners = ({accent = "#18A999"}: {accent?: string}) => (
  <>
    {[
      {position: {left: 10, top: 10}, border: {borderLeftWidth: 2, borderTopWidth: 2}},
      {position: {right: 10, top: 10}, border: {borderRightWidth: 2, borderTopWidth: 2}},
      {position: {left: 10, bottom: 10}, border: {borderLeftWidth: 2, borderBottomWidth: 2}},
      {position: {right: 10, bottom: 10}, border: {borderRightWidth: 2, borderBottomWidth: 2}},
    ].map((corner, index) => (
      <div
        key={index}
        style={{
          position: "absolute",
          width: 26,
          height: 26,
          borderColor: accent,
          borderStyle: "solid",
          borderWidth: 0,
          ...corner.border,
          ...corner.position,
        }}
      />
    ))}
  </>
);

const GlassEnvironment = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 450], [0, 48], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.36), rgba(91,108,255,0.08) 46%, rgba(24,169,153,0.08))",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 90 + drift * 0.2,
          height: 120,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.30), transparent)",
          transform: "skewY(-6deg)",
        }}
      />
    </AbsoluteFill>
  );
};

const glassCardStyle: CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.62)",
  background: "rgba(255, 255, 255, 0.58)",
  boxShadow: "0 28px 90px rgba(20,22,26,0.18), inset 0 1px 0 rgba(255,255,255,0.74)",
  backdropFilter: "blur(20px) saturate(1.12)",
  WebkitBackdropFilter: "blur(20px) saturate(1.12)",
  color: theme.colors.ink,
  fontFamily: theme.typography.body,
};

const GlassPopup = ({
  label,
  title,
  body,
  position,
  visibleFrames,
}: {
  label: string;
  title: string;
  body: string;
  position: AnchorPosition;
  visibleFrames: number;
}) => {
  const shine = useReveal(8, 22);

  return (
    <AnchoredLayer
      position={position}
      width={700}
      visibleFrames={visibleFrames}
      style={{
        ...glassCardStyle,
        padding: "34px 38px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${-38 + shine * 120}%`,
          width: 120,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.46), transparent)",
          transform: "skewX(-18deg)",
        }}
      />
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          height: 34,
          padding: "0 14px",
          borderRadius: 999,
          background: "rgba(24,169,153,0.14)",
          color: theme.colors.tealDeep,
          fontFamily: theme.typography.mono,
          fontSize: 17,
          fontWeight: theme.typography.weights.bold,
          marginBottom: 17,
        }}
      >
        {label}
      </div>
      <AdaptiveText
        text={title}
        baseSize={42}
        minSize={32}
        lineHeight={1.1}
        maxCharsAtBase={20}
        style={{
          fontFamily: theme.typography.display,
          fontWeight: theme.typography.weights.heavy,
        }}
      >
        {title}
      </AdaptiveText>
      <AdaptiveText
        text={body}
        baseSize={27}
        minSize={21}
        lineHeight={1.32}
        maxCharsAtBase={46}
        style={{
          marginTop: 14,
          color: theme.colors.inkSoft,
          fontWeight: theme.typography.weights.medium,
        }}
      >
        {body}
      </AdaptiveText>
    </AnchoredLayer>
  );
};

const GlassPill = ({
  text,
  position,
  visibleFrames,
}: {
  text: string;
  position: AnchorPosition;
  visibleFrames: number;
}) => (
  <AnchoredLayer
    position={position}
    width={440}
    visibleFrames={visibleFrames}
    lift={12}
    style={{
      ...glassCardStyle,
      padding: "15px 20px",
      borderRadius: 999,
      fontSize: 24,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.ink,
    }}
  >
    <span style={{color: theme.colors.blue}}>◆ </span>
    <span style={safeTextStyle}>{text}</span>
  </AnchoredLayer>
);

const GlassProcess = ({
  label,
  title,
  steps: items,
  position,
  visibleFrames,
}: {
  label: string;
  title: string;
  steps: StepItem[];
  position: AnchorPosition;
  visibleFrames: number;
}) => (
  <AnchoredLayer
    position={position}
    width={760}
    visibleFrames={visibleFrames}
    style={{...glassCardStyle, padding: "34px 38px"}}
  >
    <div
      style={{
        fontFamily: theme.typography.mono,
        color: theme.colors.amberDeep,
        fontSize: 17,
        fontWeight: theme.typography.weights.bold,
        marginBottom: 12,
      }}
    >
      {label}
    </div>
    <AdaptiveText
      text={title}
      baseSize={40}
      minSize={31}
      lineHeight={1.12}
      maxCharsAtBase={20}
      style={{
        fontFamily: theme.typography.display,
        fontWeight: theme.typography.weights.heavy,
        marginBottom: 22,
      }}
    >
      {title}
    </AdaptiveText>
    <div style={{display: "grid", gap: 14}}>
      {items.map((item, index) => (
        <GlassStep key={item.index} item={item} delay={8 + index * 5} />
      ))}
    </div>
  </AnchoredLayer>
);

const GlassStep = ({item, delay}: {item: StepItem; delay: number}) => {
  const reveal = useReveal(delay, 12);

  return (
    <div
      style={{
        opacity: reveal,
        transform: `translate3d(0, ${(1 - reveal) * 12}px, 0)`,
        display: "grid",
        gridTemplateColumns: "50px 1fr",
        gap: 14,
        paddingTop: 13,
        borderTop: "1px solid rgba(20,22,26,0.12)",
      }}
    >
      <div
        style={{
          height: 34,
          borderRadius: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,176,0,0.20)",
          color: theme.colors.amberDeep,
          fontFamily: theme.typography.mono,
          fontSize: 16,
          fontWeight: theme.typography.weights.bold,
        }}
      >
        {item.index}
      </div>
      <div>
        <AdaptiveText
          text={item.title}
          baseSize={28}
          minSize={22}
          lineHeight={1.16}
          maxCharsAtBase={16}
          style={{fontWeight: theme.typography.weights.bold}}
        >
          {item.title}
        </AdaptiveText>
        <AdaptiveText
          text={item.detail}
          baseSize={22}
          minSize={18}
          lineHeight={1.28}
          maxCharsAtBase={34}
          style={{marginTop: 5, color: theme.colors.muted}}
        >
          {item.detail}
        </AdaptiveText>
      </div>
    </div>
  );
};

const GlassStat = ({
  value,
  detail,
  position,
  visibleFrames,
}: {
  value: string;
  detail: string;
  position: AnchorPosition;
  visibleFrames: number;
}) => (
  <AnchoredLayer
    position={position}
    width={540}
    visibleFrames={visibleFrames}
    style={{...glassCardStyle, padding: "30px 36px"}}
  >
    <div style={{fontFamily: theme.typography.mono, color: theme.colors.blueDeep, fontSize: 17, fontWeight: 740}}>
      RESULT
    </div>
    <div
      style={{
        marginTop: 8,
        fontFamily: theme.typography.display,
        fontSize: 58,
        lineHeight: 1,
        fontWeight: theme.typography.weights.heavy,
      }}
    >
      {value}
    </div>
    <AdaptiveText
      text={detail}
      baseSize={26}
      minSize={20}
      lineHeight={1.28}
      maxCharsAtBase={34}
      style={{marginTop: 15, color: theme.colors.muted}}
    >
      {detail}
    </AdaptiveText>
  </AnchoredLayer>
);

const TerminalEnvironment = () => (
  <AbsoluteFill style={{background: "rgba(4, 7, 10, 0.36)"}}>
    <div
      style={{
        position: "absolute",
        left: 88,
        top: 78,
        fontFamily: theme.typography.mono,
        fontSize: 15,
        color: "rgba(123, 255, 203, 0.78)",
      }}
    >
      codex-agent / overlay-render / session: skill-demo
    </div>
  </AbsoluteFill>
);

const TerminalPanel = ({
  label,
  title,
  rows,
  position,
  visibleFrames,
}: {
  label: string;
  title: string;
  rows: string[];
  position: AnchorPosition;
  visibleFrames: number;
}) => (
  <AnchoredLayer
    position={position}
    width={720}
    visibleFrames={visibleFrames}
    style={{
      padding: "0 0 26px",
      background: "rgba(5, 10, 14, 0.90)",
      border: "1px solid rgba(123, 255, 203, 0.42)",
      boxShadow: "0 28px 88px rgba(0,0,0,0.38)",
      color: "#DFFFEF",
      fontFamily: theme.typography.mono,
      overflow: "hidden",
    }}
  >
    <TerminalTopBar label={label} />
    <div style={{padding: "26px 30px 0"}}>
      <TypeLine text={`> ${title}`} delay={0} size={32} color="#7BFFCB" />
      <div style={{display: "grid", gap: 11, marginTop: 22}}>
        {rows.map((row, index) => (
          <TypeLine
            key={row}
            text={row}
            delay={12 + index * 13}
            size={23}
            color={row.includes("[ok]") || row.includes("[ready]") ? "#DFFFEF" : "#FFCF66"}
          />
        ))}
      </div>
    </div>
  </AnchoredLayer>
);

const TerminalProcess = ({
  label,
  title,
  steps: items,
  position,
  visibleFrames,
}: {
  label: string;
  title: string;
  steps: StepItem[];
  position: AnchorPosition;
  visibleFrames: number;
}) => (
  <AnchoredLayer
    position={position}
    width={790}
    visibleFrames={visibleFrames}
    style={{
      padding: "0 0 28px",
      background: "rgba(5, 10, 14, 0.92)",
      border: "1px solid rgba(255, 176, 0, 0.44)",
      boxShadow: "0 28px 88px rgba(0,0,0,0.38)",
      color: "#FFF7E7",
      fontFamily: theme.typography.mono,
      overflow: "hidden",
    }}
  >
    <TerminalTopBar label={label} accent="#FFB000" />
    <div style={{padding: "26px 30px 0"}}>
      <TypeLine text={`> ${title}`} delay={0} size={30} color="#FFCF66" />
      <div style={{display: "grid", gap: 12, marginTop: 22}}>
        {items.map((item, index) => (
          <TerminalStep key={item.index} item={item} delay={12 + index * 16} />
        ))}
      </div>
    </div>
  </AnchoredLayer>
);

const TerminalStep = ({item, delay}: {item: StepItem; delay: number}) => {
  const reveal = useReveal(delay, 10);

  return (
    <div
      style={{
        opacity: reveal,
        display: "grid",
        gridTemplateColumns: "58px 1fr",
        gap: 14,
        paddingTop: 12,
        borderTop: "1px solid rgba(255,255,255,0.10)",
      }}
    >
      <div style={{color: "#FFCF66", fontSize: 21}}>{item.index}</div>
      <div>
        <div style={{fontSize: 25, color: "#FFF7E7"}}>{item.title}</div>
        <div style={{marginTop: 5, fontSize: 20, color: "rgba(255,247,231,0.66)"}}>
          {item.detail}
        </div>
      </div>
    </div>
  );
};

const TerminalStat = ({
  label,
  value,
  detail,
  position,
  visibleFrames,
}: {
  label: string;
  value: string;
  detail: string;
  position: AnchorPosition;
  visibleFrames: number;
}) => (
  <AnchoredLayer
    position={position}
    width={560}
    visibleFrames={visibleFrames}
    style={{
      padding: "0 0 26px",
      background: "rgba(5, 10, 14, 0.90)",
      border: "1px solid rgba(91, 108, 255, 0.46)",
      boxShadow: "0 28px 88px rgba(0,0,0,0.38)",
      color: "#E8ECFF",
      fontFamily: theme.typography.mono,
      overflow: "hidden",
    }}
  >
    <TerminalTopBar label={label} accent="#5B6CFF" />
    <div style={{padding: "25px 30px 0"}}>
      <div style={{color: "#8FA0FF", fontSize: 18}}>export</div>
      <TypeLine text={value} delay={4} size={42} color="#E8ECFF" />
      <TypeLine text={`// ${detail}`} delay={26} size={22} color="rgba(232,236,255,0.68)" />
    </div>
  </AnchoredLayer>
);

const TerminalTopBar = ({label, accent = "#7BFFCB"}: {label: string; accent?: string}) => (
  <div
    style={{
      height: 52,
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "0 18px",
      borderBottom: "1px solid rgba(255,255,255,0.10)",
      background: "rgba(255,255,255,0.035)",
      color: accent,
      fontSize: 16,
      fontWeight: theme.typography.weights.bold,
    }}
  >
    <span style={{width: 10, height: 10, borderRadius: 999, background: "#E45A4F"}} />
    <span style={{width: 10, height: 10, borderRadius: 999, background: "#FFB000"}} />
    <span style={{width: 10, height: 10, borderRadius: 999, background: "#18A999"}} />
    <span style={{marginLeft: 12}}>{label}</span>
  </div>
);

const TypeLine = ({
  text,
  delay,
  size,
  color,
}: {
  text: string;
  delay: number;
  size: number;
  color: string;
}) => {
  const frame = useCurrentFrame();
  const count = Math.max(0, Math.floor((frame - delay) * 1.35));
  const visible = text.slice(0, count);
  const caret = frame % 18 < 9 ? "_" : " ";

  return (
    <div
      style={{
        fontSize: size,
        lineHeight: 1.25,
        color,
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
      }}
    >
      {visible}
      {count < text.length ? caret : ""}
    </div>
  );
};
