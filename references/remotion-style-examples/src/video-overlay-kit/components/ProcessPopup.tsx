import type {CSSProperties} from "react";
import {AccentName, PopupPosition, accentColor, theme} from "../theme";
import {AdaptiveText} from "./compat";
import {useLineReveal} from "./motion";
import {PopupShell} from "./PopupShell";

type ProcessStep = {
  label: string;
  title: string;
  detail?: string;
};

type ProcessPopupProps = {
  label: string;
  title: string;
  steps: ProcessStep[];
  accent?: AccentName;
  position?: PopupPosition;
  visibleFrames?: number;
  style?: CSSProperties;
};

export const ProcessPopup = ({
  label,
  title,
  steps,
  accent = "amber",
  position = "center-left",
  visibleFrames = 118,
  style,
}: ProcessPopupProps) => {
  const color = accentColor(accent);

  return (
    <PopupShell
      accent={accent}
      position={position}
      width={760}
      visibleFrames={visibleFrames}
      style={style}
    >
      <div
        style={{
          marginLeft: 12,
          fontFamily: theme.typography.mono,
          fontSize: theme.typography.sizes.label,
          fontWeight: theme.typography.weights.bold,
          color,
          letterSpacing: 0,
          marginBottom: theme.spacing.sm,
        }}
      >
        {label}
      </div>
      <AdaptiveText
        text={title}
        baseSize={38}
        minSize={30}
        lineHeight={1.14}
        maxCharsAtBase={20}
        style={{
          marginLeft: 12,
          fontFamily: theme.typography.display,
          fontWeight: theme.typography.weights.heavy,
          marginBottom: theme.spacing.md,
        }}
      >
        {title}
      </AdaptiveText>
      <div style={{display: "grid", gap: theme.spacing.sm, marginLeft: 12}}>
        {steps.slice(0, 4).map((step, index) => (
          <ProcessRow
            key={`${step.label}-${index}`}
            index={index}
            step={step}
            accent={accent}
          />
        ))}
      </div>
    </PopupShell>
  );
};

const ProcessRow = ({
  index,
  step,
  accent,
}: {
  index: number;
  step: ProcessStep;
  accent: AccentName;
}) => {
  const reveal = useLineReveal(8 + index * theme.motion.stagger, 12);
  const color = accentColor(accent);

  return (
    <div
      style={{
        opacity: reveal,
        transform: `translate3d(${(1 - reveal) * 14}px, 0, 0)`,
        display: "grid",
        gridTemplateColumns: "48px 1fr",
        gap: theme.spacing.sm,
        alignItems: "start",
        paddingTop: theme.spacing.sm,
        borderTop: `1px solid ${index === 0 ? theme.colors.lineStrong : theme.colors.line}`,
      }}
    >
      <div
        style={{
          height: 32,
          borderRadius: theme.radius.chip,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${color}1A`,
          color,
          fontFamily: theme.typography.mono,
          fontSize: 16,
          fontWeight: theme.typography.weights.bold,
        }}
      >
        {step.label}
      </div>
      <div>
        <AdaptiveText
          text={step.title}
          baseSize={28}
          minSize={22}
          lineHeight={1.18}
          maxCharsAtBase={16}
          style={{
            fontWeight: theme.typography.weights.bold,
            color: theme.colors.ink,
          }}
        >
          {step.title}
        </AdaptiveText>
        {step.detail ? (
          <AdaptiveText
            text={step.detail}
            baseSize={theme.typography.sizes.caption}
            minSize={18}
            lineHeight={1.28}
            maxCharsAtBase={36}
            style={{
              marginTop: 5,
              color: theme.colors.muted,
            }}
          >
            {step.detail}
          </AdaptiveText>
        ) : null}
      </div>
    </div>
  );
};
