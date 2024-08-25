import {useState, useEffect} from 'react';
import {
    Header,
    Icon,
    Loader,
    Popup,
} from 'semantic-ui-react'
import {DataTable} from './components/DataTable'
import {Pagination} from './components/Pagination'
/*import { gql, useQuery } from '@apollo/client';*/
import {fetchToApi} from "./libs/fetch.js";
import {
    formatDate,
    isToday,
    sortByColumnId,
    sortByDate,
    sortByFirmwareVersion, sortByStatus
} from "./libs/utils.js";

/*const data = [
  { iconExample: true }, {}, {}, {}, {}, {}, {}, {}, {}, {},
]*/

const UpToDateIcon = () => {
    const icon = <Icon name="checkmark" color="green"/>;
    return <Popup content="Up to Date" trigger={icon}/>;
};

const UpdateInProgressIcon = () => {
    const icon = <Loader active inline size="tiny"/>;
    return <Popup content="Update In Progress" trigger={icon}/>;
}

const UnauthorizedUserIcon = () => {
    const icon = <Icon name="warning sign" color="yellow"/>;
    return <Popup content="Not Authorized" trigger={icon}/>;
}

function App() {

    const [devicesData, setDevicesData] = useState()
    const [latestVersion, setLatestVersion] = useState()
    const [loading, setLoading] = useState(true)
    const [size, setSize] = useState(10)
    const [totalPage, setTotalPage] = useState(0)
    const [current, setCurrent] = useState(1)
    const [sortColumn, setSortColumn] = useState('user');
    const [sortDirection, setSortDirection] = useState('desc');
    const [error, setError] = useState(null);


    const columns = [
        {
            id: 'status',
            render: (row) => (
                <>
                    {!row.last_update && latestVersion !== row.version ? <UpdateInProgressIcon/> : null}
                    {latestVersion === row.version && <UpToDateIcon/>}
                </>
            ),
            collapsing: true
        },
        {
            id: 'user',
            header: 'User',
            render: (row) => (
                <>
                    {row.email}
                    &nbsp;
                    {!row.is_admin && <UnauthorizedUserIcon/>}
                </>
            ),
        },
        {
            id: 'name',
            header: 'Name',
            render: (row) => (<>{row.device_name}</>),
        },
        {
            id: 'version',
            header: 'Firmware',
            render: (row) => (<>{row.version}</>),
        },
        {
            id: 'updated',
            header: 'Last Updated',
            render: (row) => (<>{isToday(row.last_update) ? "Today" : formatDate(row.last_update)}</>),
        },
    ]

    const fetchDataBySortingBackend = async (columnId,direction) => {
        setLoading(true)
        setSortColumn(columnId);
        setSortDirection(direction);
        const response = await fetchToApi(`/devices-with-sorting?page=${current}&pageSize=${size}&sortColumn=${columnId}&sortDirection=${direction}`)
        if(response.is_error){
            setError("Error: "+response.data)
        }else{
            setDevicesData(response.data.deviceWithAllData);
            setLatestVersion(response.data.lastFirmwareVersion);
            setTotalPage(response.data.pagination.totalPage);
        }
        setLoading(false)
    }

    const fetchDataBySortingFrontend = async () => {
        setLoading(true)
        const response = await fetchToApi(`/devices?page=${current}&pageSize=${size}`);
        setDevicesData(response.data.deviceWithAllData);
        setLatestVersion(response.data.lastFirmwareVersion);
        setTotalPage(response.data.pagination.totalPage);
        setLoading(false)
    }

    useEffect(() => {
        //fetchDataBySortingFrontend()
        fetchDataBySortingBackend(sortColumn,sortDirection)
    }, [current,size]);


    if (loading) {
        return (
            <Loader active inline="centered"/>
        )
    }

    if (error) {
        return (
            <div>{error}</div>
        )
    }

    const sortDataByFrontendSortingAndBackendPagination = (columnId) => {
        const direction = sortColumn === columnId && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(columnId);
        setSortDirection(direction);
        let sortedData;
        switch (columnId) {
            case "version":
                sortedData = sortByFirmwareVersion(devicesData, columnId, direction);
                break;
            case "updated":
                sortedData = sortByDate(devicesData, columnId, direction);
                break;
            case "status":
                sortedData = sortByStatus(devicesData, latestVersion);
                break;
            default:
                sortedData = sortByColumnId(devicesData, columnId, direction);
                break;
        }
        setDevicesData(sortedData);
    };

    const sortDataByBackendSortingAndPagination = (columnId) => {
        const direction = sortColumn === columnId && sortDirection === 'desc' ? 'asc' : 'desc';
        fetchDataBySortingBackend(columnId,direction)
    };

    return (
        <DataTable
            data={devicesData}
            sortBy="user"
            columns={columns}
            sort={(columnId) => sortDataByBackendSortingAndPagination(columnId)}
            header={<Header>Devices to Update</Header>}
            footer={
                <Pagination
                    current={current}
                    total={totalPage}
                    size={size}
                    sizes={[10, 25, 50]}
                    setCurrent={(newCurrent) => {
                        setCurrent(newCurrent);
                    }}
                    setSize={(newSize) => {
                        setSize(newSize);
                    }}
                />
            }
        />
    );
}

export default App;
