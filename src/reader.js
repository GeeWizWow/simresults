/**
 * @author     Maurice van der Star <mauserrifle@gmail.com>
 * @copyright  (c) 2013 Maurice van der Star
 * @license    http://opensource.org/licenses/ISC
*/

import { Penalty } from './penalty.js';
import { Game } from './game.js';
import { Server } from './server.js';
import { Helper } from './helper.js';
import { Track } from './track.js';
import { Lap } from './lap.js';
import { Driver } from './driver.js';
import { Vehicle } from './vehicle.js';
import { Finish } from './participant.js';
import { SessionType } from './session.js';
import { CachedParticipant } from './cachedParticipant.js';

const CarNames = {
    0: 'Porsche 991 GT3 R',
    1: 'Mercedes-AMG GT3',
    2: 'Ferrari 488 GT3',
    3: 'Audi R8 LMS',
    4: 'Lamborghini Huracan GT3',
    5: 'McLaren 650S GT3',
    6: 'Nissan GT-R Nismo GT3 2018',
    7: 'BMW M6 GT3',
    8: 'Bentley Continental GT3 2018',
    9: 'Porsche 991II GT3 Cup',
    10: 'Nissan GT-R Nismo GT3 2017',
    11: 'Bentley Continental GT3 2016',
    12: 'Aston Martin V12 Vantage GT3',
    13: 'Lamborghini Gallardo R-EX',
    14: 'Jaguar G3',
    15: 'Lexus RC F GT3',
    16: 'Lamborghini Huracan Evo (2019)',
    17: 'Honda NSX GT3',
    18: 'Lamborghini Huracan SuperTrofeo',
    19: 'Audi R8 LMS Evo (2019)',
    20: 'AMR V8 Vantage (2019)',
    21: 'Honda NSX Evo (2019)',
    22: 'McLaren 720S GT3 (2019)',
    23: 'Porsche 911II GT3 R (2019)',
    24: 'Ferrari 488 GT3 Evo 2020',
    25: 'Mercedes-AMG GT3 2020',
    50: 'Alpine A110 GT4',
    51: 'AMR V8 Vantage GT4',
    52: 'Audi R8 LMS GT4',
    53: 'BMW M4 GT4',
    55: 'Chevrolet Camaro GT4',
    56: 'Ginetta G55 GT4',
    57: 'KTM X-Bow GT4',
    58: 'Maserati MC GT4',
    59: 'McLaren 570S GT4',
    60: 'Mercedes-AMG GT4',
    61: 'Porsche 718 Cayman GT4',
};

const CupCategoryNames = {
    0: 'Overall',
    1: 'Pro-Am',
    2: 'Am',
    3: 'Silver',
    4: 'National',
};

export class AccReader {

    static defaultTimezone = 'UTC';

    _data;
    _dataStr;
    _helper;
    _finishStatusNone50PercentRule = true;

    constructor (data = {}, dataStr, helper) {
        this._helper = helper || new Helper();
        this._data = data;
        this._dataStr = dataStr;
    }

    getSession(sessionNumber = 1) {
        const sessions = this.getSessions();

        if (!sessions[sessionNumber - 1]) {
            throw new Error(`Cannot find a session for session number ${sessionNumber}`);
        }

        return sessions[sessionNumber - 1];
    }

    getSessions() {
        return this._fixSessions(this._readSessions());
    }

    _fixSessions(sessions) {

        // Fix grid positions
        this._fixGridPositions(sessions);

        // Fix finish statusses based on number of laps because we
        // are missing finish statusses alot
        this._fixFinishStatusBasedOnLaps(sessions);

        // Fix laps data
        this._fixLapsData(sessions);

        // Fix position numbers of participants
        sessions.forEach(session => {
            this._fixParticipantPositions(session.getParticipants());
        });

        return sessions;
    }
    
