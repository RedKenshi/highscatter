import { padStart } from "lodash";
import React, { Fragment, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { gql } from 'graphql-tag';
import Button from "../elements/Button";

const DotRow = props => {

    return (
        <Fragment>
            <li>
                <div className={"dot-wrapper" + (props.dot.sub ? " has-subs" : " has-no-subs") }>
                    <div className="dot-row-wrapper">
                        <div className="dot-row-content">
                            <i className="has-text-link fa-duotone fa-location-dot"/>
                            <p>#{props.index}</p>
                            <span className="tag is-link">x : {props.dot.x}</span>
                            <span className="tag is-info">y : {props.dot.y}</span>
                            <span className="tag is-success">z : {props.dot.z}</span>
                        </div>
                        <div className="dot-row-actions">
                            <button onClick={()=>props.showModalDelete(props.dot._id)} className="button is-small is-danger is-light">
                                <i className="fa-light fa-fw fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </li>
        </Fragment>
    )
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export const DotRowContext = withUserContext(DotRow)
export default wrappedInUserContext = withUserContext(DotRow);
