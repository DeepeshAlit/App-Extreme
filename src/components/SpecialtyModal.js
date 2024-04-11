import React, { useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const SpecialtyModal = ({ show, handleClose, handleSave,selectedSpecialty, handleChange,speciality,setSpeciality,specialtyError,darkMode,duplicateError }) => {
   useEffect(() => {
    if (selectedSpecialty) {
        setSpeciality({
            ...speciality,
            SpecialityName:selectedSpecialty.SpecialityName,
            Description:selectedSpecialty.Description
        })
    }
}, [selectedSpecialty]);
   
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}>
                <Modal.Title>{selectedSpecialty ? 'Edit' : 'Add'} Specialty</Modal.Title>
            </Modal.Header>
            <Modal.Body className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}>
                <Form>
                    <Form.Group controlId="SpecialityName">
                        <Form.Label>Specialty Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={speciality.SpecialityName}
                            onChange={handleChange}
                            name="SpecialityName"
                            className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}
                        />
                          <p style={{ fontSize: "x-small", color: "red" }}>{specialtyError.SpecialityName ? "Please Enter Name" : ""}</p>
                          <p style={{ fontSize: "x-small", color: "red" }}>{duplicateError ? "This Item Already Exist" : ""}</p>
                    </Form.Group>
                    <Form.Group controlId="Description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            value={speciality.Description}
                            onChange={handleChange}
                            name="Description"
                            className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}
                        />
                        <p style={{ fontSize: "x-small", color: "red" }}>{specialtyError.Description ? "Please Enter Description" : ""}</p>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SpecialtyModal;