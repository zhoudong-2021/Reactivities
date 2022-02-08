import { ErrorMessage, Form, Formik, validateYupSchema } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, Header, Label } from 'semantic-ui-react';
import MyTextInput from '../../app/common/form/MyTextInput';
import { useStore } from '../../app/stores/store';
import * as Yup from 'yup';
import ValidationErrors from '../errors/ValidationErrors';

export default observer(function RegisterForm() {
    const { userStore: { register } } = useStore();
    return (
        <Formik
            initialValues={{ username: '', displayName: '', email: '', password: '', error: null }}
            onSubmit={(values, { setErrors }) => register(values)
                .catch(error => setErrors({ error }))}
            validationSchema={Yup.object({
                displayName: Yup.string().required(),
                username: Yup.string().required(),
                email: Yup.string().required().email(),
                password: Yup.string().required(),
            })}
        >
            {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
                <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off'>
                    <Header
                        as='h2'
                        color='teal'
                        textAlign='center'
                        content='Register Your Account'
                    />
                    <MyTextInput
                        placeholder='Username'
                        name='username' />
                    <MyTextInput
                        placeholder='Display Name'
                        name='displayName' />
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
                            <ValidationErrors errors={errors.error}/>}
                    />
                    <Button
                        disabled={!dirty || !isValid || isSubmitting}
                        loading={isSubmitting}
                        content='Register'
                        type='submit'
                        positive
                        fluid />
                </Form>
            )}
        </Formik>
    )
})