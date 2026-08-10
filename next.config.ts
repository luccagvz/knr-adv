import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/quemsomos", destination: "/quem-somos", permanent: true },
      { source: "/quemsomos/", destination: "/quem-somos", permanent: true },
      { source: "/area-atuacao", destination: "/areas-de-atuacao", permanent: true },
      { source: "/area-atuacao/", destination: "/areas-de-atuacao", permanent: true },
      { source: "/socios/", destination: "/socios", permanent: true },
      { source: "/clientes/", destination: "/clientes", permanent: true },
      {
        source: "/noticias-listagem",
        destination: "/insights",
        permanent: true,
      },
      {
        source: "/noticias-listagem/",
        destination: "/insights",
        permanent: true,
      },
      { source: "/contato/", destination: "/contato", permanent: true },
    ];
  },
};

export default nextConfig;
