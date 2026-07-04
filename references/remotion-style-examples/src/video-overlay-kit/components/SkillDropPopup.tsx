import type {CSSProperties} from "react";
import {AccentName, PopupPosition, accentColor, theme} from "../theme";
import {AdaptiveText, safeTextStyle} from "./compat";
import {PopupShell} from "./PopupShell";

type SkillDropPopupProps = {
  title?: string;
  body?: string;
  tag?: string;
  accent?: AccentName;
  position?: PopupPosition;
  visibleFrames?: number;
  style?: CSSProperties;
};

export const SkillDropPopup = ({
  title = "完整方案已整理成 Skill",
  body = "放在评论区，直接复用到下一条视频。",
  tag = "COMMENT AREA",
  accent = "teal",
  position = "bottom-right",
  visibleFrames = 105,
  style,
}: SkillDropPopupProps) => {
  const color = accentColor(accent);

  return (
    <PopupShell
      accent={accent}
      position={position}
      width={650}
      visibleFrames={visibleFrames}
      style={style}
    >
      <div style={{marginLeft: 12}}>
        <div
          style={{
            ...safeTextStyle,
            display: "inline-flex",
            alignItems: "center",
            height: 34,
            padding: "0 14px",
            borderRadius: theme.radius.chip,
            background: `${color}1A`,
            color,
            fontFamily: theme.typography.mono,
            fontSize: theme.typography.sizes.label,
            fontWeight: theme.typography.weights.bold,
            letterSpacing: 0,
            marginBottom: theme.spacing.sm,
          }}
        >
          {tag}
        </div>
        <AdaptiveText
          text={title}
          baseSize={42}
          minSize={32}
          lineHeight={1.1}
          maxCharsAtBase={18}
          style={{
            fontFamily: theme.typography.display,
            fontWeight: theme.typography.weights.heavy,
          }}
        >
          {title}
        </AdaptiveText>
        <AdaptiveText
          text={body}
          baseSize={theme.typography.sizes.popupBody}
          minSize={21}
          lineHeight={1.3}
          maxCharsAtBase={44}
          style={{
            marginTop: theme.spacing.sm,
            color: theme.colors.muted,
            fontWeight: theme.typography.weights.medium,
          }}
        >
          {body}
        </AdaptiveText>
      </div>
    </PopupShell>
  );
};
