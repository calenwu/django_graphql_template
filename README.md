A template for Django with Graphql where the user has no username. Postgres, Allauth.

If you want add fields to display in the edit profile page, you need to modify 
`Query.resolve_user_setting` in `user.schema.py` 

These provider strings must match the ones from allauth `/nextjs/utils/const.ts`
const PROVIDER_GOOGLE = 'google';
const PROVIDER_TWITTER = 'twitter';

Please create a `.env`  and `.env_dev` file in the root directory with the variables in `.env_example`.


Customize tailwind colors in `tailwind.config.js` and `styles/globals.css`

Change these in `settings.py` for you email templates:
EMAIL_PRIMARY_COLOR
EMAIL_PRIMARY_TEXT_COLOR
EMAIL_SECONDARY_COLOR
EMAIL_SECONDARY_TEXT_COLOR
EMAIL_LOGO_URL