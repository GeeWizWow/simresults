/**
 * @author     Maurice van der Star <mauserrifle@gmail.com>
 * @copyright  (c) 2013 Maurice van der Star
 * @license    http://opensource.org/licenses/ISC
*/

export class Cut {

    _cutTime;
    _timeSkipped;
    _lap;
    _date;
    _elapsedSeconds;
    _elapsedSecondsInLap;

    setCutTime(cutTime) {
        this._cutTime = cutTime;
        return this;
    }

    getCutTime() {
        return this._cutTime;
    }


    setTimeSkipped(seconds) {
        this._timeSkipped = seconds;
        return this;
    }

    getTimeSkipped() {
        return this._timeSkipped;
    }

    setLap(lap) {
        this._lap = lap;
        return this;
    }

    getLap() {
        return this._lap;
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

    setElapsedSecondsInLap(seconds) {
        this._elapsedSecondsInLap = seconds;
        return this;
    }

    getElapsedSecondsInLap() {
        return this._elapsedSecondsInLap;
    }
}
