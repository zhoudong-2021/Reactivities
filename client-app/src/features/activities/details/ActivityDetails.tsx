import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Button, Card, Image } from 'semantic-ui-react'
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';



export default observer(function ActivityDetails() {
    const {id} = useParams<{id:string}>();
    const { activityStore } = useStore();
    const { selectedActivity: activity, loadActivity, loadingInitial } = activityStore;
    useEffect(() => {
        if(id) loadActivity(id);
    },[loadActivity, id]);
    
    
    if (!activity || loadingInitial) return <LoadingComponent inverted={false} content={''}/>;

    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta>
                    <span>{activity.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group width={2}>
                    <Button
                        as={NavLink}
                        to={`/edit/${activity.id}`}
                        basic
                        color='blue'
                        content='Edit'
                    />
                    <Button
                        basic
                        color='grey'
                        content='Cancel'
                        as={NavLink}
                        to='/activities'
                    />
                </Button.Group>
            </Card.Content>
        </Card>
    )
})