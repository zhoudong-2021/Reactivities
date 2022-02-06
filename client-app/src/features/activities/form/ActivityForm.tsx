import { Formik, Form } from 'formik';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';
import { Activity } from '../../../app/models/activity';

export default observer(function ActivityForm() {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const { activityStore } = useStore();
    const { loadActivity, loading, loadingInitial, createOrEditActivity, selectedActivity } = activityStore;

    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: null,
        city: '',
        venue: '',
    });

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(activity));
    }, [loadActivity, id]);

    const activitySchema = Yup.object({
        title: Yup.string().required("Activity title is required"),
        description: Yup.string().required("Activity description is required"),
        date: Yup.string().required("Activity date is required").nullable(),
        category: Yup.string().required("Activity category is required"),
        city: Yup.string().required(),
        venue: Yup.string().required(),
    })

    const handleFormSubmit = async (activity: Activity) => {
        await createOrEditActivity(activity);
        history.push(`/activities/${selectedActivity!.id}`);
    }

    if (loadingInitial) return <LoadingComponent inverted={true} content={''} />;

    return (
        <Segment clearing>
            <Header content='Activity Details' sub color='teal' />
            <Formik
                validationSchema={activitySchema}
                enableReinitialize
                initialValues={activity}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form
                        className='ui form'
                        onSubmit={handleSubmit}
                        autoComplete='off'
                    >

                        <MyTextInput placeholder='Title' name='title' />
                        <MyTextArea rows={3} placeholder='Description' name='description' />
                        <MySelectInput options={categoryOptions} placeholder='Category' name='category' />
                        <MyDateInput
                            placeholderText='Date'
                            name='date'
                            showTimeSelect
                            timeCaption='time'
                            dateFormat='MMMM d, yyyy, h:mm aa'
                        />
                        <Header content='Location Details' sub color='teal' />
                        <MyTextInput placeholder='City' name='city' />
                        <MyTextInput placeholder='Venue' name='venue' />
                        <Button
                            disabled={isSubmitting || !isValid || !dirty}
                            floated='right'
                            positive
                            type='submit'
                            content='submit'
                            loading={loading}
                        />
                        <Button
                            as={NavLink}
                            to={`/activities`}
                            floated='right'
                            type='button'
                            content='cancel'
                        />
                    </Form>)}
            </Formik>
        </Segment>
    )
})