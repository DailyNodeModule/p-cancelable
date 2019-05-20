const request = require('request');
const PCancelable = require('p-cancelable');

function makeRequest(url) {
    return new PCancelable((resolve, reject, onCancel) => {
        const req = request({ url });
 
        req.on('error', (err) => {
            console.log(`request ${url}: failed, ${err.message}`);
            reject(err);
        });

        req.on('complete', (res, body) => {
            console.log(`request ${url}: complete`);
            resolve(res, body);
        });

        onCancel(() => {
            console.log(`request ${url}: canceled`);
            req.end();
        });
    });
}

let promise;

(async () => {
    console.log('downloading')
    promise = makeRequest('https://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_1080p_h264.mov');
    try { 
        await promise;
        console.log('download succeeded');
    } catch (err) {
        console.log(`download failed: ${err.message}`);
    } finally {
        process.exit();
    }
})();

setTimeout(() => {
    console.log('canceling');
    promise.cancel();
}, 2500);