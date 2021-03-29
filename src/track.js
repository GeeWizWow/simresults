/**
 * @author     Maurice van der Star <mauserrifle@gmail.com>
 * @copyright  (c) 2013 Maurice van der Star
 * @license    http://opensource.org/licenses/ISC
*/

export class Track {

    _venue;
    _course;
    _event;
    _length;

    setVenue(venue) {
        this._venue = venue;
        return this; 
    }

    getVenue() {
        return this._venue;
    }

    setCourse(course) {
        this._course = course;
        return this; 
    }

    getCourse() {
        return this._course;
    }

    setEvent(event) {
        this._event = event;
        return this; 
    }

    getEvent() {
        return this._event;
    }

    setLength(length) {
        this._length = length;
        return this; 
    }

    getLength() {
        return this._length;
    }

    getFriendlyName() {
        return this.getVenue();
    }
}