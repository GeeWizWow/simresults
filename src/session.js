/**
 * @author     Maurice van der Star <mauserrifle@gmail.com>
 * @copyright  (c) 2013 Maurice van der Star
 * @license    http://opensource.org/licenses/ISC
*/

import { Helper } from './helper.js';

export const SessionType = {
    Practice: 'FP',
    Qualify: 'Q',
    Warmup: 'W',
    Race: 'R',
    Unknown: 'unknown',
};

export class Session {

    _type;
    _name;
    _game;
    _server;
    _track;
    _participants = [];
    _date;
    _dateString;
    _maxLaps;
    _maxMinutes;
    _chats = [];
    _incidents = [];
    _penalties = [];
    _mod;
    _allowedVehicles = [];
    _setupFixed;
    _raceWeekendIndex;
    _sessionIndex;
    _otherSettings = {};
    _helper;

    constructor(helper) {
        this._helper = helper || new Helper();
    }

    setType(type) {
        this._type = type;
        return this;
    }

    getType() {
        return this._type;
    }

    setName(name) {
        this._name = name;
        return this;
    }

    getName() {
        return this._name;
    }

    setGame(game) {
        this._game = game;
        return this;
    }

    getGame() {
        return this._game;
    }

    setServer(server) {
        this._server = server;
        return this;
    }

    getServer() {
        return this._server;
    }

    setTrack(track) {
        this._track = track;
        return this;
    }

    getTrack() {
        return this._track;
    }

    setParticipants(participants) {
        this._participants = participants;
        return this;
    }

    addParticipant(participant) {
        this._participants.push(participant);
        return this;
    }

    getParticipants()  {
        return this._participants;
    }

    setDate(date) {
        this._date = date;
        return this;
    }

    getDate() {
        return this._date;
    }

    setDateString(dateString) {
        this._dateString = dateString;
        return this;
    } 

    getDateString() {
        return this._dateString;
    }

    setMaxLaps(maxLaps) {
        this._maxLaps = maxLaps;
        return this;
    }

    getMaxLaps() {
        return this._maxLaps;
    }

    setMaxMinutes(maxMinutes) {
        this._maxMinutes = maxMinutes;
        return this;
    }

    getMaxMinutes() {
        return this._maxMinutes;
    }

    setChats(chats) {
        this._chats = chats;
        return this;
    }

    addChat(chat) {
        this._chats.push(chat);
        return this;
    }

    getChats()  {
        return this._chats;
    }

    setIncidents(incidents) {
        this._incidents = incidents;
        return this;
    }

    addIncident(incident) {
        this._incidents.push(incident);
        return this;
    }

    getIncidents()  {
        return this._incidents;
    }

    getIncidentsForReview()  {
        return this._incidents.filter(i => i.isForReview());
    }

    setPenalties(penalties) {
        this._penalties = penalties;
        return this;
    }

    addPenalty(penalty) {
        this._penalties.push(penalty);
        return this;
    }

    getPenalties()  {
        return this._penalties;
    }

    setMod(mod) {
        this._mod = mod;
        return this;
    }

    getMod() {
        return this._mod;
    }

    setAllowedVehicles(vehicles) {
        this._allowedVehicles = vehicles;
        return this;
    }

    addAllowedVehicle(vehicle) {
        this._allowedVehicles.push(vehicle);
        return this;
    }

    getAllowedVehicles()  {
        return this._allowedVehicles;
    }

    setSetupFixed(setupFixed) {
        this._setupFixed = setupFixed;
        return this;
    }

    isSetupFixed() {
        return this._setupFixed;
    }

    setOtherSettings(settings) {
        this._otherSettings = settings;
        return this;
    }

    addOtherSetting(setting, value) {
        this._otherSettings[setting] = value;
        return this;
    }

    getOtherSettings() {
        return this._otherSettings;
    }

    setRaceWeekendIndex(index) {
        this._raceWeekendIndex = index;
        return this;
    }

    getRaceWeekendIndex() {
        return this._raceWeekendIndex;
    }

    setSessionIndex(index) {
        this._sessionIndex = index;
        return this;
    }

    getSessionIndex() {
        return this._sessionIndex;
    }

    getLapsSortedByTime() {
        const laps = this._participants.reduce((agg, p) => [ ...agg, ...p.getLaps() ], []);
        return this._helper.sortLapsByTime(laps);
    }
    
    getBestLap() {
        const laps = this.getLapsSortedByTime();
        return laps.find(l => l.isCompleted());
    }

    getLapsByLapNumberSortedByTime(lapNumber) {
        const laps = this._participants.reduce((agg, p) => {
            const lap = p.getLap(lapNumber);
            return lap ? [ ...agg, lap ] : agg;
        }, []);

        return this._helper.sortLapsByTime(laps);
    }

    getBestLapByLapNumber(lapNumber) {
        const laps = this.getLapsByLapNumberSortedByTime(lapNumber);
        return laps[0] || null;
    }

