/**
 * @author     Maurice van der Star <mauserrifle@gmail.com>
 * @copyright  (c) 2013 Maurice van der Star
 * @license    http://opensource.org/licenses/ISC
*/

export class Driver {

    _name;
    _human = true;
    _driverId;

    setName(name) {
        this._name = name;
        return this;
    }

    getName(shortenLastName, shortenFirstName) {
        if (shortenLastName || shortenFirstName) {
            throw new Error('Not Implemented');
        }

        return this._name;
    }

    getNameWithAiMention() {
        const name = this.getName();
        return this._human ? name : `${name} (AI)`;
    }

    setHuman(human) {
        this._human = human;
        return this;
    }

    isHuman() {
        return this._human;
    }

    setDriverId(driverId) {
        this._driverId = driverId;
        return this;
    } 

    getDriverId() {
        return this._driverId;
    }
}
