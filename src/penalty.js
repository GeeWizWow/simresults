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
    _lap;
    _servedLap;
    _served;
    _reason;
    _penalty;

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

    setLap(lap) {
        this._lap = lap;
        return this;
    }

    getLap() {
        return this.lap;
    }

    setServedLap(lap) {
        this._servedLap = lap;
        return this;
    }

    getServedLap() {
        return this._servedLap;
    }

    setServed(served) {
        this._served = served;
        return this;
    }

    isServed() {
        return this._served;
    }

    setReason(reason) {
        this._reason = reason;
        return this;
    }

    getReason() {
        return this._reason;
    }

    setPenalty(penalty) {
        this._penalty = penalty;
        return this;
    }

    getPenalty() {
        return this._penalty;
    }
}

