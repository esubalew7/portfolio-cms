# Fix Network Error in MERN Portfolio - Progress Tracker

## Approved Plan Steps:
- [x] Create TODO.md
- [x] 1. Update client/.env with VITE_API_URL instructions
- [x] 2. Update client/src/utils/api.js (increase timeout to 30s)
- [x] 3. Update server/app.js (CORS with specific origins + root health route)
- [x] 4. Update client/src/context/ProjectContext.jsx (add retry logic + better error handling)
- [x] 5. Update client/src/pages/Projects.jsx (user-friendly messages + manual retry button)
- [ ] 6. Test locally (dev servers)
- [ ] 7. Deploy & verify

**URLs used:**
- Frontend: https://portfolio-mern-one-rho.vercel.app  
- Backend: https://portfolio-backend-gxhv.onrender.com

## COMPLETED ✅

All code changes implemented:
- ✅ API timeout increased to 30s
- ✅ Secure CORS + / health endpoint
- ✅ Auto-retry (3x with backoff) on network errors
- ✅ User-friendly messages + manual retry button
- ✅ Proper .env setup

**Test locally:**
```
# Terminal 1 (backend)
cd server
npm start

# Terminal 2 (frontend)  
cd client
npm run dev
```

Visit http://localhost:5173/projects - should auto-recover from backend restarts.

**Deploy:** `git add . && git commit -m "fix: resolve network error with retry + better UX" && git push`

**Vercel:** Set Environment Variable `VITE_API_URL=https://portfolio-backend-gxhv.onrender.com`

Network Error fixed! 🚀
