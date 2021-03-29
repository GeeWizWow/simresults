/**
 * @author     Maurice van der Star <mauserrifle@gmail.com>
 * @copyright  (c) 2013 Maurice van der Star
 * @license    http://opensource.org/licenses/ISC
*/

import { Lap } from './lap.js';
import { Helper } from './helper.js';

export const Finish = {
    Normal: 'finished',
    None: 'none',
    DNF: 'dnf',
    DQ: 'dq',
};

export class Participant {

    static finishSortOrder = [
        Finish.Normal,
        Finish.DNF,
        Finish.DQ,
        Finish.None,
    ];

    _drivers = [];
    _team;
    _vehicle;
    _position;
    _gridPosition;
    _classPosition;
    _classGridPosition;
    _laps = [];
    _totalTime;
    _pitstops = 0;
    _finishStatus = Finish.None;
    _finishStatusComment;
    _helper;

    constructor(helper) {
        this._helper = helper || new Helper();
    }

    setDrivers(drivers) {
        this._drivers = drivers;
        return this;
    }

    getDrivers() {
        return this._drivers;
    }

    getDriver(driverNumber = 1) {
        return this._drivers[driverNumber - 1];
    }

    setTeam(team) {
        this._team = team;
        return this;
    }

    getTeam() {
        return this._team;
    }

    setVehicle(vehicle) {
        this._vehicle = vehicle;
        return this;
    }

    /**
     * Get the vehicle.
     *
     * When the argument `ignoreLapVehicles` is set to false (default) it
     * returns a vehicle in this order:
     *
     *     * The best lap vehicle (if any)
     *     * The main vehicle set on participant (if any)
     *     * The first found vehicle on laps (if any)
     *
     * Considering using `getVehicles()` especially for non-race sessions!
     * A participant might ran  multiple cars on different laps due to
     * reconnecting
     *
     * @param  boolean  ignoreLapVehicles   Used to prevent infinite loops
     *                                         when calling `Lap.getVehicle()`
     *                                         which fallbacks to this class.
     *
     * @return Vehicle
    */
    getVehicle(ignoreLapVehicles = false) {

        if (!ignoreLapVehicles) {
            const vehicles = this.getVehicles();
            if (vehicles.length > 0) {

                const bestLap = this.getBestLap();
                const bestLapVehicle = bestLap && bestLap.getVehicle();
    
                if (bestLapVehicle) {
                    return bestLapVehicle;
                }
    
                return vehicles[0];
            }
        }

        return this._vehicle;
    }

    getVehicles() {

        const allVehicles = this._laps.reduce((agg, lap) => {
            const vehicle = lap.getVehicle();
            return vehicle ? [ ...agg, vehicle ] : agg;
        }, []);

        const vehicles = this._helper.uniqBy(allVehicles, 'name');

        if (!vehicles.length && this._vehicle) {
            return [ this._vehicle ];
        }

        return vehicles;
    }

    setPosition(position) {
        this._position = position;
        return this;
    }

    getPosition() {
        return this._position;
    }

    setGridPosition(gridPosition) {
        this._gridPosition = gridPosition;
        return this;
    }

    getGridPosition() {
        return this._gridPosition;
    }

    setClassPosition(classPosition) {
        this._classPosition = classPosition;
        return this;
    }

    getClassPosition() {
        return this._classPosition;
    }

    setClassGridPosition(classGridPosition) {
        this._classGridPosition = classGridPosition;
        return this;
    }

    getClassGridPosition() {
        return this._classGridPosition;
    }

    setLaps(laps) {
        this._laps = laps;
        return this;
    }

    getLaps() {
        return this._laps;
    }

    addLap(lap) {

        if (!lap.getNumber()) {

            if (!this._laps.length) {
                lap.setNumber(1);
            }
            else {
                const lastlap = this._laps[this._laps.length - 1];
                lap.setNumber(lastlap.getNumber() + 1);
            }
        }

        this._laps.push(lap);

        return this;
    }

