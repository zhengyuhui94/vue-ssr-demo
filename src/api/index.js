/**
 * @description: 通过延时器模拟数据请求
 * @param isSuccess true 请求成功 false 请求失败
 */
export function fetchItem(isSuccess){
    return new Promise((resolve, reject) => {
        // 模拟接口请求
        setTimeout(() => {
            if(isSuccess){
                resolve('数据响应成功啦~');
            }else{
                reject('数据相应失败了');
            }
        }, 2000);
    });
}