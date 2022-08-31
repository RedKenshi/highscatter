import React, { useState, useEffect } from "react"
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'graphql-tag';
import DotRow from "../molecules/DotRow";
import _ from 'lodash';
import { Fragment } from "react/cjs/react.production.min";

const Dots = props => {

  const [dotFilter, setDotFilter] = useState('');
  const [formValues, setFormValues] = useState({
        label:'',
        x:0,
        y:0,
        z:0
  });
  const [deleteTargetId, setDeleteTargetId] = useState("");
  const [openModalAdd,setOpenModalAdd] = useState(false);
  const [openModalDelete,setOpenModalDelete] = useState(false);
  const [openModalFlush,setOpenModalFlush] = useState(false);
  const [openModalDummy,setOpenModalDummy] = useState(false);
  const [dotsRaw, setDotsRaw] = useState([]);

  const dotsQuery = gql` query dots {
    dots {
      _id
      label
      x
      y
      z
    }
  }`;
  const flushDotsQuery = gql` mutation flushDots {
    flushDots{
        status
        message
    }
  }`;
  const dummyDotsQuery = gql` mutation dummyDots($n:Int!) {
    dummyDots(n:$n){
        status
        message
    }
  }`;
  const addDotQuery = gql`mutation addDot($x: Float!, $y: Float!, $z: Float!, $label: String){
    addDot(x:$x, y:$y, z:$z, label:$label){
        status
        message
    }
  }`;
  const deleteDotQuery = gql`mutation deleteDot($_id:String!){
    deleteDot(_id:$_id){
        status
        message
    }
  }`;

  const handleFormChange = e => {
    setFormValues({
        ...formValues,
        [e.target.name] : e.target.value
    })
  }
  const addDot = () => {
    props.client.mutate({
        mutation:addDotQuery,
        variables:{
            label:formValues.label,
            x:parseFloat(formValues.x),
            y:parseFloat(formValues.y),
            z:parseFloat(formValues.z)
        }
    }).then((data)=>{
        loadDots();
        closeModalAdd()
        props.toastQRM(data.data.addDot)
    })
  }
  const dummyDot = () => {
    props.client.mutate({
        mutation:dummyDotsQuery,
        variables:{
            n:2000
        }
    }).then((data)=>{
        loadDots();
        closeModalDummy()
        props.toastQRM(data.data.dummyDots)
    })
  }
  const flushDots = () => {
    props.client.mutate({
        mutation:flushDotsQuery,
    }).then((data)=>{
        loadDots();
        closeModalFlush();
        props.toastQRM(data.data.flushDots)
    })
  }
  const deleteDot = () => {
    props.client.mutate({
        mutation:deleteDotQuery,
        variables:{
          _id:deleteTargetId
        }
    }).then((data)=>{
        loadDots();
        closeModalDelete()
        props.toastQRM(data.data.deleteDot)
    })
  }
  const dots = () => {
    return dotsRaw;
  }
  const handleFilter = value => {
    setDotFilter(value);
  }
  const showModalAdd = uid => {
    setOpenModalAdd(true)
  }
  const closeModalAdd = () => {
    setOpenModalAdd(false)
  }
  const showModalFlush = () => {
    setOpenModalFlush(true)
  }
  const closeModalFlush = () => {
    setOpenModalFlush(false)
  }
  const showModalDummy = () => {
    setOpenModalDummy(true)
  }
  const closeModalDummy = () => {
    setOpenModalDummy(false)
  }
  const showModalDelete = _id => {
    setDeleteTargetId(_id);
    setOpenModalDelete(true)
  }
  const closeModalDelete = () => {
    setOpenModalDelete(false)
  }
  const loadDots = () => {
    props.client.query({
      query:dotsQuery,
      fetchPolicy:"network-only",
    }).then(({data})=>{
      setDotsRaw(data.dots);
    })
  }
  useEffect(() => {
    loadDots();
  })

  return (
    <Fragment>
      <div className="dot padded columns">
        <div className="column">
          <ul className="is-fullwidth">
            {dots().map((s,i) => <DotRow key={s._id} loadDots={loadDots} showModalDelete={showModalDelete} dot={s} index={i}/>)}
          </ul>
        </div>
        <div className="column is-narrow">
          <div className="is-fullwidth box">
            <button className='button is-light is-link' onClick={()=>showModalAdd(0)}>
                <i className='fa-regular fa-plus'/>
            </button>
            <button className='button is-light is-danger' onClick={()=>showModalFlush()}>
                <i className='fa-regular fa-trash'/>
            </button>
            <button className='button is-light is-link' onClick={()=>showModalDummy()}>
                <i className='fa-regular fa-shuffle'/>
            </button>
          </div>
        </div>
      </div>
      <div className={"modal" + (openModalAdd != false ? " is-active" : "")}>
        <div className="modal-background"></div>
        <div className="modal-card">
            <header className="modal-card-head">
                <p className="modal-card-title">Créer une dot</p>
                <button className="delete" aria-label="close" onClick={closeModalAdd}/>
            </header>
            <section className="modal-card-body">
              <div className="field">
                <label className="label">Label</label>
                <div className="control">
                  <input className="input" type="text" onChange={handleFormChange} name="label"/>
                </div>
              </div>
              <div className="columns">
                <div className="column">
                  <div className="field">
                    <label className="label">X</label>
                    <div className="control">
                      <input className="input" type="text" onChange={handleFormChange} name="x"/>
                    </div>
                  </div>
                </div>
                <div className="column">
                  <div className="field">
                    <label className="label">Y</label>
                    <div className="control">
                      <input className="input" type="text" onChange={handleFormChange} name="y"/>
                    </div>
                  </div>
                </div>
                <div className="column">
                  <div className="field">
                    <label className="label">Z</label>
                    <div className="control">
                      <input className="input" type="text" onChange={handleFormChange} name="z"/>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          <footer className="modal-card-foot">
            <button className='button' onClick={closeModalAdd}>
                <i className='fa-light fa-arrow-left'/>
                Annuler
            </button>
            <button className="button is-primary" onClick={addDot}>
                <i className='fa-light fa-check'/>
                Créer
            </button>
          </footer>
        </div>
      </div>
      <div className={"modal" + (openModalDelete != false ? " is-active" : "")}>
        <div className="modal-background"></div>
        <div className="modal-card">
            <header className="modal-card-head">
                <p className="modal-card-title">Supprimer le dot</p>
                <button className="delete" aria-label="close" onClick={closeModalDelete}/>
            </header>
            <footer className="modal-card-foot">
                <button className='button' onClick={closeModalDelete}>
                    <i className='fa-light fa-arrow-left'/>
                    Annuler
                </button>
                <button className="button is-danger" onClick={deleteDot}>
                    <i className='fa-light fa-trash'/>
                    Supprimer
                </button>
            </footer>
        </div>
      </div>
      <div className={"modal" + (openModalFlush != false ? " is-active" : "")}>
        <div className="modal-background"></div>
        <div className="modal-card">
            <header className="modal-card-head">
                <p className="modal-card-title">Supprimer tous les dots</p>
                <button className="delete" aria-label="close" onClick={closeModalFlush}/>
            </header>
            <footer className="modal-card-foot">
                <button className='button' onClick={closeModalFlush}>
                    <i className='fa-light fa-arrow-left'/>
                    Annuler
                </button>
                <button className="button is-danger" onClick={flushDots}>
                    <i className='fa-light fa-trash'/>
                    Supprimer tous
                </button>
            </footer>
        </div>
      </div>
      <div className={"modal" + (openModalDummy != false ? " is-active" : "")}>
        <div className="modal-background"></div>
        <div className="modal-card">
            <header className="modal-card-head">
                <p className="modal-card-title">Générer 50 dots aléatoires</p>
                <button className="delete" aria-label="close" onClick={closeModalDummy}/>
            </header>
            <footer className="modal-card-foot">
                <button className='button' onClick={closeModalDummy}>
                    <i className='fa-light fa-arrow-left'/>
                    Annuler
                </button>
                <button className="button is-link" onClick={dummyDot}>
                    <i className='fa-light fa-shuffle'/>
                    Générer des données
                </button>
            </footer>
        </div>
      </div>
    </Fragment>
  )
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Dots);