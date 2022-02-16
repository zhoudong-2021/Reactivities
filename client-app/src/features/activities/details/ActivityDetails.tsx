import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react'
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedSideBar from './ActivityDetailedSideBar';



export default observer(function ActivityDetails() {
    const {id} = useParams<{id:string}>();
    const { activityStore } = useStore();
    const { selectedActivity: activity, loadActivity, loadingInitial, clearSelectedActivity } = activityStore;
    
    useEffect(() => {
        if(id) loadActivity(id);
        return () => clearSelectedActivity();
    },[loadActivity, id, clearSelectedActivity]);
    
    
    if (!activity || loadingInitial) return <LoadingComponent inverted={false} content={''}/>;

    return (
        <Grid >
            <Grid.Column width={10}>
                <ActivityDetailedHeader/>
                <ActivityDetailedInfo activity={activity}/>
                <ActivityDetailedChat activityId={activity.id}/>
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSideBar activity={activity}/>
            </Grid.Column>
        </Grid>
    )
})