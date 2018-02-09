import { injectable, inject } from "inversify";
import { controller, request, response, httpGet, httpDelete, httpPatch, httpPost } from 'inversify-express-utils';
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
    @httpGet('/:id')
    public async getCoupon( @request() req, @response() res) {


    }



}


