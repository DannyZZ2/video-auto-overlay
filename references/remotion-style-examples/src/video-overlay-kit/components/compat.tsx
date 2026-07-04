import type {CSSProperties, ReactNode} from "react";
import {theme} from "../theme";

type AdaptiveTextProps = {
  children: ReactNode;
  text?: string;
  baseSize: number;
  minSize?: number;
  lineHeight?: number;
  maxCharsAtBase?: number;
  style?: CSSProperties;
};

type AdaptiveSubtitleProps = {
  zh: string;
  en?: string;
  variant?: "floating" | "bar" | "plain";
  bottom?: number;
  maxWidth?: number;
  reserveHeight?: number;
  style?: CSSProperties;
};

export const safeTextStyle: CSSProperties = {
  overflowWrap: "break-word",
  wordBreak: "break-word",
  letterSpacing: 0,
};

export const adaptiveFontSize = (
  text: string,
  baseSize: number,
  minSize: number,
  maxCharsAtBase: number,
) => {
  const length = weightedTextLength(text);
  if (length <= maxCharsAtBase) return baseSize;

  const ratio = maxCharsAtBase / Math.max(length, 1);
  return Math.max(minSize, Math.round(baseSize * (0.82 + ratio * 0.18)));
};

export const AdaptiveText = ({
  children,
  text,
  baseSize,
  minSize = Math.round(baseSize * 0.78),
  lineHeight = 1.18,
  maxCharsAtBase = 22,
  style,
}: AdaptiveTextProps) => {
  const source = text ?? textFromNode(children);
  const fontSize = adaptiveFontSize(source, baseSize, minSize, maxCharsAtBase);

  return (
    <div
      style={{
        ...safeTextStyle,
        fontSize,
        lineHeight,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const AdaptiveBilingualSubtitle = ({
  zh,
  en,
  variant = "floating",
  bottom = 46,
  maxWidth = 1500,
  reserveHeight = 136,
  style,
}: AdaptiveSubtitleProps) => {
  const zhSize = adaptiveFontSize(zh, 42, 30, 34);
  const enSize = en ? adaptiveFontSize(en, 22, 16, 72) : 0;
  const isBar = variant === "bar";
  const background =
    variant === "plain"
      ? "transparent"
      : isBar
        ? "rgba(20, 22, 26, 0.84)"
        : "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.46))";

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        minHeight: reserveHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `0 ${theme.spacing.safeX}px ${bottom}px`,
        pointerEvents: "none",
        background,
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth,
          borderRadius: isBar ? 8 : 0,
          background: isBar ? "rgba(20, 22, 26, 0.78)" : "transparent",
          boxShadow: isBar ? "0 16px 42px rgba(20,22,26,0.18)" : "none",
          padding: isBar ? "13px 44px 14px" : 0,
          textAlign: "center",
          color: "#FFFFFF",
          fontFamily: theme.typography.body,
          textShadow: "0 4px 18px rgba(0,0,0,0.9), 0 0 3px rgba(0,0,0,0.9)",
        }}
      >
        <AdaptiveText
          text={zh}
          baseSize={zhSize}
          minSize={30}
          lineHeight={1.12}
          maxCharsAtBase={34}
          style={{
            fontWeight: theme.typography.weights.heavy,
          }}
        >
          {zh}
        </AdaptiveText>
        {en ? (
          <AdaptiveText
            text={en}
            baseSize={enSize}
            minSize={16}
            lineHeight={1.24}
            maxCharsAtBase={72}
            style={{
              marginTop: 7,
              fontWeight: theme.typography.weights.medium,
            }}
          >
            {en}
          </AdaptiveText>
        ) : null}
      </div>
    </div>
  );
};

const weightedTextLength = (text: string) => {
  let total = 0;
  for (const char of text) {
    total += /[\u4e00-\u9fff]/.test(char) ? 2 : 1;
  }
  return total;
};

const textFromNode = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textFromNode).join("");
  return "";
};
