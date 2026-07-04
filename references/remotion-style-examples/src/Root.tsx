import {Composition} from "remotion";
import {DarkDiagnosticHUDTest} from "./video-overlay-kit/examples/DarkDiagnosticHUDTest";
import {OverlayDemoComposition} from "./video-overlay-kit/examples/OverlayDemoComposition";
import {
  FrostedGlassComposition,
  PrecisionHUDComposition,
  TerminalAgentComposition,
} from "./video-overlay-kit/examples/StyleVariantCompositions";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="OverlayDemo"
        component={OverlayDemoComposition}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PrecisionHUD"
        component={PrecisionHUDComposition}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FrostedGlass"
        component={FrostedGlassComposition}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TerminalAgent"
        component={TerminalAgentComposition}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DarkDiagnosticHUDTest"
        component={DarkDiagnosticHUDTest}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
