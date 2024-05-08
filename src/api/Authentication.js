import {Modal} from 'react-bootstrap'
import {useEffect, useStatus} from 'react'
function Authentication(){

       const [authentication, setAuthentication] = useStatus(false)

       useEffect((token) => {
            if(token === null){

                navigate('/')
            }
        }, []);
        return(
            <Modal show={authentication}>
            <Modal.Body>

            </Modal.Body>
            </Modal>
        )
}

