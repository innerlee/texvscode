const gulp = require('gulp');
const cp = require('child_process');
const path = require('path');
const mkpath = require('mkpath');
const fs = require('fs');
const cpFile = require('cp-file');

const filelist = [
    '.vscode/spellright.dict',
    '.vscode/settings.json',
    '.chktexrc',
    '.gitignore',
    'package.json',
    'mmstyles.sty',
    'gulpfile.js'
]

function isSubmoduleReady() {
    return fs.existsSync('sub_modules/texvscode')
}

gulp.task('MoveToSubmodule', function (cb) {
    for (const f of filelist) {
        console.log(`copying ${f}`)
        cpFile(f, path.join('sub_modules/texvscode', f)).then(() => {
            console.log(`done ${f}.`);
        });
    }
})

gulp.task('PullSubmodule', function (cb) {
    const options = {
        encoding: 'utf8',
        timeout: 10000,
        cwd: './sub_modules/texvscode',
        env: null
    };
    cp.exec('git pull origin master', options, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
})

gulp.task('InstallSubmodule', function (cb) {
    if (isSubmoduleReady()) {
        console.log('sub_modules/texvscode already exists!')
        return
    }
    mkpath('sub_modules', function (err) {
        if (err) throw err;
        console.log('Directory sub_modules created');
    })
    const options = {
        encoding: 'utf8',
        timeout: 10000,
        cwd: './sub_modules',
        env: null
    };
    cp.exec('git submodule add -b master https://github.com/innerlee/texvscode.git', options, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
})
