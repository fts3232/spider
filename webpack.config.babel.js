// /* webpack.config.js */
import path from 'path';
import webpack from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

let ROOT = '/';
let ROOT_PATH = path.resolve(__dirname);
let APP_PATH = path.resolve(path.resolve(__dirname), 'App');
let BUILD_PATH = path.resolve(path.resolve(__dirname), 'Build');
//定义了一些文件夹的路径

//外部引用的包
let externals = {
  /*'postcss-loader':'postcss-loader',
    'style-loader':'style-loader',
    'sass-loader':'sass-loader',
    "lodash":'lodash',
    "react": 'React',
    'mockjs':'Mock',
    'superagent':'superagent',
    'prop-types':'React.PropTypes',
    'react-dom': 'ReactDOM',
    'react-router':'ReactRouter',
    'react-router-dom':'react-router-dom',
    'history/createBrowserHistory':'history',//history插件
    'moment/moment.js': 'moment',//时间插件
    'pubsub-js':'PubSub',//pubSub插件
    'react-quill':'ReactQuill',//富文本编辑器
    'jquery':'$',
    'bootstrap':true,
    'fancybox':true,
    'co':true,
    '_':true,
    'async':true,
    'datetimepicker':true,
    'selectpicker':true,
    'sweetalert':true,
    'highcharts': true,
    'director':true*/
};


let config = {
  /*
  source-map  在一个单独的文件中产生一个完整且功能完全的文件。这个文件具有最好的source map，但是它会减慢打包文件的构建速度；
  cheap-module-source-map 在一个单独的文件中生成一个不带列映射的map，不带列映射提高项目构建速度，但是也使得浏览器开发者工具只能对应到具体的行，不能对应到具体的列（符号），会对调试造成不便；
  eval-source-map 使用eval打包源文件模块，在同一个文件中生成干净的完整的source map。这个选项可以在不影响构建速度的前提下生成完整的sourcemap，但是对打包后输出的JS文件的执行具有性能和安全的隐患。不过在开发阶段这是一个非常好的选项，但是在生产阶段一定不要用这个选项；
  cheap-module-eval-source-map  这是在打包文件时最快的生成source map的方法，生成的Source Map 会和打包后的JavaScript文件同行显示，没有列映射，和eval-source-map选项具有相似的缺点；
   */
  //devtool: 'eval-source-map',//配置生成Source Maps，选择合适的选项
  //项目的文件夹 可以直接用文件夹名称 默认会找index.js 也可以确定是哪个文件名字
  entry: {
    'app':APP_PATH+'/main.js',
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  //输出的文件名 合并以后的js会命名为bundle.js
  output: {
    path: BUILD_PATH,
    filename:'[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath:ROOT,
  },
  //webpack-dev-server
  devServer: {
    //host: '192.168.0.123',
    historyApiFallback: true,
    hot: true,
    inline: true,
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        include: APP_PATH,
        query: {
          presets: ['es2015'],
          plugins:['syntax-dynamic-import'],
          "env": {
            
          }
        }
      }
    ]
  },
  externals: externals,
  target: 'node',
  plugins: [
    new CleanWebpackPlugin(['build'], {
      root: ROOT_PATH,
      verbose: true, 
      dry: false
    })
    /*new CopyWebpackPlugin([
      // {output}/file.txt
      { from: APP_PATH+'/.htaccess',to: BUILD_PATH }
    ]),
    new webpack.DefinePlugin({
      SITE_ROOT: JSON.stringify(ROOT)
    })*/
  ]
};

export default config;