import { Container } from 'inversify';
import { interfaces, TYPE } from 'inversify-express-utils';
import { PostController } from './controller/post.controller';

export class ApplicaionContainer extends Container {
    constructor() {
        super();
        // 와 그냥 컨테이너 안에 등록만 되어있어도 알아서 잡아간다? 
        // 컨트롤러만 그런듯>? 
        PostController

        this.bindService([
        ])

        this.bindComponentsInSingleton([
        ])

    }


    //  바인드를 할때 생성사함수를 지니고 있는 클래스임을 타입으로 명시해준다. 이때 return 값을 타입으로 지정할수가 있어서 
    // 필요한 타입으로 제한 할 수 있다. 즉 인터페이스단위로 묶어 낼수가 있다는 것.
    // private bindController(controllers: (new (...args) => {})[]) {
    //     // controllers.forEach((controller: any) => {
    //     //     // this.bind<interfaces.Controller>(TYPE.Controller).to(controller).inSingletonScope().whenTargetNamed(controller.SYMBOL)
    //     // })
    // }
    private bindService(services: (new () => {})[]) {
        services.forEach((service) => {
            this.bind((service.name)).to(service).inSingletonScope();
        });
    }
    private bindComponentsInSingleton(components: (new () => {})[]) {
        components.forEach((component) => {
            this.bind((component.name)).to(component).inSingletonScope()
        })
    }
    // private bindComponentsInTransient(components: (new (...args) => {})[]) {
    //     components.forEach((component) => {
    //         this.bind((component.name)).to(component).inTransientScope();
    //     })
    // }

    // private bindMiddleware() {
    //     this.applyMiddleware()
    // }
}


