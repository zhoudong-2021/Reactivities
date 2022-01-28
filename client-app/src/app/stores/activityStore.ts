import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { v4 as uuid } from 'uuid';

export default class ActivityStore {
    activities = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this);
    }

    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const data = await agent.Activities.list();
            runInAction(() => {
                data.map(item => {
                    item.date = item.date.slice(0, 10);
                    this.activities.set(item.id, item);
                });
                this.loadingInitial = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingInitial = false)
        }
    }

    get activitiesOrderByDate() {
        return Array.from(this.activities.values()).sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
    }

    selectActivity = (id: string) => {
        this.selectedActivity = this.activities.get(id);
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.loading = false;
                this.activities.delete(id);
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false)
        }
    }

    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSelectedActivity();
        this.editMode = true;
    }

    closeForm = () => {
        this.editMode = false;
    }

    createOrEditActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            if (activity.id) {
                await agent.Activities.update(activity);
                runInAction(() =>
                    this.activities.set(activity.id, activity))
            }
            else {
                await agent.Activities.create({ ...activity, id: uuid() });
                runInAction(() =>{
                    activity.id = uuid();
                    this.activities.set(activity.id, activity);
                })
            }
        } catch (error) {
            console.log(error);
        }
        runInAction(() => {
            this.editMode = false;
            this.loading = false;
            this.selectedActivity = activity;
        })

    }
}