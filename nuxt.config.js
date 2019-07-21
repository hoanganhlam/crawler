require('dotenv').config()

export default {
    mode: 'universal',
    /*
    ** Headers of the page
    */
    head: {
        title: process.env.npm_package_name || '',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: process.env.npm_package_description || ''}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
        ]
    },
    serverMiddleware: ['~/server/app.js'],
    /*
    ** Customize the progress-bar color
    */
    loading: {color: '#fff'},
    /*
    ** Global CSS
    */
    css: [
        'ant-design-vue/dist/antd.css',
        '@style/_app.scss'
    ],
    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        '@/plugins/antd-ui',
        {src: '@/plugins/font-component', ssr: false}
    ],
    /*
    ** Nuxt.js modules
    */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/auth',
    ],
    /*
    ** Axios module configuration
    ** See https://axios.nuxtjs.org/options
    */
    axios: {
        baseURL: process.env.API_DOMAIN + '/api'
    },
    auth: {
        strategies: {
            local: {
                endpoints: {
                    login: {
                        url: '/users/login/',
                        method: 'post',
                        propertyName: 'token',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    },
                    logout: {
                        method: 'post',
                        url: '/users/logout/'
                    },
                    user: {
                        url: '/users/me/',
                        method: 'get',
                        propertyName: ''
                    }
                },
                tokenRequired: true,
                tokenType: 'Bearer'
            },
            google: {
                client_id:
                    '1031942923634-j4m66uaj8toiphphkj2q8q0thkh9horu.apps.googleusercontent.com',
                redirect_uri: process.env.DOMAIN + '/member/callback'
            }
        },
        redirect: {
            login: '/login',
            logout: '/logout',
            callback: '/auth/callback',
            user: '/users/me'
        },
    },
    /*
    ** Build configuration
    */
    build: {
        /*
        ** You can extend webpack config here
        */
        extend(config, ctx) {
        }
    },
    env: {
        WS_URL: process.env.WS_URL || 'http://127.0.0.1:3001'
    }
}