    _readSessions() {

        const data  = this._data || JSON.parse(this._dataStr);

        if (!data) {
            throw new Error('Unsupported Format')
        }

        let sessionData = data;
        let parseSettings = false;

        // Client has different array
        if (data['sessionDef']) {
            sessionData = data['sessionDef'];
            parseSettings = true;
        }

        let sessionTypeValue = sessionData['sessionType'];
        if (isNaN(sessionTypeValue)) {
            sessionTypeValue = sessionTypeValue.replace(/\d/, '').toLowerCase();
        }

        const session = this._helper.detectSession(sessionTypeValue, {
            '0': SessionType.Practice,
            '4': SessionType.Qualify,
            '10': SessionType.Race,
        });

        const maxLaps = sessionData['RaceLaps'];
        if (maxLaps) {
            session.setMaxLaps(maxLaps);
        }

        session.setRaceWeekendIndex(sessionData.raceWeekendIndex);
        session.setSessionIndex(sessionData.sessionIndex);

        // Set game
        const game = new Game().setName('Assetto Corsa Competizione');
        session.setGame(game);

        // Set server
        const server = new Server().setName(sessionData['serverName'] || 'Unknown');
        session.setServer(server);

        // Set track
        const track = new Track().setVenue(sessionData['trackName'] || 'Unknown');
        session.setTrack(track);

        const sessionResult = data['sessionResult'] || data['snapShot'];

        if (sessionResult.hasOwnProperty('isWetSession')) {
            session.addOtherSetting('isWetSession', sessionResult['isWetSession']);
        }

        if (parseSettings) {
            throw new Error('Not Implemented');
        }

        // Set Participants

        const allParticipants = [];
        const participantsByCarId = {};
        const postionPerClass = {
            'GT3': 0,
            'GT4': 0,
        };

        const leaderBoardLines = sessionResult.leaderBoardLines || [];

        leaderBoardLines.forEach((lead, index) => {
            
            if (!lead.car.carId) {
                return;
            }

            const drivers = lead.car.drivers.map(driverData => (
                new Driver()
                    .setName(`${driverData.firstName} ${driverData.lastName}`.trim())
                    .setDriverId(driverData.playerId)
            ));

            const participant = CachedParticipant.createInstance();

            participant
                .setDrivers(drivers)
                .setFinishStatus(Finish.Normal)
                .setTeam(lead.car.teamName);

            if (lead.timing.totalTime) {
                participant.setTotalTime(lead.timing.totalTime / 1000);
            }

            const carModel = lead.car.carModel;
            const vehicleName = CarNames[carModel] || `Unknown`;

            const vehicle = new Vehicle();

            vehicle.setName(vehicleName);
            vehicle.setNumber(lead.car.raceNumber);

            if (vehicleName.includes('GT4')) {
                vehicle.setClass('GT4');
                participant.setClassPosition(++postionPerClass['GT4']);
            } 
            else {
                vehicle.setClass('GT3');
                participant.setClassPosition(++postionPerClass['GT3']);
            }

            if (lead.car.cupCategory !== undefined && CupCategoryNames[lead.car.cupCategory]) {
                vehicle.setCup(CupCategoryNames[lead.car.cupCategory]);
            }

            participant.setVehicle(vehicle);
            allParticipants.push(participant);
            participantsByCarId[lead.car.carId] = participant;
        });

        // Set Laps

        const lapNumberCounter = {};

        // Remember all first sectors excluding the first lap (it is bugged)
        // We will use this later to calculate averages.
        const allFirstSectorsExclFirstLap = [];
        const allLaps = data.laps || [];

        allLaps.forEach((lapData) => {

            if (!lapData.carId || !participantsByCarId[lapData.carId]) {
                return;
            }

            let lapNumber = 0;

            if (!lapNumberCounter[lapData.carId]) {
                lapNumberCounter[lapData.carId] = 1;
                lapNumber = lapNumberCounter[lapData.carId];
            } 
            else {
                lapNumber = ++lapNumberCounter[lapData.carId];
            }

            const lap = new Lap();
            const lapParticipant = participantsByCarId[lapData.carId];
            const driverIndex = lapData.driverIndex;

            lap.setParticipant(lapParticipant);
            lap.setDriver(lapParticipant.getDriver(driverIndex + 1));

            // Always include race laps or valid laps for other sessions
            if (session.getType() === SessionType.Race || lapData.isValidForBest) {

                lap.setTime(lapData.laptime / 1000);

                lapData.splits.forEach((split, index) => {
                    if (lapNumber > 1 && index === 0) {
                        allFirstSectorsExclFirstLap.push(split);
                    }

                    lap.addSectorTime(split / 1000);
                });
            }

            lapParticipant.addLap(lap);
        });


        /**
         * Data fixing of laps for race sessions
         *
         * The  timer starts when the player enters the session or presses drive.
         * So we cannot trust sector 1 times or total times.
        */

        if (session.getType() === SessionType.Race && allFirstSectorsExclFirstLap.length > 0) {

            const allFirstSectorsExclFirstLapAverage = (
                allFirstSectorsExclFirstLap.reduce((agg, sector) => agg + sector, 0) 
                / allFirstSectorsExclFirstLap.length
            );

            // Base new sector 1 time on average + 5 seconds (due grid start)
            const newSectorOneTime = (allFirstSectorsExclFirstLapAverage + 5000) / 1000;

            allParticipants.forEach(part => {
                part.getLaps().forEach(lap => {

                    const lapSectors = lap.getSectorTimes();
                    if (lap.getNumber() === 1 && lapSectors.length) {

                        lapSectors[0] = newSectorOneTime;

                        lap.setSectorTimes(lapSectors);
                        lap.setTime(lapSectors.reduce((agg, l) => agg + l, 0));
                    }
                });
            });
        }

        // Penalties
        const penalties = [];
        const penaltiesData = data.penalties || [];

        penaltiesData.forEach((penaltyData) => {
            if (!penaltyData.carId) {
                return;
            }

            const penalty = new Penalty();
            const penaltyParticipant = participantsByCarId[penaltyData.carId];
            const driverIndex = penaltyData.driverIndex;

            penalty.setMessage(
                penaltyParticipant.getDriver(driverIndex + 1).getName()
                + ' - '
                + (penaltyData.reason || 'Unknown reason') 
                + ' - '
                + penaltyData.penalty
                + ' - '
                + `violation in lap ${penaltyData.violationInLap || 'unknown'}`
                + ' - '
                + `cleared in lap ${penaltyData.clearedInLap || 'unknown'}`
            );

            const penaltyLap = penaltyParticipant.getLap(penaltyData.violationInLap);
            const servedLap = penaltyParticipant.getLap(penaltyData.clearedInLap);

            if (penaltyLap) {
                penalty.setLap(penaltyLap);
            }

            if (servedLap) {
                penalty.setServedLap(servedLap);
            }

            penalty
                .setReason(penaltyData.reason)
                .setPenalty(penaltyData.penalty)
                .setParticipant(penaltyParticipant)
                .setServed(Boolean(penaltyData.clearedInLap));

            penalties.push(penalty);

            if (
                session.getType() !== SessionType.Race
                && penaltyData.penalty === 'RemoveBestLaptime'
                && penaltyLap
            ) {
                penaltyLap.setTime(undefined);
                penaltyLap.setSectorTimes([]);
            }
        });

        session.setPenalties(penalties);

        /**
         * Data fixing
        */

        session.setParticipants(allParticipants);

        // Dispose of the initial data
        this._data = null;
        this._dataStr = null;

        return [ session ];
    }

