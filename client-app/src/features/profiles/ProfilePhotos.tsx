import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent, useState } from 'react';
import { Card, Header, Tab, Image, Grid, Button } from 'semantic-ui-react';
import PhotoUploadWidget from '../../app/common/imageUpload/PhotoUploadWidget';
import { Photo, Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';

interface Props {
    profile: Profile;
}

export default observer(function ProfilePhotos({ profile }: Props) {
    const { profileStore: { isCurrentUser, uploading, loading,
        uploadPhoto, setMainPhoto,deletePhoto,loadingProfile } } = useStore();
    const [uploadPhotoMode, setUploadPhotoMode] = useState(false);
    const [target, setTarget] = useState('');

    function handlePhotoUpload(file:Blob){
        uploadPhoto(file).then(() => setUploadPhotoMode(false));
    }

    function handleSetMainPhoto(photo:Photo, e:SyntheticEvent<HTMLButtonElement>){
        setTarget(e.currentTarget.name);
        setMainPhoto(photo);
    }

    function handleDeletePhoto(photo:Photo, e:SyntheticEvent<HTMLButtonElement>){
        setTarget(e.currentTarget.name);
        deletePhoto(photo);
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header icon='image' content='Photos' />
                    {isCurrentUser &&
                        <Button
                            basic
                            floated='right'
                            content={uploadPhotoMode ? 'Cancel' : 'Add Photo'}
                            onClick={() => setUploadPhotoMode(!uploadPhotoMode)}
                        />}
                </Grid.Column>
                <Grid.Column width={16}>
                    {uploadPhotoMode
                        ? <PhotoUploadWidget uploadPhoto={handlePhotoUpload} uploading={uploading}/>
                        : <Card.Group itemsPerRow={5}>
                            {profile.photos?.map(photo => (
                                <Card key={photo.id}>
                                    <Image src={photo.url} />
                                    {isCurrentUser && (
                                        <Button.Group fluid widths={2}>
                                            <Button 
                                                basic
                                                color='green'
                                                content='Main'
                                                name={photo.id}
                                                disabled={photo.isMain}
                                                loading={loadingProfile && (photo.id===target)}
                                                onClick={(e) => handleSetMainPhoto(photo,e)}
                                            />
                                            <Button 
                                                basic 
                                                color='red'
                                                icon='trash'
                                                name={photo.id}
                                                disabled={photo.isMain}
                                                loading={loading && photo.id===target}
                                                onClick={(e) => handleDeletePhoto(photo,e)}
                                            
                                            />
                                        </Button.Group>
                                    )}
                                </Card>
                            ))}
                        </Card.Group>}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})