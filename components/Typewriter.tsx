"use client";

import { useEffect, useRef, useState } from "react";

interface TypewriterProps {
  /** 순환할 문구들 (현재 로케일로 이미 pick된 문자열 배열). */
  phrases: string[];
  /** 글자 입력 간격(ms). */
  typingSpeed?: number;
  /** 백스페이스 간격(ms). */
  deletingSpeed?: number;
  /** 완성 후 멈춤(ms). */
  holdTime?: number;
  className?: string;
}

/**
 * 키 입력처럼 한 글자씩 타이핑 → 잠시 멈춤 → 백스페이스로 지우고 다음 문구.
 * 깜빡이는 커서 포함. prefers-reduced-motion 이면 첫 문구를 정적으로 표시.
 * 접근성: 전체 문구를 sr-only로 노출하고 애니메이션 부분은 aria-hidden.
 */
export function Typewriter({
  phrases,
  typingSpeed = 95,
  deletingSpeed = 45,
  holdTime = 1700,
  className,
}: TypewriterProps) {
  const [display, setDisplay] = useState(phrases[0] ?? "");

  const phraseIndex = useRef(0);
  const charIndex = useRef(phrases[0]?.length ?? 0);
  const phase = useRef<"hold" | "deleting" | "typing">("hold");

  // display 는 phrases[0] 로 초기화되어 있다. 로케일이 바뀌면 부모가 key 로
  // remount 시키므로(아래 Hero), 여기서 동기 setState 로 리셋할 필요가 없다.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return; // 모션 최소화: 첫 문구를 정적으로 유지

    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = phrases[phraseIndex.current] ?? "";

      if (phase.current === "typing") {
        charIndex.current += 1;
        setDisplay(current.slice(0, charIndex.current));
        if (charIndex.current >= current.length) {
          phase.current = "hold";
          timeout = setTimeout(tick, holdTime);
        } else {
          timeout = setTimeout(tick, typingSpeed);
        }
      } else if (phase.current === "deleting") {
        charIndex.current -= 1;
        setDisplay(current.slice(0, Math.max(0, charIndex.current)));
        if (charIndex.current <= 0) {
          phase.current = "typing";
          phraseIndex.current = (phraseIndex.current + 1) % phrases.length;
          charIndex.current = 0;
          timeout = setTimeout(tick, typingSpeed);
        } else {
          timeout = setTimeout(tick, deletingSpeed);
        }
      } else {
        // hold → 지우기 시작
        phase.current = "deleting";
        timeout = setTimeout(tick, deletingSpeed);
      }
    };

    timeout = setTimeout(tick, holdTime);
    return () => clearTimeout(timeout);
  }, [phrases, typingSpeed, deletingSpeed, holdTime]);

  return (
    <span className={className}>
      <span className="sr-only">{phrases.join(", ")}</span>
      <span aria-hidden="true">
        {display}
        <span className="tw-cursor">│</span>
      </span>
    </span>
  );
}
