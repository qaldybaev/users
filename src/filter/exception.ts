import { ArgumentsHost, ExceptionFilter, ExecutionContext, HttpException } from "@nestjs/common";


export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const req = ctx.getRequest()
        const res = ctx.getResponse()


        res.status(exception.getStatus()).send({
            eror: exception.name,
            status: exception.getStatus(),
            message: exception.message,
            path: req.url,
            timestamp: new Date().toISOString()

        })
    }

}
