import React from "react";
import CrudLayoutTile from "./layoutTiles/CrudLayoutTile";

const LayoutPicker = props => {

    const setLayout = e => {
        props.setLayout(e.layout,e.layoutOptions)
    }

    return (
        <div className="box">
            <div className="is-fullwidth">
                <article className="message is-link">
                <div className="message-header">
                    <p>Aucun type de page affecté</p>
                </div>
                <div className="message-body">
                    Aucun type n'est affecté à cette page.
                    Le type d'une page sert à détérminer la fonction de la page ainsi que l'interface qui sera utilisé dessus. 
                    Sélectionnez un type de page pour commencer à utiliser cette page.
                </div>
                </article>
                <div className="layout-picker is-fullwidth">
                    <CrudLayoutTile setLayout={setLayout}/>
                </div>
            </div>
        </div>
    )
}
  
export default LayoutPicker;