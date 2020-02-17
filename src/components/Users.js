import React from 'react'
import {useState, useEffect} from 'react'

const Users = (props) => {

    //initial table col filters, all set to null
    const initialFilterObj = {
        first_name : null,
        last_name : null,
        company_name : null,
        city : null, state : null, zip : null,
        email : null, web : null, age : null
    }
    const [filters, setFilters] = useState(initialFilterObj)
    //filter for first_name field
    const [textFilter, setTextFilter] = useState('')

    const pageSize = 5; //constant
    const [totalRecords, setTotalRecords] = useState(0)
    const [pageActive, setPageActive] = useState(null)

    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])
    const [paginatedUsers, setPaginatedUsers] = useState([])

    useEffect(() => {
        if(users.length) {
            //after the first call to fetchData is complete, activate the first page of pagination
            goToPage(1)
        } else {
            //for the very first time
            fetchData();
        }
        //check for change in users array
    }, [users])

    const fetchData = async () => {
        setLoading(true)
        await fetch('https://api.jsonbin.io/b/5e47d5219c65d21641ac2780', {
            headers : {
                'secret-key' : '$2b$10$ezky8AZKxQnp7G0q/DJ5euWdV26JDcFA1bjXSwHUhgqgLdrMid9lu'
            }
        })
        .then(res => res.json())
        .then( responseUsers => {
            // console.log('responseUsers : ', responseUsers)
            setTotalRecords(responseUsers.length)
            setUsers(responseUsers)
            setLoading(false)
        }).catch(err => {
            console.log('error in fetching users : ', err)
            setLoading(false)
        })
    }

    const goToPage = (pageNum) => {
        if(pageNum === pageActive || pageNum === 0 || pageNum > numOfPages) return;
        let end = pageNum*pageSize;
        let start = end-pageSize;
        const arr = users.slice(start, end)
        setPageActive(pageNum)
        setPaginatedUsers(arr)
        //reset the filters on page change as well
        setFilters(initialFilterObj)
        setTextFilter('')
    }

    const renderPagination = () => {
        let arr = []
        for(let i=0; i<numOfPages; i++) {
            arr[i] = (
                <div 
                    key={i} 
                    className={`page ${pageActive-1 === i ? 'active' : ''}`}
                    onClick={()=>{  goToPage(i+1)  }}
                >
                    {i+1}
                </div>
            )
        }
        return arr
    }

    const numOfPages = totalRecords > 0 && totalRecords/pageSize > 1 ? Math.ceil(totalRecords/pageSize) : null
    
    const handleRowClick = (id, user) => {
        //passing the user obj down the route
        props.history.push(`/user/${id}`, {user})
    }

    const sortArray = (key, isAsc) => {
        let newArr = paginatedUsers.sort((a,b) => {
            let val1 = a[key], val2 = b[key]
            if(typeof a[key] === 'string') {
                val1 = a[key].toUpperCase();
                val2 = b[key].toUpperCase();
            }
            let comparison = 0;
            if(val1 > val2) {
                comparison = 1;
            } else if(val1 <= val2) {
                comparison = -1
            }
            if(!isAsc) comparison = comparison*-1
            return comparison
        })
        setPaginatedUsers(newArr)
    }

    //table col filters
    const toggleFilter = (filterKey) => {
        if(filters[filterKey] === null || filters[filterKey] === 0) {
            //call the ascending sorting method
            sortArray(filterKey, true)
            setFilters({...filters, [filterKey] : 1})
        } else if(filters[filterKey] === 1) {
            //call the descending sorting method
            sortArray(filterKey, false)
            setFilters({...filters, [filterKey] : 0})
        }
    }

    const filterByFirstName = (singleUser) => {
        //textFilter works case insensitive
        const tf = textFilter.toLowerCase()
        const row = (singleUser.first_name.toLowerCase().includes(tf) ? createRow(singleUser) : null)
        return row;
    }

    //make the row for table only after filter checks have been applied
    const createRow = (singleUser) => {
        return (
            <tr className='table_data' key = {singleUser.id} onClick={()=>handleRowClick(singleUser.id, singleUser)}>
                <td style={{minWidth:'100px'}}>{singleUser.first_name}</td>
                <td style={{minWidth:'100px'}}>{singleUser.last_name}</td>
                <td>{singleUser.company_name}</td>
                <td>{singleUser.city}</td>
                <td>{singleUser.state}</td>
                <td>{singleUser.zip}</td>
                <td>{singleUser.email}</td>
                <td>{singleUser.web}</td>
                <td>{singleUser.age}</td>
            </tr>
        )
    }

    return( 
        <React.Fragment>
            {/* top header */}
            <div className='header'>
                <div className='menu_icon'></div>
                <div>Data Peace</div>
            </div>
            {/* text filter */}
            <div className='text_filter'>
                <div className='input_wrapper'>
                    <input 
                        type = "text" 
                        placeholder = "Search by first name" 
                        value={textFilter}
                        onChange={(e)=>setTextFilter(e.target.value)}
                    />
                    {
                        textFilter !== '' ? (
                            <span title='Clear Text Filter' className='clear_input' onClick={()=>setTextFilter('')}>Clear </span>
                        ) : null
                    }
                </div>
                {   /*same logic as calculating the start and end in goToPage*/
                    totalRecords ? (
                        <span>{pageActive*pageSize-4} to {pageActive*pageSize} of { totalRecords }</span>
                    ) : null
                }
            </div>
            {/* user listing */}
            <div className='users'>
                {   /* if the api call is still going on return the string else check for the array*/
                    loading ? 'Fetching data...' :
                    (paginatedUsers.length === 0 ?
                        'No data available' : (
                            <table className='table'>
                                <thead>
                                <tr className='table_header'>
                                    <th className={`${filters.first_name ? 'filterAsc' : 'filterDesc' } `} 
                                    onClick = {() => toggleFilter('first_name')}>
                                        First Name
                                    </th>
                                    <th className={`${filters.last_name ? 'filterAsc' : 'filterDesc' } `}
                                    onClick = {() => toggleFilter('last_name')}>
                                        Last Name
                                    </th>
                                    <th className={`${filters.company_name ? 'filterAsc' : 'filterDesc' } `}
                                    onClick = {() => toggleFilter('company_name')}>
                                        Company Name
                                    </th>
                                    <th className={`${filters.city ? 'filterAsc' : 'filterDesc' } `}
                                    onClick = {() => toggleFilter('city')}>
                                        City
                                    </th>
                                    <th className={`${filters.state ? 'filterAsc' : 'filterDesc' } `}
                                    onClick = {() => toggleFilter('state')}>
                                        State
                                    </th>
                                    <th className={`${filters.zip ? 'filterAsc' : 'filterDesc' } `}
                                    onClick = {() => toggleFilter('zip')}>
                                        Zip
                                    </th>
                                    <th className={`${filters.email ? 'filterAsc' : 'filterDesc' } `}
                                    onClick = {() => toggleFilter('email')}>
                                        Email
                                    </th>
                                    <th className={`${filters.web ? 'filterAsc' : 'filterDesc' } `}
                                    onClick = {() => toggleFilter('web')}>
                                        Web
                                    </th>
                                    <th className={`${filters.age ? 'filterAsc' : 'filterDesc' } `}
                                    onClick = {() => toggleFilter('age')}>
                                        Age
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                    {
                                        paginatedUsers.map(user => filterByFirstName(user))
                                    }
                                </tbody>
                            </table>
                        )
                    )
                }
            </div>
            {/* paginaton */}
            <div className='pagination_wrapper'>
                <div className='pagination'>
                {   /* render pagination only if there are sufficient records */
                    numOfPages ? (
                        renderPagination()
                    ) : null
                }
                </div>
            </div>
        </React.Fragment>
    )
    
}

export default Users