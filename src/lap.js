/**
 * @author     Maurice van der Star <mauserrifle@gmail.com>
 * @copyright  (c) 2013 Maurice van der Star
 * @license    http://opensource.org/licenses/ISC
*/

import { Helper } from './helper.js';

export class Lap {

    _number;
    _participant;
    _driver;
    _vehicle;
    _position;
    _time;
    _aids = [];
    _sectorTimes = [];
    _elapsedSeconds;
    _frontCompound;
    _rearCompound;
    _frontCompoundLeftWear;
    _frontCompoundRightWear;
    _rearCompoundLeftWear;
    _rearCompoundRightWear;
    _fuel;
    _pitLap = false;
    _pitTime;
    _cuts = [];
    _helper;

    constructor(helper) {
        this._helper = helper || new Helper();
    }

    setNumber(number) {
        this._number = number;
        return this;
    }

    getNumber()  {
        return this._number;
    }

    setParticipant(participant) {
        this._participant = participant;
        return this;
    }

    getParticipant() {
        return this._participant;
    }

    setDriver(driver) {
        this._driver = driver;
        return this;
    }

    getDriver() {
        return this._driver;
    }

    setVehicle(vehicle) {
        this._vehicle = vehicle;
        return this;
    }

    getVehicle() {
        return this._vehicle || (this._participant && this._participant.getVehicle(true));
    }

    setPosition(position) {
        this._position = position;
        return this;
    }

    getPosition()  {
        return this._position;
    }

    setTime(time) {
        this._time = time;
        return this;
    }

    getTime()  {

        if (!this._time && this.getSectorTimes().length === 3) {
            const calculatedTime = this.getSectorTimes().reduce((agg, sector) => agg + sector, 0);
            return (calculatedTime > 0 && calculatedTime) || 0;
        }

        return this._time;
    }

    setSectorTimes(sectorTimes) {
        this._sectorTimes = sectorTimes;
        return this;
    }

    getSectorTimes() {
        return this._sectorTimes;
    } 

    getSectorTime(sectorNumber)  {
        return this._sectorTimes[sectorNumber - 1] || 0;
    }

    addSectorTime(sectorTime) {
        this._sectorTimes.push(sectorTime);
        return this;
    }

    setAids(aids) {
        this._aids = aids;
        return this;
    }

    getAids() {
        return this._aids;
    }

    addAid(aid) {
        this._aids.push(aid);
        return this;
    }

    setElapsedSeconds(seconds) {
        this._elapsedSeconds = seconds;
        return this;
    }

    getElapsedSeconds()  {
        return this._elapsedSeconds;
    }

    setFrontCompound(frontCompound) {
        this._frontCompound = frontCompound;
        return this;
    }

    getFrontCompound() {
        return this._frontCompound;
    }

    setRearCompound(rearCompound) {
        this._rearCompound = rearCompound;
        return this;
    }

    getRearCompound() {
        return this._rearCompound;
    }

    setFrontCompoundLeftWear(frontCompoundLeftWear) {
        this._frontCompoundLeftWear = frontCompoundLeftWear;
        return this;
    }

    getFrontCompoundLeftWear() {
        return this._frontCompoundLeftWear;
    }

    setFrontCompoundRightWear(frontCompoundRightWear) {
        this._frontCompoundRightWear = frontCompoundRightWear;
        return this;
    }

    getFrontCompoundRightWear() {
        return this._frontCompoundRightWear;
    }

    setRearCompoundLeftWear(rearCompoundLeftWear) {
        this._rearCompoundLeftWear = rearCompoundLeftWear;
        return this;
    }

    getRearCompoundLeftWear()  {
        return this._rearCompoundLeftWear;
    }

    setRearCompoundRightWear(rearCompoundRightWear) {
        this._rearCompoundRightWear = rearCompoundRightWear;
        return this;
    }

    getRearCompoundRightWear()  {
        return this._rearCompoundRightWear;
    }

    setFuel(fuel) {
        this._fuel = fuel;
        return this;
    }

    getFuel()  {
        return this._fuel;
    }

    setPitLap(pitLap) {
        this._pitLap = pitLap;
        return this;
    }

    isPitLap() {
        return this._pitLap;
    }

    setPitTime(pitTime) {
        this._pitTime = pitTime;
        return this;
    }

    getCuts() {
        return this._cuts;
    }

    addCut(cut) {
        this._cuts.push(cut);
    }

    getNumberOfCuts()  {
        return this._cuts.length;
    }

    getCutsTime()  {
        return this._cuts.reduce((agg, cut) => agg + cut.getCutTime(), 0);
    }

    getCutsTimeSkipped()  {
        return this._cuts.reduce((agg, cut) => agg + cut.getTimeSkipped(), 0);
    }

    getPitTime()  {
        throw new Error('Not Implemented');
    }

    isCompleted() {
        const time = this.getTime();
        return Boolean(time && time > 0);
    }

    getGap(lap)  {
        const thisTime = this.getTime();
        const thatTime = lap.getTime();

        if (!thisTime || !thatTime) {
            return 0;
        }

        return thisTime - thatTime;
    }

    getSectorGap(lap, sector)  {
        const thisSectors = this.getSectorTimes();
        const thoseSectors = lap.getSectorTimes();

        if (!thisSectors[sector - 1] || !thoseSectors[sector - 1]) {
            return 0;
        }

        return thoseSectors[sector - 1] - thisSectors[sector - 1];
    }

    toString() {
        return this._helper.formatTime(this._time);
    }
}
