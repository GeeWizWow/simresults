/**
 * @author     Maurice van der Star <mauserrifle@gmail.com>
 * @copyright  (c) 2013 Maurice van der Star
 * @license    http://opensource.org/licenses/ISC
*/

import { Participant } from './participant.js';
import { Cache } from './cache.js';

export class CachedParticipant extends Participant {

    _cache;
    
    constructor(helper, cache) {
        super(helper);
        this._cache = cache || new Cache();
    }

    static createInstance() {
        return new CachedParticipant();
    }

    /** @inheritdoc */
    getLap(lapNumber) {
        return this._cache.cacheParentCall('getLap', super.getLap.bind(this), [ ...arguments ]);
    }

    /** @inheritdoc */
    getVehicles() {
        return this._cache.cacheParentCall('getVehicles', super.getVehicles.bind(this), [ ...arguments ]);
    }

    /** @inheritdoc */
    getLapsSortedByTime() {
        return this._cache.cacheParentCall('getLapsSortedByTime', super.getLapsSortedByTime.bind(this), [ ...arguments ]);
    }

    /** @inheritdoc */
    getBestLap() {
        return this._cache.cacheParentCall('getBestLap', super.getBestLap.bind(this), [ ...arguments ]);
    }

    /** @inheritdoc */
    getNumberOfCompletedLaps() {
        return this._cache.cacheParentCall('getNumberOfCompletedLaps', super.getNumberOfCompletedLaps.bind(this), [ ...arguments ]);
    }

    /** @inheritdoc */
    getNumberOfLapsLed() {
        return this._cache.cacheParentCall('getNumberOfLapsLed', super.getNumberOfLapsLed.bind(this), [ ...arguments ]);
    }

    /** @inheritdoc */
    getLapsSortedBySector(sector) {
        return this._cache.cacheParentCall('getLapsSortedBySector', super.getLapsSortedBySector.bind(this), [ ...arguments ]);
    }

    /** @inheritdoc */
    getBestLapBySector(sector) {
        return this._cache.cacheParentCall('getBestLapBySector', super.getBestLapBySector.bind(this), [ ...arguments ]);
    }

    /** @inheritdoc */
    getAverageLap(excludePitstopSectors = false) {
        return this._cache.cacheParentCall('getAverageLap', super.getAverageLap.bind(this), [ ...arguments ]);
    }

    /** @inheritdoc */
    getBestPossibleLap() {
        return this._cache.cacheParentCall('getBestPossibleLap', super.getBestPossibleLap.bind(this), [ ...arguments ]);
    }

    /** @inheritdoc */
    getConsistency(ignoreFirstLap = true) {
        return this._cache.cacheParentCall('getConsistency', super.getConsistency.bind(this), [ ...arguments ]);
    }
}
