import 'dotenv/config';

export default ({ config }) => ({
    ...config,
    extra: {
        ...config.extra,
        BASE_URL: process.env.BASE_URL,
    },
});
