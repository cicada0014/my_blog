import { injectable, inject } from "inversify";
// import * as passport from 'passport';
// import * as passportFacebook from 'passport-facebook';
import * as express from 'express';
import { NextFunction, Request, Response, Router } from "express";
import * as JWT from 'jsonwebtoken';
import * as path from 'path';
// import { FacebookService } from "./facebook.service";
@injectable()
export class Auth {
    private successRedirect: string;
    private failurRedirect: string;



    constructor(
        @inject((MysqlAuthDAO.name)) private authDAO: MysqlAuthDAO,
        @inject((FacebookService.name)) private facebookService: FacebookService

    ) {
    };


    garaJWT() {
        return new Promise((resolve, reject) => {
            JWT.sign(
                {
                    id: 'kim',
                    admin: 12323,
                    name: 'youngt111ae',
                    time: new Date().getTime()

                },
                new Buffer('dev', 'base64').toString(),
                {
                    expiresIn: process.env.NODE_ENV == 'guest' ? '365d' : 20,
                },
                (err, token) => {
                    if (err) reject(err)
                    resolve(token)
                })
        })
    }



    generateJWT(userFacebookAccountId, admin, userName) {
        console.log("token gen")
        return new Promise((resolve, reject) => {
            JWT.sign(
                {
                    id: userFacebookAccountId,
                    admin: admin,
                    name: userName,
                    time: new Date().getTime()

                },
                new Buffer(process.env.JSON_WEB_TOKEN_SECRET + '', 'base64').toString(),
                {
                    expiresIn: '2d',
                },
                (err, token) => {
                    if (err) reject(err)
                    resolve(token)
                })
        })
    }

    // 가라인증입니다.
    gara(app: express.Application) {
        app.get('/logout', (req, res, next) => {
            res.setHeader('Set-Cookie', `token=logout;Max-Age=360000;Path=/;HttpOnly;`)
            res.send({ message: 'ok' });
        })


        app.use((req: any, res, next) => {
            const token = req.cookies.token
            if (!token) {
                console.log("토큰 없음!")
                this.garaJWT().then(token => {
                    res.setHeader('Set-Cookie', `token=${token};Max-Age=21474836;Path=/;HttpOnly`)
                    next()
                })
                return
            }
            new Promise((resolve, reject) => {
                JWT.verify(token, new Buffer('dev', 'base64').toString(), (err, decoded) => {
                    if (err) reject(err)
                    resolve(decoded)
                })
            })
                .then((decoded: any) => {
                    req.decoded = decoded
                    next()
                })
                .catch((err) => {
                    if (err.name == 'TokenExpiredError') {
                        console.log("토큰 기한 만료!")
                        this.garaJWT().then(token => {
                            res.setHeader('Set-Cookie', `token=${token};Max-Age=21474836;Path=/;HttpOnly`)
                            next()
                        })
                    } else {
                        console.log("잘못된 토큰!")
                        this.garaJWT().then(token => {
                            res.setHeader('Set-Cookie', `token=${token};Max-Age=21474836;Path=/;HttpOnly`)
                            next()
                        })
                    }
                })
        })
    };





