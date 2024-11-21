// import React, { useEffect, useState } from 'react';
// import { Button, Modal, Form, Card, Row, Col } from 'react-bootstrap';
// import axios from 'axios';
//  import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
//  import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Swal from 'sweetalert2';

// function BannerText() {
//     const [show, setShow] = useState(false);
//     const [formData, setFormData] = useState({
//         text: ''
//     });
//     const [faqs, setFaqs] = useState([]);
//     const [currentFaqId, setCurrentFaqId] = useState(null);

//     const showAutoCloseAlert = (message) => {
//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           title: message,
//           showConfirmButton: false,
//           timer: 1500,
//         });
//       };
    
//       const showAutoError = (message) => {
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: message,
//           showConfirmButton: false,
//           timer: 3000,
//         });
//       };

//     const fetchFaqs = async () => {
//         try {
//             const token = localStorage.getItem('admin_token');
//             const response = await axios.get('http://35.200.147.33/api/admin/bannertext', {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             setFaqs(response.data);
//         } catch (error) {
//             console.error('Error fetching FAQs:', error);
//         }
//     };

//     useEffect(() => {
//         fetchFaqs();
//     }, []);

//     const handleShow = () => {
//         setShow(true);
//         setFormData({ text: '' });
//         setCurrentFaqId(null);
//     };

//     const handleClose = () => setShow(false);

//     const handlePostData = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: value,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const token = localStorage.getItem('admin_token');
//         const url = currentFaqId
//             ? `http://35.200.147.33/api/admin/banner_update/${currentFaqId}`
//             : 'http://35.200.147.33/api/admin/banner_create';

//         try {
//             const response = await axios[currentFaqId ? 'patch' : 'post'](url, formData, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (currentFaqId) {
//                 setFaqs((prevFaqs) =>
//                     prevFaqs.map((faq) =>
//                         faq._id === currentFaqId ? { ...faq, ...formData } : faq
//                     )
//                 );
//             } else {
//                 setFaqs((prevFaqs) => [...prevFaqs, { _id: response.data._id, ...formData }]);
//             }
//             await fetchFaqs();
//             handleClose();
//         } catch (error) {
//             console.error('Error saving FAQ:', error.response ? error.response.data : error);
//             showAutoError('Failed to save FAQ. Please try again.');
//         }
//     };

  

//     const handleEdit = (id) => {
//         const faq = faqs.find((item) => item._id === id);
//         if (faq) {
//             setFormData({
//                 question: faq.question,
//                 answer: faq.answer,
//             });
//             setCurrentFaqId(id);
//             setShow(true);
//         }
//     };

//     return (
//         <DashboardLayout>
//             <DashboardNavbar />
//              <div>
//             {/* <Button variant="primary" onClick={handleShow} style={{ marginBottom: '10px' }}>
//                 Add FAQ
//             </Button> */}

//             <Modal show={show} onHide={handleClose} centered>
//                 <Modal.Header closeButton>
//                     <Modal.Title>{currentFaqId ? "Edit FAQ" : "Add FAQ"}</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form onSubmit={handleSubmit}>
//                         <Form.Group controlId="formQuestion">
//                             <Form.Label>Text</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 placeholder="Enter your question"
//                                 value={formData.text}
//                                 onChange={handlePostData}
//                                 name="text"
//                                 required
//                             />
//                         </Form.Group>
                        
//                         <Modal.Footer>
//                             <Button variant="primary" type="submit">
//                                 {currentFaqId ? 'Update' : 'Submit'}
//                             </Button>
//                             <Button variant="secondary" onClick={handleClose}>
//                                 Close
//                             </Button>
//                         </Modal.Footer>
//                     </Form>
//                 </Modal.Body>
//             </Modal>