    _fixGridPositions(sessions) {
        let lastQualifyParts = {};

        sessions.forEach(session => {

            if (session.getType() === SessionType.Qualify) {
                lastQualifyParts = {};
                session.getParticipants().forEach(part => {
                    const driverName = part.getDriver().getName();
                    if (driverName) {
                        lastQualifyParts[driverName] = part.getPosition();
                    }
                });
            }
            else if (session.getType() === SessionType.Race) {
                session.getParticipants().forEach(part => {
                    const driverName = part.getDriver().getName();

                    if (
                        driverName
                        && lastQualifyParts[driverName]
                        && !part.getGridPosition()
                    ) {
                        part.setGridPosition(
                            lastQualifyParts[driverName]
                        );
                    }
                });
            }
        });
    }

    _fixFinishStatusBasedOnLaps(sessions) {
        sessions.forEach(session => {
            if (session.getType() === SessionType.Race) {
                session.getParticipants().forEach(part => {
                
                    if (part.getNumberOfCompletedLaps() === 0) {
                        part.setFinishStatus(Finish.DNF);
                    }
                    else if (
                        this._finishStatusNone50PercentRule
                        && part.getFinishStatus() === Finish.Normal
                        && (
                            !part.getNumberOfCompletedLaps()
                            || (part.getNumberOfCompletedLaps() / (session.getLastedLaps() / 100)) < 50
                        ) 
                    ) {
                        part.setFinishStatus(Finish.None);
                    }
                });
            }
        });
    }

    _fixLapsData(sessions) {
        sessions.forEach(session => {
            session.getParticipants().forEach(part => {
                let elapsedTime = 0;
                part.getLaps().forEach((lap, index) => {

                    if (!lap.getElapsedSeconds()) {
                        if (lap.getTime()) {
                            lap.setElapsedSeconds(elapsedTime);
                        }

                        elapsedTime += lap.getTime();
                    }

                    if (!lap.getNumber()) {
                        lap.setNumber(index + 1);
                    }
                });
            });

            const parts = session.getParticipants();
            const lap = parts.length && parts[0].getLap(2)

            if (lap && !lap.getPosition()) {
                let sessionLastedLaps = session.getLastedLaps();
                for (let i = 2; i <= sessionLastedLaps; i++) {

                    const lapsSorted = session.getLapsByLapNumberSortedByTime(i);
                    const lapsSortedByTime = this._helper.sortLapsByElapsedTime(lapsSorted);

                    lapsSortedByTime.forEach((lap, index) => {
                        if (
                            !lap.getPosition()
                            && (
                                lap.getTime()
                                || lap.getElapsedSeconds()
                            )
                        ) {
                            lap.setPosition(index + 1);
                        }
                    });
                }
            }
        });
    }

    _fixParticipantPositions(participants) {
        participants.forEach((part, index) => {
            part.setPosition(index + 1);
        });
    }

    _sortParticipantsAndFixPositions(participants, session, sortByLastLapPositionOnMissingFinishStatusses = false) {

        let fixedParticipants = [];

        if (session.getType() === SessionType.Race) {

            let sortByLastLap = false;

            if (sortByLastLapPositionOnMissingFinishStatusses) {
                sortByLastLap = true;
                session.getParticipants().forEach(part => {
                    if (part.getFinishStatus() !== Finish.None) {
                        sortByLastLap = false;
                    }
                });
            }

            if (sortByLastLap) {
                fixedParticipants = this._helper.sortParticipantsByLastLapPosition(participants);
            }
            else {
                fixedParticipants = this._helper.sortParticipantsByTotalTime(participants);
            }
        }
        else {
            fixedParticipants = this._helper.sortParticipantsByBestLap(participants);
        }

        this._fixParticipantPositions(fixedParticipants);

        return participants;
    }
}
