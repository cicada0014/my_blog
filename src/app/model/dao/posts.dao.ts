import { injectable, inject } from "inversify";
import * as Promise from 'bluebird'
import { MysqlConnection } from '../mysql.index';
import { PostsSchema, PostsInstance, PostsAttribute } from "../schemata/posts.schema";

@injectable()
export class PostDAO {
    // 메소드 자체가 promise

    // 멀티인젝션도 가능하다.
    constructor(
        @inject(PostsSchema.name) private postsSchema: PostsSchema
    ) {

    }

    public getPostById(id) {
        return this.postsSchema.getSchema().findById(id)
    }
    public getPostList() {
        return this.postsSchema.getSchema().findAll();
    }
    public insertPost(post: PostsAttribute) {
        return this.postsSchema.getSchema().create(post)
    }
    public updatePost(post: PostsAttribute) {
        return this.postsSchema.getSchema().update(post, { where: { id: <number>post.id } })
    }




}

