import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // 통합 박스 lumir-sar-platform로 묶이기 전 개별 슬러그 → 통합 페이지 anchor로 영구 redirect
      // (locale-prefixed routes both)
      {
        source: "/:locale(ko|en)/projects/sar-data-retrieval",
        destination: "/:locale/projects/lumir-sar-platform#sar-data-retrieval",
        permanent: true,
      },
      {
        source: "/:locale(ko|en)/projects/lumir-linux-snap",
        destination: "/:locale/projects/lumir-sar-platform#lumir-linux-snap",
        permanent: true,
      },
      {
        source: "/:locale(ko|en)/projects/sar-search-and-analyzer",
        destination: "/:locale/projects/lumir-sar-platform#sar-search-and-analyzer",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
