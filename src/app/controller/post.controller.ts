import { injectable, inject } from "inversify";
import { controller, request, response, httpGet, httpDelete, httpPatch, httpPost, next } from 'inversify-express-utils';
import { PostDAO } from "../model/dao/posts.dao";
// @injectable()
// 새로운 컨트롤러 데코레이터에 인젝터블이 포함되어있는 것 같다.


/**
* @swagger
* tags:
*   name: PostController
*   description: 해당 포스트를 넣을 수 있습니다.
*/
@controller('/api/post')
export class PostController {
    constructor(
        @inject(PostDAO.name) private postDAO: PostDAO
    ) {

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
    @httpGet('/list')
    public getPostList(@request() req, @response() res, @next() next) {
        return this.postDAO.getPostList().then(r => {
            return r
        }).catch(e => {
            next(e)
        })

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
    @httpGet('/:id')
    public async getPostById(@request() req, @response() res, @next() next) {
        return this.postDAO.getPostById(req.query.id).then(r => {
            return r
        }).catch(e => {
            next(e)
        })

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
    @httpPost('/posting')
    public posting(@request() req, @response() res, @next() next) {
        return this.postDAO.insertPost(req.body)
            .then(r => {
                return r
            })
            .catch(e => {
                next(e)
            })
    }



}


