var gulp = require('gulp');
var concat = require('gulp-concat'); //合并文件
var uglify = require('gulp-uglify');//压缩js文件
var rename = require('gulp-rename');//修改名称
var less = require('gulp-less');//less转css
var cssClean = require('gulp-clean-css');//压缩css
var htmlMin = require('gulp-htmlmin');//压缩html
var imageMin = require("gulp-imagemin"); //压缩img
var cached = require("gulp-cached"); //只传递更改过的文件，减少编译时间   避免修改一部分全局编译

var cssSrc = 'src/css/**/*.css',
    jsSrc = 'src/js/**/*.js',
    imgSrc = 'src/img/**/*.{png,jpg,gif,ico}',
    lessSrc = 'src/less/**/*.less',
    htmlSrc = 'src/page/**/*.html'


// 压缩图片
gulp.task("img", function () {
    return gulp.src(imgSrc)
        .pipe(cached('img'))
        .pipe(
            imageMin({
                optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
                progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
                interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
                multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
            })
        )
        .pipe(gulp.dest("dist/img"));
});

// 压缩html任务
gulp.task('html', function () {
    return gulp.src(htmlSrc)
        .pipe(cached('html'))
        .pipe(htmlMin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist/page'))
})

// 注册合并压缩js的任务
gulp.task('js', function () {
    return gulp.src(jsSrc) //找到目标源文件，将数据读取到gulp的内存中
        .pipe(cached('js'))
        .pipe(concat('build.js'))//临时合并文件  参数合并之后文件名称
        .pipe(gulp.dest('dist/js'))//输出文件到本地
        .pipe(uglify()) //压缩文件
        // .pipe(rename('build.min.js')) //修改名称
        .pipe(rename({ suffix: '.min' })) //修改后缀
        .pipe(gulp.dest('dist/js'))
})

// 注册转换less的任务
gulp.task('less', function () {
    return gulp.src(lessSrc)
        .pipe(cached('less'))
        .pipe(less()) //less转css
        .pipe(gulp.dest('src/css'))//输出地址
})

// 注册合并压缩css文件 gulp.series('a', 'b', 'c')
gulp.task('css', gulp.series('less'), function () {
    return gulp.src(cssSrc)
        .pipe(cached('css'))
        .pipe(concat('build.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssClean({ compatibility: 'ie8' }))
        .pipe(gulp.dest('dist/css'))
})

// 注册监视任务
gulp.task('auto', function () {
    // 确认监听的目标以及绑定相应的任务
    gulp.watch('src/js/*.js', gulp.parallel('js'));
    gulp.watch('src/css/*.css', gulp.parallel('css'));
})

// 注册默认任务  gulp.parallel 异步打包，gulp.series同步
gulp.task('default', gulp.parallel('js', 'less', 'css', 'html','img', gulp.series('auto')))