    init(app: express.Application) {

        app.get('/auth/facebook', (req, res, next) => {


            if (req.session && req.query.location) {
                req.session['location'] = req.query.location;
            }
            this.facebookService.loginDialog(res, <string>process.env.FACEBOOK_ID, <string>process.env.FACEBOOK_CALLBACK_URL);
        })




        app.get('/auth/facebook/callback', (req, res, next) => {
            let code = req.query.code;
            this.facebookService
                .getUserInfo(<string>process.env.FACEBOOK_ID, <string>process.env.FACEBOOK_CALLBACK_URL, <string>process.env.FACEBOOK_SECRET, code)
                .then((info: any) => {

                    this.authDAO.getAuthWithFaceBook('facebook', JSON.parse(info).id)
                        .then((result: any) => {
                            if (result.length === 1) {
                                console.log(((result[0]).name) + "connected ! ");
                                this.generateJWT(JSON.parse(info).id, result[0].admin, (result[0]).name)
                                    .then((token) => {
                                        if (req.session && req.session['location']) {
                                            res.setHeader('Set-Cookie', `token=${token};Max-Age=21474836;Path=/;HttpOnly;`)
                                            res.redirect(`/#${req.session['location']}`);
                                        } else {
                                            res.setHeader('Set-Cookie', `token=${token};Max-Age=21474836;Path=/;HttpOnly`)
                                            res.sendFile(path.join(__dirname, '..', `webapp/index.html`))
                                        }
                                    })

                            } else if (result.length < 1) {
                                console.log("로그인상 문제가 있음 조건에 맞는 유저가 없음");
                                res.send({ message: "해당 되는 유저를 찾을 수 없음 , 관리자에게 문의 요망! " });
                            } else {
                                console.log("유저중복! ")
                                res.send({ message: "유저가 중복되었음 , 관리자에게 문의 요망! " })
                            }
                        })
                        .catch(err => {
                            console.log(err)
                            res.send(500)
                        });
                })

        })


        app.get('/logout', (req, res, next) => {
            res.setHeader('Set-Cookie', `token=logout;Max-Age=360000;Path=/;HttpOnly;`)
            res.send({ message: 'ok' });
        })





        app.use((req: any, res, next) => {
            const token = req.cookies.token
            if (!token) {
                console.log("토큰 없음!")
                return res.status(401).json({
                    success: false,
                    message: 'not logged in'
                })
            }
            new Promise((resolve, reject) => {
                JWT.verify(token, new Buffer(process.env.JSON_WEB_TOKEN_SECRET + '', 'base64').toString(), (err, decoded) => {
                    if (err) reject(err)
                    resolve(decoded)
                })
            })
                .then((decoded: any) => {
                    req.decoded = decoded
                    console.log(req.decoded.name + 'query!')
                    next();
                })
                .catch((err) => {
                    if (err.name == 'TokenExpiredError') {
                        console.log("토큰 기한 만료!")
                        res.status(406).send(err)
                    } else {
                        console.log("잘못된 토큰!")
                        res.status(401).send(err)
                    }
                })
        })
    };



}




    // init(authProvider: string, app: express.Application) {


    //     if (authProvider === 'facebook') {
    //         let options: passportFacebook.StrategyOption;
    //         options = {
    //             clientID: <string>process.env.FACEBOOK_ID,
    //             clientSecret: <string>process.env.FACEBOOK_SECRET,
    //             callbackURL: <string>process.env.FACEBOOK_CALLBACK_URL,
    //         }
    //         let strategy: passport.Strategy = new passportFacebook.Strategy(options, (accessToken, refreshToken, profile, done) => {
    //             console.log("whatthe")
    //             // 여기서의 user.id 는 페이스북에서 제공하는 account id 이다. 
    //             this.authDAO.getAuthWithFaceBook(authProvider, profile.id)
    //                 .then((result: any) => {
    //                     console.log("토큰생성 확인중")
    //                     if (result.length === 1) {
    //                         // if (1 === 1) {
    //                         let user: any = profile;
    //                         console.log(((result[0]).name) + "connected ! ");
    //                         // this.generateJWT(profile.id, result.admin)
    //                         this.generateJWT(profile.id, result[0].admin, (result[0]).name)
    //                             .then((token) => {
    //                                 console.log("토큰생성 확인중11")
    //                                 user.token = token
    //                                 return done(null, user);
    //                             })

    //                     } else if (result.length < 1) {
    //                         console.log("로그인상 문제가 있음 조건에 맞는 유저가 없음");
    //                         return done("해당 되는 유저를 찾을 수 없음 , 관리자에게 문의 요망! ", null);
    //                     } else {
    //                         console.log("유저중복! ")
    //                         return done("유저가 중복되었음 , 관리자에게 문의 요망! ", null);
    //                     }
    //                 })
    //                 .catch(err => console.log(err));
    //             // done을 안해주면 다음 단계로 넘어가질 못한다. 
    //         });
    //         passport.use(strategy);
    //     };
    //     // analytics-staging.terkdiprtv.ap-northeast-2.elasticbeanstalk.com 
    //     // passport가 세션에 passport의 이름으로 저장하는 값을 의미한다. user id만 저장.
    //     passport.serializeUser((user: any, done) => {
    //         done(null, authProvider + " : " + user.id);
    //     });
    //     // //passport가 세션에서 가져온 값을 첫번째 매개변수에 전달한다. 
    //     passport.deserializeUser((id, done) => {
    //         done(null, id);
    //     });
    //     app.use(passport.initialize());
    //     app.use(passport.session());
    //     // passport.authenticate를 통해 facebook oauth에 요청한다.
    //     // (로그인이 안되어있다면 로그인페이지를 보여주며, 로그인 결과를 지정된 callback url로 redirect한다)

    //     app.get('/auth/facebook1', (req: any, res, next) => {
    //         console.log('ttt')
    //     });

    //     app.get('/auth/facebook', (req: any, res, next) => {
    //         console.log("comin?")
    //         if (req.query.location) {
    //             req.session['location'] = req.query.location;
    //             next();
    //         } else {
    //             next();
    //         }
    //     }, passport.authenticate(authProvider, { session: false }));


    //     app.get(
    //         '/auth/facebook/callback',
    //         passport.authenticate(authProvider, {
    //             failureRedirect: '/',
    //             session: false
    //         }),
    //         (req: any, res, next) => {
    //             let token = req.user.token
    //             console.log("로그인 성공!")
    //             if (req.session['location']) {
    //                 res.setHeader('Set-Cookie', `token=${token};Max-Age=21474836;Path=/;HttpOnly;`)
    //                 res.redirect(`/#${req.session['location']}`);
    //             } else {
    //                 res.setHeader('Set-Cookie', `token=${token};Max-Age=21474836;Path=/;HttpOnly`)
    //                 res.sendFile(path.join(__dirname, '..', `webapp/index.html`))
    //             }

    //         }
    //     );


    //     app.use((req: any, res, next) => {
    //         const token = req.cookies.token
    //         if (!token) {
    //             console.log("토큰 없음!")
    //             return res.status(401).json({
    //                 success: false,
    //                 message: 'not logged in'
    //             })
    //         }
    //         new Promise((resolve, reject) => {
    //             JWT.verify(token, new Buffer(process.env.JSON_WEB_TOKEN_SECRET + '', 'base64').toString(), (err, decoded) => {
    //                 if (err) reject(err)
    //                 resolve(decoded)
    //             })
    //         })
    //             .then((decoded: any) => {
    //                 req.decoded = decoded
    //                 console.log(req.decoded.name + 'query!')
    //                 next();
    //             })
    //             .catch((err) => {
    //                 if (err.name == 'TokenExpiredError') {
    //                     console.log("토큰 기한 만료!")
    //                     res.status(406).send(err)
    //                 } else {
    //                     console.log("잘못된 토큰!")
    //                     res.status(401).send(err)
    //                 }
    //             })
    //     })
    // };

