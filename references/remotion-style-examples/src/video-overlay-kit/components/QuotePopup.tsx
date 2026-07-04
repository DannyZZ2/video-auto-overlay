import type {CSSProperties} from "react";
import {AccentName, PopupPosition, accentColor, theme} from "../theme";
import {AdaptiveText, safeTextStyle} from "./compat";
import {PopupShell} from "./PopupShell";

type QuotePopupProps = {
  quote: string;
  source?: string;
  accent?: AccentName;
  position?: PopupPosition;
  visibleFrames?: number;
  style?: CSSProperties;
};

export const QuotePopup = ({
  quote,
  source,
  accent = "blue",
  position = "bottom-left",
  visibleFrames = 90,
  style,
}: QuotePopupProps) => {
  const color = accentColor(accent);

  return (
    <PopupShell
      accent={accent}
      position={position}
      width={720}
      visibleFrames={visibleFrames}
      style={{
        background: theme.colors.cardWarm,
        ...style,
      }}
    >
      <div
        style={{
          marginLeft: 12,
          color,
          fontFamily: theme.typography.display,
          fontSize: 54,
          lineHeight: 0.8,
          fontWeight: theme.typography.weights.heavy,
        }}
      >
        "
      </div>
      <AdaptiveText
        text={quote}
        baseSize={38}
        minSize={28}
        lineHeight={1.16}
        maxCharsAtBase={28}
        style={{
          marginLeft: 12,
          marginTop: theme.spacing.xs,
          fontFamily: theme.typography.display,
          fontWeight: theme.typography.weights.bold,
        }}
      >
        {quote}
      </AdaptiveText>
      {source ? (
        <div
          style={{
            ...safeTextStyle,
            marginLeft: 12,
            marginTop: theme.spacing.md,
            color: theme.colors.muted,
            fontFamily: theme.typography.mono,
            fontSize: theme.typography.sizes.caption,
            letterSpacing: 0,
          }}
        >
          {source}
        </div>
      ) : null}
    </PopupShell>
  );
};
