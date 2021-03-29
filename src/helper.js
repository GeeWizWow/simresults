/**
 * @author     Maurice van der Star <mauserrifle@gmail.com>
 * @copyright  (c) 2013 Maurice van der Star
 * @license    http://opensource.org/licenses/ISC
*/

import { SessionType } from './session.js';
import { CachedSession } from './cachedSession.js';
import { Participant, Finish } from './participant.js';

export class Helper {

    uniqBy(arr, key) {
        const result = [];
        const seen = [];

        for (var i = 0, length = arr.length; i < length; i++) {
            const value = arr[i];
            const computed = value[key];
            if (seen.indexOf(computed) === -1) {
                seen.push(computed);
                result.push(value);
            }
        }

        return result;
    }

    formatTime(seconds, forceHours = false) {

        const isNegative = seconds < 0;
        const time = isNegative ? Math.abs(seconds) : seconds;

        const roundSeconds = Math.trunc(time);
        const hours = Math.floor(roundSeconds / 3600);
        const minutes = Math.floor((roundSeconds - (hours * 3600)) / 60);
        const secs = Math.floor((roundSeconds - (hours * 3600) - (minutes * 60)));
        const secsMicro = seconds - roundSeconds + secs;

        const secsFormatted = secsMicro.toFixed(4).padStart(7, '0');
        const minsFormatted = minutes.toFixed(0).padStart(2, '0');

        let format = `${minsFormatted}:${secsFormatted}`;

        if (hours || forceHours) {
            const hoursFormatted = hours.toFixed(0).padStart(2, '0');
            format = `${hoursFormatted}:${format}`;
        }

        if (isNegative) {
            format = `-${format}`;
        }

        return format;
    }

    sortLapsBySector(laps, sector) {
        return [ ...laps].sort((a, b) => {
            
            const sectorIndex = sector - 1;
            const aSectors = a.getSectorTimes();
            const bSectors = b.getSectorTimes();

            if (!aSectors[sectorIndex] && !bSectors[sectorIndex]) {
                return 0;
            }

            if (!aSectors[sectorIndex]) {
                return 1;
            }

            if (!bSectors[sectorIndex]) {
                return -1;
            }

            if (aSectors[sectorIndex] === bSectors[sectorIndex]) {
                return 0;
            }

            return aSectors[sectorIndex] < bSectors[sectorIndex] ? -1 : 1;
        });
    }

    sortLapsByTime(laps) {
        return [ ...laps].sort((a, b) => {

            if (a.getTime() === b.getTime()) {
                return 0;
            }

            if (!a.isCompleted()) {
                return 1;
            }

            if (!b.isCompleted()) {
                return -1;
            }

            return a.getTime() < b.getTime() ? -1 : 1;
        });
    }

    sortLapsByElapsedTime(laps) {
        return [ ...laps].sort((a, b) => {

            if (a.getElapsedSeconds() === b.getElapsedSeconds()) {

                if (a.getTime() === b.getTime()) {
                    return 0;
                }

                return a.getTime() < b.getTime() ? -1 : 1;
            }

            if (!a.getElapsedSeconds()) {
                return 1;
            }

            if (!b.getElapsedSeconds()) {
                return -1;
            }

            if (!a.isCompleted()) {
                return 1;
            }

            if (!b.isCompleted()) {
                return -1;
            }

            return a.getElapsedSeconds() < b.getElapsedSeconds() ? -1 : 1;
        });
    }

    sortParticipantsByTotalTime(participants) {
        return [ ...participants].sort((a, b) => {

            if (a.getNumberOfLaps() < b.getNumberOfLaps()) {
                return 1;
            }

            if (b.getNumberOfLaps() < a.getNumberOfLaps()) {
                return -1;
            }

            if (
                (
                    a.getFinishStatus() === Finish.None
                    || a.getFinishStatus() === Finish.DQ
                    || a.getFinishStatus() === Finish.DNF
                )
                && (
                    b.getFinishStatus() === Finish.None
                    || b.getFinishStatus() === Finish.DQ
                    || b.getFinishStatus() === Finish.DNF
                )
            ) {

                if (!a.getTotalTime() && !b.getTotalTime()) {

                    if (a.getFinishStatus() === b.getFinishStatus()) {

                        if (a.getGridPosition() && b.getGridPosition()) {
                            if (a.getGridPosition() < b.getGridPosition()) {
                                return -1;
                            }

                            if (b.getGridPosition() < a.getGridPosition()) {
                                return 1;
                            }
                        }

                        if (a.getGridPosition()) {
                            return -1;
                        }

                        if (b.getGridPosition()) {
                            return 1;
                        }

                        return 0;
                    }

                    const aOrder = Participant.finishSortOrder.findIndex(f => f === a.getFinishStatus());
                    const bOrder = Participant.finishSortOrder.findIndex(f => f === b.getFinishStatus());

                    return aOrder < bOrder ? -1 : 1;
                }

                return a.getTotalTime() < b.getTotalTime() ? 1 : -1;
            }

            if (
                a.getFinishStatus() === Finish.None
                || a.getFinishStatus() === Finish.DQ
                || a.getFinishStatus() === Finish.DNF
            ) {
                return 1;
            }

            if (
                b.getFinishStatus() === Finish.None
                || b.getFinishStatus() === Finish.DQ
                || b.getFinishStatus() === Finish.DNF
            ) {
                return -1;
            }

            if (a.getTotalTime() === b.getTotalTime()) {

                if (a.getGridPosition() && b.getGridPosition()) {

                    if (a.getGridPosition() < b.getGridPosition()) {
                        return -1;
                    }

                    if (b.getGridPosition() < a.getGridPosition()) {
                        return 1;
                    }
                }

                if (a.getGridPosition()) {
                    return -1;
                }

                if (b.getGridPosition()) {
                    return 1;
                }

                return 0;
            }

            return a.getTotalTime() < b.getTotalTime() ? -1 : 1;
        });
    }

