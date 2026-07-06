import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Listen on all interfaces (dual-stack: serves both 127.0.0.1 and [::1],
    // plus the VM's network IP) so the port forwarder connects regardless of
    // which address family it probes. strictPort avoids silently moving ports.
    host: true,
    port: 5173,
    strictPort: true,
  },
})
