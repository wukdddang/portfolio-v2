import { Link } from "@/i18n/navigation";
import { pick } from "@/data/i18n";
import type { VisionItem } from "@/data/personal";
import type { Locale } from "@/i18n/routing";
import { Md } from "@/lib/markdown";

/**
 * 미래 비전 한 줄 렌더 — 평문(+인라인 마크다운)에 선택적 내비게이션 링크 하나를 끼운다.
 * item.link 가 있으면 로컬라이즈된 단어(link.ko/en)를 찾아 link.href 로 가는 링크로 치환.
 * 서버/클라이언트 양쪽에서 안전(훅 없음) — About(client)·resume(server) 공용.
 */
export function VisionText({ item, locale }: { item: VisionItem; locale: Locale }) {
  const text = pick(item, locale);
  const link = item.link;
  if (!link) return <Md>{text}</Md>;

  const word = pick(link, locale);
  const idx = text.indexOf(word);
  if (idx < 0) return <Md>{text}</Md>;

  const before = text.slice(0, idx);
  const after = text.slice(idx + word.length);
  return (
    <>
      {before && <Md>{before}</Md>}
      <Link
        href={link.href}
        className="font-medium text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-2 transition-colors hover:decoration-[var(--accent)]"
      >
        {word}
      </Link>
      {after && <Md>{after}</Md>}
    </>
  );
}
