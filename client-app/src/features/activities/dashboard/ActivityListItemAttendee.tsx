import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Image, List, Popup } from 'semantic-ui-react';
import { Profile } from '../../../app/models/profile';
import ProfileCard from '../../profiles/ProfileCard';

interface Props {
    attendees: Profile[];
}

export default observer(function ActivityListItemAttendee({ attendees }: Props) {
    const style = {
        borderWidth: 3,
        borderColor: 'orange'
    }

    return (
        <List horizontal>
            {attendees.map(attendee => (
                <Popup
                    hoverable
                    key={attendee.username}
                    trigger={
                        <List.Item  key={attendee.username} as={Link} to={`/profiles/${attendee.username}`}>
                            <Image 
                                bordered
                                size='mini' 
                                circular 
                                src={attendee.image || '/assets/user.png'} 
                                style={attendee.isFollowing ? style : undefined}
                                />
                        </List.Item>
                    }
                >
                    <Popup.Content>
                        <ProfileCard profile={attendee}/>
                    </Popup.Content>
                </Popup>

            ))}
        </List>
    )
})

