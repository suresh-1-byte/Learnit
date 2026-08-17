# Quick Reference Card

## 🚀 Instant Access

**Development Server:** http://localhost:3001/

**Test Accounts:**
- Mentor: `mentor@test.com` / `Test@123`
- Student: `student@test.com` / `Test@123`

---

## 📝 Quick Commands

```bash
# Start server
npm run dev

# Create test accounts
npm run setup-accounts

# Build production
npm run build
```

---

## ✅ Phase 1 Status: COMPLETE

**What Works:**
- ✅ Firebase Authentication
- ✅ Login/Logout
- ✅ Session Persistence
- ✅ Role-Based Access
- ✅ User Profiles

**Expected Behavior:**
- Dashboard shows zeros (normal - no data yet)
- Can log in and out
- Session survives refresh
- Roles are enforced

---

## 🎯 What to Test

1. **Login:** mentor@test.com → Dashboard loads
2. **Refresh:** Press F5 → Still logged in
3. **Logout:** Click logout → Back to login
4. **Invalid:** Wrong password → Error shows
5. **Student:** student@test.com → Student dashboard

---

## 📁 Key Files

```
src/
├── config/firebase.ts           # Firebase config
├── contexts/AuthContext.tsx     # Auth state
├── components/Auth/
│   ├── MentorLogin.tsx
│   └── StudentLogin.tsx

.env                             # Your credentials
```

---

## 🐛 Quick Fixes

**Login fails?**
1. Check `.env` exists
2. Restart server: `npm run dev`
3. Check F12 Console for errors

**Profile not found?**
```bash
npm run setup-accounts
```

**Dashboard empty?**
- This is normal! No data created yet.
- Phase 2 will add real data.

---

## 📚 Documentation

| Doc | Purpose |
|-----|---------|
| `QUICK_START.md` | Setup guide |
| `TESTING_GUIDE.md` | Test checklist |
| `README_FIREBASE.md` | Complete summary |
| `FIREBASE_SETUP.md` | Firebase config |

---

## 🔥 Firebase Console

**Project:** learnit-c7e54

**Quick Links:**
- [Firebase Console](https://console.firebase.google.com/)
- [Authentication Users](https://console.firebase.google.com/project/learnit-c7e54/authentication/users)
- [Firestore Database](https://console.firebase.google.com/project/learnit-c7e54/firestore)
- [Storage](https://console.firebase.google.com/project/learnit-c7e54/storage)

---

## 🎯 Next Phase

**Phase 2: Mentor Dashboard**
- Connect real Firestore data
- Create classes collection
- Add students collection
- Show real counts
- CRUD operations

---

## ✨ Quick Status Check

**Authentication:** ✅ Working  
**Mentor Login:** ✅ Ready  
**Student Login:** ✅ Ready  
**Dashboard:** ✅ Loads (empty)  
**Session:** ✅ Persists  
**Security:** ✅ Role-based  

**Ready for Phase 2!** 🚀
