/**
 * @author     Maurice van der Star <mauserrifle@gmail.com>
 * @copyright  (c) 2013 Maurice van der Star
 * @license    http://opensource.org/licenses/ISC
*/

export class Cache {

    _data = {};

    put (key, value) {
        this._data[key] = value;
    }

    get(key)  {
        return this._data[key];
    }

    forget(key) {
        delete this._data[key];
        return true;
    }

    flush() {
        this._data = {};
        return true;
    }

    cacheParentCall(methodName, method, args) {
        const cacheKey = `${methodName}_${args.join('_')}`;
        const cachedValue = this.get(cacheKey);

        if (cachedValue) {
            return cachedValue;
        }

        const value = method(...args);

        this.put(cacheKey, value);

        return value;
    }
}
