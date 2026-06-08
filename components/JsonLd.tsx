/**
 * JSON-LD 구조화 데이터를 <script type="application/ld+json"> 으로 주입.
 * Next.js 권장 방식 (node_modules/next/dist/docs/.../json-ld.md):
 *  - next/script 가 아닌 네이티브 <script> 사용 (실행 코드가 아닌 데이터).
 *  - JSON.stringify 결과의 '<' 를 < 로 치환해 XSS 주입 차단.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
