import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Button, Header, Item, Segment, Image, Label } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';

const activityImageStyle = {
    filter: 'brightness(30%)'
};

const activityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

export default observer(function ActivityDetailedHeader() {
    const { activityStore } = useStore();
    const { loading, selectedActivity: activity, updateAttendance, cancelActivityToggle } = activityStore;

    if (activity === undefined) return null;


    return (
        <Segment.Group>
            <Segment basic attached='top' style={{ padding: '0' }}>
                {activity.isCancelled &&
                    <Label style={{ position: 'absolute', zIndex: 1000, left: -14, top: 20 }}
                        ribbon color='red' content='Cancelled' />
                }
                <Image src={`/assets/categoryImages/${activity.category}.jpg`} fluid style={activityImageStyle} />
                <Segment style={activityImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={activity.title}
                                    style={{ color: 'white' }}
                                />
                                <p>{format(activity.date!, 'dd MMM yyyy h:mm aa')}</p>
                                <p>
                                    Hosted by <strong>
                                        <Link to={`/profiles/${activity.host?.username}`}>
                                            {activity.host?.displayName}
                                        </Link>
                                    </strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                {activity.isHost ?
                    <>
                        <Button color={activity.isCancelled ? 'green' : 'red'}
                            floated='left'
                            basic
                            content={activity.isCancelled ? 'Activate Event' : 'Cancel Event'}
                            onClick={cancelActivityToggle}
                            loading={loading}
                        />
                        <Button as={Link}
                            disabled={activity.isCancelled}
                            to={`/edit/${activity.id}`}
                            color='orange'
                            floated='right'>
                            Manage Event
                        </Button>
                    </>
                    : activity.isGoing
                        ? <Button
                            onClick={updateAttendance}
                            loading={loading}
                        >Cancel attendance</Button>
                        : <Button
                            disabled={activity.isCancelled}
                            onClick={updateAttendance}
                            loading={loading}
                            color='teal'>
                            Join Activity</Button>}
            </Segment>
        </Segment.Group>
    )
})