    sortParticipantsByBestLap(participants) {

        const laps = []; 
        const partsWoLap = []; 

        participants.forEach(part => {
            const bestLap = part.getBestLap();
            if (bestLap) {
                laps.push(bestLap);
            }
            else {
                partsWoLap.push(part);
            }
        });

        const sortedLaps = this.sortLapsByTime(laps);
        const parts = sortedLaps.reduce((agg, lap) => {
            const part = lap.getParticipant();
            return part ? [ ...agg, part ] : agg;
        }, []);

        return [
            ...parts,
            ...partsWoLap,
        ];
    }

    sortParticipantsByConsistency(participants) {
        return [ ...participants].sort((a, b) => {

            const aConsistency = a.getConsistency();
            const bConsistency = b.getConsistency();

            if (!aConsistency && !bConsistency) {
                return 0;
            }

            if (!aConsistency) {
                return 1;
            }

            if (!bConsistency) {
                return -1;
            }

            if (aConsistency === bConsistency) {
                return 0;
            }

            return aConsistency < bConsistency ? -1 : 1;
        });
    }

    sortParticipantsByLastLapPosition(participants) {
        return [ ...participants].sort((a, b) => {

            const aLaps = a.getNumberOfLaps();
            const bLaps = b.getNumberOfLaps();

            if (!aLaps && !bLaps) {
                return 0;
            }

            if (!aLaps) {
                return 1;
            }

            if (!bLaps) {
                return -1;
            }

            if (aLaps !== bLaps) {
                return aLaps < bLaps ? 1 : -1;
            }

            const aLastLap = a.getLastLap();
            const bLastLap = b.getLastLap();

            if (!aLastLap && !bLastLap) {
                return 0;
            }

            if (!aLastLap) {
                return 1;
            }

            if (!bLastLap) {
                return -1;
            }

            return aLastLap.getPosition() < bLastLap.getPosition() ? -1 : 1;
        });
    }

    /**
     * Detect a session. Returns a Session object with proper session type.
     * If the session value differs from the session type detected, it will
     * be stored as session name.
     *
     * @param   string  sessionValue
     * @param   array   customValuesToType
     * @return  Session
     */
    detectSession(sessionValue, customValuesToType = {}) {

        const sessionValueLower = sessionValue.toLowerCase(); 
        const valuesToType = {
            'p': SessionType.Practice,
            'fp': SessionType.Practice,
            'q': SessionType.Qualify,
            'r': SessionType.Race,
            'w': SessionType.Warmup,
            ...customValuesToType,
        };

        let name = 'Unknown';
        let type = valuesToType[sessionValueLower];

        if (!type) {
            type = SessionType.Practice;
            name = 'Unknown';
        }

        if (!name) {
            name = type.toLowerCase();
            name = name.charAt(0).toUpperCase() + name.slice(1);
        }

        return (
            CachedSession.createInstance()
                .setType(type)
                .setName(name)
        );
    }
}

// https://github.com/sindresorhus/auto-bind
export const autoBind = (self) => {
    const getAllProperties = object => {
        const properties = new Set();
    
        do {
            for (const key of Reflect.ownKeys(object)) {
                properties.add([object, key]);
            }
        } while ((object = Reflect.getPrototypeOf(object)) && object !== Object.prototype);
    
        return properties;
    };

    for (const [object, key] of getAllProperties(self.constructor.prototype)) {
        if (key === 'constructor') {
            continue;
        }

        const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
        if (descriptor && typeof descriptor.value === 'function') {
            self[key] = self[key].bind(self);
        }
    }

    return self;
};
