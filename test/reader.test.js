import { loadJson } from './testUtils';
import { AccReader } from '../src/reader';
import { SessionType } from '../src/session';
import { Finish } from '../src/participant';

describe('Acc Reader', () => {

    it('should fix driver positions', () => {
        const data = loadJson('./data/race.to.fix.positions.json');
        const session = new AccReader(data).getSession();

        const participants = session.getParticipants();
        const participant = participants[5];

        expect(participant.getDriver().getName()).toBe('Kevin');
    });

    it('should support driver swaps', () => {
        const data = loadJson('./data/race.modified.with.swaps.json');
        const session = new AccReader(data).getSession();

        const participants = session.getParticipants();
        const participant = participants[0];

        expect(participant.getLap(1).getDriver().getName()).toBe('Second Driver');
        expect(participant.getLap(2).getDriver().getName()).toBe('Andrea Mel');
    });

    it('should support qualifying sessions', () => {
        const data = loadJson('./data/191003_225901_Q.json');
        const session = new AccReader(data).getSession();

        expect(session.getType()).toBe(SessionType.Qualify);
        expect(session.getName()).toBe('Unknown');

        const participants = session.getParticipants();

        expect(participants[0].getDriver().getName()).toBe('Federico Siv');
        expect(participants[2].getDriver().getName()).toBe('Andrea Mel');
    });

    it('should support numeric session types', () => {
        const data = loadJson('./data/numeric.session.type.json');
        const session = new AccReader(data).getSession();

        expect(session.getType()).toBe(SessionType.Qualify);
    });

    it('should support free practice sessions', () => {
        const data = loadJson('./data/191003_224358_FP.json');
        const session = new AccReader(data).getSession();

        expect(session.getType()).toBe(SessionType.Practice);
        expect(session.getName()).toBe('Unknown');

        const participants = session.getParticipants();

        expect(participants[0].getDriver().getName()).toBe('Federico Siv');
        expect(participants[2].getDriver().getName()).toBe('Andrea Mel');
    });

    it('should support invalid laps', () => {
        const data = loadJson('./data/191003_224358_FP.json');
        const session = new AccReader(data).getSession();

        expect(session.getType()).toBe(SessionType.Practice);

        const participants = session.getParticipants();
        const laps = participants[0].getLaps();

        const invalidLaps = [ 0, 2, 3, 6, 10, 12, 13, 14 ];

        invalidLaps.forEach(lapNum => {
            expect(laps[lapNum].getTime()).toBe(undefined);
            expect(laps[lapNum].getSectorTimes()).toEqual([]);
        });
    });

    it('should support penalties', () => {
        const data = loadJson('./data/191003_224358_FP.json');
        const session = new AccReader(data).getSession();

        expect(session.getType()).toBe(SessionType.Practice);

        const penalties = session.getPenalties();

        expect(penalties[0].getMessage()).toBe('Federico Siv - Cutting - RemoveBestLaptime - violation in lap 3 - cleared in lap 3');
        expect(penalties[0].isServed()).toEqual(true);
        expect(penalties[0].getParticipant().getDriver().getName()).toBe('Federico Siv');

        expect(penalties[3].getMessage()).toBe('Andrea Mel - Cutting - RemoveBestLaptime - violation in lap 13 - cleared in lap 13');
    });

    it('should support sessions with GT4 cars', () => {
        const data = loadJson('./data/race.modified.with.gt4.json');
        const session = new AccReader(data).getSession();

        expect(session.getType()).toBe(SessionType.Race);

        const participants = session.getParticipants();

        const participantOne = participants[0];
        expect(participantOne.getPosition()).toBe(1);
        expect(participantOne.getClassPosition()).toBe(1);
        expect(participantOne.getVehicle().getClass()).toBe('GT4');

        const participantTwo = participants[1];
        expect(participantTwo.getPosition()).toBe(2);
        expect(participantTwo.getClassPosition()).toBe(1);
        expect(participantTwo.getVehicle().getClass()).toBe('GT3');

        const participantThree = participants[2];
        expect(participantThree.getPosition()).toBe(3);
        expect(participantThree.getClassPosition()).toBe(2);
        expect(participantThree.getVehicle().getClass()).toBe('GT3');
    });

    it('should not error on missing carId in cars', () => {
        const data = loadJson('./data/race.with.missing.carId.attribute.json');
        const session = new AccReader(data).getSession();

        expect(session.getType()).toBe(SessionType.Race);

        const participants = session.getParticipants();

        expect(participants[0].getDriver().getName()).toBe('Alberto For');
    });

    it('should not error on missing driver Id in laps', () => {
        const data = loadJson('./data/laps.with.unknown.carid.json');
        const session = new AccReader(data).getSession();

        expect(session.getType()).toBe(SessionType.Qualify);

        const participants = session.getParticipants();

        expect(participants[0].getDriver().getName()).toBe('Alberto For');
    });

    it('should not error on missing laps', () => {
        const data = loadJson('./data/no.laps.json');
        const session = new AccReader(data).getSession();

        expect(session.getType()).toBe(SessionType.Race);
    });

    it('should not error on missing leaderboard lines', () => {
        const data = loadJson('./data/race.without.leaderBoardLines,attribute.json');
        const session = new AccReader(data).getSession();

        expect(session.getType()).toBe(SessionType.Race);
    });

    it('should not error on missing team names', () => {
        const data = loadJson('./data/race.with.missing.driver.teamName.attribute.json');
        const session = new AccReader(data).getSession();

        expect(session.getType()).toBe(SessionType.Race);
    });

    it('should not error on missing car models', () => {
        const data = loadJson('./data/race.with.missing.carModel.attribute.json');
        const session = new AccReader(data).getSession();

        expect(session.getType()).toBe(SessionType.Race);

        const participants = session.getParticipants();

        expect(participants[0].getVehicle().getName()).toBe('Unknown');
    });


    it('should read the session settings', () => {
        const data = loadJson('./data/191003_235558_R.json');
        const session = new AccReader(data).getSession();

        expect(session.getType()).toBe(SessionType.Race);
        expect(session.getLastedLaps()).toBe(23);
        expect(session.getOtherSettings()).toEqual({'isWetSession': 1 });
    });

    it('should read the session server', () => {
        const data = loadJson('./data/191003_235558_R.json');
        const session = new AccReader(data).getSession();
        const server = session.getServer();

        expect(server.getName()).toBe("Simresults ServerName 7 of 10 (Practice 90' RACE Sept-27th)");
    });

    it('should read the session game', () => {
        const data = loadJson('./data/191003_235558_R.json');
        const session = new AccReader(data).getSession();
        const game = session.getGame();

        expect(game.getName()).toBe('Assetto Corsa Competizione');
    });

    it('should read the session track', () => {
        const data = loadJson('./data/191003_235558_R.json');
        const session = new AccReader(data).getSession();
        const track = session.getTrack();

        expect(track.getVenue()).toBe('brands_hatch');
    });

    it('should read the session participants', () => {
        const data = loadJson('./data/191003_235558_R.json');
        const session = new AccReader(data).getSession();
        const participants = session.getParticipants();

        const participantOne = participants[0];

        expect(participantOne.getDriver().getName()).toBe('Andrea Mel');
        expect(participantOne.getVehicle().getName()).toBe('Mercedes-AMG GT3');
        expect(participantOne.getDriver().getDriverId()).toBe('123');
        expect(participantOne.getVehicle().getNumber()).toBe(82);
        expect(participantOne.getVehicle().getClass()).toBe('GT3');
        expect(participantOne.getVehicle().getCup()).toBe('Overall');
        expect(participantOne.getTeam()).toBe('');
        expect(participantOne.getPosition()).toBe(1);
        expect(participantOne.getClassPosition()).toBe(1);
        expect(participantOne.getFinishStatus()).toBe(Finish.Normal);
        expect(participantOne.getTotalTime()).toBe(2329.129);

        const participantTwo = participants[1];

        expect(participantTwo.getPosition()).toBe(2);
        expect(participantTwo.getClassPosition()).toBe(2);
        expect(participantTwo.getVehicle().getClass()).toBe('GT3');
        expect(participantTwo.getVehicle().getCup()).toBe('Pro-Am');

        const participantThree = participants[2];

        expect(participantThree.getPosition()).toBe(3);
        expect(participantThree.getClassPosition()).toBe(3);
        expect(participantThree.getVehicle().getClass()).toBe('GT3');
        expect(participantThree.getVehicle().getCup()).toBe('Overall');
    });

    it('should read the participant laps', () => {
        const data = loadJson('./data/191003_235558_R.json');
        const session = new AccReader(data).getSession();
        
        const participants = session.getParticipants();
        const laps = participants[0].getLaps();

        expect(laps.length).toBe(23);

        const driver = participants[0].getDriver();
        const lap = laps[0];

        expect(lap.getNumber()).toBe(1);
        expect(lap.getPosition()).toBe(undefined);
        expect(lap.getTime()).toBe(124.72956451612902);
        expect(lap.getElapsedSeconds()).toBe(0);
        expect(lap.getParticipant()).toStrictEqual(participants[0]);
        expect(lap.getDriver()).toStrictEqual(driver);

        const sectors = lap.getSectorTimes();

        expect(sectors[0]).toBe(51.77256451612903);
        expect(sectors[1]).toBe(27.762);
        expect(sectors[2]).toBe(45.195);

        const lapTwo = laps[1];

        expect(lapTwo.getNumber()).toBe(2);
        expect(lapTwo.getPosition()).toBe(3);
        expect(lapTwo.getTime()).toBe(336.123);
        expect(lapTwo.getElapsedSeconds()).toBe(124.72956451612902);

        const extraLaps = participants[2].getLaps();

        expect(extraLaps[0].getPosition()).toBe(undefined);
        expect(extraLaps[1].getPosition()).toBe(1);
    });
});