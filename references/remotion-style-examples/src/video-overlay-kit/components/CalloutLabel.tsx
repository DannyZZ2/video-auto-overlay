import type {CSSProperties} from "react";
import {AbsoluteFill} from "remotion";
import {AccentName, PopupPosition, accentColor, theme} from "../theme";
import {safeTextStyle} from "./compat";
import {usePopupMotion} from "./motion";

type CalloutLabelProps = {
  text: string;
  accent?: AccentName;
  position?: PopupPosition;
  visibleFrames?: number;
  style?: CSSProperties;
};

export const CalloutLabel = ({
  text,
  accent = "blue",
  position = "top-left",
  visibleFrames = 70,
  style,
}: CalloutLabelProps) => {
  const color = accentColor(accent);
  const motion = usePopupMotion(visibleFrames, 0, 12);

  const anchor: CSSProperties =
    position === "top-left"
      ? {left: theme.spacing.safeX, top: theme.spacing.safeY}
      : position === "top-right"
        ? {right: theme.spacing.safeX, top: theme.spacing.safeY}
        : position === "bottom-left"
          ? {left: theme.spacing.safeX, bottom: theme.spacing.safeY}
          : {right: theme.spacing.safeX, bottom: theme.spacing.safeY};

  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <div
        style={{
          position: "absolute",
          ...anchor,
          ...motion,
          display: "inline-flex",
          alignItems: "center",
          gap: theme.spacing.xs,
          height: 42,
          maxWidth: 560,
          padding: "0 16px",
          borderRadius: theme.radius.chip,
          background: theme.colors.card,
          border: `1px solid ${theme.colors.line}`,
          boxShadow: theme.shadow.popup,
          fontFamily: theme.typography.mono,
          fontSize: theme.typography.sizes.label,
          fontWeight: theme.typography.weights.bold,
          color: theme.colors.ink,
          letterSpacing: 0,
          ...style,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: color,
          }}
        />
        <span style={safeTextStyle}>{text}</span>
      </div>
    </AbsoluteFill>
  );
};
