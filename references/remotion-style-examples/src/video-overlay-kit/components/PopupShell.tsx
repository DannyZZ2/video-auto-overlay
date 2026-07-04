import type {CSSProperties, ReactNode} from "react";
import {AbsoluteFill} from "remotion";
import {AccentName, PopupPosition, accentColor, theme} from "../theme";
import {usePopupMotion} from "./motion";

type PopupShellProps = {
  children: ReactNode;
  accent?: AccentName;
  position?: PopupPosition;
  width?: number;
  visibleFrames?: number;
  delay?: number;
  style?: CSSProperties;
};

const positionStyle = (position: PopupPosition): CSSProperties => {
  const edge = {
    left: theme.spacing.safeX,
    right: theme.spacing.safeX,
    top: theme.spacing.safeY,
    bottom: theme.spacing.safeY,
  };

  if (position === "top-left") return {left: edge.left, top: edge.top};
  if (position === "top-right") return {right: edge.right, top: edge.top};
  if (position === "center-left") {
    return {left: edge.left, top: "50%", transform: "translateY(-50%)"};
  }
  if (position === "center-right") {
    return {right: edge.right, top: "50%", transform: "translateY(-50%)"};
  }
  if (position === "bottom-left") return {left: edge.left, bottom: edge.bottom};
  if (position === "bottom-right") return {right: edge.right, bottom: edge.bottom};
  return {left: "50%", top: "50%", transform: "translate(-50%, -50%)"};
};

export const PopupShell = ({
  children,
  accent = "teal",
  position = "top-right",
  width = 640,
  visibleFrames = 90,
  delay = 0,
  style,
}: PopupShellProps) => {
  const motion = usePopupMotion(visibleFrames, delay);
  const color = accentColor(accent);
  const anchor = positionStyle(position);
  const combinedTransform = [anchor.transform, motion.transform]
    .filter(Boolean)
    .join(" ");

  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <div
        style={{
          position: "absolute",
          ...anchor,
          ...motion,
          transform: combinedTransform,
          width,
          maxWidth: `calc(100% - ${theme.spacing.safeX * 2}px)`,
          padding: theme.spacing.lg,
          borderRadius: theme.radius.card,
          border: `1px solid ${theme.colors.line}`,
          background: theme.colors.card,
          boxShadow: theme.shadow.popup,
          color: theme.colors.ink,
          fontFamily: theme.typography.body,
          overflow: "hidden",
          ...style,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 8,
            background: color,
          }}
        />
        {children}
      </div>
    </AbsoluteFill>
  );
};
