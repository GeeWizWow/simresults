/**
 * @author     Maurice van der Star <mauserrifle@gmail.com>
 * @copyright  (c) 2013 Maurice van der Star
 * @license    http://opensource.org/licenses/ISC
*/

export class Chat {

    date;
    message;
    elapsedSeconds;

    setMessage(message) {
        this.message = message;
        return this;
    }

    getMessage() {
        return this.message;
    }

    setDate(date) {
        this.date = date;
        return this;
    }

    getDate() {
        return this.date;
    }

    setElapsedSeconds(seconds) {
        this.elapsedSeconds = seconds;
        return this;
    }

    getElapsedSeconds() {
        return this.elapsedSeconds;
    }
}
