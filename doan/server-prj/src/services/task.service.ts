import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class TasksService {
    constructor(private schedulerRegistry: SchedulerRegistry) {}

    addInterval(name: string, milliseconds: number, callback = null) {
        const interval = setInterval(callback, milliseconds);
        this.schedulerRegistry.addInterval(name, interval);
    }

    getListIntervals() {
        return this.schedulerRegistry.getIntervals();
    }

    getInterval(name: string) {
        return this.schedulerRegistry.getInterval(name);
    }

    deleteInterval(name: string) {
        this.schedulerRegistry.deleteInterval(name);
    }

    addTimeout(name: string, milliseconds: number, callback = null) {
        const interval = setTimeout(callback, milliseconds);
        this.schedulerRegistry.addTimeout(name, interval);
    }

    getListTimeouts() {
        return this.schedulerRegistry.getTimeouts();
    }

    getTimeout(name: string) {
        return this.schedulerRegistry.getTimeout(name);
    }

    deleteTimeout(name: string) {
        this.schedulerRegistry.deleteTimeout(name);
    }
}
