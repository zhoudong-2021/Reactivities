import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Photo, Profile } from "../models/profile";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    followings: Profile[] = [];
    tabSelected = 0;

    constructor() {
        makeAutoObservable(this);
        reaction(
            () => this.tabSelected,
            tabSelected => {
            if(tabSelected === 3 || tabSelected === 4){
                var predicate = tabSelected===3 ? 'followers' : 'following';
                this.loadFollowings(predicate);
            }
            else{
                this.followings = [];
            }
        })
    }

    setTabSelected = (value:any) =>{
        this.tabSelected = value;
    }

    get isCurrentUser() {
        if (store.userStore.user && this.profile) {
            return store.userStore.user.username === this.profile.username;
        }
        return false;
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            var profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loadingProfile = false;
            })
        }
    }

    updateProfile = async (profile: Partial<Profile>) => {
        this.loadingProfile = true;
        try {
            await agent.Profiles.update(profile);
            runInAction(() => {
                this.profile = { ...this.profile, ...profile as Profile };
                if (profile.displayName)
                    store.userStore.setDisplayName(profile.displayName);
                store.activityStore.setNeedReloading(true);
                this.loadingProfile = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingProfile = false);
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            let { data } = await agent.Profiles.uploadPhoto(file);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.push(data);
                    if (data.isMain && store.userStore.user) {
                        store.userStore.setImage(data.url);
                        this.profile.image = data.url;
                    }
                }
                this.uploading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.uploading = false);
        }
    }

    deletePhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos = this.profile.photos.filter(x => x.id !== photo.id);
                }
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);

        }
    }

    setMainPhoto = async (photo: Photo) => {
        this.loadingProfile = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(x => x.isMain)!.isMain = false;
                    this.profile.photos.find(x => x.id === photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                    if (store.userStore.user)
                        store.userStore.user.image = photo.url;
                }
                this.loadingProfile = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingProfile = false);
        }
    }

    updateFollowing = async (username: string, toFollow: boolean) => {
        this.loading = true;
        try {
            await agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFollowing(username);
            runInAction(() => {
                if(this.profile && this.profile.username === username){
                    toFollow ? this.profile.followerCount!++ : this.profile.followerCount!--;
                    this.profile.isFollowing = !this.profile.isFollowing;
                }

                if(this.profile && this.profile.username === store.userStore.user?.username){
                    toFollow ? this.profile.followingCount!++ : this.profile.followingCount!--;
                    this.profile.isFollowing = !this.profile.isFollowing;
                }

                this.followings.forEach(profile => {
                    if(profile.username === username){
                        profile.isFollowing ? profile.followerCount!-- : profile.followerCount!++;
                        profile.isFollowing = !profile.isFollowing;
                    }
                })

                this.loading = false;
            })

        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }

    loadFollowings = async (predicate:string) => {
        this.loading = true;
        try {
            var result = await agent.Profiles.listFollowings(this.profile!.username, predicate);
            runInAction(() => {
                this.followings = result;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
            
        }
    }
}