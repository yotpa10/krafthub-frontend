import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { Card, Button, Modal, Form } from "react-bootstrap";
import Wrapper from "./Wrapper";
import UserServiceAPI from "../../api/services/Users/UsersService";
import * as dayjs from 'dayjs'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Admin = () => {
 const STATUS_ATTR = {
    1: {color: 'text-info', msg: "User level"},
    4: {color: 'text-warning', msg: "Admin"},
    0: {color: 'text-danger', msg: "Inactive"},
  }
  const [show, setShow] = useState(false);
  const [scheduledBookings, setScheduledBookings] = useState(null);
  const [bookingState, setBookingState] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  

  const handleClose = () => {
    setShow(false)
    setBookingState(null)
    setBookingId(null);
  };

  const handleShow = ({bookingId, status}) => {
    setShow(true)
    setBookingState(status)
    
    console.log(bookingState);
    setBookingId(bookingId);
  };

  const loadScheduledBooking = () => {
      UserServiceAPI.getAllUsers().then(({ results }) => {
      
        console.log(results);
        setScheduledBookings(results);
      
      
    })
  }
  
  const onChangeStatus = () => {
    BookingsServiceAPI.updateBookingStatus({
      id: bookingId,
      status: bookingState,
    }).then((data) => {
      toast.success(data.message);
      handleClose();
      loadScheduledBooking()
    })
  }

  useEffect(() => {
    loadScheduledBooking()
  }, []);

  return (
    <>
      <Wrapper>
                               

        <Card className="mb-4">
         <div id="divToPrint">
          <Card.Body>
            <Card.Title> User Summary Page </Card.Title>
            <table className="table table-responsive table-condensed table-striped table-hover">
              <thead>
                <tr>
                  <th>Maker</th>
                  <th>Status</th>
                  <th>Schedule</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  scheduledBookings && scheduledBookings.map(({
                    id, first_name, last_name, access_level, email, cellphone_number, created_at, street_name, barangay, city
                  }) => {
                    return (<tr>
                      <td>{first_name} {last_name}</td>
                      <td><span className={STATUS_ATTR[access_level].color}>{STATUS_ATTR[access_level].msg}</span></td>
                      <td>{dayjs(created_at).format('MMMM DD, YYYY HH:mm')}</td>
                      <td>{street_name} {barangay} {city}</td>
                      <td>{email}</td>
                      <td>{cellphone_number}</td>
                      <td>
                        <div className="btn-group">
                            <Button disabled={access_level === '1' ? true : false} onClick={() => handleShow({bookingId: bookingid, status: "0"})} variant="danger" ><i className="fas fa-times"></i></Button>
                            <Button disabled={access_level === '0' ? false : true} onClick={() => handleShow({bookingId: bookingid, status: "1"})} variant="warning" ><i className="fas fa-check"></i></Button>
                            
                              </div>
                      </td>
                    </tr>)
                  })
                }
                
              </tbody>
            </table>
          </Card.Body>
         </div>
        </Card>
         
         
      </Wrapper>
      <BookingModal show={show} handleClose={handleClose} status={STATUS_ATTR?.[bookingState]?.msg} onChangeStatus={onChangeStatus} />
    </>
  );
};

const BookingModal = ({ show, handleClose, status, onChangeStatus }) => {
  return ReactDOM.createPortal(
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>User Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to set this user to <b>{status}</b>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => onChangeStatus()}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>,
    document.getElementById('modal')
  );
}

export default Admin;