    getBestLapsGroupedByParticipant() {
        const laps = this._participants.reduce((agg, p) => {
            const lap = p.getBestLap();
            return lap ? [ ...agg, lap ] : agg;
        }, []);

        return this._helper.sortLapsByTime(laps);
    }

    getLapsSortedBySector(sector) {
        const laps = this._participants.reduce((agg, p) => [ ...agg, ...p.getLaps() ], []);
        return this._helper.sortLapsBySector(laps, sector);
    }

    getBestLapBySector(sector) {
        const laps = this.getLapsSortedBySector(sector);
        return laps[0] || null;
    }

    getBestLapsBySectorGroupedByParticipant(sector) {
        const laps = this._participants.reduce((agg, p) => {
            const lap = p.getBestLapBySector(sector);
            return lap ? [ ...agg, lap ] : agg;
        }, []);

        return this._helper.sortLapsBySector(laps, sector);
    }

    getLapsSortedBySectorByLapNumber(sector, lapNumber) {
        const laps = this._participants.reduce((agg, p) => {
            const lap = p.getLap(lapNumber);
            return lap ? [ ...agg, lap ] : agg;
        }, []);

        return this._helper.sortLapsBySector(laps, sector);
    }

    getBestLapBySectorByLapNumber(sector, lapNumber) {
        const laps = this.getLapsSortedBySectorByLapNumber(sector, lapNumber);
        return laps[0] || null;
    }

    /**
     * Get bad laps that are above a percent of the best lap. Defaults to the
     * 107% rule.
     *
     * @param  int  abovePercent
     * @return Lap[]
    */
    getBadLaps(abovePercent = 107) {

        const bestLap = this.getBestLap();

        if (!bestLap)  {
            return [];
        }

        const laps = this.getLapsSortedByTime();
        const maxTime = bestLap.getTime() * (abovePercent / 100);
        
        return laps.filter(lap => lap.isCompleted() && lap.getTime() > maxTime);
    }

    getCuts() {

        const cuts = [];

        this._participants.forEach(p => {
            p.getLaps().forEach(l => {
                cuts.push(...l.getCuts());
            });
        });

        return [ ...cuts].sort((a, b)  => {

            const aDate = a.getDate();
            const bDate = b.getDate();

            if (!aDate && !bDate) {
                return 0;
            }

            if (!aDate) {
                return 1;
            }

            if (!bDate) {
                return -1;
            }

            if (aDate === bDate) {
                return 0;
            }

            return aDate < bDate ? -1 : 1;
        });
    }

    getLedMostParticipant() {

        let ledMostParticipant;
        
        this._participants.forEach(part => {

            if (!ledMostParticipant) {
                ledMostParticipant = part;
                return;
            }

            if (part.getNumberOfLapsLed() > ledMostParticipant.getNumberOfLapsLed()) {
                ledMostParticipant = part;
            }
        });

        return ledMostParticipant;
    }

    getWinningParticipant()  {
        const participants = this.getParticipants();
        return participants[0] || null;
    }

    getLeadingParticipant(lapNumber) {
        const leadingParticipant = this._participants.find(p => {
            const lap = p.getLap(lapNumber);
            return lap && lap.getPosition() === 1;
        });

        return leadingParticipant;
    }

    getLeadingParticipantByElapsedTime(lapNumber) {
        let leadingLap;

        this._participants.forEach(part => {

            const lap = part.getLap(lapNumber);
            if (!lap) {
                return;
            }

            const isLeadingLap = (
                !leadingLap
                || (
                    lap.getElapsedSeconds()
                    && (
                        !lap.getElapsedSeconds()
                        || lap.getElapsedSeconds() < leadingLap.getElapsedSeconds()
                    )
                )
            );

            if (isLeadingLap) {
                leadingLap = lap;
            }
        });

        return (leadingLap && leadingLap.getParticipant()) || null;
    }

    getParticipantsSortedByConsistency()  {
        return this._helper.sortParticipantsByConsistency(this.getParticipants());
    }

    getLastedLaps()  {
        let laps = 0;
        
        this._participants.forEach(part => {
            const lapCount = part.getNumberOfLaps();
            if (lapCount > laps) {
                laps = lapCount;
            }
        });

        return laps;
    }

    /**
     * Get the max position within this session. Will search all grid/laps for
     * highest position number. This method can be more safe instead of the
     * number of participants when need to know the max position, for example
     * for graphs. Sometimes the positions are higher than the actual number
     * of participants (e.g. in rfactor results).
     *
     * @return  number
    */
    getMaxPosition()  {

        let maxPosition = 0;

        this._participants.forEach(part => {

            if (!part.getLaps() || !part.getLaps().length) {
                return;
            }

            if (part.getGridPosition() && part.getGridPosition() > maxPosition) {
                maxPosition = part.getGridPosition();
            }

            part.getLaps().forEach(lap => {
                if (lap.getPosition() && lap.getPosition() > maxPosition) {
                    maxPosition = lap.getPosition();
                }
            });
        });

        return maxPosition;
    }

    splitByVehicleClass() {
        throw new Error('Not Implemented');
    }
}