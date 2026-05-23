import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // 통합 박스 lumir-sar-platform로 묶이기 전 개별 슬러그 → 통합 페이지 anchor로 영구 redirect
      {
        source: "/projects/sar-data-retrieval",
        destination: "/projects/lumir-sar-platform#sar-data-retrieval",
        permanent: true,
      },
      {
        source: "/projects/lumir-linux-snap",
        destination: "/projects/lumir-sar-platform#lumir-linux-snap",
        permanent: true,
      },
      {
        source: "/projects/sar-search-and-analyzer",
        destination: "/projects/lumir-sar-platform#sar-search-and-analyzer",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
