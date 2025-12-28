// 导入koa
const Koa = require('koa')
// 实例化对象
const app = new Koa()
//导入路由
const Router =require('koa-router')
//导入koabody
const {koaBody} = require('koa-body')
//加密
const bcrypt = require('bcrypt')


app.use(koaBody())
const router =new Router()

router.get('/', ctx => {
    console.log(ctx.request.query);
    // 获取get请求传递的参数
    ctx.body = "首页" + ctx.request.query.page
})
router.get('/ai',ctx=>{
    ctx.body = 'ai页面'
})

router.post('/add',ctx=>{
    //在body中接收参数
    console.log(ctx.request.body);

    ctx.body = {
        code:200,
        msg:'成功',
        data:ctx.request.body
    }
})
//注册
router.post('/register',ctx=>{
    // 1.获取参数
    console.log(ctx.request.body);
    let {username,password} = ctx.request.body
    if(!username.trim()||!password.trim()) {
        ctx.body = {
            code:10010,
            msg:'缺少必要参数'
        }
        return
    }

    
    // 3.密码的加密
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password,salt);

    ctx.body = {
        msg:'注册成功',
        username,
        password:hash
    }


    // 2.存储信息（存储到项目，MySQL）
    
})
// router.put('/add',ctx=>{
//     ctx.body = {
//         code:200,
//         msg:'修改成功',
        
//     }
// })

app.use(router.routes())
app.use(router.allowedMethods())

console.log('热修改打印')

// app.use((ctx)=>{
//     console.log(ctx.url);
//     if(ctx.url=='/'){
//         ctx.body='首页'
//     }else if(ctx.url=='/ai'){
//         ctx.body='ai接口'
//     }
// })

// 编写中间件
// app.use((ctx,next)=>{
//     ctx.body = '你好koa1'
//     console.log('你好koa1')
//     // 执行下一个中间件
//     next()
// })
// app.use((ctx,next)=>{
//     ctx.body = '你好koa2'
//     console.log('你好koa2')
//     next()
// })
// app.use((ctx,next)=>{
//     ctx.body = '你好koa3'
//     console.log('你好koa3')
//     next()
// })
// app.use((ctx,next)=>{
//     ctx.body = '你好koa4'
//     console.log('你好koa4')
//     next()
// })
// 启动服务
app.listen(3000,()=>{
    console.log('服务已经启动地址是：http://localhost:3000');
    console.log('服务已经启动地址是：http://127.0.0.1:3000');
})
// 在终端中执行 node app.js 