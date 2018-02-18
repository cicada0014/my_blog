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
var inversify_express_utils_1 = require("inversify-express-utils");
var posts_dao_1 = require("../model/dao/posts.dao");
// @injectable()
// 새로운 컨트롤러 데코레이터에 인젝터블이 포함되어있는 것 같다.
/**
* @swagger
* tags:
*   name: PostController
*   description: 해당 포스트를 넣을 수 있습니다.
*/
var PostController = /** @class */ (function () {
    function PostController(postDAO) {
        this.postDAO = postDAO;
    }
    /**
    * @swagger
    * /api/post/:id:
    *   get:
    *     summary: 포스트 가져오기
    *     description: 아이디를 통해 포스트를 가져옵니다.
    *     tags: [PostController]
    *     produces:
    *       - application/json
    *     responses:
    *       200:
    *         description:
    *            result = {}"
    */
    PostController.prototype.getPostById = function (req, res, next) {
        this.postDAO.getPostById(req.query.id).then(function (r) {
            res.send(r);
        }).catch(function (e) {
            next(e);
        });
    };
    /**
    * @swagger
    * /api/post/:id:
    *   get:
    *     summary: 포스트 가져오기
    *     description: 아이디를 통해 포스트를 가져옵니다.
    *     tags: [PostController]
    *     produces:
    *       - application/json
    *     responses:
    *       200:
    *         description:
    *            result = {}"
    */
    PostController.prototype.posting = function (req, res, next) {
        console.log(req.body);
        return this.postDAO.insertPost(req.body)
            .then(function (r) {
            return r;
        })
            .catch(function (e) {
            next(e);
        });
    };
    __decorate([
        inversify_express_utils_1.httpGet('/:id'),
        __param(0, inversify_express_utils_1.request()), __param(1, inversify_express_utils_1.response()), __param(2, inversify_express_utils_1.next()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", void 0)
    ], PostController.prototype, "getPostById", null);
    __decorate([
        inversify_express_utils_1.httpPost('/posting'),
        __param(0, inversify_express_utils_1.request()), __param(1, inversify_express_utils_1.response()), __param(2, inversify_express_utils_1.next()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", void 0)
    ], PostController.prototype, "posting", null);
    PostController = __decorate([
        inversify_express_utils_1.controller('/api/post'),
        __param(0, inversify_1.inject(posts_dao_1.PostDAO.name)),
        __metadata("design:paramtypes", [posts_dao_1.PostDAO])
    ], PostController);
    return PostController;
}());
exports.PostController = PostController;
