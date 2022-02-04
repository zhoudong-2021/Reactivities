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
                data.map(item => 
                    this.setActivity(item)
                );
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

    
    get groupedActivities() {
        return Object.entries(this.activitiesOrderByDate.reduce((activities, activity) => {
            const date = activity.date;
            activities[date]= activities[date] ? [...activities[date], activity]:[activity];
            return activities;
        }, {} as {[key:string]: Activity[]}))
    }

    loadActivity = async (id:string) => {
        let activity = this.activities.get(id);
        if(activity) {
            this.selectedActivity = activity;
            
        }
        else{
            this.loadingInitial = true;
            activity = await agent.Activities.details(id);
            runInAction(() => {
                if(activity){
                    this.setActivity(activity);
                    this.selectedActivity = activity;
                }
                this.loadingInitial = false;
            });
        }
        return activity;
    }

    setActivity = (item:Activity) => {
        item.date = item.date.slice(0, 10);
        this.activities.set(item.id, item);
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