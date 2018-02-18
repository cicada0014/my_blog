"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var post_controller_1 = require("./controller/post.controller");
var mysql_index_1 = require("./model/mysql.index");
var posts_schema_1 = require("./model/schemata/posts.schema");
var posts_dao_1 = require("./model/dao/posts.dao");
var ApplicaionContainer = /** @class */ (function (_super) {
    __extends(ApplicaionContainer, _super);
    function ApplicaionContainer() {
        var _this = _super.call(this) || this;
        // 와 그냥 컨테이너 안에 등록만 되어있어도 알아서 잡아간다?
        // 컨트롤러만 그런듯>?
        post_controller_1.PostController;
        _this.bindService([
            posts_schema_1.PostsSchema,
            posts_dao_1.PostDAO
        ]);
        _this.bindComponentsInSingleton([
            mysql_index_1.MysqlConnection,
        ]);
        return _this;
    }
    //  바인드를 할때 생성사함수를 지니고 있는 클래스임을 타입으로 명시해준다. 이때 return 값을 타입으로 지정할수가 있어서
    // 필요한 타입으로 제한 할 수 있다. 즉 인터페이스단위로 묶어 낼수가 있다는 것.
    // private bindController(controllers: (new (...args) => {})[]) {
    //     // controllers.forEach((controller: any) => {
    //     //     // this.bind<interfaces.Controller>(TYPE.Controller).to(controller).inSingletonScope().whenTargetNamed(controller.SYMBOL)
    //     // })
    // }
    ApplicaionContainer.prototype.bindService = function (services) {
        var _this = this;
        services.forEach(function (service) {
            _this.bind((service.name)).to(service).inSingletonScope();
        });
    };
    ApplicaionContainer.prototype.bindComponentsInSingleton = function (components) {
        var _this = this;
        components.forEach(function (component) {
            _this.bind((component.name)).to(component).inSingletonScope();
        });
    };
    return ApplicaionContainer;
}(inversify_1.Container));
exports.ApplicaionContainer = ApplicaionContainer;
