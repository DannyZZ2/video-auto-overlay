import type {CSSProperties} from "react";
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {theme} from "../theme";

export const signalEase = Easing.bezier(...theme.motion.easing);

export const usePopupMotion = (
  visibleFrames: number,
  delay = 0,
  lift = 22,
): CSSProperties => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = frame - delay;

  const enter = spring({
    frame: local,
    fps,
    config: theme.motion.spring,
    durationInFrames: theme.motion.enter,
  });

  const exit = interpolate(
    frame,
    [Math.max(0, visibleFrames - theme.motion.exit), visibleFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: signalEase,
    },
  );

  const opacity = interpolate(local, [0, theme.motion.enter], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: signalEase,
  });

  return {
    opacity: opacity * exit,
    transform: `translate3d(0, ${(1 - enter) * lift + (1 - exit) * -12}px, 0) scale(${
      0.96 + enter * 0.04
    })`,
  };
};

export const useLineReveal = (delay = 0, duration = 12) => {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: signalEase,
  });
};
