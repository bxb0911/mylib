const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

class Promise { 
  constructor(executor) {
    console.log('my promise')
    this.status = PENDING
    this.value = null
    this.reason = null
    this.resolveCallbacks = []
    this.rejectCallbacks = []
    try {
      executor(this.resolve.bind(this), this.reject.bind(this))
    } catch (e) { 
      this.reject(e)
    }
  }

  resolve(value) { 
    if (this.status === PENDING) { 
      this.value = value
      this.status = RESOLVED
      this.resolveCallbacks.forEach(onResolved => { 
        onResolved()
      })
    }
  }

  reject(reason) { 
    if (this.status === PENDING) { 
      this.reason = reason
      this.status = REJECTED
      this.rejectCallbacks.forEach(onRejected => { 
        onRejected()
      })
    }
  }

  then(onFullfilled, onRejected) { 
    console.log('then 状态:',this.status)
    onFullfilled = typeof onFullfilled === 'function' ? onFullfilled : data => data
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err }
    let promise2 = new Promise((resolve, reject) => { 
      if (this.status === PENDING) { 
        this.resolveCallbacks.push(() => { 
          setTimeout(() => { 
            try {
              let x = onFullfilled(this.value)
              resolvePromise(x, promise2, resolve, reject)
            } catch (e) { 
              reject(e)
            }
          })
        })
        this.rejectCallbacks.push(() => { 
          setTimeout(() => { 
            try {
              let x = onRejected(this.reason)
              resolvePromise(x, promise2, resolve, reject)
            } catch (e) { 
              reject(e)
            }
          })
        })
      }

      if (this.status === RESOLVED) { 
        setTimeout(() => { 
          try {
            let x = onFullfilled(this.value)
            resolvePromise(x, promise2, resolve, reject)
          } catch (e) { 
            reject(e)
          }
        })
      }

      if (this.status === REJECTED) { 
        setTimeout(() => { 
          try {
            let x = onRejected(this.reason)
            resolvePromise(x, promise2, resolve, reject)
          } catch (e) { 
            reject(e)
          }
        })
      }
    })
    return promise2
  }
}

function resolvePromise(x, promise2, resolve, reject) { 
  if (x === promise2) { 
    return reject(new TypeError('Chaining cycle detected for promise!'))
  }
  if (x && (typeof x === 'object' || typeof x === 'function')) {
    let called
    try {
      let then = x.then
      if (typeof then === 'function') {
        then.call(x, value => { 
          if (called) return
          called = true
          resolvePromise(value, promise2, resolve, reject)
        }, reason => { 
          if (called) return
          called = true
          reject(reason)
        })
      } else {
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else { 
    resolve(x)
  }
}

Promise.deferred = function () {
  let deferred = {};
  deferred.promise = new Promise((resolve, reject) => { 
    deferred.resolve = resolve
    deferred.reject = reject
  })
  return deferred
}

let promisesAplusTests = require('promises-aplus-tests')
promisesAplusTests(Promise, err => { 
  console.log('测试用例失败', err)
})

/*
  Promise.resolve()
  Promise.reject()
  Promise.all([])
  Promise.race()
  Promise.allSettled()
  ...
*/

module.exports = Promise