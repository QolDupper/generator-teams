// Copyright (c) Wictor Wilén. All rights reserved.
// Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import GulpClient from "gulp";
import replace from "gulp-token-replace";
import inject from "gulp-inject";
import { trackEvent } from ".";

export const injectSources = (gulp: GulpClient.Gulp, config: any) => () => {
    trackEvent("static:inject");
    const htmlFiles = [
        "./src/public/**/*.html",
        "./src/public/**/*.ejs"
    ];
    const injectSourceFiles = [
        "./dist/web/scripts/**/*.js",
        "./dist/web/styles/**/*.css"
    ];
    const injectSrc = gulp.src(config.injectSources ? injectSourceFiles.concat(config.injectSources) : injectSourceFiles);

    const injectOptions = {
        relative: false,
        ignorePath: "dist/web",
        addRootSlash: true
    };
    return gulp.src(config.htmlFiles ? htmlFiles.concat(config.htmlFiles) : htmlFiles)
        .pipe(replace({
            tokens: {
                ...process.env
            }
        }))
        .pipe(
            inject(injectSrc, injectOptions)
        )
        .pipe(
            gulp.dest("./dist/web")
        );

};

export const webTasks = (gulp: GulpClient.Gulp, config: any) => {
    const staticFiles = [
        "./src/public/**/*.html",
        "./src/public/**/*.ejs",
        "./src/public/assets/**/*"
    ];

    gulp.task("static:inject", injectSources(gulp, config));

    gulp.task("static:copy", () => {
        trackEvent("static:copy");
        return gulp.src(config.staticFiles ? staticFiles.concat(config.staticFiles) : staticFiles, {
            base: "./src/public"
        })
            .pipe(
                gulp.dest("./dist/web")
            );
    });

};
