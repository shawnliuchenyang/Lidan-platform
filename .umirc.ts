import { IConfig } from 'umi-types';
// ref: https://umijs.org/config/
const config: IConfig =  {
  treeShaking: true,
  history: 'hash',
  routes: [
    {
      path: '/login',
      title: '登录页',
      component: './login',
    },
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        {
          path: '/',
          redirect: './login'
        },

        { path: '/center', component: '../pages/Center' },
        { path: '/schedule', component: '../pages/Schedule' },
        { path: '/staff', component: '../pages/Staff' },
        { path: '/auth', component: '../pages/Auth' },
        { path: '/eassy', component: '../pages/Eassy' },
        { path: '/activity', component: '../pages/Activity' },
        { path: '/staff/detail', component: '../pages/StaffDetail' },
        { path: '/activity/detail', component: '../pages/ActivityDetail' },
      ]
    }
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'saving-card',
      dll: false,
      
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
  theme: {
    "@primary-blue": "#1f77f3",
    "@white": "#fff",
    "@black": "#000",
    "@shadow-gray": "#b3bdc5",
    "@normal-gray": "#687C8A",
    "@dark-gray": "#425B6D",
    "@background-gray": "#f5f7f7",
    "@uibot-blue": "#2249c0",
    "@red":"#ff3e27",
    "@green":"#00845f"
  },
}

export default config;
