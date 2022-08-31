import React, { useState, useEffect } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';

const SetPicker = props => {

    //STATE
    const [value, setValue] = useState('');
    const [needToRefresh, setNeedToRefresh] = useState(false);
    const [setsRaw, setSetsRaw] = useState([]);
    //ACTIONS
    //GRAPHQL QUERIES AND MUTATIONS
    const setsQuery = gql` query sets {
        sets {
            _id
            title
        }
    }`;
    //LIFECYCLE
    const loadSets = () => {
        props.client.query({
            query:setsQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            setSetsRaw(data.sets)
            setNeedToRefresh(false);
            if(props.didRefresh != undefined){
                props.didRefresh()
            }
        })
    }
    useEffect(() => {
        loadSets();
    },[])
    useEffect(()=>{
        if(needToRefresh || props.needToRefresh){
            loadSets();
        }
    })
    
    return (
        <div className="select is-link">
            <select onChange={props.onChange}>
                <option value="" selected disabled hidden>Choisir un set ...</option>
                {setsRaw.map(x=>{
                    return(
                        <option value={x._id}>
                            {x.title}
                        </option>
                    )
                })}
            </select>
        </div>      
    )    
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(SetPicker);