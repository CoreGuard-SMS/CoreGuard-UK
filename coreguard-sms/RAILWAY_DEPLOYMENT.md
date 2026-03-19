# Railway Deployment Guide - CoreGuard SMS

## 🚀 Railway Deployment Instructions

### **Prerequisites**

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Push your code to GitHub
3. **Supabase Project**: Set up your Supabase database
4. **Environment Variables**: Have all required keys ready

### **Step 1: Deploy to Railway**

1. **Connect Railway to GitHub**:
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Initialize project
   railway init
   ```

2. **Deploy the Application**:
   ```bash
   # Deploy to Railway
   railway up
   ```

### **Step 2: Configure Environment Variables**

In Railway dashboard, set these environment variables:

#### **Required Variables:**
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-app-name.railway.app

# Email Service
RESEND_API_KEY=your-resend-api-key

# Authentication
BETTER_AUTH_SECRET=your-32-character-secret
BETTER_AUTH_URL=https://your-app-name.railway.app
```

#### **Database Configuration:**
```bash
# Railway PostgreSQL (automatically set by Railway)
DATABASE_URL=postgresql://user:password@host:port/database
```

### **Step 3: Update Supabase Settings**

1. **Update CORS Settings** in Supabase:
   - Add your Railway URL to allowed origins
   - Example: `https://your-app-name.railway.app`

2. **Update Redirect URLs** in Supabase Auth:
   - Add: `https://your-app-name.railway.app/auth/callback`
   - Add: `https://your-app-name.railway.app`

### **Step 4: Run Database Migrations**

```bash
# Connect to your Railway database and run migrations
# Use the Supabase dashboard or CLI to run:
# - supabase/migrations/001_create_tables.sql
# - supabase/migrations/002_rls_policies.sql
# - supabase/migrations/003_seed_data.sql
# - supabase/migrations/004_forms_tables.sql
# - supabase/migrations/005_forms_rls_policies.sql
# - supabase/migrations/006_add_employee_hr_fields.sql
```

### **Step 5: Verify Deployment**

1. **Health Check**: Visit `https://your-app-name.railway.app/api/health`
2. **Test Registration**: Try registering a new company
3. **Test Login**: Verify authentication works
4. **Test Dashboard**: Check if data loads correctly

### **🔧 Railway Configuration**

The `railway.toml` file includes:

- **Auto-restart** on failures
- **Health checks** every 100 seconds
- **Environment variable** management
- **Production optimizations**

### **📊 Monitoring**

Railway provides:

- **Logs**: Real-time application logs
- **Metrics**: CPU, memory, and network usage
- **Health Status**: Application health monitoring
- **Deployments**: Version control and rollback

### **🔄 Continuous Deployment**

Automatic deployments are set up:

1. **Push to GitHub** → **Railway auto-deploys**
2. **Environment variables** are preserved
3. **Zero downtime** deployments
4. **Rollback** capability if needed

### **🛠️ Troubleshooting**

#### **Common Issues:**

1. **Database Connection Errors**:
   - Check `DATABASE_URL` is correct
   - Verify Supabase credentials
   - Ensure migrations are run

2. **Authentication Issues**:
   - Verify `BETTER_AUTH_SECRET` is set
   - Check redirect URLs in Supabase
   - Ensure CORS settings include Railway URL

3. **Build Failures**:
   - Check `package.json` dependencies
   - Verify all environment variables are set
   - Review Railway build logs

#### **Debug Commands:**
```bash
# View logs
railway logs

# Check environment variables
railway variables

# Restart application
railway restart
```

### **🔒 Security Notes**

- ✅ **Environment variables** are encrypted
- ✅ **HTTPS** is automatically enabled
- ✅ **Row Level Security** is enforced
- ✅ **Password hashing** is implemented
- ✅ **API validation** is in place

### **💡 Tips**

1. **Use Railway's free tier** for development
2. **Set up custom domain** for production
3. **Monitor logs** regularly
4. **Test thoroughly** before production
5. **Keep secrets secure** in Railway dashboard

### **📞 Support**

- **Railway Documentation**: [docs.railway.app](https://docs.railway.app)
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **CoreGuard Support**: Contact your development team

---

**Your CoreGuard SMS application is now ready for Railway deployment!** 🚀
