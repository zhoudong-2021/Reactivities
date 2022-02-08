import { ErrorMessage, Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, Header, Label } from 'semantic-ui-react';
import MyTextInput from '../../app/common/form/MyTextInput';
import { useStore } from '../../app/stores/store';

export default observer(function LoginForm() {
    const { userStore: { login } } = useStore();
    return (
        <Formik
            initialValues={{ email: '', password: '', error: null }}
            onSubmit={(values, { setErrors }) => login(values).catch(error => setErrors({ error: "Invalid username or password" }))}
        >
            {({ handleSubmit, isSubmitting, errors }) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <Header 
                    as='h2' 
                    color='teal'
                    textAlign='center'
                    content='Login to Reactivities' 
                    />
                    <MyTextInput
                        placeholder='Email'
                        name='email' />
                    <MyTextInput
                        placeholder='Password'
                        name='password'
                        type='password' />
                    <ErrorMessage
                        name='error'
                        render={() =>
                            <Label
                                basic
                                color='red'
                                content={errors.error}
                                style={{ marginBottom: 10 }}
                            />}
                    />
                    <Button
                        loading={isSubmitting}
                        content='Login'
                        type='submit'
                        positive
                        fluid />
                </Form>
            )}
        </Formik>
    )
})