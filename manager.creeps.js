class ManagerCreeps {
    constructor() {
        this.roles = {};
        this.spawning = false;
        /*
        <roleName:string>: {roleName: <string>, role: [roleClass], minWorkers: <integer>, maxWorkers: <integer>, options: {optionA: <object>, ...}}
        */

        this.bodyCost = {};
        this.bodyCost[MOVE] = 50;
        this.bodyCost[WORK] = 100;
        this.bodyCost[CARRY] = 50;
    }

    Loop() {
        // Reset lists
        this.spawning = Game.spawns['Spawn_1'].spawning;

        for(let roleName in this.roles) {
            if(!this.roles.hasOwnProperty(roleName))
                continue;

            this.roles[roleName].currentWorkers = [];
            this.roles[roleName].currentWorkerCount = 0;
        }


        // For all creeps with a role, run them
        for(let name in Game.creeps) {
            if(!Game.creeps.hasOwnProperty(name))
                continue;

            let creep = Game.creeps[name];
            if(creep.memory.role !== undefined) {
                if(this.roles.hasOwnProperty(creep.memory.role)) {
                    //roleCounter[creep.memory.role] = roleCounter[creep.memory.role] + 1;
                    this.roles[creep.memory.role].currentWorkers.push(creep);
                    this.roles[creep.memory.role].currentWorkerCount++;
                    this.roles[creep.memory.role].role.run(creep);
                } else {
                    // RoleClass undefined
                }
            } else {
                // Creep role undefined
            }
        }


        // Check if we need to spawn creeps
        let stopSpawning = false;
        if(!this.spawning) {
            for(let roleName in this.roles) { // Min worker check
                if(!this.roles.hasOwnProperty(roleName))
                    continue;

                let role = this.roles[roleName];
                //console.log(`Min workers: ${role.minWorkers}, Max workers: ${role.maxWorkers}, Live workers: ${role.currentWorkerCount}`);
                if(role.currentWorkerCount < role.minWorkers) {
                    console.log(`Spawning creep for Min requirement of '${roleName}'`);
                    let result = this._SpawnWorker(role);
                    if(result){
                        stopSpawning = true;
                        break;
                    }
                }
            }
        }

        if(!this.spawning || stopSpawning) {
            for (let roleName in this.roles) { // Max worker check
                if (!this.roles.hasOwnProperty(roleName))
                    continue;

                let role = this.roles[roleName];
                if (role.currentWorkerCount < role.maxWorkers) {
                    console.log(`Spawning creep for Max of '${roleName}'`);
                    let result = this._SpawnWorker(role);
                    if(result) break;
                }
            }
        }
    }

    _SpawnWorker(role) {
        let name = this._GetNextWorkerName(role);
        let cost = this._CalcBodyCost(role.role.bodyParts);

        if(cost > Game.spawns['Spawn_1'].store[RESOURCE_ENERGY]) {
            console.log('No energy.');
            return true;
        }

        let result = Game.spawns['Spawn_1'].createCreep(role.role.bodyParts, name, {'role': role.name});
        //let result = -10;
        if(result) {
            console.log('Spawn successfull');
            this.spawning = true;
            return true;
        } else {
            console.log(`Name: ${name}, Body: ${role.role.bodyParts}`);
            console.log('Error spawning creep:', result);
            return false;
        }
    }

    _GetNextWorkerName(role) {
        let keys = [];

        for(let i = 0; i < role.currentWorkers.length; i++) {
            let split = role.currentWorkers[i].name.split('_');
            keys.push(split.pop() * 1);
        }

        keys.sort((a, b) => { return a - b; });

        for(let i = 0; role.maxWorkers; i++) {
            if(i >= keys.length)
                return `${role.roleName}_${keys.length}`;

            if(i !== keys[i])
                return `${role.roleName}_${i}`;
        }

        return false;
    }

    _CalcBodyCost(parts) {
        let cost = 0;
        for(let i = 0; i < parts.length; i++) {
            cost += this.bodyCost[parts[i]];
        }
        return cost;
    }

    RegisterRole(name, roleClass, minWorkers, maxWorkers, options) {
        if(minWorkers === undefined) {
            minWorkers = 1;
            maxWorkers = 1;
        } else if(maxWorkers === undefined) {
            maxWorkers = minWorkers;
        }

        if(name === undefined || name === '' || roleClass === undefined ) {
            // Missing arguments.
            return false;
        }

        if(this.roles.hasOwnProperty(name)) {
            // A role with this name already exists.
            return false;
        }

        let role = {
            name: name,
            roleName: name,
            role: roleClass,
            minWorkers: minWorkers,
            maxWorkers: maxWorkers,
            currentWorkers: [],
            currentWorkerCount: 0,
            options: options ? options : {},
            priority: Object.keys(this.roles).length
        };
        this.roles[name] = role;

        console.log('Creep Role registered:', JSON.stringify(role));
        return true;
    }

    SetWorkerTarget(roleName, minWorkers, maxWorkers) {
        if(minWorkers !== undefined)
            this.roles[roleName].minWorkers = minWorkers;
        if(maxWorkers !== undefined)
            this.roles[roleName].maxWorkers = maxWorkers;
    }

    GetWorkerTarget(roleName) {
        return {minWorkers: this.roles[roleName].minWorkers, maxWorkers: this.roles[roleName].maxWorkers};
    }
}

const _instance = new ManagerCreeps();

module.exports = _instance;
