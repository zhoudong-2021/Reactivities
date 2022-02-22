import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { PagingParams } from '../../../app/models/pagination';
import { useStore } from '../../../app/stores/store';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';


export default observer(function ActivityDashboard() {
    const { activityStore } = useStore();
    const { loadingInitial, loadActivities, activitiesOrderByDate,
        needReloading, setNeedReloading, setPagingParams, pagination } = activityStore;
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        if (activitiesOrderByDate.length < 2 || needReloading) {
            loadActivities();
            setNeedReloading(false);
        };
    }, [loadActivities, activitiesOrderByDate, setNeedReloading, needReloading]);

    function loadMoreActivities() {
        setLoadingMore(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadActivities().then(() => setLoadingMore(false));

    }

    return (
        <Grid>
            <Grid.Column width={10}>
                {(loadingInitial && !loadingMore) ? (
                    <>
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                    </>
                ) : (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={loadMoreActivities}
                        hasMore={!loadingMore && !!pagination &&
                            pagination.totalPages > pagination.currentPage}
                    >
                        <ActivityList />
                    </InfiniteScroll>
                )}

            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityFilters />
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingMore} />
            </Grid.Column>
        </Grid>
    )
})