import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
import { v4 as uuid } from 'uuid';
import { format } from "date-fns";
import { store } from "./store";
import { UserProfile } from "../models/profile";
import { Pagination, PagingParams } from "../models/pagination";

export default class ActivityStore {
    activities = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;
    needReloading = false;
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    predicate = new Map().set('all', true);

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.predicate.keys(),
            () => {
                this.pagingParams = new PagingParams();
                this.activities.clear();
                this.loadActivities();
            }

        )
    }

    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const response = await agent.Activities.list(this.axiosParams);
            runInAction(() => {
                response.data.map(item =>
                    this.setActivity(item)
                );
                this.setPagination(response.pagination);
                this.loadingInitial = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingInitial = false)
        }
    }

    setPredicate = (key: string, value: string | Date) => {
        this.predicate.forEach((value, key) => {
            if (key !== 'startDate') this.predicate.delete(key);
        })

        switch (key) {
            case 'all':
                this.predicate.set('all', value);
                break;
            case 'isHost':
                this.predicate.set('isHost', value);
                break;
            case 'isGoing':
                this.predicate.set('isGoing', value);
                break;
            default:
                this.predicate.delete('startDate');
                this.predicate.set('startDate', value);
                break;
        }
    }

    setPagination = (value: Pagination) => {
        this.pagination = value;
    }

    setPagingParams = (value: PagingParams) => {
        this.pagingParams = value;
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());
        this.predicate.forEach((value, key) => {
            if (key === 'startDate')
                params.append(key, (value as Date).toISOString());
            else
                params.append(key, value);
        })
        return params;
    }

    get activitiesOrderByDate() {
        return Array.from(this.activities.values()).sort((a, b) => a.date!.getTime() - b.date!.getTime())
    }


    get groupedActivities() {
        return Object.entries(this.activitiesOrderByDate.reduce((activities, activity) => {
            const date = format(activity.date!, 'dd MMM yyyy');
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
        }, {} as { [key: string]: Activity[] }))
    }

    loadActivity = async (id: string) => {
        let activity = this.activities.get(id);
        if (activity) {
            this.selectedActivity = activity;
        }
        else {
            this.loadingInitial = true;
            activity = await agent.Activities.details(id);
            runInAction(() => {
                if (activity) {
                    this.setActivity(activity);
                    this.selectedActivity = activity;
                }
                this.loadingInitial = false;
            });
        }
        return activity;
    }

    setActivity = (item: Activity) => {
        var user = store.userStore.user;
        if (user) {
            item.isGoing = item.attendees?.some(x => x.username === user?.username);
            item.isHost = (item.hostUsername === user.username);
            item.host = item.attendees?.find(x => x.username === item.hostUsername);
        }
        item.date = new Date(item.date!);
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

    createOrEditActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new UserProfile(user!);
        let id = activity.id;
        try {
            if (id) {
                await agent.Activities.update(activity);
                const originalActivity = await this.loadActivity(id!);
                runInAction(() => {
                    let updatedActivity = { ...originalActivity, ...activity };
                    this.selectedActivity = updatedActivity;
                    this.activities.set(id!, updatedActivity);
                });
            }
            else {
                activity.id = uuid();
                await agent.Activities.create(activity);
                const newActivity = new Activity(activity);
                newActivity.hostUsername = user!.username;
                newActivity.attendees = [attendee];
                this.setActivity(newActivity);
                runInAction(() => {
                    this.selectedActivity = newActivity;
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    updateAttendance = async () => {
        var user = store.userStore.user;
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity!.isGoing = false;
                    this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(
                        x => x.username !== user?.username);
                }
                else {
                    var userProfile = new UserProfile(user!);
                    this.selectedActivity!.isGoing = true;
                    this.selectedActivity?.attendees!.push(userProfile);
                }
                this.activities.set(this.selectedActivity!.id, this.selectedActivity!);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() =>
                this.loading = false
            )
        }
    }

    cancelActivityToggle = async () => {
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity!.isCancelled;
                this.activities.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        } catch (error) {
            console.log(error);

        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    setNeedReloading = (state: boolean) => {
        this.needReloading = state;
    }

    clearSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    updateAttendeeFollowing = (username: string) => {
        this.activities.forEach(activity => {
            activity.attendees.forEach(attendee => {
                if (attendee.username === username) {
                    attendee.isFollowing ? attendee.followerCount!-- : attendee.followerCount!++;
                    attendee.isFollowing = !attendee.isFollowing;
                }
            })
        })
    }
}