    getLap(lapNumber) {
        const lap = this._laps.find(lap => lap.getNumber() === lapNumber);
        return lap;
    }

    getLastLap() {
        return this._laps[this._laps.length - 1] || null;
    }

    setPitstops(pitstops) {
        this._pitstops = pitstops;
        return this;
    }

    getPitstops() {
        return this._pitstops;
    }

    setFinishStatus(finishStatus) {
        this._finishStatus = finishStatus;
        return this;
    }

    getFinishStatus() {
        return this._finishStatus;
    }

    setFinishComment(comment) {
        this._finishStatusComment = comment;
        return this;
    }

    getFinishStatusComment() {
        return this._finishStatusComment;
    }

    /**
     * Set the total time. Used to overwrite the total time of a participant,
     * which is  normally calculated through the lap times. Useful when a
     * driver has a penalty for extra time or the laps are in-complete.
     * It is known that you can't rely on lap times for rfactor 2 for example.
     * Sometimes a lap time is just 'missing'. When it's possible, always set
     * this._
     *
     * @param   number          totalTime
     * @return  Participant
    */
    setTotalTime(totalTime) {
        this._totalTime = totalTime;
        return this;
    }

    getTotalTime () {
        if (this._totalTime) {
            return this._totalTime;
        }

        const total = this.getLaps().reduce(
            (agg, lap) => lap.isCompleted() ? agg + lap.getTime() : agg,
            0,
        );

        return this._totalTime = total;
    }

    /**
     * Returns the gap of the total time between participant and given
     * participant. When a participant is lapped, the lapped time will be
     * added too.
     *
     * @param   Participant  participant
     * @return  number
    */
    getTotalTimeGap(participant) {

        let gap = participant.getTotalTime() - this.getTotalTime();
        let lapDifference = this.getNumberOfLaps() - participant.getNumberOfLaps();

        if (lapDifference !== 0) {

            const leadingParticipant = lapDifference > 0 ? this : participant;

            for (
                let lapI = leadingParticipant.getNumberOfLaps();
                lapI > (leadingParticipant.getNumberOfLaps() - Math.abs(lapDifference));
                lapI--
            ) {

                const leadingLap = leadingParticipant.getLap(lapI);
                if (!leadingLap) {
                    continue;
                }

                if (lapDifference < 0) {
                    gap = gap - leadingLap.getTime();
                }
                else {
                    gap = gap + leadingLap.getTime();
                }

            }
        }

        return gap;
    }

    getLapsSortedByTime() {
        return this._helper.sortLapsByTime(this.getLaps());
    }

    getBestLap() {
        if (this._laps.length === 0) {
            return null;
        }

        const laps = this.getLapsSortedByTime();
        return laps.find(lap => lap.isCompleted()) || null;
    }
    
    getNumberOfLaps() {
        return this.getLaps().length;
    }

    getNumberOfCompletedLaps() {
        const laps = this.getLaps().filter(lap => lap.isCompleted());
        return laps.length;
    }

    getNumberOfLapsLed() {
        const laps = this.getLaps().filter(lap => lap.getPosition() === 1);
        return laps.length;
    }

    getLapsSortedBySector(sector) {
        return this._helper.sortLapsBySector(this.getLaps(), sector);
    }

    getBestLapBySector(sector) {
        return this.getLapsSortedBySector(sector)[0] || null;
    }

    getPositionDifference() {
        if (!this.getGridPosition()) {
            return 0;
        }

        return this.getGridPosition() - this.getPosition();
    }

    getAids() {
        return this.getLaps().reduce((agg, lap) => agg.concat(lap.getAids()), []);
    }

