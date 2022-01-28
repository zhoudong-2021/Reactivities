import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, Card, Image } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';



export default observer(function ActivityDetails() {

    const { activityStore } = useStore();
    const { selectedActivity: activity, cancelSelectedActivity, openForm } = activityStore;

    if (!activity) return (<>No Activity</>);

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
                        basic
                        color='blue'
                        content='Edit'
                        onClick={() => openForm(activity.id)}
                    />
                    <Button
                        basic
                        color='grey'
                        content='Cancel'
                        onClick={()=>cancelSelectedActivity()}
                    />
                </Button.Group>
            </Card.Content>
        </Card>
    )
})