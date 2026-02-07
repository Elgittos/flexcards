# Development Server Access (IPv6 Conflict Fix)

## ⚠️ Important: Use IP Address, Not Localhost

This machine has IPv6 conflicts that prevent `localhost` from working properly. 
Always use IP addresses to access the development server.

## How to Access the App

When you run `npm run dev`, Vite will display multiple URLs:

```
➜  Local:   http://localhost:3000/     ❌ DON'T USE THIS (IPv6 conflict)
➜  Network: http://127.0.0.1:3000/     ✅ USE THIS ONE (verified working)
➜  Network: http://192.168.0.10:3000/  ✅ OR THIS ONE (also works)
➜  Network: http://100.71.4.146:3000/  ✅ ANY NETWORK ADDRESS WORKS
```

### ✅ Verified Working URLs:

1. **From this machine:** `http://127.0.0.1:3000/` ← **RECOMMENDED**
2. **From other devices on the network:** Use any of the Network IP addresses shown
3. **All network addresses have been tested and work correctly**

### How to Test:

Open your browser and navigate to: **http://127.0.0.1:3000/**

You should see the Reddit Client app with a styled interface.

## Configuration

The fix is already applied in `vite.config.js`:

```javascript
server: {
  host: '0.0.0.0',  // Binds to all network interfaces (IPv4)
  port: 3000,
  strictPort: false,  // Will use next available port if 3000 is busy
}
```

## Testing E2E (Playwright)

When Phase 10 adds Playwright tests, the configuration will use `http://127.0.0.1:3000` instead of `http://localhost:3000`.

## Troubleshooting

If you still can't access the app:
1. Check which port Vite is actually using (shown in terminal output)
2. Make sure your firewall allows the connection
3. Try the different Network IP addresses shown
4. Use `http://127.0.0.1:PORT` as the last resort
