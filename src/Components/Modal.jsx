import React, { useContext } from 'react'
import { ModalContext } from '../Helpers/modal.context'
import Button from './Button'
import Zoom from 'react-reveal/Zoom'

export default function Modal() {
    const modalContext = useContext(ModalContext)
    if (modalContext.active) {
        return (
            <div className="modalContainer flex aic jcc fdc">
                <Zoom duration={500}>
                    <div className="modal flex aic jcc fdc">
                        <h3 style={{marginBottom: 10}}>{modalContext.title || "🚨"}</h3>
                        <p className="fontOpen" style={{fontWeight: "bold"}}>
                            {modalContext.text}
                        </p>
                        <div className="flex aic jcc" style={{gap: 40, marginTop: 20}}>
                            <Button size={"small"} onClick={() => {
                                modalContext.update({
                                    active: false,
                                    title: null,
                                    text: null,
                                    onClick: null
                                })
                            }}>
                                Cancel
                            </Button>
                            {modalContext.onClick
                                ? <Button size={"small"} onClick={() => {
                                    modalContext.onClick()
                                    modalContext.update({
                                        active: false,
                                        title: null,
                                        text: null,
                                        onClick: null
                                    })
                                }}>
                                    Yes
                                </Button>
                                : null
                            }
                        </div>
                    </div>
                </Zoom>
            </div>
        )
    } else {
        return (
            null
        )
    }
}
