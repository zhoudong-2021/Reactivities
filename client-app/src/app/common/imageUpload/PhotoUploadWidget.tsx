import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Button, Grid, Header} from 'semantic-ui-react';
import PhotoWidgetCropper from './PhotoWidgetCropper';
import PhotoWidgetDropzone from './PhotoWidgetDropzone';

interface Props{
    uploading:boolean;
    uploadPhoto:(file:Blob) => void;
}

export default observer(function PhotoUploadWidget({uploading, uploadPhoto}:Props){
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>();

    function onCrop(){
        if(cropper){
            cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!));
        }
    }

    // Clear memory of URL
    useEffect(() => {
        return () => {
            files.map((file:any) => URL.revokeObjectURL(file.preview));
        }
    }, [files])

    return(
        <Grid>
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 1 - Add Photo'/>
                <PhotoWidgetDropzone setFiles={setFiles}/>
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 2 - Resize image'/>
                {files && files.length > 0 &&
                    <PhotoWidgetCropper 
                        setCropper={setCropper}
                        imagePreview={files[0].preview} 
                    />
                }
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 3 - Preview & Upload'/>
                {files && files.length > 0 &&
                <>
                <div className='img-preview' style={{minHeight:200, overflow:'hidden'}}/>
                <Button.Group widths={2}>
                    <Button loading={uploading} onClick={onCrop} positive icon='check'/>
                    <Button disabled={uploading} onClick={() => setFiles([])} icon='close'/>
                </Button.Group>
                </>}
            </Grid.Column>
        </Grid>
    )
})