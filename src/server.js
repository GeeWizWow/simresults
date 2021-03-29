/**
 * @author     Maurice van der Star <mauserrifle@gmail.com>
 * @copyright  (c) 2013 Maurice van der Star
 * @license    http://opensource.org/licenses/ISC
*/

export class Server {

    _name;
    _motd;
    _dedicated;

    setName(name) {
        this._name = name;
        return this;
    }

    getName() {
        return this._name;
    }

    setMotd(motd) {
        this._motd = motd;
        return this;
    } 

    getMotd() {
        return this._motd;
    }

    setDedicated(dedicated) {
        this._dedicated = dedicated;
        return this;
    }

    isDedicated() {
        return this._dedicated;
    }
}
