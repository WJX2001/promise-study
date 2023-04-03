// 因为new Promise的时候 new Promise((resolve,reject) => {resolve('OK')})需要有一个实参,
// 所以在构造的时候需要给一个形参
function Promise(executor) {
    // 添加属性
    this.PromiseState = 'pending';
    this.PromiseResult = null;
    // 声明属性
    this.callbacks = []

    // 保存实例对象的this的值
    const self = this // self _this 
    // resolve 函数
    function resolve(data) {
        // 判断状态 使得promise的状态只能被修改一次
        if (self.PromiseState !== 'pending') return
        //1. 修改对象的状态 （promiseState）
        self.PromiseState = 'fullfilled'  // resolved
        //2. 设置对象结果值 （promiseResult）
        self.PromiseResult = data
        // 调用成功的回调函数
        // if(self.callback.onResolved){
        //     self.callback.onResolved(data)
        // }
        self.callbacks.forEach(item => {
            item.onResolved(data)
        })
    }
    // reject 函数
    function reject(data) {
        // 判断状态
        if (self.PromiseState !== 'pending') return
        //1. 修改对象的状态 （promiseState）
        self.PromiseState = 'rejected'  // rejected
        //2. 设置对象结果值 （promiseResult）
        self.PromiseResult = data
        // 执行失败的回调
        self.callbacks.forEach(item => {
            item.onRejected(data)
        })
    }
    try {
        // 同步调用「执行期函数」
        executor(resolve, reject)
    } catch (e) {
        // 修改 promise 对象的状态为失败
        reject(e)
    }
}
Promise.prototype.then = function (onResolved, onRejected) {
    return new Promise((resolve, reject) => {

        // 调用回调函数 PromiseState
        if (this.PromiseState === 'fullfilled') {
            try {
                // 获取回调函数的执行结果
                let result = onResolved(this.PromiseResult)
                // 判断 result 是否为Promise实例的对象
                if (result instanceof Promise) {
                    // 如果是Promise类型的对象
                    result.then(v => {
                        resolve(v)
                    }, r => {
                        reject(r)
                    })
                } else {
                    // 结果的对象状态为成功
                    resolve(result)

                }

            } catch (e) {
                reject(e)
            }
        }
        if (this.PromiseState === 'rejected') {
            onRejected(this.PromiseResult)
        }
        // 判断pending状态
        if (this.PromiseState === 'pending') {
            // 保存回调函数
            this.callbacks.push({
                onResolved: onResolved,
                onRejected: onRejected
            })
        }
    })
}