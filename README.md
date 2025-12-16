# Flip Kilas Balik 2025

Year-end recap web application for Flip users.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Deployment

### Option 1: Vercel (Recommended)
1. Push your code to GitHub (make sure `.env` is in `.gitignore`)
2. Import project to Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

### Option 2: Netlify
1. Push your code to GitHub
2. Import project to Netlify
3. Add environment variables in Netlify dashboard
4. Set build command: `npm run build`
5. Set publish directory: `dist`

### Option 3: Any Static Host
1. Run `npm run build`
2. Upload the `dist` folder to your hosting provider

## Important Security Notes

⚠️ **NEVER commit the `.env` file to Git**
- The `.gitignore` file is already configured to exclude it
- Always add environment variables through your hosting platform's dashboard

⚠️ **Supabase Anon Key is Safe for Client-Side**
- The anon key is designed to be exposed in client-side code
- Actual security is enforced by Supabase Row Level Security (RLS) policies
- Make sure RLS is properly configured in your Supabase database

## Additional Security Measures

For extra security, configure these in your Supabase dashboard:

1. **Row Level Security (RLS)**: Enable RLS on your `yir-flip-2025` table
2. **Domain Restrictions**: Limit which domains can access your Supabase project
3. **Rate Limiting**: Configure rate limits to prevent abuse
