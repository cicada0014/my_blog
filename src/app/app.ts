import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import * as express from 'express';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import { ApplicaionContainer } from './app.container';
const spdy = require('spdy');
import * as Raven from 'raven'
// import * as Http2 from 'http2';
import * as fs from 'fs'
import * as os from 'os';

import * as swaggerJSDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
export class MyblogServer {


    private PORT: any = process.env.PORT || 3004;
    public app: express.Application;
    private appContainer: ApplicaionContainer;
    private server: InversifyExpressServer;
    private prodServer;

    constructor() {

        this.appContainer = new ApplicaionContainer();
        this.server = new InversifyExpressServer(this.appContainer);
        this.server.setConfig((app) => {
            this.onMountingMiddleWare(app);
        });


        if (process.env.NODE_ENV == 'prod') {
            Raven.config(`https://bb0c867a7228453d986949f3dd82f485:${process.env.SENTRY_SECRET}@sentry.io/285549`).install();
        }



        if (process.env.NODE_ENV == 'prod' || process.env.NODE_ENV == 'staging') {
            this.server.setErrorConfig((app) => {
                app.use(Raven.errorHandler());
            });
        }




        this.app = this.server.build();
        // Http2.createSecureServer().listen(this.PORT, () => {
        //     console.log(`Listening at http://localhost:${this.PORT}/`);
        // })
        // const options = {
        //     key: fs.readFileSync(__dirname + '/dev_cert/server.key'),
        //     cert: fs.readFileSync(__dirname + '/dev_cert/server.crt'),
        //     ca: fs.readFileSync(__dirname + '/dev_cert/server.csr'),
        //     NPNProtocols: ['spdy/2', 'http/1.1'],
        //     // push: awesome_push
        // }
        // this.prodServer = spdy.createServer(options, this.app).listen(this.PORT, () => {
        //     console.log(process.env.NODE_ENV + ' mode deploy with spdy')
        //     console.log(`Listening at http://${this.getServerIp()}:${this.PORT}/`);
        // });


        this.app.listen(this.PORT, () => {
            console.log(`Listening at http://localhost:${this.PORT}/`);
        });


    }

    // 서버 설정 및 사용할 미들웨어 등록



    public onMountingMiddleWare(app: express.Application) {

        app.use(bodyParser.json());

        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());

        app.use(session({
            secret: 'may the force be with you',
            resave: false,
            saveUninitialized: true,
            cookie: {
                secure: false,
                maxAge: 1000 * 60 * 60 * 24
            }
        }));
        //보안을 위한 헬멧 라이브러리 사용 response http header 설정 
        // defulat로 적용된 방어 내용
        // 플래쉬 컨텐츠 방어, X-Powered-by header (서버의 정보 예를들어 몇버전의 어떤 서버인지를 알려주는 정보임) 를 없앰 , 
        // HSTS support(이 서버는 HTTPS로만 사용하는 사이트임을 브라우저에게 알리는 헤더) , Clickjacking 방어, XSS 방어 
        // 외부 사이트에서 iframe 내부에 이 사이트 사용 불가 
        app.use(helmet());
        app.use(morgan('combined'));

        if (!(process.env.NODE_ENV == 'dev')) {
            app.all('/*', (req: express.Request, res: express.Response, next) => {
                // X-Forwarded 헤더는 요청의 근원지를 파악한다.
                if ((!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) {
                    res.redirect('https://' + req.hostname);
                } else {
                    next();
                }
            });

        }


        const options = {
            swaggerDefinition: {
                info: {
                    title: 'Youngtae\'s Blog Server API Document', // Title (required)
                    version: '1.0.0', // Version (required)
                    schems: ['http', 'https']
                },
            },
            apis: [__dirname + '/controller/*'], // JSDOC이 실행될 패스값 지정 
        };
        let swaggerSpec = swaggerJSDoc(options);

        app.get('/api-docs.json', function (req, res) {
            res.setHeader('Content-Type', 'application/json');
            res.send(swaggerSpec);
        });
        
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



    };
    private getServerIp() {
        let interfaces = os.networkInterfaces();
        var result = '';
        for (var dev in interfaces) {
            var alias = 0;
            interfaces[dev].forEach(function (details) {
                if (details.family == 'IPv4' && details.internal === false) {
                    result = details.address;
                    ++alias;
                }
            });
        }

        return result;
    }



    // 서버시작
    public static bootstrap(): MyblogServer {
        return new MyblogServer();
    };
};

MyblogServer.bootstrap();