import { ErrorMessage, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import { Button, Form } from 'semantic-ui-react';
import React from 'react';
import { Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';
import * as Yup from 'yup';
import ValidationErrors from '../errors/ValidationErrors';
import MyTextInput from '../../app/common/form/MyTextInput';
import MyTextArea from '../../app/common/form/MyTextArea';

interface Props{
    profile:Profile;
    setEditMode:(editMode:boolean) => void;
}

export default observer ( function ProfileEditForm({profile, setEditMode}:Props){
    const {profileStore:{updateProfile}} = useStore();
    return(
        <Formik
            initialValues={{ displayName: '', bio: '', error: null }}
            onSubmit={(values, { setErrors }) => 
                updateProfile(values)
                .then(() =>setEditMode(false))
                .catch(error => setErrors({ error }))  
            }
            validationSchema={Yup.object({
                displayName: Yup.string().required(),
                bio: Yup.string(),
            })}
        >
            {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
                <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off'>
                    <MyTextInput
                        placeholder='Display Name'
                        name='displayName' />
                    <MyTextArea
                        placeholder='Bio'
                        name='bio' 
                        rows={3} />
                    <ErrorMessage
                        name='error'
                        render={() =>
                            <ValidationErrors errors={errors.error}/>}
                    />
                    <Button
                        disabled={!dirty || !isValid || isSubmitting}
                        loading={isSubmitting}
                        content='Submit'
                        type='submit'
                        positive
                        fluid />
                </Form>
            )}
        </Formik>
    )
})