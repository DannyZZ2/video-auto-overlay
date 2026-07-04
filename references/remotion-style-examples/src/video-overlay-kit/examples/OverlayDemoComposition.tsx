import {AbsoluteFill, Sequence} from "remotion";
import {
  CalloutLabel,
  KeyPointPopup,
  ProcessPopup,
  QuotePopup,
  SkillDropPopup,
  StatPopup,
  VideoBackdrop,
} from "../components";
import {theme} from "../theme";

export const OverlayDemoComposition = () => {
  return (
    <AbsoluteFill style={{backgroundColor: theme.colors.paper}}>
      <VideoBackdrop title="AI AUTO EDIT / OVERLAY TEST" />

      <Sequence from={18} durationInFrames={96} layout="none">
        <KeyPointPopup
          label="AI GENERATED"
          title="口播剪辑 + 上方动画，全部由 AI 自动生成"
          body="重点信息用短弹窗出现，不打断原视频节奏。"
          position="top-right"
          visibleFrames={96}
          accent="teal"
        />
      </Sequence>

      <Sequence from={92} durationInFrames={76} layout="none">
        <CalloutLabel
          text="OVERLAY EFFECT"
          position="top-left"
          accent="blue"
          visibleFrames={76}
        />
      </Sequence>

      <Sequence from={128} durationInFrames={128} layout="none">
        <ProcessPopup
          label="ITERATION"
          title="从复刻不稳定，到完整方案"
          position="center-right"
          accent="amber"
          visibleFrames={128}
          steps={[
            {
              label: "01",
              title: "先复刻一个片段",
              detail: "效果差强人意，说明单点模仿不够稳定。",
            },
            {
              label: "02",
              title: "连续调整几天",
              detail: "把剪辑、口播、弹窗节奏拆成可控模块。",
            },
            {
              label: "03",
              title: "整理成完整方案",
              detail: "让下一条视频可以复用同一套流程。",
            },
          ]}
        />
      </Sequence>

      <Sequence from={252} durationInFrames={86} layout="none">
        <StatPopup
          label="RESULT"
          value="1 套"
          detail="从口播剪辑到动画 overlay 的自动生成方案"
          position="top-right"
          accent="blue"
          visibleFrames={86}
        />
      </Sequence>

      <Sequence from={322} durationInFrames={108} layout="none">
        <QuotePopup
          quote="我已经把这一整套方案整理成了一个 skill。"
          source="口播结尾重点"
          position="bottom-left"
          accent="teal"
          visibleFrames={108}
        />
      </Sequence>

      <Sequence from={358} durationInFrames={92} layout="none">
        <SkillDropPopup
          title="方案已放在评论区"
          body="作为 skill 复用：剪辑、文案、弹窗节奏都能自动生成。"
          position="bottom-right"
          accent="teal"
          visibleFrames={92}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
