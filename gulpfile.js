var gulp = require('gulp');
var concat = require('gulp-concat'); //合并文件
var uglify = require('gulp-uglify');//压缩js文件
var rename = require('gulp-rename');//修改名称
var less = require('gulp-less');//less转css
var cssClean = require('gulp-clean-css');//压缩css
var htmlMin = require('gulp-htmlmin');//压缩html
var liveReload = require('gulp-livereload'); //监听（热更新）

// 注册任务
// gulp.task('js',function(){
//     // 配置任务的操作
// })

// 压缩html任务
gulp.task('html',function(){
    return gulp.src('index.html')
    .pipe(htmlMin({collapseWhitespace:true}))
    .pipe(gulp.dest('dist/'))
})

// 注册合并压缩js的任务
gulp.task('js',function(){
    return gulp.src('src/js/*.js') //找到目标源文件，将数据读取到gulp的内存中
    .pipe(concat('build.js'))//临时合并文件  参数合并之后文件名称
    .pipe(gulp.dest('dist/js'))//输出文件到本地
    .pipe(uglify()) //压缩文件
    // .pipe(rename('build.min.js')) //修改名称
    .pipe(rename({suffix:'.min'})) //修改后缀
    .pipe(gulp.dest('dist/js'))
    .pipe(liveReload()) //事实刷新
})

// 注册转换less的任务
gulp.task('less',function(){
    return gulp.src('src/less/*.less')
    .pipe(less()) //less转css
    .pipe(gulp.dest('src/css'))//输出地址
    .pipe(liveReload()) //事实刷新
})

// 注册合并压缩css文件 gulp.series('a', 'b', 'c')
gulp.task('css',gulp.series('less'),function(){
    return gulp.src('src/css/*.css')
    .pipe(concat('build.css'))
    .pipe(rename({suffix:'.min'}))
    .pipe(cssClean({compatibility:'ie8'}))
    .pipe(gulp.dest('dist/css'))
    .pipe(liveReload()) //事实刷新
})

// 注册监视任务
gulp.task('watch',gulp.series('default',function(){
    // 开启监听
    liveReload.listen();
    // 确认监听的目标以及绑定相应的任务
    gulp.watch('src/js*.js',['js']);
    gulp.watch('src/css*.css','src/less/*.less',['css']);
}))

// 注册默认任务  gulp.parallel 异步打包，gulp.series同步
gulp.task('default',gulp.parallel(['js','less','css','html']))