//             <Row xs={1} sm={2} md={3} className="g-4">
//                 {faqs.map((faq, index) => (
//                     <Col key={faq._id}>
//                         <Card style={{ height: '100%', borderRadius: '5px', backgroundColor: "#c5c5c5eb", color: "black" }}>
//                             <Card.Body>
//                                 {/* Add white-space: pre-wrap style to preserve line breaks */}
//                                 <Card.Text style={{ whiteSpace: 'pre-wrap' }}>{faq.text}</Card.Text>
//                                 <div className="d-flex">
//                                     <Button onClick={() => handleEdit(faq._id)} style={{ backgroundColor: 'black', border: 'none', marginRight: '5px' }}>
//                                         <i className="bi bi-pencil-square"></i>
//                                     </Button>
                                    
//                                 </div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 ))}
//             </Row>
//         </div>
//         </DashboardLayout>
//     );
// }

// export default BannerText;


import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Swal from 'sweetalert2';

function BannerText() {
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        text: ''
    });
    const [faqs, setFaqs] = useState([]);
    const [currentFaqId, setCurrentFaqId] = useState(null);

    const showAutoCloseAlert = (message) => {
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: message,
            showConfirmButton: false,
            timer: 1500,
        });
    };

    const showAutoError = (message) => {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: message,
            showConfirmButton: false,
            timer: 3000,
        });
    };

    const fetchFaqs = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await axios.get('http://35.200.147.33/api/admin/bannertext', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFaqs(response.data);
        } catch (error) {
            console.error('Error fetching text:', error);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const handleShow = () => {
        setShow(true);
        setFormData({ text: '' });
        setCurrentFaqId(null);
    };

    const handleClose = () => setShow(false);

    const handlePostData = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('admin_token');
        const url = currentFaqId
            ? `http://35.200.147.33/api/admin/banner_update/${currentFaqId}`
            : 'http://35.200.147.33/api/admin/banner_create';

        try {
            const response = await axios[currentFaqId ? 'patch' : 'post'](url, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (currentFaqId) {
                setFaqs((prevFaqs) =>
                    prevFaqs.map((faq) =>
                        faq._id === currentFaqId ? { ...faq, ...formData } : faq
                    )
                );
            } else {
                setFaqs((prevFaqs) => [...prevFaqs, { _id: response.data._id, ...formData }]);
            }
            showAutoCloseAlert("text updated successfully!");
            await fetchFaqs();
            handleClose();
        } catch (error) {
            console.error('Error saving FAQ:', error.response ? error.response.data : error);
            showAutoError('Failed to save text. Please try again.');
        }
    };

    const handleEdit = (id) => {
        const faq = faqs.find((item) => item._id === id);
        if (faq) {
            setFormData({
                text: faq.text, // Set the current text for editing
            });
            setCurrentFaqId(id);
            setShow(true);
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <div>
                {/* <Button variant="primary" onClick={handleShow} style={{ marginBottom: '10px' }}>
                    Add FAQ
                </Button> */}

                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{currentFaqId ? "Edit FAQ" : "Add FAQ"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formText">
                                <Form.Label>Text</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your text"
                                    value={formData.text}
                                    onChange={handlePostData}
                                    name="text"
                                    required
                                />
                            </Form.Group>
                            <Modal.Footer>
                                <Button variant="primary" type="submit">
                                    {currentFaqId ? 'Update' : 'Submit'}
                                </Button>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Row xs={1} sm={2} md={3} className="g-4">
                    {faqs.map((faq, index) => (
                        <Col key={faq._id}>
                            <Card style={{ height: '100%', borderRadius: '5px', backgroundColor: "#c5c5c5eb", color: "black" }}>
                                <Card.Body>
                                    <Card.Text style={{ whiteSpace: 'pre-wrap' }}>{faq.text}</Card.Text>
                                    <div className="d-flex">
                                        <Button onClick={() => handleEdit(faq._id)} style={{ backgroundColor: 'black', border: 'none', marginRight: '5px' }}>
                                            <i className="bi bi-pencil-square"></i>
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </DashboardLayout>
    );
}

export default BannerText;

