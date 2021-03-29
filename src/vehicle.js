/**
 * @author     Maurice van der Star <mauserrifle@gmail.com>
 * @copyright  (c) 2013 Maurice van der Star
 * @license    http://opensource.org/licenses/ISC
*/

export class Vehicle {

    _name;
    _type;
    _carClass;
    _cup;
    _number;
    _ballast = 0;
    _restrictor = 0;
    _skin;

    setName(name) {
        this._name = name;
        return this;
    }

    getName() {
        return this._name;
    }

    setType(type) {
        this._type = type;
        return this;
    }

    getType() {
        return this._type;
    }

    setClass(carClass) {
        this._carClass = carClass;
        return this;
    }

    getClass() {
        return this._carClass;
    }

    setCup(cup) {
        this._cup = cup;
        return this;
    }

    getCup() {
        return this._cup;
    }

    setNumber(number) {
        this._number = number;
        return this;
    }

    getNumber()  {
        return this._number;
    }

    setBallast(ballast) {
        this._ballast = ballast;
        return this;
    }

    getBallast()  {
        return this._ballast;
    }

    setRestrictor(restrictor) {
        this._restrictor = restrictor;
        return this;
    }

    getRestrictor()  {
        return this._restrictor;
    }

    setSkin(skin) {
        this._skin = skin;
        return this;
    }

    getSkin() {
        return this._skin;
    }

    getFriendlyName() {
        return this.getName();
    }
}
