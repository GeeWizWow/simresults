/**
 * @author     Maurice van der Star <mauserrifle@gmail.com>
 * @copyright  (c) 2013 Maurice van der Star
 * @license    http://opensource.org/licenses/ISC
*/

export const PenaltyType = {
    Unknown: 0,
    StopGo: 'stopgo',
    DriveThrough: 'drivethrough',
};

export class Penalty {

    _type = PenaltyType.Unknown;
    _message;
    _date;
    _elapsedSeconds;
    _participant;
    _served;

    setMessage(message) {
        this._message = message;
        return this;
    }

    getMessage() {
        return this._message;
    }

    setDate(date) {
        this._date = date;
        return this;
    }

    getDate() {
        return this._date;
    }

    setElapsedSeconds(seconds) {
        this._elapsedSeconds = seconds;
        return this;
    }

    getElapsedSeconds() {
        return this._elapsedSeconds;
    }

    setType(type) {
        this._type = type;
        return this;
    }

    getType() {
        return this._type;
    }

    setParticipant(participant) {
        this._participant = participant;
        return this;
    }

    getParticipant() {
        return this._participant;
    }

    setServed(served) {
        this._served = served;
        return this;
    }

    isServed() {
        return this._served;
    }
}

