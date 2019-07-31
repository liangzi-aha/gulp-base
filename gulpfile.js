var gulp = require('gulp'); //引入gulp打包模块
var concat = require('gulp-concat'); //合并文件
var uglify = require('gulp-uglify');//压缩js文件
var rename = require('gulp-rename');//修改名称
var less = require('gulp-less');//less转css
var cssClean = require('gulp-clean-css');//压缩css
var htmlMin = require('gulp-htmlmin');//压缩html
var imageMin = require("gulp-imagemin"); //压缩img
var connect = require('gulp-connect'); //启动服务器实现热更新
var clean = require('gulp-clean');  //清除打包目录文件
var fs = require('fs');

var cssSrc = 'src/css/**/*.css',
    jsSrc = 'src/js/**/*.js',
    imgSrc = 'src/img/**/*.{png,jpg,gif,ico}',
    lessSrc = 'src/less/**/*.less',
    htmlSrc = 'src/page/**/*.html'

// 注册清除文件夹任务，如果存在去清除。
gulp.task('clean', function (done) {
    if (fs.existsSync('dist') == true){
        return gulp.src('dist', { read: false })
            .pipe(clean());
    }else{
        done() //返回异步任务（表示已完成）
    }
});

// 压缩图片
gulp.task("img", function () {
    return gulp.src(imgSrc)
        .pipe(
            imageMin({
                optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
                progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
                interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
                multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
            })
        )
        .pipe(gulp.dest("dist/img"))
        .pipe(connect.reload());
});

// 压缩html任务
gulp.task('html', function () {
    return gulp.src(htmlSrc)
        .pipe(htmlMin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist/page'))
        .pipe(connect.reload());
})

// 注册合并压缩js的任务
gulp.task('js', function () {
    return gulp.src(jsSrc) //找到目标源文件，将数据读取到gulp的内存中
        .pipe(concat('build.js'))//临时合并文件  参数合并之后文件名称
        .pipe(gulp.dest('dist/js'))//输出文件到本地
        .pipe(uglify()) //压缩文件
        // .pipe(rename('buid.min.js')) //修改名称
        .pipe(rename({ suffix: '.min' })) //修改后缀
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload());
})

// 注册转换less的任务
gulp.task('less', function () {
    return gulp.src(lessSrc)
        .pipe(less()) //less转css
        .pipe(gulp.dest('src/css'))//输出地址
        .pipe(connect.reload());
})

// 注册合并压缩css文件 gulp.series('a', 'b', 'c')
gulp.task('css', gulp.series('less', function () {
    return gulp.src(cssSrc)
        .pipe(concat('build.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssClean({ compatibility: 'ie8' }))
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());
}))

// 注册默认任务  gulp.parallel 异步打包，gulp.series同步
gulp.task('default', gulp.parallel('js', 'css', 'html', 'img'))

// 注册监视任务
gulp.task('watch', gulp.series('clean','default',function (done) {
    // 确认监听的目标以及绑定相应的任务
    gulp.watch(jsSrc, gulp.parallel('js'));
    gulp.watch(cssSrc, gulp.parallel('css'));
    gulp.watch(imgSrc, gulp.parallel('img'));
    gulp.watch(htmlSrc, gulp.parallel('html'));
    done();
}))

// 使用gulp-connect服务启动任务
gulp.task('server', gulp.series('clean','default',function(done){
    connect.server({
        root: 'dist', //根目录
        port:5000, //端口号
        livereload: true, //实时刷新
    })

    gulp.watch(jsSrc, gulp.parallel('js'));
    gulp.watch(cssSrc, gulp.parallel('css'));
    gulp.watch(imgSrc, gulp.parallel('img'));
    gulp.watch(htmlSrc, gulp.parallel('html'));
    done();
}))