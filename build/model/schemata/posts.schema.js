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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_index_1 = require("../mysql.index");
var inversify_1 = require("inversify");
var sequelize = require("sequelize");
var PostsSchema = /** @class */ (function () {
    function PostsSchema(mysqlcon) {
        this.mysqlcon = mysqlcon;
        this.PostsSchema = this.mysqlcon.getSequelize()
            .define('Posts', {
            id: {
                type: sequelize.BIGINT(20),
                primaryKey: true,
                autoIncrement: true
            },
            contents: {
                type: sequelize.TEXT,
                allowNull: true
            },
            active: {
                type: sequelize.BOOLEAN,
                allowNull: false
            },
            extra: {
                type: sequelize.TEXT,
                allowNull: true,
            },
            created_at: {
                type: sequelize.TIME,
                allowNull: true
            },
            updated_at: {
                type: sequelize.TIME,
                allowNull: true
            }
        }, {
            tableName: 'posts',
            timestamps: false,
        });
        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
    PostsSchema.prototype.getSchema = function () {
        return this.PostsSchema;
    };
    PostsSchema = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject((mysql_index_1.MysqlConnection.name))),
        __metadata("design:paramtypes", [mysql_index_1.MysqlConnection])
    ], PostsSchema);
    return PostsSchema;
}());
exports.PostsSchema = PostsSchema;
