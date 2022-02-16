import { formatDistanceToNow } from 'date-fns'
import { Formik, Form, Field, FieldProps } from 'formik'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Segment, Header, Comment, Loader } from 'semantic-ui-react'
import * as Yup from 'yup';
import { useStore } from '../../../app/stores/store'

interface Props {
    activityId: string;
}

export default observer(function ActivityDetailedChat({ activityId }: Props) {
    const { commentStore: { createHubConnection, clearHubConnection,
        comments, addComment } } = useStore();

    useEffect(() => {
        if (activityId) createHubConnection(activityId);
        return () => clearHubConnection();
    }, [createHubConnection, activityId])

    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{ border: 'none' }}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing>
            <Formik
                        initialValues={{ body: '' }}
                        onSubmit={(values, { resetForm }) => {
                            addComment(values).then(() => resetForm());
                        }}
                        validationSchema={Yup.object({
                            body: Yup.string().required()
                        })}
                        >
                        {({ isSubmitting, isValid, handleSubmit }) => (
                            <Form className='ui form'>
                                <Field name='body'>
                                    {(props:FieldProps) => (
                                        <div style={{position:'relative'}}>
                                            <Loader active={isSubmitting}/>
                                            <textarea
                                                placeholder='Enter your comment 
                                                (Enter to submit, SHIFT + enter for new line)'
                                                rows={2}
                                                {...props.field}
                                                onKeyPress={e => {
                                                    if(e.key === 'Enter' && e.shiftKey){
                                                        return;
                                                    }
                                                    if(e.key === 'Enter' && !e.shiftKey){
                                                        e.preventDefault();
                                                        isValid && handleSubmit();
                                                    }
                                                }}
                                            />                              
                                        </div>
                                    )}
                                </Field>
                            </Form>
                        )}
                    </Formik>
                <Comment.Group>
                    {comments.map(comment => (
                        <Comment key={comment.id}>
                            <Comment.Avatar src={comment.image || '/assets/user.png'} />
                            <Comment.Content>
                                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>
                                    {comment.displayName}</Comment.Author>
                                <Comment.Metadata>
                                    <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                                </Comment.Metadata>
                                <Comment.Text style ={{whiteSpace:'pre-wrap'}}>{comment.body}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    ))}

                   


                </Comment.Group>
            </Segment>
        </>

    )
})