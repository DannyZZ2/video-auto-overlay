import type {CSSProperties} from "react";
import {AccentName, PopupPosition, accentColor, theme} from "../theme";
import {AdaptiveText, safeTextStyle} from "./compat";
import {PopupShell} from "./PopupShell";

type StatPopupProps = {
  label: string;
  value: string;
  detail: string;
  accent?: AccentName;
  position?: PopupPosition;
  visibleFrames?: number;
  style?: CSSProperties;
};

export const StatPopup = ({
  label,
  value,
  detail,
  accent = "amber",
  position = "center-right",
  visibleFrames = 86,
  style,
}: StatPopupProps) => {
  const color = accentColor(accent);

  return (
    <PopupShell
      accent={accent}
      position={position}
      width={560}
      visibleFrames={visibleFrames}
      style={style}
    >
      <div
        style={{
          ...safeTextStyle,
          marginLeft: 12,
          fontFamily: theme.typography.mono,
          fontSize: theme.typography.sizes.label,
          fontWeight: theme.typography.weights.bold,
          color,
          letterSpacing: 0,
        }}
      >
        {label}
      </div>
      <AdaptiveText
        text={value}
        baseSize={theme.typography.sizes.stat}
        minSize={48}
        lineHeight={0.95}
        maxCharsAtBase={8}
        style={{
          marginLeft: 12,
          marginTop: theme.spacing.xs,
          fontFamily: theme.typography.display,
          fontWeight: theme.typography.weights.heavy,
          color: theme.colors.ink,
        }}
      >
        {value}
      </AdaptiveText>
      <AdaptiveText
        text={detail}
        baseSize={theme.typography.sizes.popupBody}
        minSize={21}
        lineHeight={1.3}
        maxCharsAtBase={38}
        style={{
          marginLeft: 12,
          marginTop: theme.spacing.sm,
          color: theme.colors.muted,
          fontWeight: theme.typography.weights.medium,
        }}
      >
        {detail}
      </AdaptiveText>
    </PopupShell>
  );
};
