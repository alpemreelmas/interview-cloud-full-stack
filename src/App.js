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
import {displayColumnToQueryColumn} from "./libs/constants.js";

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

const columns = [
    {
        id: 'status',
        render: (row) => row.iconExample && <UpdateInProgressIcon/>,
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
        render: (row) => '1.0.0',
    },
    {
        id: 'updated',
        header: 'Last Updated',
        render: (row) => '2021/06/27',
    },
]


function App() {

    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)
    const [sortColumn, setSortColumn] = useState('user');
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        fetchToApi("/devices").then((data) => {
            setData(data)
        }).finally(() => {
                setLoading(false)
            }
        )
    }, []);

    if (loading) {
        return (
            <Loader active inline="centered"/>
        )
    }

    const sortData = (columnId) => {
        const direction = sortColumn === columnId && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(columnId);
        setSortDirection(direction);
        setData(data.slice().sort((a, b) => {
            if (a[displayColumnToQueryColumn[columnId]] < b[displayColumnToQueryColumn[columnId]]) return direction === 'asc' ? -1 : 1;
            if (a[displayColumnToQueryColumn[columnId]] > b[displayColumnToQueryColumn[columnId]]) return direction === 'asc' ? 1 : -1;
            return 0;
        }));
        console.log(data)
    };

    return (
        <DataTable
            data={data}
            sortBy="user"
            columns={columns}
            sort={(columnId) => sortData(columnId)}
            header={<Header>Devices to Update</Header>}
            footer={
                <Pagination
                    current={1}
                    total={2}
                    size={10}
                    sizes={[10, 25, 50]}
                    setCurrent={(current) => console.log({current})}
                    setSize={(size) => console.log({size})}
                />
            }
        />
    );
}

export default App;
