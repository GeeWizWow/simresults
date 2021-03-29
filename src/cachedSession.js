/**
 * @author     Maurice van der Star <mauserrifle@gmail.com>
 * @copyright  (c) 2013 Maurice van der Star
 * @license    http://opensource.org/licenses/ISC
*/

import { Cache } from './cache.js';
import { Session } from './session.js';

export class CachedSession extends Session {
    
    _cache;
    
    constructor(helper, cache) {
        super(helper);
        this._cache = cache || new Cache();
    }

    static createInstance() {
        return new CachedSession();
    }

    /** @inheritdoc */
    getLapsSortedByTime() {
        return this._cache.cacheParentCall('getLapsSortedByTime', super.getLapsSortedByTime.bind(this), [ ...arguments ]);
    }

    /** @inheritdoc */
    getLapsByLapNumberSortedByTime(lapNumber) {
        return this._cache.cacheParentCall('getLapsByLapNumberSortedByTime', super.getLapsByLapNumberSortedByTime.bind(this), [ ...arguments ]);
    }

    /** @inheritdoc */
    getBestLapByLapNumber(lapNumber) {
        return this._cache.cacheParentCall('getBestLapByLapNumber', super.getBestLapByLapNumber.bind(this), [ ...arguments ]);
    }

    /** @inheritdoc */
    getBestLapsGroupedByParticipant() {
        return this._cache.cacheParentCall('getBestLapsGroupedByParticipant', super.getBestLapsGroupedByParticipant.bind(this), [ ...arguments ]);
    }

    /** @inheritdoc */
    getLapsSortedBySector(sector) {
        return this._cache.cacheParentCall('getLapsSortedBySector', super.getLapsSortedBySector.bind(this), [ ...arguments ]);
    }

    /** @inheritdoc */
    getBestLapsBySectorGroupedByParticipant(sector) {
        return this._cache.cacheParentCall('getBestLapsBySectorGroupedByParticipant', super.getBestLapsBySectorGroupedByParticipant.bind(this), [ ...arguments ]);
    }

    /** @inheritdoc */
    getLapsSortedBySectorByLapNumber(sector, lapNumber) {
        return this._cache.cacheParentCall('getLapsSortedBySectorByLapNumber', super.getLapsSortedBySectorByLapNumber.bind(this), [ ...arguments ]);
    }

    /** @inheritdoc */
    getBestLapBySectorByLapNumber(sector, lapNumber) {
        return this._cache.cacheParentCall('getBestLapBySectorByLapNumber', super.getBestLapBySectorByLapNumber.bind(this), [ ...arguments ]);
    }

    /** @inheritdoc */
    getBadLaps(abovePercent = 107) {
        return this._cache.cacheParentCall('getBadLaps', super.getBadLaps.bind(this), [ ...arguments ]);
    }

    /** @inheritdoc */
    getLedMostParticipant() {
        return this._cache.cacheParentCall('getLedMostParticipant', super.getLedMostParticipant.bind(this), [ ...arguments ]);
    }

    /** @inheritdoc */
    getLeadingParticipant(lapNumber) {
        return this._cache.cacheParentCall('getLeadingParticipant', super.getLeadingParticipant.bind(this), [ ...arguments ]);
    }

    /** @inheritdoc */
    getLeadingParticipantByElapsedTime(lapNumber) {
        return this._cache.cacheParentCall('getLeadingParticipantByElapsedTime', super.getLeadingParticipantByElapsedTime.bind(this), [ ...arguments ]);
    }

    /** @inheritdoc */
    getLastedLaps() {
        return this._cache.cacheParentCall('getLastedLaps', super.getLastedLaps.bind(this), [ ...arguments ]);
    }

    /** @inheritdoc */
    getMaxPosition() {
        return this._cache.cacheParentCall('getMaxPosition', super.getMaxPosition.bind(this), [ ...arguments ]);
    }
}
