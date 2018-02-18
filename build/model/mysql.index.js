"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var sequelize = require("sequelize");
var MysqlConnection = /** @class */ (function () {
    // public getDevDB() {
    //     return this.devDB;
    // }
    function MysqlConnection() {
        if (process.env.NODE_ENV == 'dev') {
            this.sequelize = new sequelize('blogdb', 'root', "fordbrladudgns2!", { host: "localhost", omitNull: false, dialect: 'mysql' });
            // this.readonlySequelize = new sequelize('blogdb', 'root', "", { host: "localhost", omitNull: false });
            // 요고는 헤로쿠로 올렸던 디비 중에 하나야 ,그런데 aws랑 연동이 되어있나부다! 로컬에서 접속가능함.
            // this.devDB = new sequelize('yy6o2c5jyswhi0mb', 'ob1c6gxljstxrfuz', 'iqrvrv6wqri9iusy', { host: 'p1us8ottbqwio8hv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com', dialect: 'mysql', omitNull: false });
        }
        else if (process.env.NODE_ENV == 'prod') {
            console.log("db env =" + process.env.NODE_ENV);
            this.sequelize = new sequelize('forcetellerdev', process.env.MYSQL_REPLICA_USER, process.env.MYSQL_DEV_PW, { host: process.env.MYSQL_DEV_HOST, omitNull: false, dialect: 'mysql' });
        }
    }
    // private readonlySequelize: Sequelize
    // private devDB: Sequelize
    // public getPool() {
    //     return this.pool;
    // }
    // public getReadOnlySequelize() {
    //     return this.readonlySequelize;
    // }
    MysqlConnection.prototype.getSequelize = function () {
        return this.sequelize;
    };
    ;
    MysqlConnection = __decorate([
        inversify_1.injectable(),
        __metadata("design:paramtypes", [])
    ], MysqlConnection);
    return MysqlConnection;
}());
exports.MysqlConnection = MysqlConnection;
;
