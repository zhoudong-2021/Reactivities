import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/user";
import { store } from "./store";
import { history } from "../..";
import CommonStore from "./commonStore";

export default class UserStore {
    user: User | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return !!this.user;
    }

    login = async (user: UserFormValues) => {
        try {
            var result = await agent.Account.login(user);
            store.commonStore.setToken(result.token);
            store.commonStore.setAppLoaded(true);
            runInAction(() => this.user = result);
            store.modalStore.closeModal();
            history.push('/activities'); 
        } catch (error) {
            throw error;
        }
    }

    logout = () => {
        this.user = null;
        store.commonStore.setToken(null);
        history.push('/');
    }

    register = async (user: UserFormValues) => {
        try {
            var result = await agent.Account.register(user);
            store.commonStore.setToken(result.token);
            store.commonStore.setAppLoaded(true);
            runInAction(() => this.user = result);
            store.modalStore.closeModal();
            history.push('/activities'); 
        } catch (error) {
            throw error;
        }
    }

    getUser = async() => {
        try {
            const user = await agent.Account.current();
            runInAction(() => {
                this.user = user;
            })
        } catch (error) {
            console.log(error);
        }
    }
}