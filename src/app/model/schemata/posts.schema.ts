import { MysqlConnection } from '../mysql.index';
import { injectable, inject } from "inversify";



import * as sequelize from 'sequelize';



@injectable()
export class PostsSchema {


    private PostsSchema: PostsModel;
    public getSchema() {
        return this.PostsSchema;
    }
    constructor(
        @inject((MysqlConnection.name)) protected mysqlcon: MysqlConnection
    ) {
        this.PostsSchema = this.mysqlcon.getSequelize()
            .define<PostsInstance, PostsAttribute>('Posts', {
                id: {
                    type: sequelize.BIGINT(20),
                    primaryKey: true,
                    autoIncrement: true
                },
                title: {
                    type: sequelize.STRING(100),
                    allowNull: false
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
            },
                {
                    tableName: 'posts',
                    timestamps: false,
                })

        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
}

export interface PostsAttribute {
    id?: number;
    title?: string;
    contents?: string;
    extra?: string;
    active?: boolean;
    created_at?: any;
    updated_at?: any;
}
export interface PostsInstance extends sequelize.Instance<PostsAttribute>, PostsAttribute {
}
export interface PostsModel extends sequelize.Model<PostsInstance, PostsAttribute> { }