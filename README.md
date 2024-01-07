A template for Django with Graphql where the user has no username. Postgres, Allauth.

If you want add fields to display in the edit profile page, you need to modify 
`Query.resolve_user_setting` in `user.schema.py` 

These provider strings must match the ones from allauth `/nextjs/utils/const.ts`
const PROVIDER_GOOGLE = 'google';
const PROVIDER_TWITTER = 'twitter';