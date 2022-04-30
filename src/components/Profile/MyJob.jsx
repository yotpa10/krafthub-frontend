import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import JobsServiceAPI from "../../api/services/Jobs/JobsService";
import AvailabilitiesServiceAPI from "../../api/services/Availabilities/AvailabilitiesService";
import Wrapper from "./Wrapper";

const MyJob = () => {
  const { register, handleSubmit } = useForm();
  const [myJobs, setMyJobs] = useState(null);
  const [jobs, setJobs] = useState(null);
  const [jobTypes, setJobTypes] = useState(null);
  const [savingMessage, setSavingMessage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
 	const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
  
  const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsSelected(true);
	};
  
  
  const handleSubmission = () => {
		const formData = new FormData();

		formData.append('File', selectedFile);

        fetch(
          'https://freeimage.host/api/1/upload?key=<YOUR_API_KEY>',
          {
            method: 'POST',
            body: formData,
          }
        )
          .then((response) => response.json())
          .then((result) => {
            console.log('Success:', result);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
	};
  
  const onSubmit = ({ jobType: job_id, time_in, time_out, amount, file_path }) => {
    const image = file_path;
    console.log(image);

    
    setLoading(true);
    JobsServiceAPI.saveAvailability({ job_id, time_in, time_out, amount})
      .then((response) => {
        setSavingMessage({responseType: "success",  message: response.message})
        AvailabilitiesServiceAPI.getMyJobs().then(({ results }) => {
          setMyJobs(results);
        });
                 
      })
      .catch(({ response }) => {
        if (response?.data?.message !== undefined) {
          setSavingMessage({responseType: "danger",  message: response.data.message});
        }
      }).finally(() => {
        setLoading(false)
      });
  };

  useEffect(() => {
    AvailabilitiesServiceAPI.getMyJobs().then(({ results }) => {
      setMyJobs(results);
    });

    JobsServiceAPI.get().then(({ results }) => {
      setJobs(results);
    })
  }, []);

  return (
    <>
      <Wrapper>
        <Card className="mb-4">
          <Card.Body>
            <Card.Title >
              <strong className="pl-3">Add Job</strong>
            </Card.Title>
            <Form onSubmit={handleSubmit(onSubmit)}>
              {
                savingMessage && <Alert variant={savingMessage.responseType} onClose={() => setSavingMessage(null)} dismissible>
                  <p>{savingMessage.message}</p>
                </Alert>
              }

              <Form.Group className="mb-3">
                <select defaultValue="" className="form-select" {...register("job")} onChange={onJobSearch}>
                  <option value="" disabled >Choose a Profession</option>
                  {
                    jobs && jobs.map((job, index) => {
                      return <option key={`job-${index}`} value={job.id}>{job.title}</option>
                    })
                  }
                </select>
              </Form.Group>

              <Form.Group className="mb-3">
                <select defaultValue="" className="form-select" {...register("jobType")}>
                  <option value="" disabled >Choose a Specialist</option>
                  {
                    jobTypes && jobTypes.map((job, index) => {
                      return <option key={`jobtype-${index}`} value={job.id}>{job.title}</option>
                    })
                  }
                </select>
              </Form.Group>

              <Form.Group className="mb-3">
                <input type="text" className="form-control" placeholder="Time In - HH:MM AM/PM" {...register("time_in")} />
              </Form.Group>

              <Form.Group className="mb-3">
                <input type="text" className="form-control" placeholder="Time out - HH:MM AM/PM" {...register("time_out")} />
              </Form.Group>
              
               <Form.Group className="mb-3">
                <input type="text" className="form-control" placeholder="Payment (0.00)" {...register("amount")} />
              </Form.Group>
              
              <Form.Group className="mb-3">
                                  <div>
                                                                  <input type="file" name="file" onChange={changeHandler} />
                                                                  {isSelected ? (
                                                                    <div>
                                                                      <p>Filename: {selectedFile.name}</p>
                                                                      <p>Filetype: {selectedFile.type}</p>
                                                                      <p>Size in bytes: {selectedFile.size}</p>
                                                                      <p>
                                                                        lastModifiedDate:{' '}
                                                                        {selectedFile.lastModifiedDate.toLocaleDateString()}
                                                                      </p>
                                                                    </div>
                                                                  ) : (
                                                                    <p>Select a file to show details</p>
                                                                  )}
                                                                  <div>
                                                                    <button onClick={handleSubmission}>Submit</button>
                                                                  </div>
                                                                </div>
                                
               </Form.Group>
              
          

              <Button variant="primary" type="submit" disabled={loading}>
                Save
              </Button>
            </Form>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <Card.Title>My Jobs</Card.Title>
            <table className="table table-responsive table-condensed table-striped table-hover">
              <thead>
                <tr>
                  <th>Job Type</th>
                  <th>Job</th>
                  <th>Availability</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {
                  myJobs !== null && myJobs.length > 0
                  ? myJobs.map((job) => {
                    return (
                        <tr>
                          <td>{job.profession}</td>
                          <td>{job.specialty}</td>
                          <td>{job.time_in} to {job.time_out}</td>
                          <td>{job.amount}</td>
                          {/* <td><Button variant="danger"><i className="fas fa-trash"></i></Button></td> */}
                        </tr>
                      )
                    })
                  : <td colSpan={3}>You have no jobs yet</td>
                }
              </tbody>
            </table>
          </Card.Body>
        </Card>
      </Wrapper>
    </>
  );
};

export default MyJob;
