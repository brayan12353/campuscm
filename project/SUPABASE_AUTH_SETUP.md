# Supabase authentication setup

## Local application configuration

Copy `.env.example` to `.env.local` in the `project` directory and set:

- `VITE_SUPABASE_URL` to the project URL shown in Supabase.
- `VITE_SUPABASE_ANON_KEY` to that project's public anon/publishable key.

These `VITE_` values are included in the browser build. Never put a service-role key, database password, or other secret in either variable. Restart Vite after changing the environment file. If either value is absent or invalid, the app reports that authentication is not configured; it does not fall back to demo login.

## Google provider

1. In Supabase Dashboard, open **Authentication → Providers → Google** and enable Google sign-in.
2. Create or select OAuth credentials in Google Cloud Console. Add the callback URI shown by Supabase's Google provider settings as an authorized redirect URI in Google Cloud. Do not substitute the app's `/login` URL for Supabase's provider callback URI.
3. Enter the Google OAuth client ID and client secret in the Supabase provider settings. These credentials belong in the Supabase dashboard, not frontend source or Vite environment variables.
4. In Supabase **Authentication → URL Configuration**, set the Site URL to the deployed application origin. Add the local development callback `http://localhost:5173/login` and the production callback `https://<your-production-domain>/login` to the allowed redirect URLs. The app requests a return to `/login` on the current origin after Google sign-in.
5. For email/password registration and password recovery, keep the corresponding email provider and email delivery settings enabled. Registration confirmation links return to `/login`; password-reset links return to `/forgot-password?recovery=1`.

Use the actual project and deployment values from your own dashboards; no live URLs or OAuth credentials are included here.

## Profile data

This phase authenticates through Supabase Auth and does not read or write the `profiles` table. The application needs confirmation of the profile trigger behavior, read policies, and permitted role/status values before profile persistence or privileged-role display can be safely connected. No schema or policy changes are included.