    /**
     * Get the average lap. Based on sectors. Also includes non-completed laps.
     *
     * @param   boolean   excludePitstopSectors  Set to true to exclude any
     *                                              sectors that were part of
     *                                              pitting (e.g. L1S3->L2S1)
     *
     * @return  Lap
    */
    getAverageLap(excludePitstopSectors = false) {

        if (!this.getNumberOfCompletedLaps()) {
            return null;
        }

        let prevLap;

        const sectorsSum = [0, 0, 0];
        const sectorsCount = [0, 0, 0];

        this.getLaps().forEach(lap => {

            for (let i = 0; i < 3; i++) {

                const sector = lap.getSectorTime(i + 1);
                const useSector = (
                    // has sector
                    sector 
                    // Is not a pit lap and not looping sector 3
                    && !(excludePitstopSectors && lap.isPitLap() && i === 2) 
                    // Previous lap is not a pit lap and not looping sector 1
                    && !(excludePitstopSectors && prevLap && prevLap.isPitLap() && i === 0)
                );

                if (useSector) {
                    sectorsSum[i] = sectorsSum[i] + sector;
                    sectorsCount[i] = sectorsCount[i] + 1;
                }
            }

            prevLap = lap;
        });

        if (!sectorsCount[0] || !sectorsCount[1] || !sectorsCount[2]) {
            return null;
        }

        const sectorAverages = [
            sectorsSum[0] / sectorsCount[0],
            sectorsSum[1] / sectorsCount[1],
            sectorsSum[2] / sectorsCount[2],
        ];

        const totalTime = sectorAverages.reduce((agg, sector) => agg + sector, 0);

        return (
            new Lap()
                .setSectorTimes(sectorAverages)
                .setTime(totalTime)
                .setParticipant(this)
        );
    }

    getBestPossibleLap() {

        const sector1Lap = this.getBestLapBySector(1);
        const sector2Lap = this.getBestLapBySector(2);
        const sector3Lap = this.getBestLapBySector(3);

        if (!sector1Lap || !sector2Lap || !sector3Lap) {
            return null;
        }

        const sector1 = sector1Lap.getSectorTime(1);
        const sector2 = sector2Lap.getSectorTime(2);
        const sector3 = sector3Lap.getSectorTime(3);

        if (!sector1 || !sector2 || !sector3) {
            return null;
        }

        return (
            new Lap()
                .setSectorTimes([ sector1, sector2, sector3 ])
                .setTime(sector1 + sector2 + sector3)
                .setParticipant(this)
        );
    }

    /**
     * Get the consistency of the driver. Based on:
     * best lap MINUS average non-best.
     *
     * Pit or laps slower than 21s are ignored. First lap is also ignored by
     * default but may be changed by arguments.
     *
     * @param   boolean  ignoreFirstLap
     * @return  float
    */
    getConsistency(ignoreFirstLap = true) {

        if (this.getNumberOfCompletedLaps() <= 1) {
            return null;
        }

        let totalTime = 0;
        let totalTimeLapsNum = 0;

        const bestLap = this.getBestLap();

        if (!bestLap) {
            return null;
        }

        this.getLaps().forEach((lap, index) => {

            // Is best lap, not completed, pit lap, just too slow compared to
            // the best lap (+21s) or first lap that should be ignored
            const ignoreLap = (
                lap.getTime() === bestLap.getTime()
                || !lap.isCompleted()
                || lap.isPitLap()
                || lap.getTime() >= (bestLap.getTime() + 21)
                || (ignoreFirstLap && index === 0)
            );

            if (ignoreLap) {
                return;
            }

            totalTime += lap.getTime();
            totalTimeLapsNum++;
        });

        if (!totalTimeLapsNum) {
            return null;
        }

        const average = totalTime / totalTimeLapsNum;
        return average - bestLap.getTime();
    }

    getConsistencyPercentage(ignoreFirstLap = true) {
        const consistency = this.getConsistency(ignoreFirstLap);
        const bestLap = this.getBestLap();

        if (!consistency || !bestLap) {
            return 0;
        }

        return 100 - (consistency / (bestLap.getTime() / 100));
    }

    getDriverPercentage(driver) {

        let lapCount = 0;

        this.getLaps().forEach(lap => {
            const driver = lap.getDriver();
            if (driver && driver.getName() === driver.getName()) {
                lapCount++;
            }
        });

        if (!lapCount) {
            return 0;
        }

        return (100 / this.getNumberOfLaps()) * lapCount;
    }
}
