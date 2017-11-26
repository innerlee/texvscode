const gulp = require('gulp');
const cp = require('child_process');
const path = require('path');
const mkpath = require('mkpath');
const fs = require('fs');
const cpFile = require('cp-file');

const filelist = [
    '.vscode/spellright.dict',
    '.vscode/settings.json',
    '.vscode/tasks.json',
    '.chktexrc',
    '.gitignore',
    'package.json',
    'mmstyles.sty',
    'gulpfile.js'
]

const execoptions = {
    encoding: 'utf8',
    timeout: 10000,
    cwd: './sub_modules/texvscode',
    env: null
};

function isSubmoduleReady() {
    return fs.existsSync('sub_modules/texvscode')
}

async function isProjectClean() {
    try {
        status = await new Promise(
            function (resolve, reject) {
                cp.exec('git status --porcelain --ignore-submodules',
                    function (err, stdout, stderr) {
                        resolve(stdout.trim());
                        reject(stderr);
                    });
            });
    } catch (error) {
        console.log(error);
        return false
    }
    if (status === '') {
        return true
    } else {
        console.log('repo status:')
        console.log(status)
        return false
    }
}

async function isSubmoduleClean() {
    try {
        status = await new Promise(
            function (resolve, reject) {
                cp.exec('git status --porcelain', execoptions,
                    function (err, stdout, stderr) {
                        resolve(stdout.trim());
                        reject(stderr);
                    });
            });
    } catch (error) {
        console.log(error);
        return false
    }
    if (status === '') {
        return true
    } else {
        console.log('submodule status:')
        console.log(status)
        return false
    }
}

gulp.task('ToSubmodule', async function (cb) {
    if (!await isSubmoduleClean()) {
        console.warn('submodule not clean, please first commit!')
        return
    }

    for (const f of filelist) {
        console.log(`copying ${f}`)
        cpFile(f, path.join('sub_modules/texvscode', f)).then(() => {
            console.log(`done ${f}.`);
        });
    }
})

gulp.task('FromSubmodule', async function (cb) {
    if (!await isProjectClean()) {
        console.warn('project not clean, please first commit!')
        return
    }

    for (const f of filelist) {
        console.log(`copying ${f}`)
        cpFile(path.join('sub_modules/texvscode', f), f).then(() => {
            console.log(`done ${f}.`);
        });
    }
})

gulp.task('PullSubmodule', function (cb) {
    cp.exec('git pull origin master', execoptions,
        function (err, stdout, stderr) {
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
        if (err) {
            console.log(err)
            throw err;
        }
        console.log('Directory sub_modules created');
        const options = {
            encoding: 'utf8',
            timeout: 10000,
            cwd: './sub_modules',
            env: null
        };
        cp.exec('git submodule add -b master https://github.com/innerlee/texvscode.git', options,
            function (err, stdout, stderr) {
                console.log(stdout);
                console.log(stderr);
                cb(err);
            });
    })
})

gulp.task('OpenSubmodule', function (cb) {
    cp.exec('start "" "sub_modules\\texvscode"');
})
