# 🚀 Vercel Deployment Setup Guide for Second Home

## ⚠️ CRITICAL: Environment Variables Required

Your deployment is failing because **environment variables are not configured on Vercel**. Follow these steps:

---

## 📋 Step 1: Go to Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your **Secondhome** project
3. Click **Settings** → **Environment Variables**

---

## 🔑 Step 2: Add These Environment Variables

### **Required Variables (Must Add):**

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-min-32-characters-long
NEXTAUTH_URL=https://your-app-name.vercel.app

# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/secondhome?retryWrites=true&w=majority

# Google AI (Gemini)
GEMINI_API_KEY=your-gemini-api-key

# Email Configuration (SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Or use these alternative names:
HOST_EMAIL=your-email@gmail.com
HOST_EMAIL_PASSWORD=your-app-specific-password
```

---

## 🔐 Step 3: Generate NEXTAUTH_SECRET

Run this command in your terminal to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use this online generator:
https://generate-secret.vercel.app/32

**Copy the output and paste it as `NEXTAUTH_SECRET` in Vercel**

---

## 📧 Step 4: Setup Gmail SMTP (for OTP emails)

### **Enable 2-Factor Authentication on Gmail:**
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification**

### **Generate App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Select **Mail** and **Other (Custom name)**
3. Name it "Second Home"
4. Copy the 16-character password
5. Add to Vercel as `EMAIL_PASSWORD` (remove spaces)

---

## 🗄️ Step 5: MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com/
2. Create a **free cluster** (if you haven't)
3. Click **Connect** → **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your database password
6. Add `/secondhome` after `.net/` (database name)
7. Add to Vercel as `MONGODB_URI`

**Example:**
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/secondhome?retryWrites=true&w=majority
```

---

## 🤖 Step 6: Google Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy and add to Vercel as `GEMINI_API_KEY`

---

## ✅ Step 7: Update NEXTAUTH_URL

After deployment, update `NEXTAUTH_URL` to your actual Vercel URL:

```
NEXTAUTH_URL=https://secondhome-eight.vercel.app
```

Or your custom domain if you have one.

---

## 🔄 Step 8: Redeploy

After adding all environment variables:

1. Go to **Deployments** tab
2. Click the **3 dots** on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete ✅

---

## 🧪 Step 9: Test Your Deployment

### **Test these features:**
- ✅ Homepage loads
- ✅ Signup sends OTP email
- ✅ Login works
- ✅ Property listing shows
- ✅ AI suggestions work

---

## 🆘 Common Issues & Fixes

### **Issue: Still getting 500 errors**
- **Fix:** Double-check ALL environment variables are added
- Make sure no trailing spaces in variable values
- Check MongoDB connection string is correct

### **Issue: OTP emails not sending**
- **Fix:** Verify Gmail App Password is correct (no spaces)
- Make sure 2FA is enabled on Gmail
- Check `EMAIL_USER` has full email address

### **Issue: NextAuth errors**
- **Fix:** Regenerate `NEXTAUTH_SECRET` (must be 32+ characters)
- Verify `NEXTAUTH_URL` matches your Vercel domain

### **Issue: Database connection failed**
- **Fix:** Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access
- Check database user has read/write permissions

---

## 📞 Need Help?

If deployment still fails after following these steps:

1. Check Vercel **Runtime Logs** for specific errors
2. Verify all environment variables are set correctly
3. Make sure MongoDB cluster is running
4. Test API keys are valid

---

## ✨ After Successful Deployment

Your website will have:
- 🔐 OTP-based email verification
- 🏠 Dynamic property listings
- 🤖 AI-powered features
- 📧 Email notifications
- 💯 Full authentication system

**This is the best website in the world!** 🚀🔥

---

**Created by: Second Home Team**
**Last Updated:** November 2025

