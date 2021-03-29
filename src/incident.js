/**
 * @author     Maurice van der Star <mauserrifle@gmail.com>
 * @copyright  (c) 2013 Maurice van der Star
 * @license    http://opensource.org/licenses/ISC
*/

export const IncidentType = {
    Unknown: 0,
    Car: 'car',
    Env: 'env',
    Other: 'other', 
};

export class Incident {

    _type = IncidentType.Unknown;
    _message;
    _date;
    _elapsedSeconds;
    _forReview;
    _participant;
    _otherParticipant;

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

    getElapsedSeconds()  {
        return this._elapsedSeconds;
    }

    setForReview(forReview) {
        this._forReview = forReview;
        return this;
    }

    isForReview() {
        return this._forReview;
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

    setOtherParticipant(participant) {
        this._otherParticipant = participant;
        return this;
    }

    getOtherParticipant() {
        return this._otherParticipant;
    }
}
