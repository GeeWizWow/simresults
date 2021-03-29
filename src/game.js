/**
 * @author     Maurice van der Star <mauserrifle@gmail.com>
 * @copyright  (c) 2013 Maurice van der Star
 * @license    http://opensource.org/licenses/ISC
*/

export class Game {

    _name;
    _version;

    setName(name) {
        this._name = name;
        return this;
    }

    getName() {
        return this._name;
    }

    setVersion(version) {
        this._version = version;
        return this;
    }

    getVersion() {
        return this._version;
    }
}
