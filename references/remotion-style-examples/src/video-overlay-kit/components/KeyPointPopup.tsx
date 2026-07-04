import type {CSSProperties, ReactNode} from "react";
import {AccentName, PopupPosition, accentColor, theme} from "../theme";
import {AdaptiveText, safeTextStyle} from "./compat";
import {PopupShell} from "./PopupShell";

type KeyPointPopupProps = {
  label: string;
  title: ReactNode;
  body?: ReactNode;
  accent?: AccentName;
  position?: PopupPosition;
  visibleFrames?: number;
  delay?: number;
  style?: CSSProperties;
};

export const KeyPointPopup = ({
  label,
  title,
  body,
  accent = "teal",
  position = "top-right",
  visibleFrames = 90,
  delay = 0,
  style,
}: KeyPointPopupProps) => {
  const color = accentColor(accent);

  return (
    <PopupShell
      accent={accent}
      position={position}
      width={690}
      visibleFrames={visibleFrames}
      delay={delay}
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
          marginBottom: theme.spacing.sm,
        }}
      >
        {label}
      </div>
      <AdaptiveText
        baseSize={theme.typography.sizes.popupTitle}
        minSize={32}
        lineHeight={1.12}
        maxCharsAtBase={20}
        style={{
          marginLeft: 12,
          fontFamily: theme.typography.display,
          fontWeight: theme.typography.weights.heavy,
        }}
      >
        {title}
      </AdaptiveText>
      {body ? (
        <AdaptiveText
          baseSize={theme.typography.sizes.popupBody}
          minSize={21}
          lineHeight={1.32}
          maxCharsAtBase={46}
          style={{
            marginLeft: 12,
            marginTop: theme.spacing.sm,
            color: theme.colors.muted,
            fontWeight: theme.typography.weights.medium,
          }}
        >
          {body}
        </AdaptiveText>
      ) : null}
    </PopupShell>
  );
};
