import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Bind the IPv4 wildcard explicitly. `host: true` can bind the IPv6
    // wildcard only ([::]), which some port forwarders don't probe and leads
    // to ERR_CONNECTION_REFUSED in the browser even though the server is up.
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
})
