import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import SpecialtyModal from './SpecialtyModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const SpecialtyList = ({darkMode}) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [specialties, setSpecialties] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const initialData = {
        SpecialityName: '',
        Description: ''
    }
    const [speciality, setSpeciality] = useState(initialData);
    const initialErrors = {
        SpecialityName: false,
        Description: false
    }
    const [specialtyError, setSpecialtyError] = useState(initialErrors)
    const [errors, setErrors] = useState({
        SpecialityName: false,
        Description: false
    })
    const [deleteSpecialtyId,setDeleteSpecialtyId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
    const [inUseError,setInUseError] = useState(false)
    const deleteMessage = "Are you sure you want to delete this Specialty?"
    const [duplicateError,setDuplicateError] = useState(false)


    useEffect(() => {
        if (!token) {
            navigate('/')
        }
    }, [])

    const getSpecialityList = async () => {
        try {
            const response = await axios.get('https://localhost:7137/api/Speciality/GetList', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const specialities = response.data;
            setSpecialties(specialities)
            console.log('Speciality list:', specialities);
        } catch (error) {
            console.error('Error fetching speciality list:', error.message);
        }
    }

    useEffect(() => {
        getSpecialityList();
    }, [])

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSpecialty(null);
        setSpecialtyError(initialErrors)
        setSpeciality(initialData)
        setDuplicateError(false)
    };

    const handleAddClick = () => {
        setIsModalOpen(true);
    };

    const validateSpecialty = () => {
        debugger
        let hasError = false;
        const newErrors = {};

        for (const key in speciality) {
            if (!speciality[key]) {
                newErrors[key] = true;
                hasError = true;
            } else {
                newErrors[key] = false;
            }
        }

        setSpecialtyError(newErrors);

        return hasError;
    };

    const handleSave = async () => {
        debugger
        if (validateSpecialty()) {
            return;
        }
        if (selectedSpecialty) {
            const updatedData = {

                specialityID: selectedSpecialty?.SpecialityID,
                specialityName: speciality?.SpecialityName,
                isGynac: false,
                description: speciality?.Description

            }
            try {
                const response = await axios.put(`https://localhost:7137/api/Speciality/Update/`, updatedData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                getSpecialityList();
                console.log('Speciality updated successfully:');
                handleCloseModal();
            } catch (error) {
                console.error('Error updating speciality:', error.message);
                if (error.response.data.includes("Cannot accept duplicate speciality name.") ){
                    setDuplicateError(true);
                }
            }
        } else {
            try {
                // Add new Specialty
                const data = {
                    "specialityName": speciality.SpecialityName,
                    "description": speciality.Description
                }
                const response = await axios.post('https://localhost:7137/api/Speciality/Insert', data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const resData = response.data;
                getSpecialityList();
                console.log('Speciality inserted successfully:', resData);
                handleCloseModal();
            } catch (error) {
                console.error('Error inserting speciality:', error.message);
                if (error.response.data.includes("Cannot accept duplicate speciality name.") ){
                    setDuplicateError(true);
                }
            }
        }
        
    };

    const handleEditClick = (specialt) => {
        setSelectedSpecialty(specialt);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async(id) => {
        setDeleteSpecialtyId(id)
        setIsDeleteModalOpen(true); 
      };

    const handleDeleteConfirmed = async () => {
        try {
            const response = await axios.delete(`https://localhost:7137/api/Speciality/Delete/${deleteSpecialtyId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            getSpecialityList();
            setIsDeleteModalOpen(false); 
        } catch (error) {
            console.error('Error deleting item:', error.response.data);
            if (error.response.data.includes("Selected record exists in Doctors.") ){
                    setInUseError(true)
            }
            
        }
      };

    const handleChange = (e) => {
        setDuplicateError(false)
        const { name, value } = e.target;
        setSpeciality(prevState => ({
            ...prevState,
            [name]: value
        }));
        setSpecialtyError({
            ...specialtyError, [name]: false
        })
    };

    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false); 
        setInUseError(false)
      };

    return (
        <div className="container " style={{ height: "100vh" }}>
            <div className="w-100 d-flex justify-content-between my-2">
                <h3>Specialty List</h3>
                <Button variant="primary" onClick={handleAddClick}>
                    Add
                </Button>
            </div>
            <Table striped bordered hover variant={darkMode?"dark":"light"}>
                <thead>
                    <tr>
                        <th>S.No.</th>
                        <th>Specialty Name</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {specialties.map((specialt, index) => (
                        <tr key={specialt.id}>
                            <td>{index + 1}</td>
                            <td>{specialt.SpecialityName}</td>
                            <td>{specialt.Description}</td>
                            <td className="d-flex">
                                <Button className="mx-2" variant="info" onClick={() => handleEditClick(specialt)}>
                                    Edit
                                </Button>
                                <Button variant="danger" onClick={() => handleDeleteClick(specialt.SpecialityID)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <SpecialtyModal
                show={isModalOpen}
                handleClose={handleCloseModal}
                handleSave={handleSave}
                handleChange={handleChange}
                speciality={speciality}
                selectedSpecialty={selectedSpecialty}
                errors={errors}
                setErrors={setErrors}
                setSpeciality={setSpeciality}
                specialtyError={specialtyError}
                duplicateError={duplicateError}
                darkMode={darkMode}
            />
            <DeleteConfirmationModal
                show={isDeleteModalOpen}
                handleClose={handleDeleteModalClose}
                handleDelete={handleDeleteConfirmed}
                deleteMessage={deleteMessage}
                darkMode={darkMode}
                inUseError={inUseError}
            />
        </div>
    );
};

export default SpecialtyList;