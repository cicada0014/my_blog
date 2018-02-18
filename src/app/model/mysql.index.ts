import { inject, injectable } from 'inversify';
import { DataTypeInteger, Sequelize } from 'sequelize'
import * as sequelize from 'sequelize';
import * as Mysql from 'mysql2';
import * as Promise from 'bluebird'

@injectable()
export class MysqlConnection {
    // 일반 커넥션은 Promise가 아니라서 따로 Promise를 처리해주어야 합니다.
    // sequelize가 쓰고 있는 bluebird 라이브러리를 맞춰줍니다.
    private pool: Mysql.IPool
    private sequelize;
    // private readonlySequelize: Sequelize
    // private devDB: Sequelize
    // public getPool() {
    //     return this.pool;
    // }

    // public getReadOnlySequelize() {
    //     return this.readonlySequelize;
    // }

    public getSequelize(): Sequelize {
        return this.sequelize;
    }

    // public getDevDB() {
    //     return this.devDB;
    // }




    constructor() {
        if (process.env.NODE_ENV == 'dev') {
            this.sequelize = new sequelize('blogdb', 'root', "fordbrladudgns2!", { host: "localhost", omitNull: false ,dialect:'mysql'});
            // this.readonlySequelize = new sequelize('blogdb', 'root', "", { host: "localhost", omitNull: false });

            // 요고는 헤로쿠로 올렸던 디비 중에 하나야 ,그런데 aws랑 연동이 되어있나부다! 로컬에서 접속가능함.
            // this.devDB = new sequelize('yy6o2c5jyswhi0mb', 'ob1c6gxljstxrfuz', 'iqrvrv6wqri9iusy', { host: 'p1us8ottbqwio8hv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com', dialect: 'mysql', omitNull: false });
        } else if (process.env.NODE_ENV == 'prod') {
            console.log("db env =" + process.env.NODE_ENV)
            this.sequelize = new sequelize('forcetellerdev', <string>process.env.MYSQL_REPLICA_USER, <string>process.env.MYSQL_DEV_PW, { host: process.env.MYSQL_DEV_HOST, omitNull: false ,dialect:'mysql'});

        }
    };


};


