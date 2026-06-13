
import type {NextConfig} from 'next';
import webpack from 'webpack';

const nextConfig: NextConfig = {
  output: 'export', // Required for Capacitor to package static files
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Mock Node.js core modules that aren't available in the browser
      // This is essential for running Genkit/Gemini in a static webview
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        perf_hooks: false,
        dns: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        http2: false,
        async_hooks: false,
        dgram: false,
        process: false,
        util: false,
        buffer: false,
        events: false,
        readline: false,
        string_decoder: false,
        timers: false,
        console: false,
        vm: false,
        module: false,
      };

      // Handle the "node:" protocol used in modern Node.js packages
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource: any) => {
          resource.request = resource.request.replace(/^node:/, '');
        })
      );

      // Provide mocks for Global variables if needed
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      );
    }
    return config;
  },
};

export default nextConfig;
