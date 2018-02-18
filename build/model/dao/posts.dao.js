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
var inversify_1 = require("inversify");
var posts_schema_1 = require("../schemata/posts.schema");
var PostDAO = /** @class */ (function () {
    // 메소드 자체가 promise
    // 멀티인젝션도 가능하다.
    function PostDAO(postsSchema) {
        this.postsSchema = postsSchema;
    }
    PostDAO.prototype.getPostById = function (id) {
        return this.postsSchema.getSchema().findById(id);
    };
    PostDAO.prototype.getPostList = function () {
        return this.postsSchema.getSchema().findAll();
    };
    PostDAO.prototype.insertPost = function (post) {
        return this.postsSchema.getSchema().create(post);
    };
    PostDAO.prototype.updatePost = function (post) {
        return this.postsSchema.getSchema().update(post, { where: { id: post.id } });
    };
    PostDAO = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(posts_schema_1.PostsSchema.name)),
        __metadata("design:paramtypes", [posts_schema_1.PostsSchema])
    ], PostDAO);
    return PostDAO;
}());
exports.PostDAO = PostDAO;
