-- Reset data to allow creating a new master admin
TRUNCATE public.user_roles, public.profiles, public.companies, public.posts, public.comments, public.subscriptions, public.analytics, public.credit_transactions, public.user_credits RESTART IDENTITY CASCADE;
