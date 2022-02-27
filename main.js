let CreepManager = require('manager.creeps');
let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');

CreepManager.RegisterRole('harvester', roleHarvester, 2, 2);
CreepManager.RegisterRole('upgrader', roleUpgrader, 2, 4);
CreepManager.RegisterRole('builder', roleBuilder, 0, 1);

module.exports.loop = function () {
    CreepManager.Loop();

/*
    var tower = Game.getObjectById('c9daee2a3b463952cb90c46a');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }*/
};
 